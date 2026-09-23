Build a complete, production-quality **Admin Dashboard for the existing NestArcadia website**.

## IMPORTANT — FOLLOW THESE RULES

1. Do NOT redesign or modify the existing public NestArcadia website.
2. Do NOT change the existing public website's branding, typography, colors, layouts, imagery, spacing, or content.
3. The Admin Dashboard is a separate protected area of the same website.
4. Reuse the existing NestArcadia design language so the admin area feels like it belongs to the same brand.
5. Do NOT create a generic blue SaaS dashboard.
6. Do NOT add unnecessary features outside the scope below.
7. Build the UI with reusable React + TypeScript components.
8. Keep the architecture ready for Supabase integration.
9. Do NOT create fake authentication logic or hardcoded login credentials.
10. Prioritize clean UX, responsive layouts, accessibility, and maintainable code.

---

# 1. ROUTES

Create these routes:

`/login`

`/admin`

`/admin/enquiries`

`/admin/projects`

`/admin/journal`

`/admin/users`

`/admin/settings`

All `/admin/*` routes must be treated as protected routes.

---

# 2. LOGIN PAGE

Create a premium NestArcadia admin login page.

Include:

* NestArcadia logo
* Email field
* Password field
* Show/hide password
* Remember session
* Forgot password
* Login button
* Loading state
* Invalid credentials error state

The login should feel premium, minimal and architectural.

Do NOT make it look like a generic corporate login template.

---

# 3. ADMIN DASHBOARD

Create an overview dashboard containing:

### KPI section

* Total Enquiries
* New Enquiries
* Active Projects
* Completed Projects
* Pipeline Value

### Recent activity

Show:

* Recent enquiries
* Recent projects
* Recent journal activity

### Quick actions

* Add Enquiry
* Add Project
* Create Journal Article

Use realistic placeholder data only for UI demonstration.

Clearly structure the code so placeholder data can later be replaced with Supabase queries.

---

# 4. ENQUIRIES

Create a complete enquiry management interface.

Table columns:

* Client Name
* Email
* Phone
* Project Type
* Location
* Budget
* Status
* Date
* Assigned To

Statuses:

* New
* Contacted
* Qualified
* Site Visit
* Proposal
* Won
* Lost

Features:

* Search
* Status filter
* Project type filter
* Date filter
* Sorting
* Pagination
* Enquiry detail view
* Notes
* Status update
* Assign enquiry

Create:

* Empty state
* Loading state
* Error state
* Confirmation dialog

---

# 5. PROJECTS

Create a project management section.

Project fields:

* Project Name
* Client
* Location
* Property Type
* Budget
* Project Status
* Start Date
* Expected Completion
* Progress
* Assigned Designer

Statuses:

* Enquiry
* Planning
* Design
* Execution
* Completed
* On Hold

Include:

* Project list
* Search
* Filters
* Project detail page/drawer
* Add project
* Edit project
* Progress indicator

---

# 6. JOURNAL / CONTENT MANAGEMENT

Create a CMS-style Journal section.

List:

* Article title
* Author
* Status
* Published date
* Last updated

Statuses:

* Draft
* Published

Create/edit article interface with:

* Title
* Slug
* Content
* Featured image
* SEO title
* Meta description
* Category
* Tags
* Publish/unpublish
* Preview

Keep the editor clean and editorial rather than looking like a generic SaaS CMS.

---

# 7. USERS

Create an admin user management page.

Show:

* Name
* Email
* Role
* Status
* Last active

Roles:

* Admin
* Editor
* Sales

Include appropriate permission indicators.

Do not implement insecure client-side permission logic. The UI should be structured for backend role enforcement through Supabase.

---

# 8. SETTINGS

Create:

### Profile

* Name
* Email
* Profile image
* Role

### Security

* Change password
* Active session information
* Logout

### Notifications

* New enquiry notifications
* Project updates
* Journal notifications

Keep this section simple and clean.

---

# 9. NAVIGATION

Create a persistent desktop sidebar.

Sidebar:

NestArcadia logo

* Dashboard
* Enquiries
* Projects
* Journal
* Users
* Settings

Bottom of sidebar:

* Logged-in user
* Role
* Logout

Top bar:

* Current page title
* Search where appropriate
* Notifications
* User profile

Mobile:

* Collapsible sidebar
* Touch-friendly navigation
* Responsive tables
* Responsive drawers/modals

---

# 10. DESIGN DIRECTION

The existing NestArcadia brand is:

Premium interior architecture + real estate.

The admin UI should feel:

* Premium
* Architectural
* Editorial
* Sophisticated
* Contemporary Indian
* Warm
* Minimal
* Professional

It should NOT feel:

* Like a generic CRM
* Like a banking dashboard
* Like a startup SaaS template
* Overly colorful
* Childish
* Overly rounded
* Full of gradients
* Full of unnecessary cards

Use:

* Strong typography hierarchy
* Generous whitespace
* Fine borders
* Warm neutral backgrounds
* Restrained brand colors
* Elegant tables
* Subtle shadows
* Subtle hover states
* Refined status badges
* Editorial spacing

The design should communicate:

**NestArcadia — architecture, interiors and real estate handled with precision.**

---

# 11. COMPONENT SYSTEM

Create reusable components for:

* Sidebar
* Header
* Buttons
* Inputs
* Selects
* Search
* Filters
* Tables
* Status badges
* KPI cards
* Modal
* Drawer
* Tabs
* Toast
* Pagination
* Empty states
* Loading skeletons
* Confirmation dialogs

Avoid duplicating components between pages.

---

# 12. SUPABASE READINESS

The project will connect to an existing Supabase backend.

Supabase will handle:

* Authentication
* Sessions
* User profiles
* Roles
* Database
* Row Level Security

Existing profile roles:

`admin`

`editor`

`sales`

Prepare the frontend architecture so Supabase can be connected without restructuring the entire application.

Do NOT expose service-role keys.

Do NOT hardcode passwords.

Do NOT create fake authentication.

Do NOT assume frontend route protection is sufficient for database security.

---

# 13. IMPORTANT DATA ARCHITECTURE

Keep data access separate from UI components.

Use a structure similar to:

`src/lib/`

for Supabase/auth utilities.

`src/services/`

for database/API operations.

`src/components/`

for reusable UI components.

`src/pages/admin/`

for admin pages.

Keep the code modular so individual Supabase queries can later be added without rewriting the UI.

---

# 14. RESPONSIVENESS

The dashboard must work properly on:

* Desktop
* Laptop
* Tablet
* Mobile

Do not simply shrink the desktop UI.

Tables should intelligently become:

* horizontally scrollable
* stacked cards
* or responsive detail views

depending on the content.

---

# 15. STATES

Every important data-driven page should have:

* Loading state
* Empty state
* Error state
* Success state
* Confirmation state

Design these states properly instead of leaving blank screens.

---

# 16. FINAL REQUIREMENT

Build the complete Admin Dashboard UI now.

First prioritize:

1. Information architecture
2. Visual hierarchy
3. Navigation
4. Responsive design
5. Reusable components
6. Clean React + TypeScript structure
7. Supabase integration readiness

Do NOT spend credits on unnecessary animations, decorative effects, or unrelated features.

Do NOT modify the public NestArcadia website.

The final result should look like a **premium internal operating system for NestArcadia**, not a generic admin template.
