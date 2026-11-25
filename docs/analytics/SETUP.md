# NestArcadia analytics tracking

## Configuration

Set `VITE_MIXPANEL_TOKEN` as a GitHub Actions repository secret at **Settings → Secrets and variables → Actions → New repository secret**. Use the exact secret name `VITE_MIXPANEL_TOKEN`. The build and Hostinger deployment workflows pass it into Vite at build time. Do not commit the project token. The website sends browser events to the Mixpanel EU ingestion endpoint:

- SDK: `https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js`
- API host: `https://api-eu.mixpanel.com`
- Autocapture: disabled
- Automatic page views: disabled; the router owns page-view events.

Mixpanel is initialized only after the visitor accepts analytics consent in the existing `nestarcadia_consent_v2` consent manager. Rejecting consent opts out of tracking. If the token is absent, Mixpanel stays inactive and existing GA4/GTM behaviour is unchanged.

## Event catalogue

| Event | Trigger | Safe properties |
|---|---|---|
| `page_view` | React route change / BFCache restore | page path, title, page type, content group, attribution |
| `cta_click` | Service CTA or project link | label, placement, destination, service |
| `whatsapp_click` | Any wa.me / WhatsApp link | label, placement |
| `phone_click` | tel: link | label, placement |
| `email_click` | mailto: link | label, placement |
| `form_start` | First focus in a public project form | quick / full |
| `form_error` | Client-side validation failure | form type, invalid field names |
| `form_submit_failed` | Backend submission failure | form type, failure category |
| `lead_submit` | Confirmed Supabase insert | quick / full, home size, budget band, service interest |

## Attribution

After consent, first-touch and last-touch UTM values are retained in first-party local storage and attached to Mixpanel events. The project enquiry's existing `source` field also receives available attribution values, so campaign context is not lost when the visitor navigates to the form. Without analytics consent, only UTM values still present on the form URL are attached to the submitted enquiry.

Captured campaign keys: `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`. Referrers are stored as hostnames, not full URLs.

## Privacy and data minimisation

Never send names, email addresses, phone numbers, free-text messages, raw form payloads, or full WhatsApp URLs to Mixpanel. Lead properties are limited to non-identifying business categories. Keep the existing Google Consent Mode defaults and GA4/GTM installation unchanged until the live GTM container is inspected.

## Verification checklist

1. Set `VITE_MIXPANEL_TOKEN` in the deployment build environment.
2. Accept analytics consent and confirm the Mixpanel EU SDK loads.
3. In Mixpanel Live View, verify `page_view`, `whatsapp_click`, `phone_click`, `form_start`, `form_error`, and `lead_submit`.
4. Reject analytics consent and confirm no Mixpanel events are sent.
5. Submit a real test enquiry only with approval; verify the Supabase record and its source attribution.
6. Verify Google page views and Ads conversions separately in Tag Assistant / GA4 DebugView. A queued dataLayer event alone is not delivery proof.
