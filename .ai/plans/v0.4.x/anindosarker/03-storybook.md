# 03: storybook

## 1. Architecture

### 1.1 Overview

The 55 story files under `packages/shadcn-table/stories/` are the library's tests (vitest
browser mode runs every story on both bases) and the owner's review surface. Parts 01 and
02 changed the public shape they exercise: no `table` prop on sub-components, no
`memoMode`, no `expandRowsFn`, `ST_TableProvider` for hand composition, pin-on-select from
the store, narrow re-renders. This part brings the stories to that shape, removes the ones
that test removed options, fixes the stale patterns found in the 0.3.x cycle, and adds the
stories that prove the decisions' verify lists. Decisions: [decisions.md](decisions.md)
items 3 to 8. Runs after [02](02-base-tree.md); in parallel with [04](04-docs.md).

### 1.2 Goals

- Every story renders and passes on both bases: `test` and `test:base` green, Storybook
  builds for both
- No story passes `table={table}` to a sub-component; the 6 that compose pieces use
  `ST_TableProvider`
- `Memod.stories.tsx` removed; `Virtualization.stories.tsx` loses its `memoMode` variants
- `DetailPanel.stories.tsx` no longer uses the stale `!row.getIsExpanded()` toggle
- New stories cover the decisions' verify lists: custom fn names per call, two tables with
  different registries, pin-on-select under controlled and external-atom selection, cell
  action menu edit, hover and density re-render counts, `ST_TableProvider` composition,
  nested table in a detail panel
- `node scripts/check-storybook.mjs` green on both outputs

### 1.3 Current structure

```
packages/shadcn-table/stories/
├── Basic.stories.tsx
├── features/     per-feature stories, Memod.stories.tsx, Virtualization.stories.tsx, DetailPanel.stories.tsx, ...
├── styling/
└── fixed-bugs/   one story per fixed bug, named by the bug
```

6 story files pass `table={table}` to a sub-component. `Memod.stories.tsx` and the memo
variants in `Virtualization.stories.tsx` exercise `memoMode`.

### 1.4 Target structure

Same folders. `features/Memod.stories.tsx` gone. New files:

```
features/CustomFilterFns.stories.tsx      per-call filterFns, sortFns, aggregationFns by name; two tables, different registries
features/RowPinningOnSelect.stories.tsx   select-top and select-bottom with internal, controlled and external-atom selection
features/TableProvider.stories.tsx        hand composition: ST_TableContainer, ST_TopToolbar, buttons under ST_TableProvider
features/NestedTable.stories.tsx          ShadcnTable inside renderDetailPanel
fixed-bugs/CellActionMenuEdit.stories.tsx edit from the cell action menu keeps focus
fixed-bugs/PaginationDisabled.stories.tsx enablePagination false with manualPagination false shows all rows
fixed-bugs/HeadlessDisplayColumn.stories.tsx a display column header rendered through flexRender outside the layout
styling/RenderCounts.stories.tsx          render counters on row, cell, toolbar button for hover, density, select
```

### 1.6 Components

#### 1.6.1 Data artifacts

- `scripts/check-storybook.mjs` story list, if it pins names

#### 1.6.2 Existing stories

- Replace `table={table}` on sub-components with `ST_TableProvider`
- Remove `memoMode` args, controls and variants
- `DetailPanel.stories.tsx`: toggle through `row.toggleExpanded()`; no manual negation
- Any story asserting on `table.state` in a play function reads `table.store.state`

**Stays unchanged:** story names and ids that `check-storybook.mjs` or the docs link to,
except `Memod`.

#### 1.6.3 New stories

One per line in 1.4, each with a play function that asserts the behavior named in the
decisions' verify list. `RenderCounts` uses a counter component per subtree and asserts
counts after one hover, one density toggle and one row select, so the D2 claim is measured
not described.

- Does NOT add snapshot tests; assertions are DOM and counter based

### 1.7 Dependencies and env

Vitest browser mode with Playwright, both bases via `ST_BASE`. The shared dev server rule
from memory applies: never kill the vite server on `:5273`; Storybook on its own port.

## 2. Instructions for AI

Tracker `03-tracker.md`, deviations only. Worktree `shadcn-react-table.worktrees/03-stories`
on branch `v0.4/storybook` from `dev` after part 02 merges. One coder for existing stories,
one for new stories, one reviewer, one verifier who runs both bases.

Halt and ask the owner on: a story whose behavior changed and no decision covers which
behavior is right, a play function that cannot assert a verify-list item.

### 2.1 Phases

#### 2.1.1 Phase 01: Existing stories

- 1.6.2; `test` and `test:base` green

#### 2.1.2 Phase 02: New stories

- 1.6.3; each story's play function green on both bases

#### 2.1.3 Final phase: Gates

- `storybook:build` and `storybook:build:base`; `node scripts/check-storybook.mjs` on both
- Merge into `dev`

### 2.2 Gates

- `pnpm --filter shadcn-table tsc -p tsconfig.stories.json`, `lint`
- `test` and `test:base` green, every story
- `storybook:build`, `storybook:build:base`, `node scripts/check-storybook.mjs`
- `grep -rn "memoMode" packages/shadcn-table/stories` returns nothing
