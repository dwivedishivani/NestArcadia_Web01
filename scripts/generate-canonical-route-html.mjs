import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import ts from 'typescript';

const baseUrl = 'https://nestarcadia.com';
const distDir = path.resolve('dist');
const template = await readFile(path.join(distDir, 'index.html'), 'utf8');
const sitemap = await readFile(path.join(distDir, 'sitemap.xml'), 'utf8');
const urls = [...sitemap.matchAll(/<loc>\s*(https?:[^<]+)\s*<\/loc>/g)].map((match) => match[1].trim());

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
  if (pattern.test(html)) return html.replace(pattern, replacement);
  if (!insertBeforeHeadEnd) throw new Error('Required HTML tag missing: ' + pattern);
  return html.replace('</head>', replacement + '\n  </head>');
}

function replaceMeta(html, selectorPattern, attribute, value, fallbackTag) {
  const safeValue = escapeAttribute(value);
  const match = html.match(selectorPattern);
  if (!match) return html.replace('</head>', fallbackTag.replace('__VALUE__', safeValue) + '\n  </head>');
  const tag = match[0];
  const attributePattern = new RegExp('\\b' + attribute + '="[^"]*"');
  const changed = attributePattern.test(tag)
    ? tag.replace(attributePattern, attribute + '="' + safeValue + '"')
    : tag.replace(/\s*\/?\s*>$/, ' ' + attribute + '="' + safeValue + '" />');
  return html.replace(tag, changed);
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
    });
  }
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
]);

function routeMetadata(pathname) {
  const main = mainRouteMeta.get(pathname);
  if (main?.title && main?.description) return { ...main, type: 'website' };
  const service = serviceMeta.get(pathname);
  if (service) return service;
  if (pathname.startsWith('/journal/')) {
    const slug = pathname.slice('/journal/'.length).replace(/\/$/, '');
    const article = articleMeta.get(slug);
    if (article) return article;
    const title = titleCaseSlug(slug);
    return {
      title: title + ' | NestArcadia Journal',
      description: 'Practical interior design ideas, material guidance and planning advice for homes in Noida, Greater Noida and NCR: ' + title + '.',
      type: 'article',
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
const staticLinkStyle = 'color:#1C3A5A;text-decoration:underline;text-underline-offset:3px;font-weight:600';
const inlineLink = (href, label) => '<a style="' + staticLinkStyle + '" href="' + escapeAttribute(href) + '">' + escapeText(label) + '</a>';
const staticList = (items, ordered = false) => {
  if (!items?.length) return '';
  const tag = ordered ? 'ol' : 'ul';
  const listStyle = ordered ? 'padding-left:24px;margin:0 0 18px' : 'padding-left:22px;margin:0 0 18px';
  return '<' + tag + ' style="' + listStyle + '">' + items.map((item) => '<li style="margin:0 0 9px;color:#52677E">' + escapeText(item) + '</li>').join('') + '</' + tag + '>';
};

function renderStaticRoute(pathname, metadata) {
  const heading = (metadata.title || 'NestArcadia').replace(/\s*\|\s*NestArcadia(?: Journal)?\s*$/i, '');
  const header = '<header><p style="margin:0 0 10px;color:#17665B;font-size:12px;letter-spacing:.18em;text-transform:uppercase">' +
    escapeText(metadata.eyebrow || 'NestArcadia · Interior Design') + '</p><h1 style="' + staticHeadingStyle + ';font-size:clamp(2.25rem,6vw,4rem)">' +
    escapeText(heading) + '</h1><p style="' + staticParagraphStyle + '">' + escapeText(metadata.description || '') + '</p></header>';

  if (pathname === '/') {
    return '<main id="na-seo-static-content" style="' + staticRootStyle + '">' +
      '<header><p style="margin:0 0 10px;color:#17665B;font-size:12px;letter-spacing:.18em;text-transform:uppercase">Tradition Meets Tomorrow</p>' +
      '<h1 style="' + staticHeadingStyle + ';font-size:clamp(2.25rem,6vw,4rem)">We Bring Timeless Culture to Modern Living</h1>' +
      '<p style="' + staticParagraphStyle + '">NestArcadia creates heritage-inspired, contemporary interiors for apartments, villas and workspaces. Our design approach brings space planning, storage, kitchens, lighting, materials and execution decisions together around the way people actually live.</p></header>' +
      '<section style="' + staticSectionStyle + '"><h2 style="' + staticHeadingStyle + ';font-size:clamp(1.6rem,4vw,2.35rem)">Residential Interior Designers in Noida Extension and Greater Noida West</h2>' +
      '<p style="' + staticParagraphStyle + '">We plan interiors for 2BHK, 3BHK and 4BHK apartments, villas and other homes across Noida, Greater Noida, Greater Noida West and nearby NCR areas. The work begins with the floor plan: circulation, furniture scale, kitchen workflow, wardrobes, usable storage and the service decisions that should be resolved before site execution.</p>' +
      '<p style="' + staticParagraphStyle + '">For a raw or newly handed-over apartment, the published starting guidance is around ₹6.5–7 lakh for a 2BHK and ₹9–10 lakh for a 3BHK. The final estimate depends on existing completed work, furniture and storage scope, materials, customisation and the agreed project brief.</p>' +
      '<p>' + inlineLink('/interior-design-noida-extension/', 'Interior design for homes in Noida Extension') + ' · ' +
      inlineLink('/interior-design-greater-noida-west/', 'Interior design in Greater Noida West') + ' · ' +
      inlineLink('/interior-design-services/', 'All interior design services') + '</p></section>' +
      '<section style="' + staticSectionStyle + '"><h2 style="' + staticHeadingStyle + ';font-size:clamp(1.6rem,4vw,2.35rem)">Residential and Commercial Interior Services</h2>' +
      staticList(['2BHK, 3BHK and 4BHK apartment planning','Modular kitchens, wardrobes and custom storage','Lighting, material and finish selection','Vastu-led layout discussions when requested','Commercial office space planning, reception, workstations and acoustic considerations','Turnkey design and execution coordination']) +
      '<h2 style="' + staticHeadingStyle + ';font-size:clamp(1.6rem,4vw,2.35rem)">How a Project Moves Forward</h2>' +
      staticList(['Review the property, floor plan, possession status and brief.','Resolve space planning, furniture, kitchen, storage and major services.','Develop the design direction, material palette and execution drawings.','Coordinate site work, materials and quality checks against the agreed scope.'], true) +
      '<p style="' + staticParagraphStyle + '">To discuss a home or office brief, ' + inlineLink('/start-your-project/', 'share your project requirements') + ' or visit the ' + inlineLink('/journal/', 'NestArcadia interior design journal') + ' for practical planning guidance.</p></section></main>';
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

  const articleSlug = pathname.startsWith('/journal/') ? pathname.slice('/journal/'.length) : '';
  const article = articleSlug ? articleMeta.get(articleSlug) : null;
  if (article) {
    const paragraphs = article.body.map((paragraph) => '<p style="' + staticParagraphStyle + '">' + escapeText(paragraph) + '</p>').join('');
    const related = article.related.map((slug) => '<li style="margin:0 0 9px">' + inlineLink('/journal/' + slug.replace(/\/+$/, '') + '/', titleCaseSlug(slug)) + '</li>').join('');
    return '<main id="na-seo-static-content" style="' + staticRootStyle + '">' + header +
      '<p style="margin:-4px 0 22px;color:#6B5E4E;font-size:13px">' + escapeText(article.category) + (article.readTime ? ' · ' + escapeText(article.readTime) : '') + ' · By ' + escapeText(article.author) + '</p>' +
      paragraphs + (related ? '<section style="' + staticSectionStyle + '"><h2 style="' + staticHeadingStyle + ';font-size:1.7rem">Related articles</h2><ul style="padding-left:22px">' + related + '</ul></section>' : '') +
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
  const rootPlaceholder = '<div id="root"></div>';
  if (!html.includes(rootPlaceholder)) throw new Error('Static SEO content generation stopped: #root placeholder is missing for ' + rawUrl);
  html = html.replace(rootPlaceholder, '<div id="root">' + staticMarkup + '</div>');
  html = replaceTag(html, /<title>[\s\S]*?<\/title>/i, '<title>' + escapeAttribute(title) + '</title>');
  html = html.replace(/<link rel="canonical" href="[^"]*"\s*\/>/i, '<link rel="canonical" href="' + escapeAttribute(canonical) + '" />');
  html = replaceMeta(html, /<meta name="description"[^>]*\/?>/i, 'content', description, '<meta name="description" content="__VALUE__" />');
  html = replaceMeta(html, /<meta property="og:title"[^>]*\/?>/i, 'content', title, '<meta property="og:title" content="__VALUE__" />');
  html = replaceMeta(html, /<meta property="og:description"[^>]*\/?>/i, 'content', description, '<meta property="og:description" content="__VALUE__" />');
  html = replaceMeta(html, /<meta property="og:url"[^>]*\/?>/i, 'content', canonical, '<meta property="og:url" content="__VALUE__" />');
  html = replaceMeta(html, /<meta property="og:image"[^>]*\/?>/i, 'content', imageUrl, '<meta property="og:image" content="__VALUE__" />');
  html = replaceMeta(html, /<meta name="twitter:title"[^>]*\/?>/i, 'content', title, '<meta name="twitter:title" content="__VALUE__" />');
  html = replaceMeta(html, /<meta name="twitter:description"[^>]*\/?>/i, 'content', description, '<meta name="twitter:description" content="__VALUE__" />');
  html = replaceMeta(html, /<meta name="twitter:image"[^>]*\/?>/i, 'content', imageUrl, '<meta name="twitter:image" content="__VALUE__" />');
  html = replaceMeta(html, /<meta property="og:type"[^>]*\/?>/i, 'content', metadata.type === 'article' ? 'article' : 'website', '<meta property="og:type" content="__VALUE__" />');

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

  await mkdir(outputDir, { recursive: true });
  await writeFile(path.join(outputDir, 'index.html'), html);
}

console.log('Generated route-specific canonical and social metadata for ' + urls.length + ' sitemap URLs.');
