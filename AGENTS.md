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
- Tests: there are currently **zero test files**; `yarn test` exits 1 with "No tests found". To run one file once added: `CI=true yarn test path/to/file.test.tsx`. `src/setupTests.ts` loads `@testing-library/jest-dom`.

## Environment variables (gotchas)

- All config is `REACT_APP_*` env vars read in `src/configuration/Config.ts`, **baked into the bundle at build time** — there is no runtime configuration.
- `.env.local` and `.env.production` are gitignored but tracked (committed before being ignored), so they exist in the repo and edits show as changes.
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

Done & verified (`npx tsc --noEmit` and `yarn build` both pass):
- Catalog `src/pages/ModelsPageComponent.tsx`: loading/error/empty states, skeleton cards (`src/components/card/SkeletonCard.tsx`), race-guard on fetch, removed console.log.
- Admin `src/pages/AdminPageComponent.tsx`: per-action feedback (Running... / OK / Failed(status)), all buttons disabled while any action runs, try/catch around service calls; added `success`/`error` theme tokens (`theme.ts` + `styled.d.ts`); `AdminButton` disabled style; removed 5 console.log from `src/services/AdminService.ts`.

Next: **not yet decided — confirm with user.** Candidates: visual pass of `/admin` (light+dark) via `yarn start`; then pick the next area (e.g. model detail page reliability, search/filter UX).
