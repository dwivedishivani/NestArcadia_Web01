type AnalyticsProperties = Record<string, string | number | boolean | string[] | undefined>;

type MixpanelClient = {
  init: (token: string, options: Record<string, unknown>) => void;
  track: (event: string, properties?: Record<string, unknown>) => void;
  opt_out_tracking: () => void;
  opt_in_tracking: () => void;
  __SV?: number;
};

declare global {
  interface Window {
    mixpanel?: MixpanelClient;
    __nestArcadiaMixpanelLoading?: boolean;
    __nestArcadiaMixpanelInitialized?: boolean;
    __nestArcadiaMixpanelQueue?: Array<{ event: string; properties: Record<string, unknown> }>;
  }
}

const CONSENT_KEY = 'nestarcadia_consent_v2';
const ATTRIBUTION_KEY = 'nestarcadia_attribution_v1';
const MIXPANEL_TOKEN = import.meta.env.VITE_MIXPANEL_TOKEN?.trim() ?? '';
const MIXPANEL_SCRIPT_ID = 'nestarcadia-mixpanel-sdk';

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const;

type Attribution = {
  first_touch_landing_page?: string;
  first_touch_referrer?: string;
  first_touch_utm_source?: string;
  first_touch_utm_medium?: string;
  first_touch_utm_campaign?: string;
  first_touch_utm_content?: string;
  first_touch_utm_term?: string;
  last_touch_landing_page?: string;
  last_touch_referrer?: string;
  last_touch_utm_source?: string;
  last_touch_utm_medium?: string;
  last_touch_utm_campaign?: string;
  last_touch_utm_content?: string;
  last_touch_utm_term?: string;
};

const hasAnalyticsConsent = () => {
  if (typeof window === 'undefined') return false;
  try {
    return window.localStorage.getItem(CONSENT_KEY) === 'granted';
  } catch {
    return false;
  }
};

const clean = (value: unknown, max = 120): string | undefined => {
  if (typeof value !== 'string') return undefined;
  const result = value.trim().replace(/[\u0000-\u001F\u007F]/g, '').slice(0, max);
  return result || undefined;
};

function currentTouch(): Attribution {
  const params = new URLSearchParams(window.location.search);
  const touch: Attribution = {
    last_touch_landing_page: window.location.pathname.slice(0, 300),
    last_touch_referrer: clean(document.referrer ? new URL(document.referrer).hostname : '', 100),
  };
  for (const key of UTM_KEYS) {
    const value = clean(params.get(key), 120);
    if (value) touch[`last_touch_${key}` as keyof Attribution] = value;
  }
  return touch;
}

function readAttribution(): Attribution {
  if (typeof window === 'undefined') return {};
  try {
    const saved = JSON.parse(window.localStorage.getItem(ATTRIBUTION_KEY) || '{}') as Attribution;
    return saved && typeof saved === 'object' ? saved : {};
  } catch {
    return {};
  }
}

/** Persist first- and last-touch campaign details only after analytics consent. */
export function captureAttribution(): Attribution {
  if (!hasAnalyticsConsent()) return {};
  const saved = readAttribution();
  const latest = currentTouch();
  const hasCampaign = UTM_KEYS.some((key) => latest[`last_touch_${key}` as keyof Attribution]);
  const first = saved.first_touch_landing_page
    ? saved
    : {
        ...saved,
        first_touch_landing_page: window.location.pathname.slice(0, 300),
        first_touch_referrer: clean(document.referrer ? new URL(document.referrer).hostname : '', 100),
        ...Object.fromEntries(UTM_KEYS.map((key) => {
          const value = latest[`last_touch_${key}` as keyof Attribution];
          return [`first_touch_${key}`, value];
        })),
      };
  const next = hasCampaign
    ? { ...first, ...latest }
    : { ...first, last_touch_landing_page: first.last_touch_landing_page || latest.last_touch_landing_page };
  try {
    window.localStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(next));
  } catch {
    // Analytics remains optional when storage is unavailable.
  }
  return next;
}

export function getLeadAttribution(): Attribution {
  if (hasAnalyticsConsent()) return captureAttribution();
  const params = new URLSearchParams(window.location.search);
  const current: Attribution = {};
  for (const key of UTM_KEYS) {
    const value = clean(params.get(key), 120);
    if (value) current[`last_touch_${key}` as keyof Attribution] = value;
  }
  return current;
}

export function appendAttributionToSource(source: string): string {
  const attribution = getLeadAttribution();
  const entries = Object.entries(attribution).filter(([, value]) => Boolean(value));
  if (!entries.length) return source;
  const suffix = entries.map(([key, value]) => `${key}=${String(value)}`).join('; ');
  return `${source} | attribution: ${suffix}`.slice(0, 1800);
}

function flushQueue() {
  const queue = window.__nestArcadiaMixpanelQueue || [];
  window.__nestArcadiaMixpanelQueue = [];
  queue.forEach(({ event, properties }) => window.mixpanel?.track(event, properties));
}

function createMixpanelStub(): MixpanelClient {
  const stub = [] as unknown as MixpanelClient & { _i: unknown[]; push: (...args: unknown[]) => number };
  stub._i = [];
  stub.__SV = 1.2;
  stub.push = Array.prototype.push.bind(stub);
  stub.init = (token: string, options: Record<string, unknown>) => {
    stub._i.push([token, options, undefined]);
  };
  stub.track = (event: string, properties?: Record<string, unknown>) => {
    stub.push(['track', event, properties || {}]);
  };
  stub.opt_in_tracking = () => { stub.push(['opt_in_tracking']); };
  stub.opt_out_tracking = () => { stub.push(['opt_out_tracking']); };
  window.mixpanel = stub;
  return stub;
}

export function initializeAnalytics(): void {
  if (!hasAnalyticsConsent() || !MIXPANEL_TOKEN || typeof window === 'undefined') return;
  captureAttribution();

  if (window.mixpanel && window.__nestArcadiaMixpanelInitialized) return;
  if (window.__nestArcadiaMixpanelLoading) return;

  // The SDK may have finished downloading while consent was denied. Initialise
  // it now if the visitor later opts in, rather than leaving the existing script idle.
  if (window.mixpanel && !window.__nestArcadiaMixpanelInitialized) {
    window.mixpanel.init(MIXPANEL_TOKEN, {
      api_host: 'https://api-eu.mixpanel.com',
      autocapture: false,
      track_pageview: false,
      persistence: 'localStorage',
    });
    window.__nestArcadiaMixpanelInitialized = true;
    flushQueue();
    return;
  }

  const existingScript = document.getElementById(MIXPANEL_SCRIPT_ID) as HTMLScriptElement | null;
  if (existingScript) return;

  const client = createMixpanelStub();
  window.__nestArcadiaMixpanelLoading = true;
  const script = document.createElement('script');
  script.id = MIXPANEL_SCRIPT_ID;
  script.async = true;
  script.src = 'https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js';
  script.onload = () => {
    window.__nestArcadiaMixpanelLoading = false;
    if (!window.mixpanel) return;
    window.__nestArcadiaMixpanelInitialized = true;
    if (!hasAnalyticsConsent()) {
      window.mixpanel.opt_out_tracking();
      window.__nestArcadiaMixpanelQueue = [];
      return;
    }
    flushQueue();
  };
  script.onerror = () => {
    window.__nestArcadiaMixpanelLoading = false;
    if (!window.__nestArcadiaMixpanelInitialized) window.mixpanel = undefined;
    script.remove();
  };
  document.head.appendChild(script);
  client.init(MIXPANEL_TOKEN, {
    api_host: 'https://api-eu.mixpanel.com',
    autocapture: false,
    track_pageview: false,
    persistence: 'localStorage',
  });
}

export function setAnalyticsConsent(granted: boolean): void {
  if (granted) {
    if (window.__nestArcadiaMixpanelInitialized) window.mixpanel?.opt_in_tracking();
    initializeAnalytics();
    return;
  }
  window.mixpanel?.opt_out_tracking();
  window.__nestArcadiaMixpanelQueue = [];
  try {
    window.localStorage.removeItem(ATTRIBUTION_KEY);
  } catch {
    // Storage may be unavailable; opt-out still prevents future tracking.
  }
}

export function trackAnalyticsEvent(event: string, properties: AnalyticsProperties = {}): void {
  if (!hasAnalyticsConsent() || !MIXPANEL_TOKEN || typeof window === 'undefined') return;
  initializeAnalytics();
  const safeProperties = Object.fromEntries(
    Object.entries({
      page_path: window.location.pathname.slice(0, 300),
      page_title: clean(document.title, 180),
      ...getLeadAttribution(),
      ...properties,
    }).filter(([, value]) => value !== undefined && value !== null),
  );
  if (window.mixpanel && !window.__nestArcadiaMixpanelLoading) {
    window.mixpanel.track(event, safeProperties);
    return;
  }
  window.__nestArcadiaMixpanelQueue = window.__nestArcadiaMixpanelQueue || [];
  window.__nestArcadiaMixpanelQueue.push({ event, properties: safeProperties });
}

export function installAnalyticsListeners(): () => void {
  const startedForms = new WeakSet<HTMLFormElement>();

  const handleClick = (event: MouseEvent) => {
    const target = event.target instanceof Element ? event.target : null;
    const element = target?.closest('a[href], button[data-analytics-event]');
    if (!element) return;

    if (element instanceof HTMLAnchorElement) {
      const href = element.getAttribute('href') || '';
      const label = clean(element.textContent, 100);
      if (/^(https?:\/\/)?(wa\.me|api\.whatsapp\.com)/i.test(href)) {
        trackAnalyticsEvent('whatsapp_click', { cta_label: label, cta_placement: element.dataset.analyticsPlacement || 'site_link' });
      } else if (href.startsWith('tel:')) {
        trackAnalyticsEvent('phone_click', { cta_label: label, cta_placement: element.dataset.analyticsPlacement || 'site_link' });
      } else if (href.startsWith('mailto:')) {
        trackAnalyticsEvent('email_click', { cta_label: label, cta_placement: element.dataset.analyticsPlacement || 'site_link' });
      } else if (href.includes('/start-your-project')) {
        trackAnalyticsEvent('cta_click', { cta_label: label, cta_placement: element.dataset.analyticsPlacement || 'internal_link', destination: '/start-your-project' });
      }
      return;
    }

    const eventName = element.getAttribute('data-analytics-event');
    if (eventName) {
      trackAnalyticsEvent(eventName, {
        cta_label: clean(element.textContent, 100),
        cta_placement: element.getAttribute('data-analytics-placement') || 'button',
      });
    }
  };

  const handleFocus = (event: FocusEvent) => {
    const target = event.target instanceof Element ? event.target : null;
    const form = target?.closest('form[data-analytics-form]');
    if (!(form instanceof HTMLFormElement) || startedForms.has(form)) return;
    startedForms.add(form);
    trackAnalyticsEvent('form_start', { form_type: form.dataset.analyticsForm || 'unknown' });
  };

  document.addEventListener('click', handleClick, true);
  document.addEventListener('focusin', handleFocus, true);
  return () => {
    document.removeEventListener('click', handleClick, true);
    document.removeEventListener('focusin', handleFocus, true);
  };
}
