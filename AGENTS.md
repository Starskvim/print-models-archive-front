# AGENTS.md

## Stack (non-obvious parts)

- Create React App (`react-scripts` 5), TypeScript strict, React 17, react-router v6. Routes are defined in `src/App.tsx`.
- Styling is dual: styled-components (theme from `src/contexts/ThemeContext.tsx`) **and** Bootstrap 5 / react-bootstrap imported globally. Both are used; follow the file you're editing.
- Data layer: thin axios wrapper (`src/services/ApiService.ts` + per-domain services). State via React context (`src/state/AppContext.tsx`). No Redux, no codegen, no migrations.

## Commands

- Package manager is **Yarn 4** (`packageManager` field, `nodeLinker: node-modules`). Use `yarn`, not npm — the tracked `package-lock.json` is a leftover; Docker (via corepack) and README both use yarn.
- `yarn start` — dev server on :3000 (loads `.env.local` via dotenv-cli).
- There are **no lint or typecheck scripts**:
  - Typecheck: `npx tsc --noEmit`
  - ESLint (`react-app` preset) only runs inside `start`/`build`.
- Tests: `yarn test` runs all suites (currently 14 tests: 5 in `src/pages/ModelPageComponent.test.tsx`, 7 in `src/components/SearchBox.test.tsx`, 2 in `src/components/logo/LogoComponent.test.tsx`). jsdom has no `AnimationEvent`: `fireEvent.animationEnd(el, {animationName})` loses the name, so dispatch `Object.assign(new Event('animationend', {bubbles: true}), {animationName})` instead. To run one file: `CI=true yarn test path/to/file.test.tsx`. `src/setupTests.ts` loads `@testing-library/jest-dom`.

## Environment variables (gotchas)

- All config is `REACT_APP_*` env vars read in `src/configuration/Config.ts`, **baked into the bundle at build time** — there is no runtime configuration.
- `.env.local` and `.env.production` are gitignored but tracked (committed before being ignored), so they exist in the repo and edits show as changes. `.env.mock` (localhost:3001 mock URLs, no secrets) is tracked normally.
- `build/` is gitignored (CRA output; static assets live in `public/`).
- `yarn start` → dotenv-cli loads `.env.local`; `yarn start:p` → dotenv-cli loads `.env.production` (still a dev server, not static files).
- Gotcha: plain `yarn build` uses CRA's native env loading where **`.env.local` shadows `.env.production`** — the production bundle gets the dev API host. Verified by inspecting `build/`.

## Docker / deployment

- Multi-stage `Dockerfile`: `node:20-alpine` + `corepack enable` (Yarn 4 from `packageManager`; `.yarnrc.yml` must be copied before `yarn install --immutable`, otherwise Yarn picks PnP) → `nginx:alpine` serving `build/` on **port 80** with SPA fallback (`try_files $uri /index.html`). Run: `docker run -p 3000:80 <image>`.
- Env profile is chosen at **image build time**: `ARG ENV_FILE=.env.production`, built via `yarn dotenv -e $ENV_FILE react-scripts build` (bypasses the `.env.local`-shadowing gotcha above). Other profile: `docker build --build-arg ENV_FILE=.env.local .`. One image per environment; to change API URLs, edit the env file and rebuild.
- `.dockerignore` excludes host `node_modules`/`build`/`.git` (without it `COPY . .` overwrote the container's Linux `node_modules`).
- Verified (Docker 29.2.1): build passes; baked API host matches the chosen env file; `/`, `/models/123`, `/admin` → 200; image ~98 MB.

## Code conventions

- Use **relative imports only**. The tsconfig `"paths": {"*": ["src/*"]}` alias is not honored by CRA's webpack — code compiles with tsc but fails to bundle.
- Adding a theme color requires editing **three** places: `lightTheme` and `darkTheme` in `src/styles/theme.ts`, plus the `DefaultTheme` declaration in `src/styles/styled.d.ts` (tsc errors on the missing key otherwise).
- TS 4.1 + `@types/styled-components` gotcha: a styled component used **with children** fails tsc (`Property 'children' does not exist`) when it has an explicit props generic that omits `children`, or when it's rendered inside a closure (e.g. `.map()`) under another styled ancestor. Workaround (already the codebase convention, see `PageButtonStyled`): include `children?: React.ReactNode` in the props generic — e.g. `styled.div<{ $ok?: boolean; children?: React.ReactNode }>`. Broader than it looks: even a plain `styled.button` nested in JSX fails on DOM props (`type`, `onClick`, `aria-*`, `value`, `onChange`), so list **every** prop you pass in the generic (see `ThemeToggleButton`, `NSFWFilterComponent`). `ref` can't be typed this way — put it on a plain inner element (see `SearchBox`'s `.search-root`).

## Active work (refresh each session)

Direction chosen by user: improve frontend **UX & reliability**. Scope so far: catalog + admin panel.

**Desktop only — mobile layout is out of scope (user decision, 2026-09-29).** Don't report, fix or screenshot mobile-width issues; verify at desktop viewport (1366×900).

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
- `verify-mock.js` "app page returns HTML" used `/<doctype/i` (missing `!`) → always failed and killed the stack. Fixed to `/<!doctype/i` (2026-09-29).
- Visual checks without a Chrome extension: Playwright installed in the session scratchpad (`npm i playwright` + `npx playwright install chromium`), headless screenshots via `localStorage.setItem("theme-mode", "light"|"dark")` in `addInitScript`; Claude reads the PNGs with Read.

Repo state (2026-09-27): all of the above is committed and pushed; working tree clean. Git remote is named `master` and the only branch is `master` (no `main`) — push with `git push master master`. Open question for the user: `.yarnrc.yml` has `approvedGitRepositories: "**"` and `npmMinimalAgeGate: 0` (relaxed supply-chain checks), committed as-is.

Visual-pass fixes (2026-09-29, desktop, light+dark; verified by tsc, 5 tests, `yarn build`, Playwright screenshots). Not yet committed:
- Category sidebar (`src/components/filter/FilterSectionComponent.tsx`): full names (the 6-char `truncateString` is gone), ellipsis via CSS, count in its own column. The sidebar is `position: sticky` and the list scrolls inside it (checked with 60 injected categories via Playwright `page.route`).
- Sticky needs `overflow-x: clip` (not `hidden`) on `html`/`body` in `src/styles/GlobalStyle.ts`: `hidden` on both turns `body` into a scroll container, and sticky silently stops working.
- Sticky footer: `#root` is a flex column with `min-height: 100vh`, and the `Footer` wrapper has `margin-top: auto`. It replaces the old `height: 100vh` hack on the admin page.
- Admin page: 30px top padding, empty wrapper removed.
- Stray `;` removed from JSX in `PrintModelComponent.tsx`.
- `react-helmet` removed (strict-mode `UNSAFE_componentWillMount` warning). The model page sets `document.title` in a `useEffect` and restores the previous title on unmount.
- Remaining console noise: only the expected 404 on `/models/NOPE`.

Header redesign (2026-09-29, desktop, light+dark; verified by tsc, 12 tests, `yarn build`, Playwright):
- `HeaderComponent.tsx`: grid `minmax(32rem, 1fr) minmax(0, 640px) minmax(32rem, 1fr)`. Equal side columns keep the toolbar (search + rating + NSFW) exactly centered; checked at 1024/1280/1366/1920. `.navbar-lists` needs `padding: 0`, otherwise Bootstrap's `ul` padding widens the right column and shifts the centering. The active nav link is underlined.
- Filters share `filterControlCss` (`src/components/filter/FilterControl.ts`): 44px high, 8px radius, `.active` class = filled with `btn` color. Rating is a native `<select>` ("Any rating", "★ N+"; backend treats `rate` as `>=`), replacing the react-bootstrap dropdown. NSFW is a toggle button with `aria-pressed`.
- `SearchBox.tsx` (prop renamed `onKeyDown` → `onSearch`): `type="search"`, search icon, clear (×) button that resets the search. Suggestions span the full input width. Debounce is created once (`useMemo`) and cancelled on unmount; `latestQuery` ref drops stale responses. Suggestions close on Enter, Escape, outside click and suggestion click. Previously a new debounce was created on every render, and old responses could overwrite newer ones or reopen the list after the input was cleared.

Animated background (2026-09-29, "build plate" style chosen by user): `src/components/AnimatedBackground.tsx`, rendered in `App.tsx` after `GlobalStyle`. It is a `position: fixed; z-index: -1` layer: a faint 48px grid drifting diagonally (radial mask fades the edges) plus 3 radial-gradient glows on 38–60s alternate loops. Only `transform`/`opacity` are animated and there is no `filter: blur`, to keep it cheap. `prefers-reduced-motion` turns the animation off. Theme tokens: `bg_grid`, `bg_glow_1`, `bg_glow_2`. Anything painted with `theme.colors.bg` shows up as a patch on top of it, so the category buttons are now `transparent`.

Header logo (2026-09-29, "print layer by layer" style chosen by user): `src/components/logo/LogoComponent.tsx` replaces the old, unused pixel-Pikachu component and sits in `.header-left`. It is a "PRINT MODEL" wordmark with layer lines (striped gradient clipped to the text) revealed bottom-up via `clip-path` in 12 `steps()`. A nozzle (inline SVG, glowing tip, hot orange layer line) rides the print edge with the same step timing and sweeps left and right, then parks and fades; "ARCHIVE" letters are spread across the wordmark width. Hover reprints by bumping a React `key`, and only after the `logo-nozzle-park` animation ends. Under `prefers-reduced-motion` the logo is static and the nozzle is hidden.

Next: **pending user pick.** Known leftovers: empty bands above/below the card image in the catalog; pre-existing ESLint warnings (unused imports in `App.tsx`/`Footer.tsx`/`HeaderComponent.tsx`, exhaustive-deps).
- Mock setup for visual checks without the backend (verified working): `node scripts/mock-api.js` (localhost:3001, 24 sample models, picsum placeholder images, admin actions return 200) + `yarn start:mock` (env from `.env.mock`; `REACT_APP_IMG_S3_URL=` is empty so mock `preview`s are full URLs).
- Running verify: `node scripts/verify-mock.js --keep-running` (keeps mock on 3001 + dev on 3000 alive; supervisor PID logged, stop with `taskkill /F /PID <pid> /T`). **Needs 3000/3001 free** — stop any running stack first (it spawns its own mock on 3001).
