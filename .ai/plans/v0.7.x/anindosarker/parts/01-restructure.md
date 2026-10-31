# 01: restructure

## 1. Architecture

### 1.1 Overview

Three library files sit outside the folder of their kind: two wrappers at the library root and a hook under `components/toolbar/`. They move to the folders of their kind in all three bases; only the files and their import paths change, no code rides along (D1). Branch `v0.7/restructure` from `claude/review`, worktree `shadcn-react-table.worktrees/restructure`, one PR into `claude/review` for CI, merged by merge commit once green. Every later library part rebases onto it.

### 1.2 Goals

- `ST_Checkbox.tsx` in `components/inputs/`, `ST_Tooltip.tsx` in `components/buttons/`, `useST_MediaQuery.ts` in `hooks/`, in `registry/base`, `registry/radix` and `registry/aria` (D1)
- No other file moves; no line changes except import specifiers and the listed references (D1)
- `registry.json` diff limited to the three moved file entries in each of the four main items (`shadcn-table-base`, `shadcn-table-radix`, `shadcn-table-aria`, `shadcn-table`)
- Public barrel unchanged in content: the same names export from `index.ts`
- All gates green on all three bases
- Done when: `grep -rnE "shadcn-table/(ST_Checkbox|ST_Tooltip|components/toolbar/useST_MediaQuery)'" packages/shadcn-table apps/shadcn-table-docs/components` prints nothing and `pnpm check:bases` exits 0 (P6)

### 1.3 Current structure

Same in every base, below `packages/shadcn-table/registry/<base>/components/ui/shadcn-table/`:

```
shadcn-table/
├── ST_Checkbox.tsx                  ← 4 importers
├── ST_Tooltip.tsx                   ← 25 importers
├── ShadcnTable.tsx
├── index.ts                         ← :16 useST_MediaQuery, :25 ST_Checkbox, :26 ST_Tooltip
├── components/
│   ├── buttons/  inputs/  ...
│   └── toolbar/useST_MediaQuery.ts  ← 4 importers
└── hooks/
```

Import sites per base: 33 lines in 28 files, all `@/components/ui/shadcn-table/...` alias specifiers (13 files in `components/buttons`, 4 `components/inputs`, 3 `components/head`, 3 `components/toolbar`, 1 each in `components/menus`, `hooks/display-columns`, `shared/utils`, `types.ts`, `index.ts`). Stories and docs examples import these names from the barrel only.

### 1.4 Target structure

```
shadcn-table/
├── ShadcnTable.tsx
├── index.ts                         ← three export specifiers updated
├── components/
│   ├── buttons/ST_Tooltip.tsx       ← moved
│   ├── inputs/ST_Checkbox.tsx       ← moved
│   └── toolbar/                     ← useST_MediaQuery.ts gone
└── hooks/useST_MediaQuery.ts        ← moved
```

### 1.5 Flow: none

### 1.6 Components

#### 1.6.1 Data artifacts

- `packages/shadcn-table/scripts/registry/base-diff.json:2,3` and `aria-diff.json:2,3`: `ST_Checkbox.tsx` and `ST_Tooltip.tsx` become `components/inputs/ST_Checkbox.tsx` and `components/buttons/ST_Tooltip.tsx`, each placed at its sorted position (both lists are sorted today). `useST_MediaQuery.ts` is on neither list.
- `packages/shadcn-table/registry.json`: regenerated with `pnpm registry:build`. The file walk is sorted, so each moved entry leaves its old position and appears at its new one; `path` and `target` change, `type` stays `registry:ui`. Item names and hosted paths unchanged.
- Hosted output `apps/shadcn-table-docs/public/r/{base,radix}` (gitignored, built by `registry:hosted`): only `shadcn-table.json` and `registry.json` in each folder differ, in the moved entries.
- `CHANGELOG.md` `## Unreleased` `### Changed`: "`ST_Checkbox` moved to `components/inputs/`, `ST_Tooltip` to `components/buttons/`, `useST_MediaQuery` to `hooks/`; barrel imports are unchanged, deep imports follow the new paths."

#### 1.6.2 Library moves

`git mv` per base, then every importer follows. Mechanical.

- Moves the three files in all three bases, history kept by `git mv`
- Rewrites the 33 import lines per base to the new alias paths, including `index.ts:16,25,26`
- Does NOT change any other line, export name, file name, item name or hosted path (D1)
- Does NOT move `ShadcnTable.tsx`, `hooks/stTableHook.tsx`, `ST_TableLayout.tsx`, `shared/fns/sortFns.ts`, `features/stFeatures.ts`, `getST_RowSpacerColumnDef.tsx` (D1)

**Operations:**

| Operation | Status | Notes |
| --- | --- | --- |
| `ST_Checkbox.tsx` to `components/inputs/` | refactor | 3 bases |
| `ST_Tooltip.tsx` to `components/buttons/` | refactor | 3 bases |
| `components/toolbar/useST_MediaQuery.ts` to `hooks/` | refactor | 3 bases |
| import specifiers | refactor | 33 lines in 28 files per base |
| `base-diff.json`, `aria-diff.json` | refactor | lines 2, 3, sorted |

**Stays unchanged:** file contents beyond import lines, `registry/<base>/registry.ts`, `scripts/registry/build.mjs`, `lib.mjs`, `check-bases.mjs`, stories, docs examples.

#### 1.6.3 Docs app copies

The three installed copies under `apps/shadcn-table-docs/components/ui-{base,radix,aria}/shadcn-table/` mirror the registry trees with `@/components/ui-<base>/` specifiers. `pnpm --filter shadcn-table-docs lib:install <base>` (`scripts/install.mjs`) runs `shadcn add --overwrite` from the built item in `packages/shadcn-table/public/r`; it writes new files but deletes none.

- `git rm` the three old files in each copy first, then `pnpm registry:build`, then `lib:install base`, `lib:install radix`, `lib:install aria`
- `git status` shows the three renames per copy plus the rewritten import lines, nothing else

**Stays unchanged:** shadcn parts in `components/ui-<base>/`, `components.json`, `app/global.css`, `package.json`, lockfile (the install restores them).

#### 1.6.4 References

- `docs/code-of-conduct/coding-standards.md:51`: "a library wrapper under `components/ui/shadcn-table/` (`ST_Tooltip`, `ST_Checkbox`)" becomes "a library wrapper in the folder of its kind (`components/buttons/ST_Tooltip.tsx`, `components/inputs/ST_Checkbox.tsx`)"
- `packages/shadcn-table/registry/README.md:22`: `ST_Tooltip.tsx` leaves the root file line of the tree

### 1.7 Dependencies and env: none

## 2. Instructions for AI

### 2.1 Phases

#### 2.1.1 Phase 1: Library moves

Lane: agent

- 1.6.2 in `registry/radix`, then the same in `registry/base` and `registry/aria`; 1.6.1 diff lists
- `grep -rnE "shadcn-table/(ST_Checkbox|ST_Tooltip|components/toolbar/useST_MediaQuery)'" packages/shadcn-table` empty
- Gates: `tsc:radix`, `tsc:baseui`, `tsc:aria`, `lint`, `check:bases`

#### 2.1.2 Phase 2: Registry and docs copies

Lane: agent

- `pnpm registry:build`; `git diff packages/shadcn-table/registry.json` holds only the moved `path` and `target` pairs (12 entries removed, 12 added)
- Hosted output: `pnpm registry:hosted` before (on `claude/review`) and after, saved copies of `public/r`; `diff -r` lists only `shadcn-table.json` and `registry.json` per folder, in the moved entries
- 1.6.3 for the three bases
- Gates: docs `types:check`, `lint`, `build`

#### 2.1.3 Final phase: Cleanup

Lane: inline

- 1.6.4, CHANGELOG line from 1.6.1
- `pnpm format`; PR into `claude/review` with `release:minor`, merge commit when green, push right after each commit
- Gates: the full set in 2.2

### 2.2 Gates

- `pnpm --filter shadcn-table tsc:radix`, `tsc:baseui`, `tsc:aria`, `lint` green
- `pnpm --filter shadcn-table test:base`, `test:radix`, `test:aria` green
- `pnpm check:bases` green (library and examples)
- `pnpm registry:build`: `registry.json` diff limited to the moved `path`/`target` pairs; hosted `diff -r` limited to those entries
- `pnpm --filter shadcn-table-docs types:check`, `lint`, `build` green
- `pr.yml` green on the PR
