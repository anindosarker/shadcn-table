# 04: package layout

## 1. Architecture

### 1.1 Overview

The library is kept once under `shared/` with 23 Base UI override files under `bases/base/`,
resolved base-first by TypeScript `paths` and a Vite plugin. Every edit needs knowing which
files have a twin, and the editor cannot resolve shared files. Decision:
[decisions.md](decisions.md) "Package" 1 to 3: two complete trees, the shadcn repo folder
layout, a CI guard instead of override resolution.

### 1.2 Goals

- `registry/radix` and `registry/base` each contain the whole library; no `shared/`, no
  `bases/`
- Every file of either tree resolves all `@/` imports in the editor (every file is a root
  file of its tsconfig project)
- `pnpm registry:build` produces the same items with `files[].path` under `registry/<base>/`;
  install addresses unchanged
- `pnpm check:bases` passes on the moved tree and fails on any unlisted difference
- All gates green on both bases; library files show as renames only in `git diff --stat`

### 1.3 Current structure

```
packages/shadcn-table/
├── bases/
│   ├── README.md                         ← resolution rules
│   ├── radix/
│   │   ├── components/ui/*.tsx           ← 27 shadcn parts (Radix UI)
│   │   ├── components.json  index.css  lib/utils.ts  registry.ts
│   └── base/
│       ├── components/ui/*.tsx           ← 27 shadcn parts (Base UI)
│       ├── components/ui/shadcn-table/   ← 23 override files (list in 1.6.1)
│       ├── components.json  index.css  lib/utils.ts  registry.ts
├── shared/components/ui/shadcn-table/    ← one copy of the library, 129 files
│   ├── body/ buttons/ fns/ footer/ head/ hooks/ inputs/ locales/ menus/ modals/ table/ toolbar/ utils/
│   └── icons.ts  index.ts  ShadcnTable.tsx  ST_Tooltip.tsx  types.ts
├── registry/                             ← scripts, not sources
│   ├── add-part.mjs  build.mjs  examples.mjs  hosted.mjs  lib.mjs  lib.d.mts
├── registry.json                         ← item catalog
├── scripts/check-storybook.mjs
├── stories/  .storybook/  public/r/
├── eslint.config.js                      ← no-restricted-imports for relative imports in the library
├── tsconfig.json                         ← solution file, references tsconfig.radix.json only, has baseUrl
├── tsconfig.radix.json  tsconfig.baseui.json  tsconfig.stories.json   ← paths: bases/<base> first, shared second
├── vite.config.ts                        ← st-base-fallback plugin, ROOTS = [bases/<ST_BASE>, shared]
└── vitest.config.ts
```

### 1.4 Target structure

```
packages/shadcn-table/
├── registry/
│   ├── README.md                         ← what lives where, how to change a common or base-only file
│   ├── radix/                            ← complete Radix UI library
│   │   ├── components/ui/*.tsx           ← 27 parts
│   │   ├── components/ui/shadcn-table/   ← 129 library files
│   │   ├── components.json  index.css  lib/utils.ts  registry.ts
│   └── base/                             ← complete Base UI library, same shape
│       ├── components/ui/*.tsx
│       ├── components/ui/shadcn-table/   ← 129 files, 23 of them differ
│       ├── components.json  index.css  lib/utils.ts  registry.ts
├── registry.json                         ← stays at the package root
├── scripts/
│   ├── registry/
│   │   ├── add-part.mjs  build.mjs  examples.mjs  hosted.mjs  lib.mjs  lib.d.mts
│   │   ├── check-bases.mjs               ← two-tree guard
│   │   └── base-diff.json                ← files allowed to differ
│   └── check-storybook.mjs
├── stories/  .storybook/  public/r/
├── eslint.config.js                      ← relative-import rule removed
├── tsconfig.json                         ← references radix, baseui, stories; no baseUrl
├── tsconfig.radix.json                   ← paths @/* to registry/radix/*, include registry/radix
├── tsconfig.baseui.json                  ← paths @/* to registry/base/*, include registry/base
├── tsconfig.stories.json                 ← extends radix, adds stories and .storybook
├── vite.config.ts                        ← resolve.alias @ to registry/<ST_BASE>, plugin removed
└── vitest.config.ts
```

### 1.5 Flow: none

### 1.6 Components

#### 1.6.1 Data artifacts

`scripts/registry/base-diff.json`: the files allowed to differ between the trees, relative to
`components/ui/shadcn-table/`. Today's 23, from `git ls-files bases/base/components/ui/shadcn-table`:

```json
[
  "ShadcnTable.tsx",
  "ST_Tooltip.tsx",
  "body/ST_TableDetailPanel.tsx",
  "head/ST_TableHeadCellFilterContainer.tsx",
  "head/ST_TableHeadCellFilterLabel.tsx",
  "inputs/ST_EditCellTextField.tsx",
  "inputs/ST_FilterCheckbox.tsx",
  "inputs/ST_FilterRangeSlider.tsx",
  "inputs/ST_FilterTextField.tsx",
  "inputs/ST_GlobalFilterTextField.tsx",
  "inputs/ST_SelectCheckbox.tsx",
  "menus/ST_ActionMenuItem.tsx",
  "menus/ST_CellActionMenu.tsx",
  "menus/ST_ColumnActionMenu.tsx",
  "menus/ST_FilterOptionMenu.tsx",
  "menus/ST_RowActionMenu.tsx",
  "menus/ST_ShowHideColumnsMenu.tsx",
  "menus/ST_ShowHideColumnsMenuItems.tsx",
  "modals/ST_EditRowModal.tsx",
  "toolbar/ST_LinearProgressBar.tsx",
  "toolbar/ST_TablePagination.tsx",
  "toolbar/ST_ToolbarAlertBanner.tsx",
  "utils/style.utils.ts"
]
```

`registry.json`: regenerated by `pnpm registry:build`; only `files[].path` prefixes change.

#### 1.6.2 Tree move

One commit of `git mv` with no content change, so history follows every file.

- Moves `shared/components/ui/shadcn-table/**` to `registry/radix/components/ui/shadcn-table/`
- Moves `bases/radix/{components,lib,index.css,components.json,registry.ts}` to `registry/radix/`
- Moves `bases/base/{components/ui/*.tsx,lib,index.css,components.json,registry.ts}` to
  `registry/base/`, copies the Radix library into `registry/base/components/ui/shadcn-table/`,
  then `git mv` of the 23 override files overwrites their copies
- Moves `bases/README.md` to `registry/README.md`; `registry/*.mjs` and `lib.d.mts` to
  `scripts/registry/`
- Does NOT change any library file's content

**Stays unchanged:** `scripts/check-storybook.mjs`, `stories/`, `.storybook/`, `public/r/`.

#### 1.6.3 Guard

`scripts/registry/check-bases.mjs`, run as `pnpm check:bases` from the repo root and in CI.

- Every file under `registry/radix/components/ui/shadcn-table/` not in `base-diff.json` has a
  byte-identical twin in `registry/base/`
- Every listed file exists in both trees
- No library file exists in one tree only
- Exits non-zero with every offending path; does NOT copy or fix anything

**Operations:**

| Operation                       | Status | Notes                              |
| ------------------------------- | ------ | ---------------------------------- |
| `check-bases.mjs`               | new    | reads `base-diff.json`             |
| root `package.json` `check:bases` | new  |                                    |
| CI job `bases`                  | new    | in `.github/workflows/ci.yml`      |

#### 1.6.4 Resolution configs

Each tree is a plain alias target; nothing falls back.

- `tsconfig.radix.json`: `paths` `@/*` to `./registry/radix/*`, `include` `registry/radix`;
  `tsconfig.baseui.json` likewise for `registry/base`; both exclude their `registry.ts`
- `tsconfig.json`: references radix, baseui and stories projects; no `baseUrl`
- `tsconfig.stories.json`: extends radix, adds `stories`, `.storybook`
- `vite.config.ts`: `resolve.alias` `@` to `registry/<ST_BASE>`; `st-base-fallback` and
  `resolveAlias` deleted; `ST_BASE` export kept
- `vitest.config.ts` and `.storybook/main.ts`: keep reading `ST_BASE` from `vite.config.ts`;
  cache-dir suffix logic unchanged

**Operations:**

| Operation                    | Status   | Notes                                   |
| ---------------------------- | -------- | --------------------------------------- |
| `tsconfig.json` references   | refactor | three projects, `baseUrl` removed       |
| `tsconfig.radix.json` paths  | refactor | one root                                |
| `tsconfig.baseui.json` paths | refactor | one root                                |
| `vite.config.ts` alias       | refactor | plugin removed                          |
| `vitest.config.ts`           | keep     |                                         |
| `.storybook/main.ts`         | keep     |                                         |

#### 1.6.5 ESLint

- Removes the `no-restricted-imports` rule that forbade relative imports inside the library;
  its reason, override resolution, is gone
- Updates ignore and glob paths from `bases/`, `shared/` to `registry/`
- Does NOT rewrite any import in library files

#### 1.6.6 Registry scripts

- `lib.mjs` `baseItems` reads the tree's own files; the shared-plus-overrides merge and the
  "overrides nothing" warning go
- `build.mjs` imports `../../registry/<base>/registry.ts`
- `hosted.mjs`, `examples.mjs`, `add-part.mjs`: path constants to the new locations
- Root `package.json` scripts `registry:items`, `registry:hosted`, `add-part` point at
  `scripts/registry/`
- `registry.ts` header comments describe the tree, not overrides

**Operations:**

| Operation             | Status   | Notes                       |
| --------------------- | -------- | --------------------------- |
| `baseItems()`         | refactor | one directory walk          |
| `build.mjs` imports   | refactor |                             |
| path constants        | refactor | three scripts               |
| root scripts          | refactor | three entries               |

**Stays unchanged:** item names, `registryDependencies` derivation, `css` field, locale items.

#### 1.6.7 Layout docs

- `registry/README.md`: what lives where; a common change is made in both trees and the guard
  reports a missed one; a base-only change is made in one tree and added to `base-diff.json`
  in the same commit
- `CONTRIBUTING.md` layout block and commands; `.github/workflows/ci.yml` paths
- Docs app `lib/install.ts`, `lib/example-files.mjs`, `lib/example-pages.mjs`,
  `scripts/install-base.mjs` path constants only; the installer itself is rewritten in
  [05](05-docs-app-layout.md)

### 1.7 Dependencies and env: none

## 2. Instructions for AI

### 2.1 Phases

#### 2.1.1 Phase 1: Move

- `git mv` per 1.6.2, one commit
- Write `base-diff.json` from the pre-move listing

#### 2.1.2 Phase 2: Resolution and guard

- Configs per 1.6.4, ESLint per 1.6.5
- `check-bases.mjs` per 1.6.3, root script, CI job

#### 2.1.3 Phase 3: Scripts and docs

- Registry scripts per 1.6.6; `pnpm registry:build`
- Docs per 1.6.7

#### 2.1.4 Final phase: Cleanup

- Delete `bases/`, `shared/`, the old `registry/*.mjs` locations if anything remains
- `pnpm format`, then every gate in 2.2

### 2.2 Gates

- `pnpm check:bases` green; then a one-line edit in one tree turns it red with the path;
  revert
- `pnpm --filter shadcn-table tsc:radix`, `tsc:baseui`, `tsc -p tsconfig.stories.json`,
  `lint`; `test` and `test:base` 400/400; `storybook:build` and `storybook:build:base`;
  `node scripts/check-storybook.mjs`
- `pnpm registry:build`; `git diff packages/shadcn-table/registry.json` shows only path
  prefix changes; docs app `lib:install` and `lib:install:base` from the rebuilt registry
  leave `components/ui*` unchanged
- CI install matrix green on the branch
- Owner editor check: `registry/radix/.../body/ST_TableBody.tsx` and its Base UI twin show
  no unresolved imports
