// Post-build step for agent readiness. Runs after generate-canonical-route-html.mjs.
//  1. dist/404.html           - noindex page served with a real HTTP 404 (see public/.htaccess)
//  2. dist/<route>/index.md   - Markdown representation of every prerendered route, served when a
//                               client sends "Accept: text/markdown"
//  3. dist/agent-discovery/   - copies of the .well-known agent documents (the SSH deploy skips .well-known,
//                               so public/.htaccess serves them from here)
//  4. <link rel="alternate" type="text/markdown"> in every prerendered route's <head>
import { readFile, writeFile, readdir, stat, mkdir, copyFile } from 'node:fs/promises';
import path from 'node:path';

const baseUrl = 'https://nestarcadia.com';
const distDir = path.resolve('dist');

async function exists(file) {
  try { await stat(file); return true; } catch { return false; }
}

async function findRouteFiles(dir, out = []) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (['assets', 'images', '.well-known'].includes(entry.name) && dir === distDir) continue;
      await findRouteFiles(full, out);
    } else if (entry.name === 'index.html') {
      out.push(full);
    }
  }
  return out;
}

const decodeEntities = (value) => value
  .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"').replace(/&#0?39;/g, "'").replace(/&rsquo;/g, '’').replace(/&lsquo;/g, '‘')
  .replace(/&ndash;/g, '–').replace(/&mdash;/g, '—').replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
  .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)));
const stripTags = (value) => value.replace(/<[^>]+>/g, '');
const clean = (value) => decodeEntities(stripTags(value)).replace(/\s+/g, ' ').trim();

function toAbsolute(href) {
  if (/^(https?:|mailto:|tel:)/i.test(href)) return href;
  return baseUrl + (href.startsWith('/') ? href : '/' + href);
}

export function htmlToMarkdown(fragment) {
  let s = fragment.replace(/<(script|style)[\s\S]*?<\/\1>/gi, '');
  s = s.replace(/<a\b[^>]*\bhref="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, (_, href, inner) => {
    const text = clean(inner);
    return text ? '[' + text + '](' + toAbsolute(decodeEntities(href)) + ')' : '';
  });
  s = s.replace(/<h([1-3])\b[^>]*>([\s\S]*?)<\/h\1>/gi, (_, level, inner) => '\n\n' + '#'.repeat(Number(level)) + ' ' + decodeEntities(stripTags(inner)).replace(/\s+/g, ' ').trim() + '\n\n');
  s = s.replace(/<summary\b[^>]*>([\s\S]*?)<\/summary>/gi, (_, inner) => '\n\n**' + clean(inner) + '**\n\n');
  s = s.replace(/<li\b[^>]*>([\s\S]*?)<\/li>/gi, (_, inner) => '\n- ' + decodeEntities(stripTags(inner)).replace(/\s+/g, ' ').trim());
  s = s.replace(/<br\s*\/?>/gi, '\n');
  s = s.replace(/<\/(p|section|header|footer|div|ul|ol|nav|details|main|article)>/gi, '\n\n');
  s = decodeEntities(stripTags(s));
  return s.split('\n').map((line) => line.replace(/[ \t]+/g, ' ').trim()).join('\n').replace(/\n{3,}/g, '\n\n').trim();
}

// ---- 0. agent-discovery copies ------------------------------------------------------------
await mkdir(path.join(distDir, 'agent-discovery'), { recursive: true });
await copyFile(path.join(distDir, '.well-known', 'mcp', 'server-card.json'), path.join(distDir, 'agent-discovery', 'mcp-server-card.json'));
await copyFile(path.join(distDir, '.well-known', 'ai-catalog.json'), path.join(distDir, 'agent-discovery', 'ai-catalog.json'));

// ---- 1. 404.html -------------------------------------------------------------------------
const template = await readFile(path.join(distDir, 'index.html'), 'utf8');
let notFound = template;
const notFoundBody =
  '<main id="na-seo-static-content" style="max-width:720px;margin:0 auto;padding:120px 24px 80px;font-family:Arial,sans-serif;line-height:1.7;color:#1C3A5A;background:#F2EDE4">' +
  '<h1 style="font-family:Georgia,serif;font-weight:500;color:#1A1714;font-size:clamp(2rem,5vw,3rem);margin:0 0 16px">Page not found</h1>' +
  '<p style="margin:0 0 16px;color:#52677E">The page you are looking for does not exist or has moved.</p>' +
  '<p style="margin:0"><a href="/" style="color:#1C3A5A;font-weight:600">Home</a> &middot; <a href="/interior-design-services/" style="color:#1C3A5A;font-weight:600">Services</a> &middot; ' +
  '<a href="/contact/" style="color:#1C3A5A;font-weight:600">Contact</a> &middot; <a href="/start-your-project/" style="color:#1C3A5A;font-weight:600">Start your project</a></p></main>';
notFound = notFound.replace(/<div id="root">[\s\S]*?<\/div>\s*(?=<\/body>|<script|<noscript)/i, '<div id="root">' + notFoundBody + '</div>\n');
if (!notFound.includes('Page not found')) {
  notFound = notFound.replace(/(<div id="root">)/i, '$1' + notFoundBody);
}
notFound = notFound.replace(/<title>[\s\S]*?<\/title>/i, '<title>Page not found | NestArcadia</title>');
notFound = notFound.replace(/\s*<link rel="canonical"[^>]*>/gi, '');
notFound = notFound.replace(/\s*<meta property="og:url"[^>]*>/gi, '');
notFound = notFound.replace(/\s*<meta name="robots"[^>]*>/gi, '');
notFound = notFound.replace(/\s*<link rel="alternate" type="text\/markdown"[^>]*>/gi, '');
notFound = notFound.replace('</head>', '    <meta name="robots" content="noindex, nofollow, noarchive" />\n  </head>');
await writeFile(path.join(distDir, '404.html'), notFound);

// ---- 2 + 3. Markdown per route -----------------------------------------------------------
const routeFiles = (await findRouteFiles(distDir)).filter((file) => path.basename(path.dirname(file)) !== 'dist' || file === path.join(distDir, 'index.html'));
let generated = 0;
for (const file of routeFiles) {
  let html = await readFile(file, 'utf8');
  const main = html.match(/<main id="na-seo-static-content"[\s\S]*?<\/main>/i);
  if (!main) continue;
  const title = clean(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] || 'NestArcadia');
  const description = decodeEntities(html.match(/<meta name="description" content="([^"]*)"/i)?.[1] || '');
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/i)?.[1];
  if (!canonical) throw new Error('Canonical missing, cannot create Markdown for ' + file);
  const body = htmlToMarkdown(main[0]);
  if (body.length < 200) throw new Error('Markdown body suspiciously short for ' + canonical);
  const markdown = body.replace(/\s+$/, '') + '\n\n---\n\nSource: ' + canonical + '\nTitle: ' + title + (description ? '\nSummary: ' + description : '') + '\n';
  const mdPath = path.join(path.dirname(file), 'index.md');
  await writeFile(mdPath, markdown);
  const href = canonical.replace(/^https:\/\/nestarcadia\.com/, '') + 'index.md';
  const alternate = '<link rel="alternate" type="text/markdown" href="' + href + '" />';
  if (!html.includes('type="text/markdown"')) {
    html = html.replace('</head>', '    ' + alternate + '\n  </head>');
    await writeFile(file, html);
  }
  generated += 1;
}
if (generated < 50) throw new Error('Expected Markdown for at least 50 routes, generated ' + generated);
if (!(await exists(path.join(distDir, 'index.md')))) throw new Error('Homepage Markdown missing');
console.log('Agent assets: dist/404.html plus Markdown for ' + generated + ' routes.');
