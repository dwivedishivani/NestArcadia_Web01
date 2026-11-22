import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';

const modulePath = process.env.PLAYWRIGHT_MODULE_PATH;
if (!modulePath) throw new Error('PLAYWRIGHT_MODULE_PATH must point to the installed Playwright entrypoint.');
const { chromium } = await import(pathToFileURL(modulePath).href);
const baseUrl = process.env.SMOKE_BASE_URL || 'https://nestarcadia.com';
const runToken = `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
const qaEmail = `qa-live-smoke+${runToken}@example.invalid`;
const browser = await chromium.launch({
  headless: true,
  args: ['--no-sandbox', '--disable-blink-features=AutomationControlled'],
});

let leadPayload = null;
let postgrestStatus = null;
const pageErrors = [];
const blockedGoogleRequests = [];

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

  await page.addInitScript(() => {
    try { localStorage.setItem('nestarcadia_consent_v2', 'denied'); } catch {}
    window.__e2eEvents = [];
    window.dataLayer = window.dataLayer || [];
    const originalPush = window.dataLayer.push.bind(window.dataLayer);
    window.dataLayer.push = function (...items) {
      for (const item of items) {
        if (item && typeof item === 'object' && !Array.isArray(item) && typeof item.event === 'string') {
          window.__e2eEvents.push({ event: item.event, detail: item });
        } else if (Object.prototype.toString.call(item) === '[object Arguments]' && item[0] === 'event') {
          window.__e2eEvents.push({ event: item[1], detail: item[2] || {}, source: 'gtag' });
        }
      }
      return originalPush(...items);
    };
  });

  // This is a real production database insert, but no test event is sent to
  // Google: block GTM and all GA4/Ads measurement collector hosts.
  const blockedPatterns = [
    /^https:\/\/www\.googletagmanager\.com\//,
    /^https:\/\/(www\.)?google-analytics\.com\//,
    /^https:\/\/analytics\.google\.com\//,
    /^https:\/\/(www\.)?googleadservices\.com\//,
    /^https:\/\/(www\.)?doubleclick\.net\//,
    /^https:\/\/pagead2\.googlesyndication\.com\/ccm\//,
    /^https:\/\/(www\.)?google\.com\/(pagead|ccm)\//,
  ];
  for (const pattern of blockedPatterns) {
    await page.route(pattern, async (route) => {
      blockedGoogleRequests.push(route.request().url());
      await route.abort();
    });
  }

  page.on('request', (request) => {
    if (request.method() === 'POST' && request.url().includes('/rest/v1/enquiries_078be9eb')) {
      leadPayload = request.postDataJSON();
    }
  });
  page.on('response', (response) => {
    if (response.request().method() === 'POST' && response.url().includes('/rest/v1/enquiries_078be9eb')) {
      postgrestStatus = response.status();
    }
  });

  // Keep the non-critical image registry from competing with the live form check.
  await page.route('**/functions/v1/site-media/images*', async (route) => {
    const request = route.request();
    const origin = request.headers().origin || 'https://nestarcadia.com';
    await route.fulfill({
      status: request.method() === 'OPTIONS' ? 204 : 200,
      headers: {
        'access-control-allow-origin': origin,
        'access-control-allow-methods': 'GET, OPTIONS',
        'access-control-allow-headers': 'authorization, apikey, content-type, x-client-info',
        'access-control-max-age': '600',
        'content-type': 'application/json',
      },
      body: request.method() === 'OPTIONS' ? '' : JSON.stringify({ data: [] }),
    });
  });

  await page.goto(baseUrl + '/start-your-project', { waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.getByPlaceholder('Full Name *').fill('NestArcadia Automated E2E QA');
  await page.getByPlaceholder('Email Address *').fill(qaEmail);
  await page.getByPlaceholder('Phone Number *').fill('9876543210');
  await page.getByRole('combobox').selectOption('Noida');
  await page.getByRole('button', { name: 'Apartment / Flat', exact: true }).click();
  await page.getByRole('button', { name: '2 BHK', exact: true }).click();
  await page.getByRole('button', { name: 'Not sure yet', exact: true }).click();
  await page.getByRole('button', { name: 'Just Exploring', exact: true }).click();
  await page.getByText('Add design style or notes').click();
  await page.getByRole('button', { name: 'Contemporary Minimal', exact: true }).click();

  await page.getByRole('button', { name: /Submit Your Brief/ }).click();
  try {
    await page.getByText('We will be in touch.', { exact: true }).waitFor({ timeout: 20000 });
  } catch (error) {
    const debug = await page.evaluate(() => ({
      alert: document.querySelector('[role="alert"]')?.textContent || null,
      events: window.__e2eEvents,
    }));
    console.error('LIVE_LEAD_E2E_DEBUG', JSON.stringify({
      qaEmail, leadPayload, postgrestStatus, debug, pageErrors, blockedGoogleRequests,
    }));
    throw error;
  }

  const events = await page.evaluate(() => window.__e2eEvents);
  assert.ok(leadPayload, 'Browser did not send the actual PostgREST insert request');
  assert.equal(leadPayload.email, qaEmail);
  assert.equal(leadPayload.name, 'NestArcadia Automated E2E QA');
  assert.ok(leadPayload.id, 'Client-generated record id missing');
  assert.ok(postgrestStatus >= 200 && postgrestStatus < 300, `PostgREST insert returned HTTP ${postgrestStatus}`);
  assert.ok(events.some((event) => event.event === 'lead_submit'), 'lead_submit event missing after backend success');
  assert.ok(events.some((event) => event.event === 'generate_lead'), 'generate_lead event missing after backend success');
  assert.ok(!('status' in leadPayload) && !('notes' in leadPayload), 'Public payload includes internal fields');
  assert.ok(!pageErrors.length, `Browser page errors: ${pageErrors.join('; ')}`);

  console.log('LIVE_LEAD_E2E_SUCCESS', JSON.stringify({
    id: leadPayload.id,
    email: qaEmail,
    postgrestStatus,
    successMessage: true,
    actualSupabaseInsert: true,
    lead_submit: true,
    generate_lead: true,
    pageErrors,
    blockedGoogleRequests: blockedGoogleRequests.length,
    googleMeasurementSent: false,
  }));
} finally {
  await browser.close();
}
