# 15: Only the active style's stylesheet loads
- Epic: E5

Follow the project planning rules: docs/code-of-conduct/planning-guidelines.md, CLAUDE.md:9. Keep the expedition contract.

## 1. Architecture

### 1.1 Overview

`app/global.css:9-16` imports all eight `styles/style-*.css` layers into the root stylesheet, which grew from 351 KB to 2,755 KB with the theme panel; every theme or class change then recalculates styles over the whole page (Q15, D29). D29 makes each style its own CSS asset: a build step compiles `styles/style-<name>.css` against the docs' Tailwind theme into `public/styles/style-<name>.css`, the root layout links the default one in `<head>`, the pre-paint script swaps the link to the stored style before first paint, and a style change loads the new sheet and switches the `style-<name>` class once it has loaded. The eight source files and the `.cn-*` layers stay as they are (spec 13 relies on them).

### 1.2 Goals

- `global.css` imports none of the eight style files; each page links exactly one `/styles/style-<name>.css`, the active style's (D29).
- The stored style is linked before first paint; a style change swaps sheets without a flash of unstyled parts (D29).
- Acceptance: programmatic. `pnpm test docs-e2e --base base` green (every page) with the checks of 1.6.5 on `/`: exactly one style link, no `.style-*` rule in any other stylesheet, the sheet follows the Style select and the stored choice, panel open and light/dark toggle each under 300 ms of long tasks; red on the shipped code first (P11). The tracker records the root stylesheet bytes on `/` in `next dev` before and after, within 10 percent of the 351 KB baseline plus the one active sheet (D29). `pnpm test typecheck --base radix`, `pnpm test lint`, `pnpm test validate-repo` green; `pnpm install --frozen-lockfile` clean; `pnpm --filter shadcn-table-docs build` green.

### 1.3 Current structure

```
apps/shadcn-table-docs/
├── app/global.css:1-16                        ← @import 'tailwindcss', fumadocs, shadcn; then the eight `@import '../styles/style-<name>.css' layer(base)`
├── app/global.css:29                          ← @custom-variant dark (the variants and @theme the style files' @apply need)
├── styles/style-{luma,lyra,maia,mira,nova,rhea,sera,vega}.css ← 77 to 79 KB each, `.style-<name> { .cn-* { @apply ... } }`, 440 @apply in nova
├── app/layout.tsx:1-12                        ← imports; './global.css'; designSystemScript
├── app/layout.tsx:38-48                       ← <html className=fonts suppressHydrationWarning><body> ... <script dangerouslySetInnerHTML={designSystemScript}> (in body, no explicit <head>)
├── lib/design-system/config.ts:24-41          ← STYLES (the eight names)
├── lib/design-system/config.ts:497            ← designSystemScript: reads storage, adds `style-<name>` to <html>, sets data attributes, appends the theme style element
├── components/design-system-provider.tsx:98-120 ← applyToDocument: swaps the `style-*` class at once, attributes, theme style element
├── package.json:10-12                         ← build (registry steps, example variants, next build), predev (example variants), dev
├── postcss.config.mjs                         ← @tailwindcss/postcss only; no @tailwindcss/node or cli in the docs app
├── .gitignore:7,37-39                         ← /public/r/, /examples/.<base>/ (generated)
└── next.config.mjs                            ← no CSS or headers config
node_modules/.pnpm/@tailwindcss+node@4.3.3    ← compile, optimize (dist/index.d.ts:262); tailwindcss 4.3.3 supports @reference
test/docs-e2e/lib/getting-started.mjs:190-310 ← themeCustomizer checks on /
.ai/plans/v0.9.x/anindosarker/process.md       ← P9 generated files
```

### 1.4 Target structure

```
apps/shadcn-table-docs/
├── lib/build-styles.mjs                 ← new: compiles each styles/style-<name>.css to public/styles/style-<name>.css
├── public/styles/style-<name>.css       ← generated, git-ignored (P9)
├── app/global.css                       ← the eight imports and their comment removed
├── app/layout.tsx                       ← explicit <head>: the default style link, then the pre-paint script
├── lib/design-system/config.ts          ← designSystemScript swaps the link before first paint; STYLE_SHEET_ID, styleSheetHref()
├── components/design-system-provider.tsx ← applyToDocument loads the new sheet, switches the class on load
├── package.json                         ← @tailwindcss/node devDependency; predev and build run build-styles
└── .gitignore                           ← /public/styles/
pnpm-lock.yaml
test/docs-e2e/lib/getting-started.mjs    ← the stylesheet checks (1.6.5)
.ai/plans/v0.9.x/anindosarker/process.md ← P9 lists public/styles/
```

### 1.5 Flow

```mermaid
sequenceDiagram
  Browser->>Server: GET /
  Server-->>Browser: <head><link id=design-system-style href=/styles/style-nova.css data-style=nova><script>pre-paint</script>
  Browser->>Browser: pre-paint: stored style sera? replace the link (href style-sera.css, blocking=render)
  Browser->>Server: GET /styles/style-sera.css (render-blocking)
  User->>ThemeCustomizer: pick Luma
  ThemeCustomizer->>Provider: setConfig({ style: 'luma' })
  Provider->>Browser: append <link href=/styles/style-luma.css>; on load: html.style-luma, remove the old link
```

### 1.6 Components

#### 1.6.1 Data artifacts

- `apps/shadcn-table-docs/package.json` and `pnpm-lock.yaml`: devDependency `@tailwindcss/node ^4.3.3` (the version already in the lockfile for `packages/shadcn-table`); `"predev": "node lib/example-variants.mjs && node lib/build-styles.mjs"`; `build` runs `node lib/build-styles.mjs` before `next build`. Spec 14 adds the icon packages first and owns these files until it merges; this milestone takes them next (P6, sequential).
- `apps/shadcn-table-docs/.gitignore`: `/public/styles/` with a comment naming `lib/build-styles.mjs`, beside `/public/r/` (`:7`).
- `.ai/plans/v0.9.x/anindosarker/process.md` P9: the generated list gains `apps/shadcn-table-docs/public/styles/` (`lib/build-styles.mjs`).
- `CHANGELOG.md` (P9): `#### Spec 15 Docs: one style sheet per style, loaded on demand` under `## Unreleased` (D29).

#### 1.6.2 Style build

`lib/build-styles.mjs`, status `new`.

- For every `styles/style-<name>.css` (the directory listing, the same eight names as `STYLES`), compiles the entry `@reference "./app/global.css";\n@import "./styles/style-<name>.css" layer(base);` with `compile(css, { base: APP, onDependency() {} })` from `@tailwindcss/node`, then `build([])`: `@reference` loads the docs' theme, variants and utilities for `@apply` without emitting them, so the output is the style's rules only, wrapped in `@layer base` as today. `--minify` (used by `build`) passes the output through `optimize()`; `predev` leaves it readable.
- Writes `public/styles/style-<name>.css`; prints the byte size per file. A compile error fails the script with the style name.
- Does NOT write anything else, and does NOT read `lib/design-system/config.ts` (no TS import from a build script).

**Interfaces:**

```
node lib/build-styles.mjs [--minify]   → public/styles/style-<name>.css × 8
```

#### 1.6.3 Root CSS and layout

- `app/global.css:6-16`, status `refactor`: the eight imports and their comment are removed; a two-line comment points at `lib/build-styles.mjs` and the `<link>` in `app/layout.tsx`. Nothing else changes; the style files stay where they are.
- `app/layout.tsx`, status `refactor`: the root layout gets an explicit `<head>` holding `<link id={STYLE_SHEET_ID} rel="stylesheet" href={styleSheetHref(DEFAULT_CONFIG.style)} data-style={DEFAULT_CONFIG.style} />` followed by the pre-paint `<script>` (moved up from the body, `:47`); the search-highlight `<style>` and everything else stay in the body. The link carries no `precedence` prop, so React renders it in place.

#### 1.6.4 Pre-paint script and provider

- `lib/design-system/config.ts`, status `refactor`: `export const STYLE_SHEET_ID = 'design-system-style'`, `export const styleSheetHref = (style: StyleName) => `/styles/style-${style}.css``. `designSystemScript` (`:497`), after it has settled `style`: `var l=document.getElementById(STYLE_SHEET_ID);if(l&&l.getAttribute("data-style")!==style){var n=document.createElement("link");n.rel="stylesheet";n.id=l.id;n.href="/styles/style-"+style+".css";n.setAttribute("data-style",style);n.setAttribute("blocking","render");l.replaceWith(n)}` before `d.classList.add("style-"+style)`. `blocking="render"` keeps a script-inserted link in `<head>` render-blocking while the document loads (HTML spec, "blocking attribute"), so the stored style paints first.
- `components/design-system-provider.tsx`, `applyToDocument` (`:98-120`), status `refactor`: when the current link's `data-style` differs from `config.style`, a second link (`href` from `styleSheetHref`, `data-style`) is appended to `<head>`; on `load` the old link is removed, the new one takes `STYLE_SHEET_ID`, and only then the `style-*` class is swapped (`:100-103`); on `error` the new link is removed, the class stays, one `console.error` names the href. The attributes and the theme style element (`:106-120`) apply at once as today. Two changes in flight: the later one wins, the earlier pending link is removed on its load.
- Does NOT change storage, history, hotkeys, the menu loop or `buildThemeCss`.

#### 1.6.5 Docs E2E checks

`test/docs-e2e/lib/getting-started.mjs`, status `refactor`, in `themeCustomizer` on `/`:

- `sheet: one style link`: with empty storage after reload, `document.querySelectorAll('link[rel="stylesheet"][href*="/styles/style-"]')` has length 1 and its href ends with `style-nova.css`.
- `sheet: no style rules elsewhere`: no `document.styleSheets` entry other than that link holds a rule whose selector starts with `.style-` (the eight imports left the bundle).
- `sheet: follows the Style select`: pick Sera; within 5 s the one style link ends with `style-sera.css` and `<html>` has class `style-sera`.
- `sheet: stored style at first paint`: reload; the one style link ends with `style-sera.css` before any interaction.
- `perf: panel open` and `perf: light/dark toggle`: a `PerformanceObserver` on `longtask` registered before the click; the long tasks in the 2 s after the click sum to under 300 ms each. Load-sensitive: rerun once before red (P5), the numbers in the tracker.
- Cleanup: `Shift+R`. The checks run on the shipped code first; the first four fail there (P11).

### 1.7 Dependencies and env

- `@tailwindcss/node ^4.3.3` (docs devDependency, 1.6.1). `public/styles/` must exist before `next dev` or `next build` (the scripts of 1.6.1 make it).

## 2. Instructions for AI

### 2.1 Milestones

### Milestone: Style sheet on demand

- Files owned: `apps/shadcn-table-docs/lib/build-styles.mjs`, `apps/shadcn-table-docs/app/global.css`, `apps/shadcn-table-docs/app/layout.tsx`, `apps/shadcn-table-docs/lib/design-system/config.ts`, `apps/shadcn-table-docs/components/design-system-provider.tsx`, `apps/shadcn-table-docs/package.json`, `pnpm-lock.yaml`, `apps/shadcn-table-docs/.gitignore`, `test/docs-e2e/lib/getting-started.mjs`, `.ai/plans/v0.9.x/anindosarker/process.md`
- Depends on: Icon library select, Docs parts hooks
- Review: fable
- Local CI: `pnpm test typecheck --base radix`, `pnpm test lint`, `pnpm test validate-repo`, `pnpm --filter shadcn-table-docs build`, `pnpm test docs-e2e --base base`
- Task 1: Reproduce: write the checks of 1.6.5, run `pnpm test docs-e2e --base base /` on the shipped code, record the red lines and the root stylesheet bytes on `/` (`next dev`, `performance.getEntriesByType('resource')` CSS `decodedBodySize` sum) in the tracker (P11). Checks: the four sheet checks fail
- Task 2: Dependency and scripts: `@tailwindcss/node`, `predev`, `build`, `.gitignore`, `build-styles.mjs` (1.6.1, 1.6.2); run it and compare `grep -c '\.cn-' public/styles/style-nova.css` with the same count in the shipped bundle's nova rules. Checks: `pnpm install --frozen-lockfile` clean; eight files written; the counts match
- Task 3: Layout, script, provider, `global.css` (1.6.3, 1.6.4). Checks: `pnpm --filter shadcn-table-docs types:check`; `pnpm test docs-e2e --base base /` green
- Task 4: Every page and the build: P9 line, the bytes after in the tracker. Checks: `pnpm test docs-e2e --base base` green; `pnpm --filter shadcn-table-docs build` green
- Task 5: Cleanup: `pnpm format`, the changelog block. Checks: 2.2

### 2.2 Checks

- `pnpm test typecheck --base radix` and `pnpm test lint` green
- `pnpm test validate-repo` green
- `pnpm --filter shadcn-table-docs build` green (the style build runs inside it)
- `pnpm test docs-e2e --base base` green: every page, the theme checks, the sheet and perf checks
- Review: fable (every page's CSS load path, the pre-paint script)
