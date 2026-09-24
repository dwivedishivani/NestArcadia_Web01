IMPORTANT — SEO/TECHNICAL CLEANUP ONLY. DO NOT REDESIGN OR REFACTOR THE WEBSITE.

You are working on the existing NestArcadia website.

The current website is already working correctly:
- Visual design is approved.
- Layout is approved.
- Branding is approved.
- Content and storytelling direction are approved.
- Navigation is approved.
- Supabase database is working.
- Start Your Project form is working successfully.
- Existing routes and functionality are working.
- The current Figma Make version is the source of truth.

YOUR JOB IS ONLY TO MAKE THE SPECIFIC SEO/TECHNICAL CLEANUPS LISTED BELOW.

DO NOT make any other technical, architectural, visual, UX, database, authentication, API, or functionality changes.

DO NOT rewrite existing content.
DO NOT change the website's design.
DO NOT change colors, typography, spacing, imagery, animations, sections, components, navigation, or page structure.
DO NOT change the Supabase integration.
DO NOT change the enquiry form logic.
DO NOT change RLS, database tables, policies, Edge Functions, authentication, or API calls.
DO NOT replace the existing frontend architecture.
DO NOT migrate the project to another framework.
DO NOT introduce SSR, Next.js, a new router, or a new build system in this task.
DO NOT change the existing Figma Make workflow.
DO NOT create new SEO landing pages for 2 BHK, 3 BHK, Noida, Greater Noida, etc.
DO NOT add keyword-stuffed content.
DO NOT add hidden text or hidden keywords.
DO NOT modify the brand/content strategy.

Before making changes, inspect the existing code and understand the current implementation.

==================================================
TASK 1 — REMOVE THE OBSOLETE META KEYWORDS TAG
==================================================

In the SEO metadata implementation, remove the dynamically generated:

<meta name="keywords" ...>

tag.

Do not replace it with another keyword meta tag.

Do not remove or alter the actual visible keyword/content strategy on the website.

Keep:
- title
- meta description
- canonical
- robots
- Open Graph
- Twitter metadata
- existing author/geo metadata if currently used

Only remove the obsolete meta keywords tag.

==================================================
TASK 2 — FIX FAQ STRUCTURED DATA
==================================================

The current SEO manager generates FAQPage structured data for the homepage and FAQ page.

Fix this so FAQ structured data contains ONLY FAQ questions and answers that are actually visible on the corresponding page.

IMPORTANT:
- Do not invent FAQs.
- Do not add hidden FAQs.
- Do not change the visible FAQ content.
- Do not remove useful FAQ content.
- Do not rewrite the FAQ copy.

If the homepage displays a subset of FAQs, the homepage FAQ schema must contain only that subset.

If the dedicated FAQ page contains the full FAQ set, its schema may contain the FAQs actually visible on that page.

Keep valid JSON-LD syntax.

Do not add FAQ schema to unrelated pages.

==================================================
TASK 3 — ADD BREADCRUMB STRUCTURED DATA WHERE APPROPRIATE
==================================================

Add BreadcrumbList JSON-LD only to pages where a meaningful breadcrumb hierarchy exists.

At minimum, this should be appropriate for Journal article pages.

Example:

Home → Journal → Article

The structured data must accurately represent the actual page hierarchy.

Do not create visible breadcrumbs if the existing design does not have them.

This task is ONLY structured data.

Do not redesign navigation.

Do not add visual UI.

Do not add fake breadcrumb levels.

==================================================
TASK 4 — IMPROVE JOURNAL ARTICLE STRUCTURED DATA
==================================================

Keep the existing BlogPosting/Article structured data architecture.

Improve it using information already available in the existing article data.

Where the data already exists, include:
- headline
- description
- image
- author
- publisher
- mainEntityOfPage
- articleSection/category
- datePublished
- dateModified

IMPORTANT:
Never invent publication dates.
Never invent authors.
Never invent modification dates.

If a field does not exist in the current data, leave it out rather than creating fake information.

Keep the existing Journal content exactly as it is.

==================================================
TASK 5 — IMPROVE THE ORGANIZATION / BUSINESS SCHEMA
==================================================

Review the existing NestArcadia ProfessionalService/Organization structured data.

Keep the existing verified information.

Improve the schema only using information that is already present in the website/code and is factually accurate.

Keep:
- NestArcadia name
- official website
- logo
- description
- existing service types
- existing service areas
- existing social profiles

Do NOT invent:
- address
- phone number
- opening hours
- ratings
- reviews
- price ranges
- awards
- registration numbers
- business identifiers

Do not create fake LocalBusiness information.

If ProfessionalService is already appropriate, keep it.

==================================================
TASK 6 — JOURNAL ARTICLE CANONICAL + METADATA SAFETY
==================================================

Verify that every Journal article URL gets:

- unique document.title
- unique meta description
- canonical URL corresponding exactly to the current article URL
- Open Graph title
- Open Graph description
- Open Graph URL
- Open Graph image
- Twitter title
- Twitter description
- Twitter image
- robots: index, follow

Do not change the existing URL structure.

Do not rename article slugs.

Do not create redirects.

Do not create duplicate URLs.

Trailing-slash normalization must remain consistent with the current implementation.

==================================================
TASK 7 — REVIEW INTERNAL LINKING WITHOUT REDESIGNING CONTENT
==================================================

Review the existing Journal, Design Cultures, Homes, Services and related content.

Where there are already obvious and natural relationships, add or improve internal links using EXISTING pages only.

Examples of valid relationships:

Journal article
→ related Design Culture page

Design Culture
→ related Journal article

Journal article
→ relevant Home/project

Relevant content
→ existing Services page

Relevant content
→ Start Your Project

IMPORTANT:
- Do not create new pages.
- Do not create keyword-stuffed anchor text.
- Do not add links just for SEO.
- Do not add repetitive links to every paragraph.
- Do not alter the visual design unnecessarily.

Only add links where they are genuinely useful to the user.

==================================================
TASK 8 — HOMES / PROJECT CONTENT
==================================================

DO NOT convert the existing Homes/project cards into a new routing architecture in this task.

DO NOT create new project URLs.

DO NOT change the project UI.

DO NOT convert modal/state-based project presentation into a different architecture.

This is intentionally deferred to the future hosting/refactor phase.

Only make SEO changes to existing project content if they can be done without changing functionality or routing.

==================================================
TASK 9 — SITEMAP CLEANUP
==================================================

Review the existing sitemap.

Keep all currently valid public URLs.

Do NOT remove valid pages.

Do NOT add speculative URLs.

Remove obsolete sitemap fields such as:
- priority
- changefreq

if they are currently being generated.

Where reliable page modification dates already exist in the code/data, use accurate lastmod values.

DO NOT invent dates.

The sitemap must remain:

https://nestarcadia.com/sitemap.xml

Do not change the domain.

==================================================
TASK 10 — ROBOTS.TXT
==================================================

Verify that robots.txt remains accessible and correctly points to:

https://nestarcadia.com/sitemap.xml

Do not block:
- homepage
- Journal
- Design Cultures
- Services
- Homes
- FAQ
- Our Story
- other important public pages

Do not add unnecessary disallow rules.

Do not block CSS, JavaScript, images, or other resources required for Google rendering.

==================================================
TASK 11 — DO NOT DUPLICATE ANALYTICS
==================================================

Review the existing Google Analytics / Google Tag Manager implementation.

DO NOT remove working analytics blindly.

DO NOT change the measurement IDs.

DO NOT change tracking behavior unless there is a clear duplicate implementation.

If there are multiple implementations that are genuinely causing duplicate page-view tracking, make the smallest possible change to prevent duplicate tracking.

Otherwise LEAVE ANALYTICS UNCHANGED.

Do not introduce a new analytics library.

==================================================
TASK 12 — DO NOT TOUCH THE FOLLOWING
==================================================

ABSOLUTELY DO NOT MODIFY:

1. Supabase
2. Database schema
3. Database policies
4. RLS
5. Edge Functions
6. Authentication
7. Start Your Project form submission logic
8. Enquiry validation
9. Newsletter functionality
10. API endpoints
11. Supabase keys/configuration
12. Existing routes
13. Navigation structure
14. Visual design
15. Typography
16. Colors
17. Images
18. Animations
19. Existing page copy
20. Existing FAQ copy
21. Design Cultures content
22. Journal article content
23. Homes/project content
24. Responsive layout
25. Component architecture unless absolutely required for the specific SEO fixes above

==================================================
TASK 13 — PRESERVE CURRENT FUNCTIONALITY
==================================================

After making the changes:

Verify that:

- Homepage loads.
- All navigation links work.
- Journal page loads.
- Every existing Journal article route works.
- FAQ page works.
- Design Cultures works.
- Homes works.
- Services works.
- Our Story works.
- Start Your Project works.
- Form submission still works.
- Supabase integration remains untouched.
- No console-breaking errors are introduced.
- No existing page disappears.
- No existing route changes.
- No visual redesign occurs.

==================================================
TASK 14 — SEO VALIDATION
==================================================

After implementation, inspect the resulting code and verify:

1. Every public page has a unique title.
2. Every public page has an appropriate meta description.
3. Canonicals are correct.
4. Robots directives are correct.
5. Journal articles have article structured data.
6. Breadcrumb structured data exists where appropriate.
7. FAQ structured data only represents visible FAQ content.
8. Organization/ProfessionalService schema contains only factual existing information.
9. Sitemap contains valid public URLs.
10. Robots.txt points to the sitemap.
11. No obsolete meta keywords tag remains.
12. No duplicate canonical tags are generated.
13. No duplicate structured-data scripts are created on navigation.
14. No broken routes exist.

==================================================
VERY IMPORTANT — FINAL SAFETY RULE
==================================================

THIS IS A TARGETED SEO/TECHNICAL CLEANUP.

DO NOT "IMPROVE" ANYTHING OUTSIDE THE TASK LIST.

If you discover another issue that is not explicitly covered above:

DO NOT FIX IT.

Instead, report it at the end under:

"DEFERRED ISSUES"

This is extremely important because the current website is already working and the current Figma Make version is the source of truth.

Make the smallest possible changes necessary.

Preserve the current website exactly as it looks and behaves.

Before finishing, provide a concise summary containing:

A. Changes actually made
B. Files changed
C. SEO improvements completed
D. Functionality verified
E. Deferred issues that were intentionally NOT changed

Do not make additional changes after completing this list.