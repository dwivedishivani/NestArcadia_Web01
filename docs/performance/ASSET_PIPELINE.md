# NestArcadia performance and app assets

## Responsive image delivery

The source-of-truth manifest is `src/data/responsive-site-images.json`. Each item maps a stable Site Media `source_key` to its approved public Storage asset and the widths required by the UI.

`scripts/prepare-responsive-site-images.mjs` downloads only those allow-listed public assets and creates compressed WebP variants under `public/images/responsive/`. The generated files are build outputs; do not commit them or upload transformed copies back into the Site Media library.

The Home and Design Cultures pages use `srcSet` + `sizes` so the browser can select an appropriate width for the rendered slot and device pixel ratio. The original image remains the fallback. Images changed through the Site Media admin are not forced onto a stale generated variant: when the public URL differs from the manifest source, the resolver uses the current override and omits the generated `srcSet`.

Supabase Storage Image Transformations are not enabled for the production project. Do not replace this pipeline with `/storage/v1/render/image` URLs unless the project feature is explicitly enabled and verified first.

## Favicon and home-screen icons

`scripts/prepare-app-icons.mjs` derives icon outputs from the existing branded house mark in `src/assets/images/branding/nestarcadia-logo-transparent.png`. It creates favicon PNG/ICO files, the 180px Apple touch icon, and 192px/512px Android icons on the site's warm ivory background.

`public/site.webmanifest` is the source of truth for the app name, theme/background colours, and install icon references. The HTML shell links the favicon, Apple touch icon and manifest. Generated icon files are build outputs; do not commit them.

## Reproducing the asset build

The GitHub Actions build and Hostinger deployment workflows install the system tools and run both preparation scripts before `pnpm build`.

For a local asset build, install Node.js 22, `webp` (for `cwebp`) and ImageMagick, then run:

```bash
node scripts/prepare-responsive-site-images.mjs
node scripts/prepare-app-icons.mjs
pnpm build
```

The production smoke test verifies the mobile hero, responsive WebP candidate, favicon/Apple/Android icon URLs, web manifest, canonical SEO snapshots, and lead-event flow.

## Browser cache and history restores

Public HTML uses `Cache-Control: no-cache, must-revalidate`: browsers revalidate the static shell on ordinary requests, while the site does not apply a blanket `no-store` directive to a response that contains no visitor-specific data. User-specific form/admin/API responses must continue to set their own appropriate cache policy. The router also queues a `page_view` when a page is restored through the browser's back/forward cache.

## Ownership boundaries

- Image source metadata and target widths: `src/data/responsive-site-images.json`
- Browser URL selection and override safety: `src/utils/siteImages.ts`
- Page-level image `srcSet` and `sizes`: `src/pages/Home/Home.tsx` and `src/pages/DesignCultures/DesignCultures.tsx`
- Generated assets: `scripts/prepare-responsive-site-images.mjs` and `scripts/prepare-app-icons.mjs`
- App icon metadata and HTML links: `public/site.webmanifest` and `index.html`
- CI, build validation and deployment checks: `.github/workflows/build.yml`, `.github/workflows/deploy-hostinger.yml`, and `scripts/production-smoke.mjs`
