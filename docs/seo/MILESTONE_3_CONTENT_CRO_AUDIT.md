# Milestone 3 — Content, CRO & Performance Audit

**Audit date:** 2 November 2026  
**Repository:** `dwivedishivani/NestArcadia_Web01`  
**Working branch:** `seo/milestone-3-content-cro-performance`  
**Release PR:** https://github.com/dwivedishivani/NestArcadia_Web01/pull/106  
**Status:** Implementation in progress; not approved for production deployment.

## 1. Baseline evidence

Supabase was inspected directly before content work:

- 29 previously published rows in `public.blogs_078be9eb`.
- 8 published records in `public.homes_078be9eb`.
- 0 records in `public.projects` with verified completed-project information.
- Two new budget guides have been added to `blogs_078be9eb` as `draft`, with no publication date. They are not publicly published yet.

The eight portfolio records are labelled as selected home concepts/design studies in the website. They must not be presented as completed client projects, testimonials or measured project outcomes without owner-supplied evidence.

## 2. Conversion and homepage content

- The existing homepage H1 already targets the two primary markets: Noida Extension and Greater Noida West. It is retained.
- The primary hero CTA now starts a project brief; the secondary CTA opens the design-concept portfolio.
- Two direct budget-guide links have been added to the homepage, with a separate CTA to discuss a floor plan.
- The homepage budget section uses clear labels and avoids promising a fixed package price.

## 3. New high-intent content

### 2BHK guide

- URL: `/journal/2bhk-interior-cost-noida-extension/`
- Planning range: approximately ₹6.5–7 lakh for a raw/newly handed-over 2BHK, based on existing NestArcadia website guidance.
- Covers scope, existing builder work, kitchen/wardrobe specification, quote comparison, taxes/exclusions and project briefing.

### 3BHK guide

- URL: `/journal/3bhk-interior-cost-greater-noida-west/`
- Planning range: approximately ₹9–10 lakh for a raw/newly handed-over 3BHK, based on existing NestArcadia website guidance.
- Covers room planning, kitchen/wardrobe decisions, lighting/electrical planning, estimate comparison and project briefing.

Both guides state that these are NestArcadia planning references, not guaranteed quotations or independently verified market averages. Final pricing must be based on a measured site, agreed scope and written specifications. The author is the NestArcadia organization, not an invented individual expert.

Both guides are present in the static article bundle and sitemap. Matching Supabase rows are staged as drafts. At the release cutover, publish the two database records only after the website build and route smoke checks pass.

## 4. Portfolio and experience signals

The site currently has eight published design concepts with image galleries. There are no verified completed-project records in the projects table. The current concept labelling is the honest presentation and should remain until the owner supplies real project evidence.

To publish 5–8 genuine case studies, collect for each project:

- Permission to publish the project and images.
- Actual city/area, property type and approximate area.
- Project scope and completion date.
- Original before/after or execution photographs.
- Confirmed design decisions, materials and constraints.
- Approved budget range only if the owner is comfortable disclosing it.
- A client quote only where the client has explicitly approved the exact wording.

Do not turn stock images or conceptual galleries into client case studies.

The two new guides use NestArcadia as the organization author and link to the Our Story page for the studio's verified background. Do not add professional registrations, individual qualifications or years of design experience unless verified.

## 5. Internal linking

- Homepage links to both new commercial-intent guides.
- The existing Journal static-route generator adds contextual links to the two primary residential service pages and the interior-design-services page on Journal routes.
- The production smoke test checks homepage budget-guide links, route HTTP 200, canonical URLs, BlogPosting schema and publication dates.

## 6. Backlink and citation opportunities

These are editorial/local citation opportunities, not paid-link recommendations. Verify the exact submission/listing terms before outreach.

| Priority | Opportunity | Why it fits | Next action |
|---|---|---|---|
| High | [Greater Noida West business directory](https://www.greaternoidawest.in/listings/) | Local directory includes an Interior Decorators category and an Add Listing route. The existing category entry must be checked before submitting to avoid duplicates. | Verify the current listing, then submit accurate business name, phone, address/service area and website if not already listed. |
| High | [Member of Architecture — Noida practices](https://www.memberofarchitecture.com/blog/6a96d938b9b949a3716b-architects-interior-designers-in-noida-2026) | A curated directory/article covers Noida architecture and interior-design practices, including Greater Noida coverage. | Review profile eligibility and whether a direct business profile is available. Submit only accurate credentials and work examples. |
| High (editorial) | [Surfaces Reporter — project/article submissions](https://www.surfacesreporter.com/submit) | Accepts architecture/interior projects, products and original guest articles. It requests complete details, high-resolution imagery and exclusive content. | Pitch an original, well-documented project or expert planning article only after source material and image rights are confirmed. |
| Medium (editorial) | [In AWE — project submissions](https://www.inawe.in/submit-a-story/) | Accepts interior projects and prefers unique projects with multiple images; requests 1920×1080 images and welcomes plans, sections and sketches. | Submit only a genuine project with image rights, project credits and supporting drawings. |
| Medium (local partnerships) | Resident associations, property communities and relevant local suppliers | A useful resident guide or co-created planning resource can earn a contextual local reference and referral traffic. | Build a real collaboration first; request a link only where it adds value to the audience. |

Do not pursue bulk directory packages, paid followed links, reciprocal link schemes, fabricated partner badges or generic guest-post networks. A legitimate citation should represent a real business relationship or useful editorial contribution.

## 7. Analytics and performance verification

### Analytics

The source configuration contains GA4 `G-LDM2YL1MP5` and GTM `GTM-T7R3TTP5`. The existing production smoke test checks the enquiry success flow, queued `lead_submit` and `generate_lead` events, and the GA4 collector path when available.

The connected HYPD Google Analytics and Tag Manager accounts are not currently selected, so a live account-level audit cannot be completed through that connector yet. Before sign-off:

1. Select the correct GA4 property and GTM container in HYPD: https://app.hypd.ai/sources?utm_source=mcp&utm_content=none_selected
2. Inspect the live GTM version and GA4 configuration; ensure there is one intentional page-view path.
3. Confirm consent defaults and updates.
4. Verify `page_view` and `generate_lead` in Tag Assistant / GA4 DebugView and confirm real network delivery.
5. Verify a real qualified enquiry is attributed correctly. A queued event alone is not proof of delivery.

### Performance

The branch includes responsive image preparation, local fonts, optimized hero assets and a production browser smoke workflow. Automated Lighthouse mobile and desktop audits have been added to CI.

**Updated preview lab audit (commit `8364d32`; local Vite production preview, 2 November 2026):**

| Metric | Mobile | Desktop |
|---|---:|---:|
| Lighthouse Performance | 91 | 100 |
| Accessibility | 100 | 100 |
| SEO | 100 | 100 |
| LCP | 2.3 s | 0.6 s |
| FCP | 2.0 s | 0.5 s |
| Total Blocking Time | 280 ms | 0 ms |
| CLS | 0.001 | 0.002 |
| Time to Interactive (lab) | 8.6 s | 1.1 s |

The two 640px responsive WebP variants improved mobile performance from 86 to 91 and reduced Lighthouse's estimated image-delivery savings from 251 KiB to 161 KiB (about 36% lower). The browser now selects the 640px source for the two heavy carousel images on high-density mobile screens.

Accessibility follow-up:
- The previous axe audit flagged two footer links for visible-text / accessible-name mismatch.
- Removed the overriding aria-labels from the WhatsApp and office-directions links so their visible text supplies their accessible names.
- The updated Lighthouse axe audit now passes the label-content-name-mismatch check with no failing elements.
- Added Playwright assertions to prevent those mismatches from returning.

Remaining mobile opportunities from this updated run:
- Approximately 384 KiB estimated unused JavaScript.
- Approximately 161 KiB estimated image-size savings.
- Google tag scripts still account for approximately 369 ms of third-party main-thread blocking.
- The run still shows two separate GA4 `gtag.js` requests for `G-LDM2YL1MP5` (one standalone and one with GTM query parameters), alongside the Google Ads tag and GTM container. This is a potential duplicate GA4 loading path that must be checked in the actual GTM container before changing anything.
- Total blocking time is down to 280 ms on mobile; the remaining unused JavaScript and third-party work need GTM/GA4 inspection before any tracking changes.
- Total initial network payload and long-task count are recorded in the raw Lighthouse artifact; do not extrapolate from the earlier run.



Do not remove or consolidate analytics tags based only on this audit. Inspect the live GTM container and GA4 property first, preserve consent and lead tracking, and verify real `page_view` / `generate_lead` delivery. HYPD GA4 and GTM accounts are connected but not selected for this session.

This is a **lab measurement of the local preview**, not a production PageSpeed Insights report or CrUX field-data result. This final preview run includes the static homepage budget links, shortened article titles and the verified Our Story author link. The final Playwright lead-flow smoke must pass on the latest branch head after the responsive-image, footer-accessibility and first-paint CTA fixes. Do not mark Core Web Vitals complete until mobile and desktop are measured on the final live canonical URLs and compared with a documented production baseline.

Target good Core Web Vitals at the 75th percentile: LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1. Distinguish lab Lighthouse results from CrUX/Search Console field data.

## 8. Exit criteria

- [x] Homepage primary conversion CTA improved.
- [x] Two high-intent budget guides authored and staged as Supabase drafts.
- [x] Homepage and Journal internal-link pathways added/verified in source.
- [x] Static sitemap and BlogPosting metadata updated.
- [x] Backlink/citation opportunity shortlist researched.
- [x] Production build and full Playwright smoke pass on the final code candidate (`4f3440d`).
- [ ] Fresh mobile and desktop Lighthouse/PageSpeed audits recorded.
- [ ] Current field Core Web Vitals checked in Search Console/CrUX.
- [ ] GA4/GTM account selection, configuration and real lead-event delivery verified.
- [ ] Owner supplies evidence for any genuine case studies to replace/augment concepts.
- [ ] Two draft guides are published at the final release cutover.
- [ ] Milestones 1–3 are reviewed together and deployed once.

**Deployment:** No production deployment has been made.
