# NestArcadia

Static React + TypeScript + Vite website for NestArcadia, a heritage Indian interior design studio.

## Development

```bash
pnpm dev
```

## Production build

```bash
pnpm build
```

Vite writes the static production website to `dist/`. For Hostinger, upload the **contents** of `dist/` directly to `public_html/`—not the `dist` folder itself and not the source repository.

This application uses in-app page state rather than React Router, so no server rewrite rule is required for its current navigation model. The Vite base is `/`, which is correct for `https://nestarcadia.com/`.

## Source layout

- `src/assets/` — imported build-time assets
- `src/components/` — shared UI grouped by purpose
- `src/pages/` — page-level views, kept in page-specific folders
- `src/styles/` — global style entrypoints
- `public/` — optional root-served static assets
