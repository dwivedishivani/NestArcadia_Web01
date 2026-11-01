# Milestone 2 — Local SEO & Business Authority Audit

**Audit date:** 1 November 2026  
**Repository:** `dwivedishivani/NestArcadia_Web01`  
**Working branch:** `seo/milestones-2026-11`  
**Status:** In progress — not ready for sign-off or production deployment.

## Scope and evidence

This review covers the 17 service/location routes in the XML sitemap, their source configuration, site-wide business identity/contact/schema, Search Console performance data available through 29 October 2026, and public web results for NestArcadia.

Primary local markets are Noida Extension and Greater Noida West. This is consistent with the project's SEO operating standard and the website footer.

## Findings

### 1. Location-page architecture

The site has 17 local/service routes:

- **Primary residential:** Noida Extension and Greater Noida West.
- **Primary commercial:** Commercial Interior Design in Greater Noida West.
- **Secondary coverage:** Greater Noida, Noida, Ghaziabad, Indirapuram, Crossing Republik, Faridabad, Delhi, East Delhi, South Delhi, Gurugram, Dadri, Jewar, Yamuna Expressway and Delhi NCR.

The two primary residential pages have meaningful, differentiated planning copy, four FAQs each, service scope, process guidance and relevant journal links. The Greater Noida West commercial page also has distinct office-planning content and relevant articles.

The 14 secondary pages have individually written titles, introductions and insight headings, but most use a similar service/fit/process/FAQ structure and provide limited verifiable local evidence. They do not currently demonstrate local completed projects, named local references, local testimonials or other proof specific to each market.

**Recommendation:** Keep the two primary residential pages and the Greater Noida West commercial page as the core local cluster. Keep secondary pages indexable only where NestArcadia can genuinely serve that area and can add useful, specific local context or proof. Otherwise consolidate relevant coverage into a useful NCR service-area page and redirect or noindex the unsupported pages after checking backlinks and traffic. Do not create more city pages simply to increase keyword coverage.

This is a quality-control recommendation, not an instruction to delete the existing pages immediately. The actual delivery footprint must be confirmed before consolidation.

### 2. Search Console local demand snapshot

Search Analytics, Web search, 1–29 October 2026 (finalised data through 29 October):

| Query | Impressions | Clicks | Average position |
|---|---:|---:|---:|
| interior designer in Greater Noida West | 1 | 0 | 93 |
| interior designer in Noida Extension | 1 | 0 | 94 |
| interior designer in South Delhi | 4 | 0 | 98.75 |
| interior designers in East Delhi | 2 | 0 | 73.5 |
| commercial interior Greater Noida | 2 | 0 | 71 |

The sample is very small, so these numbers are directional rather than a stable ranking benchmark. They show that the site currently has little visibility for the sampled non-branded local-intent queries.

The homepage recorded 24 impressions and 2 clicks during the same period. The two main residential local pages recorded very few impressions in this data extract.

### 3. Business identity and NAP

The website and public LinkedIn company profile expose consistent contact details:

- **Phone:** +91 84480 61997
- **Email:** info@nestarcadia.com
- **Website:** https://nestarcadia.com/
- **Website brand styling:** NestArcadia
- **LinkedIn display name:** Nest Arcadia

The public LinkedIn profile lists **G-59, Fusion Ufairia Mall, Greater Noida West, Uttar Pradesh 201310**. On 1 November 2026, the business owner confirmed that customers can visit this office.

The address is now reflected in the website footer and the single stable NestArcadia business entity in the base and client-rendered JSON-LD:

- G-59, Fusion Ufairia Mall, Sector 16B
- Greater Noida West, Uttar Pradesh 201310
- India

A Google Maps directions link is provided from the visible website address. No opening hours have been added because exact customer-facing hours have not been verified. Before configuring an address-visible hybrid Google Business Profile, confirm that the office has clear NestArcadia signage and is staffed to receive customers during the published hours. Google requires businesses to make in-person contact with customers during stated hours; special signage/staffing rules apply to coworking-space locations.

Public company profile: https://www.linkedin.com/company/nest-arcadia/

### 4. Google Business Profile and directory presence

A branded local-business search did not return a matching NestArcadia business result in the structured local results available for this audit. This does **not** prove that no Google Business Profile exists; a direct profile URL or access to the profile manager is still needed for a conclusive audit.

A local directory at [greaternoidawest.in/listings](https://www.greaternoidawest.in/listings/) has an **Interior Decorators (1)** category, so it is a promising citation lead. However, opening that category triggered bot verification and the business name, destination URL, phone and address could not be confirmed. It is therefore not yet safe to count this as a verified NestArcadia citation or as evidence of a consistent NAP listing.

The public LinkedIn profile is visible and lists the same phone, email and website as the website. Its About copy also contains strong property-return language (including a guarantee of value/appreciation). This is a brand-trust and compliance risk unless each claim is substantiated and carefully qualified. Avoid guaranteed ROI/appreciation wording; describe the service as advisory or design input, not as a guaranteed financial outcome.

**Required next step:** audit the actual Google Business Profile for business name, primary category, additional categories, address visibility, service areas, website, phone, hours, services, photos and review history. Do not create extra profiles for individual target areas. Check the local directory category listing manually and confirm it is NestArcadia before treating it as a citation.

### 5. Structured data and internal identity

The existing business entity uses the stable ID `https://nestarcadia.com/#business`. Its structured `areaServed` is limited to the four core markets (Greater Noida West, Noida Extension, Greater Noida and Noida), rather than indiscriminately listing all 17 route targets.

The local service pages are linked to the same business entity in schema. The public email is now included in the base business/contact-point structured data.

### 6. Safe changes made on this branch

- Removed a Facebook profile-edit/tracking query parameter from the public social link.
- Replaced the non-semantic click-only WhatsApp footer tile with a keyboard-accessible link.
- Added the visible telephone number and a direct `tel:` link to the footer.
- Kept the public email visible and clickable.
- Added the verified public email to the base business/contact-point JSON-LD.
- Changed the client-rendered local Service schema to reference the stable NestArcadia business entity by `@id`.

No street address, opening hours, ratings, reviews, completed-project counts or additional service areas were invented or published.

## Google policy guardrails

- Google requires a service-area business to use one profile for its central business and accurate service areas. A business that does not serve customers at its address should hide that address. A hybrid business may show the address only where it serves customers at that staffed location. Source: https://support.google.com/business/answer/3038177
- Google allows up to 20 service areas, selected by actual cities/postcodes/areas served; the overall footprint should generally stay within about two hours of the business base. Source: https://support.google.com/business/answer/9157481
- Google defines doorway abuse to include substantially similar region/city pages created to rank for similar queries and funnel users toward one final destination. Source: https://developers.google.com/search/docs/essentials/spam-policies

## Exit criteria still open

- [ ] Confirm whether G-59, Fusion Ufairia Mall is the current public office and whether customers are received there during staffed hours.
- [ ] Confirm storefront/hybrid versus service-area-only business model.
- [ ] Provide or verify the actual Google Business Profile URL and audit its live fields.
- [ ] Confirm which of the 14 secondary markets are genuinely served today.
- [ ] Decide which secondary city pages merit unique evidence, and which should be consolidated/redirected/noindexed.
- [ ] Review live citations/directories once the official business address and intended NAP format are confirmed.
- [ ] Validate the code changes with a clean production build and browser/link/schema smoke tests.

**Deployment:** No production deployment was made. This branch remains isolated. Milestone 1 indexing/recrawl items are still tracked separately.
