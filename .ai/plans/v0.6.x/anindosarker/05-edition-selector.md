# 05: edition selector

## 1. Architecture

### 1.1 Overview

Decision 7: Base UI is what a reader sees first in the docs and in Storybook, the Storybook edition tool shows which edition is current, and nothing in the repo carries an unnamed default edition. Independent of parts 03 and 04.

### 1.2 Goals

- A first visit to `www.shadcn-table.com/docs/*` shows the Base UI tab; a first visit to `storybook.shadcn-table.com/` lands on `/base/`
- `storybook.shadcn-table.com/radix/`, `/base/`, `/aria/` all serve; `/?path=/story/x` redirects to `/base/?path=/story/x`
- The current edition's toolbar button is visibly selected in light and dark mode
- Every item in the committed `registry.json` is named `<name>-<edition>`; the hosted `/r/<edition>/` output is byte-identical to today's

### 1.3 Current structure

```
packages/shadcn-table/
├── scripts/registry/editions.mjs       ← editionItemName: plain name for REFERENCE_EDITION
├── scripts/registry/lib.mjs            ← editionExampleItems strips the suffix outside the reference
├── scripts/registry/build.mjs          ← catalog name from the reference edition
├── scripts/check-storybook.mjs         ← root: reference at `/`, others at `/<edition>/`
├── scripts/preview.mjs                 ← ports 6006 + EDITIONS index
├── .storybook/themes.ts                ← staticEditionRoot: `./` or `../`, reference at the root
├── .storybook/edition-tool.ts          ← IconButton active: true for the current edition
├── package.json                        ← storybook:build to storybook-static/, :base and :aria to subfolders
apps/shadcn-table-docs/
├── lib/install.ts                      ← defaultBase = 'radix'
├── lib/base-tabs.mjs                   ← TAB_VALUES in EDITIONS order
├── components/base-selector.tsx        ← falls back to defaultBase
├── components/mdx/storybook-link.tsx   ← radix at the root
├── lib/example-prompt.ts               ← editionItemName for the item name in the agent prompt
vercel.json                             ← storybook service build command, host rewrite
.github/workflows/pr.yml                ← dry-run adds by committed name
scripts/release/smoke.mjs               ← storybook root check
```

### 1.4 Target structure

```
packages/shadcn-table/
├── scripts/registry/editions.mjs       ← DEFAULT_EDITION = 'base' (what a reader sees first); editionItemName = `${name}-${edition}` for every edition; REFERENCE_EDITION stays 'radix' (diff baseline only)
├── scripts/registry/lib.mjs            ← editionExampleItems strips the suffix for every edition
├── scripts/check-storybook.mjs         ← root `/<edition>/` for all three, plus the redirect check
├── .storybook/themes.ts                ← staticEditionRoot: `../<edition>/` for every edition
├── .storybook/edition-tool.ts          ← selected state on the current button (manager theme colours), links unchanged
├── package.json                        ← storybook:build -o storybook-static/radix
├── storybook-static/                   ← (build output) radix/ base/ aria/, no root index
apps/shadcn-table-docs/
├── lib/install.ts                      ← defaultBase = DEFAULT_EDITION
├── components/mdx/storybook-link.tsx   ← radix: /radix/
vercel.json                             ← redirect `/` to `/base/` on the storybook host, query kept
.github/workflows/pr.yml                ← dry-run adds use shadcn-table-radix, example-basic-radix
scripts/release/smoke.mjs               ← /radix/, /base/, /aria/ 200; `/` 308 to /base/
```

### 1.5 Flow: none

### 1.6 Components

#### 1.6.1 Data artifacts

- `registry.json`: radix items renamed `shadcn-table-radix`, `shadcn-table-radix-locale-<code>`, `example-<slug>-radix`; the catalog `name` and `homepage` stay. `pnpm registry:build`, then `pnpm registry:hosted` (or the script that writes `apps/shadcn-table-docs/public/r/`) and `git diff --stat apps/shadcn-table-docs/public/r` must be empty.
- `vercel.json`: `redirects` entry `{ source: "/", has: [host storybook.], destination: "/base/", permanent: false }`; the storybook service `buildCommand` builds all three into subfolders.
- `CHANGELOG.md` `## Unreleased`, `### Changed`: Base UI is the edition shown first in the docs and Storybook; Storybook editions live under `/radix/`, `/base/`, `/aria/`, the root redirects to `/base/`.
- `docs/code-of-conduct/coding-standards.md` Editions: one line on `DEFAULT_EDITION` versus `REFERENCE_EDITION`, and the committed item naming.

#### 1.6.2 `editions.mjs`

- `DEFAULT_EDITION = 'base'`: the edition a reader sees before choosing. Consumed by the docs (`defaultBase`), the Storybook root redirect value in `vercel.json` is written by hand to match (a comment names the constant).
- `REFERENCE_EDITION = 'radix'` unchanged: `check-bases.mjs` baseline, `example-map.mjs` source folder, `examples.mjs` slug discovery. The header comment says which constant means what.
- `editionItemName(name, edition)` returns `${name}-${edition}` for every edition; `editions.d.mts` follows.
- Does NOT reorder `EDITIONS` (the dev ports 6006, 6007, 6008 and `preview.mjs` depend on the order).

#### 1.6.3 Storybook layout

- `package.json`: `storybook:build` writes `storybook-static/radix`; `:base` and `:aria` unchanged. `vercel.json` `buildCommand` unchanged in effect (three builds), `outputDirectory` stays `storybook-static`.
- `themes.ts` `staticEditionRoot(target)`: every edition is a sibling folder, so the link is `../<target>/` in production and the port shift in dev (`ST_DEV` unchanged).
- `edition-tool.ts`: the current edition's `IconButton` gets a selected look that survives both manager themes: background `theme.color.secondary` with contrasting text, or a 2px bottom border in the accent, set through the `style` prop or a manager CSS rule in `manager.ts`; no extra text, no icon. The two link buttons stay plain.
- `check-storybook.mjs`: each edition's root is `${base}/${name}/`; one more check that `GET ${base}/?path=...` answers 3xx to `/base/?path=...` when run against the production URL (skipped for local static servers that cannot redirect).
- `smoke.mjs`: `${STORYBOOK}/radix/`, `/base/`, `/aria/` 200 with the edition's manager HTML; `${STORYBOOK}/` redirects to `/base/`.

#### 1.6.4 Docs default

- `lib/install.ts`: `defaultBase` reads `DEFAULT_EDITION` from `editions.mjs` (the file already imports from it elsewhere in the app; if `install.ts` cannot import `.mjs` under its tsconfig, `base-tabs.mjs` re-exports it).
- `base-selector.tsx`, `getServerSnapshot`: Base UI on the server and until the stored pick is read; the comment updated. A visitor with a stored pick keeps it.
- `storybook-link.tsx`: `radix: 'https://storybook.shadcn-table.com/radix/'`.
- `example-prompt.ts`: check whether the item name it emits is the committed or the hosted name; the prompt points users at `/r/<edition>/example-<slug>.json`, so it must be the hosted plain name. Fix if the rename changes its output.
- `pr.yml` registry job: dry-run adds by the new committed names; `install.yml` comments follow.

### 1.7 Dependencies and env: none

## 2. Instructions for AI

### 2.1 Phases

#### 2.1.1 Phase 1: names

- 1.6.2 `editionItemName`, `lib.mjs`, `registry:build`, hosted output diff empty, `pr.yml` names

#### 2.1.2 Phase 2: Storybook

- 1.6.3; local check: `pnpm storybook:build && pnpm storybook:build:base && pnpm storybook:build:aria`, serve `storybook-static`, `check-storybook.mjs` green against it; the toolbar screenshot per edition in the tracker

#### 2.1.3 Phase 3: docs

- 1.6.4; `check-pages.mjs --edition base` and the other two green; a fresh browser context opens `/docs/getting-started/install` on the Base UI tab

#### 2.1.4 Final phase: docs and gates

- 1.6.1; 2.2; CI-only PR into `claude/review`

### 2.2 Gates

- `registry:build` then hosted output: `git status --short apps/shadcn-table-docs/public/r` empty
- `check:bases` green; docs `types:check`, `lint`, `build` green; `check-pages.mjs` green for all three editions
- `check-storybook.mjs` green against the local three-folder build
- `pr.yml` green; after release, `smoke.mjs` green (the redirect check is new)
