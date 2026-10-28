# 03: stories and docs

## 1. Architecture

### 1.1 Overview

The stories already run per edition through `ST_BASE`; the docs app already renders every
example per edition and switches site-wide. This part makes both three-way and documents
the React Aria edition. Decisions 5 and 6. Runs after [02](02-infra.md) is merged.

### 1.2 Goals

- `test:aria` green on every story; `check-storybook.mjs` green on the aria output with
  the edition button showing three editions
- Docs app: the edition switch offers Radix UI, Base UI, React Aria; every example page
  renders the aria variant; install commands and `/r` URLs carry the aria style
- `install.mdx`, `introduction.mdx`, `SKILL.md`, `packages/shadcn-table/registry/README.md`
  list three editions and the aria install command
- `check-pages a`, `c`, `e` green against `next start`, aria variant included where the
  checks iterate editions

### 1.3 Current structure

```
packages/shadcn-table/stories/**                       shared, ST_BASE picks the tree
apps/shadcn-table-docs/components/base-selector.tsx    two tabs
apps/shadcn-table-docs/lib/install.ts                  bases, baseLabels, defaultBase
apps/shadcn-table-docs/examples/<slug>/{TS.tsx,index.tsx}, .radix, .base
apps/shadcn-table-docs/content/docs/getting-started/{install,introduction}.mdx
skills/shadcn-table/SKILL.md, packages/shadcn-table/registry/README.md
```

### 1.4 Target structure

Same files; `examples/.aria` generated; `components/ui-aria` installed.

### 1.5 Flow: none

### 1.6 Components

#### 1.6.1 Data artifacts

- `lib/install.ts`: `bases` gains `aria`, label "React Aria", the style name from part 01
- `scripts/page-checks/*.mjs`: aria added wherever a check lists editions
- `meta.json`, `routes.ts`: unchanged unless a page is added

#### 1.6.2 Stories on aria

- Every story file renders and its play passes with `ST_BASE=aria`; a story that needs an
  aria-only adjustment is a halt item unless the adjustment keeps radix and base green
- Does NOT add aria-only stories

#### 1.6.3 Docs

- `base-selector.tsx`: third tab; the fumadocs tab group value for aria
- `install.mdx`: aria command, style note, the hoisted style and CSP note already there
- `SKILL.md`, README: edition list, item names, paths
- Does NOT rewrite guide prose; examples are the same sources rendered per edition

### 1.7 Dependencies and env: none

## 2. Instructions for AI

Tracker `03-tracker.md`. Branch `v0.5/stories-docs` from `claude/review` after part 02
merges, worktree `07`. One coder for stories and the Storybook, one for the docs app and
agent files, one reviewer, one verifier who runs the aria Storybook through Playwright and
the page checks against `next start`.

### 2.1 Phases

#### 2.1.1 Phase 01: Stories

- 1.6.2; `test:aria`, `storybook:build:aria`, `check-storybook.mjs`

#### 2.1.2 Phase 02: Docs

- 1.6.1, 1.6.3; `types:check`, `lint`, `build`, page checks

#### 2.1.3 Final phase: Gates

- 2.2; merge into `claude/review`

### 2.2 Gates

- Part 02 gates on all three editions
- Docs `types:check`, `lint`, `build`; `check-pages a`, `c`, `e`
- `grep -rn "Radix UI | Base UI" apps/shadcn-table-docs/content skills packages/shadcn-table/registry/README.md` empty (every edition list names three)
