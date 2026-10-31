# 10: bug fixes and parts as designed

## 1. Architecture

### 1.1 Overview

The next-app header demo and a shadcn part usage audit found functional bugs (range filter never applies, sort clear snaps back, Base UI and React Aria Collapsible width reveals break, radix menus drop focus) and places where the library works against its primitives (hidden menu triggers without opener state, nested controls inside menu items, hand-rolled focus, props restated or misused) (F27) (F28) (F31) (F37) (F38) (F39). Decisions D21 to D29 fix them inside the current architecture: the anchor-span pattern stays (D26), Collapsible stays (D25), no public prop, type, registry item or layout changes except the additions D29 names. F61 (row action menu stays open on a second opener click) is fixed inside the same hook (D26 addendum). Stream S2 (index, Run plan) (D34): branch `v0.7/bug-fixes`, worktree `shadcn-react-table.worktrees/bug-fixes`, cut from `claude/review` when S1 merges: `hooks/useST_ComposedRef.ts` (foundation, D5) and `hooks/useST_MenuAnchor.ts` (foundation, D26 interface; S1 set C wired the five menus) exist, `check:tailwind` (foundation, D16) runs. One builder pass over 1.6.2 to 1.6.8, the reviewer checklists merged into one stream review, gates once.

### 1.2 Goals

- Typing a Min value in a range filter filters rows; number columns reject letters (D21) (F27)
- Clearing sort with the default `enableGlobalFilterRankedResults` stays cleared (D22) (F28)
- A consumer `className` on `ST_TablePagination` changes the outer padding (D23) (F29)
- The search field and the four height panels open and close smoothly in every base, with the field focused on open and `inert` when closed (D25) (F31) (F50) (F51)
- Every menu opener announces `aria-haspopup` and `aria-expanded`; a second click on the opener closes its menu; Tab never lands on an anchor span; a menu follows a resize; focus returns to the opener in every base (D26) (F37) (F39) (F40) (F49) (F57) (F58) (F61)
- One `dir="rtl"` story under `stories/fixed-bugs/` renders the table with `columnResizeDirection: 'rtl'` and a pinned column (D31 addendum)
- Column visibility toggles with Enter and Space in the show-hide menu; pin and drag are reachable by Tab (D27) (F38) (F48)
- The D28 list is applied in every base; F45 stays as is (D28)
- `ButtonProps` accepts the shadcn Button props; `useST_FullScreenContainer` is exported (D29) (F32)
- All library gates green per base; one Storybook play test per user-reachable fix
- Done when: the Storybook play tests of 1.6.8 (range filter filters rows, sort clear stays cleared, search field open and close, menu opener `aria-expanded`, second-click close and focus return, show-hide Enter and Space) pass in `test:base`, `test:radix`, `test:aria`; judged: the search reveal per base against the foundation baseline `reference/10-*` (five-frame sequences of the next-app `collapsible-search-demo.tsx` at the route and port in `reference/10-route.md`), three judges on "no jump, field focused, closed state hidden" (P6)

### 1.3 Current structure

```
packages/shadcn-table/registry/<base>/components/ui/shadcn-table/
├── components/inputs/ST_FilterTextField.tsx        ← range updaters mutate `old` (211-214, 265-269), isMounted seed (292-308), untyped range input (625), unnamed chip button (365-369)
├── components/inputs/ST_GlobalFilterTextField.tsx  ← Collapsible width keyframes on a measured var (104-108)
├── components/inputs/ST_FilterRangeSlider.tsx       ← sliderProps.ref = node (145-147)
├── components/inputs/ST_EditCellTextField.tsx       ← FieldDescription and FieldError unlinked (83-88, 149-160)
├── components/toolbar/ST_TablePagination.tsx        ← className on the inner nav (244-246), py-3 on the outer div (156-160)
├── components/toolbar/ST_LinearProgressBar.tsx, ST_ToolbarAlertBanner.tsx, components/body/ST_TableDetailPanel.tsx, components/head/ST_TableHeadCellFilterContainer.tsx
│                                                    ← height keyframes; aria collapse snaps; no overflow-hidden except DetailPanel
├── components/menus/*.tsx                           ← anchor span without opener state; base finalFocus focuses itself; radix stale anchorEl (ColumnAction, ShowHide); base and radix filter-mode second root menu
├── components/menus/ST_ShowHideColumnsMenuItems.tsx ← menuitem without select; Switch, pin, grab nested
├── components/menus/ST_ActionMenuItem.tsx           ← tabIndex={0} (base, radix); closeOnClick restated (base)
├── components/head/ST_TableHeadCellFilterLabel.tsx  ← popover opened from anchorEl state; base rebuilds Portal, Positioner, Popup
├── components/head/ST_TableHeadCellResizeHandle.tsx ← aria data-[orientation=vertical] never matches (105-108)
├── components/table/ST_TableContainer.tsx           ← modal and cell menu mounted only while open (179-180)
├── components/table/ST_TableLayout.tsx              ← Esc handler (88) and full-screen classes (22, 92-95) only here
├── components/modals/ST_EditRowModal.tsx            ← aria-describedby={undefined} (base, 101)
├── hooks/useST_Effects.ts                           ← ranked results effect (129-151)
├── hooks/useST_MenuAnchor.ts                        ← foundation, D26 interface, wired by S1 set C
└── types.ts                                         ← ButtonProps = ComponentPropsWithRef<'button'> (82; aria 93)
```

### 1.4 Target structure

```
packages/shadcn-table/registry/<base>/components/ui/shadcn-table/
├── hooks/useST_FullScreenContainer.ts   ← new, exported from index.ts (D29)
├── hooks/useST_MenuAnchor.ts            ← behaviour only: re-measure listeners, second-click toggle, ref-based focus return (D26)
├── components/menus/*.tsx               ← spread openerProps and spanProps; base and radix filter mode as DropdownMenuSub
├── components/menus/ST_ShowHideColumnsMenuItems.tsx ← DropdownMenuCheckboxItem rows (base, radix), selection-mode section (aria), sibling control group
├── components/inputs/ST_GlobalFilterTextField.tsx   ← kept-mounted panel, width token, transition classes, own focus and Escape
├── components/table/ST_TableLayout.tsx  ← uses useST_FullScreenContainer
├── shared/utils/style.utils.ts          ← width keyframes gone; height keyframes radix only
└── types.ts                             ← ButtonProps from the Button part
packages/shadcn-table/stories/
├── features/Filtering.stories.tsx       ← range play test (D21)
├── features/Sorting.stories.tsx         ← clear-sort play test (D22)
├── features/ColumnHiding.stories.tsx    ← keyboard toggle play test (D27)
└── fixed-bugs/*.stories.tsx             ← search field, menus, filter popover, modal exit, headless Esc, RTL
```

### 1.5 Flow: none

### 1.6 Components

#### 1.6.1 Data artifacts

- `CHANGELOG.md` `## Unreleased` `### Part 10` block: one `Fixed` line each for the range filter (D21), sort clear (D22), pagination `className` (D23), search field and panel animations in every base (D25), menu opener state, anchor spans, second-click close and focus return (D26) (F61), keyboard column visibility (D27), the D28 list in one line naming the parts touched, and the aria resize handle width (D28)
- `Added`: "`useST_FullScreenContainer(table)` for headless layouts; the toolbar buttons accept the shadcn Button `size` and `variant` props by type." (D29)
- `registry.json` catalogs regenerated (`registry:build`) for the new hook file; item names and hosted paths unchanged; docs app copies re-installed per base
- `base-diff.json`, `aria-diff.json`: no new entries; the hook stays byte-identical across bases and the per-base lines of the search field and the menus sit in files already listed; `check:bases` stays green
- `trackers/10-tracker.md` `## Attention`: the TanStack store issue draft (1.6.2); the owner files it

#### 1.6.2 Range filter and ranked results

`ST_FilterTextField` range updaters and the ranked results effect (D21) (D22) (F27) (F28).

- Both range updaters build `const next = Array.isArray(old) ? [...old] : ['', '']`, set `next[rangeFilterIndex]`, return `next`
- The mount effect drops the `isMounted` ref pattern; no seeding write on strict-mode re-run (D8)
- Range inputs on number columns render `type="number"` `inputMode="decimal"`; text columns keep the text input. Number column: a new helper `isNumberColumn(column, table)` in `shared/utils/column.utils.ts` returns true when `filterVariant === 'range'` and the first defined value of `row.getValue(column.id)` over `table.getPreFilteredRowModel().rows` is `typeof 'number'`. No such helper exists today (`ST_FilterTextField.tsx` reads only `filterVariant` at 92)
- `useST_Effects.ts` ranked results effect keeps `previousGlobalFilter` in a ref, returns early when `Object.is(previous, next)`; everything else in the effect unchanged
- Does NOT change `appliedSort` handling, the range chip rendering, or the `filterFn` registry

**Operations:**

| Operation | Status | Notes |
| --- | --- | --- |
| range `onChange` updater (base 211-214, radix same, aria 222-224) | refactor | copy before write |
| `handleClear` updater (base 265-269, aria 286-288) | refactor | copy before write |
| mount effect (base 292-308, aria 317-331) | refactor | no `isMounted` ref, no seed |
| fallback range input (base 625, radix 609, aria 659) | refactor | `type="number"` `inputMode="decimal"` for number columns |
| `isNumberColumn` in `shared/utils/column.utils.ts` | new | range variant plus a number first value |
| ranked results effect (`useST_Effects.ts:129-151`) | refactor | previous-value guard |
| TanStack store issue for `atom.js:134` `undefined` comparison | new | the builder writes the issue draft (title, repro, expected, version) into `trackers/10-tracker.md` under `## Attention`; the owner files it; no code waits on it (D22) |

**Stays unchanged:** `ST_FilterRangeSlider` value flow, `rangeFilterIndex` prop, `enableGlobalFilterRankedResults` option and default.

#### 1.6.3 Pagination className and headless hook

- `ST_TablePagination` merges `className` onto the outer div (156-160) with `cn`; the inner `Pagination` nav keeps its fixed classes (D23) (F29)
- `types.ts` `ButtonProps = React.ComponentProps<typeof Button>` in every base, replacing `ComponentPropsWithRef<'button'>` (aria replaces its omit type the same way) (D29) (F32)
- `hooks/useST_FullScreenContainer.ts`: one copy per base, byte-identical, exported from `index.ts` (D29)
- `ST_TableLayout` calls the hook and spreads `containerProps` where it applies the Esc handler and the full-screen classes today (`ST_TableLayout.tsx:87-96`); the layout div gains `tabIndex={-1}` only while full screen (so the Esc handler can receive focus there), `undefined` otherwise, which is the only markup change

**Interfaces:**

```typescript
export interface ST_FullScreenContainer {
  readonly isFullScreen: boolean;
  /** Spread on the element that fills the screen: Esc handler, tabIndex while full screen, full-screen classes. */
  readonly containerProps: {
    readonly className: string;
    readonly onKeyDown: (event: KeyboardEvent<HTMLElement>) => void;
    /** `-1` while full screen, `undefined` otherwise. */
    readonly tabIndex: -1 | undefined;
  };
}

export const useST_FullScreenContainer: <TData extends ST_RowData>(
  table: ST_TableInstance<TData>,
) => ST_FullScreenContainer;
```

**Stays unchanged:** `ST_TableLayout` toolbars and container markup apart from the conditional `tabIndex`, the full-screen class list, `isFullScreen` state.

#### 1.6.4 Collapsible panels

`ST_GlobalFilterTextField` and the four height panels use each primitive's designed animation path with one mechanism (D25) (F31) (F50) (F51).

- Search field: panel stays mounted (`keepMounted` base, `forceMount` radix, default aria), `inert` while closed; root carries `--st-search-width: 14rem`, overridable through the field `className`; panel classes `overflow-hidden w-(--st-search-width) transition-[width,opacity] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none`, closed `w-12 opacity-0` under base `data-closed:`, radix `data-[state=closed]:`, aria `aria-hidden:`
- Field owns behavior: an effect on `showGlobalFilter` focuses the input after commit; Escape inside the field closes it and focuses the toggle button; `ST_ToggleGlobalFilterButton` loses its `queueMicrotask` focus
- Aria panel gets `role="none"` (no trigger inside the Collapsible)
- Height panels (`ST_LinearProgressBar`, `ST_ToolbarAlertBanner`, `ST_TableDetailPanel`, `ST_TableHeadCellFilterContainer`): base and aria transition `height` on the primitive's height variable with `data-starting-style` and `data-ending-style` (base) or the `aria-hidden` sequence (aria); radix keeps the tw-animate keyframes; every panel has `overflow-hidden`
- `style.utils.ts`: width keyframes removed in every base; height keyframes stay only in radix
- Does NOT change the toggle button's atom write, the `showGlobalFilter` state, or the Collapsible parts

**Operations:**

| Operation | Status | Notes |
| --- | --- | --- |
| `ST_GlobalFilterTextField` panel (base 104-108, radix 108, aria 108-112) | refactor | token, transition, kept mounted, `inert` |
| field focus effect and Escape handler | new | inside the field |
| `ST_ToggleGlobalFilterButton` `queueMicrotask` (24) | refactor | deleted |
| four height panels | refactor | transitions in base and aria, `overflow-hidden` everywhere |
| `stCollapsibleKeyframes` width pair (base and aria 40-60) | refactor | deleted |
| animation comments (base 103, aria 106-107) | refactor | deleted (D18) |

**Stays unchanged:** `collapsible` registry dependency, `ST_TopToolbar` placement of the field, the radix height keyframes.

#### 1.6.5 Menu anchor hook

`useST_MenuAnchor` exists from the foundation with the D26 interface below (index, Run plan); S1 set C wired the five menus to it. This part adds behaviour only: the re-measure listeners, the second-click toggle (F61), the ref-based focus return in every base, the filter-mode submenu; and the openers spread `openerProps` (F37) (F39) (F40) (F49) (F57) (F58) (F61).

- `openerProps` (`aria-haspopup="menu"`, `aria-expanded`, `onClick` toggle) for the opener button; `ST_ShowHideColumnsButton`, `ST_TableHeadCellColumnActionsButton`, `ST_ToggleRowActionMenuButton` and the filter text field adornment spread them; the cell `td` gets none
- Second click (F61, D26 addendum): the hook's `toggle(anchor)` closes the menu when it is open from that same anchor and opens it otherwise; the opener handlers call `toggle` instead of setting the anchor unconditionally, so the primitive's outside-press close and the opener's click no longer re-open the menu
- `spanProps` for the span: `aria-hidden`, `tabIndex={-1}`, `inert`; base passes `tabIndex={-1}` through `render` because `nativeButton={false}` adds a Tab stop; aria drops `role="button"`
- While open, re-measures `rect` from the anchor element on `resize` and capture-phase `scroll` (listeners added on open, removed on close)
- Keeps the anchor in a ref for focus return; `focusAnchor` reads the ref, never cleared state; base `finalFocus` returns that element instead of focusing, radix `onCloseAutoFocus` focuses it, aria relies on the primitive
- Base and radix `ST_ColumnActionMenu` filter-mode item becomes `DropdownMenuSub` with `DropdownMenuSubTrigger` and `DropdownMenuSubContent` from the stock part, as aria does at 259; `ST_FilterOptionMenu` keeps its `anchorEl` mode for `ST_FilterTextField` and `ST_GlobalFilterTextField`
- Does NOT move any menu onto a primitive trigger; does NOT change `anchorEl` and `setAnchorEl` props, `actionCell`, `closeMenu` render props, or the MRT cell offset

**Interfaces (the foundation hook, D26 shape):**

```typescript
export interface ST_MenuAnchorOptions {
  /** The element the menu opens from; `null` while closed. */
  anchorEl: HTMLElement | null;
  /** Sets or clears the anchor; the hook calls it on open, close and toggle. */
  setAnchorEl: (anchor: HTMLElement | null) => void;
}

export interface ST_MenuAnchor {
  /** Menu root `onOpenChange`: clears the anchor on close. */
  readonly onOpenChange: (open: boolean) => void;
  /** Opener click handler: closes when open from this anchor, opens otherwise (F61). */
  readonly toggle: (anchor: HTMLElement) => void;
  /** The anchor's box this render, re-measured on resize and scroll while open; `undefined` while closed. */
  readonly rect: DOMRect | undefined;
  /** Spread on the visible opener: aria-haspopup, aria-expanded, onClick toggle. */
  readonly openerProps: { 'aria-haspopup': 'menu'; 'aria-expanded': boolean; onClick: (event: MouseEvent<HTMLElement>) => void };
  /** Spread on the invisible trigger span: fixed box over the anchor, hidden from the tree. */
  readonly spanProps: { style: CSSProperties; 'aria-hidden': true; tabIndex: -1; inert: true };
  /** Focuses the last anchor the menu opened from, read through a ref. */
  readonly focusAnchor: () => void;
}

export const useST_MenuAnchor: (options: ST_MenuAnchorOptions) => ST_MenuAnchor;
```

**Operations:**

| Operation | Status | Notes |
| --- | --- | --- |
| `openerProps`, `spanProps` spread in the openers and menus | refactor | the hook already returns them; the openers and the filter field adornment spread them here |
| `toggle` on every opener handler (`ST_ShowHideColumnsButton:24`, `ST_TableHeadCellColumnActionsButton:54`, `ST_ToggleRowActionMenuButton:48-52`, the filter adornment, the cell `onMouseUpCapture`) | refactor | replaces the unconditional `setAnchorEl(element)` (F61) |
| resize and scroll re-measure | new | hook, while open |
| `focusAnchor` via ref | refactor | hook; base `finalFocus` returns the element |
| radix `onCloseAutoFocus` in `ST_ColumnActionMenu` (174-177), `ST_ShowHideColumnsMenu` (129-132) | refactor | `focusAnchor()` from the ref |
| aria span `role="button"` (`ST_RowActionMenu` 80-83, `ST_CellActionMenu` 107-110) | refactor | removed |
| base and radix filter-mode second root menu (`ST_ColumnActionMenu` base 138, 281, 289; radix 133, 265, 273) | refactor | `DropdownMenuSub` |
| `ST_ActionMenuItem` nested `onMouseEnter` button (base 57-62, radix 53-58) | refactor | removed with the submenu change |

**Stays unchanged:** menu items, placement props, `handlePinColumn`, `ST_CellActionMenu` right-button guard and `editingCell` focus condition.

#### 1.6.6 Show-hide column rows

- Base and radix: each row in `ST_ShowHideColumnsMenuItems` is a `DropdownMenuCheckboxItem` (stock part): `checked` is `column.getIsVisible()`, select toggles visibility, so Enter and Space work (D27) (F38)
- Aria has no `DropdownMenuCheckboxItem` (`registry/aria/components/ui/dropdown-menu.tsx:100-140` styles `DropdownMenuItem` by the menu's `selectionMode`): the column rows sit in one `DropdownMenuGroup` (React Aria `MenuSection`) with `selectionMode="multiple"`, `selectedKeys` the visible column ids, `onSelectionChange` toggling visibility, one `DropdownMenuItem` per column (D27 addendum)
- Pin buttons and the drag handle move to a sibling group in the same row, outside the menuitem, reachable by Tab
- Aria: the switch and its wrapping `Label` go; the item carries the column label (F48)
- Does NOT change column visibility, pinning or reordering behavior, or the menu's header actions

**Operations:**

| Operation | Status | Notes |
| --- | --- | --- |
| row (base 114, 159; radix 114, 157) | refactor | `DropdownMenuCheckboxItem` plus control group |
| row (aria 117, 166) | refactor | `DropdownMenuItem` inside the `selectionMode="multiple"` group plus control group |
| aria `Label` wrapper (161) | refactor | removed |

#### 1.6.7 Parts as designed, remainder

One row per D28 item; every base unless noted.

| Site | Status | Change |
| --- | --- | --- |
| aria `ST_Tooltip` trigger wrappers (`ST_TablePagination` 297, 312, 326, 341; `ST_SelectCheckbox` 170; `ST_FilterTextField` 361, 378; `ST_TableHeadCellSortLabel` 87; `ST_ShowHideColumnsMenuItems` 163; `ST_FilterCheckbox` 87) | refactor | the control is the trigger; wrappers removed; disabled controls show no tooltip (F41) |
| `ST_TableHeadCellFilterLabel` popover (base 131-133, 158-189; radix 161-176) | refactor | `PopoverTrigger` on the filter button, stock `PopoverContent`; base hand-built Portal, Positioner, Popup removed (F42) |
| aria `ST_TableHeadCellFilterLabel` popover (158-175) | refactor | the aria part exports `Popover`, `PopoverTrigger`, `PopoverHeader`, `PopoverTitle`, `PopoverDescription` and no `PopoverContent`: `PopoverTrigger` wraps the filter button, `Popover` is the content; stable ref (F42) (D28 addendum) |
| `queueMicrotask` focus (`ST_TableHeadCellFilterLabel` base 137-140; `ST_ColumnActionMenu` base 127, radix 122, aria 120) | refactor | `initialFocus` base, `onOpenAutoFocus` radix, `autoFocus` aria; close-focus hook for "filter by column" (F43) |
| `ST_ActionMenuItem` `tabIndex={0}` (base 40, radix 40) | refactor | removed (F44) |
| `ST_EditCellTextField` helper and error (83-88, 149-160) | refactor | ids wired into `aria-describedby` on the input (F46) |
| filter chip clear button (base 365-369, radix 365-369, aria 389-393) | refactor | `aria-label` from `localization.clearFilter` (F47) |
| aria `ST_TableHeadCellResizeHandle` (105-108) | refactor | `aria-[orientation=vertical]:h-6` `aria-[orientation=vertical]:w-1` (F52) |
| `ST_TableContainer` modal and cell menu (179-180) | refactor | always mounted, `open` toggled (F53) |
| `ST_FilterRangeSlider` ref (base 145-147, radix 135-137) | refactor | `useST_ComposedRef` (F54) (D5) |
| base `ST_EditRowModal` `aria-describedby={undefined}` (101) | refactor | removed (F55) |
| base `ST_ActionMenuItem` `closeOnClick` and comment (41-44) | refactor | removed (F56) |
| base `ST_ToolbarAlertBanner` chip spread (131-141) | refactor | spread before `render`, chain `onClick`, matching radix and aria (F59) |
| aria `ST_SelectCheckbox` title (163-168) | refactor | honours `checkboxProps.title` (F60) |

**Stays unchanged:** `ST_SelectCheckbox` per-row `RadioGroup` (F45, open by ruling), every public prop and type, part files under `components/ui/`.

#### 1.6.8 Stories and play tests

New or extended stories under `packages/shadcn-table/stories/`, one per user-reachable fix, run by `test:<base>`.

| Story | Asserts |
| --- | --- |
| `features/Filtering.stories.tsx` range | type Min, filtered row count; letters rejected on a number column (D21) |
| `features/Sorting.stories.tsx` clear sort | sort, clear, no sort indicator with default ranked results (D22) |
| `fixed-bugs/SearchField.stories.tsx` | open: input focused, panel wider than `3rem`; close: panel `inert`; Escape returns focus to the toggle (D25) |
| `fixed-bugs/MenuOpeners.stories.tsx` | opener `aria-expanded` follows open state; a second click on the opener closes the menu and `aria-expanded` reads `false` (F61); Tab never lands on the span; menu moves after a resize; focus returns to the opener (D26) |
| `fixed-bugs/RTL.stories.tsx` | table inside `<div dir="rtl">` with `columnResizeDirection: 'rtl'`, `enableColumnPinning` and one column pinned `left`; the resize handle's box sits at the header cell's inline-start edge and the pinned cell has `inset-inline-start` set (D31 addendum) |
| `features/ColumnHiding.stories.tsx` keyboard | arrow to a row, Space hides the column; Tab reaches the pin buttons (D27) |
| `fixed-bugs/FilterPopover.stories.tsx` | filter button `aria-expanded`; popover opens with the input focused; chip clear button has a name (D28) |
| `fixed-bugs/ModalExit.stories.tsx` | edit modal close plays its exit state before unmount (D28) |
| `fixed-bugs/HeadlessFullScreen.stories.tsx` | headless wrapper with `containerProps`: Esc exits full screen (D29) |

### 1.7 Dependencies and env: none new

## 2. Instructions for AI

Halt conditions of the index apply: no edit to a part file under `components/ui/`, no registry item name or hosted path change, no public option or type removed, no `eslint-disable` without a reason. D26 keeps the anchor pattern; D5 and D20 stand. Every change lands in base, radix and aria in the same pass. Stream S2: one builder (opus) end to end, one fable review on the whole diff with the checklists below merged, round 2 on the incremental diff, verify, merge (index, Run plan).

### 2.1 Phases

#### 2.1.1 Phase 1: Reproduce, then one pass over 1.6.2 to 1.6.8

Lane: agent

- Step 0: reproduce F27 and F28 on next-app `/header-demo` (dev server on the builder's own port, P5): type a Min value on a number column and see no row filtered; sort a column, then Clear sort and see the sort snap back; record both results with the route and the steps in `../trackers/10-tracker.md` (P6). Reproduce F61 the same way: open the row action menu, click its opener again, the menu stays open
- 1.6.2 and 1.6.3 in every base; `index.ts` export of the hook; the TanStack store issue draft into `../trackers/10-tracker.md` under `## Attention`
- 1.6.4 in every base
- 1.6.5 (behaviour additions, `openerProps` and `spanProps` spread, `toggle` on every opener, F61) and 1.6.6 in every base
- 1.6.7 rows in every base
- Stories of 1.6.8: range, clear sort, headless full screen, search field, menu openers with the second-click assertion, keyboard column hiding, filter popover, modal exit, RTL
- Reviewer checklist (one stream review): D21 copy before write, no seed, number rule; D22 previous-value guard only; D23 and D29 type and hook, no other public change, the conditional `tabIndex`; D25 one mechanism per primitive, `inert` when closed; D26 anchor pattern kept, public props intact, `toggle` on every opener, stock `DropdownMenuSub`; D27 stock `DropdownMenuCheckboxItem` in base and radix, the aria selection-mode group; every D28 row against its primitive (trigger, focus option, spread order, selector); no part file under `components/ui/` changed
- Gates per phase: `tsc:radix`, `tsc:baseui`, `tsc:aria`, `eslint --max-warnings 0` on the changed files

#### 2.1.2 Final phase: Gates once

Lane: agent

- `pnpm registry:build`; `pnpm --filter shadcn-table-docs lib:install base`, `radix`, `aria`; `check:bases` (no new `base-diff.json` or `aria-diff.json` entries); CHANGELOG lines from 1.6.1 in the `### Part 10` block
- `grep -n "queueMicrotask"` over the files this part changes (`ST_ToggleGlobalFilterButton.tsx`, `ST_TableHeadCellFilterLabel.tsx`, `ST_ColumnActionMenu.tsx` in every base): empty; `cell.utils.ts:54` keeps its `queueMicrotask`, no row covers it
- Judged: five-frame capture of the search reveal per base next to `reference/10-*`, three judges (index, Done when)
- `pnpm format`; merge per the index Streams rule
- Gates: 2.2, recorded in `../trackers/10-tracker.md`

### 2.2 Gates

- `pnpm --filter shadcn-table tsc:radix`, `tsc:baseui`, `tsc:aria`, `lint` (max warnings 0), `check:tailwind` green
- `pnpm --filter shadcn-table test:base`, `test:radix`, `test:aria` green, including the nine stories in 1.6.8
- `pnpm check:bases` green with no new diff entries; `pnpm registry:build` changes only file contents, no item names or paths
- `pnpm --filter shadcn-table-docs types:check`, `lint`, `build` green after `lib:install`
- `pr.yml` green
