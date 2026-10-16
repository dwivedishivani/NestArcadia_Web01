import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import ts from 'typescript';

const baseUrl = 'https://nestarcadia.com';
const distDir = path.resolve('dist');
const template = await readFile(path.join(distDir, 'index.html'), 'utf8');
const sitemap = await readFile(path.join(distDir, 'sitemap.xml'), 'utf8');
const urls = [...sitemap.matchAll(/<loc>\\s*(https?:[^<]+)\\s*<\\/loc>/g)].map((match) => match[1].trim());

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

function titleCaseSlug(slug) {
  return slug.split('-').filter(Boolean).map((part) => {
    if (/^(ncr|nri|2bhk|3bhk|4bhk|5bhk|vastu|jaali)$/i.test(part)) return part.toUpperCase();
    return part.charAt(0).toUpperCase() + part.slice(1);
  }).join(' ');
}

function shortenDescription(value, limit = 158) {
  const normalized = String(value || '').replace(/\\s+/g, ' ').trim();
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
  return html.replace('</head>', replacement + '\\n  </head>');
}

function replaceMeta(html, selectorPattern, attribute, value, fallbackTag) {
  const safeValue = escapeAttribute(value);
  const match = html.match(selectorPattern);
  if (!match) return html.replace('</head>', fallbackTag.replace('__VALUE__', safeValue) + '\\n  </head>');
  const tag = match[0];
  const attributePattern = new RegExp('\\\\b' + attribute + '="[^"]*"');
  const changed = attributePattern.test(tag)
    ? tag.replace(attributePattern, attribute + '="' + safeValue + '"')
    : tag.replace(/\\s*\\/?\\s*>$/, ' ' + attribute + '="' + safeValue + '" />');
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
const servicesArray = findVariable(servicesSource, 'localServicePages');
const serviceMeta = new Map();
if (servicesArray && ts.isArrayLiteralExpression(servicesArray)) {
  for (const entry of servicesArray.elements) {
    if (!ts.isObjectLiteralExpression(entry)) continue;
    const route = propertyString(entry, 'path');
    const title = propertyString(entry, 'title');
    const description = propertyString(entry, 'description');
    const imageId = firstCallStringArgument(propertyNode(entry, 'heroImage'));
    if (route && title && description) serviceMeta.set(route, { title, description, imageId, type: 'service' });
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
    if (id && title) articleMeta.set(id, { title: title + ' | NestArcadia Journal', description: description || title, imageId, type: 'article' });
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
    const slug = pathname.slice('/journal/'.length).replace(/\\/$/, '');
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
    const slug = pathname.replace(/^\\//, '').replace(/^commercial-interior-design-/, '').replace(/^interior-design-/, '');
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
  const fallback = titleCaseSlug(pathname.replace(/^\\//, '').replace(/\\/$/, '')) || 'NestArcadia';
  return {
    title: fallback + ' | NestArcadia',
    description: 'Explore NestArcadia interior design services, practical planning advice and project information for Noida, Greater Noida and Delhi NCR.',
    type: 'website',
  };
}

const originalOgImage = template.match(/<meta property="og:image" content="([^"]+)"/)?.[1]
  || baseUrl + '/assets/nestarcadia-social.jpg';

for (const rawUrl of urls) {
  const parsed = new URL(rawUrl);
  if (parsed.origin !== baseUrl || parsed.search || parsed.hash) {
    throw new Error('Unexpected sitemap URL; refusing to generate canonical HTML: ' + rawUrl);
  }
  const routePath = parsed.pathname || '/';
  const route = routePath === '/' ? '' : routePath.replace(/^\\/+|\\/+$/g, '');
  const outputDir = path.join(distDir, route);
  const canonical = baseUrl + (routePath === '/' ? '/' : routePath);
  const metadata = routeMetadata(routePath);
  const title = metadata.title || 'NestArcadia | Interior Design in Noida & Greater Noida';
  const description = shortenDescription(metadata.description || title);
  const imageUrl = metadata.imageId
    ? 'https://etmrhxapfvyaispuvnft.supabase.co/functions/v1/site-media/image/' + encodeURIComponent(metadata.imageId) + '?width=1200&quality=78'
    : originalOgImage;

  let html = template;
  html = replaceTag(html, /<title>[\\s\\S]*?<\\/title>/i, '<title>' + escapeAttribute(title) + '</title>');
  html = html.replace(/<link rel="canonical" href="[^"]*"\\s*\\/>/i, '<link rel="canonical" href="' + escapeAttribute(canonical) + '" />');
  html = replaceMeta(html, /<meta name="description"[^>]*\\/?>/i, 'content', description, '<meta name="description" content="__VALUE__" />');
  html = replaceMeta(html, /<meta property="og:title"[^>]*\\/?>/i, 'content', title, '<meta property="og:title" content="__VALUE__" />');
  html = replaceMeta(html, /<meta property="og:description"[^>]*\\/?>/i, 'content', description, '<meta property="og:description" content="__VALUE__" />');
  html = replaceMeta(html, /<meta property="og:url"[^>]*\\/?>/i, 'content', canonical, '<meta property="og:url" content="__VALUE__" />');
  html = replaceMeta(html, /<meta property="og:image"[^>]*\\/?>/i, 'content', imageUrl, '<meta property="og:image" content="__VALUE__" />');
  html = replaceMeta(html, /<meta name="twitter:title"[^>]*\\/?>/i, 'content', title, '<meta name="twitter:title" content="__VALUE__" />');
  html = replaceMeta(html, /<meta name="twitter:description"[^>]*\\/?>/i, 'content', description, '<meta name="twitter:description" content="__VALUE__" />');
  html = replaceMeta(html, /<meta name="twitter:image"[^>]*\\/?>/i, 'content', imageUrl, '<meta name="twitter:image" content="__VALUE__" />');
  html = replaceMeta(html, /<meta property="og:type"[^>]*\\/?>/i, 'content', metadata.type === 'article' ? 'article' : 'website', '<meta property="og:type" content="__VALUE__" />');

  // Don't download the homepage LCP image for every other route.
  if (routePath !== '/') {
    html = html.replace(/\\s*<link rel="preload" as="image" href="\\/images\\/home-hero-mobile-v2\\.webp"[^>]*\\/?>/gi, '');
    html = html.replace(/\\s*<link rel="preload" as="image" href="\\/images\\/home-hero-optimized-v2\\.webp"[^>]*\\/?>/gi, '');
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
