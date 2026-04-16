# CODEX.md

## Project Overview

This repository is a small Next.js App Router application for an interactive Korean drinking-table scene. The current app is implemented as a single client-heavy page with animated SVG bottle/glass visuals, drink switching, pour/drink/toast interactions, and randomized ambience events.

Core stack:

- Next.js `16.2.3`
- React `19.2.4`
- TypeScript `5`
- Tailwind CSS `4` via `@tailwindcss/postcss`
- Framer Motion `12.38.0`

## Important Next.js Rule

This project uses a newer Next.js version with APIs and conventions that may differ from older knowledge. Before changing Next.js routing, rendering, metadata, CSS, image/font behavior, or config, read the relevant local docs under:

```text
node_modules/next/dist/docs/
```

Useful starting points for this codebase:

- `node_modules/next/dist/docs/index.md`
- `node_modules/next/dist/docs/01-app/01-getting-started/02-project-structure.md`
- `node_modules/next/dist/docs/01-app/01-getting-started/03-layouts-and-pages.md`
- `node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md`
- `node_modules/next/dist/docs/01-app/01-getting-started/11-css.md`

The local docs note that App Router pages/layouts are Server Components by default, and client interactivity requires a `"use client"` boundary. In this app, `app/page.tsx` is intentionally a Client Component because it uses React state, effects, event handlers, and Framer Motion.

## Repository Map

- `app/page.tsx`: Main interactive scene. Contains `MainScreen`, visual components, local scene constants, interaction handlers, animation state, and the default exported app page.
- `app/data.ts`: Typed drink/ambience/random-event data used by `app/page.tsx`.
- `app/layout.tsx`: Root layout, font setup, global CSS import, and metadata.
- `app/globals.css`: Tailwind import and global body/font smoothing styles.
- `public/`: Default create-next-app SVG assets. They are not currently central to the drinking scene UI.
- `next.config.ts`: Minimal Next.js config.
- `eslint.config.mjs`: ESLint 9 flat config with `eslint-config-next/core-web-vitals` and TypeScript rules.
- `tsconfig.json`: Strict TypeScript config with `@/*` path alias to the project root.
- `package.json`: Scripts and dependency versions.

## Commands

Use npm, because this repo has `package-lock.json`.

```bash
npm run dev
npm run build
npm run start
npm run lint
```

Recommended verification after code edits:

```bash
npm run lint
npm run build
```

## Current Architecture Notes

- The app has only one public route: `/`, defined by `app/page.tsx`.
- There is no `src/` directory. Source files are colocated directly under `app/`, which is allowed by App Router.
- `app/page.tsx` is large and mixes UI, SVG drawing, state transitions, and scene data. For larger changes, prefer extracting stable parts into local components or helper files rather than growing the file further.
- `DRINK_SCENES` in `app/page.tsx` contains display-specific scene copy and styling. Drink model data lives in `app/data.ts`.
- The app uses inline SVG for the main visual assets. Keep this pattern unless introducing real bitmap/media assets is part of the requested change.
- Most styling is Tailwind utility classes. Global CSS should stay limited to truly global resets/theme values.

## Code Quality Guidelines

- Keep client-only code behind a `"use client"` boundary. Avoid moving hooks or browser-dependent logic into Server Components.
- If adding non-interactive routes or static content, leave those as Server Components by default.
- If adding nested routes, follow App Router file conventions: folders define URL segments and `page.tsx` makes a route public.
- If adding shared non-route code inside `app/`, consider a private folder such as `app/_components` or `app/_lib` to avoid confusion with routing conventions.
- Use typed unions from `app/data.ts` when adding drink IDs, states, or ambience IDs.
- Keep Framer Motion animations scoped to interactive components to avoid unnecessary client bundle growth.
- Prefer small extracted components for repeated controls or visual pieces.
- Preserve Korean UI copy carefully. Verify file encoding before editing Korean strings.

## Known Issues / Risks

- Some Korean strings in `app/data.ts` and metadata strings in `app/layout.tsx` appear mojibake/encoding-corrupted. Do not make broad copy changes without checking the intended Korean text in the running UI or from the user.
- `app/page.tsx` duplicates some scene/drink concepts with `app/data.ts`. If expanding content, decide whether the new field is presentation-specific (`DRINK_SCENES`) or model data (`DRINKS`) and keep it in one place.
- `DrinkState` includes `lifted`, but the current UI does not appear to use that state.
- The root layout currently sets `lang="en"` even though the app copy is Korean. Consider `lang="ko"` when fixing metadata/copy.

## Testing Notes

There are no dedicated unit or E2E tests in the repo. For visual/interaction changes, manually verify:

- Initial page renders at `/`.
- Auto-refill starts when the glass is empty.
- Drink switching resets the glass and updates scene styling.
- Shot, sip, and toast buttons respect disabled states.
- Mobile-width layout does not overlap the bottle, glass, controls, or status text.
