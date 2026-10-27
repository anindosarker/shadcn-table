# 04: docs

## 1. Architecture

### 1.1 Overview

The docs app (`apps/shadcn-table-docs`) teaches the public API that parts 01 and 02
changed: sub-components take no `table` prop, `ST_TableProvider` exists, `memoMode` and
`expandRowsFn` are gone, `stFeatures` is a type, locales live under `shared/locales`, `mk`
is a new locale. Its installed library copies (`components/ui-radix`, `components/ui-base`)
follow the registry through `lib:install`; the content, examples, prop tables, agent
files and page checks are this part. Decisions: [decisions.md](decisions.md) items 2, 4,
5, 6, 7. Runs after [02](02-base-tree.md); in parallel with [03](03-storybook.md).

### 1.2 Goals

- `lib:install radix` and `lib:install base` refresh `components/ui-radix` and `ui-base`
  with no hand edits; `types:check` green
- The 9 example folders and 2 guides that compose sub-components use `ST_TableProvider`;
  no `<ST_X table={table} />` anywhere under `content/`, `examples/`, `components/` outside
  the installed copies
- `guides/memoization.mdx` removed from content and `meta.json`; prop tables lose
  `memoMode`, `expandRowsFn` and the `table` prop; `api/table-options.mdx:23` loses the
  `stFeatures` mention; `ST_TableProvider` documented
- Locale guide, `example-groups/LocaleExamples.tsx`, `examples/map.ts` and a
  `localization-i18n-mk` example cover `mk`; every locale import path reads
  `@/components/ui/shadcn-table/shared/locales/<code>`
- `skills/shadcn-table/SKILL.md` (served at `/SKILL.md`) and
  `packages/shadcn-table/registry/README.md` describe the new tree and import paths
- `check-pages.mjs a` and `e` green on the preview deployment; `build` green

### 1.3 Current structure

```
apps/shadcn-table-docs/
├── content/docs/         guides/, api/, getting-started/; memoization.mdx; 2 guides compose sub-components
├── examples/<slug>/      115 examples; 9 compose sub-components with table={table}
├── lib/prop-tables/      tableOptions.ts (memoMode:984, expandRowsFn:752), columnOptions.ts, tableInstanceAPIs.ts, ...
├── components/ui-radix/  installed radix library (committed, refreshed by lib:install)
├── components/ui-base/   installed base library
└── scripts/page-checks/  a.mjs, e.mjs
skills/shadcn-table/SKILL.md   agent install guide, locale import path `locales/de`
packages/shadcn-table/registry/README.md
```

### 1.4 Target structure

Same tree. `guides/memoization.mdx` gone. New: `examples/localization-i18n-mk/`,
`guides/table-provider.mdx` or a section in `toolbar-customization.mdx` (one place that
shows `ST_TableProvider`, linked from every guide that composes pieces).

### 1.6 Components

#### 1.6.1 Data artifacts

- `content/docs/guides/meta.json`: `memoization` removed
- `examples/map.ts`: `localization-i18n-mk` added
- `lib/prop-tables/tableOptions.ts`: `memoMode`, `expandRowsFn` removed; `filterFns`,
  `sortFns`, `aggregationFns` descriptions say names resolve in core; `columnOptions.ts`
  and `tableInstanceAPIs.ts` follow any renamed API from part 01
- `scripts/page-checks/a.mjs`, `e.mjs`: the memoization page removed from the lists, the
  table-provider page and the mk example added

#### 1.6.2 Installed copies

`pnpm lib:install radix` and `lib:install base` after the registry build. The copies are
not edited by hand.

**Stays unchanged:** `components.json`, the `ui` alias.

#### 1.6.3 Examples and guides

- The 9 example folders (`advanced`, `custom-column-filtering-ui`, `custom-headless`,
  `custom-top-toolbar`, `customize-remove-column-grouping`, `editing-crud-modal`,
  `enable-row-ordering`, `external-toolbar`, `minimal`): sub-components without `table`,
  wrapped in `ST_TableProvider` where they render outside `ShadcnTable`
- `guides/column-grouping.mdx`, `guides/toolbar-customization.mdx`: same
- `guides/column-filtering.mdx:213-221` custom filter example: `row.original.customField`
  and `filterValue` (the snippet is wrong today)
- `guides/expanding-sub-rows.mdx:19`: `expandRowsFn` key removed
- `api/table-options.mdx:23`: `stFeatures` mention removed
- `getting-started/usage.mdx`: import path note for locales
- Does NOT rewrite guide prose beyond the lines the API change touches

#### 1.6.4 Agent and registry files

- `skills/shadcn-table/SKILL.md`: locale import path, `ST_TableProvider` in the composition
  section, folder names where it lists them
- `packages/shadcn-table/registry/README.md`: tree and item paths

### 1.7 Dependencies and env

Vercel preview for the page checks (`check-pages.mjs` takes a base URL). Docs gates per
`apps/shadcn-table-docs/package.json`.

## 2. Instructions for AI

Tracker `04-tracker.md`, deviations only. Worktree `shadcn-react-table.worktrees/04-docs`
on branch `v0.4/docs` from `dev` after part 02 merges. One coder for examples and guides,
one for prop tables and agent files, one reviewer, one verifier who runs the page checks
against the preview.

Halt and ask the owner on: a guide whose example no longer has an equivalent in the new
API, a prop-table entry whose new description is not covered by a decision.

### 2.1 Phases

#### 2.1.1 Phase 01: Installed copies and types

- `pnpm registry:build`, `lib:install radix`, `lib:install base`; `types:check` green

#### 2.1.2 Phase 02: Examples, guides, prop tables

- 1.6.1, 1.6.3; `build` green; page checks green on the preview

#### 2.1.3 Final phase: Agent files and gates

- 1.6.4; every gate in 2.2; merge into `dev`

### 2.2 Gates

- `pnpm --filter shadcn-table-docs types:check`, `lint`, `build`
- `node scripts/page-checks/a.mjs <preview>` and `e.mjs <preview>` green
- `grep -rnE "<ST_[A-Za-z]+[^>]*table=\{table\}" apps/shadcn-table-docs/content apps/shadcn-table-docs/examples` returns nothing
- `grep -rn "memoMode\|expandRowsFn" apps/shadcn-table-docs/content apps/shadcn-table-docs/lib` returns nothing
