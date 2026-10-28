# 01: aria tree

## 1. Architecture

### 1.1 Overview

The library exists twice, `registry/radix` and `registry/base`, byte-identical outside the
23 files of `base-diff.json`. This part adds `registry/aria`: shadcn's React Aria parts,
the shared library copied from radix, and the files that touch a part ported by hand to
React Aria's shapes. Decisions 1, 2, 4, 5. Nothing new is decided here.

### 1.2 Goals

- `registry/aria/` has `components.json` (shadcn aria style), the 26 aria parts the library
  imports under `components/ui/`, `index.css`, `registry.ts`, `lib/`, and the library at
  `components/ui/shadcn-table/` in the 0.4.x layout
- `scripts/registry/aria-diff.json` lists every file that differs from radix; every other
  library file is byte-identical to radix
- `pnpm --filter shadcn-table tsc:aria`, `lint`, `test:aria`, `storybook:build:aria` green
- Zero `table.state` under `registry/aria/.../components/`; zero `as any`
- Every story renders and every play passes on `ST_BASE=aria`, or the story is a halt item

### 1.3 Current structure

```
packages/shadcn-table/registry/
├── radix/   components.json (radix-nova), components/ui/<26 parts>, components/ui/shadcn-table, index.css, lib, registry.ts
└── base/    components.json (base-nova), same shape; 23 files differ (base-diff.json)
```

### 1.4 Target structure

```
packages/shadcn-table/registry/
├── radix/
├── base/
└── aria/                                   ← new
    ├── components.json                     ← shadcn aria style, as `shadcn init` writes it
    ├── components/ui/<parts>.tsx           ← alert, badge, button, checkbox, collapsible, combobox, command, dialog,
    │                                          dropdown-menu, field, input-group, input, label, native-select, pagination,
    │                                          popover, progress, radio-group, select, separator, skeleton, slider,
    │                                          spinner, switch, table, textarea, tooltip (whatever the aria set provides;
    │                                          a missing part is a halt item)
    ├── components/ui/shadcn-table/         ← shared files copied; diff files ported
    ├── index.css  lib/utils.ts  registry.ts
packages/shadcn-table/scripts/registry/aria-diff.json
```

### 1.5 Flow: none

### 1.6 Components

#### 1.6.1 Data artifacts

- `registry/aria/registry.ts`: the main item `shadcn-table-aria` and its locale items,
  mirroring `registry/base/registry.ts` with the aria paths and `react-aria-components`
  (plus whatever the parts depend on) in `dependencies`
- `scripts/registry/aria-diff.json`: the discovered diff list (decision 4)
- `CHANGELOG.md` `## Unreleased`: Added, React Aria edition
- `01-tracker.md`: phase 00 report (style name, part list, diff list with the reason per
  file), deviations

#### 1.6.2 Phase 00 discovery

A scratch app initialised with `shadcn init` on the aria style tells us the style name and
installs the parts; the parts are copied into `registry/aria/components/ui/`; the radix
library is copied over; `tsc` on the aria tree lists the files to port.

- Records the shadcn CLI version and the `react-aria-components` version the parts pin
- Does NOT edit a part file: parts are shadcn's, taken as installed (a needed change to a
  part is a halt item, like the Base UI tree)

#### 1.6.3 Ported files

The files in `aria-diff.json`, each ported to the React Aria part's shape while keeping the
radix twin's structure, `Subscribe` reads, handlers, class names and `data-slot`s:

- Menus (`ST_ColumnActionMenu`, `ST_RowActionMenu`, `ST_CellActionMenu`,
  `ST_FilterOptionMenu`, `ST_ShowHideColumnsMenu`, `ST_ActionMenuItem`): `DropdownMenuTrigger`
  wraps trigger and menu; `onAction` or `onPress` instead of `onSelect`; submenus through the
  aria `SubmenuTrigger`
- Inputs (`ST_FilterCheckbox`, `ST_SelectCheckbox`, `ST_FilterRangeSlider`,
  `ST_FilterTextField`, `ST_GlobalFilterTextField`, `ST_EditCellTextField`): `isSelected`,
  `onChange(isSelected)`, `isIndeterminate`, slider `value`/`onChange` arrays, `TextField`
- Modals (`ST_EditRowModal`): `DialogTrigger`, `Modal`, `Dialog` with render-prop `close`
- Tooltip (`ST_Tooltip`): `TooltipTrigger` wrapping the trigger
- Toolbar (`ST_TablePagination` select, `ST_ToolbarAlertBanner`, `ST_LinearProgressBar`),
  `ST_TableDetailPanel`, `ST_TableHeadCellFilterContainer`, `ST_TableHeadCellFilterLabel`,
  `ShadcnTable.tsx` (the tooltip provider line), `shared/utils/style.utils.ts` if the part
  class names differ
- Does NOT change behaviour: the same stories and plays must pass

**Stays unchanged:** every file not in `aria-diff.json`.

### 1.7 Dependencies and env

`react-aria-components` at the version shadcn's aria parts pin; `ST_BASE=aria` for the aria
gates (part 02 wires the scripts; this part adds the `tsc:aria`, `test:aria`,
`storybook:aria`, `storybook:build:aria` scripts and `tsconfig.aria.json` it needs to gate
itself).

## 2. Instructions for AI

Tracker `01-tracker.md`. Worktree `shadcn-react-table.worktrees/07` on branch
`v0.5/aria-tree` from `claude/review`. Phase 00 one agent; the port split by cluster across
worktrees `08`, `09` and `changelog` (menus; inputs and tooltip; modals, toolbar, rest),
the lead merges; one reviewer per cluster who diffs each ported file against its radix
twin; one verifier who runs the aria gates and every story on the aria Storybook through
Playwright. Halt items per the index.

### 2.1 Phases

#### 2.1.1 Phase 00: Discovery

- 1.6.2; `aria-diff.json` seeded; tracker report; `tsc:aria` red with exactly the listed files

#### 2.1.2 Phase 01: Port

- 1.6.3 per cluster; `tsc:aria` green; `check:bases` reports only the listed files

#### 2.1.3 Final phase: Gates

- 2.2; merge into `claude/review`

### 2.2 Gates (aria)

- `pnpm --filter shadcn-table tsc:aria`, `lint`, `test:aria`, `storybook:build:aria`,
  `node scripts/check-storybook.mjs` on the aria output
- `pnpm check:bases` (n-tree, from part 02 once merged; until then the script run with the
  aria pair by hand) reports zero problems
- `grep -rn "table\.state" packages/shadcn-table/registry/aria/components/ui/shadcn-table/components` empty
- `pnpm registry:build` emits every aria item
