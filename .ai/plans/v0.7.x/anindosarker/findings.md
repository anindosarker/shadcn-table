# v0.7.x findings

## Round 1: discussion, 2026-10-29

Sweep of the `base` install in test-projects/next-app (Next 16.4.2, React 19.3.1, eslint-config-next 16.4.2 with eslint-plugin-react-hooks 7.1.1, Tailwind 4.3.3). Paths are relative to `components/ui/shadcn-table/`. The monorepo `base` copy gives the same ESLint hit list as the install; `radix` and `aria` were linted with the consumer config for comparison.

Shared root cause for all `react-hooks/*` compiler rules (F1 to F6, F10): the library lints with eslint-plugin-react-hooks 5.2.0 `recommended-latest`, which holds only `rules-of-hooks` and `exhaustive-deps`. Plugin 7.x `recommended-latest` adds the React Compiler rules (`refs`, `immutability`, `set-state-in-effect`, `use-memo`, `preserve-manual-memoization`, `incompatible-library` and more), and Next 16 turns them on by default. The folded-core block (hooks/, shared/fns, shared/utils, icons.ts, types.ts) also switches off `rules-of-hooks`, `exhaustive-deps`, `no-explicit-any`, `no-unused-expressions` and relaxes `no-unused-vars`; a consumer config carries none of those exemptions.

### F1 Hooks called after an early return or in a default parameter

- `hooks/useST_ColumnVirtualizer.ts:32`: `rules-of-hooks` error; the hook returns `undefined` when `enableColumnVirtualization` is false (line 29) and only then calls `useSelector`, `useMemo`, `useVirtualizer`, `useCallback`, so the hook count changes if the flag flips at runtime.
- Hits (14): `hooks/useST_ColumnVirtualizer.ts:32,33,34,45,64,72,78`; `hooks/useST_RowVirtualizer.ts:35,36,37,44,57,72` (same early return on `enableRowVirtualization`, line 33); `hooks/useST_TableOptions.ts:77`.
- `useST_TableOptions.ts:77` pattern: `id = useId(),` as a destructuring default, so `useId` runs only when the caller omits `id`.
- Root cause: rule switched off for the folded core in the library config.
- Bases: identical in base, radix, aria.
- Likely fix direction: call the hooks unconditionally and gate on the flag inside, or split into an always-mounted child; call `useId()` before destructuring.

### F2 Refs read or written during render

- `components/table/ST_TableLayout.tsx:54`: `refs` error; `userRef.current = layoutDivProps.ref;` writes a ref in the render body, which React 19 treats as unsafe under concurrent rendering and the Compiler refuses to optimize.
- `userRef.current = <props>.ref` pattern (6): `components/footer/ST_TableFooter.tsx:50`, `components/head/ST_TableHead.tsx:54`, `components/table/ST_TableContainer.tsx:65`, `components/table/ST_TableLayout.tsx:54`, `components/toolbar/ST_BottomToolbar.tsx:61`, `components/toolbar/ST_TopToolbar.tsx:57`.
- `if (anchorEl) anchorRef.current = anchorEl;` pattern (4): `components/menus/ST_ColumnActionMenu.tsx:159`, `ST_FilterOptionMenu.tsx:239`, `ST_RowActionMenu.tsx:53`, `ST_ShowHideColumnsMenu.tsx:109`.
- "latest value" ref pattern (2): `hooks/useST_Effects.ts:30` (`latestTable.current = table`), `hooks/useST_Effects.ts:103` (`latestCheckPageIndex.current = checkPageIndex`).
- `hooks/useST_TableInstance.ts` (39 hits, lines 129 to 221): `tableRef.current?.store.state` is read at 132 into `statefulTableOptions.state`, so every value derived from it is flagged: the column build 141 to 175, `columnDefsRef.current` read at 144 and written after `prepareColumns`, the skeleton `data` memo 181 to 188, the `useAppTable` options 211 to 215; `tableRef.current = table` is written at 221.
- Count: 51 in base.
- Bases: radix 49 (no hit in `ST_ColumnActionMenu`, `ST_ShowHideColumnsMenu`; `FilterOption`/`RowAction` at 236/50); aria 49 (no menu `anchorRef` hits; adds `ST_Tooltip.tsx:69` `childRef.current = trigger.props.ref` and `ST_Tooltip.tsx:94`).
- Root cause: `refs` rule absent in plugin 5.2.0.
- Likely fix direction: move ref syncing into `useLayoutEffect`/`useEffectEvent`, or use React 19 ref callbacks and `useState` for anchors; restructure the instance hook so it does not read the previous table during render.

### F3 Mutating props, hook results or destructured parameters

- `hooks/useST_TableOptions.ts:98`: `immutability` error; `icons = useMemo(...)` reassigns a destructured parameter, which the Compiler treats as a frozen input.
- Reassigned destructured params (6): `hooks/useST_TableOptions.ts:98` (icons), `99` (localization), `106` (defaultColumn), `110` (defaultDisplayColumn), `118` x2 (`[enableColumnVirtualization, enableRowVirtualization] = useMemo(...)`).
- Mutating a value inside `useMemo` that comes from props (4): `hooks/useST_TableInstance.ts:87,104,113,117` (`initState.columnFilterFns = ...` etc. on `definedTableOptions.initialState`).
- Mutating table, row or ref objects from props (4): `components/body/ST_TableBodyCell.tsx:143` (`table.refs.actionCellRef.current = e.currentTarget`), `components/buttons/ST_EditActionButtons.tsx:50` (`row._valuesCache = {}`), `components/inputs/ST_EditCellTextField.tsx:101` (`row._valuesCache[column.id] = newValue`), `components/inputs/ST_FilterTextField.tsx:384` (`filterInputRefs.current![...] = `).
- Count: 14 in base; radix 14 (same); aria 16 (lines shift, adds `ST_FilterTextField.tsx:477` `comboboxAnchor.current =` and 482).
- Root cause: rule absent in plugin 5.2.0; `initialState` mutation is inherited from MRT.
- Likely fix direction: new local names instead of reassigning params; copy `initialState` before writing; ref writes through `useRef` values owned by the component.

### F4 setState called synchronously inside an effect

- `components/body/ST_TableBodyCell.tsx:95`: `set-state-in-effect` error; `setSkeletonWidth(...)` runs directly in `useEffect`, forcing a second render on every skeleton cell mount.
- Hits (4): `components/body/ST_TableBodyCell.tsx:95`, `components/inputs/ST_FilterRangeSlider.tsx:104` (`setFilterValues([min, max])`), `components/inputs/ST_FilterTextField.tsx:298` and `components/inputs/ST_GlobalFilterTextField.tsx:91` (`handleClear()` which sets state).
- Bases: same 4 in radix and aria (line numbers shift: radix slider 99, aria 321 and 94).
- Root cause: rule absent in plugin 5.2.0.
- Likely fix direction: derive during render (lazy `useState` initializer for skeleton width, "reset state on prop change" pattern for filters).

### F5 useMemo and useCallback shapes the Compiler cannot analyse

- `components/inputs/ST_FilterTextField.tsx:207`: `use-memo` error; `useCallback(debounce(...), [])` passes a call result, not an inline function.
- Same `useCallback(debounce(...))` pattern: `components/inputs/ST_GlobalFilterTextField.tsx:65`.
- Call expressions in the dependency array (5): `components/menus/ST_ShowHideColumnsMenu.tsx:81,82,83,84` (`getAllColumns()`, `getCenterLeafColumns()`, `getStartLeafColumns()`, `getEndLeafColumns()`), `hooks/useST_Rows.ts:40` (`getRowModel().rows`).
- Count: 7; same in radix and aria (aria lines 217 and 66).
- Root cause: rule absent in plugin 5.2.0; existing `eslint-disable exhaustive-deps` comments do not silence it.
- Likely fix direction: `useMemo(() => debounce(...), [])`; hoist the getter results into locals before the memo.

### F6 Manual memoization the Compiler cannot preserve

- `hooks/useST_TableOptions.ts:98`: `preserve-manual-memoization` error ("Compilation Skipped"); the reassigned-param memos of F3 make the Compiler skip the whole `useST_TableOptions` hook.
- Hits (4): `hooks/useST_TableOptions.ts:98,99,106,110`.
- Same in all three bases; disappears with the F3 fix.

### F7 `any` in the public types and core helpers

- `types.ts:152`: `@typescript-eslint/no-explicit-any` error; `value: any;` in an exported type shows red in every consumer editor that uses `next/typescript`.
- Hits (43): `shared/fns/filterFns.ts` 18 (30, 44, 58, 72, 82, 92, 106, 117, 131, 142, 149, 154, 157, 167, 172, 175, 183, 191), `types.ts` 8 (152, 160, 463, 519, 543 x2, 617), `shared/utils/tanstack.helpers.ts` 5 (22, 23, 35, 55, 66), `shared/utils/utils.ts` 2 (47 x2), `shared/fns/sortFns.ts` 2 (30, 31), `shared/utils/cell.utils.ts` 2 (97, 105), `shared/utils/row.utils.ts` 2 (177, 178), `hooks/useST_ColumnVirtualizer.ts` 2 (98, 127), `hooks/useST_RowVirtualizer.ts:81`, `shared/utils/column.utils.ts:139`, `icons.ts:74`.
- Patterns: `fuzzy.autoRemove = (val: any) => !val`, `Record<..., any>`, `Renderable<any>`, `(...args: any[]) => any`, `as any` casts.
- Root cause: off for the folded core (MRT-verbatim); component files already carry per-line disables.
- Bases: 43 in each; aria `types.ts` lines shift by 16.
- Likely fix direction: `unknown` or real generics where public; per-line disable only where `any` is required for variance.

### F8 Deprecated TanStack and DOM APIs (editor strikethrough)

- `shared/fns/aggregationFns.ts:1`: `aggregationFns` from `@tanstack/react-table` is `@deprecated` in table-core 9.3.1, so the import and the spread at line 3 render struck through; the text names the replacement: "Import individual `aggregationFn_*` definitions instead for a smaller bundle".
- Method: TypeScript compiler API walk over every identifier in the library, aliases resolved through the react-table re-export, JSDoc `@deprecated` read from the declaration. The language service suggestion pass alone missed the re-exported registries.
- `filterFns` (2): `shared/fns/filterFns.ts:10,194`; replacement "Import individual `filterFn_*` functions"; the text adds that `filterFn: 'auto'` name resolution only finds functions you register.
- `sortFns` (3): `shared/fns/sortFns.ts:2,17,22`; replacement "Import individual `sortFn_*` functions", same `sortFn: 'auto'` caveat.
- `table.store` on `ReactTable` (44), from `@tanstack/react-table` `useTable.d.ts`: replacement "Prefer `table.state` for render reads, `table.atoms.<slice>.get()` for slice snapshots, or `table.Subscribe` / `useSelector(table.store, selector)`". The property itself is tagged, so even the recommended `useSelector(table.store, ...)` form strikes through.
- `source={table.store}` on `table.Subscribe` (30): `components/body/ST_TableBody.tsx:144`, `ST_TableBodyCell.tsx:192`, `ST_TableBodyCellValue.tsx:41`, `ST_TableBodyRow.tsx:118,165`, `ST_TableBodyRowPinButton.tsx:50`, `ST_TableDetailPanel.tsx:88`; `components/buttons/ST_EditActionButtons.tsx:91`, `ST_ExpandAllButton.tsx:74`, `ST_ExpandButton.tsx:75`, `ST_ToggleGlobalFilterButton.tsx:33`, `ST_ToggleRowActionMenuButton.tsx:66`; `components/footer/ST_TableFooter.tsx:79`, `ST_TableFooterCell.tsx:86`; `components/head/ST_TableHead.tsx:87`, `ST_TableHeadCell.tsx:148`, `ST_TableHeadCellResizeHandle.tsx:72`, `ST_TableHeadCellSortLabel.tsx:53`; `components/inputs/ST_EditCellTextField.tsx:140`, `ST_FilterCheckbox.tsx:83`, `ST_SelectCheckbox.tsx:163`; `components/menus/ST_ColumnActionMenu.tsx:207`, `ST_FilterOptionMenu.tsx:287`; `components/modals/ST_EditRowModal.tsx:61`; `components/table/ST_TableContainer.tsx:141`; `components/toolbar/ST_LinearProgressBar.tsx:81`, `ST_TablePagination.tsx:135`, `ST_ToolbarAlertBanner.tsx:91`, `ST_ToolbarDropZone.tsx:62`, `ST_TopToolbar.tsx:118`.
- `table.store.state` snapshot reads (12): `shared/utils/row.utils.ts:31,112,129`, `shared/utils/style.utils.ts:100`, `shared/utils/pagination.utils.ts:158`, `components/buttons/ST_EditActionButtons.tsx:42,54`, `components/inputs/ST_EditCellTextField.tsx:102`, `components/menus/ST_ShowHideColumnsMenu.tsx:168`, `hooks/useST_Effects.ts:74,87`, `hooks/useST_TableInstance.ts:132`.
- Other `table.store` uses (2): `hooks/useST_Effects.ts:114` (`table.store.subscribe(...)`), `hooks/useST_TableInstance.ts:225` (`useSelector(table.store, ...)`).
- `navigator.platform` (2), TypeScript lib.dom: `shared/utils/cell.utils.ts:15,16` (Windows and Mac shortcut detection); lib.dom names no replacement (`navigator.userAgentData.platform` is the web successor, Chromium only).
- Not counted: `querySelector`/`querySelectorAll` (6 sites) hit only a deprecated overload in lib.dom, which the chosen overload does not use, so no strikethrough.
- Nothing deprecated found from react, react-dom, `@tanstack/react-virtual`, `@tanstack/react-store` or the shadcn ui parts.
- Root cause: deprecations are TypeScript suggestions, not tsc errors or lint rules, so no gate catches them; the library repo also pins `@tanstack/react-table` 9.3.1 and shows the same strikethrough.
- Bases: same counts in base, radix, aria (grep: 30 `source={table.store}`, 2 `navigator.platform`, same three registry imports).
- Likely fix direction: register individual `*Fn_*` exports by name; replace `table.store` with `table.state`, `table.atoms.<slice>.get()` or `useSelector(table.atoms.<slice>)` per site; one small platform helper.

### F9 Missing or complex effect and memo dependencies

- `hooks/useST_Effects.ts:127`: `exhaustive-deps` warning; `useEffect(..., [])` reads `table` without listing it, a pattern repeated across the folded hooks.
- Hits (15): `hooks/useST_ColumnVirtualizer.ts:58,69,92`; `hooks/useST_Effects.ts:67,78,127,151,168,225`; `hooks/useST_Rows.ts:33,40`; `hooks/useST_TableInstance.ts:123,197`; `hooks/useST_TableOptions.ts:120`; `shared/utils/column.utils.ts:218`.
- Root cause: off for the folded core; component files already carry per-line disables.
- Bases: identical in all three.
- Likely fix direction: list stable deps (`table` is stable), or per-line disable with a reason where mount-only is intended.

### F10 TanStack Virtual flagged as Compiler-incompatible

- `hooks/useST_RowVirtualizer.ts:57`: `incompatible-library` warning; `useVirtualizer` returns mutable functions, so the Compiler skips memoizing this hook.
- Hits (2): `hooks/useST_RowVirtualizer.ts:57`, `hooks/useST_ColumnVirtualizer.ts:72`; same in all bases.
- Root cause: upstream library, rule absent in plugin 5.2.0.
- Likely fix direction: `"use no memo"` directive in the two hooks, or accept and disable the warning per line.

### F11 Unused `_`-prefixed variables

- `components/body/ST_TableDetailPanel.tsx:63`: `no-unused-vars` warning; `const { hover: _hover, ...tableRowProps }` relies on the library's `^_` ignore pattern, which `next/typescript` does not set.
- Hits (3): `components/body/ST_TableDetailPanel.tsx:63`, `shared/fns/filterFns.ts:180,188` (`_filterValue` parameter).
- Bases: same 3 everywhere (radix detail panel at 62).
- Likely fix direction: drop `_hover` via a typed omit helper; remove the unused trailing parameters.

### F12 Ternaries used as statements

- `shared/utils/cell.utils.ts:121`: `no-unused-expressions` warning; `cell.row.getIsPinned() ? cell.row.pin(false) : cell.row.pin(...)` is a bare expression statement.
- Hits (2): `shared/utils/cell.utils.ts:121`, `shared/utils/row.utils.ts:211` (`isAllMode ? table.toggleAllRowsSelected(checked) : ...`).
- Root cause: off for the folded core. Same in all bases.
- Likely fix direction: `if`/`else`.

### F13 Tailwind classes with a shorter canonical form

- `components/body/ST_TableBody.tsx:180`: Tailwind IntelliSense `suggestCanonicalClasses` warning; `min-h-[100px]` has the canonical form `min-h-25`, and 36 more candidates trip the same hint.
- Method: `__unstable__loadDesignSystem` (@tailwindcss/node 4.3.3) on app/globals.css, `canonicalizeCandidates([c], { rem: 16 })` per candidate; 825 valid candidates in 105 files.
- `z-[n]` to `z-n` (19): `z-[1]` 8 (`ST_TableBody.tsx:165,236`, `ST_TableFooter.tsx:25`, `ST_TableHeadCellSortLabel.tsx:115`, `ST_BottomToolbar.tsx:23`, `ST_TopToolbar.tsx:20`, `style.utils.ts:162,183`); `z-[2]` 7 (`ST_TableBodyRow.tsx:47`, `ST_TableHead.tsx:25`, `ST_TableHeadCell.tsx:282`, `ST_TablePagination.tsx:55`, `ST_ToolbarAlertBanner.tsx:25`, `ST_TopToolbar.tsx:76`, `style.utils.ts:160`); `z-[3]` 2 (`ST_TableLoadingOverlay.tsx:11`, `ST_ToolbarInternalButtons.tsx:16`); `z-[4]` 2 (`ST_TableHeadCellResizeHandle.tsx:108`, `ST_ToolbarDropZone.tsx:14`).
- Pixel or rem values on the spacing scale (11): `min-h-[100px]` to `min-h-25`; `min-w-[70px]` to `min-w-17.5` (`ST_ColumnPinningButtons.tsx:13`); `w-[70px]` to `w-17.5` (`ST_ShowHideColumnsMenuItems.tsx:151`); `min-w-[140px]`/`[120px]`/`[72px]`/`[96px]` to `min-w-35`/`30`/`18`/`24` (`ST_FilterTextField.tsx:438,440,442,444`); `mt-[3px]` to `mt-0.75` (`ST_FilterTextField.tsx:635`); `leading-[1.3125rem]` to `leading-5.25` (`ST_TableFooterCell.tsx:21`); `[&_svg]:size-[18px]` to `[&_svg]:size-4.5` (`ST_TableHeadCellSortLabel.tsx:17`); `m-[-0.25rem]` to `-m-1` (`ST_CopyButton.tsx:16`).
- Other (7): `rotate-[135deg]` to `rotate-135` (`ST_RowPinButton.tsx:67`); `-mx-[0.1rem]` to `mx-[-0.1rem]` (`ST_GrabHandleButton.tsx:10`); `data-[pinned=true]:before:-z-[1]` to `...:z-[-1]` (`style.utils.ts:74`); `focus-visible:outline-offset-[-2px]` to `focus-visible:-outline-offset-2` (`style.utils.ts:164`); `[&>[data-align=inline-start]]:py-0` and `inline-end` to `*:data-[align=...]:py-0` (`ST_FilterTextField.tsx:450`); `supports-[not_selector(::-webkit-scrollbar)]:[scrollbar-width:thin]` to `...:scrollbar-thin` (`ST_TableContainer.tsx:32`).
- Total: 37 occurrences, 22 distinct. About 72 other arbitrary values (`opacity-[0.97]`, `font-[inherit]`, `animate-[...]`, `[&>td]:after:*` etc.) have no canonical form and stay.
- Root cause: library repo has no Tailwind IntelliSense or lint gate on canonical forms.
- Bases: radix and aria also give 37 occurrences, 22 distinct (same scan run on their monorepo copies).
- Likely fix direction: apply the canonical forms in all three bases.

### Not problems, recorded for coverage

- `tsc --noEmit -p tsconfig.json`: exit 0, no diagnostics in library files.
- `next build`: exit 0, no warnings; app/ does not import the library, so the build did not compile it. Runtime warnings (hydration, keys, unknown props) need a page that renders `ShadcnTable` and a browser check.
- The install lags the monorepo `base` copy: `features/stRefsFeature.ts` lacks a two-line comment and `shared/locales/*` is absent. Lint counts match either way.

### F14 Shipped comments narrate MUI, MRT and Radix porting history

- `shared/utils/style.utils.ts:12-21`: ten-line block on MUI Collapse, tw-animate-css, the Radix variable and Base UI Collapsible.Panel internals above `stCollapsibleKeyframes` (owner's calibration example).
- `components/toolbar/ST_LinearProgressBar.tsx:27-30`: "MUI LinearProgress indeterminate keyframes (indeterminate1), ported so ... like MUI's".
- `ST_Checkbox.tsx:14`: JSDoc on an exported component says "MRT's indeterminate look".
- `shared/utils/utils.ts:41,66`: provenance lines "debounce from @mui/utils" and "createFilterOptions from @mui/material useAutocomplete"; `:46` "Corresponds to 10 frames at 60 Hz" is the copied MUI comment.
- `features/stConfigFeature.ts:48-50`: base file names "the Radix UI and Base UI declarations".
- `components/inputs/ST_FilterRangeSlider.tsx:78`: inherited MRT line "fix potential TanStack Table bugs" (see F16).
- TanStack version narration ("v9 copies / spreads / makes / computes"): `hooks/stTableHook.tsx:33`, `hooks/useST_TableInstance.ts:114`, `hooks/useST_TableOptions.ts:196`, `shared/utils/column.utils.ts:174`.
- No hits for upstream, fork, edition, forkedUi.
- Bases: radix repeats all of the above, plus Radix-named lines in ST_Checkbox:17, ST_Tooltip:28, ST_CellActionMenu:129, ST_SelectCheckbox:111, ST_EditCellTextField:210, ST_FilterCheckbox:19 (names Base UI inside radix), ST_FilterTextField:517,540, stTableHook:75. Aria repeats the MUI/MRT/v9 set and style.utils:12-18.
- Likely fix direction: drop provenance and MUI/MRT narration; keep a one-line contract where the code needs one.

### F15 Comments restate the code or repeat the same boilerplate per file

- `shared/utils/pagination.utils.ts:54,56,59,65,67,70`: six inline labels ("Natural start", "Less than endPages") inside two Math.min/max calls.
- One-line restatements: `components/modals/ST_EditRowModal.tsx:94` "//reset values cache", `components/buttons/ST_EditActionButtons.tsx:55`, `hooks/useST_Effects.ts:153`, `shared/utils/cell.utils.ts:165,179`.
- "table.options holds the part props tree-neutral (ST_NeutralPartPropTypes) ..." repeated 12x: ST_TableBodyRowGrabHandle:23, ST_CopyButton:32, ST_ExpandAllButton:42, ST_ExpandButton:47, ST_TableHeadCellColumnActionsButton:37, ST_TableHeadCellGrabHandle:32, ST_FilterCheckbox:50, ST_FilterRangeSlider:45, ST_SelectCheckbox:59, ST_EditRowModal:45, ST_TablePagination:74, ST_ToolbarAlertBanner:57.
- "..., so they are hook subscriptions" 12x: ST_ToolbarDropZone:35, ST_TableBodyCell:70, ST_TableBody:56, ST_TableHeadCellFilterLabel:55, ST_Table:42, ST_ShowHideColumnsMenu:52, ST_FilterTextField:93, ST_FilterRangeSlider:54, ST_GlobalFilterTextField:48, useST_RowVirtualizer:34, useST_ColumnVirtualizer:31, useST_Rows:17.
- "The user's ref is read through a ref so the callback keeps one identity ..." 6x (3 lines each): ST_TableHead:50, ST_TableFooter:46, ST_TableContainer:61, ST_TableLayout:50, ST_TopToolbar:53, ST_BottomToolbar:57.
- Menu boilerplate 5x each: "Base UI reads the popup's finalFocus ..." (ST_CellActionMenu:46, ST_ColumnActionMenu:155, ST_FilterOptionMenu:235, ST_RowActionMenu:49, ST_ShowHideColumnsMenu:105); "The library anchors its menus to an invisible span" (:115, :170, :251, :86, :121); "returning false keeps Base UI off the invisible trigger" (:149, :188, :271, :105, :139).
- Smaller repeats: "Created outside the ... subscription" 5x (ST_TableBodyCell:157, ST_TableLayout:72, ST_TableContainer:127, ST_TopToolbar:79, ST_BottomToolbar:81); "keyframes read" 3x (ST_TableDetailPanel:146, ST_TableHeadCellFilterContainer:48, ST_GlobalFilterTextField:103); "The live store: the caller's subscription lists ..." 3x (pagination.utils:157, row.utils:30, style.utils:99); "`items` gives the trigger the option label" 3x (ST_EditCellTextField:168, ST_FilterTextField:517, ST_TablePagination:194).
- Bases: radix and aria repeat the same set (same file set, same patterns).
- Likely fix direction: delete restatements; state a repeated rationale once where the pattern lives (or in the shared helper from F20).

### F16 Inherited workaround comment contradicts the current core types

- `components/inputs/ST_FilterRangeSlider.tsx:78`: "fix potential TanStack Table bugs where min or max is an array" guards `getFacetedMinMaxValues()`, which table-core 9.3.1 types as `undefined | [number, number]`.
- Name-level check: every identifier, option, file and CSS name cited in base comments resolves in the tree or in its dependencies (table-core 9.3.1, @base-ui/react 1.9.0). No other stale hit.
- Bases: radix and aria repeat line 78.
- Likely fix direction: confirm against v9 runtime, then drop the guard and its comment together or reword it as a one-line invariant.

### F17 Lint and type suppressions: 33 eslint-disable, 8 ts-expect-error, 17 disables without a reason

- `components/menus/ST_FilterOptionMenu.tsx:120`: `no-explicit-any` disable with no reason; the file holds 5 suppressions (120, 170, 180, 200, 212).
- No TODO, FIXME, XXX, HACK, ts-ignore or commented-out code in the base tree.
- `no-explicit-any` without reason (11): ST_TableBodyCell:348, ST_TableBodyRowPinButton:34, ST_FilterTextField:208,225, ST_SelectCheckbox:124,183, ST_FilterOptionMenu:120,180,200,212, ST_CellActionMenu:39.
- `exhaustive-deps` without reason (6): ST_TableBodyCell:100, ST_FilterTextField:205,308, ST_GlobalFilterTextField:63,97, ST_ShowHideColumnsMenu:62-86 (block).
- With a reason (16): ShadcnTable:42 (rules-of-hooks), ST_Table:68, ST_FilterOptionMenu:170, stConfigFeature:56,63,367,378, and one file-wide `no-unused-vars` block in each of 9 feature files (stCellActions:34, stColumnDragging:40, stDensity:30, stEditing:43, stFilterModes:40, stFullScreen:27, stRefs:28, stRowDragging:38, stToolbars:29).
- `@ts-expect-error`, all with a reason (8): utils:54, cell.utils:95, ST_TableBodyCell:109, ST_TableBodyRow:92, ST_EditCellTextField:100, ST_FilterRangeSlider:146, useST_ColumnVirtualizer:123, useST_RowVirtualizer:84.
- Bases: radix 33 disables, 8 expect-error; aria 31 disables, 7 expect-error; reasoned disables 16 in each.
- Likely fix direction: type the `any` sites and fix the dependency arrays; keep only reasoned, unavoidable suppressions.

### F18 Long explanatory blocks record implementation history, not a contract

- `components/menus/ST_CellActionMenu.tsx:137-145`: nine lines on Chrome macOS contextmenu timing and Base UI's `allowMouseUpTriggerRef` above one capture handler.
- `components/inputs/ST_SelectCheckbox.tsx:23-26`: explains Vite's dep scanner and a Storybook reload, which is repo tooling and means nothing in a user's app.
- `shared/utils/virtualization.utils.ts:3-7`: MRT-copied JSDoc ("When scroll, ... to avoid this thing").
- Type-erasure rationale, 5 to 7 lines: `features/stCellActionsFeature.ts:16-21`, `features/stEditingFeature.ts:19-24`, `hooks/useST_TableInstance.ts:204-209`, `types.ts:119-125`.
- Mechanism narration, 5 to 7 lines: `features/stFilterModesFeature.ts:84-89`, `components/table/ST_TableContainer.tsx:89-93`, `hooks/stTableHook.tsx:22-28,32-38`, `components/head/ST_TableHeadCellFilterLabel.tsx:164-166` (shadcn PopoverContent internals).
- Plus `shared/utils/style.utils.ts:12-21` (F14) and ST_LinearProgressBar:27-30.
- Bases: radix and aria repeat these files with tree-specific wording.
- Likely fix direction: cut each to one sentence that states the invariant, or remove it when the code reads on its own.

### F19 Dead exports

- `shared/utils/style.utils.ts:182`: `getCommonToolbarStyles` is exported and referenced nowhere, not even in its own file.
- Exported but used only inside their own file, not in the barrel (39): `getCommonPinnedCellStyles` (style.utils:65); `Cancelable`, `CreateFilterOptionsConfig`, `FilterOptionsState` (utils.ts); `ST_CellActionMenuProps`; 34 feature slice types across the 11 `features/st*Feature.ts` files (`ST_TableState_*`, `ST_TableOptions_*`, `ST_Table_*`, `ST_TableRefs`).
- Public via the barrel but unreferenced in tree, stories and docs, with zero uses in their own file: `ST_ColumnSizingState` (types.ts:167), `ST_GroupingState` (:169), `ST_VirtualizerOptions` (:177).
- Search scope: monorepo base tree, `packages/shadcn-table/stories`, docs app, with the docs app's copied library folders excluded.
- Bases: radix and aria repeat `getCommonToolbarStyles`.

### F20 Duplicate helpers and copied blocks

- `components/footer/ST_TableFooter.tsx:46-62`: the user-ref callback block (userRef, attachRef, assignRef, cleanup) is copied into 6 files: ST_TableHead:50, ST_TableFooter:46, ST_TableContainer:61, ST_TableLayout:50, ST_TopToolbar:53, ST_BottomToolbar:57.
- Anchor-menu scaffolding (anchorRef plus finalFocus, invisible span trigger, onOpenChange reset) is copied into 5 menus: ST_CellActionMenu:103, ST_ColumnActionMenu:159, ST_FilterOptionMenu:239, ST_RowActionMenu:53, ST_ShowHideColumnsMenu:109.
- `handlePinColumn` is defined in ST_ColumnPinningButtons:33 and ST_ColumnActionMenu:103 (the latter also closes the menu).
- Bases: radix and aria repeat all three.

### F21 Functions over 150 lines: 19

- `components/inputs/ST_FilterTextField.tsx:69-656`: `ST_FilterTextField` runs 588 lines.
- Over 300: ST_ColumnActionMenu:30-411 (382), ST_TableBodyCell:43-374 (332), ST_TableHeadCell:32-355 (324), ST_TablePagination:58-377 (320).
- 200 to 300: ST_EditCellTextField:41-298 (258), ST_TableBodyRow:52-302 (251), ST_TableBody:29-252 (224), ST_FilterOptionMenu:124-338 (215), useST_Effects:12-226 (215).
- 150 to 200: useST_TableOptions:32-227 (196), ST_ToolbarAlertBanner:36-230 (195), ST_ShowHideColumnsMenu:28-214 (187), cellKeyboardShortcuts (cell.utils:64-234, 171), ST_SelectCheckbox:48-210 (163), useST_TableInstance:71-230 (160), ST_ShowHideColumnsMenuItems:37-194 (158), ST_TableHeadCellFilterLabel:38-194 (157), ST_TableContainer:35-186 (152).
- Deferred to v0.8.x: function length is a refactor the owner left open (2026-10-31).

### F22 Files over 600 lines: 3

- `features/stConfigFeature.ts`: 713 lines.
- `components/inputs/ST_FilterTextField.tsx` 656, `types.ts` 642.
- Bases: radix 713, 640, 642; aria 713, 690, 658.
- Deferred to v0.8.x: file length is a refactor the owner left open (2026-10-31).

### F23 `as unknown as` casts: 13 in 10 files

- `components/inputs/ST_EditCellTextField.tsx:201`: one of 4 double casts in this file (201, 215, 222, 228).
- Others: ST_FilterTextField:548, stFilterModesFeature:91, stRefsFeature:44, stEditingFeature:84, tanstack.helpers:68, stTableHook:68, useST_ColumnVirtualizer:95, useST_RowVirtualizer:79, useST_TableInstance:219.
- Bases: radix 13, aria 13.

### F24 Non-null assertions: 13 in 10 files, none in bulk

- `components/inputs/ST_EditCellTextField.tsx:200`: `editInputRefs.current!`; the same ref-map pattern appears at ST_EditCellTextField:268, ST_FilterTextField:384, ST_FilterRangeSlider:141,144, ST_TableHeadCell:238.
- `includes(x!)` on optional options: style.utils:118, column.utils:167, ST_ToggleRowActionMenuButton:84, ST_TableBodyCellValue:80, ST_RowActionMenu:57; plus displayColumn.utils:28 (`localization[header]!`).

### F25 Localization guide bypasses the base-aware install component and shows only `de`

- `apps/shadcn-table-docs/content/docs/guides/localization.mdx:17-19`: three hard-coded German commands, one per base, in one bash block, while `getting-started/install.mdx:28` renders `<InstallCommand />`, which follows the header base selector and the package manager and already takes an `item` prop.
- `apps/shadcn-table-docs/lib/install.ts:66-71`: `localeAddCommand(code, base, pm)` builds the locale command; nothing imports it.
- `localization.mdx:26`: hand-written list of 39 codes; `example-groups/LocaleExamples.tsx:45` holds a second static copy (`supportedLocales`). Neither is generated from the registry.
- The guide never names the export constants (`ST_Localization_DE` and the others); they appear only inside rendered example sources. No prose line shows `localization={ST_Localization_DE}`.
- `getting-started/introduction.mdx:30` ("39 languages: add a locale with one command") and `README.md:70` ("38 locales, installed as separate registry items") give no command and no link to the guide; the two counts also disagree (38 non-English items, 39 with `en`).
- The registry itself is fine: 38 locale items per base, one file each, all three `/r/<base>/shadcn-table-locale-de.json` URLs return 200, a real install of `de` into a copy of test-projects/next-app succeeded, `de.ts` imports only the `ST_Localization` type.
- Likely direction: `InstallCommand` with a locale picker fed by `localeAddCommand`, codes and export names generated from the registry and shared with the example tabs; one install line plus a link on the introduction page and the README.

### F26 Locale items depend on the main item, so every locale add re-resolves the whole table

- `packages/shadcn-table/registry.json` (every `shadcn-table-<base>-locale-<code>` item): `registryDependencies` names the main item, so `shadcn add` of a one-file locale re-resolves 130 files (table plus shadcn parts), runs a dependency install, logs "Skipped 130 files: (files might be identical, use --overwrite to overwrite)" and prompts "The file X already exists. Would you like to overwrite?" for every file that differs from disk (local edits, a newer main item, or a command for another base).
- shadcn 4.23.0 via `@shadcn/registry` 0.2.1: identical content is skipped silently; differing content prompts unless `--overwrite` or non-interactive. Verified: the Base UI `de` command into a Base UI install showed no prompt; the Radix `de` command into the same install prompted for 24 files and added `radix-ui` to `package.json`.
- Verified: the same `de` item with `registryDependencies` removed installs `shared/locales/de.ts` alone, no dependency step, no skipped list, no prompt.
- The locale file needs nothing at install time; `de.ts` only type-imports `ST_Localization` from the already installed `types.ts`. The hosted locale items carry no `dependencies` or `devDependencies`.
- Likely direction: drop the main-item `registryDependencies` from the locale items in `scripts/registry/lib.mjs`; the guide says the table is installed first (D2).

## Round 2: next-app header demo and shadcn create, 2026-10-30

Source for F27 to F32: test-projects/next-app/shadcn-table-bugs.md (header demo build). F33 to F36 come from a `shadcn create` comparison. Paths are relative to `packages/shadcn-table/registry/base/components/ui/shadcn-table/` unless named otherwise.

### F27 Range filter value never applies

- `components/inputs/ST_FilterTextField.tsx:211-214`: the debounced range change writes into the previous filter array in place and returns the same reference, so TanStack sees no change and rows do not filter. Same in `handleClear` at 265-269.
- Mount effect 292-308: the `isMounted` ref survives the strict-mode effect re-run, so the second run calls `handleClear` and seeds `[undefined, '']`; every later Min or Max edit mutates that array.
- Range inputs render the fallback `InputGroupInput` at 625 with no `type` and no numeric check, so number columns accept letters (owner saw an "Estimate: q to 1" chip).
- Bases: radix same lines, fallback input at 609; aria 222-224, 286-288, mount effect 317-331, fallback input at 659.
- No test or story asserts range filtering: `stories/features/Filtering.stories.tsx` declares range variants at 39, 156, 170-184 with no row assertions.
- Direction: copy the array before writing, numeric input for number columns, a test that types Min and asserts filtered rows.

### F28 Clearing sort snaps back to the previous sort

- `hooks/useST_Effects.ts:129-151`: the ranked results effect re-applies the last sort when the user clears sorting.
- `table.atoms.globalFilter` is a computed atom that also reads a commit-version atom, so it recomputes after every table commit, including a sort change.
- `@tanstack/store` 0.11.2 `dist/atom.js:134` treats an undefined old value as always changed (`oldValue === void 0 || !compare(...)`); the global filter starts undefined because the library sets no initial value.
- Each sort change fires the subscription at 146-147 with undefined, `applyRanking` restores `appliedSort` at 141, and `appliedSort` still holds the last non-empty sort because 132-134 skip empty sorts.
- Stops once the global filter has had any value, even `''`.
- Repro: `enableGlobalFilterRankedResults` default true, no global filter, sort a column, then `table.setSorting([])` or "Clear sort" in a column menu; the sort returns.
- Bases: identical in all three.
- Direction: run ranking only on a real change of the global filter value; report the undefined comparison to TanStack store.

### F29 ST_TablePagination outer padding cannot be overridden

- `components/toolbar/ST_TablePagination.tsx:43-52`: the props extend `ST_PaginationProps` (`NavProps`, `types.ts:59`), so `className` is accepted, but it is merged onto the inner `Pagination` nav at 244-246.
- The outer div at 156-160 carries `py-3` from the variants at 53-55 and takes no caller class, so a headless footer cannot change the vertical padding.
- Compare: `ST_BottomToolbar` takes `DivProps` (`components/toolbar/ST_BottomToolbar.tsx:20`) and merges `toolbarProps.className`; `ST_TopToolbar` takes no props (`components/toolbar/ST_TopToolbar.tsx:31`) and merges it from options.
- Bases: identical in all three.

### F30 Headless example does not explain the row spacer column

- `hooks/useST_TableOptions.ts:127-128`: with `enableColumnResizing` the default `layoutMode` becomes `grid-no-grow`, and only that mode adds the `st-row-spacer` display column (`shared/utils/displayColumn.utils.ts:90-92`, `hooks/display-columns/getST_RowSpacerColumnDef.tsx:24`). Semantic layout adds none.
- The spacer is documented in `apps/shadcn-table-docs/content/docs/guides/column-size.mdx:37` and `display-columns.mdx:26`.
- `apps/shadcn-table-docs/examples/base/custom-headless/TS.tsx:78` maps `getHeaderGroups()` (radix same line, aria maps `getFlatHeaders()` at 116) with no mention of the spacer.
- Effect: a headless user who turns on resizing sees an empty extra header and has no pointer to why.
- Bases: identical in all three.

### F31 Global filter field animation in custom toolbars, unverified

- `components/inputs/ST_GlobalFilterTextField.tsx:104-108`: the field stays mounted inside `Collapsible` and `CollapsibleContent`, and the panel animates width from 0 to `--collapsible-panel-width` over 300ms (`shared/utils/style.utils.ts:40-60`).
- `InputGroup` is `w-full min-w-0` (`registry/base/components/ui/input-group.tsx:17`), so its width comes from the parent, and the `Collapsible` root has no class or width.
- Rendered inline in a custom flex toolbar the measured width can be wrong or near zero, and sibling buttons shift every frame.
- Inside `ST_TopToolbar` (`components/toolbar/ST_TopToolbar.tsx:86-101`, first item or the `flex-wrap-reverse justify-end` group) this is hidden.
- Owner saw it in the next-app header demo and called it broken.
- Bases: radix uses `data-[state=...]` selectors (108); aria uses `isExpanded` and `aria-hidden` selectors (108, 112).
- Not browser-verified. Needs a compare against the built-in toolbar before it counts as a library bug.

### F32 Headless toolbar gaps: button props and full screen

- `types.ts:82`: `ButtonProps = ComponentPropsWithRef<'button'>` (aria `types.ts:93` also omits `onClick` and `disabled`), so a custom toolbar cannot pass the shadcn Button `size` or `variant` through the type.
- At runtime both are overridable: `size="icon"` and `variant="ghost"` sit before `{...rest}` (`components/buttons/ST_ToggleGlobalFilterButton.tsx:41-44`).
- Affects `ST_ToggleGlobalFilterButton`, `ST_ToggleDensePaddingButton`, `ST_ShowHideColumnsButton`, `ST_ToggleFullScreenButton`.
- `components/table/ST_TableLayout.tsx:88`: Esc to exit full screen lives only here, and the full-screen classes (defined at 22, applied at 92-95) are applied only here.
- `ST_TableLayout` is exported (`index.ts:76`) but always renders its own toolbars and container, so headless setups must copy both the handler and the styling.

### F33 Icon library is hard-coded to Lucide

- `icons.ts:1-35`: 33 icons imported from `lucide-react`; direct imports also at `ST_Checkbox.tsx:2`, `types.ts:39` (`LucideProps`), `components/toolbar/ST_TablePagination.tsx:3` (`LucideIcon`).
- `packages/shadcn-table/registry.json:18`: `lucide-react` is a dependency of every main item (also 1198, 2378, 3558); no `IconPlaceholder` anywhere in the registry.
- `shadcn create` and `init` write `iconLibrary` into `components.json` (lucide, hugeicons, tabler, phosphor, remixicon), and the CLI `transformIcons` rewrites only `<IconPlaceholder lucide=... tabler=... />` elements.
- Effect: a consumer who chose another icon library still gets Lucide icons and the `lucide-react` package.
- 16 of the 33 names have no upstream equivalent in the other libraries.
- Corrected 2026-10-31 after checking every name against the packages: direct matches are Tabler 33 of 33, Hugeicons 31, Phosphor 29, Remix 27; the rest take a substitute (density rows, search-off, first and last page). Table in spec 11.
- Bases: radix and aria same (4 files import `lucide-react` in each).

### F34 RTL handled at runtime, not by transformRtl

- `components/head/ST_TableHeadCellResizeHandle.tsx:24-43`: a `direction` variant swaps `-mr-*` and `-ml-*`, `right-*` and `left-*` from `columnResizeDirection`; `components/body/ST_TableBodyCell.tsx:221` does the same.
- 30 physical direction classes per base (`ml-`, `mr-`, `pl-`, `pr-`, `left-`, `right-`, `text-left`, `text-right`), for example `components/toolbar/ST_BottomToolbar.tsx:23`, `components/toolbar/ST_ToolbarAlertBanner.tsx:25`, `components/inputs/ST_FilterTextField.tsx:540`, `components/head/ST_TableHeadCell.tsx:253-255`.
- `components.json` has an `rtl` flag, and the CLI `transformRtl` rewrites physical direction classes to logical ones at add time.
- In an rtl project both mechanisms act on the same classes. Untested whether this double-flips the resize handle and pinned offsets.
- Bases: 30 in each.

### F35 Own classes are tuned to the nova style

- The library's own surfaces hard-code radius and shadow values that match style nova, so vega, maia, lyra, mira, luma, sera and rhea get nova geometry on the table while their shadcn parts follow the chosen style.
- Radius (9 in base): `components/body/ST_TableBodyCellValue.tsx:102`, `components/head/ST_TableHeadCellResizeHandle.tsx:108`, `components/head/ST_TableHeadCellFilterLabel.tsx:178`, `components/head/ST_TableHeadCellSortLabel.tsx:115`, `components/table/ST_TableLayout.tsx:18,22`, `components/table/ST_TableContainer.tsx:32`, `components/inputs/ST_FilterTextField.tsx:429,538`.
- `rgba(...)` shadows (4): `shared/utils/style.utils.ts:77,79`, `components/toolbar/ST_BottomToolbar.tsx:23`, `components/head/ST_TableHeadRow.tsx:22`.
- `menuColor` from `components.json` reaches the shadcn parts but not the library's own menu surfaces; font weights are fixed classes.
- Bases: radix and aria 8 radius sites, 4 shadows.
- Premise refuted 2026-10-31: shadcn styles are literal classes per part and set no radius, shadow or font tokens, so no class of ours can follow a style switch. Counts stand. ST menus already follow `menuColor` and `menuAccent` through the installed `dropdown-menu` part. Only the base filter popover (F42) is a nova copy. Decided in D32.

### F36 Install docs do not cover shadcn create

- `apps/shadcn-table-docs/content/docs/getting-started/install.mdx:16`: project creation renders `<InitCommand />` and the add step `<InstallCommand />` at 28; line 14 names only the base and `aria-nova`.
- No page under `apps/shadcn-table-docs/content` mentions `shadcn create`, ui.shadcn.com/create, `--preset`, `iconLibrary` or `menuColor`.
- Effect: a consumer starting from create gets no guidance on which knobs the library respects (base, theme, base color, radius, menu accent, body font) and which it ignores (icon library, heading font, menu color on own surfaces, style geometry per F35).

## Round 3: shadcn part usage audit, 2026-10-31

Audit of how the library uses the shadcn parts and their primitives (@base-ui/react 1.9.0, react-aria 3.53.1, react-aria-components 1.22.1). Paths are relative to `packages/shadcn-table/registry/<base>/components/ui/shadcn-table/`; `ui/` paths are relative to `packages/shadcn-table/registry/<base>/components/ui/`; primitive paths are relative to the package `dist` or root in `node_modules`.

### F37 Radix menus lose focus on close

- `components/menus/ST_ColumnActionMenu.tsx:174-177` and `components/menus/ST_ShowHideColumnsMenu.tsx:129-132` (radix): `onCloseAutoFocus` calls `preventDefault()`, then `anchorEl?.focus()`.
- `anchorEl` is already null when the handler runs, because the close cleared it first, so nothing is focused and focus falls to `body`.
- `components/menus/ST_RowActionMenu.tsx:49-50` (radix) keeps the element in `anchorRef` and avoids this; `ST_FilterOptionMenu` does the same.
- Effect: keyboard users lose their place after closing the column actions or show-hide menu.
- Bases: radix only.

### F38 Show-hide column items unusable by keyboard

- `components/menus/ST_ShowHideColumnsMenuItems.tsx` base:114,159, radix:114,157, aria:117,166: the `DropdownMenuItem` has no select or action handler (radix sets `onSelect` to `preventDefault` only), so Enter and Space toggle nothing.
- The `Switch`, pin buttons and grab handle sit inside the menuitem as nested interactive controls, which the menu's roving focus cannot reach.
- `DropdownMenuCheckboxItem` is not used.
- Effect: column visibility cannot be changed from the keyboard in this menu.
- Bases: all three.

### F39 Menus open from a hidden placeholder span

- Five menus (`ST_RowActionMenu`, `ST_ColumnActionMenu`, `ST_ShowHideColumnsMenu`, `ST_FilterOptionMenu`, `ST_CellActionMenu`) render an `aria-hidden` fixed span as the trigger, positioned from `getBoundingClientRect()` at render: base `components/menus/ST_RowActionMenu.tsx:76-100`, `ST_ColumnActionMenu.tsx:160-184`, `ST_CellActionMenu.tsx:108-129`.
- The real opener buttons only set the anchor (`components/buttons/ST_ShowHideColumnsButton.tsx:24`, `components/head/ST_TableHeadCellColumnActionsButton.tsx:54`) and never get `aria-haspopup` or `aria-expanded`.
- The rect is read once per render, so the menu stays at the old position when the page scrolls.
- Primitive proof: a real trigger gets `aria-haspopup` at `@base-ui/react menu/trigger/MenuTrigger.js:193` and `aria-expanded` at `menu/root/MenuRoot.js:501`.
- Bases: all three.
- Relation: D5 and D20 build on this pattern.

### F40 Base finalFocus bypasses the primitive guard

- `components/menus/ST_ColumnActionMenu.tsx:190-193` (base): `finalFocus` calls `.focus()` itself and returns false; same at `ST_RowActionMenu.tsx:107`, `ST_ShowHideColumnsMenu.tsx:141`, `ST_FilterOptionMenu.tsx:273`, `ST_CellActionMenu.tsx:151`.
- This skips Base UI's guard that leaves focus alone when it moved elsewhere after open (`@base-ui/react floating-ui-react/components/FloatingFocusManager.js:487-488,533-537`).
- Example: "filter by column" focuses the filter input in a microtask (`ST_ColumnActionMenu.tsx:127`), then `finalFocus` pulls focus back to the column actions button.
- Bases: base only.
- Unverified in a browser.

### F41 Aria tooltip wrappers add tab stops

- `ui/tooltip.tsx:25` (aria): the trigger child is wrapped in `Focusable`, which clones it with `tabIndex=0` (`react-aria private/interactions/useFocusable.mjs:64-65,104-107`).
- Every span or `Label` wrapped around a button becomes an extra tab stop with no role: `components/toolbar/ST_TablePagination.tsx:297,312,326,341`, `components/inputs/ST_SelectCheckbox.tsx:170`, `components/inputs/ST_FilterTextField.tsx:361,378`, `components/head/ST_TableHeadCellSortLabel.tsx:87`, `components/menus/ST_ShowHideColumnsMenuItems.tsx:163`, `components/inputs/ST_FilterCheckbox.tsx:87`.
- `ST_SelectCheckbox` renders in every row-select cell, so each row adds a stop.
- Effect: Tab visits an unnamed wrapper before each real control.
- Bases: aria only.

### F42 Filter popover opened by hand

- `components/head/ST_TableHeadCellFilterLabel.tsx` base:131-133,158-189, radix:161-176, aria:158-175: the filter `Button` opens the popover through manual `anchorEl` state instead of `PopoverTrigger`.
- The button gets no `aria-expanded`, `aria-haspopup` or `aria-controls`; proof at `@base-ui/react popover/trigger/PopoverTrigger.js:121-122`.
- Base rebuilds `Portal`, `Positioner` and `Popup` with classes copied from the shadcn part; radix uses `PopoverAnchor` with a `virtualRef`; aria passes a fresh `triggerRef` object every render.
- Bases: all three.

### F43 Manual focus competes with primitive focus

- `components/head/ST_TableHeadCellFilterLabel.tsx:137-140` (base) and `components/menus/ST_ColumnActionMenu.tsx` base:127, radix:122, aria:120: focus moves in a `queueMicrotask`.
- The primitive runs its own open and close focus at the same time: Base `initialFocus`, Radix `onOpenAutoFocus`, React Aria `autoFocus`.
- Effect: which element ends up focused depends on timing.
- Bases: all three.
- Unverified in a browser.

### F44 ST_ActionMenuItem forces tabIndex

- `components/menus/ST_ActionMenuItem.tsx:40` (base and radix): `tabIndex={0}` overrides the primitive's roving tabindex.
- Effect: every menu item becomes a Tab stop instead of one stop per menu.
- Aria sets none.
- Bases: base and radix.

### F45 One RadioGroup per row for single select

- `components/inputs/ST_SelectCheckbox.tsx` base:181, radix:174, aria:173: single row selection renders one `RadioGroup` per row with one item.
- Arrow keys cannot move between rows, and screen readers announce "1 of 1".
- Base and radix leave the group unnamed; aria passes `aria-label` at 174.
- Bases: all three.
- Deferred to v0.8.x: single-select RadioGroup semantics left open by the owner (2026-10-31).

### F46 Field description and error not linked to the control

- `components/inputs/ST_EditCellTextField.tsx:83-88,149-160` (base): helper text renders as `FieldDescription` or `FieldError` inside `Field`.
- `ui/field.tsx:131,176`: the parts are plain elements with no context, so neither reaches the control through `aria-describedby`.
- Effect: screen readers do not read the helper or error text with the edit input.
- Bases: all three.

### F47 Filter chip clear button has no name

- `components/inputs/ST_FilterTextField.tsx` base:365-369, radix:365-369, aria:389-393: the icon-only `button` inside the `Badge` has no accessible name.
- Effect: screen readers announce an unnamed button.
- Bases: all three.

### F48 Nested labels in aria checkbox and switch

- `components/inputs/ST_FilterCheckbox.tsx:87` and `components/menus/ST_ShowHideColumnsMenuItems.tsx:161` (aria): `Label` wraps a React Aria `Checkbox` or `Switch`.
- Both already render a `<label>` root (`react-aria-components private/Checkbox.mjs:249`, `Switch.mjs:185`), so the DOM holds a label inside a label.
- Bases: aria only.

### F49 Aria menu trigger span focusable while hidden

- `components/menus/ST_RowActionMenu.tsx:80-83` and `ST_CellActionMenu.tsx:107-110` (aria): the trigger span carries `aria-hidden`, `role="button"` and `tabIndex={-1}` together.
- Effect: a hidden element still claims a role and is programmatically focusable.
- Bases: aria only.

### F50 Aria height Collapsible collapse snaps

- `shared/utils/style.utils.ts:31-37` (aria): the collapse keyframe starts from `var(--disclosure-panel-height)`.
- React Aria sets that variable to `0px` before the panel closes, because it expects a transition (`react-aria private/disclosure/useDisclosure.mjs:74-82`).
- The collapse runs from 0 to 0 and snaps shut.
- Sites: `components/toolbar/ST_LinearProgressBar.tsx:102`, `components/toolbar/ST_ToolbarAlertBanner.tsx:167-171`, `components/body/ST_TableDetailPanel.tsx:153`, `components/head/ST_TableHeadCellFilterContainer.tsx:75`.
- Bases: aria only.
- Covered by D25.

### F51 Height panels lack overflow-hidden

- `ST_LinearProgressBar`, `ST_ToolbarAlertBanner` and `ST_TableHeadCellFilterContainer` have no `overflow-hidden` on the `CollapsibleContent` panel in any base.
- Only `ST_TableDetailPanel` clips (base:151, radix:146, aria:153).
- Effect: content spills outside the panel while the height animates; the radix tw-animate keyframes carry no clip either.
- Bases: all three.
- Covered by D25.

### F52 Aria resize handle orientation selector never matches

- `components/head/ST_TableHeadCellResizeHandle.tsx:105-108` (aria): `data-[orientation=vertical]:h-6` and `data-[orientation=vertical]:w-1` never apply.
- React Aria `Separator` emits only `aria-orientation`, no `data-orientation` (`react-aria private/separator/useSeparator.mjs:21-27`).
- Effect: the handle renders 1px wide and full height.
- Bases: aria only.

### F53 Edit modal and cell menu never play exit animations

- `components/table/ST_TableContainer.tsx:179-180`: `ST_EditRowModal` and `ST_CellActionMenu` mount only while open, the modal with `open` always true.
- Closing unmounts them at once, so the parts' exit animations never play.
- Bases: all three, same lines.

### F54 Slider ref written onto props

- `components/inputs/ST_FilterRangeSlider.tsx` base:145-147, radix:135-137: `sliderProps.ref = node` writes to the props object.
- The consumer's ref is never called or set, so it never receives the node.
- Bases: base and radix.

### F55 Radix-only workaround in base dialog

- `components/modals/ST_EditRowModal.tsx:101` (base): `aria-describedby={undefined}` is the Radix missing-description warning workaround.
- It has no effect in Base UI.
- Bases: base only.

### F56 closeOnClick restates the default

- `components/menus/ST_ActionMenuItem.tsx:44` (base): `closeOnClick` restates the Base UI default of true (`@base-ui/react menu/item/MenuItem.js:25`).
- The comment at 41-43 presents it as needed so every item closes, but `DropdownMenuItem` is a plain item where that default already applies.
- Bases: base only.

### F57 Filter-mode submenu built by hand in base and radix

- `components/menus/ST_ColumnActionMenu.tsx` base:138,281,289, radix:133,265,273: the filter-mode menu is a second root `DropdownMenu` on a fake span.
- It opens from a nested `Button` with `onMouseEnter` inside the item (`components/menus/ST_ActionMenuItem.tsx` base:57-62, radix:53-58), though both primitives ship `Sub`.
- Aria uses `DropdownMenuSub` at 259.
- Bases: base and radix.

### F58 Menu focus return differs per base

- Base calls `.focus()` inside `finalFocus` (F40).
- Radix uses `anchorRef` in `ST_RowActionMenu` and `ST_FilterOptionMenu`, and a stale `anchorEl` in `ST_ColumnActionMenu` and `ST_ShowHideColumnsMenu` (F37).
- Aria relies on the primitive's restore focus.
- The divergence is not forced by the primitives.

### F59 Grouped-by chip spread order differs

- `components/toolbar/ST_ToolbarAlertBanner.tsx:131-141` (base): `{...chipProps}` comes after `render`, so a `chipProps.render` replaces the button and its grouping toggle.
- Aria at 137-152 spreads first, then renders the button and chains the consumer `onClick`.
- Radix at 130 spreads `chipProps` on a `Badge` with `asChild`; the child button stays and Slot composes the consumer `onClick`, so it matches aria.
- Bases: base differs from radix and aria.

### F60 Aria select checkbox ignores title

- `components/inputs/ST_SelectCheckbox.tsx:163-168` (aria): the tooltip title uses only the localization strings and ignores `checkboxProps.title`.
- Base (171-172) and radix (164-165) honour it.
- Bases: aria only.

### F61 Row action menu stays open on a second click of its opener

- `components/menus/ST_RowActionMenu.tsx:80-100` and `components/buttons/ST_ToggleRowActionMenuButton.tsx:48-52,108` (base): the visible button is not the trigger; the `DropdownMenuTrigger` is the hidden fixed span and the menu is controlled by `open={!!anchorEl}`. On the second click the primitive sees a press outside the popup and its trigger and closes (`setAnchorEl(null)`); the button's `onClick` then runs `handleOpenRowActionMenu`, which always sets `anchorEl` again, so the menu reopens.
- Repro: next-app `/header-demo` with `enableRowActions` and `renderRowActionMenuItems`, click the row actions button twice; the menu stays open. Source: `test-projects/next-app/shadcn-table-bugs.md` section 7, confirmed in the browser.
- Likely the same in the other span-anchored menus (`ST_ColumnActionMenu`, `ST_CellActionMenu`, `ST_FilterOptionMenu`, `ST_ShowHideColumnsMenu`): every opener sets the anchor unconditionally.
- Bases: all three (same opener handlers).
- Relation: D26 keeps the anchor pattern; the fix is a toggle inside `useST_MenuAnchor` (D26 addendum, spec 10).
