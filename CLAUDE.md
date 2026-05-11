# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server (Vite HMR)
npm run build      # Type-check + production build (output: dist/)
npm run lint       # ESLint
npm run preview    # Preview production build locally
```

After `npm run build`, open `stats.html` in browser for bundle analysis (rollup-plugin-visualizer).

### Python utility (missionary stories)
```bash
python src/utils/python/extract_stories.py
# Output: public/json/stories-YYYY.json + public/json/stories-index.json
```

## Architecture

This is a Bulgarian Seventh-day Adventist church network website (sdabg.net) — a React 18 + TypeScript SPA built with Vite.

### Data layer — Sanity CMS
All dynamic content comes from two Sanity projects queried via GROQ in `src/utils/FetchHelper.ts`:
- `client` — main site content (sdabgnet.sanity.studio): playlists, pages meta, ads, poetry, links
- `clientVreses` — daily verses project (daily-verses.sanity.studio): verses, questions, advertisements, poetry

Both clients are configured in `src/sanityClient.ts`. In dev, read tokens are required via `.env`:
- `VITE_SANITY_SDABGNET_PROJECT_ID`
- `VITE_SANITY_VERSES_PROJECT_ID`
- `VITE_SANITY_DATASET`
- `VITE_SANITY_SDABGNET_DEV_TOKEN`
- `VITE_SANITY_VERSES_DEV_TOKEN`
- `VITE_SANITY_SDABGNET_EDIT_TOKEN` (write operations only, via `src/utils/Sanity/constants.ts`)

### Dev proxy (vite.config.ts)
Three proxies avoid CORS in development:
- `/sdabg` → `https://sdasofia.org` (resource files: audio, presentations, images)
- `/rss` → `https://api.sdabg.net`
- `/api` → `https://api.sdabg.net` (path prefix stripped)

### State management — Context + Providers
All global state uses React Context. Each domain has a matching pair:
- `src/contexts/XyzContext.ts` — context type definition
- `src/providers/XyzProvider.tsx` — provider with state + fetch logic
- `src/hooks/useXyz.ts` — consumer hook

Providers are stacked in `src/App.tsx`. Data is fetched lazily (on first use in provider mount).

### Routing (`src/Router.tsx` + `src/routes.tsx`)
All routes are lazy-loaded. Route paths are defined as typed functions in `src/routes.tsx` (e.g. `routes.churchLife('events')`). The main layout wraps all routes via `<Layout />`.

Lesson routes support three types: adult (default), `cq` (for youth), `cc` (for teenagers). Pattern: `/church_life/lesson/:year/:quarter/:week`.

### Component structure
- `src/alps/` — ALPS design system components (atoms → molecules → organisms), mirrors the Adventist ALPS design system hierarchy
- `src/components/` — feature-specific components (media player, carousel, events, etc.)
- `src/pages/` — page-level components, each matching a route
- `src/layout/` — `Layout.tsx`, `Header.tsx`, `Footer.tsx`

### Styling
SCSS modules alongside components. Global ALPS font overrides in `src/Alps-font-overwrite.scss`. The audio player (`react-jinke-music-player`) uses Less variables configured in `vite.config.ts` css.preprocessorOptions.

### PWA
Custom service worker at `src/sw.js`, built with `vite-plugin-pwa` using `injectManifest` strategy. SW is disabled in dev.

### Path aliases
`tsconfig.json` paths + `vite-tsconfig-paths` plugin. Use `src/...` as import prefix (e.g. `import { client } from 'src/sanityClient'`).

### Sanity admin scripts
`src/utils/Sanity/` contains one-off TypeScript scripts for data migration/cleanup (not part of the app bundle).
