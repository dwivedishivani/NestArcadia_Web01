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
let homepageSiteMediaRequests = 0;
let homepageGtmRequests = 0;
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
  page.on('pageerror', (error) => pageErrors.push(error.message));
  page.on('request', (request) => {
    if (request.url().includes('/functions/v1/site-media/images')) homepageSiteMediaRequests += 1;
    if (request.url().includes('googletagmanager.com/gtm.js?id=GTM-T7R3TTP5')) homepageGtmRequests += 1;
  });
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
  await page.route(/^https:\/\/(www\.)?google-analytics\.com\//, (route) => route.abort());
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
  await page.waitForFunction(() => {
    const image = document.querySelector('main img[data-site-image-key="photo-1713192706971-03900dcf5706"]');
    return Boolean(image && image.complete && image.naturalWidth > 0);
  }, undefined, { timeout: 20000 });

  await page.waitForFunction(() => window.__nestarcadiaLcpMs !== null, undefined, { timeout: 10000 });
  // Lighthouse-style passive scrolling must not kick off analytics or the image
  // registry while the initial mobile page is still settling.
  await page.evaluate(() => window.dispatchEvent(new Event('scroll')));
  await page.waitForTimeout(250);
  assert.equal(homepageSiteMediaRequests, 0, 'passive homepage scroll unexpectedly loaded the image registry');
  assert.equal(homepageGtmRequests, 0, 'passive homepage scroll unexpectedly loaded Google Tag Manager');
  console.log('PASSIVE_SCROLL_SMOKE', JSON.stringify({
    siteMediaRequests: homepageSiteMediaRequests,
    gtmRequests: homepageGtmRequests,
  }));
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
  let gtmContainerStatus = null;
  const ga4MeasurementAttempts = [];
  const adsConversionAttempts = [];

  await tagPage.addInitScript(() => {
    try { localStorage.setItem('nestarcadia_consent_v2', 'denied'); } catch {}
  });

  tagPage.on('response', (response) => {
    if (response.url().includes('www.googletagmanager.com/gtm.js?id=GTM-T7R3TTP5')) {
      gtmContainerStatus = response.status();
    }
  });

  await tagPage.route(/^https:\/\/(www\.)?google-analytics\.com\//, async (route) => {
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
  // Trigger the real interaction-driven loader installed in index.html.
  await tagPage.evaluate(() => document.body.dispatchEvent(new MouseEvent('click', { bubbles: true })));

  const gtmDeadline = Date.now() + 10000;
  while (gtmContainerStatus === null && Date.now() < gtmDeadline) {
    await tagPage.waitForTimeout(200);
  }
  assert.equal(gtmContainerStatus, 200, `GTM container failed to load (HTTP ${gtmContainerStatus ?? 'no response'})`);

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
  while (ga4MeasurementAttempts.length === 0 && Date.now() < measurementDeadline) {
    await tagPage.waitForTimeout(200);
  }
  const ga4EventNames = ga4MeasurementAttempts.flatMap((url) => {
    try { return [new URL(url).searchParams.get('en')].filter(Boolean); }
    catch { return []; }
  });
  assert.ok(ga4EventNames.includes('generate_lead'),
    `GTM loaded but generate_lead never reached a GA4 collector; events=${JSON.stringify(ga4EventNames)}`);
  console.log('GTM_PATH_SMOKE', JSON.stringify({
    gtmContainerStatus,
    ga4MeasurementAttempts: ga4MeasurementAttempts.length,
    ga4EventNames,
    adsConversionAttempts: adsConversionAttempts.length,
    measurementNetworkBlocked: true,
  }));
  await tagContext.close();
} finally {
  await browser.close();
}
