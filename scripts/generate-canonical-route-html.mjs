import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import ts from 'typescript';

const baseUrl = 'https://nestarcadia.com';
const distDir = path.resolve('dist');
const template = await readFile(path.join(distDir, 'index.html'), 'utf8');
const sitemap = await readFile(path.join(distDir, 'sitemap.xml'), 'utf8');
const urls = [...sitemap.matchAll(/<loc>\s*(https?:[^<]+)\s*<\/loc>/g)].map((match) => match[1].trim());
const duplicateUrls = urls.filter((url, index) => urls.indexOf(url) !== index);
if (duplicateUrls.length) {
  throw new Error('Sitemap contains duplicate URLs: ' + [...new Set(duplicateUrls)].join(', '));
}

if (!urls.includes(baseUrl + '/')) {
  throw new Error('Canonical route generation stopped: homepage is missing from sitemap.xml');
}

function parseSource(filePath, sourceText) {
  const kind = filePath.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS;
  return ts.createSourceFile(filePath, sourceText, ts.ScriptTarget.Latest, true, kind);
}

function findVariable(sourceFile, variableName) {
  let result = null;
  const visit = (node) => {
    if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.name.text === variableName) {
      result = node.initializer ?? null;
      return;
    }
    if (!result) ts.forEachChild(node, visit);
  };
  visit(sourceFile);
  return result;
}

function propertyName(name) {
  if (ts.isIdentifier(name) || ts.isStringLiteral(name) || ts.isNumericLiteral(name)) return name.text;
  return null;
}

function propertyNode(object, name) {
  if (!object || !ts.isObjectLiteralExpression(object)) return null;
  const member = object.properties.find((item) =>
    ts.isPropertyAssignment(item) && propertyName(item.name) === name
  );
  return member && ts.isPropertyAssignment(member) ? member.initializer : null;
}

function stringValue(node) {
  if (!node) return null;
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return node.text;
  return null;
}

function propertyString(object, name) {
  return stringValue(propertyNode(object, name));
}

function firstCallStringArgument(node) {
  if (!node || !ts.isCallExpression(node) || node.arguments.length === 0) return null;
  return stringValue(node.arguments[0]);
}

function arrayStringValues(node) {
  if (!node || !ts.isArrayLiteralExpression(node)) return [];
  return node.elements.map(stringValue).filter((value) => typeof value === 'string' && value.trim().length > 0);
}

function arrayObjectValues(node, fields) {
  if (!node || !ts.isArrayLiteralExpression(node)) return [];
  return node.elements.filter(ts.isObjectLiteralExpression).map((entry) => {
    const result = {};
    for (const field of fields) result[field] = propertyString(entry, field) || '';
    return result;
  }).filter((entry) => Object.values(entry).some((value) => value.trim().length > 0));
}

function escapeHtmlText(value) {
  return String(value ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function titleCaseSlug(slug) {
  return slug.split('-').filter(Boolean).map((part) => {
    if (/^(ncr|nri|2bhk|3bhk|4bhk|5bhk|vastu|jaali)$/i.test(part)) return part.toUpperCase();
    return part.charAt(0).toUpperCase() + part.slice(1);
  }).join(' ');
}

function shortenDescription(value, limit = 158) {
  const normalized = String(value || '').replace(/\s+/g, ' ').trim();
  if (normalized.length <= limit) return normalized;
  const trimmed = normalized.slice(0, limit - 1);
  const lastSpace = trimmed.lastIndexOf(' ');
  return (lastSpace > 100 ? trimmed.slice(0, lastSpace) : trimmed).trimEnd() + '…';
}

function escapeAttribute(value) {
  return String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function replaceTag(html, pattern, replacement, insertBeforeHeadEnd = true) {
  const flags = pattern.flags.includes('g') ? pattern.flags : pattern.flags + 'g';
  const globalPattern = new RegExp(pattern.source, flags);
  const matches = [...html.matchAll(globalPattern)];
  if (matches.length) {
    let output = html.replace(matches[0][0], replacement);
    for (const duplicate of matches.slice(1)) output = output.replace(duplicate[0], '');
    return output;
  }
  if (!insertBeforeHeadEnd) throw new Error('Required HTML tag missing: ' + pattern);
  return html.replace('</head>', replacement + '\n  </head>');
}

function replaceMeta(html, selectorPattern, attribute, value, fallbackTag) {
  const safeValue = escapeAttribute(value);
  const flags = selectorPattern.flags.includes('g') ? selectorPattern.flags : selectorPattern.flags + 'g';
  const matches = [...html.matchAll(new RegExp(selectorPattern.source, flags))];
  if (!matches.length) return html.replace('</head>', fallbackTag.replace('__VALUE__', safeValue) + '\n  </head>');
  const tag = matches[0][0];
  const attributePattern = new RegExp('\\b' + attribute + '="[^"]*"');
  const changed = attributePattern.test(tag)
    ? tag.replace(attributePattern, attribute + '="' + safeValue + '"')
    : tag.replace(/\s*\/?\s*>$/, ' ' + attribute + '="' + safeValue + '" />');
  let output = html.replace(tag, changed);
  for (const duplicate of matches.slice(1)) output = output.replace(duplicate[0], '');
  return output;
}

async function readSource(filePath) {
  return parseSource(filePath, await readFile(filePath, 'utf8'));
}

const appSource = await readSource('src/App.tsx');
const metaObject = findVariable(appSource, 'pageMeta');
const pageMeta = new Map();
if (metaObject && ts.isObjectLiteralExpression(metaObject)) {
  for (const member of metaObject.properties) {
    if (!ts.isPropertyAssignment(member)) continue;
    const key = propertyName(member.name);
    if (!key || !ts.isObjectLiteralExpression(member.initializer)) continue;
    pageMeta.set(key, {
      title: propertyString(member.initializer, 'title'),
      description: propertyString(member.initializer, 'description'),
    });
  }
}

const servicesSource = await readSource('src/pages/LocalService/LocalServicePage.tsx');
const serviceMeta = new Map();
// Read both the primary and additional location configs so every residential service
// route gets its own accurate title, description and static HTML content snapshot.
for (const arrayName of ['localServicePages', 'additionalLocationPages']) {
  const servicesArray = findVariable(servicesSource, arrayName);
  if (!servicesArray || !ts.isArrayLiteralExpression(servicesArray)) continue;
  for (const entry of servicesArray.elements) {
    if (!ts.isObjectLiteralExpression(entry)) continue;
    const route = propertyString(entry, 'path');
    const title = propertyString(entry, 'title');
    const description = propertyString(entry, 'description');
    const imageId = firstCallStringArgument(propertyNode(entry, 'heroImage'));
    if (!route || !title || !description) continue;
    serviceMeta.set(route, {
      path: route,
      title,
      description,
      imageId,
      type: 'service',
      eyebrow: propertyString(entry, 'eyebrow') || '',
      introLabel: propertyString(entry, 'introLabel') || '',
      introTitle: propertyString(entry, 'introTitle') || '',
      intro: propertyString(entry, 'intro') || '',
      insights: arrayObjectValues(propertyNode(entry, 'insights'), ['title', 'body']),
      services: arrayStringValues(propertyNode(entry, 'services')),
      fit: arrayStringValues(propertyNode(entry, 'fit')),
      process: arrayStringValues(propertyNode(entry, 'process')),
      faqs: arrayObjectValues(propertyNode(entry, 'faqs'), ['question', 'answer']),
      related: arrayObjectValues(propertyNode(entry, 'related'), ['href', 'label']),
    });
  }
}

const journalSource = await readSource('src/pages/Journal/Journal.tsx');
const articlesArray = findVariable(journalSource, 'articles');
const articleMeta = new Map();
if (articlesArray && ts.isArrayLiteralExpression(articlesArray)) {
  for (const entry of articlesArray.elements) {
    if (!ts.isObjectLiteralExpression(entry)) continue;
    const id = propertyString(entry, 'id');
    const title = propertyString(entry, 'title');
    const description = propertyString(entry, 'excerpt');
    const imageId = firstCallStringArgument(propertyNode(entry, 'img'));
    if (id && title) articleMeta.set(id, {
      id,
      title: title + ' | NestArcadia Journal',
      articleTitle: title,
      description: description || title,
      imageId,
      type: 'article',
      category: propertyString(entry, 'category') || 'Journal',
      author: propertyString(entry, 'author') || 'NestArcadia',
      readTime: propertyString(entry, 'readTime') || '',
      body: arrayStringValues(propertyNode(entry, 'body')),
      related: arrayStringValues(propertyNode(entry, 'related')),
      datePublished: propertyString(entry, 'publishedAt'),
      dateModified: propertyString(entry, 'updatedAt') || propertyString(entry, 'publishedAt'),
    });
  }
}


const publishedArticleSnapshot = JSON.parse(await readFile(
  path.resolve('src/data/seo/luxury-interior-design-noida-extension.json'),
  'utf8'
));
if (publishedArticleSnapshot?.id && Array.isArray(publishedArticleSnapshot.blocks)) {
  articleMeta.set(publishedArticleSnapshot.id, {
    id: publishedArticleSnapshot.id,
    title: publishedArticleSnapshot.title + ' | NestArcadia Journal',
    articleTitle: publishedArticleSnapshot.title,
    imageId: publishedArticleSnapshot.imageId || null,
    description: publishedArticleSnapshot.excerpt,
    type: 'article',
    category: publishedArticleSnapshot.category || 'Journal',
    author: publishedArticleSnapshot.author || 'NestArcadia',
    readTime: publishedArticleSnapshot.readTime || '',
    body: publishedArticleSnapshot.blocks.map((block) => block.text).filter(Boolean),
    bodyBlocks: publishedArticleSnapshot.blocks,
    related: [],
    datePublished: publishedArticleSnapshot.publishedAt || null,
    dateModified: publishedArticleSnapshot.updatedAt || publishedArticleSnapshot.publishedAt || null,
  });
}

const mainRouteMeta = new Map([
  ['/', pageMeta.get('home')],
  ['/design-cultures', pageMeta.get('cultures')],
  ['/interior-design-services', pageMeta.get('services')],
  ['/our-story', pageMeta.get('story')],
  ['/journal', pageMeta.get('journal')],
  ['/our-projects', pageMeta.get('homes')],
  ['/start-your-project', pageMeta.get('project')],
  ['/faqs', pageMeta.get('faq')],
  ['/privacy-policy', pageMeta.get('privacy')],
  ['/terms', pageMeta.get('terms')],
  ['/contact', pageMeta.get('contact')],
]);

function routeMetadata(pathname) {
  const main = mainRouteMeta.get(pathname);
  if (main?.title && main?.description) {
    if (pathname === '/interior-design-services') {
      return { ...main, type: 'service', area: 'Noida Extension and Greater Noida West' };
    }
    return { ...main, type: 'website' };
  }
  const service = serviceMeta.get(pathname);
  if (service) return { ...service, title: service.title + ' | NestArcadia' };
  if (pathname.startsWith('/journal/')) {
    const slug = pathname.slice('/journal/'.length).replace(/\/$/, '');
    const article = articleMeta.get(slug);
    const journalSeoOverrides = {
      'luxury-interior-design-noida-extension': {
        title: 'Luxury Interior Design in Noida Extension: Planning Guide | NestArcadia Journal',
        description: 'A practical guide to high-end 3BHK and 4BHK apartment interiors in Noida Extension, covering spatial planning, finish selection and smart-home considerations.',
      },
    };
    const override = journalSeoOverrides[slug];
    if (article) return { ...article, ...(override || {}) };
    const title = titleCaseSlug(slug);
    return {
      title: title + ' | NestArcadia Journal',
      description: 'Practical interior design ideas, material guidance and planning advice for homes in Noida, Greater Noida and NCR: ' + title + '.',
      type: 'article',
      ...(override || {}),
    };
  }
  if (pathname.startsWith('/interior-design-') || pathname.startsWith('/commercial-interior-design-')) {
    const slug = pathname.replace(/^\//, '').replace(/^commercial-interior-design-/, '').replace(/^interior-design-/, '');
    const area = titleCaseSlug(slug);
    const title = pathname.startsWith('/commercial-')
      ? 'Commercial Interior Design in ' + area
      : 'Interior Design in ' + area;
    return {
      title: title + ' | NestArcadia',
      description: 'Residential and commercial interior design, space planning and turnkey execution in ' + area + ', with project scope tailored to the property and client brief.',
      type: 'service',
    };
  }
  const fallback = titleCaseSlug(pathname.replace(/^\//, '').replace(/\/$/, '')) || 'NestArcadia';
  return {
    title: fallback + ' | NestArcadia',
    description: 'Explore NestArcadia interior design services, practical planning advice and project information for Noida, Greater Noida and Delhi NCR.',
    type: 'website',
  };
}

const escapeText = escapeHtmlText;
const staticRootStyle = 'max-width:1100px;margin:0 auto;padding:104px 24px 80px;font-family:Arial,sans-serif;line-height:1.75;color:#1C3A5A;background:#F2EDE4';
const staticHeadingStyle = 'font-family:Georgia,serif;font-weight:500;line-height:1.12;color:#1A1714;margin:0 0 18px';
const staticSectionStyle = 'margin:38px 0 0';
const staticParagraphStyle = 'margin:0 0 16px;font-size:16px;line-height:1.8;color:#52677E';
// Every published NCR location page, grouped. Mirrors `areaGroups` in
// src/pages/LocalService/localServicePaths.ts (the browser footer and Services
// page use that file). Crawlers and non-JS agents only ever see this snapshot,
// so every route must link the full set here, not just the original 4 markets.
const siteAreaGroups = [
  { title: 'Noida & Greater Noida', areas: [
    ['Noida Extension', '/interior-design-noida-extension/'], ['Greater Noida West', '/interior-design-greater-noida-west/'],
    ['Noida', '/interior-design-noida/'], ['Greater Noida', '/interior-design-greater-noida/'] ] },
  { title: 'Ghaziabad & East NCR', areas: [
    ['Ghaziabad', '/interior-design-ghaziabad/'], ['Indirapuram', '/interior-design-indirapuram/'],
    ['Crossing Republik', '/interior-design-crossing-republik/'], ['East Delhi', '/interior-design-east-delhi/'] ] },
  { title: 'Delhi & Gurugram', areas: [
    ['Delhi', '/interior-design-delhi/'], ['South Delhi', '/interior-design-south-delhi/'],
    ['Gurugram', '/interior-design-gurugram/'], ['Faridabad', '/interior-design-faridabad/'] ] },
  { title: 'Expanding NCR corridor', areas: [
    ['Dadri', '/interior-design-dadri/'], ['Jewar', '/interior-design-jewar/'], ['Yamuna Expressway', '/interior-design-yamuna-expressway/'] ] },
];

const staticLinkStyle = 'color:#1C3A5A;text-decoration:underline;text-underline-offset:3px;font-weight:600';
const inlineLink = (href, label) => '<a style="' + staticLinkStyle + '" href="' + escapeAttribute(href) + '">' + escapeText(label) + '</a>';
const staticList = (items, ordered = false) => {
  if (!items?.length) return '';
  const tag = ordered ? 'ol' : 'ul';
  const listStyle = ordered ? 'padding-left:24px;margin:0 0 18px' : 'padding-left:22px;margin:0 0 18px';
  return '<' + tag + ' style="' + listStyle + '">' + items.map((item) => '<li style="margin:0 0 9px;color:#52677E">' + escapeText(item) + '</li>').join('') + '</' + tag + '>';
};


const mainPageContent = {
  '/design-cultures': [
    { heading: 'Regional inspiration, interpreted for modern homes', paragraphs: ['Indian interiors are shaped by climate, craft, materials and the ways families use their homes. NestArcadia draws on regional design languages as a source of inspiration, then adapts the details to contemporary layouts and everyday needs.', 'Explore ideas influenced by North, South, East, West and Central India — from warm wood and woven textures to colour, carved details, natural finishes and thoughtful light.'] },
    { heading: 'Design details we consider', bullets: ['Material and finish combinations that suit the room and its use','Craft-inspired screens, woodwork, textiles and surface details','Light, ventilation, furniture scale and circulation','A balanced mix of heritage references and contemporary function'] },
    { heading: 'Bring an idea into your own floor plan', paragraphs: ['A reference image is a starting point, not a ready-made solution. We consider the dimensions, natural light, storage needs and maintenance expectations of your property before translating an inspiration into a practical interior.'], links: [{ href: '/start-your-project/', label: 'Share your project brief' }, { href: '/interior-design-services/', label: 'Explore interior design services' }] },
  ],
  '/interior-design-services': [
    { heading: 'Residential interior design', paragraphs: ['Plan 2BHK, 3BHK and 4BHK apartments, villas and family homes around the floor plan, household routines, storage requirements and budget. The design scope can include furniture layouts, kitchens, wardrobes, lighting, materials and decor.'] },
    { heading: 'Commercial interiors', paragraphs: ['Create functional offices and commercial spaces with considered layouts for reception areas, workstations, meeting rooms, storage, lighting and acoustics. The scope is tailored to the business, site conditions and project brief.'] },
    { heading: 'Design and execution services', bullets: ['Space planning and furniture layouts','Modular kitchens and custom furniture','Wardrobes and integrated storage','Vastu-led layout discussions when requested','Lighting, materials and decor','Turnkey execution coordination from design through handover'] },
    { heading: 'Serving Noida and across NCR', paragraphs: ['Noida Extension and Greater Noida West are our primary focus, with Noida and Greater Noida as nearby markets. We also take on residential and commercial projects across Delhi NCR, including Ghaziabad, Delhi, Gurugram, Faridabad, Dadri, Jewar and Yamuna Expressway.'], links: siteAreaGroups.flatMap((g) => g.areas).map(([label, href]) => ({ href, label: 'Interior design in ' + label })).concat([{ href: '/interior-design-delhi-ncr/', label: 'See all of NCR we serve' }]) },
    { heading: 'Start with the property and the scope', paragraphs: ['The right estimate depends on the property condition, measurements, selected materials and work already completed. Share a floor plan and requirements so the scope can be assessed before a proposal is prepared.'], links: [{ href: '/start-your-project/', label: 'Start an interior design project' }, { href: '/interior-design-noida-extension/', label: 'Interior design in Noida Extension' }, { href: '/interior-design-greater-noida-west/', label: 'Interior design in Greater Noida West' }] },
  ],
  '/our-story': [
    { heading: 'A design approach rooted in how people live', paragraphs: ['NestArcadia brings Indian material heritage and contemporary interior planning together. The starting point is not a style label; it is the way a household uses its rooms, stores everyday things, moves through the home and spends time together.', 'Craft, texture and regional references add character when they are used with intention. Space planning, lighting, storage and execution details make that character work in daily life.'] },
    { heading: 'From first brief to finished space', bullets: ['Understand the property, floor plan, routines and priorities','Resolve layout, furniture scale, storage and key services','Develop the design direction, materials and execution details','Coordinate the agreed work and review the finished space'] },
    { heading: 'Design for homes across Noida and NCR', paragraphs: ['NestArcadia focuses on residential and commercial interior requirements across Noida Extension, Greater Noida West, Noida and nearby NCR locations. Each project begins with its own site conditions, brief and agreed scope.'], links: [{ href: '/interior-design-services/', label: 'Explore our services' }, { href: '/start-your-project/', label: 'Talk to NestArcadia' }] },
  ],
  '/our-projects': [
    { heading: 'Selected home concepts and interior design studies', paragraphs: ['Explore a selection of interior design directions for apartments, villas and family homes. The examples illustrate how material palettes, furniture scale, natural light, storage and regional references can shape a coherent living space.', 'The examples are presented as design studies, showing possible design directions rather than claiming every concept is a completed installation.'] },
    { heading: 'What to look for in a well-planned interior', bullets: ['A layout that protects comfortable movement','Storage planned around actual household routines','Materials chosen for appearance, durability and maintenance','Lighting coordinated with furniture and daily activities','Details that connect the rooms into one consistent design'] },
    { heading: 'Have a home or floor plan to discuss?', paragraphs: ['Share your property type, location, possession status and priorities. NestArcadia can help define the next planning steps and the scope required for your home.'], links: [{ href: '/start-your-project/', label: 'Share your project brief' }, { href: '/journal/', label: 'Read practical interior planning guides' }] },
  ],
  '/faqs': [
    {
      heading: 'Working with NestArcadia',
      faqs: [
        { question: 'Which areas does NestArcadia serve?', answer: "NestArcadia's primary service focus is Noida Extension and Greater Noida West, with nearby Noida and Greater Noida as secondary markets. For projects elsewhere in NCR, availability is assessed based on the property's location and scope." },
        { question: 'Do you provide turnkey interior design and execution?', answer: 'Yes. Depending on the project, we can manage the process from planning and design through materials, site execution and final handover.' },
        { question: 'When should I contact an interior designer?', answer: 'Ideally, before possession or before major civil and electrical work begins. Planning early gives you more flexibility with kitchen layouts, wardrobes, storage, lighting and electrical points.' },
      ],
    },
    {
      heading: 'Homes, layouts and budgets',
      faqs: [
        { question: 'Do you design 2BHK, 3BHK and 4BHK interiors?', answer: 'Yes. We work on 2BHK, 3BHK and 4BHK apartments, villas and farmhouses, with the design adapted to the layout, carpet area, storage needs and level of customisation.' },
        { question: 'How much does a 2BHK or 3BHK interior cost in Greater Noida West?', answer: 'For a raw or newly handed-over apartment, a complete interior project typically ranges from ₹5–12 lakh for a 2BHK and ₹7–22 lakh for a 3BHK. If flooring, electrical or some civil work is already completed, the cost may sit at the lower end of the range. More customised furniture, premium materials or extensive décor can increase the budget depending on the scope.' },
        { question: 'Can you plan space-saving interiors for a compact Noida apartment?', answer: 'Yes. We focus on practical circulation, well-planned storage and furniture that fits the actual space, so the home feels useful without feeling overcrowded.' },
      ],
    },
    {
      heading: 'Services and next steps',
      faqs: [
        { question: 'Do you offer Vastu-friendly interior planning?', answer: 'Yes. If Vastu is important to you, we can consider relevant principles alongside practical layout, daylight, movement, storage and everyday functionality.' },
        { question: 'How do I begin an interior design project with NestArcadia?', answer: 'Share your property type, location, possession timeline and what you need from the space. We can then guide you on the right next step.' },
      ],
      links: [{ href: '/start-your-project/', label: 'Share your project brief' }, { href: '/interior-design-services/', label: 'Explore interior design services' }],
    },
  ],
  '/start-your-project': [
    { heading: 'Tell us about your property', paragraphs: ['A useful first brief includes your property location, apartment or villa configuration, approximate area, possession or renovation status, preferred timeline and the rooms or services you want help with.'] },
    { heading: 'What happens next', bullets: ['Review the floor plan, site condition and household requirements','Clarify design scope, priorities and budget direction','Identify the drawings, materials and execution decisions required','Prepare the next-step proposal around the agreed brief'] },
    { heading: 'Make the first conversation useful', paragraphs: ['If you have a floor plan, share it with your enquiry. For a quick starting conversation, you can also contact NestArcadia on WhatsApp at +91 8448061997.'], links: [{ href: 'https://wa.me/918448061997', label: 'Contact NestArcadia on WhatsApp' }, { href: '/interior-design-services/', label: 'Review services before you enquire' }] },
  ],
  '/privacy-policy': [
    { heading: 'What this policy covers', paragraphs: ['NestArcadia respects your privacy. This notice explains what information may be collected through nestarcadia.com, why it is used, the external services involved (including Google Analytics, Google Tag Manager, Supabase and WhatsApp links), and the choices available to you.'] },
    { heading: 'Your choices', bullets: ['Analytics and advertising storage are denied by default and change only when you make a privacy choice','You can reopen Privacy Choices from the control at the bottom-left of the website','You can ask NestArcadia what information it holds, or request correction or deletion, at info@nestarcadia.com'] },
    { heading: 'Related pages', links: [{ href: '/terms/', label: 'Terms of Use' }, { href: '/contact/', label: 'Contact NestArcadia' }] },
  ],
  '/terms': [
    { heading: 'About these terms', paragraphs: ['These Terms of Use apply to your use of nestarcadia.com, operated by NestArcadia, an interior design and turnkey execution studio serving Noida Extension, Greater Noida West and the wider Delhi NCR region.'] },
    { heading: 'Estimates and enquiries', paragraphs: ['Cost ranges, timelines and examples on the website are indicative and are not a quotation or guarantee. A project enquiry does not create a contract; an engagement begins only when scope, fees, payment schedule and timeline are agreed in writing.'] },
    { heading: 'Content, links and liability', bullets: ['Website text, images and designs belong to NestArcadia or its licensors and may not be reused commercially without written permission','Third-party links such as WhatsApp and social media follow their own terms','The website is provided as is, and liability is limited to the extent permitted by Indian law'] },
    { heading: 'Related pages', links: [{ href: '/privacy-policy/', label: 'Privacy Policy' }, { href: '/contact/', label: 'Contact NestArcadia' }, { href: '/our-story/', label: 'About NestArcadia' }] },
  ],
  '/contact': [
    { heading: 'Reach the studio', bullets: ['Phone: +91 84480 61997','WhatsApp: +91 84480 61997','Email: info@nestarcadia.com'], links: [{ href: 'https://wa.me/918448061997', label: 'Message NestArcadia on WhatsApp' }] },
    { heading: 'Visit our office', paragraphs: ['NestArcadia, G-59, Fusion Ufairia Mall, Sector 16B, Greater Noida West, Uttar Pradesh 201310.'] },
    { heading: 'Planning a project?', paragraphs: ['Share your property type, location, possession timeline and what you need from the space.'], links: [{ href: '/start-your-project/', label: 'Start your project' }, { href: '/our-story/', label: 'About NestArcadia' }] },
  ],
};

function renderSiteAreaNav() {
  const groups = siteAreaGroups.map((group) =>
    '<div><p style="margin:0 0 8px;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#6B5E4E">' + escapeText(group.title) + '</p><ul style="margin:0;padding:0;list-style:none">' +
    group.areas.map(([label, href]) => '<li style="margin:0 0 6px">' + inlineLink(href, label) + '</li>').join('') + '</ul></div>'
  ).join('');
  return '<footer style="margin-top:48px;padding-top:24px;border-top:1px solid #D4CBBB"><nav aria-label="NestArcadia service areas" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:24px">' +
    groups + '</nav><p style="margin:20px 0 0">' + inlineLink('/interior-design-delhi-ncr/', 'See all of NCR we serve') + ' · ' +
    inlineLink('/interior-design-services/', 'Our services') + ' · ' + inlineLink('/start-your-project/', 'Start your project') + '</p>' +
    '<nav aria-label="About, contact and legal" style="margin:20px 0 0;font-size:14px">' +
    [['/our-story/', 'About Us'], ['/contact/', 'Contact'], ['/terms/', 'Terms of Use'], ['/privacy-policy/', 'Privacy Policy']]
      .map(([href, label]) => inlineLink(href, label)).join(' · ') + '</nav></footer>';
}

function renderStaticRoute(pathname, metadata) {
  const body = renderStaticRouteBody(pathname, metadata);
  return body.replace(/<\/main>$/, renderSiteAreaNav() + '</main>');
}

function renderStaticRouteBody(pathname, metadata) {
  const heading = (metadata.articleTitle || metadata.title || 'NestArcadia').replace(/\s*\|\s*NestArcadia(?: Journal)?\s*$/i, '');
  const header = '<header><p style="margin:0 0 10px;color:#17665B;font-size:12px;letter-spacing:.18em;text-transform:uppercase">' +
    escapeText(metadata.eyebrow || 'NestArcadia · Interior Design') + '</p><h1 style="' + staticHeadingStyle + ';font-size:clamp(2.25rem,6vw,4rem)">' +
    escapeText(heading) + '</h1><p style="' + staticParagraphStyle + '">' + escapeText(metadata.description || '') + '</p></header>';

  if (pathname === '/') {
    return '<main id="na-seo-static-content" style="' + staticRootStyle + '">' +
      '<header><p style="margin:0 0 10px;color:#17665B;font-size:12px;letter-spacing:.18em;text-transform:uppercase">Tradition Meets Tomorrow</p>' +
      '<h1 style="' + staticHeadingStyle + ';font-size:clamp(2.25rem,6vw,4rem)">Interior Designers in Noida Extension &amp; Greater Noida West</h1>' +
      '<p style="' + staticParagraphStyle + '">NestArcadia creates heritage-inspired, contemporary interiors for apartments, villas and workspaces. Our design approach brings space planning, storage, kitchens, lighting, materials and execution decisions together around the way people actually live.</p></header>' +
      '<section style="' + staticSectionStyle + '"><h2 style="' + staticHeadingStyle + ';font-size:clamp(1.6rem,4vw,2.35rem)">Residential Interior Designers in Noida Extension and Greater Noida West</h2>' +
      '<p style="' + staticParagraphStyle + '">We plan interiors for 2BHK, 3BHK and 4BHK apartments, villas and other homes across Noida, Greater Noida, Greater Noida West and nearby NCR areas. The work begins with the floor plan: circulation, furniture scale, kitchen workflow, wardrobes, usable storage and the service decisions that should be resolved before site execution.</p>' +
      '<p style="' + staticParagraphStyle + '">A well-planned apartment starts with the builder’s floor plan: furniture scale, everyday circulation, usable storage, kitchen workflow and the service decisions that should be resolved before finishes are finalised. The exact scope depends on the property, what is already complete and the household’s requirements.</p>' +
      '<p>' + inlineLink('/interior-design-noida-extension/', 'Interior design for homes in Noida Extension') + ' · ' +
      inlineLink('/interior-design-greater-noida-west/', 'Interior design in Greater Noida West') + ' · ' +
      inlineLink('/interior-design-noida/', 'Interior design in Noida') + ' · ' +
      inlineLink('/interior-design-greater-noida/', 'Interior design in Greater Noida') + ' · ' +
      inlineLink('/interior-design-services/', 'All interior design services') + '</p></section>' +
      '<section style="' + staticSectionStyle + '"><h2 style="' + staticHeadingStyle + ';font-size:clamp(1.6rem,4vw,2.35rem)">Residential and Commercial Interior Services</h2>' +
      staticList(['2BHK, 3BHK and 4BHK apartment planning','Modular kitchens, wardrobes and custom storage','Lighting, material and finish selection','Vastu-led layout discussions when requested','Commercial office space planning, reception, workstations and acoustic considerations','Turnkey design and execution coordination']) +
      '<h2 style="' + staticHeadingStyle + ';font-size:clamp(1.6rem,4vw,2.35rem)">How a Project Moves Forward</h2>' +
      staticList(['Review the property, floor plan, possession status and brief.','Resolve space planning, furniture, kitchen, storage and major services.','Develop the design direction, material palette and execution drawings.','Coordinate site work, materials and quality checks against the agreed scope.'], true) +
      '<p style="' + staticParagraphStyle + '">To discuss a home or office brief, ' + inlineLink('/start-your-project/', 'share your project requirements') + ' or visit the ' + inlineLink('/journal/', 'NestArcadia interior design journal') + ' for practical planning guidance.</p></section>' +
      '<section style="' + staticSectionStyle + '"><h2 style="' + staticHeadingStyle + ';font-size:clamp(1.6rem,4vw,2.35rem)">Interior Budget Guides for 2BHK and 3BHK Homes</h2>' +
      '<p style="' + staticParagraphStyle + '">Start with a clear planning range, understand which scope and specifications affect the estimate, and compare written proposals on the same basis. These are planning guides, not fixed package quotations.</p>' +
      '<p>' + inlineLink('/journal/2bhk-interior-cost-noida-extension/', '2BHK interior cost in Noida Extension') + ' · ' +
      inlineLink('/journal/3bhk-interior-cost-greater-noida-west/', '3BHK interior cost in Greater Noida West') + '</p></section></main>';
  }

  const service = serviceMeta.get(pathname);
  if (service) {
    const insights = service.insights.map((item) => '<article style="margin:0 0 18px"><h3 style="' + staticHeadingStyle + ';font-size:1.2rem">' + escapeText(item.title) + '</h3><p style="' + staticParagraphStyle + '">' + escapeText(item.body) + '</p></article>').join('');
    const faqHtml = service.faqs.map((faq) => '<details style="margin:0 0 15px"><summary style="cursor:pointer;font-weight:600;color:#1C3A5A">' + escapeText(faq.question) + '</summary><p style="' + staticParagraphStyle + ';margin-top:8px">' + escapeText(faq.answer) + '</p></details>').join('');
    const relatedHtml = service.related.map((item) => '<li style="margin:0 0 9px">' + inlineLink(item.href, item.label) + '</li>').join('');
    return '<main id="na-seo-static-content" style="' + staticRootStyle + '">' + header +
      (service.introTitle ? '<section style="' + staticSectionStyle + '"><p style="margin:0 0 8px;color:#17665B;font-size:12px;letter-spacing:.16em;text-transform:uppercase">' + escapeText(service.introLabel) + '</p><h2 style="' + staticHeadingStyle + ';font-size:clamp(1.6rem,4vw,2.35rem)">' + escapeText(service.introTitle) + '</h2><p style="' + staticParagraphStyle + '">' + escapeText(service.intro) + '</p></section>' : '') +
      (insights ? '<section style="' + staticSectionStyle + '"><h2 style="' + staticHeadingStyle + ';font-size:clamp(1.5rem,3vw,2rem)">Planning considerations for ' + escapeText(service.area || 'your space') + '</h2>' + insights + '</section>' : '') +
      (service.services.length ? '<section style="' + staticSectionStyle + '"><h2 style="' + staticHeadingStyle + ';font-size:clamp(1.5rem,3vw,2rem)">Interior design services</h2>' + staticList(service.services) + '</section>' : '') +
      (service.fit.length ? '<section style="' + staticSectionStyle + '"><h2 style="' + staticHeadingStyle + ';font-size:clamp(1.5rem,3vw,2rem)">Who this service is for</h2>' + staticList(service.fit) + '</section>' : '') +
      (service.process.length ? '<section style="' + staticSectionStyle + '"><h2 style="' + staticHeadingStyle + ';font-size:clamp(1.5rem,3vw,2rem)">Our process</h2>' + staticList(service.process, true) + '</section>' : '') +
      (faqHtml ? '<section style="' + staticSectionStyle + '"><h2 style="' + staticHeadingStyle + ';font-size:clamp(1.5rem,3vw,2rem)">Frequently asked questions</h2>' + faqHtml + '</section>' : '') +
      (relatedHtml ? '<section style="' + staticSectionStyle + '"><h2 style="' + staticHeadingStyle + ';font-size:clamp(1.5rem,3vw,2rem)">Related resources</h2><ul style="padding-left:22px">' + relatedHtml + '</ul></section>' : '') +
      '<p style="' + staticParagraphStyle + '">Ready to discuss your property? ' + inlineLink('/start-your-project/', 'Share your project brief with NestArcadia') + '.</p></main>';
  }

  const mainSections = mainPageContent[pathname];
  if (mainSections) {
    const sections = mainSections.map((section) => {
      const paragraphs = (section.paragraphs || []).map((paragraph) => '<p style="' + staticParagraphStyle + '">' + escapeText(paragraph) + '</p>').join('');
      const bullets = staticList(section.bullets || []);
      const links = (section.links || []).map((link) => inlineLink(link.href, link.label)).join(' · ');
      const faqs = (section.faqs || []).map((faq) => '<details style="margin:0 0 14px;border-bottom:1px solid #D4CBBB;padding:0 0 14px"><summary style="cursor:pointer;font-weight:600;color:#1C3A5A">' + escapeText(faq.question) + '</summary><p style="' + staticParagraphStyle + ';margin-top:8px">' + escapeText(faq.answer) + '</p></details>').join('');
      return '<section style="' + staticSectionStyle + '"><h2 style="' + staticHeadingStyle + ';font-size:clamp(1.5rem,3vw,2rem)">' + escapeText(section.heading) + '</h2>' + paragraphs + bullets + faqs + (links ? '<p style="' + staticParagraphStyle + '">' + links + '</p>' : '') + '</section>';
    }).join('');
    return '<main id="na-seo-static-content" style="' + staticRootStyle + '">' + header + sections + '</main>';
  }

  const articleSlug = pathname.startsWith('/journal/') ? pathname.slice('/journal/'.length) : '';
  const article = articleSlug ? articleMeta.get(articleSlug) : null;
  if (article) {
    const paragraphs = article.bodyBlocks?.length
      ? article.bodyBlocks.map((block) => {
          if (block.type === 'h2' || block.type === 'h3') {
            return '<' + block.type + ' style="' + staticHeadingStyle + ';font-size:' + (block.type === 'h2' ? '1.7rem' : '1.25rem') + '">' + escapeText(block.text) + '</' + block.type + '>';
          }
          if (block.type === 'li') return '<p style="' + staticParagraphStyle + '">• ' + escapeText(block.text) + '</p>';
          return '<p style="' + staticParagraphStyle + '">' + escapeText(block.text) + '</p>';
        }).join('')
      : article.body.map((paragraph) => '<p style="' + staticParagraphStyle + '">' + escapeText(paragraph) + '</p>').join('');
    const related = article.related.map((slug) => '<li style="margin:0 0 9px">' + inlineLink('/journal/' + slug.replace(/\/+$/, '') + '/', titleCaseSlug(slug)) + '</li>').join('');
    const localServiceLinks = '<section style="' + staticSectionStyle + '"><h2 style="' + staticHeadingStyle + ';font-size:1.7rem">Planning a home in Noida or Greater Noida West?</h2><p style="' + staticParagraphStyle + '">For guidance shaped around your floor plan, budget and execution scope, explore our ' +
      inlineLink('/interior-design-noida-extension/', 'interior design services in Noida Extension') + ', ' +
      inlineLink('/interior-design-greater-noida-west/', 'interior design in Greater Noida West') + ', and ' +
      inlineLink('/interior-design-services/', 'interior design and turnkey services') + '.</p></section>';
    return '<main id="na-seo-static-content" style="' + staticRootStyle + '">' + header +
      '<p style="margin:-4px 0 22px;color:#6B5E4E;font-size:13px">' + escapeText(article.category) + (article.readTime ? ' · ' + escapeText(article.readTime) : '') + ' · By ' + escapeText(article.author) + '</p>' +
      '<p style="' + staticParagraphStyle + '">Published by NestArcadia Journal. Learn about the studio’s background in real estate and construction on our ' + inlineLink('/our-story/', 'Our Story') + ' page. First-hand design observations are presented as practice notes; technical or performance claims are limited to the evidence cited on the page.</p>' +
      paragraphs + localServiceLinks + (related ? '<section style="' + staticSectionStyle + '"><h2 style="' + staticHeadingStyle + ';font-size:1.7rem">Related articles</h2><ul style="padding-left:22px">' + related + '</ul></section>' : '') +
      '<p style="' + staticParagraphStyle + '">For project-specific advice, ' + inlineLink('/start-your-project/', 'share your interior design brief') + ' with NestArcadia.</p></main>';
  }

  if (pathname === '/journal') {
    const articles = [...articleMeta.values()];
    const articleCards = articles.map((item) => '<article style="margin:0 0 22px"><h2 style="' + staticHeadingStyle + ';font-size:1.45rem">' +
      inlineLink('/journal/' + item.id + '/', item.articleTitle || item.title.replace(/\s*\|\s*NestArcadia Journal$/, '')) +
      '</h2><p style="' + staticParagraphStyle + '">' + escapeText(item.description) + '</p></article>').join('');
    return '<main id="na-seo-static-content" style="' + staticRootStyle + '">' + header + articleCards + '</main>';
  }

  return '<main id="na-seo-static-content" style="' + staticRootStyle + '">' + header +
    '<section style="' + staticSectionStyle + '"><h2 style="' + staticHeadingStyle + ';font-size:1.7rem">Explore NestArcadia</h2><p style="' + staticParagraphStyle + '">Learn about our <a style="' + staticLinkStyle + '" href="/interior-design-services/">interior design services</a>, read the <a style="' + staticLinkStyle + '" href="/journal/">interior design journal</a>, or <a style="' + staticLinkStyle + '" href="/start-your-project/">share your project brief</a>.</p></section></main>';
}

const originalOgImage = template.match(/<meta property="og:image" content="([^"]+)"/)?.[1]
  || baseUrl + '/assets/nestarcadia-social.jpg';

for (const rawUrl of urls) {
  const parsed = new URL(rawUrl);
  if (parsed.origin !== baseUrl || parsed.search || parsed.hash) {
    throw new Error('Unexpected sitemap URL; refusing to generate canonical HTML: ' + rawUrl);
  }
  // Publish only canonical slash-terminated URLs (except the homepage). This must match
  // the directory index.html output that Vite preview/Hostinger serves with HTTP 200.
  const routePath = parsed.pathname === '/' ? '/' : parsed.pathname.replace(/\/+$/, '') + '/';
  const expectedUrl = baseUrl + routePath;
  if (rawUrl !== expectedUrl) {
    throw new Error('Sitemap URL is not canonical; expected trailing slash URL ' + expectedUrl + ' but received ' + rawUrl);
  }
  const routeKey = routePath === '/' ? '/' : routePath.slice(0, -1);
  const route = routePath === '/' ? '' : routePath.replace(/^\/+|\/+$/g, '');
  const outputDir = path.join(distDir, route);
  const canonical = expectedUrl;
  const metadata = routeMetadata(routeKey);
  const title = metadata.title || 'NestArcadia | Interior Design in Noida & Greater Noida';
  const description = shortenDescription(metadata.description || title);
  const imageUrl = metadata.imageId
    ? 'https://etmrhxapfvyaispuvnft.supabase.co/functions/v1/site-media/image/' + encodeURIComponent(metadata.imageId) + '?width=1200&quality=78'
    : originalOgImage;

  let html = template;
  const staticMarkup = renderStaticRoute(routeKey, metadata);
  if (routeKey === '/journal/luxury-interior-design-noida-extension') {
    if (!metadata.body?.length || !staticMarkup.includes('5 Core Elements of High-End Residential Interiors')) {
      throw new Error('Published Noida Extension journal article is missing its static content snapshot.');
    }
  }
  const rootPlaceholder = '<div id="root"></div>';
  if (!html.includes(rootPlaceholder)) throw new Error('Static SEO content generation stopped: #root placeholder is missing for ' + rawUrl);
  html = html.replace(rootPlaceholder, '<div id="root">' + staticMarkup + '</div>');
  html = replaceTag(html, /<title>[\s\S]*?<\/title>/i, '<title>' + escapeAttribute(title) + '</title>');
  html = replaceTag(html, /<link\b(?=[^>]*\brel="canonical")[^>]*>/i, '<link rel="canonical" href="' + escapeAttribute(canonical) + '" />', false);
  html = replaceMeta(html, /<meta name="description"[^>]*\/?>/i, 'content', description, '<meta name="description" content="__VALUE__" />');
  html = replaceMeta(html, /<meta property="og:title"[^>]*\/?>/i, 'content', title, '<meta property="og:title" content="__VALUE__" />');
  html = replaceMeta(html, /<meta property="og:description"[^>]*\/?>/i, 'content', description, '<meta property="og:description" content="__VALUE__" />');
  html = replaceMeta(html, /<meta property="og:url"[^>]*\/?>/i, 'content', canonical, '<meta property="og:url" content="__VALUE__" />');
  html = replaceMeta(html, /<meta property="og:image"[^>]*\/?>/i, 'content', imageUrl, '<meta property="og:image" content="__VALUE__" />');
  html = replaceMeta(html, /<meta name="twitter:title"[^>]*\/?>/i, 'content', title, '<meta name="twitter:title" content="__VALUE__" />');
  html = replaceMeta(html, /<meta name="twitter:description"[^>]*\/?>/i, 'content', description, '<meta name="twitter:description" content="__VALUE__" />');
  html = replaceMeta(html, /<meta name="twitter:image"[^>]*\/?>/i, 'content', imageUrl, '<meta name="twitter:image" content="__VALUE__" />');
  html = replaceMeta(html, /<meta property="og:type"[^>]*\/?>/i, 'content', metadata.type === 'article' ? 'article' : 'website', '<meta property="og:type" content="__VALUE__" />');

  // Keep the business entity graph, but make the page-level structured data
  // accurate in the initial HTML (before the React application runs).
  const schemaMatch = html.match(/<script id="nestarcadia-schema" type="application\/ld\+json">([\s\S]*?)<\/script>/i);
  if (!schemaMatch) throw new Error('Route schema generation stopped: base JSON-LD script is missing for ' + rawUrl);
  const schemaDocument = JSON.parse(schemaMatch[1]);
  const schemaGraph = Array.isArray(schemaDocument['@graph']) ? schemaDocument['@graph'] : [];
  const pageSchema = {
    '@type': 'WebPage',
    '@id': canonical + '#webpage',
    url: canonical,
    name: title,
    description,
    isPartOf: { '@id': baseUrl + '/#website' },
    about: { '@id': baseUrl + '/#business' },
  };
  const routeGraph = [pageSchema];
  if (routeKey === '/faqs') {
    routeGraph.push({
      '@type': 'FAQPage',
      '@id': canonical + '#faq',
      mainEntity: mainPageContent['/faqs'].flatMap((section) => section.faqs || []).map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: { '@type': 'Answer', text: faq.answer },
      })),
    });
  }
  if (metadata.type === 'article') {
    routeGraph.push({
      '@type': 'BlogPosting',
      '@id': canonical + '#article',
      url: canonical,
      mainEntityOfPage: { '@id': canonical + '#webpage' },
      headline: metadata.articleTitle || title,
      description,
      author: metadata.author === 'NestArcadia'
        ? { '@type': 'Organization', name: metadata.author, url: baseUrl }
        : { '@type': 'Person', name: metadata.author || 'NestArcadia' },
      publisher: { '@id': baseUrl + '/#business' },
      image: imageUrl,
      articleSection: metadata.category || 'Journal',
      ...(metadata.datePublished ? { datePublished: metadata.datePublished } : {}),
      ...(metadata.dateModified ? { dateModified: metadata.dateModified } : {}),
    });
  } else if (metadata.type === 'service') {
    routeGraph.push({
      '@type': 'Service',
      '@id': canonical + '#service',
      name: title,
      description,
      serviceType: 'Interior design and turnkey execution',
      provider: { '@id': baseUrl + '/#business' },
      ...(metadata.area ? { areaServed: { '@type': 'Place', name: metadata.area } } : {}),
    });
  }
  if (routePath !== '/') {
    const breadcrumbItems = metadata.articleTitle
      ? [
          { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl + '/' },
          { '@type': 'ListItem', position: 2, name: 'Journal', item: baseUrl + '/journal/' },
          { '@type': 'ListItem', position: 3, name: metadata.articleTitle, item: canonical },
        ]
      : [
          { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl + '/' },
          { '@type': 'ListItem', position: 2, name: metadata.area || title.replace(/\s*\|\s*NestArcadia(?: Journal)?\s*$/i, ''), item: canonical },
        ];
    routeGraph.push({
      '@type': 'BreadcrumbList',
      '@id': canonical + '#breadcrumb',
      itemListElement: breadcrumbItems,
    });
  }
  schemaDocument['@graph'] = [
    ...schemaGraph.filter((item) => !['WebPage', 'BlogPosting', 'Service', 'BreadcrumbList', 'FAQPage'].some((type) =>
      item['@type'] === type || (Array.isArray(item['@type']) && item['@type'].includes(type))
    )),
    ...routeGraph,
  ];
  html = html.replace(schemaMatch[0], '<script id="nestarcadia-schema" type="application/ld+json">' + JSON.stringify(schemaDocument) + '</script>');


  // Don't download the homepage LCP image for every other route.
  if (routePath !== '/') {
    html = html.replace(/\s*<link rel="preload" as="image" href="\/images\/home-hero-mobile-v2\.webp"[^>]*\/?>/gi, '');
    html = html.replace(/\s*<link rel="preload" as="image" href="\/images\/home-hero-optimized-v2\.webp"[^>]*\/?>/gi, '');
  }

  if (!html.includes('<link rel="canonical" href="' + canonical + '"')) {
    throw new Error('Canonical tag generation failed for ' + rawUrl);
  }
  if (!html.includes('<title>' + escapeAttribute(title) + '</title>')) {
    throw new Error('Route-specific title generation failed for ' + rawUrl);
  }
  if (!html.includes('property="og:url" content="' + escapeAttribute(canonical) + '"')) {
    throw new Error('Route-specific Open Graph URL generation failed for ' + rawUrl);
  }
  const finalSchemaMatch = html.match(/<script id="nestarcadia-schema" type="application\/ld\+json">([\s\S]*?)<\/script>/i);
  if (!finalSchemaMatch) throw new Error('Route JSON-LD missing after generation for ' + rawUrl);
  const finalSchema = JSON.parse(finalSchemaMatch[1]);
  if (!finalSchema['@graph']?.some((item) => item['@type'] === 'WebPage' && item.url === canonical)) {
    throw new Error('Canonical WebPage JSON-LD missing for ' + rawUrl);
  }
  if (metadata.type === 'article' && !finalSchema['@graph']?.some((item) => item['@type'] === 'BlogPosting' && item.url === canonical)) {
    throw new Error('BlogPosting JSON-LD missing for ' + rawUrl);
  }

  const requiredSingleTags = [
    ['title', /<title\b[^>]*>[\s\S]*?<\/title>/gi],
    ['canonical', /<link\b(?=[^>]*\brel="canonical")[^>]*>/gi],
    ['meta description', /<meta\b(?=[^>]*\bname="description")[^>]*>/gi],
    ['Open Graph title', /<meta\b(?=[^>]*\bproperty="og:title")[^>]*>/gi],
    ['Open Graph description', /<meta\b(?=[^>]*\bproperty="og:description")[^>]*>/gi],
    ['Open Graph URL', /<meta\b(?=[^>]*\bproperty="og:url")[^>]*>/gi],
  ];
  for (const [label, pattern] of requiredSingleTags) {
    const count = [...html.matchAll(pattern)].length;
    if (count !== 1) throw new Error('Expected exactly one ' + label + ' tag for ' + rawUrl + ', found ' + count);
  }

  await mkdir(outputDir, { recursive: true });
  await writeFile(path.join(outputDir, 'index.html'), html);
}

console.log('Generated route-specific canonical and social metadata for ' + urls.length + ' sitemap URLs.');
