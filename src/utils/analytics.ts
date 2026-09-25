export type AnalyticsParams = Record<string, string | number | boolean | undefined>;

export function trackEvent(name: string, params: AnalyticsParams = {}) {
  if (typeof window === 'undefined') return;

  const payload = {
    ...params,
    page_path: window.location.pathname,
    page_location: window.location.href,
  };

  const gtag = (window as Window & {
    gtag?: (command: 'event', eventName: string, eventParams?: AnalyticsParams) => void;
  }).gtag;

  if (typeof gtag === 'function') {
    gtag('event', name, payload);
    return;
  }

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: name, ...payload });
}

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    gtag?: (command: 'event', eventName: string, eventParams?: AnalyticsParams) => void;
  }
}
