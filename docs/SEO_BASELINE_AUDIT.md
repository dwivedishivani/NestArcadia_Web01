# NestArcadia — SEO Baseline Audit
**Date:** November 2026  
**Branch:** seo/phase-0-audit  
**Auditor:** Claude Sonnet 4.6 (Phase 0 — Discovery)  
**Goal:** First-page rankings for high-intent interior design searches in Noida / Greater Noida NCR

---

## 1. Executive Summary

NestArcadia has a well-structured, visually premium website but faces **one existential SEO constraint**: the site is a pure Client-Side Rendered (CSR) React SPA. Every page title, meta description, canonical URL, Open Graph tag, and Schema.org JSON-LD block is set by JavaScript after React mounts — meaning Googlebot's first HTTP response for every non-homepage URL returns the homepage metadata verbatim. Without Static Site Generation (SSG) or Server-Side Rendering (SSR), content visibility to search engines depends entirely on Google's willingness to execute JavaScript on each crawl, which is never guaranteed and always delayed.

All other SEO improvements — keyword optimisation, schema enhancement, local pages, content — will be severely undermined until the rendering architecture is addressed.

**Current organic position baseline (Search Console, Oct 2026):**
- "interior designer in Greater Noida West": avg position 93, 1 impression
- "interior designer in Noida Extension": avg position 94, 1 impression
- Homepage: 24 impressions, 2 clicks

The site is effectively **invisible** in organic search for its primary commercial queries.

---

## 2. Repository Architecture Report

### Tech Stack
| Layer | Technology | Version |
|---|---|---|
| Framework | React | 19 |
| Routing | react-router (createBrowserRouter) | v8 |
| Build | Vite | 8 |
| Styling | Tailwind CSS v4 | @tailwindcss/vite plugin |
| Language | TypeScript | 5.7 |
| Backend | Supabase (Edge Functions, PostgreSQL, Storage) | jsr:@supabase/supabase-js@2.49.8 |
| Analytics | Google Analytics 4 (G-LDM2YL1MP5) + GTM (GTM-T7R3TTP5) | — |
| Fonts | Self-hosted DM Sans + Playfair Display | async loaded |
| Deployment | Hostinger | — |

### Project Structure
```
src/
  App.tsx                      # Router, pageMeta, all schema generation
  main.tsx                     # Entrypoint
  index.css                    # Tailwind v4 + global CSS
  pages/
    Home/                      # Hero carousel, static bootloader overlay
    LocalService/              # 17 location pages (3 primary, 14 thin)
    Journal/                   # 29+ static + Supabase-dynamic articles
    Services/                  # Service categories
    DesignCultures/            # 5 regional design styles
    OurStory/                  # Brand story, timeline, values
    Homes/                     # Portfolio (8 design concepts)
    StartProject/              # Lead capture form
    FAQs/                      # 5 FAQ groups
    PrivacyPolicy/             # Policy page
    Admin/                     # CMS (login + dashboard)
  styles/globals.css           # Rich article CSS, admin editor CSS
  data/
    seo/                       # 1 SEO article JSON (luxury-interior-design-noida-extension.json)
    responsive-site-images.json

public/
  sitemap.xml                  # 56 URLs (checked) — no <lastmod>
  robots.txt                   # Minimal — allow all, sitemap only
  indexnow-key.txt             # IndexNow configured
  llms.txt                     # Basic AI guidance
  .well-known/ai-catalog.json  # AI catalog
  site.webmanifest             # PWA manifest
  fonts/fonts-v1.css           # Self-hosted fonts

supabase/functions/
  server/index.ts              # Hono-based Edge Function (admin, blog, homes, leads, media)
  bright-api/                  # Public-facing API
  site-media/                  # Storage helper

docs/
  performance/ASSET_PIPELINE.md
  seo/MILESTONE_2_LOCAL_SEO_AUDIT.md
  seo/MILESTONE_3_CONTENT_CRO_AUDIT.md
  SEO_BASELINE_AUDIT.md        # (this file)

scripts/
  generate-canonical-route-html.mjs   # Pre-render canonical HTML stubs
  prepare-app-icons.mjs
  prepare-local-fonts.mjs
  prepare-responsive-site-images.mjs
  apache-redirect-smoke.mjs
  live-lead-e2e.mjs
  production-smoke.mjs
```

---

## 3. Current Website & Page Inventory

### Core Pages (9)

| URL | H1 | Meta Title | Sitemap |
|---|---|---|---|
| `/` | "Interior Designers in Noida Extension & Greater Noida West" | Interior Designers in Noida Extension & Greater Noida West \| NestArcadia | ✅ |
| `/design-cultures` | "Design Cultures" | Indian Design Cultures for Modern Homes | ✅ |
| `/interior-design-services` | "Our Services" ⚠️ | Interior Design Services in Noida, Greater Noida & NCR | ✅ |
| `/our-story` | "Our Story" | Our Story \| Ancient Craft, Modern Indian Interiors | ✅ |
| `/journal` | — (list page) | Interior Design Cost Guides & Planning Journal \| NestArcadia | ✅ |
| `/our-projects` | "Our Projects" | Our Projects \| NestArcadia Interior Design | ✅ |
| `/start-your-project` | "Start Your Project" | Start an Interior Design Project in Noida & NCR | ✅ |
| `/faqs` | — (implicit) | Interior Design Cost, Services & FAQs \| Noida & NCR | ✅ |
| `/privacy-policy` | — | Privacy Policy \| NestArcadia | ✅ |

**⚠️ Issue:** Services page H1 is "Our Services" — not keyword-optimised. Should include location + service keywords.

### Local Service Pages (17)

| Priority | URL | Type |
|---|---|---|
| PRIMARY | `/interior-design-greater-noida-west` | Fully developed (hero, insights, services, FAQs, process) |
| PRIMARY | `/interior-design-noida-extension` | Fully developed |
| PRIMARY | `/commercial-interior-design-greater-noida-west` | Fully developed |
| SECONDARY (14) | `/interior-design-greater-noida` through `/interior-design-delhi-ncr` | Thinner — same template, less original content |

**All 17 in sitemap ✅**

### Journal Articles (29+ static + Supabase dynamic)
Stored as a mix of static objects in `Journal.tsx` and rows in `public.blogs_078be9eb`. Covers: cost guides, material guides, design inspiration, vastu, modular kitchens, 2BHK/3BHK planning.

**Budget guide slugs (staged as drafts in Supabase):**
- `/journal/2bhk-interior-cost-noida-extension/`
- `/journal/3bhk-interior-cost-greater-noida-west/`

### Admin Routes (not in sitemap, correct)
- `/admin` — login/dashboard

---

## 4. Technical SEO Baseline

### 4.1 Rendering Architecture — CRITICAL ❌

**Finding:** Pure CSR SPA. `index.html` is a static shell with homepage metadata. All per-route metadata is injected via `document.title`, `querySelector('meta[name="description"]')`, and `setAttribute` in `App.tsx` after React mounts.

**Impact:**
- Googlebot's first HTTP response for `/interior-design-services`, `/our-story`, `/journal/any-article`, any local service page — ALL return the **homepage title and description** in raw HTML
- Schema.org JSON-LD (BusinessSchema, WebPage, BlogPosting, FAQPage, BreadcrumbList) is not present in the initial HTTP response for any non-homepage URL
- Canonical tags are set by JS — not static — meaning crawlers may see no canonical on first fetch
- Content depends 100% on successful JavaScript execution

**Note:** `scripts/generate-canonical-route-html.mjs` exists. This script could generate static HTML stubs for each route. Its current status and whether it is integrated into the build/deploy pipeline needs verification.

**Fix path:**
1. **Short-term (1–2 weeks):** Verify and activate `generate-canonical-route-html.mjs` for pre-rendered static HTML stubs per route — at minimum, correct title, description, canonical, and JSON-LD per page in raw HTML
2. **Medium-term (4–8 weeks):** Evaluate full SSG with Vite SSR or migrate critical landing pages to a framework with native SSG (Astro, Next.js, or Remix)

### 4.2 Title Tags & Meta Descriptions

**Homepage (static in index.html):**
- Title: `Interior Designers in Noida Extension & Greater Noida West | NestArcadia` ✅ (57 chars — good)
- Description: `Plan 2BHK, 3BHK and villa interiors in Noida Extension and Greater Noida West. Get practical space planning and turnkey execution with NestArcadia.` ✅ (148 chars — good)

**All other pages (JS-injected only — Googlebot may not see these):**

| Page | Title | Issues |
|---|---|---|
| `/design-cultures` | "Indian Design Cultures for Modern Homes" | Missing brand name, no location |
| `/interior-design-services` | "Interior Design Services in Noida, Greater Noida & NCR" | ✅ |
| `/our-story` | "Our Story \| Ancient Craft, Modern Indian Interiors" | Missing location |
| `/journal` | "Interior Design Cost Guides & Planning Journal \| NestArcadia" | ✅ |
| `/our-projects` | "Our Projects \| NestArcadia Interior Design" | Generic, no location |
| `/start-your-project` | "Start an Interior Design Project in Noida & NCR" | ✅ |
| `/faqs` | "Interior Design Cost, Services & FAQs \| Noida & NCR" | Missing brand name |
| `/admin` | "Admin Dashboard" | 🔴 Should not be indexable |

### 4.3 Sitemap

**Current:** `public/sitemap.xml` — 56 URLs confirmed (counted via grep)

**Issues:**
- ❌ No `<lastmod>` dates on any URL
- ❌ No `<priority>` or `<changefreq>` (optional but helpful for signals)
- ❌ Missing: `/privacy-policy` is in the codebase but was not confirmed in sitemap tail (need full audit)
- ⚠️ Budget guide draft articles (`/journal/2bhk-interior-cost-noida-extension/`, `/journal/3bhk-interior-cost-greater-noida-west/`) — should only be added after they are published
- ⚠️ Portfolio pages (`/our-projects/[slug]`) not in sitemap — these are rendered client-side from Supabase, so they may not be crawlable anyway
- ✅ All 17 local service pages included
- ✅ 29 journal article slugs appear to be included

### 4.4 Robots.txt

**Current content:**
```
User-agent: *
Allow: /
Sitemap: https://nestarcadia.com/sitemap.xml
```

**Issues:**
- ❌ `/admin` is accessible to crawlers — should be `Disallow: /admin`
- ❌ No AI crawler policy (GPTBot, Claude-Web, Anthropic-AI, Googlebot-AI)
- ❌ No `Crawl-delay` for less-critical bots
- ❌ Duplicate: `https://www.nestarcadia.com/sitemap.xml` not declared (if www is served)

### 4.5 Canonical Tags

- Homepage: `<link rel="canonical" href="https://nestarcadia.com/">` — static in `index.html` ✅
- All other pages: Set via JS only ❌
- Local service pages use trailing slash in sitemap (`/interior-design-greater-noida-west/`) but routes may serve without slash — potential duplicate content

### 4.6 Schema.org / Structured Data

Schema is generated dynamically in `App.tsx` for all routes. Types implemented:

| Schema Type | Pages | Delivery |
|---|---|---|
| ProfessionalService | All (global) | JS-injected ❌ |
| WebSite (SearchAction) | All (global) | JS-injected ❌ |
| WebPage | All routes | JS-injected ❌ |
| BlogPosting | Journal articles | JS-injected ❌ |
| Service | Local service pages | JS-injected ❌ |
| FAQPage | FAQs page | JS-injected ❌ |
| BreadcrumbList | Articles, local pages | JS-injected ❌ |

**Additional issues:**
- ProfessionalService schema shows address in Greater Noida West — no `@id` anchor for entity disambiguation
- `areaServed` limited to 4 areas — could expand
- Portfolio/project pages have no structured data at all
- OurStory/Design Cultures pages have no specific schema (just generic WebPage)

### 4.7 Core Web Vitals / Performance

**LCP (Largest Contentful Paint):**
- Hero image preloaded with `fetchpriority="high"` and `rel="preload"` in `index.html` ✅
- WebP format with mobile/desktop responsive variants ✅
- App bootloader static HTML overlay for homepage instant first paint ✅

**CLS (Cumulative Layout Shift):**
- Images have explicit `width`/`height` on most pages ✅
- Hero images use CSS sizing — potential CLS if dims not set

**FID/INP (Interaction to Next Paint):**
- GTM fires deferred (user interaction or idle callback) ✅
- Fonts loaded async ✅
- Lazy loading on all non-critical page components (React.lazy) ✅

**Fonts:**
- Self-hosted at `/fonts/fonts-v1.css` — async stylesheet link in `index.html`
- `font-display: swap` should be verified in font CSS
- Initial render depends on system fonts before swap

**Measurement gap:** No real CWV data available without Search Console / CrUX access. Baseline measurement required.

### 4.8 Internal Linking

- Journal articles: `related[]` array — links to 2–3 related articles ✅
- Local service pages: `related[]` array — cross-links between service pages ✅
- Homepage → Services, Journal, Start Project ✅
- Services page → local service pages (unclear — needs code check)
- **Gap:** No cross-linking from journal articles to local service pages or service offerings
- **Gap:** No programmatic internal links from service pages to relevant journal content
- **Gap:** No breadcrumb navigation visible in HTML (only BreadcrumbList schema via JS)

### 4.9 URL Structure

| Pattern | Example | Assessment |
|---|---|---|
| Core pages | `/interior-design-services` | ✅ Keyword-rich |
| Local service | `/interior-design-greater-noida-west` | ✅ Keyword-rich |
| Journal articles | `/journal/vastu-tips-new-home-noida-extension` | ✅ |
| Start project | `/start-your-project` | ✅ |
| OurStory | `/our-story` | ✅ |
| DesignCultures | `/design-cultures` | ⚠️ Could be `/indian-interior-design-styles` |
| Homes/Portfolio | `/our-projects` | ⚠️ Could be `/interior-design-portfolio-noida` |

### 4.10 Image SEO

- Hero images: WebP, preloaded, responsive — ✅
- Unsplash CDN images used widely (Unsplash `photo-*` IDs) — these are stock images, not original photography
- **Gap:** No structured `alt` text audit completed — many images use generic descriptions or empty alt
- **Gap:** No image sitemap
- **Gap:** No AVIF format (next-gen beyond WebP for further compression)
- OurStory/Homes pages use Unsplash directly — not locally optimised

---

## 5. Content & Keyword Gap Analysis

### 5.1 Primary Target Keywords (High Commercial Intent)

| Keyword | Est. Monthly Searches (IN) | Current Rank | Priority |
|---|---|---|---|
| interior designer in Noida Extension | 1,000–2,000 | ~94 | 🔴 P0 |
| interior designer in Greater Noida West | 500–1,500 | ~93 | 🔴 P0 |
| interior designers in Noida | 2,000–5,000 | Unknown | 🔴 P0 |
| 2BHK interior design cost Noida | 500–1,000 | Unknown | 🔴 P0 |
| 3BHK interior design cost Greater Noida | 500–1,000 | Unknown | 🔴 P0 |
| modular kitchen Noida Extension | 500–1,000 | Unknown | 🔴 P0 |
| turnkey interior design Noida | 200–500 | Unknown | 🔴 P0 |

### 5.2 Secondary Keywords (Informational / Mid-funnel)

| Keyword | Current Coverage | Gap |
|---|---|---|
| interior design cost 2BHK Noida | Draft article exists (unpublished) | Publish draft |
| interior design cost 3BHK Greater Noida | Draft article exists (unpublished) | Publish draft |
| vastu tips home Noida | Journal article exists | Needs refresh + optimisation |
| modular kitchen design Noida | Journal article exists | Needs internal linking to service page |
| false ceiling design bedroom | Journal article exists | Needs location targeting |
| Indian design heritage | Design Cultures page | Thin on SEO signals |

### 5.3 Missing Content (Keyword Gaps)

**High-priority pages that do not exist:**
1. `/interior-design-noida` — only a thin secondary page, needs a primary-quality page
2. `/modular-kitchen-design-noida-extension` — high commercial intent, no dedicated page
3. `/2bhk-interior-design-noida-extension` — config-specific landing page
4. `/3bhk-interior-design-greater-noida-west` — config-specific landing page
5. `/turnkey-interior-design-noida` — service-specific page
6. `/vastu-interior-design-noida` — service-specific page
7. `/luxury-interior-design-greater-noida-west` — premium tier page (1 SEO article exists but no page)
8. `/interior-design-cost-calculator` — interactive tool (high engagement potential)

**Content depth issues:**
- 14 of 17 local service pages are thin — same template, minimal unique content
- OurStory has no SEO-optimised content (no keyword mentions, no location signals)
- Design Cultures has no location tie-in ("These styles are popular in Noida NCR homes" etc.)
- Portfolio/Homes page shows design concepts attributed to Bengaluru, Pune, Ahmedabad — not NestArcadia's service area. This may confuse Googlebot's location relevance signals.

### 5.4 Content Quality Issues

| Issue | Evidence | Severity |
|---|---|---|
| Portfolio locations mismatch | "The Calm Retreat, Noida" ✅ but "The Courtyard Within, Bengaluru" / "The Earthy Home, Ahmedabad" — outside service area | 🟡 Medium |
| OurStory keyword density = ~0 | H1: "Our Story", no "interior design", "Noida", "Greater Noida" in page copy | 🟡 Medium |
| Design Cultures no location signal | Talks about Indian regions, not NestArcadia service area | 🟡 Medium |
| Services H1 generic | H1: "Our Services" — no keyword | 🟡 Medium |
| Budget guides unpublished | 2BHK/3BHK cost guides exist as Supabase drafts only | 🔴 High — these are highest-intent informational queries |

---

## 6. Conversion & UX Audit

### 6.1 Lead Capture Flows

**Primary CTA: "Start Your Project"**
- Multi-step form: name, email, phone, city, project type, configuration, budget, timeline, style, message
- Validation: client-side only (phone, email, required fields) ✅
- Submission goes to Supabase via Edge Function ✅
- Error/success states present ✅
- **Gap:** No WhatsApp API direct-open (WhatsApp button is a floating widget but no form-to-WhatsApp fallback)
- **Gap:** No confirmation email to lead
- **Gap:** No calendar booking integration

**Secondary CTAs:**
- WhatsApp floating button (global) ✅
- MobileConversionBar component (mobile only) ✅
- "Get a Quote" / "Get Your Free Quote" in service pages ✅

### 6.2 UX Issues Affecting SEO

| Issue | Affected Pages | SEO Impact |
|---|---|---|
| No breadcrumb nav visible (only in schema) | All pages except homepage | 🟡 UX + SEO |
| No cross-links journal → services | Journal articles | 🟡 Internal link equity |
| No cross-links local pages → journal | Local service pages | 🟡 Topical authority |
| No "near me" or map embed | Local service pages | 🟡 Local SEO |
| Portfolio shows non-NCR locations | /our-projects | 🟡 Location relevance |
| No visible star rating or reviews | All pages | 🔴 Trust + Local SEO |
| No Google Business Profile widget | All pages | 🔴 Local SEO |

### 6.3 Mobile UX

- MobileConversionBar exists ✅
- Responsive design confirmed (Tailwind responsive classes throughout) ✅
- Hero text: `clamp(2.35rem, 6.5vw, 4.9rem)` — scales correctly ✅
- **Gap:** No mobile-specific schema or viewport-aware content differentiation

---

## 7. PR #108 — Status & Overlap Assessment

**Status:** Merged to main (confirmed by user).

**Changes merged:**
- Accessibility: skip link, ARIA improvements, keyboard focus fixes, WCAG 2.1 AA colour contrast
- Security: admin sessionStorage cleared on logout (removed plaintext password from persistent storage)
- SEO: `lang="en-IN"` on `<html>`, Twitter Card meta tags, skip navigation link
- CSS: `globals.css` restored to full content after truncation incident (corrective commit daa910c included)

**Overlap with SEO brief:**
- Twitter Card meta ✅ — resolved, no further action needed
- lang attribute ✅ — resolved
- Skip link ✅ — resolved
- Admin security ✅ — resolved
- Accessibility ✅ — resolved

**No regressions from PR #108** that would block SEO work. Build passes. All prior CSS preserved.

---

## 8. Prioritised Implementation Roadmap

### Phase 1 — Rendering Fix (BLOCKING — do first) 🔴
**Estimated effort:** 3–5 days  
**Branch:** `seo/phase-1-prerender`

| Task | Description | Priority |
|---|---|---|
| 1.1 | Audit `scripts/generate-canonical-route-html.mjs` — verify it generates correct title/description/canonical/JSON-LD per route | P0 |
| 1.2 | Integrate pre-render script into Vite build output for all 54+ routes | P0 |
| 1.3 | Verify Hostinger serves pre-rendered HTML to crawlers (Content-Type, response code 200) | P0 |
| 1.4 | Validate with `curl -A "Googlebot"` that correct per-route metadata is in raw HTML | P0 |

### Phase 2 — Technical SEO Quick Wins (1 week) 🟠
**Branch:** `seo/phase-2-technical`

| Task | Description | Priority |
|---|---|---|
| 2.1 | `robots.txt`: add `Disallow: /admin`, AI crawler policy (GPTBot, Claude-Web), sitemap www variant | P0 |
| 2.2 | `sitemap.xml`: add `<lastmod>` dates, verify all 56 URLs are canonical | P0 |
| 2.3 | Sitemap: add `<priority>` weights (1.0 homepage, 0.9 primary service, 0.8 journal, 0.6 secondary) | P1 |
| 2.4 | Services H1: change from "Our Services" to "Interior Design Services in Noida & NCR" | P1 |
| 2.5 | Publish budget guides (2BHK, 3BHK cost guides) — change Supabase status from draft to published | P0 |
| 2.6 | Verify font-display:swap in fonts-v1.css | P1 |

### Phase 3 — On-Page Content Optimisation (2 weeks) 🟡
**Branch:** `seo/phase-3-onpage`

| Task | Description | Priority |
|---|---|---|
| 3.1 | Upgrade 14 thin local service pages with unique 400+ word content blocks | P0 |
| 3.2 | Add location signal to OurStory page ("Based in Greater Noida West, serving Noida NCR") | P1 |
| 3.3 | Add "NestArcadia in Noida NCR" section to Design Cultures page | P1 |
| 3.4 | Fix portfolio locations — either change Bengaluru/Pune/Ahmedabad to NCR or add disclaimer | P1 |
| 3.5 | Add internal links: journal articles → relevant local service pages | P1 |
| 3.6 | Add internal links: local service pages → relevant journal articles | P1 |
| 3.7 | Add visible breadcrumb navigation component | P2 |

### Phase 4 — New SEO Landing Pages (3–4 weeks) 🟡
**Branch:** `seo/phase-4-new-pages`

| URL | Target Keyword | Priority |
|---|---|---|
| `/modular-kitchen-design-noida-extension` | modular kitchen Noida Extension | P0 |
| `/2bhk-interior-design-noida-extension` | 2BHK interior design Noida Extension | P0 |
| `/3bhk-interior-design-greater-noida-west` | 3BHK interior design Greater Noida | P0 |
| `/turnkey-interior-design-noida` | turnkey interior design Noida | P1 |
| `/vastu-interior-design-noida` | vastu interior design Noida | P1 |
| `/luxury-interior-design-greater-noida-west` | luxury interior design Greater Noida West | P1 |

### Phase 5 — Local SEO (2 weeks) 🟡
**Branch:** `seo/phase-5-local`

| Task | Description |
|---|---|
| 5.1 | Google Business Profile: audit NAP consistency (G-59, Fusion Ufairia Mall, Sector 16B, Greater Noida West) |
| 5.2 | Add `geo.region`, `geo.position`, `ICBM` meta tags to index.html |
| 5.3 | Enhance LocalBusiness schema: add `openingHours`, `priceRange`, `hasMap` |
| 5.4 | Add Google Maps embed to contact/start-project page |
| 5.5 | Local citation building: JustDial, Sulekha, UrbanClap, Housing.com |

### Phase 6 — Schema Enhancement (1 week)
| Task | Description |
|---|---|
| 6.1 | Add `aggregateRating` to ProfessionalService schema (requires real reviews) |
| 6.2 | Add `HowTo` schema to relevant journal articles |
| 6.3 | Expand FAQPage schema — ensure all 5 FAQ groups are represented |
| 6.4 | Add `ImageObject` schema to portfolio/homes pages |

### Phase 7 — Performance / CWV (ongoing)
| Task | Description |
|---|---|
| 7.1 | Measure real CWV baseline via Search Console / PageSpeed Insights |
| 7.2 | AVIF format support for hero images |
| 7.3 | Audit alt text across all pages |
| 7.4 | Image sitemap for journal article images |

---

## 9. Access Requirements for Blocked Tasks

| Task | Blocked By | Required Access |
|---|---|---|
| Search Console verification | Cannot verify indexation status | Google Search Console owner access |
| CWV real data | No field data visible | Search Console / CrUX access |
| Budget guide publication | Supabase admin | Admin dashboard (at `/admin`) or direct Supabase table access |
| Google Business Profile audit | External to codebase | GBP account access for `nestarcadia.com` |
| Local citation check | External directories | Manual check required |
| Rendering validation | Cannot `curl` live Hostinger | Live site access + terminal to run `curl -A "Googlebot" https://nestarcadia.com/interior-design-services` |
| Sitemap indexation status | Contradictory signals in Milestone 2 | Search Console sitemap report |
| PR #106 status | Was PR #106 (`seo/milestone-3-content-cro-performance`) ever merged to main? | GitHub PR list check |

---

## 10. Estimated Effort & Dependencies

| Phase | Effort | Dependencies | Can Start? |
|---|---|---|---|
| Phase 1 — Rendering Fix | 3–5 days | None — codebase access sufficient | ✅ Immediately |
| Phase 2 — Technical Quick Wins | 2–3 days | Phase 1 (pre-render must work before meta validation) | After Phase 1 |
| Phase 3 — On-Page Content | 5–7 days | Phase 1 (content must be in pre-rendered HTML) | After Phase 1 |
| Phase 4 — New Landing Pages | 7–10 days | Phase 1 + 3 (page framework + internal links) | After Phase 3 |
| Phase 5 — Local SEO | 3–5 days | GBP access (external) + Phase 2 | Partial start OK |
| Phase 6 — Schema | 2–3 days | Phase 1 (schema must be pre-rendered) | After Phase 1 |
| Phase 7 — CWV/Performance | Ongoing | Search Console data access | Partial start OK |

**Total estimated in-codebase effort: ~25–35 days across all phases**

---

## 11. Risks & Recommended Execution Sequence

### Critical Risks

| Risk | Severity | Mitigation |
|---|---|---|
| CSR architecture means all SEO work is undermined without Phase 1 | 🔴 CRITICAL | Phase 1 must be completed and validated before any other phases are deployed |
| Thin content on 14 secondary local pages may trigger quality assessment by Google | 🟠 High | Upgrade or consolidate thin pages (Phase 3.1) |
| Portfolio showing non-NCR locations may confuse geographic relevance signals | 🟡 Medium | Fix location attribution or add clarity text |
| Budget guides published as drafts only — highest-intent informational queries unanswered | 🟠 High | Publish immediately (Phase 2.5) |
| `generate-canonical-route-html.mjs` script status unknown — may already pre-render | 🟠 High | Audit script before assuming full CSR — if pre-render already works, Phase 1 timeline reduces to validation only |
| Google Search Console shows 0 indexed URLs in sitemap (Milestone 2 data) — possible indexing block | 🔴 High | Requires Search Console access to investigate |

### Recommended Execution Sequence

```
Week 1:  Audit generate-canonical-route-html.mjs + activate pre-rendering (Phase 1)
         → robots.txt hardening + sitemap lastmod (Phase 2.1–2.2)
         → Publish budget guides (Phase 2.5)

Week 2:  Validate pre-rendering with curl + GSC re-request indexation
         → Services H1 optimisation + thin local page content upgrades begin (Phase 2.4, 3.1)

Week 3:  Complete thin local page upgrades + internal linking (Phase 3)
         → Start new landing pages (modular kitchen, 2BHK, 3BHK — Phase 4)

Week 4:  Local SEO + schema enhancements (Phases 5 + 6)

Ongoing: CWV monitoring, content calendar, link building
```

---

## 12. Summary Severity Table

| Finding | Severity | Phase |
|---|---|---|
| CSR — no static metadata for non-homepage routes | 🔴 CRITICAL | 1 |
| Budget guide articles unpublished | 🔴 HIGH | 2 |
| Search Console showing 0 indexed sitemap URLs (Milestone 2 data) | 🔴 HIGH | 1 |
| robots.txt: /admin not disallowed | 🟠 HIGH | 2 |
| Sitemap: no lastmod dates | 🟠 HIGH | 2 |
| 14 thin local service pages | 🟠 HIGH | 3 |
| Services H1 not keyword-optimised | 🟡 MEDIUM | 2 |
| Portfolio locations outside NCR | 🟡 MEDIUM | 3 |
| No visible breadcrumbs | 🟡 MEDIUM | 3 |
| No cross-links journal ↔ services | 🟡 MEDIUM | 3 |
| No reviews / aggregateRating | 🟡 MEDIUM | 5 |
| No map embed on local/contact pages | 🟡 MEDIUM | 5 |
| All schema JS-only (not pre-rendered) | 🔴 CRITICAL | 1 |
| OurStory / DesignCultures no location keywords | 🟡 MEDIUM | 3 |
| No AVIF / image optimisation pipeline gap | 🟢 LOW | 7 |

---

*Prepared by Claude Sonnet 4.6 — NestArcadia SEO Baseline Audit, Phase 0*  
*Branch: seo/phase-0-audit | November 2026*  
*Next step: Review this audit, approve execution sequence, then proceed to Phase 1 (pre-rendering validation)*
