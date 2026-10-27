# 02: base tree

## 1. Architecture

### 1.1 Overview

Part 01 rewrites `registry/radix` only. The Base UI tree, `registry/base`, is a complete
copy of the library where 23 files differ (`scripts/registry/base-diff.json`). This part
brings `registry/base` to the same architecture: every non-diff file copied over, every
diff file edited by hand to the same shape, the base gates green, `pnpm check:bases` green.
Decisions: [decisions.md](decisions.md); nothing new is decided here. Runs after
[01](01-v9-architecture.md) is merged into `dev`.

### 1.2 Goals

- `registry/base/components/ui/shadcn-table/` has the part 01 folder layout, features, hook,
  components and shared files
- Every file not in `base-diff.json` is byte-identical between the two trees
- Every file in `base-diff.json` exists in both trees and differs only in Base UI parts
  and their props
- `pnpm check:bases` green; `tsc:baseui`, `test:base`, `storybook:build:base` green
- Zero `table.state` under `registry/base/.../components/`
- Registry build emits every base item at the new paths; `lib:install base` leaves
  `components/ui-base` consistent

### 1.3 Current structure

`registry/base` is the pre-part-01 tree: flat `body/ head/ ...` folders, `utils/tanstack.features.ts`,
`table` prop everywhere, `table.state` reads, `memoMode`. `base-diff.json` lists the 23 files
whose Base UI primitives differ (menus, inputs, modals, tooltip, select, checkbox and the
parts under `components/ui/*`), with their current flat paths.

### 1.4 Target structure

Same tree as part 01 section 1.4, under `registry/base/components/ui/shadcn-table/`.
`base-diff.json` paths follow the moves (`body/ST_X.tsx` to `components/body/ST_X.tsx`, and
so on).

### 1.6 Components

#### 1.6.1 Data artifacts

- `scripts/registry/base-diff.json`: paths updated to the new layout; entries added or
  removed only where part 01 created or deleted a file that has a Base UI twin
- Registry items: base variants of every item at the new paths

#### 1.6.2 Copied files

Every file outside `base-diff.json`: copied from `registry/radix` to `registry/base`
unchanged. Features, hooks, `shared/`, types, `index.ts`, locales, and most components.

- Does NOT edit a copied file by hand; a needed change goes to radix first, then copies

#### 1.6.3 Diff files

The 23 `base-diff.json` files, edited by hand to the same architecture as their radix
twin: no `table` prop, `instance.table` or `useSTContext()`, `Subscribe` reads, `.get()`
in handlers, `memoMode` branches gone. Base UI props, parts and class names stay as they
are today.

**Stays unchanged:** which Base UI primitives each file uses.

#### 1.6.4 Stories and tests on base

`ST_BASE=base` runs the same stories and tests against this tree. Failures that are
base-only are fixed in the diff files; failures shared with radix go back to part 01.

### 1.7 Dependencies and env

`ST_BASE=base` for every base gate. `pnpm check:bases` compares both trees against
`base-diff.json`.

## 2. Instructions for AI

Tracker `02-tracker.md`, deviations only. Worktree `shadcn-react-table.worktrees/02-base`
on branch `v0.4/base-tree` from `dev` after part 01 merges. One coder for the copy and the
diff-file edits, one reviewer who diffs each of the 23 files against its radix twin,
one verifier for the gates.

Halt and ask the owner on: a diff file that needs a change the radix twin does not have, a
story that passes on radix and cannot pass on base.

### 2.1 Phases

#### 2.1.1 Phase 01: Copy and paths

- Move the base tree to the new folder layout; copy every non-diff file from radix
- Update `base-diff.json` paths; `pnpm check:bases` reports only the 23 files

#### 2.1.2 Phase 02: Diff files

- Edit the 23 files per 1.6.3, one commit per folder
- `tsc:baseui` green

#### 2.1.3 Final phase: Gates

- `test:base`, `storybook:build:base`, `node scripts/check-storybook.mjs` on the base
  output; `pnpm registry:build`; `lib:install base`
- Merge into `dev`

### 2.2 Gates (base)

- `pnpm check:bases` green
- `pnpm --filter shadcn-table tsc:baseui`, `lint`, `test:base`, `storybook:build:base`
- `grep -rn "table\.state" packages/shadcn-table/registry/base/components/ui/shadcn-table/components` returns nothing
- `pnpm registry:build`; `pnpm --filter shadcn-table-docs lib:install base` leaves
  `components/ui-base` consistent with the registry
