import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';

const modulePath = process.env.PLAYWRIGHT_MODULE_PATH;
if (!modulePath) throw new Error('PLAYWRIGHT_MODULE_PATH must point to the installed Playwright entrypoint.');
const { chromium } = await import(pathToFileURL(modulePath).href);
const baseUrl = process.env.SMOKE_BASE_URL || 'http://127.0.0.1:4173';

const browser = await chromium.launch({
  headless: true,
  args: ['--no-sandbox', '--disable-blink-features=AutomationControlled'],
});
let mockedPayload;
const pageErrors = [];
const consoleErrors = [];
const failedRequests = [];

try {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
    locale: 'en-IN',
  });
  const page = await context.newPage();
  const heroAssetResponses = [];
  page.on('response', (response) => {
    if (/home-hero-(mobile|optimized)-v2\.webp/.test(response.url())) {
      heroAssetResponses.push({
        url: response.url(),
        status: response.status(),
        contentType: response.headers()['content-type'] || '',
        bytes: Number(response.headers()['content-length'] || 0),
      });
    }
  });
  page.on('pageerror', (error) => pageErrors.push(error.message));
  page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  page.on('requestfailed', (request) => failedRequests.push({ url: request.url(), error: request.failure()?.errorText || 'unknown' }));
  const cdp = await context.newCDPSession(page);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  await cdp.send('Network.enable');
  await cdp.send('Network.emulateNetworkConditions', {
    offline: false,
    latency: 150,
    downloadThroughput: 200 * 1024,
    uploadThroughput: 75 * 1024,
    connectionType: 'cellular3g',
  });

  await page.addInitScript(() => {
    try { localStorage.setItem('nestarcadia_consent_v2', 'denied'); } catch {}
    window.__nestarcadiaLcpMs = null;
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        if (entries.length) window.__nestarcadiaLcpMs = Math.round(entries[entries.length - 1].startTime);
      });
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
    } catch {}
    window.__nestarcadiaSmokeEvents = [];
    window.dataLayer = window.dataLayer || [];
    const originalPush = window.dataLayer.push.bind(window.dataLayer);
    window.dataLayer.push = function (...items) {
      for (const item of items) {
        if (item && typeof item === 'object' && !Array.isArray(item) && typeof item.event === 'string') {
          window.__nestarcadiaSmokeEvents.push({ event: item.event, detail: item });
        } else if (Object.prototype.toString.call(item) === '[object Arguments]' && item[0] === 'event') {
          window.__nestarcadiaSmokeEvents.push({ event: item[1], detail: item[2] || {}, source: 'gtag' });
        }
      }
      return originalPush(...items);
    };
  });

  // Isolate the form smoke from third-party tags. Regex route matchers account
  // for actual hostnames with "www." or provider subdomains.
  await page.route(/^https:\/\/www\.googletagmanager\.com\//, (route) => route.abort());
  // Block all collector subdomains as well (e.g. region1.google-analytics.com)
  // so smoke-test hits never reach production Analytics accounts.
  await page.route(/^https:\/\/([a-z0-9-]+\.)*google-analytics\.com\//i, (route) => route.abort());
  await page.route(/^https:\/\/analytics\.google\.com\//, (route) => route.abort());
  await page.route(/^https:\/\/(www\.)?googleadservices\.com\//, (route) => route.abort());
  await page.route(/^https:\/\/(www\.)?doubleclick\.net\//, (route) => route.abort());
  await page.route(/^https:\/\/pagead2\.googlesyndication\.com\/ccm\//, (route) => route.abort());
  await page.route(/^https:\/\/(www\.)?google\.com\/(pagead|ccm)\//, (route) => route.abort());

  await page.route('**/functions/v1/site-media/images*', async (route) => {
    const request = route.request();
    const origin = request.headers().origin || '*';
    const headers = {
      'access-control-allow-origin': origin,
      'access-control-allow-methods': 'GET, OPTIONS',
      'access-control-allow-headers': 'authorization, apikey, content-type, x-client-info',
      'access-control-max-age': '600',
      'content-type': 'application/json',
    };
    await route.fulfill({
      status: request.method() === 'OPTIONS' ? 204 : 200,
      headers,
      body: request.method() === 'OPTIONS' ? '' : JSON.stringify({ data: [] }),
    });
  });

  await page.route('**/rest/v1/enquiries_078be9eb*', async (route) => {
    const request = route.request();
    const origin = request.headers().origin || '*';
    const headers = {
      'access-control-allow-origin': origin,
      'access-control-allow-methods': 'POST, OPTIONS',
      'access-control-allow-headers': 'authorization, apikey, content-type, prefer, x-client-info',
      'access-control-max-age': '600',
      'content-type': 'application/json',
    };
    if (request.method() === 'OPTIONS') {
      await route.fulfill({ status: 204, headers, body: '' });
      return;
    }

    assert.equal(request.method(), 'POST', 'unexpected request method to lead endpoint');
    mockedPayload = request.postDataJSON();
    assert.ok(mockedPayload.id, 'client-generated lead id missing');
    assert.equal(mockedPayload.name, 'NestArcadia QA Smoke Test');
    assert.equal(mockedPayload.email, 'qa-smoke@example.invalid');
    assert.equal(mockedPayload.city, 'Noida');
    assert.equal(mockedPayload.project_type, 'Apartment / Flat');
    assert.equal(mockedPayload.source, 'start-your-project');
    assert.ok(!('status' in mockedPayload), 'public client must not set lead status');
    assert.ok(!('notes' in mockedPayload), 'public client must not set internal notes');

    // Mock a successful PostgREST insert with Prefer: return=minimal;
    // no synthetic production lead is created by this browser test.
    await route.fulfill({ status: 201, headers, body: '' });
  });

  await page.goto(baseUrl + '/', { waitUntil: 'load', timeout: 45000 });

  await page.waitForFunction(
    () => (window.__nestarcadiaSmokeEvents || []).some((item) => item.event === 'page_view'),
    undefined,
    { timeout: 10000 }
  );
  const bfcacheRestoreCheck = await page.evaluate(() => {
    const countPageViews = () => window.__nestarcadiaSmokeEvents
      .filter((item) => item.event === 'page_view').length;
    const before = countPageViews();

    window.dispatchEvent(new PageTransitionEvent('pagehide', { persisted: true }));
    window.dispatchEvent(new PageTransitionEvent('pageshow', { persisted: true }));
    const afterFirstRestore = countPageViews();

    // A duplicate pageshow without a new pagehide must not double-count.
    window.dispatchEvent(new PageTransitionEvent('pageshow', { persisted: true }));
    const afterDuplicateRestore = countPageViews();

    // A second real restore cycle must still count, even on the same pathname.
    window.dispatchEvent(new PageTransitionEvent('pagehide', { persisted: true }));
    window.dispatchEvent(new PageTransitionEvent('pageshow', { persisted: true }));
    const afterNextRestore = countPageViews();

    return { before, afterFirstRestore, afterDuplicateRestore, afterNextRestore };
  });
  assert.equal(bfcacheRestoreCheck.afterFirstRestore, bfcacheRestoreCheck.before + 1,
    'one page_view must be emitted for a persisted BFCache restore');
  assert.equal(bfcacheRestoreCheck.afterDuplicateRestore, bfcacheRestoreCheck.afterFirstRestore,
    'duplicate pageshow event must not emit another page_view');
  assert.equal(bfcacheRestoreCheck.afterNextRestore, bfcacheRestoreCheck.afterDuplicateRestore + 1,
    'a later BFCache restore cycle must emit one new page_view');
  console.log('BF_CACHE_RESTORE_SMOKE', JSON.stringify(bfcacheRestoreCheck));



  const homepageSourceResponse = await page.request.get(baseUrl + '/');
  assert.equal(homepageSourceResponse.status(), 200, 'homepage source must return HTTP 200');
  const homepageSource = await homepageSourceResponse.text();
  const serviceSourceResponse = await page.request.get(baseUrl + '/interior-design-services/');
  assert.equal(serviceSourceResponse.status(), 200, 'interior design services page must return HTTP 200');
  const serviceSource = await serviceSourceResponse.text();
  assert.ok(serviceSource.includes('<title>Interior Design Services in Noida'),
    'service page must expose its dedicated static title');

  const localServiceSourceResponse = await page.request.get(baseUrl + '/interior-design-greater-noida-west/');
  assert.equal(localServiceSourceResponse.status(), 200, 'Greater Noida West local service page must return HTTP 200');
  const localServiceSource = await localServiceSourceResponse.text();
  assert.ok(localServiceSource.includes('<title>Interior Designers in Greater Noida West | NestArcadia</title>'),
    'Greater Noida West page must expose its dedicated static title');

  for (const [routeName, source] of [
    ['services', serviceSource],
    ['Greater Noida West', localServiceSource],
  ]) {
    assert.ok(/<meta[^>]+property="og:image"/i.test(source),
      routeName + ' page is missing an Open Graph image');
    assert.ok(/<meta[^>]+name="twitter:image"/i.test(source),
      routeName + ' page is missing a Twitter preview image');
  }


  // App/home-screen icon contract: links, manifest and real image responses.
  for (const requiredLink of [
    'rel="icon" type="image/x-icon" href="/favicon.ico"',
    'rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"',
    'rel="manifest" href="/site.webmanifest"',
  ]) {
    assert.ok(homepageSource.includes(requiredLink), 'homepage is missing icon link: ' + requiredLink);
  }
  const faviconResponse = await page.request.get(baseUrl + '/favicon.ico');
  assert.equal(faviconResponse.status(), 200, 'favicon.ico must return HTTP 200');
  assert.match(faviconResponse.headers()['content-type'] || '', /^image\/(x-icon|vnd\.microsoft\.icon)/i,
    'favicon.ico must be served with an icon image MIME type');
  const faviconBytes = await faviconResponse.body();
  assert.deepEqual([...faviconBytes.subarray(0, 4)], [0, 0, 1, 0],
    'favicon.ico must contain a valid ICO header');

  const appManifestResponse = await page.request.get(baseUrl + '/site.webmanifest');
  assert.equal(appManifestResponse.status(), 200, 'site.webmanifest must return HTTP 200');
  const appManifest = await appManifestResponse.json();
  assert.equal(appManifest.name, 'NestArcadia Interiors', 'app manifest name mismatch');
  for (const expectedIcon of ['/android-chrome-192x192.png', '/android-chrome-512x512.png']) {
    assert.ok(appManifest.icons?.some((icon) => icon.src === expectedIcon), 'manifest is missing icon: ' + expectedIcon);
  }
  for (const iconPath of ['/apple-touch-icon.png', '/android-chrome-192x192.png', '/android-chrome-512x512.png', '/favicon-32x32.png']) {
    const iconResponse = await page.request.get(baseUrl + iconPath);
    assert.equal(iconResponse.status(), 200, 'app icon must return HTTP 200: ' + iconPath);
    assert.ok((iconResponse.headers()['content-type'] || '').startsWith('image/png'), 'app icon has wrong MIME type: ' + iconPath);
  }
  const initialH1Count = (homepageSource.match(/<h1[ >]/gi) || []).length;
  assert.equal(initialH1Count, 1, 'homepage initial HTML must contain one semantic H1');
  assert.ok(homepageSource.includes('<p class="boot-heading" aria-hidden="true">'),
    'temporary boot overlay must not introduce a second semantic heading');
  const homepageSchemaText = homepageSource.match(/<script id="nestarcadia-schema" type="application\/ld\+json">([\s\S]*?)<\/script>/i)?.[1];
  assert.ok(homepageSchemaText, 'homepage must contain initial business JSON-LD');
  const homepageSchema = JSON.parse(homepageSchemaText);
  const businessEntity = homepageSchema['@graph']?.find((entity) => entity['@id'] === 'https://nestarcadia.com/#business');
  assert.ok(businessEntity, 'homepage JSON-LD must include the NestArcadia business entity');
  assert.deepEqual(businessEntity.areaServed, ['Greater Noida West', 'Noida Extension', 'Greater Noida', 'Noida'],
    'business entity areaServed must match the four priority local markets');
  assert.deepEqual(businessEntity.address, {
    '@type': 'PostalAddress',
    streetAddress: 'G-59, Fusion Ufairia Mall, Sector 16B',
    addressLocality: 'Greater Noida West',
    addressRegion: 'Uttar Pradesh',
    postalCode: '201310',
    addressCountry: 'IN',
  }, 'business entity must expose the owner-confirmed NestArcadia office address');
  const footerText = await page.locator('footer').innerText();
  assert.ok(footerText.includes('G-59, Fusion Ufairia Mall, Sector 16B'),
    'visible footer must display the owner-confirmed office address');
  assert.equal(await page.locator('footer a[href^="https://www.google.com/maps/search/"]').count(), 1,
    'footer must provide exactly one office directions link');
  const homepageStatic = homepageSource.match(/<main id="na-seo-static-content"[^>]*>([\s\S]*?)<\/main>/i)?.[1] || '';
  const homepageStaticWords = homepageStatic.replace(/<[^>]+>/g, ' ').replace(/&(?:amp|lt|gt|quot|#39);/g, ' ').split(/\s+/).filter(Boolean).length;
  assert.ok(homepageStaticWords >= 180, `homepage raw HTML SEO content is too thin (${homepageStaticWords} words)`);
  assert.ok(homepageStatic.includes('Residential Interior Designers in Noida Extension and Greater Noida West'),
    'homepage raw HTML is missing its main residential service/location section');

  const residentialSourceResponse = await page.request.get(baseUrl + '/interior-design-noida-extension/');
  assert.equal(residentialSourceResponse.status(), 200, 'residential page source must return HTTP 200');
  const residentialSource = await residentialSourceResponse.text();
  assert.ok(residentialSource.includes('<title>Interior Designers in Noida Extension | NestArcadia</title>'),
    'Noida Extension raw HTML title should be unique and keyword-specific');
  const residentialStatic = residentialSource.match(/<main id="na-seo-static-content"[^>]*>([\s\S]*?)<\/main>/i)?.[1] || '';
  const residentialStaticWords = residentialStatic.replace(/<[^>]+>/g, ' ').replace(/&(?:amp|lt|gt|quot|#39);/g, ' ').split(/\s+/).filter(Boolean).length;
  assert.ok(residentialStaticWords >= 220, `Noida Extension raw HTML SEO content is too thin (${residentialStaticWords} words)`);
  assert.ok(residentialStatic.includes('How much does a 2BHK or 3BHK interior cost in Noida Extension?'),
    'residential HTML snapshot is missing the page-specific budget FAQ');
  console.log('STATIC_HTML_SEO_SMOKE', JSON.stringify({
    homepageWords: homepageStaticWords,
    noidaExtensionWords: residentialStaticWords,
    homepageStatus: homepageSourceResponse.status(),
    residentialStatus: residentialSourceResponse.status(),
  }));

  await page.locator('a[href="/interior-design-greater-noida/"]').first().waitFor({ state: 'attached', timeout: 15000 });
  const requiredHomepageServiceLinks = [
    '/interior-design-noida-extension/',
    '/interior-design-greater-noida-west/',
    '/interior-design-noida/',
    '/interior-design-greater-noida/',
  ];
  const homepageHrefValues = await page.locator('a[href^="/"]').evaluateAll((anchors) =>
    anchors.map((anchor) => anchor.getAttribute('href'))
  );
  for (const requiredLink of requiredHomepageServiceLinks) {
    assert.ok(homepageHrefValues.includes(requiredLink), 'homepage is missing contextual service link: ' + requiredLink);
  }
  for (const budgetGuideLink of [
    '/journal/2bhk-interior-cost-noida-extension/',
    '/journal/3bhk-interior-cost-greater-noida-west/',
  ]) {
    assert.ok(homepageHrefValues.includes(budgetGuideLink), 'homepage is missing a high-intent budget guide link: ' + budgetGuideLink);
  }
  const footerServiceAreaLinks = await page.locator('nav[aria-label="NestArcadia service areas"] a').evaluateAll((anchors) =>
    anchors.map((anchor) => anchor.getAttribute('href'))
  );
  assert.deepEqual(footerServiceAreaLinks, requiredHomepageServiceLinks,
    'footer service-area links must prioritise only the four core Noida markets');
  const nonCanonicalHomepageLinks = await page.locator('a[href^="/"]').evaluateAll((anchors) =>
    anchors.map((anchor) => anchor.getAttribute('href')).filter((href) => {
      if (!href) return false;
      const pathname = href.split(/[?#]/)[0];
      return pathname !== '/' && !pathname.endsWith('/') && !/\.[a-z0-9]{2,5}$/i.test(pathname);
    })
  );
  assert.deepEqual(nonCanonicalHomepageLinks, [],
    'homepage internal route links must use the trailing-slash canonical URL');
  console.log('INTERNAL_LINK_CANONICAL_SMOKE', JSON.stringify({
    checkedLinks: await page.locator('a[href^="/"]').count(),
    nonCanonicalLinks: nonCanonicalHomepageLinks,
  }));

  const journalSourceResponse = await page.request.get(baseUrl + '/journal/rattan/');
  assert.equal(journalSourceResponse.status(), 200, 'Journal article source must return HTTP 200');
  const journalSource = await journalSourceResponse.text();
  const journalStatic = journalSource.match(/<main id="na-seo-static-content"[^>]*>([\s\S]*?)<\/main>/i)?.[1] || '';
  for (const requiredLink of [
    'href="/interior-design-noida-extension/"',
    'href="/interior-design-greater-noida-west/"',
    'href="/interior-design-services/"',
  ]) {
    assert.ok(journalStatic.includes(requiredLink), 'Journal raw HTML is missing local service link: ' + requiredLink);
  }
  console.log('JOURNAL_INTERNAL_LINK_SMOKE', JSON.stringify({
    status: journalSourceResponse.status(),
    noidaExtensionLink: true,
    greaterNoidaWestLink: true,
    turnkeyServicesLink: true,
  }));


  const staticRouteChecks = [
    ['/', 'Interior Budget Guides for 2BHK and 3BHK Homes'],
    ['/design-cultures/', 'Regional inspiration, interpreted for modern homes'],
    ['/interior-design-services/', 'Residential interior design'],
    ['/our-story/', 'A design approach rooted in how people live'],
    ['/our-projects/', 'Selected home concepts and interior design studies'],
    ['/journal/2bhk-interior-cost-noida-extension/', '2BHK Interior Cost in Noida Extension'],
    ['/journal/3bhk-interior-cost-greater-noida-west/', '3BHK Interior Cost in Greater Noida West'],
    ['/start-your-project/', 'Tell us about your property'],
    ['/faqs/', 'Which areas does NestArcadia serve?'],
    ['/interior-design-greater-noida/', 'Good interiors begin with the way a space is actually used.'],
    ['/interior-design-dadri/', 'Design should respond to the home, not force a template onto it.'],
    ['/interior-design-yamuna-expressway/', 'Plan the interior before the property starts dictating the decisions.'],
    ['/journal/luxury-interior-design-noida-extension/', '5 Core Elements of High-End Residential Interiors'],
  ];
  for (const [route, expectedContent] of staticRouteChecks) {
    const response = await page.request.get(baseUrl + route);
    assert.equal(response.status(), 200, route + ' must return HTTP 200');
    const html = await response.text();
    assert.ok(html.includes('href="https://nestarcadia.com' + route + '"'), route + ' must have its canonical URL');
    assert.ok(html.includes(expectedContent), route + ' must contain its page-specific static content');
    assert.ok(html.includes('"@type":"WebPage"'), route + ' must contain route-specific WebPage JSON-LD');
    if (route === '/faqs/') {
      assert.ok(html.includes('"@type":"FAQPage"'), 'FAQ route must contain FAQPage JSON-LD');
      assert.ok(html.includes("primary service focus is Noida Extension and Greater Noida West"),
        'FAQ route must communicate the priority local service areas accurately');
    }
    if (route === '/interior-design-services/') {
      assert.ok(html.includes('"@type":"Service"'), 'services route must contain route-specific Service JSON-LD');
      assert.ok(html.includes('Noida Extension and Greater Noida West'), 'services schema must reinforce the primary service areas');
    }
    if (route === '/') {
      assert.ok(html.includes('/journal/2bhk-interior-cost-noida-extension/'), 'static homepage must link to the 2BHK cost guide');
      assert.ok(html.includes('/journal/3bhk-interior-cost-greater-noida-west/'), 'static homepage must link to the 3BHK cost guide');
    }
    if (route === '/our-projects/') {
      assert.ok(html.includes('Selected home concepts and interior design studies'), 'portfolio route must clearly label design concepts');
    }
    if (route.includes('/journal/2bhk-interior-cost-noida-extension/') || route.includes('/journal/3bhk-interior-cost-greater-noida-west/')) {
      assert.ok(html.includes('"@type":"BlogPosting"'), 'new interior cost guide must contain BlogPosting JSON-LD');
      assert.ok(html.includes('"datePublished":"2026-11-02"'), 'new interior cost guide must expose its publication date');
      assert.ok(html.includes('"author":{"@type":"Organization","name":"NestArcadia","url":"https://nestarcadia.com"}'),
        'NestArcadia editorial guides must identify the organization as their author');
    }
    if (route.includes('/journal/luxury-interior-design-noida-extension/')) {
      assert.ok(html.includes('"@type":"BlogPosting"'), 'published journal article must contain BlogPosting JSON-LD');
      assert.ok(!html.includes('data:image/'), 'static article HTML must not embed a base64 image');
    }
  }
  console.log('CORE_STATIC_SEO_ROUTES_SMOKE', JSON.stringify({
    routesChecked: staticRouteChecks.length,
    allStatus200: true,
    uniqueCanonicalAndSchema: true,
    publishedArticleSnapshot: true,
  }));


  const journalFeedResponsePromise = page.waitForResponse((response) =>
    response.url().includes('/rest/v1/blogs_078be9eb') && response.request().method() === 'GET'
  );
  await page.goto(baseUrl + '/journal/');
  const journalFeedResponse = await journalFeedResponsePromise;
  assert.equal(journalFeedResponse.status(), 200, 'published journal feed must return HTTP 200');
  const journalFeedBody = await journalFeedResponse.text();
  assert.ok(!journalFeedBody.includes('data:image/'), 'journal feed must not transfer embedded base64 cover images');
  const luxuryArticleLink = page.locator('a[href="/journal/luxury-interior-design-noida-extension/"]').first();
  await luxuryArticleLink.waitFor({ state: 'visible' });
  const luxuryArticleImage = luxuryArticleLink.locator('img').first();
  assert.ok((await luxuryArticleImage.getAttribute('src'))?.length, 'bundled journal article must have a non-empty cover image source');
  const nonCanonicalJournalLinks = await page.locator('a[href^="/journal/"]').evaluateAll((anchors) =>
    anchors.map((anchor) => anchor.getAttribute('href')).filter((href) => {
      if (!href || href === '/journal/') return false;
      const pathname = href.split(/[?#]/)[0];
      return !pathname.endsWith('/');
    })
  );
  assert.deepEqual(nonCanonicalJournalLinks, [], 'journal article links must use trailing-slash canonical URLs');
  await luxuryArticleLink.click();
  await page.waitForURL((url) => url.pathname === '/journal/luxury-interior-design-noida-extension/');
  await page.getByRole('heading', { name: /Luxury Interior Design in Noida Extension/i }).waitFor({ state: 'visible' });
  console.log('JOURNAL_RUNTIME_SMOKE', JSON.stringify({
    feedStatus: journalFeedResponse.status(),
    noBase64ImagePayload: true,
    articleCoverPresent: true,
    canonicalArticleLinks: true,
    canonicalClientNavigation: true,
  }));

  // Exercise the project-gallery lazy chunk directly. The homepage smoke alone
  // cannot detect a missing/stale Homes bundle, which previously surfaced as the
  // generic "Something interrupted this page" route error.
  const projectsResponse = await page.goto(baseUrl + '/our-projects/', {
    waitUntil: 'domcontentloaded',
    timeout: 45000,
  });
  assert.equal(projectsResponse?.status(), 200, 'Our Projects route must serve HTTP 200');
  await page.getByRole('heading', { name: 'Our Projects', exact: true }).waitFor({ timeout: 15000 });
  assert.equal(await page.title(), 'Our Projects | NestArcadia Interior Design',
    'Our Projects route should use its unique page title');
  assert.ok(!pageErrors.length, `Our Projects route raised browser errors: ${pageErrors.join('; ')}`);
  console.log('PROJECTS_ROUTE_SMOKE', JSON.stringify({
    status: projectsResponse?.status(),
    title: await page.title(),
    heading: 'Our Projects',
    browserErrors: pageErrors,
  }));

  // Return to the homepage before the mobile hero/LCP assertions below.
  await page.goto(baseUrl + '/', { waitUntil: 'load', timeout: 45000 });

  const sitemapResponse = await page.request.get(baseUrl + '/sitemap.xml');
  assert.equal(sitemapResponse.status(), 200, 'sitemap.xml must return HTTP 200');
  const sitemapText = await sitemapResponse.text();
  const sitemapUrls = [...sitemapText.matchAll(/<loc>(https:\/\/nestarcadia\.com\/[^<]*)<\/loc>/g)].map((match) => match[1]);
  assert.ok(sitemapUrls.length >= 50, `expected at least 50 sitemap URLs, found ${sitemapUrls.length}`);
  assert.ok(sitemapUrls.every((url) => {
    const pathname = url.slice('https://nestarcadia.com'.length);
    return pathname === '/' || pathname.endsWith('/');
  }), 'sitemap contains non-canonical URLs without a trailing slash');
  console.log('SITEMAP_CANONICAL_SMOKE', JSON.stringify({ sitemapStatus: sitemapResponse.status(), urls: sitemapUrls.length, allCanonical: true }));

  // Redirects are owned by Hostinger's Apache .htaccess, not Vite preview.
  // Exercise them only against the live production host; local build smoke still
  // validates static HTML, sitemap URLs and canonical metadata.
  const smokeHostname = new URL(baseUrl).hostname;
  if (!['localhost', '127.0.0.1', '::1'].includes(smokeHostname)) {
    for (const routePath of [
      '/interior-design-noida-extension',
      '/interior-design-greater-noida-west',
    ]) {
      const redirectResponse = await page.request.get(baseUrl + routePath, { maxRedirects: 0 });
      assert.equal(redirectResponse.status(), 301, `expected a permanent trailing-slash redirect for ${routePath}`);
      const redirectLocation = new URL(redirectResponse.headers()['location'], baseUrl);
      assert.equal(redirectLocation.origin, 'https://nestarcadia.com', `redirect must use the apex HTTPS host for ${routePath}`);
      assert.equal(redirectLocation.pathname, routePath + '/', `redirect must add only the canonical trailing slash for ${routePath}`);
    }
    console.log('TRAILING_SLASH_REDIRECT_SMOKE', JSON.stringify({
      noidaExtension: '301 to slash URL',
      greaterNoidaWest: '301 to slash URL',
    }));
  } else {
    console.log('TRAILING_SLASH_REDIRECT_SMOKE', JSON.stringify({
      skipped: 'Vite preview does not execute Hostinger .htaccess; live production smoke verifies redirects',
    }));
  }
  await page.waitForFunction(() => {
    const image = document.querySelector('main img[data-site-image-key="photo-1713192706971-03900dcf5706"]');
    return Boolean(image && image.complete && image.naturalWidth > 0);
  }, undefined, { timeout: 20000 });

  const imageDiagnostics = await page.locator('main img').evaluateAll((images) => images.slice(0, 18).map((image) => ({
    key: image.getAttribute('data-site-image-key'),
    src: image.getAttribute('src'),
    srcset: image.getAttribute('srcset'),
  })));
  const responsiveImageCount = await page.locator('img[data-site-image-key][srcset*="/images/responsive/"]').count();
  console.log('RESPONSIVE_SRCSET_DIAGNOSTIC', JSON.stringify({ responsiveImageCount, images: imageDiagnostics }));
  assert.ok(responsiveImageCount >= 5, 'homepage is not using responsive local image variants');
  const firstSrcSet = await page.locator('img[data-site-image-key][srcset*="/images/responsive/"]').first().getAttribute('srcset');
  const firstCandidate = firstSrcSet?.split(',')[0]?.trim().split(' ')[0];
  assert.ok(firstCandidate, 'responsive image srcset has no usable candidate');
  const responsiveImageResponse = await page.request.get(new URL(firstCandidate, baseUrl).toString());
  assert.equal(responsiveImageResponse.status(), 200, 'responsive WebP candidate must return HTTP 200');
  assert.ok((responsiveImageResponse.headers()['content-type'] || '').startsWith('image/webp'), 'responsive image candidate must be served as WebP');
  console.log('APP_ICONS_AND_RESPONSIVE_IMAGES_SMOKE', JSON.stringify({
    manifestIcons: appManifest.icons.length,
    responsiveImageCount,
    responsiveCandidate: firstCandidate,
  }));

  await page.waitForFunction(() => window.__nestarcadiaLcpMs !== null, undefined, { timeout: 10000 });
  const heroMetrics = await page.evaluate(() => {
    const image = document.querySelector('main img[data-site-image-key="photo-1713192706971-03900dcf5706"]');
    return {
      heroLoaded: Boolean(image && image.complete && image.naturalWidth > 0),
      heroWidth: image?.naturalWidth || 0,
      currentSrc: image?.currentSrc || '',
      lcpMs: window.__nestarcadiaLcpMs,
    };
  });
  heroMetrics.assetResponses = heroAssetResponses;
  assert.equal(heroMetrics.heroLoaded, true, 'homepage hero image did not load');
  assert.ok(heroMetrics.currentSrc.includes('/images/home-hero-mobile-v2.webp'), `mobile viewport did not select optimized mobile hero: ${heroMetrics.currentSrc}`);
  assert.ok(heroMetrics.lcpMs < 4500, `simulated mobile LCP exceeded 4.5 seconds: ${heroMetrics.lcpMs} ms`);
  console.log('MOBILE_HERO_SMOKE', JSON.stringify(heroMetrics));
  const residentialResponse = await page.goto(baseUrl + '/interior-design-noida-extension/', { waitUntil: 'domcontentloaded', timeout: 45000 });
  assert.equal(residentialResponse?.status(), 200, 'Noida Extension residential page must serve HTTP 200');
  await page.waitForFunction(() => document.querySelector('link[rel="canonical"]')?.getAttribute('href') === 'https://nestarcadia.com/interior-design-noida-extension/' && document.title === 'Interior Designers in Noida Extension | NestArcadia', undefined, { timeout: 10000 });
  assert.equal(await page.title(), 'Interior Designers in Noida Extension | NestArcadia',
    'residential route should use its unique primary local SEO title');
  console.log('RESIDENTIAL_SEO_ROUTE_SMOKE', JSON.stringify({
    status: residentialResponse?.status(),
    canonical: await page.locator('link[rel="canonical"]').getAttribute('href'),
    title: await page.title(),
  }));

  await page.goto(baseUrl + '/start-your-project', { waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.getByPlaceholder('Full Name *').fill('NestArcadia QA Smoke Test');
  await page.getByPlaceholder('Email Address *').fill('qa-smoke@example.invalid');
  await page.getByPlaceholder('Phone Number *').fill('9876543210');
  await page.getByRole('combobox').selectOption('Noida');
  await page.getByRole('button', { name: 'Apartment / Flat', exact: true }).click();
  await page.getByRole('button', { name: '2 BHK', exact: true }).click();
  await page.getByRole('button', { name: 'Not sure yet', exact: true }).click();
  await page.getByRole('button', { name: 'Just Exploring', exact: true }).click();
  await page.getByRole('button', { name: 'Contemporary Minimal', exact: true }).click();
  await page.getByRole('button', { name: /Submit Your Brief/ }).click();
  try {
    await page.getByText('We will be in touch.', { exact: true }).waitFor({ timeout: 20000 });
  } catch (error) {
    const debugState = await page.evaluate(() => ({
      submissionError: document.querySelector('[role="alert"]')?.textContent || null,
      queuedEvents: window.__nestarcadiaSmokeEvents,
    }));
    console.error('LEAD_FORM_DEBUG', JSON.stringify({
      debugState, mockedPayload, pageErrors, consoleErrors, failedRequests,
    }));
    throw error;
  }

  const events = await page.evaluate(() => window.__nestarcadiaSmokeEvents);
  assert.ok(events.some((event) => event.event === 'lead_submit'), 'dataLayer lead_submit event was not emitted');
  const ga4Event = events.find((event) => event.event === 'generate_lead');
  assert.ok(ga4Event, 'GA4 generate_lead event was not queued');
  assert.equal(ga4Event.detail?.send_to, 'G-LDM2YL1MP5', 'generate_lead destination ID mismatch');
  assert.ok(mockedPayload, 'form did not call the expected lead endpoint');
  assert.ok(!pageErrors.length, `browser page errors: ${pageErrors.join('; ')}`);

  console.log('LEAD_FORM_SMOKE', JSON.stringify({
    successMessage: true,
    postgrestPayloadShape: true,
    dataLayerLeadSubmit: true,
    ga4GenerateLeadQueued: true,
    realAnalyticsNetworkBlocked: true,
    pageErrors,
  }));

  // Separate GTM-only smoke: the real container is allowed to load, but every
  // downstream GA4 / Ads collector is intercepted and aborted before any event
  // can reach the analytics accounts.
  const tagContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    locale: 'en-IN',
  });
  const tagPage = await tagContext.newPage();
  let gtmContainerRequested = false;
  let gtmContainerStatus = null;
  const ga4MeasurementAttempts = [];
  const adsConversionAttempts = [];

  await tagPage.addInitScript(() => {
    try { localStorage.setItem('nestarcadia_consent_v2', 'denied'); } catch {}
  });

  tagPage.on('request', (request) => {
    if (request.url().includes('www.googletagmanager.com/gtm.js?id=GTM-T7R3TTP5')) {
      gtmContainerRequested = true;
    }
  });
  tagPage.on('response', (response) => {
    if (response.url().includes('www.googletagmanager.com/gtm.js?id=GTM-T7R3TTP5')) {
      gtmContainerStatus = response.status();
    }
  });

  // Catch the root, www, and regional GA4 collectors; Google may choose a
  // region-specific host, which must still be blocked and captured in this test.
  await tagPage.route(/^https:\/\/([a-z0-9-]+\.)*google-analytics\.com\//i, async (route) => {
    ga4MeasurementAttempts.push(route.request().url());
    await route.abort();
  });
  await tagPage.route(/^https:\/\/analytics\.google\.com\//, async (route) => {
    ga4MeasurementAttempts.push(route.request().url());
    await route.abort();
  });
  await tagPage.route(/^https:\/\/pagead2\.googlesyndication\.com\/ccm\//, async (route) => {
    adsConversionAttempts.push(route.request().url());
    await route.abort();
  });
  await tagPage.route(/^https:\/\/(www\.)?googleadservices\.com\//, async (route) => {
    adsConversionAttempts.push(route.request().url());
    await route.abort();
  });
  await tagPage.route(/^https:\/\/(www\.)?doubleclick\.net\//, async (route) => {
    adsConversionAttempts.push(route.request().url());
    await route.abort();
  });
  await tagPage.route(/^https:\/\/(www\.)?google\.com\/(pagead|ccm)\//, async (route) => {
    adsConversionAttempts.push(route.request().url());
    await route.abort();
  });

  await tagPage.goto(baseUrl + '/start-your-project', { waitUntil: 'domcontentloaded', timeout: 45000 });
  // Do not simulate input here: this path verifies passive page-load/idle loading.
  // User-triggered loading is covered by the loader's explicit interaction listeners.

  const gtmDeadline = Date.now() + 10000;
  while (!gtmContainerRequested && Date.now() < gtmDeadline) {
    await tagPage.waitForTimeout(200);
  }
  assert.equal(gtmContainerRequested, true, 'GTM loader did not request the configured container');
  if (gtmContainerStatus !== null) {
    assert.equal(gtmContainerStatus, 200, `GTM container returned HTTP ${gtmContainerStatus}`);
  }

  await tagPage.evaluate(() => {
    window.gtag?.('consent', 'update', {
      ad_storage: 'granted',
      ad_user_data: 'granted',
      ad_personalization: 'granted',
      analytics_storage: 'granted',
    });
    window.dataLayer.push({
      event: 'lead_submit',
      lead_source: 'smoke-test',
      page_path: window.location.pathname,
    });
    window.gtag?.('event', 'generate_lead', {
      lead_source: 'smoke-test',
      page_path: window.location.pathname,
      send_to: 'G-LDM2YL1MP5',
    });
  });

  const measurementDeadline = Date.now() + 10000;
  const isGenerateLeadRequest = (url) => {
    try { return new URL(url).searchParams.get('en') === 'generate_lead'; }
    catch { return false; }
  };
  // Wait for the specific conversion event, not a page_view already in flight.
  while (gtmContainerStatus === 200 && !ga4MeasurementAttempts.some(isGenerateLeadRequest) && Date.now() < measurementDeadline) {
    await tagPage.waitForTimeout(200);
  }
  const ga4EventNames = ga4MeasurementAttempts.flatMap((url) => {
    try { return [new URL(url).searchParams.get('en')].filter(Boolean); }
    catch { return []; }
  });

  if (gtmContainerStatus === 200) {
    assert.ok(ga4EventNames.includes('generate_lead'),
      `GTM loaded but generate_lead never reached a GA4 collector; events=${JSON.stringify(ga4EventNames)}`);
  } else {
    // Some CI runners cannot complete Google's third-party request even though
    // the site correctly injects the configured GTM URL. In that case, verify
    // the GTM request and local dataLayer queue rather than treating network
    // egress to Google as an application failure.
    const queuedEvents = await tagPage.evaluate(() => {
      const entries = Array.from(window.dataLayer || []);
      return {
        gtmStart: entries.some((entry) => entry && typeof entry === 'object' && entry.event === 'gtm.js'),
        leadSubmit: entries.some((entry) => entry && typeof entry === 'object' && entry.event === 'lead_submit'),
        generateLead: entries.some((entry) =>
          Object.prototype.toString.call(entry) === '[object Arguments]' &&
          entry[0] === 'event' &&
          entry[1] === 'generate_lead'
        ),
      };
    });
    assert.equal(queuedEvents.gtmStart, true, 'GTM start event was not queued');
    assert.equal(queuedEvents.leadSubmit, true, 'lead_submit was not queued while GTM was unreachable');
    assert.equal(queuedEvents.generateLead, true, 'generate_lead was not queued while GTM was unreachable');
    console.warn('GTM_EXTERNAL_NETWORK_UNAVAILABLE', JSON.stringify({ gtmContainerRequested, queuedEvents }));
  }

  console.log('GTM_PATH_SMOKE', JSON.stringify({
    gtmContainerRequested,
    gtmContainerStatus: gtmContainerStatus ?? 'no-response-from-third-party',
    ga4MeasurementAttempts: ga4MeasurementAttempts.length,
    ga4EventNames,
    adsConversionAttempts: adsConversionAttempts.length,
    measurementNetworkBlocked: true,
  }));
  await tagContext.close();
} finally {
  await browser.close();
}
