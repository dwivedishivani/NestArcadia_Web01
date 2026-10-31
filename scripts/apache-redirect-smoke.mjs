import assert from 'node:assert/strict';
import { request } from 'node:http';

function get(path, host = 'nestarcadia.com') {
  return new Promise((resolve, reject) => {
    const req = request({
      hostname: '127.0.0.1',
      port: 80,
      path,
      method: 'GET',
      headers: { host },
    }, (res) => {
      const chunks = [];
      res.setEncoding('utf8');
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => resolve({
        status: res.statusCode,
        location: res.headers.location || null,
        contentType: res.headers['content-type'] || '',
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
assert.equal(previewLegacy.status, 200,
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

console.log('APACHE_REDIRECT_SMOKE', JSON.stringify({
  apexTrailingSlash: '301, one hop',
  wwwTrailingSlash: '301, one hop',
  legacyHomes: '301, one hop',
  previewHostIsolation: 'passed',
  canonicalHtml: '200',
  sitemap: '200',
  mobileHeroAsset: '200',
}));
