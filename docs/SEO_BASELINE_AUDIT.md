# NestArcadia — SEO Baseline Audit
**Date:** November 2026  
**Branch:** seo/phase-0-audit  
**Auditor:** Claude Sonnet 4.6 (Phase 0 — Discovery)  
**Goal:** First-page rankings for high-intent interior design searches in Noida / Greater Noida NCR  
**Revision:** R1 — corrections applied per PR #109 review (17 Nov 2026)

---

## 1. Executive Summary

NestArcadia has a well-structured, visually premium React SPA with an **existing build-time prerendering pipeline** that generates route-specific HTML for every sitemap URL. The site's primary SEO constraint is not the absence of prerendering, but that the existing pipeline has not been audited against live production responses, and its output has not been independently verified with crawler-perspective HTTP checks.

**Rendering architecture (corrected):** The `package.json` build command is:

```json
"build": "vite build && node scripts/generate-canonical-route-html.mjs"
```

The script at `scripts/generate-canonical-route-html.mjs` (632 lines) runs on every production build. It reads `dist/index.html` and `dist/sitemap.xml`, parses TypeScript source files (`src/App.tsx`, `src/pages/LocalService/LocalServicePage.tsx`, `src/pages/Journal/Journal.tsx`) and `src/data/seo/luxury-interior-design-noida-extension.json` using the TypeScript compiler API. For each sitemap URL, it generates a route-specific `index.html` with correct `<title>`, `<meta name="description">`, `<link rel="canonical">`, OG tags, Twitter Card tags, full JSON-LD (WebPage, Service, BlogPosting, BreadcrumbList, FAQPage), and static content blocks inside `<div id="root">`. The script has hard assertion checks that throw on missing canonical, title, OG, or schema.

**What remains unverified:** Whether Hostinger serves these prerendered files with HTTP 200 to crawlers, and whether Google has indexed the prerendered content. This requires live-site `curl` checks and Search Console access.

**Current organic position baseline:**

| Metric | Value | Source | Verification |
|---|---|---|---|
| "interior designer in Greater Noida West" | avg position ~93 | Reported as Search Console, Oct 2026 (prior session context) | ⚠️ NOT independently verified — country, device, date range unconfirmed |
| "interior designer in Noida Extension" | avg position ~94 | Reported as Search Console, Oct 2026 (prior session context) | ⚠️ NOT independently verified |
| Homepage impressions/clicks | ~24 impressions, ~2 clicks | Reported as Search Console, Oct 2026 (prior session context) | ⚠️ NOT independently verified |

The site currently has minimal organic visibility for primary commercial queries. Independent verification via Google Search Console is required to confirm these figures.

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
| Prerender | Build-time HTML generation | `scripts/generate-canonical-route-html.mjs` (integrated in `package.json` build) |

### Project Structure
```
src/
  App.tsx                      # Router, pageMeta, all schema generation
  main.tsx                     # Entrypoint
  index.css                    # Tailwind v4 + global CSS
  pages/
    Home/                      # Hero carousel, static bootloader overlay
    LocalService/              # 17 location pages (3 primary, 14 secondary)
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
  generate-canonical-route-html.mjs   # Build-time prerender — INTEGRATED in package.json build command
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

**Budget guide slugs (publication status unverified — see §5.4):**
- `/journal/2bhk-interior-cost-noida-extension/`
- `/journal/3bhk-interior-cost-greater-noida-west/`

### Admin Routes (not in sitemap, correct)
- `/admin` — login/dashboard

---

## 4. Technical SEO Baseline

### 4.1 Rendering Architecture — Existing Prerender Pipeline ✅ (Verification Required)

**Finding:** The site is a React SPA with an **integrated build-time prerendering pipeline**. The prerender script (`scripts/generate-canonical-route-html.mjs`, 632 lines) is wired into the production build command in `package.json`:

```json
"build": "vite build && node scripts/generate-canonical-route-html.mjs"
```

**Evidence from code:**
- **`package.json`**: The build command chains `vite build` → `node scripts/generate-canonical-route-html.mjs`
- **Script behaviour**: Reads `dist/index.html` and `dist/sitemap.xml` after Vite builds. Parses source files using TypeScript compiler API. For each sitemap URL, writes a route-specific `index.html` with:
  - Correct `<title>` tag
  - `<meta name="description">`
  - `<link rel="canonical">`
  - Open Graph tags (og:title, og:description, og:url, og:image)
  - Twitter Card tags
  - Full JSON-LD per route type (WebPage, Service, BlogPosting, BreadcrumbList, FAQPage)
  - Static content blocks inside `<div id="root">`
- **Validation**: Script has hard assertion checks — throws `Error` if canonical, title, OG, or schema is missing or duplicated per route
- **CI/CD**: The GitHub Actions build workflow (`Build Check`) runs `pnpm build`, which executes this script on every PR and merge to main

**What the pipeline does NOT do:**
- It does not perform full browser-based SSR — it generates HTML from TypeScript AST parsing
- It does not verify that Hostinger serves the generated HTML (a live-site check is needed)
- It does not confirm Google has crawled and indexed the prerendered content

**What needs verification (requires live-site access):**
1. `curl -sI -A "Googlebot" https://nestarcadia.com/interior-design-services/` — does Hostinger serve the prerendered HTML or the SPA shell?
2. Does the prerendered HTML hydrate correctly without JS errors?
3. Is the JSON-LD valid per Google's Rich Results Test for each route type?
4. Are canonical tags in prerendered HTML consistent with sitemap URLs (trailing slash)?

### 4.2 Title Tags & Meta Descriptions

**Homepage (static in index.html + prerendered):**
- Title: `Interior Designers in Noida Extension & Greater Noida West | NestArcadia` ✅ (57 chars — good)
- Description: `Plan 2BHK, 3BHK and villa interiors in Noida Extension and Greater Noida West. Get practical space planning and turnkey execution with NestArcadia.` ✅ (148 chars — good)

**All other pages (prerendered in build-time HTML + set by JS at runtime):**

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

**Current:** `public/sitemap.xml` — 56 URLs confirmed

**Issues:**
- ❌ No `<lastmod>` dates on any URL — recommend adding only when accurate modification dates are available from build timestamps or CMS record `updated_at` fields
- ⚠️ Budget guide draft articles (`/journal/2bhk-interior-cost-noida-extension/`, `/journal/3bhk-interior-cost-greater-noida-west/`) — publication status unverified (see §5.4). If these return HTTP 404 in production, they should not be in the sitemap
- ⚠️ Portfolio pages (`/our-projects/[slug]`) not in sitemap — these are rendered client-side from Supabase, so they may not be crawlable anyway
- ✅ All 17 local service pages included
- ✅ 29 journal article slugs appear to be included

**Note on `<priority>` and `<changefreq>`:** Google's documentation states that Googlebot ignores both `<priority>` and `<changefreq>` values. These are not recommended as ranking interventions. The focus should be on ensuring the URL set matches canonical routes, published CMS content, and that all listed URLs return HTTP 200.

### 4.4 Robots.txt

**Current content:**
```
User-agent: *
Allow: /
Sitemap: https://nestarcadia.com/sitemap.xml
```

**Recommended changes:**
- Add `Disallow: /admin` — not a security measure (determined crawlers ignore robots.txt), but reduces crawl budget waste on non-public pages
- Add specific AI crawler policies rather than blanket allow/block:
  ```
  User-agent: GPTBot
  Disallow: /

  User-agent: ClaudeBot
  Disallow: /

  User-agent: Anthropic-AI
  Disallow: /

  User-agent: PerplexityBot
  Disallow: /

  User-agent: Amazonbot
  Disallow: /
  ```
  (Evaluate each AI crawler individually based on business needs — the above blocks training crawlers while allowing standard search engine bots)
- Verify whether `www.nestarcadia.com` is served (if so, declare the sitemap at both domains or redirect www → non-www)

**Note on `Crawl-delay`:** Google ignores the `Crawl-delay` directive for Googlebot. It is not an effective SEO lever and is not recommended. Crawl rate for Googlebot is managed through Search Console.

### 4.5 Canonical Tags

- Homepage: `<link rel="canonical" href="https://nestarcadia.com/">` — static in `index.html` ✅
- All other pages: Set both in prerendered HTML (build-time) and by JS (runtime) — **verify consistency** between the two
- Local service pages use trailing slash in sitemap (`/interior-design-greater-noida-west/`) — verify prerendered HTML canonicals also use trailing slash

### 4.6 Schema.org / Structured Data

Schema is generated dynamically in `App.tsx` and also embedded in prerendered HTML by `generate-canonical-route-html.mjs`:

| Schema Type | Pages | Build-time Prerendered |
|---|---|---|
| ProfessionalService | All (global) | ✅ via prerender script |
| WebSite (SearchAction) | All (global) | ✅ via prerender script |
| WebPage | All routes | ✅ via prerender script |
| BlogPosting | Journal articles | ✅ via prerender script |
| Service | Local service pages | ✅ via prerender script |
| FAQPage | FAQs page | ✅ via prerender script |
| BreadcrumbList | Articles, local pages | ✅ via prerender script |

**Additional issues requiring verification:**
- ProfessionalService schema shows address in Greater Noida West — no `@id` anchor for entity disambiguation
- `areaServed` limited to 4 areas — could expand
- Portfolio/project pages have no structured data at all
- OurStory/Design Cultures pages have no specific schema (just generic WebPage)
- **Validation required:** Run Google Rich Results Test against prerendered HTML to confirm schema is well-formed

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
- **Prerender script cross-links:** The prerender script embeds cross-links from journal article pages to local service pages in the static HTML
- **Gap:** No cross-linking from journal articles to local service pages at the React component level (only in prerendered HTML)
- **Gap:** No programmatic internal links from service pages to relevant journal content
- **Gap:** No breadcrumb navigation visible in HTML (only BreadcrumbList schema)

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

> **Data provenance note:** Search volume estimates below are **unverified third-party estimates** — source tool, date, country filter, and device type are unknown. They are included only to indicate relative order of magnitude. Actual demand should be verified through Google Search Console impression data once access is available.

| Keyword | Est. Monthly Searches (IN) | Current Rank | Priority |
|---|---|---|---|
| interior designer in Noida Extension | ~1,000–2,000 (unverified estimate) | ~94 (unverified — see §1) | 🔴 P0 |
| interior designer in Greater Noida West | ~500–1,500 (unverified estimate) | ~93 (unverified — see §1) | 🔴 P0 |
| interior designers in Noida | ~2,000–5,000 (unverified estimate) | Unknown | 🔴 P0 |
| 2BHK interior design cost Noida | ~500–1,000 (unverified estimate) | Unknown | 🔴 P0 |
| 3BHK interior design cost Greater Noida | ~500–1,000 (unverified estimate) | Unknown | 🔴 P0 |
| modular kitchen Noida Extension | ~500–1,000 (unverified estimate) | Unknown | 🔴 P0 |
| turnkey interior design Noida | ~200–500 (unverified estimate) | Unknown | 🔴 P0 |

### 5.2 Secondary Keywords (Informational / Mid-funnel)

| Keyword | Current Coverage | Gap |
|---|---|---|
| interior design cost 2BHK Noida | Budget guide article exists — publication status unverified (see §5.4) | Verify publication status, then optimise |
| interior design cost 3BHK Greater Noida | Budget guide article exists — publication status unverified (see §5.4) | Verify publication status, then optimise |
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
7. `/luxury-interior-design-greater-noida-west` — premium tier page (1 SEO article exists but no dedicated page)
8. `/interior-design-cost-calculator` — interactive tool (high engagement potential)

**Content depth issues:**
- 14 of 17 local service pages use a thinner template — see §8 Phase 3 for recommended approach (not blanket word-count expansion)
- OurStory has no SEO-optimised content (no keyword mentions, no location signals)
- Design Cultures has no location tie-in ("These styles are popular in Noida NCR homes" etc.)
- Portfolio/Homes page shows design concepts attributed to Bengaluru, Pune, Ahmedabad, Dehradun — outside NCR service area. The prerender script explicitly frames these as "design studies, showing possible design directions rather than claiming every concept is a completed installation" — this framing should be preserved and reinforced.

### 5.4 Content Quality & Publication Status

| Issue | Evidence | Severity |
|---|---|---|
| Portfolio locations mismatch | "The Calm Retreat, Noida" ✅ but "The Courtyard Within, Bengaluru" / "The Earthy Home, Ahmedabad" — outside service area. Prerender script frames as design studies. | 🟡 Medium |
| OurStory keyword density = ~0 | H1: "Our Story", no "interior design", "Noida", "Greater Noida" in page copy | 🟡 Medium |
| Design Cultures no location signal | Talks about Indian regions, not NestArcadia service area | 🟡 Medium |
| Services H1 generic | H1: "Our Services" — no keyword | 🟡 Medium |
| Budget guide publication status unverified | PR #106 documented these as "drafts pending release cutover." The slugs appear in `sitemap.xml`, and the prerender script will generate HTML for them if they are in the sitemap. However, whether these URLs return HTTP 200 with real content (vs. 404 or empty shell) depends on Supabase CMS record status. **Requires Supabase admin access or live HTTP check to confirm.** | 🔴 High — cannot determine actual status without live-site or Supabase access |
| Zero verified completed-project records | Repository has previously documented zero verified completed-project records. Design concepts must be presented as design concepts until actual project evidence is supplied by the owner. | 🟡 Medium |

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
| Portfolio shows non-NCR locations | /our-projects | 🟡 Location relevance — preserve design concept framing |
| No Google Business Profile widget | All pages | 🟡 Local SEO |

**Note on reviews and aggregateRating:** The repository has zero verified completed-project records. `aggregateRating` schema requires genuine reviews from real customers. This is **not an actionable near-term item** — it requires the owner to supply verified project evidence and real customer reviews before any review markup or display can be implemented. Adding `aggregateRating` without real reviews would violate Google's structured data guidelines.

### 6.3 Mobile UX

- MobileConversionBar exists ✅
- Responsive design confirmed (Tailwind responsive classes throughout) ✅
- Hero text: `clamp(2.35rem, 6.5vw, 4.9rem)` — scales correctly ✅
- **Gap:** No mobile-specific schema or viewport-aware content differentiation

---

## 7. Merged PR Reconciliation

### PR #108 — Merged to main ✅

**Changes delivered:**
- Accessibility: skip link, ARIA improvements, keyboard focus fixes, WCAG 2.1 AA colour contrast
- Security: admin sessionStorage cleared on logout (removed plaintext password from persistent storage)
- SEO: `lang="en-IN"` on `<html>`, Twitter Card meta tags, skip navigation link
- CSS: `globals.css` restored to full content after truncation incident (corrective commit `daa910c`)

**Overlap with SEO brief:** Twitter Card meta, lang attribute, skip link, admin security, accessibility — all resolved. No further action needed on these items. No regressions detected.

### PR #106 (`seo/milestone-3-content-cro-performance`) — Status & Content

**What PR #106 documented:**
- Content changes including budget guide draft content
- Drafts were described as "pending release cutover"

**What remains unverified:**
- Whether PR #106 was merged to main (requires GitHub PR status check or `git log` on main)
- Whether the budget guide articles are in "published" or "draft" status in Supabase CMS
- Whether the budget guide URLs (`/journal/2bhk-interior-cost-noida-extension/`, `/journal/3bhk-interior-cost-greater-noida-west/`) return HTTP 200 with content or HTTP 404 in production

**Impact on this audit:** The budget guide publication status is a key unknown. If published, they represent live content assets for high-intent informational queries. If still in draft, publishing them is a high-priority action. This cannot be determined from the codebase alone — it requires Supabase admin access or live HTTP checks.

---

## 8. Prioritised Implementation Roadmap

### Phase 1 — Audit, Validate & Harden Existing Prerendering Pipeline 🔴
**Estimated effort:** 2–3 days  
**Branch:** `seo/phase-1-prerender-validation`

The prerender script is already integrated into the build pipeline. Phase 1 is about **validating and hardening** the existing implementation, not activating it.

| Task | Description | Priority |
|---|---|---|
| 1.1 | Test all 56 sitemap URLs against prerendered `dist/` output — verify correct title, description, canonical, JSON-LD per route | P0 |
| 1.2 | Verify canonical tags in prerendered HTML match sitemap URLs (trailing slash consistency) | P0 |
| 1.3 | Verify Hostinger serves prerendered HTML to crawlers — `curl -sI -A "Googlebot" https://nestarcadia.com/interior-design-services/` → expect route-specific `<title>`, not homepage title | P0 |
| 1.4 | Run Google Rich Results Test against representative prerendered pages (homepage, 1 service page, 1 article, 1 FAQ) | P0 |
| 1.5 | Verify React hydration completes without console errors on prerendered pages | P1 |
| 1.6 | Add CI check: compare `dist/` prerendered output against expected metadata for a sample of routes | P2 |

### Phase 2 — Technical SEO Quick Wins (1 week) 🟠
**Branch:** `seo/phase-2-technical`

| Task | Description | Priority |
|---|---|---|
| 2.1 | `robots.txt`: add `Disallow: /admin`, individual AI crawler policies (GPTBot, ClaudeBot, Anthropic-AI, PerplexityBot, Amazonbot) | P0 |
| 2.2 | `sitemap.xml`: add `<lastmod>` dates where accurate modification dates are available (build timestamps or CMS `updated_at`). Remove any URLs that return non-200 in production. | P0 |
| 2.3 | Services H1: change from "Our Services" to "Interior Design Services in Noida & NCR" | P1 |
| 2.4 | Verify budget guide publication status (Supabase admin or live HTTP check). If draft: publish. If 404 in sitemap: remove from sitemap until published. | P0 |
| 2.5 | Verify font-display:swap in fonts-v1.css | P1 |

### Phase 3 — On-Page Content Strategy (2 weeks) 🟡
**Branch:** `seo/phase-3-onpage`

| Task | Description | Priority |
|---|---|---|
| 3.1 | **Evaluate 14 secondary local service pages individually.** For each page: (a) if NestArcadia genuinely serves that area with differentiated offerings, improve the page with unique content reflecting real service coverage; (b) if the area is a stretch or the page would duplicate another page's content, consolidate into the nearest primary page or redirect; (c) do not add generic 400+ word filler to all 14 pages — this risks creating doorway pages with no genuine unique value. | P0 |
| 3.2 | Add location signal to OurStory page ("Based in Greater Noida West, serving Noida NCR") | P1 |
| 3.3 | Add "NestArcadia in Noida NCR" section to Design Cultures page | P1 |
| 3.4 | Portfolio: **do not alter project locations or invent reviews.** Reinforce the existing "design studies" framing. Add a note clarifying NestArcadia's service area (Noida / Greater Noida NCR) alongside the design concepts until actual NCR project evidence is supplied by the owner. | P1 |
| 3.5 | Add internal links: journal articles → relevant local service pages (at React component level, complementing prerender cross-links) | P1 |
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

| Task | Description | Priority |
|---|---|---|
| 5.1 | **Google Business Profile:** Verify and audit NAP consistency (G-59, Fusion Ufairia Mall, Sector 16B, Greater Noida West). GBP verification is the highest-priority local SEO action. | P0 |
| 5.2 | Enhance LocalBusiness schema: add `openingHours`, `priceRange`, `hasMap`, ensure `@id` anchor for entity disambiguation | P0 |
| 5.3 | Add Google Maps embed to contact/start-project page | P1 |
| 5.4 | Local citation building: JustDial, Sulekha, UrbanClap, Housing.com — ensure consistent NAP across all directories | P1 |
| 5.5 | Verify genuine service-area coverage matches the locations targeted by local pages (informs Phase 3.1 consolidation decisions) | P0 |

**Note on geo meta tags:** `geo.region`, `geo.position`, and `ICBM` meta tags have no documented ranking effect in Google Search and are not recommended as a priority local SEO intervention. Local ranking signals come from verified business information (GBP), LocalBusiness schema, genuine service-area relevance, NAP consistency, and reviews — not from meta tags.

### Phase 6 — Schema Enhancement (1 week)
| Task | Description | Priority |
|---|---|---|
| 6.1 | Add `HowTo` schema to relevant journal articles | P1 |
| 6.2 | Expand FAQPage schema — ensure all 5 FAQ groups are represented | P1 |
| 6.3 | Add `ImageObject` schema to portfolio/homes pages | P2 |

**Note on `aggregateRating`:** Requires real customer reviews from verified completed projects. The repository has zero verified completed-project records. This schema type is **not actionable** until the owner supplies genuine review data. Adding fabricated or placeholder `aggregateRating` would violate Google's structured data policies.

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
| Search Console verification | Cannot verify indexation status or ranking data | Google Search Console owner access |
| CWV real data | No field data visible | Search Console / CrUX access |
| Budget guide publication status | Cannot determine if published or draft | Supabase admin dashboard (at `/admin`) or direct table access to `public.blogs_078be9eb` |
| Prerender validation | Cannot verify what Hostinger serves to crawlers | Live site access + terminal: `curl -sI -A "Googlebot" https://nestarcadia.com/interior-design-services/` |
| Google Business Profile audit | External to codebase | GBP account access for `nestarcadia.com` |
| Local citation check | External directories | Manual check required |
| Sitemap indexation status | Contradictory signals in Milestone 2 | Search Console sitemap report |
| PR #106 merge status | Need to confirm what shipped to main | `git log main --oneline` or GitHub PR list |
| Search volume verification | Estimates are unattributed third-party data | Google Search Console impression data (IN, all devices) or a specified keyword research tool |

---

## 10. Estimated Effort & Dependencies

| Phase | Effort | Dependencies | Can Start? |
|---|---|---|---|
| Phase 1 — Prerender Validation | 2–3 days | Live-site access for curl checks | ✅ Code audit immediately; live checks need access |
| Phase 2 — Technical Quick Wins | 2–3 days | Phase 1 (prerender must be validated before trusting metadata) | After Phase 1 |
| Phase 3 — On-Page Content | 5–7 days | Phase 1 + owner input on genuine service areas | After Phase 1 |
| Phase 4 — New Landing Pages | 7–10 days | Phase 1 + 3 (page framework + internal links) | After Phase 3 |
| Phase 5 — Local SEO | 3–5 days | GBP access (external) + Phase 2 | Partial start OK |
| Phase 6 — Schema | 2–3 days | Phase 1 (verify schema in prerendered HTML first) | After Phase 1 |
| Phase 7 — CWV/Performance | Ongoing | Search Console data access | Partial start OK |

**Total estimated in-codebase effort: ~25–35 days across all phases**

---

## 11. Risks & Recommended Execution Sequence

### Critical Risks

| Risk | Severity | Mitigation |
|---|---|---|
| Prerender pipeline exists but production serving is unverified — if Hostinger doesn't serve prerendered HTML, metadata is still JS-dependent | 🔴 HIGH | Phase 1 live-site validation is the first gate |
| Thin content on 14 secondary local pages may trigger quality assessment by Google | 🟠 High | Evaluate individually — consolidate or improve based on genuine service coverage (Phase 3.1) |
| Portfolio showing non-NCR locations may confuse geographic relevance signals | 🟡 Medium | Reinforce design study framing; do not alter locations or invent reviews |
| Budget guide publication status unknown — highest-intent informational queries may be unanswered | 🟠 High | Verify via Supabase admin or live HTTP check (Phase 2.4) |
| Search Console showing 0 indexed URLs in sitemap (Milestone 2 data) — possible indexing issue | 🔴 HIGH | Requires Search Console access to investigate |
| Search volume estimates used in this audit are unverified third-party data | 🟡 Medium | Replace with Search Console impression data once access is granted |

### Recommended Execution Sequence

```
Week 1:  Validate prerender pipeline output against all 56 routes (Phase 1.1–1.2)
         → Live-site curl checks: does Hostinger serve prerendered HTML? (Phase 1.3)
         → robots.txt hardening + sitemap lastmod where dates available (Phase 2.1–2.2)
         → Verify budget guide status (Phase 2.4)

Week 2:  Rich Results Test on representative pages (Phase 1.4)
         → Services H1 optimisation (Phase 2.3)
         → Begin individual evaluation of 14 secondary local pages (Phase 3.1)

Week 3:  Complete local page evaluation — consolidate/improve/redirect (Phase 3)
         → Internal linking improvements (Phase 3.5–3.6)
         → Start new landing pages (modular kitchen, 2BHK, 3BHK — Phase 4)

Week 4:  Local SEO: GBP verification + schema improvements (Phases 5 + 6)

Ongoing: CWV monitoring, content calendar, link building
```

---

## 12. Summary Severity Table

| Finding | Severity | Phase |
|---|---|---|
| Prerender pipeline exists but production serving unverified | 🔴 HIGH | 1 |
| Budget guide publication status unknown | 🔴 HIGH | 2 |
| Search Console showing 0 indexed sitemap URLs (Milestone 2 data) | 🔴 HIGH | 1 |
| robots.txt: /admin not disallowed, no AI crawler policy | 🟠 HIGH | 2 |
| Sitemap: no lastmod dates | 🟠 MEDIUM | 2 |
| 14 secondary local service pages need individual evaluation | 🟠 HIGH | 3 |
| Services H1 not keyword-optimised | 🟡 MEDIUM | 2 |
| Portfolio locations outside NCR — maintain design study framing | 🟡 MEDIUM | 3 |
| No visible breadcrumbs | 🟡 MEDIUM | 3 |
| No cross-links journal ↔ services (at component level) | 🟡 MEDIUM | 3 |
| No reviews / aggregateRating — blocked on verified project evidence | ⚠️ BLOCKED | Owner action required |
| No map embed on local/contact pages | 🟡 MEDIUM | 5 |
| OurStory / DesignCultures no location keywords | 🟡 MEDIUM | 3 |
| No AVIF / image optimisation pipeline gap | 🟢 LOW | 7 |
| Search volume data unverified — no first-party source | 🟡 MEDIUM | Requires GSC access |
| PR #106 merge status and content delivery unconfirmed | 🟡 MEDIUM | Requires GitHub/git check |

---

*Prepared by Claude Sonnet 4.6 — NestArcadia SEO Baseline Audit, Phase 0*  
*Revised: R1 — 17 Nov 2026 (corrections per PR #109 review)*  
*Branch: seo/phase-0-audit | November 2026*  
*Next step: Review this revised audit. Phase 1 is prerender validation — not activation.*
