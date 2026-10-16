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

try {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
    locale: 'en-IN',
  });
  const page = await context.newPage();
  page.on('pageerror', (error) => pageErrors.push(error.message));
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
    try { localStorage.setItem('nestarcadia_consent_v2', 'granted'); } catch {}
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

  // Load the real GTM container, but block all downstream measurement requests:
  // this verifies tag wiring without sending a fake conversion to GA4 or Google Ads.
  let gtmContainerStatus = null;
  const ga4MeasurementAttempts = [];
  const adsConversionAttempts = [];
  page.on('response', (response) => {
    const url = response.url();
    if (url.includes('googletagmanager.com/gtm.js?id=GTM-T7R3TTP5')) {
      gtmContainerStatus = response.status();
    }
  });

  for (const pattern of [
    '**/google-analytics.com/**',
    '**/analytics.google.com/**',
    '**/g/collect*',
  ]) {
    await page.route(pattern, async (route) => {
      ga4MeasurementAttempts.push(route.request().url());
      await route.abort();
    });
  }
  for (const pattern of [
    '**/googleadservices.com/**',
    '**/doubleclick.net/**',
    '**/google.com/pagead/**',
    '**/google.com/ccm/**',
  ]) {
    await page.route(pattern, async (route) => {
      adsConversionAttempts.push(route.request().url());
      await route.abort();
    });
  }

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
  await page.waitForFunction(() => {
    const image = document.querySelector('main img[data-site-image-key="photo-1713192706971-03900dcf5706"]');
    return Boolean(image && image.complete && image.naturalWidth > 0);
  }, undefined, { timeout: 20000 });

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
  assert.equal(heroMetrics.heroLoaded, true, 'homepage hero image did not load');
  assert.ok(heroMetrics.currentSrc.includes('/images/home-hero-mobile-v2.webp'), `mobile viewport did not select optimized mobile hero: ${heroMetrics.currentSrc}`);
  assert.ok(heroMetrics.lcpMs < 4500, `simulated mobile LCP exceeded 4.5 seconds: ${heroMetrics.lcpMs} ms`);
  console.log('MOBILE_HERO_SMOKE', JSON.stringify(heroMetrics));

  await page.goto(baseUrl + '/start-your-project', { waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.getByPlaceholder('Full Name *').click(); // deliberately trigger GTM's real interaction loader\n  await page.getByPlaceholder('Full Name *').fill('NestArcadia QA Smoke Test');
  await page.getByPlaceholder('Email Address *').fill('qa-smoke@example.invalid');
  await page.getByPlaceholder('Phone Number *').fill('9876543210');
  await page.getByRole('combobox').selectOption('Noida');
  await page.getByRole('button', { name: 'Apartment / Flat', exact: true }).click();
  await page.getByRole('button', { name: '2 BHK', exact: true }).click();
  await page.getByRole('button', { name: 'Not sure yet', exact: true }).click();
  await page.getByRole('button', { name: 'Just Exploring', exact: true }).click();
  await page.getByRole('button', { name: 'Contemporary Minimal', exact: true }).click();
  await page.getByRole('button', { name: /Submit Your Brief/ }).click();
  await page.getByText('We will be in touch.', { exact: true }).waitFor({ timeout: 15000 });

  const events = await page.evaluate(() => window.__nestarcadiaSmokeEvents);
  assert.ok(events.some((event) => event.event === 'lead_submit'), 'dataLayer lead_submit event was not emitted');
  const ga4Event = events.find((event) => event.event === 'generate_lead');
  assert.ok(ga4Event, 'GA4 generate_lead event was not queued');
  assert.equal(ga4Event.detail?.send_to, 'G-LDM2YL1MP5', 'generate_lead destination ID mismatch');
  assert.ok(mockedPayload, 'form did not call the expected lead endpoint');
  // Wait briefly for the actual container to process the queued events. Measurement
  // endpoints above are intercepted, so this cannot create a real conversion.
  const trackingDeadline = Date.now() + 8000;
  while ((gtmContainerStatus === null || ga4MeasurementAttempts.length === 0) && Date.now() < trackingDeadline) {
    await page.waitForTimeout(200);
  }
  assert.equal(gtmContainerStatus, 200, `GTM container failed to load (HTTP ${gtmContainerStatus ?? 'no response'})`);
  assert.ok(ga4MeasurementAttempts.length > 0, 'GTM did not attempt a GA4 measurement request after lead submission');
  assert.ok(!pageErrors.length, `browser page errors: ${pageErrors.join('; ')}`);

  console.log('LEAD_FORM_SMOKE', JSON.stringify({
    successMessage: true,
    postgrestPayloadShape: true,
    dataLayerLeadSubmit: true,
    ga4GenerateLeadQueued: true,
    gtmContainerStatus,
    ga4MeasurementAttempts: ga4MeasurementAttempts.length,
    adsConversionAttempts: adsConversionAttempts.length,
    measurementNetworkBlocked: true,
    pageErrors,
  }));
} finally {
  await browser.close();
}
