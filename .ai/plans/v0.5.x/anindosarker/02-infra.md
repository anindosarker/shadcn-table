# 02: infra

## 1. Architecture

### 1.1 Overview

Every script, config and workflow that knows two editions learns a third. Decisions 2 and
3. Runs after [01](01-aria-tree.md) is merged; part 01 adds only the scripts it needs to
gate itself, this part makes the edition a first-class value everywhere.

### 1.2 Goals

- One edition list drives the scripts: `['radix', 'base', 'aria']` in
  `scripts/registry/lib.mjs` (or a small `editions.mjs`), read by `build.mjs`, `hosted.mjs`,
  `examples.mjs`, `check-bases.mjs`, the docs `install.mjs` and `example-variants.mjs`
- `pnpm check:bases` compares base and aria against radix with their own diff lists
- CI `library`, `test` matrices run `[radix, base, aria]`; `bases` guard covers both pairs;
  `release.yml` smokes and installs the aria items too
- `ST_BASE=aria` in `vite.config.ts` and `.storybook/main.ts`; scripts `storybook:aria`
  (port 6008), `storybook:build:aria` (`storybook-static/aria`), `test:aria`, `tsc:aria`;
  `check-storybook.mjs` checks the aria output and the edition button
- `next.config.mjs` rewrites `/r/:style(aria-.*)/:name.json` to `/r/aria/:name.json`;
  `registry:hosted` writes `public/r/aria`
- `pnpm --filter shadcn-table-docs lib:install aria` installs into `components/ui-aria`;
  `example-variants.mjs` emits `examples/.aria`
- `pnpm preview` (root and package) starts the aria Storybook as a third child

### 1.3 Current structure

```
packages/shadcn-table/scripts/registry/{lib,build,hosted,examples,check-bases,add-part}.mjs   radix and base hard-coded
packages/shadcn-table/{vite.config.ts,.storybook/main.ts,package.json}                          ST_BASE radix|base
.github/workflows/{ci,release,install}.yml                                                       matrix [radix, base]
apps/shadcn-table-docs/{next.config.mjs,scripts/install.mjs,lib/example-variants.mjs,lib/install.ts}
scripts/preview.mjs, packages/shadcn-table/scripts/preview.mjs
```

### 1.4 Target structure

Same files, edition-driven. New: `packages/shadcn-table/tsconfig.aria.json`,
`scripts/registry/aria-diff.json` (from part 01), `apps/shadcn-table-docs/components/ui-aria/`.

### 1.5 Flow: none

### 1.6 Components

#### 1.6.1 Data artifacts

- `packages/shadcn-table/package.json`: `tsc:aria`, `test:aria`, `storybook:aria`,
  `storybook:build:aria`
- `registry.json`: regenerated with the aria items
- `.github/workflows/ci.yml`, `release.yml`, `install.yml`: aria in every matrix and
  scenario; `release.yml` smoke list gets `/r/aria/shadcn-table.json`
- `docs/code-of-conduct/coding-standards.md`: "Two trees" becomes "Editions" with the three
  trees and two diff lists; the gates block lists the aria commands
- `CHANGELOG.md`: nothing beyond part 01's line

#### 1.6.2 Edition list

- `EDITIONS = ['radix', 'base', 'aria']` with `radix` as the reference; every loop over
  editions reads it; the diff list per edition is `<edition>-diff.json`
- Does NOT change what a diff list means

#### 1.6.3 Guard, CI, Storybook, docs app

Per the goals; each change mirrors what `base` has today, one commit per area.

**Stays unchanged:** item names of the existing editions, ports 6006, 6007, 5310, 5320, 5330.

### 1.7 Dependencies and env: none

## 2. Instructions for AI

Tracker `02-tracker.md`. Branch `v0.5/infra` from `claude/review` after part 01 merges,
worktree `07`. One coder for scripts and CI, one for the docs app and preview, one reviewer,
one verifier who runs every gate on all three editions.

### 2.1 Phases

#### 2.1.1 Phase 01: Scripts and guard

- 1.6.2, `check-bases.mjs`, registry scripts, `package.json` scripts, tsconfig

#### 2.1.2 Phase 02: CI, Storybook, docs app, preview

- Workflows, `.storybook`, `vite.config.ts`, `next.config.mjs`, `install.mjs`,
  `example-variants.mjs`, `lib/install.ts`, the two `preview.mjs`

#### 2.1.3 Final phase: Gates

- 2.2; merge into `claude/review`

### 2.2 Gates

- `pnpm check:bases` (three trees); `tsc:radix`, `tsc:baseui`, `tsc:aria`; `lint`; `test`,
  `test:base`, `test:aria`; the three Storybook builds; `check-storybook.mjs`
- `pnpm registry:build` clean; `lib:install radix`, `base`, `aria` clean
- `act` or a pull request run of `ci.yml` green on all matrix entries
- `pnpm preview` starts three Storybooks and the docs
