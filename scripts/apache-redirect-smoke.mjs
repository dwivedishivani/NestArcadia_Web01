import assert from 'node:assert/strict';
import { request } from 'node:http';

function get(path, host = 'nestarcadia.com', extraHeaders = {}) {
  return new Promise((resolve, reject) => {
    const req = request({
      hostname: '127.0.0.1',
      port: 80,
      path,
      method: 'GET',
      headers: { host, ...extraHeaders },
    }, (res) => {
      const chunks = [];
      res.setEncoding('utf8');
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => resolve({
        status: res.statusCode,
        location: res.headers.location || null,
        contentType: res.headers['content-type'] || '',
        headers: res.headers,
        body: chunks.join(''),
      }));
    });
    req.on('error', reject);
    req.end();
  });
}

async function expectRedirect(path, host, expectedLocation) {
  const response = await get(path, host);
  assert.equal(response.status, 301, `${host}${path} must return HTTP 301`);
  assert.equal(response.location, expectedLocation,
    `${host}${path} must redirect directly to its final canonical URL`);
  return response;
}

await expectRedirect(
  '/interior-design-noida-extension?utm_source=smoke',
  'nestarcadia.com',
  'https://nestarcadia.com/interior-design-noida-extension/?utm_source=smoke',
);
await expectRedirect(
  '/interior-design-noida-extension?utm_source=smoke',
  'www.nestarcadia.com',
  'https://nestarcadia.com/interior-design-noida-extension/?utm_source=smoke',
);
await expectRedirect('/homes', 'nestarcadia.com', 'https://nestarcadia.com/our-projects/');
await expectRedirect('/homes', 'www.nestarcadia.com', 'https://nestarcadia.com/our-projects/');

const previewLegacy = await get('/homes', 'mistyrose-gnu-909089.hostingersite.com');
assert.ok(previewLegacy.status !== 301 && previewLegacy.status !== 302 && !previewLegacy.location,
  'Hostinger preview domains must not be redirected to the production domain');

const previewRoute = await get('/interior-design-noida-extension', 'mistyrose-gnu-909089.hostingersite.com');
assert.ok(previewRoute.status === 301 || previewRoute.status === 200,
  'preview route should be served locally or receive Apache DirectorySlash');
assert.ok(!String(previewRoute.location || '').includes('https://nestarcadia.com'),
  'Hostinger preview route must never redirect to production');

const canonicalRoute = await get('/interior-design-noida-extension/', 'nestarcadia.com');
assert.equal(canonicalRoute.status, 200, 'canonical Noida Extension route must serve HTTP 200');
assert.ok(canonicalRoute.body.includes('<title>Interior Designers in Noida Extension | NestArcadia</title>'),
  'canonical Noida Extension route must return its route-specific HTML title');
assert.ok(canonicalRoute.body.includes('href="https://nestarcadia.com/interior-design-noida-extension/"'),
  'canonical Noida Extension route must return its self-referencing canonical tag');

const sitemap = await get('/sitemap.xml', 'nestarcadia.com');
assert.equal(sitemap.status, 200, 'sitemap.xml must return HTTP 200');
assert.ok(sitemap.body.includes('https://nestarcadia.com/interior-design-noida-extension/'),
  'sitemap must contain the canonical Noida Extension URL');

const hero = await get('/images/home-hero-mobile-v2.webp', 'nestarcadia.com');
assert.equal(hero.status, 200, 'optimized mobile hero asset must return HTTP 200');
assert.ok(hero.contentType.includes('image/webp'), 'optimized mobile hero must retain its WebP content type');

// ---- Agent readiness ----------------------------------------------------------------------
// 1. Missing pages are real 404s (never 200 with the app shell), including without a trailing slash.
for (const missing of ['/this-page-does-not-exist/', '/this-page-does-not-exist', '/a/b/c/', '/journal/a/b/c/', '/assets/missing-file.js']) {
  const response = await get(missing, 'nestarcadia.com');
  assert.equal(response.status, 404, missing + ' must return HTTP 404, got ' + response.status);
  assert.equal(response.location, null, missing + ' must not redirect before returning 404');
  if (!missing.startsWith('/assets/')) {
    assert.ok(response.body.includes('Page not found'), missing + ' must serve the 404 page body');
    assert.ok(response.body.includes('noindex'), missing + ' 404 page must be noindex');
    assert.ok(!response.body.includes('rel="canonical"'), missing + ' 404 page must not declare a canonical URL');
  }
}
const missingWww = await get('/this-page-does-not-exist', 'www.nestarcadia.com');
assert.equal(missingWww.status, 301, 'www host still redirects to the apex host first');
assert.equal((await get('/admin/', 'nestarcadia.com')).status, 200, '/admin/ must still serve the app shell');
// Journal articles published from the admin after the last build are rendered client-side.
assert.equal((await get('/journal/published-after-build/', 'nestarcadia.com')).status, 200, 'journal article slugs keep the app shell');
await expectRedirect('/admin', 'nestarcadia.com', 'https://nestarcadia.com/admin/');

// 2. About, contact and legal pages exist, are linked from the homepage HTML and are in the sitemap.
const homepage = await get('/', 'nestarcadia.com');
for (const link of ['/our-story/', '/contact/', '/terms/', '/privacy-policy/']) {
  assert.ok(homepage.body.includes('href="' + link + '"'), 'homepage HTML must link to ' + link);
  const page = await get(link, 'nestarcadia.com');
  assert.equal(page.status, 200, link + ' must return HTTP 200');
  assert.ok(sitemap.body.includes('https://nestarcadia.com' + link), 'sitemap must contain ' + link);
}

// 3. Markdown on request, HTML otherwise, caches told to vary on Accept.
const markdown = await get('/', 'nestarcadia.com', { accept: 'text/markdown' });
assert.equal(markdown.status, 200, 'homepage must return HTTP 200 for Accept: text/markdown');
assert.ok(markdown.contentType.startsWith('text/markdown'), 'homepage must be text/markdown, got ' + markdown.contentType);
assert.ok(markdown.body.startsWith('Tradition Meets Tomorrow') || markdown.body.includes('# Interior Designers'),
  'markdown body must contain the homepage content');
assert.ok(!markdown.body.includes('<div') && !markdown.body.includes('<script'), 'markdown body must not contain HTML markup');
assert.ok(/accept/i.test(String(markdown.headers.vary || '')), 'markdown response must send Vary: Accept');
const markdownRoute = await get('/interior-design-noida-extension/', 'nestarcadia.com', { accept: 'text/markdown, text/html;q=0.5' });
assert.ok(markdownRoute.contentType.startsWith('text/markdown'), 'route must be text/markdown for an agent Accept header');
const htmlAgain = await get('/', 'nestarcadia.com', { accept: 'text/html,application/xhtml+xml,*/*;q=0.8' });
assert.ok(htmlAgain.contentType.startsWith('text/html'), 'browsers must keep receiving HTML');
assert.ok(/accept/i.test(String(htmlAgain.headers.vary || '')), 'HTML response must send Vary: Accept');
const robots = await get('/robots.txt', 'nestarcadia.com');
assert.ok(robots.contentType.startsWith('text/plain'), 'robots.txt must be text/plain, got ' + robots.contentType);

// 4. MCP server card with identity, transport endpoint and capabilities.
const card = await get('/.well-known/mcp/server-card.json', 'nestarcadia.com');
assert.equal(card.status, 200, 'server card must return HTTP 200');
assert.ok(card.contentType.startsWith('application/json'), 'server card must be JSON');
const cardJson = JSON.parse(card.body);
assert.ok(cardJson.serverInfo?.name && cardJson.serverInfo?.version, 'server card needs serverInfo name and version');
assert.match(String(cardJson.endpoint), /^https:\/\//, 'server card needs an https endpoint');
assert.equal(cardJson.remotes?.[0]?.url, cardJson.endpoint, 'remotes[0].url must match endpoint');
assert.ok(cardJson.capabilities && Object.keys(cardJson.capabilities).length > 0, 'server card needs capabilities');

console.log('APACHE_REDIRECT_SMOKE', JSON.stringify({
  apexTrailingSlash: '301, one hop',
  wwwTrailingSlash: '301, one hop',
  legacyHomes: '301, one hop',
  previewHostIsolation: 'passed',
  canonicalHtml: '200',
  sitemap: '200',
  mobileHeroAsset: '200',
  missingPages: '404',
  aboutContactLegal: 'linked + 200',
  markdownNegotiation: 'text/markdown + Vary: Accept',
  mcpServerCard: 'serverInfo + endpoint + capabilities',
}));
