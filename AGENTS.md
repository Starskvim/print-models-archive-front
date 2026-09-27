# AGENTS.md

## Stack (non-obvious parts)

- Create React App (`react-scripts` 5), TypeScript strict, React 17, react-router v6. Routes are defined in `src/App.tsx`.
- Styling is dual: styled-components (theme from `src/contexts/ThemeContext.tsx`) **and** Bootstrap 5 / react-bootstrap imported globally. Both are used; follow the file you're editing.
- Data layer: thin axios wrapper (`src/services/ApiService.ts` + per-domain services). State via React context (`src/state/AppContext.tsx`). No Redux, no codegen, no migrations.

## Commands

- Package manager is **Yarn 4** (`packageManager` field, `nodeLinker: node-modules`). Use `yarn`, not npm — the tracked `package-lock.json` is a leftover; Docker and README both use yarn.
- `yarn start` — dev server on :3000 (loads `.env.local` via dotenv-cli).
- There are **no lint or typecheck scripts**:
  - Typecheck: `npx tsc --noEmit`
  - ESLint (`react-app` preset) only runs inside `start`/`build`.
- Tests: `yarn test` runs all suites (currently 5 tests in `src/pages/ModelPageComponent.test.tsx`). To run one file: `CI=true yarn test path/to/file.test.tsx`. `src/setupTests.ts` loads `@testing-library/jest-dom`.

## Environment variables (gotchas)

- All config is `REACT_APP_*` env vars read in `src/configuration/Config.ts`, **baked into the bundle at build time** — there is no runtime configuration.
- `.env.local` and `.env.production` are gitignored but tracked (committed before being ignored), so they exist in the repo and edits show as changes. `.env.mock` (localhost:3001 mock URLs, no secrets) is tracked normally.
- `build/` is gitignored (CRA output; static assets live in `public/`).
- `yarn start` → dotenv-cli loads `.env.local`; `yarn start:p` → dotenv-cli loads `.env.production` (still a dev server, not static files).
- Gotcha: plain `yarn build` uses CRA's native env loading where **`.env.local` shadows `.env.production`** — the production bundle gets the dev API host. Verified by inspecting `build/`.

## Docker / deployment

- The Dockerfile runs `yarn build`, but `CMD` is `yarn start:p`: the container serves webpack-dev-server on :3000, **not** `build/`. To change deployed API URLs, edit `.env.production` and rebuild the image.

## Code conventions

- Use **relative imports only**. The tsconfig `"paths": {"*": ["src/*"]}` alias is not honored by CRA's webpack — code compiles with tsc but fails to bundle.
- Adding a theme color requires editing **three** places: `lightTheme` and `darkTheme` in `src/styles/theme.ts`, plus the `DefaultTheme` declaration in `src/styles/styled.d.ts` (tsc errors on the missing key otherwise).
- TS 4.1 + `@types/styled-components` gotcha: a styled component used **with children** fails tsc (`Property 'children' does not exist`) when it has an explicit props generic that omits `children`, or when it's rendered inside a closure (e.g. `.map()`) under another styled ancestor. Workaround (already the codebase convention, see `PageButtonStyled`): include `children?: React.ReactNode` in the props generic — e.g. `styled.div<{ $ok?: boolean; children?: React.ReactNode }>`.

## Active work (refresh each session)

Direction chosen by user: improve frontend **UX & reliability**. Scope so far: catalog + admin panel.

Done & verified (`npx tsc --noEmit`, `yarn build`, and the 5 TDD tests in `src/pages/ModelPageComponent.test.tsx` all pass):
- Catalog `src/pages/ModelsPageComponent.tsx`: loading/error/empty states, skeleton cards (`src/components/card/SkeletonCard.tsx`), race-guard on fetch, removed console.log.
- Admin `src/pages/AdminPageComponent.tsx`: per-action feedback (Running... / OK / Failed(status)), all buttons disabled while any action runs, try/catch around service calls; added `success`/`error` theme tokens (`theme.ts` + `styled.d.ts`); `AdminButton` disabled style; removed 5 console.log from `src/services/AdminService.ts`.
- Header search/filter UX (`HeaderComponent.tsx` + `RateFilterComponent.tsx` + `NSFWFilterComponent.tsx` + `SearchBox.tsx`): per-keystroke refetch (no debounce), no "clear all", no "All" option in category filter, no active-filter summary.
- Model detail page `src/pages/ModelPageComponent.tsx` (TDD, 5 tests): loading skeleton slider (`data-testid="slider-skeleton"`) + `SkeletonCard` instead of the old `<p>Error</p>`; error block (message + "Try again" retry + "← Catalog" link); try/catch, race-guard on fetch (`cancelled`), retry via `retryTick`; theme-aware slider (removed hardcoded white bg/indicators, uses `theme.colors.*`); responsive width (`max-width: 600px; width: 100%`). Removed console.log from `src/services/ProductService.ts`.

Mock / verify:
- `scripts/mock-api.js`: OPTIONS preflight returned 204 **without `res.end()`** → Node HTTP clients hang (browsers fine). Fixed: added `res.end()` (OPTIONS now sends a proper 204).
- This env's Node 24.19 gotcha: `http.request` (url or host/port forms) is broken — `AggregateError ECONNREFUSED` (dual-stack) or timeout + `ECONNRESET`; `http.get` and global `fetch` work. The CORS preflight check in `scripts/verify-mock.js` therefore uses **`fetch`**, not `http.request`.
- `verify-mock.js` compile-check now accepts `Compiled with warnings` (CRA prints that, not `Compiled successfully`).
- Verified against fixed mock: GET → 200, OPTIONS → 204 (via `fetch`); all 14 endpoint checks pass.

Repo state (2026-09-27): all of the above is committed and pushed; working tree clean. Git remote is named `master` and the only branch is `master` (no `main`) — push with `git push master master`. Open question for the user: `.yarnrc.yml` has `approvedGitRepositories: "**"` and `npmMinimalAgeGate: 0` (relaxed supply-chain checks), committed as-is.

Next: **pending user pick.** Admin visual pass (light+dark) — user confirmed OK.
- Mock setup for visual checks without the backend (verified working): `node scripts/mock-api.js` (localhost:3001, 24 sample models, picsum placeholder images, admin actions return 200) + `yarn start:mock` (env from `.env.mock`; `REACT_APP_IMG_S3_URL=` is empty so mock `preview`s are full URLs).
- Running verify: `node scripts/verify-mock.js --keep-running` (keeps mock on 3001 + dev on 3000 alive; supervisor PID logged, stop with `taskkill /F /PID <pid> /T`). **Needs 3000/3001 free** — stop any running stack first (it spawns its own mock on 3001).
