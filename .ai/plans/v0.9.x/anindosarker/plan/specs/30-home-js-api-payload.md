# 30: Home page JavaScript and API page payload
- Epic: E10

Follow the project planning rules: docs/code-of-conduct/planning-guidelines.md, CLAUDE.md:9. Keep the expedition contract.

## 1. Architecture

### 1.1 Overview

Lab audit 2026-11-10: the home page ships 775 KB of JavaScript (transfer; 21 script files, 1.47 MB uncompressed, largest chunk 352 KB) with 1040 ms total blocking time; `/docs/api/table-options` HTML is 1.94 MB, of which 1.78 MB is markup (423 `<tr>` elements: the `ShadcnTable` prop tables server-rendered with every cell's buttons and menus) and 150 KB the RSC payload. D59: the home demo loads below-the-fold parts with `next/dynamic`; `jspdf`, `jspdf-autotable` and `recharts` stay out of the initial home bundle (today they are imported only by `examples/*/export-to-pdf/TS.tsx` and `examples/*/chart-detail-panel/TS.tsx`, which `components/dev-home/shared/live-table.tsx` already loads with `dynamic(..., { ssr: false })`; the milestone proves they are absent rather than assuming it); the API option tables render so the HTML stays under 800 KB with the visible behaviour unchanged. Measurement: `ANALYZE=1 pnpm --filter shadcn-table-docs build` (spec 24's analyzer wrap) names what fills the home chunks; Lighthouse CLI on the local production server gives TBT and script bytes. Targets (D59): home initial JavaScript under 450 KB, lab TBT under 300 ms, `/docs/api/table-options` HTML under 800 KB.

### 1.2 Goals

- Home: the sum of script transfer sizes Lighthouse records for `/` is under 450 KB; `audits.total-blocking-time.numericValue` under 300 ms (desktop preset, local production server); no chunk of the `/` first load contains `jspdf`, `jspdf-autotable` or `recharts` (D59).
- `/docs/api/table-options` HTML under 800 KB; the option names, types and descriptions are present in the HTML (a crawler reads them); after hydration the interactive prop table (search, copy, pinning) behaves as today (D59).
- Visible behaviour unchanged: the home sections render the same content in the same order; the docs-e2e home and API checks pass.
- Acceptance: programmatic. On a production build served on a P6 port (`NEXT_PUBLIC_SITE_URL` set to that origin): `npx lighthouse@12 http://localhost:<port>/ --preset=desktop --only-categories=performance --output=json --output-path=/tmp/lh-home.json --chrome-flags='--headless=new'`, then `node -e "const r=require('/tmp/lh-home.json');const s=r.audits['network-requests'].details.items.filter(i=>i.resourceType==='Script').reduce((a,i)=>a+i.transferSize,0);console.log(Math.round(s/1024)+' KB', Math.round(r.audits['total-blocking-time'].numericValue)+' ms')"` prints a KB value under 450 and an ms value under 300 (three runs, the median counts; all three recorded); `grep -lE 'jspdf|recharts' .next/static/chunks/*.js` lists no chunk that the `/` HTML references; `curl -s -o /tmp/api.html -w '%{size_download}' localhost:<port>/docs/api/table-options` prints under 819200, and `grep -c 'enableColumnFilters' /tmp/api.html` prints at least 1; `pnpm test docs-e2e --base base` green.

### 1.3 Current structure

```
apps/shadcn-table-docs/
├── app/(home)/page.tsx                            ← <HomePage /> (server)
├── components/dev-home/v12/home-page.tsx          ← Starfield, Nav, hero (Dune, AgentBar), SignalDemo, ThemeDemo, tiles, CodeStrip, Footer; CSS imports
├── components/dev-home/v12/signal-demo.tsx:8      ← dynamic(() => import('./signal-table'))  (already lazy)
├── components/dev-home/v12/theme-demo.tsx:3,18    ← dynamic import of theme-demo/variants/whole-app  (already lazy)
├── components/dev-home/shared/live-table.tsx      ← dynamic(..., { ssr: false }) per example  (already lazy)
├── components/dev-home/v4/starfield.tsx, v12/dune.tsx, v12/code-strip.tsx, shared/autoplay-tile-grid.tsx ← client parts in the first load (to measure)
├── components/prop-tables/*-table.tsx (7)         ← 'use client'; ShadcnTable over lib/prop-tables/*.ts data (74 KB tableOptions.ts); SSR renders every row
├── components/prop-tables/prop-table-source.tsx   ← server: highlighted source behind a toggle
├── components/mdx.tsx:11-26,44-52                 ← maps <TableOptionsTable /> etc. for MDX
└── content/docs/api/*.mdx                         ← <XTable /> + <XSource />
```

### 1.4 Target structure

```
apps/shadcn-table-docs/
├── components/dev-home/v12/home-page.tsx          ← below-the-fold client parts behind next/dynamic (which ones: the analyzer decides, 1.6.2)
├── components/dev-home/**                         ← the parts the analyzer names, split or deferred; no visual change
├── components/prop-tables/prop-table-shell.tsx    ← client: dynamic(() => import('./<x>-table.client'), { ssr: false, loading: StaticPropTable })
├── components/prop-tables/static-prop-table.tsx   ← server-renderable plain <table>: name, type, description per row (the HTML the crawler sees)
├── components/prop-tables/*-table.tsx (7)         ← export the shell; the ShadcnTable implementation moves to *-table.client.tsx
└── components/mdx.tsx                             ← unchanged (same export names)
CHANGELOG.md (P9)                                  ← #### Spec 30 under ## Unreleased, ### Changed
```

### 1.5 Flow: none

### 1.6 Components

#### 1.6.1 Data artifacts

- `CHANGELOG.md` (P9): `#### Spec 30 Home page JavaScript and API page payload` under `## Unreleased`, `### Changed`: the home page loads less JavaScript up front; the API option tables render a light HTML table first and hydrate into the interactive one (D59).
- The tracker records, before and after: the three Lighthouse runs (KB, ms), the `/` first-load chunk list with sizes from the analyzer, the API page HTML size.

#### 1.6.2 Home first load

`components/dev-home/**`, status `refactor`; which files change follows the measurement in Task 1 (the analyzer's `client.html` for the `/` route).

- Every client component below the hero (`SignalDemo`, `ThemeDemo`, the tiles grid, `CodeStrip`, `Footer` when it is a client component) is imported through `next/dynamic` from `home-page.tsx` with a same-height placeholder so the layout does not shift; `Starfield` and `Dune` stay in the first load only if the analyzer shows them small (under 20 KB each), else they are deferred too with their canvas mounted after first paint.
- A shared module the analyzer names as large and first-load (an icon set imported whole, a date or chart library, a base-copy of the table component) is imported by name or moved behind the dynamic boundary that uses it.
- `jspdf`, `jspdf-autotable`, `recharts`: proven absent from the `/` first load (today loaded only by example tables under `live-table.tsx`); if the analyzer shows them in the first load, the import that pulls them moves behind `dynamic(..., { ssr: false })`.
- Does NOT change what any section renders, its order, copy or styles; does NOT touch `app/layout.tsx` providers (RootProvider, PostHog, design system are shared by every page and out of this spec), does NOT edit `lib/install.ts`.

**Operations:**

| Operation | Status | Notes |
| --- | --- | --- |
| `home-page.tsx` section imports | refactor | `next/dynamic` with placeholders |
| chunk splits the analyzer names | refactor | by-name imports or dynamic boundaries |

**Stays unchanged:** `app/(home)/page.tsx` (spec 27 owns it in this epic), `app/layout.tsx`, every docs page.

#### 1.6.3 API prop tables

`components/prop-tables/**`, status `refactor`.

- `static-prop-table.tsx` (`new`): a plain `<table>` with one row per option: name (with the `*` required marker), type in `<code>`, description (the same React nodes the data file holds); no buttons, menus or icons. Rendered on the server as the `loading` fallback, so it is the HTML a crawler and the first paint get.
- `prop-table-shell.tsx` (`new`, client): `dynamic(() => import('./<x>-table.client'), { ssr: false, loading: () => <StaticPropTable rows={...} /> })`; one shell per table, or one generic shell parameterised by the import, as the builder prefers (next/dynamic wants the import written literally).
- The seven `*-table.tsx` files keep their export names (so `components/mdx.tsx` and the MDX pages are untouched) and render the shell; their current bodies move to `*-table.client.tsx`.
- `prop-table-source.tsx` keeps reading `components/prop-tables/<file>`: the `file` props point at the `.client.tsx` files so the "source" toggle still shows the table implementation.
- Does NOT change the hydrated table's columns, filters, copy buttons, pinning (`use-desktop-column-pinning.ts`) or anchors (`<name>-prop` ids stay on the static rows too, so deep links land before hydration).

**Operations:**

| Operation | Status | Notes |
| --- | --- | --- |
| `StaticPropTable` | new | server-renderable rows |
| `PropTableShell` | new | `ssr: false`, static fallback |
| `*-table.tsx` → `*-table.client.tsx` | refactor | same exports from the shell files |

**Stays unchanged:** `lib/prop-tables/*.ts`, `components/mdx.tsx`, `content/docs/api/*.mdx`, `source-toggle.tsx`, `inline-code.tsx`, `prop-link.tsx`.

### 1.7 Dependencies and env

- `@next/bundle-analyzer` (dev) and the `ANALYZE=1` wrap come from spec 24; Lighthouse runs through `npx lighthouse@12` (no dependency added); Chrome is present on the machine (claude-seo runtime).

## 2. Instructions for AI

### 2.1 Milestones

### Milestone: Home JavaScript

- Files owned: `apps/shadcn-table-docs/components/dev-home/**`
- Depends on: 24
- Review: none
- Local CI: `pnpm test typecheck --base base`, `pnpm test lint`, `pnpm test validate-repo`, `pnpm test docs-e2e --base base`
- Task 1: Measure: `ANALYZE=1 pnpm --filter shadcn-table-docs build`, the `/` first-load chunk list with sizes, three Lighthouse runs on the P6 server; record all in the tracker as the baseline. Checks: the baseline block present in the tracker
- Task 2: Defer and split (1.6.2) until the Acceptance numbers hold; record the after numbers. Checks: `pnpm --filter shadcn-table-docs types:check`; the Lighthouse and grep lines of 1.2
- Task 3: Cleanup: `pnpm format`, the changelog block (1.6.1), stop the server. Checks: 2.2

### Milestone: API page payload

- Files owned: `apps/shadcn-table-docs/components/prop-tables/**`
- Depends on: none
- Review: none
- Local CI: `pnpm test typecheck --base base`, `pnpm test lint`, `pnpm test validate-repo`, `pnpm test docs-e2e --base base`
- Task 1: `static-prop-table.tsx`, `prop-table-shell.tsx`, the seven moves to `.client.tsx` (1.6.3). Checks: `pnpm --filter shadcn-table-docs types:check`; `pnpm --filter shadcn-table-docs lint`
- Task 2: Prove the API lines of 1.2 on a production build served on a P6 port (size, the `enableColumnFilters` grep, and by browser: the hydrated table filters and copies as before, recorded as the docs-e2e API checks passing); record the before and after HTML sizes for all seven API pages; stop the server. Checks: the API lines of 1.2; `pnpm test docs-e2e --base base`
- Task 3: Cleanup: `pnpm format`, the changelog block (1.6.1). Checks: 2.2

### 2.2 Checks

- `pnpm test typecheck --base base`, `pnpm test lint`, `pnpm test validate-repo` green
- `pnpm test docs-e2e --base base` green: home and API pages behave as before
- Lighthouse medians under 450 KB and 300 ms; API HTML under 800 KB with the option text present (1.2)
- Review: none (performance refactor with programmatic proof; P7 untouched)
