import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const baseUrl = 'https://nestarcadia.com';
const distDir = path.resolve('dist');
const template = await readFile(path.join(distDir, 'index.html'), 'utf8');
const sitemap = await readFile(path.join(distDir, 'sitemap.xml'), 'utf8');
const urls = [...sitemap.matchAll(/<loc>\s*(https?:[^<]+)\s*<\/loc>/g)].map((match) => match[1].trim());

if (!urls.includes(baseUrl + '/')) {
  throw new Error('Canonical route generation stopped: homepage is missing from sitemap.xml');
}

for (const url of urls) {
  const parsed = new URL(url);
  if (parsed.origin !== baseUrl || parsed.search || parsed.hash) {
    throw new Error('Unexpected sitemap URL; refusing to generate canonical HTML: ' + url);
  }
  const route = parsed.pathname === '/' ? '' : parsed.pathname.replace(/^\/+|\/+$/g, '');
  const outputDir = path.join(distDir, route);
  const canonical = baseUrl + parsed.pathname;
  const html = template.replace(/<link rel="canonical" href="[^"]*"\s*\/>/, '<link rel="canonical" href="' + canonical + '" />');
  if (!html.includes('<link rel="canonical" href="' + canonical + '"')) {
    throw new Error('Canonical tag generation failed for ' + url);
  }
  await mkdir(outputDir, { recursive: true });
  await writeFile(path.join(outputDir, 'index.html'), html);
}
console.log('Generated route-specific canonical HTML for ' + urls.length + ' sitemap URLs.');
