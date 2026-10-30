# v0.7.x decisions

## Round 1: discussion, 2026-10-29

### D1 Three files move to the folders of their kind, nothing else changes

- `ST_Checkbox.tsx` moves to `components/inputs/`, `ST_Tooltip.tsx` to `components/buttons/`, `components/toolbar/useST_MediaQuery.ts` to `hooks/`, in all three bases (base, radix, aria). Only the files and their import paths move; no code change rides along.
- Everything else stays where it is: `ShadcnTable.tsx` at the root, `hooks/stTableHook.tsx` unsplit, `ST_TableLayout.tsx`, `shared/fns/sortFns.ts`, `features/stFeatures.ts`, `getST_RowSpacerColumnDef.tsx` as they are.
- Touched by the moves: import lines (about 30 per base), `index.ts:16,25,26`, `scripts/registry/base-diff.json:2,3`, `scripts/registry/aria-diff.json:2,3`, `registry.json` regenerated with `pnpm registry:build`, the three docs app copies under `apps/shadcn-table-docs/components/ui-*/` re-installed, `docs/code-of-conduct/coding-standards.md:51` wording.

### D2 Locale install command through the base-aware install component with a locale selector

- The Localization guide renders one install command through `InstallCommand` (the component the install page uses), extended with a locale selector next to the existing base and package manager selectors; the three hard-coded German commands go (F25).
- The command comes from `localeAddCommand(code, base, pm)` in `apps/shadcn-table-docs/lib/install.ts`, which exists and is unused today.
- The locale code list and the export constant names (`ST_Localization_DE` and the others) come from one generated source derived from the registry, shared by the guide and the locale example tabs; the two hand-written lists are removed.
- The guide shows the import and `localization={ST_Localization_<CODE>}` in prose for the selected locale.
- The introduction page and the README state the same count and link to the guide.

### D3 Base selector on the example toolbar

- Every docs example toolbar (the bar with Select Example, Preview / Code / Both, Copy prompt, full screen) gets a base selector between the view toggle and Copy prompt.
- It is the same dropdown as the header base selector and binds to the same stored `base` group (`useBase()` in `apps/shadcn-table-docs/components/base-selector.tsx`), so changing it in the toolbar changes the header, the rendered example, the code tab and the copied prompt together.
- Same control on the locale example tabs and on the Localization guide's install command (D2).

### D4 Hooks called unconditionally in the virtualizer hooks and the table options hook

- `hooks/useST_RowVirtualizer.ts` and `hooks/useST_ColumnVirtualizer.ts` call every hook (`useSelector`, `useMemo`, `useVirtualizer`, `useCallback`) on every render and pass `enabled: enableRowVirtualization` / `enabled: enableColumnVirtualization` to `useVirtualizer`; the early return moves to the end and still returns `undefined` when virtualization is off (F1).
- `hooks/useST_TableOptions.ts`: `useId()` is called in the body, `const id = idProp ?? generatedId`, no longer as a default parameter (F1).
- All three bases. No option, type or behavior change.

### D5 Refs are no longer read or written during render

- Composed refs: the six `userRef.current = <props>.ref` sites (`ST_TableFooter`, `ST_TableHead`, `ST_TableContainer`, `ST_TableLayout`, `ST_BottomToolbar`, `ST_TopToolbar`) and the aria `ST_Tooltip` `childRef` use one shared `hooks/useST_ComposedRef.ts`: a callback memoized on the internal ref and the user's ref, attaching both and cleaning both up (F2).
- Menu anchors: `ST_CellActionMenu` (base only: the render-time write inside the Subscribe render prop, fed by a render read of `actionCellRef.current`), `ST_ColumnActionMenu`, `ST_FilterOptionMenu`, `ST_RowActionMenu`, `ST_ShowHideColumnsMenu` keep the last non-null anchor in `useState`, updated with the render-phase "reset state when a prop changes" pattern of D8 (not in an effect, which D8 forbids), instead of `anchorRef.current = anchorEl` in render (F2).
- Latest-value refs in `hooks/useST_Effects.ts` (`latestTable`, `latestCheckPageIndex`) become `useEffectEvent` handlers; the `react` and `react-dom` peer ranges move from `^19.1.1` to `^19.2.0` (F2).
- `hooks/useST_TableInstance.ts` (the 39 hits from the `tableRef.current?.store.state` read) is out of scope here; a design note comes first, then its own decision.
- Consumer minimum: React 19.2 or later, stated on the install page, the Versioning section of the API reference and the changelog; the registry ships source and cannot enforce it.
- All three bases. No option, type or visible behavior change.

### D6 The table instance hook owns its transform state slices as TanStack atoms

- `hooks/useST_TableInstance.ts` no longer reads the previous table through `tableRef.current` during render (F2, the 39 hits). It creates one TanStack Store atom per transform slice it needs (`grouping`, `creatingRow`, `columnFilterFns`, `columnResizing`, `draggingColumn`, `draggingRow`, `isLoading`, `showSkeletons`, `pagination`, `globalFilterFn`) once in a `useState` initializer, seeded from the defaults and `initialState`, skipping slices the caller controls via `state` or passes in `atoms`.
- The slices are read during render with `useSelector(atom)` and overlaid with `definedTableOptions.state`; the atoms go to `useAppTable` through the v9 `atoms` option, user atoms taking precedence.
- The `columnDefsRef` freeze guard becomes an `isFrozen` boolean from the resizing and dragging atoms, with the column build memoized on the slices it reads; this also closes the gap where the transform selector omitted resizing and dragging.
- `tableRef` and the `useSelector(table.store, selectST_TransformState)` re-render subscription go away, unless a slice is left uncovered.
- No user-facing option, type or behavior change; `table.reset()` not resetting external atoms is accepted (no ST code calls it). All three bases. Gate: refs rule clean, Storybook checks for drag, resize, skeleton and grouping, per-base checks.

### D7 Inputs are not mutated; handler writes through TanStack APIs carry a reasoned disable

- `hooks/useST_TableOptions.ts:98-118`: the six reassigned destructured parameters (`icons`, `localization`, `defaultColumn`, `defaultDisplayColumn`, the virtualization pair) get new local names; the parameters stay untouched (F3). This lets the Compiler optimize the hook (F6).
- `hooks/useST_TableInstance.ts:87,104,113,117`: `initialState` is shallow-copied before `columnFilterFns` and the other fields are written (F3).
- The four event-handler writes into objects received via props (`ST_TableBodyCell.tsx:143` `table.refs.actionCellRef.current`, `ST_EditActionButtons.tsx:50` and `ST_EditCellTextField.tsx:101` `row._valuesCache`, `ST_FilterTextField.tsx:384` `filterInputRefs.current`, plus the aria `comboboxAnchor.current` at 477 and 482) stay as they are with one `// eslint-disable-next-line react-hooks/immutability` each and a reason: they run in handlers, not render, through TanStack's row API or the library's own ref bag (F3).
- All three bases. No behavior change.

### D8 No setState inside effects; derive during render

- `components/body/ST_TableBodyCell.tsx:95`: the random skeleton width is chosen in the `useState` initializer, not in a mount effect (F4).
- `components/inputs/ST_FilterRangeSlider.tsx:104`, `components/inputs/ST_FilterTextField.tsx:298`, `components/inputs/ST_GlobalFilterTextField.tsx:91`: syncing local state from an external filter change uses the "reset state when a prop changes" pattern (compare with the previous value during render, set state there) instead of an effect calling `setFilterValues` or `handleClear` (F4).
- All three bases. No visible change.

### D9 Memo calls take inline functions and plain dependencies

- `components/inputs/ST_FilterTextField.tsx:207` and `components/inputs/ST_GlobalFilterTextField.tsx:65`: `useCallback(debounce(...), [])` becomes `useMemo(() => debounce(...), [])` (F5).
- `components/menus/ST_ShowHideColumnsMenu.tsx:81-84` and `hooks/useST_Rows.ts:40`: getter results (`getAllColumns()`, `getCenterLeafColumns()`, `getStartLeafColumns()`, `getEndLeafColumns()`, `getRowModel().rows`) are assigned to locals before the memo and the locals are the dependencies (F5).
- All three bases. No behavior change.

### D10 No `any` in the library

- The 43 `any` sites (F7) become `unknown` where the value is only passed through or tested, real generics (`TData`, `TValue`) where the type is known, and `(...args: never[]) => unknown` for "any function". A per-line `eslint-disable-next-line @typescript-eslint/no-explicit-any` with a reason is allowed only where `any` is required for assignability; expected to be a handful.
- Public types in `types.ts` change shape; gate: typecheck of the library, the stories, the docs examples and the three installs stays green.
- `as unknown as` casts and non-null assertions that the new types make unnecessary go with them; the rest stay (F23, F24).
- All three bases.

### D11 Function registries from named imports; one platform helper

- `shared/fns/aggregationFns.ts`, `shared/fns/filterFns.ts`, `shared/fns/sortFns.ts`: the deprecated `aggregationFns`, `filterFns`, `sortFns` registries from `@tanstack/react-table` are replaced by the individual `aggregationFn_*`, `filterFn_*`, `sortFn_*` named imports; `ST_AggregationFns`, `ST_FilterFns`, `ST_SortFns` keep the same keys and functions (F8).
- `shared/utils/cell.utils.ts:15,16`: `navigator.platform` reads move into one helper that tries `navigator.userAgentData.platform` first and falls back to `navigator.platform`, the fallback's deprecation named in one comment (F8).
- All three bases. No behavior change. `table.store` (F8, 44 sites) is decided separately.

### D12 Effect and memo dependency lists are complete

- The 15 `exhaustive-deps` sites (F9: `hooks/useST_Effects.ts` 6, `hooks/useST_ColumnVirtualizer.ts` 3, `hooks/useST_Rows.ts` 2, `hooks/useST_TableInstance.ts` 2, `hooks/useST_TableOptions.ts` 1, `shared/utils/column.utils.ts` 1) list every value they read. `table` is a new object on every render in TanStack v9 (`useTable` returns a fresh instance, `@tanstack/react-table` 9.3.1 `dist/useTable.js:70`), so effects list the stable members they use (`table.atoms.<slice>`, destructured methods) rather than `table` itself; `table` may appear in memo dependency lists where a per-render recompute is already the case.
- Mount-only effects by design keep `[]` with one `// eslint-disable-next-line react-hooks/exhaustive-deps` and a reason.
- Complex expressions in dependency arrays are extracted to locals first (with D9).
- All three bases. No behavior change.

### D13 No `table.store` access; `table.Subscribe`, atoms and per-atom subscriptions instead

- The 30 `<Subscribe source={table.store} selector={s}>` sites become `<table.Subscribe selector={s}>` (source defaults to the store inside react-table, same selector, same shallow compare, same re-render set) (F8).
- The 11 `table.store.state.<slice>` snapshot reads (handlers, effects, utils under a subscription) become `table.atoms.<slice>.get()`; `getDefaultColumnOrderIds` takes the slices it reads instead of the whole state (F8).
- `hooks/useST_Effects.ts:114`: the debounced page index check subscribes to the atoms that change the pre-paginated row count (`columnFilters`, `globalFilter`, `columnFilterFns`, `globalFilterFn`, `grouping`, `expanded`, `pagination`, `isLoading`, `showSkeletons`) instead of `table.store.subscribe` on every state change; accepted narrowing, closer to MRT (F8).
- `hooks/useST_TableInstance.ts:225` `useSelector(table.store, ...)` goes with D6.
- Scope includes the 23 story and docs example files under `packages/shadcn-table/stories` and `apps/shadcn-table-docs/examples` that use `table.store`: same migration rule, so the library lint with `no-deprecated` passes and users copy no deprecated API.
- All three bases. Gate: zero `table.store` in the library, stories and docs examples, Storybook pagination and filter checks green.

### D14 The virtualizer hooks opt out of the React Compiler

- `hooks/useST_RowVirtualizer.ts` and `hooks/useST_ColumnVirtualizer.ts` start with the `'use no memo'` directive, since `useVirtualizer` returns mutable functions the Compiler cannot memoize (F10). Behavior identical. All three bases.

### D15 No unused `_` bindings, no ternaries as statements

- `components/body/ST_TableDetailPanel.tsx:63`: `hover` is dropped without binding `_hover`; `shared/fns/filterFns.ts:180,188`: the unused `_filterValue` parameters are removed (F11).
- `shared/utils/cell.utils.ts:121` and `shared/utils/row.utils.ts:211`: `if / else` instead of a ternary statement (F12).
- All three bases. No behavior change.

### D16 Canonical Tailwind classes, with a gate

- The 22 distinct non-canonical classes (37 sites, F13) take their canonical form in all three bases: `z-[n]` to `z-n`, spacing-scale pixel and rem values to scale steps (`min-h-[100px]` to `min-h-25`, `min-w-[70px]` to `min-w-17.5`, `mt-[3px]` to `mt-0.75`, `size-[18px]` to `size-4.5`, `m-[-0.25rem]` to `-m-1`, and the rest listed in F13), `rotate-[135deg]` to `rotate-135`, `-mx-[0.1rem]` to `mx-[-0.1rem]`, `outline-offset-[-2px]` to `-outline-offset-2`, `[&>[data-align=...]]:py-0` to `*:data-[align=...]:py-0`, the scrollbar `supports-[...]` form to `scrollbar-thin`. Same CSS output.
- The library package moves `tailwindcss` and `@tailwindcss/vite` to `^4.3.3` and adds `@tailwindcss/node` and `@tailwindcss/oxide` as devDependencies (`canonicalizeCandidates` and `scrollbar-thin` need 4.3). Consumer minimum: Tailwind 4.3 or later, stated on the install page, the Versioning section and the changelog.
- New gate `check:tailwind` in `packages/shadcn-table`: loads the design system with `@tailwindcss/node` `__unstable__loadDesignSystem`, runs `canonicalizeCandidates` over every class candidate in the library, fails on any class whose canonical form differs. Runs in CI with the other per-base checks.

### D17 The library lints as a Next 16 consumer does

- `packages/shadcn-table/eslint.config.js`: `eslint-plugin-react-hooks` 7.x with its `recommended` config (React Compiler rules included: `refs`, `immutability`, `set-state-in-effect`, `use-memo`, `preserve-manual-memoization`, `incompatible-library`, `purity`), replacing 5.2.0 `recommended-latest` (root cause of F1 to F12).
- The folded-core exemption block is removed: `@typescript-eslint/no-explicit-any`, `@typescript-eslint/no-unused-expressions`, `react-hooks/exhaustive-deps`, `react-hooks/rules-of-hooks` run on every library file; the `^_` ignore patterns for unused names go, matching `eslint-config-next`.
- `@typescript-eslint/no-deprecated` is added with type-aware linting, so deprecated TanStack or DOM APIs fail `pnpm lint` (F8).
- `pnpm lint` must report zero problems; CI runs it as before.

### D18 Shipped comments state a contract, never history

- A comment in library source is either JSDoc on exported API or one sentence naming a non-obvious invariant or a browser quirk workaround. No MUI, MRT, Radix, upstream, fork or TanStack version narration; nothing that restates the next line (F14, F15, F18).
- A rationale shared by several files is written once where the pattern lives: the composed-ref hook from D5 absorbs the six "user's ref is read through a ref" copies; the three menu notes repeated in five menus are stated once at the menu helper or dropped; the twelve "table.options holds the part props tree-neutral" and twelve "so they are hook subscriptions" lines are removed (F15).
- The 13 long blocks (F18) are cut to that one sentence or removed; `components/inputs/ST_FilterRangeSlider.tsx:78` (F16) is removed.
- The rule is added to `docs/code-of-conduct/coding-standards.md` and to the review checklist. All three bases.

### D19 Suppressions are per line, reasoned, and never stale

- A lint or type suppression exists only where the rule is wrong for that line, carries a reason on the same line, and is never file-wide: the nine file-wide `no-unused-vars` blocks in `features/st*Feature.ts` become per-line or the unused names are fixed (F17).
- Every disable whose cause D7 to D15 removes (11 `no-explicit-any`, 6 `exhaustive-deps`) is deleted with the fix. The 8 reasoned `@ts-expect-error` stay.
- Gate: `linterOptions.reportUnusedDisableDirectives: 'error'` and `@eslint-community/eslint-comments/require-description` in the library ESLint config.
- All three bases.

### D20 One dead export removed, one shared menu-anchor hook

- `shared/utils/style.utils.ts:182` `getCommonToolbarStyles` is deleted (F19). Exported types used only inside their own file or unreferenced in the tree stay exported; they are public type surface.
- The anchor scaffolding copied into `ST_CellActionMenu`, `ST_ColumnActionMenu`, `ST_FilterOptionMenu`, `ST_RowActionMenu`, `ST_ShowHideColumnsMenu` (anchor state, `finalFocus`, invisible span trigger, `onOpenChange` reset) becomes one `hooks/useST_MenuAnchor.ts`, which holds the one copy of the menu rationale (F20, D5, D18). The six-file user-ref block is covered by D5. `handlePinColumn` stays defined in both places.
- All three bases. No behavior change.

## Round 2: next-app header demo and shadcn create, 2026-10-30

### D21 Range filter updaters copy state, number columns get numeric inputs

- `ST_FilterTextField` range updaters copy the previous array before writing (`const next = Array.isArray(old) ? [...old] : ['', '']`), set the index on the copy and return it. Both the debounced change and `handleClear` (F27).
- The `isMounted` ref pattern in the mount effect goes, so the strict-mode re-run no longer seeds `[undefined, '']`. The effect itself follows D8.
- Range inputs on number columns render `type="number"` with `inputMode="decimal"`. Text columns keep a text input.
- One Storybook play test in `Filtering.stories.tsx` types a Min value and asserts the filtered row count.
- Ships in a new part `10-bug-fixes`, branched after part 02. All three bases.

### D22 Ranked results react only to a real global filter change

- The ranked-results effect in `hooks/useST_Effects.ts` keeps the previous global filter value and returns early when `Object.is(prev, next)` holds. `undefined` to `undefined` is no change (F28).
- `appliedSort` handling is otherwise unchanged. Clearing sort with no global filter stays cleared.
- One Storybook play test with the default `enableGlobalFilterRankedResults`: sort a column, clear sort, assert no sort indicator.
- An upstream issue on TanStack store for `atom.js:134` treating an `undefined` old value as always changed. The link goes in the part tracker; no code waits on it.
- Part `10-bug-fixes`, all three bases. The next-app header demo drops its `enableGlobalFilterRankedResults: false` workaround after the fix.

### D23 Pagination `className` lands on the outer element

- `components/toolbar/ST_TablePagination.tsx` merges `className` onto the outer div that carries `py-3`, not the inner `Pagination` nav (F29). A consumer `py-2` wins through `cn`.
- The nav keeps its fixed classes. No new prop.
- Matches `ST_BottomToolbar`, where `toolbarProps.className` lands on the outer element.
- Part `10-bug-fixes`, all three bases. Changelog entry under `### Fixed`.

### D24 Headless example documents the row spacer column

- No library change. The spacer is a real display column in `grid-no-grow` and stays in `getHeaderGroups()` (F30).
- The `custom-headless` example gets one comment at the header map: with resizing on, the default layout is `grid-no-grow` and includes `st-row-spacer`; render it for correct widths, or set `layoutMode: 'grid'`. The aria example gets the same comment at its `getFlatHeaders()` map.
- The headless section of the docs gets the same note in one sentence, linking the column-size guide line that documents the spacer.
- Part 08, docs only, all three bases' examples.

### D25 Collapsible panels use each primitive's designed animation path, one mechanism

- `ST_GlobalFilterTextField` keeps Collapsible. The panel stays mounted (`keepMounted` in base, `forceMount` in radix, default in aria) and is `inert` while closed (F31).
- Width comes from one token on the root, `--st-search-width`, default `14rem`, overridable through the field `className`. No measured primitive variable in any base.
- Same panel classes in all bases: `overflow-hidden w-(--st-search-width) transition-[width,opacity] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none`, closed state `w-12 opacity-0`. Only the closed selector differs: base `data-closed:`, radix `data-[state=closed]:`, aria `aria-hidden:`.
- The field owns its behavior: an effect on `showGlobalFilter` focuses the input, Escape inside the field closes it and returns focus to the toggle button. The `queueMicrotask` focus in `ST_ToggleGlobalFilterButton` goes. Toggle button and field stay separate components.
- The aria panel gets `role="none"`, since no trigger is rendered inside the Collapsible.
- The four height users (`ST_LinearProgressBar`, `ST_ToolbarAlertBanner`, `ST_TableDetailPanel`, `ST_TableHeadCellFilterContainer`) follow the same rule: transitions on the primitive's height variable in base and aria, keyframes in radix, `overflow-hidden` on every panel. The aria collapse that snaps today is fixed by this.
- Width keyframes leave `style.utils.ts` in all bases. Height keyframes stay only where radix needs them.
- Stale animation comments go (D18). Part `10-bug-fixes`. Storybook play test per base: open, input focused, panel wider than `3rem`; close, panel `inert`; Escape returns focus to the toggle.

### D26 Menu anchor pattern stays; its defects are fixed inside the shared hook

- The anchor-span pattern stays in all three bases. Radix `DropdownMenu` has no public anchor API, the stock `dropdown-menu.tsx` parts forward no anchor prop in base or aria, and moving menus onto primitive triggers would break `anchorEl` and `setAnchorEl` on the four exported menus, `actionCell` with `onActionCellChange`, the shared cell menu and the sibling filter-mode menu. D5 and D20 stand (F39).
- Fixes live in `hooks/useST_MenuAnchor.ts` (D20) and apply to all five menus:
  - Openers get `aria-haspopup="menu"` and `aria-expanded` from the anchor state; the hook returns the opener props. The cell `td` gets neither (F39).
  - The span is `aria-hidden`, `tabIndex={-1}` and `inert`. Base sets `tabIndex={-1}` explicitly because `nativeButton={false}` adds a Tab stop; aria drops `role="button"` (F39, F49).
  - While open, the hook re-measures the span rect from the anchor element on `resize` and capture-phase `scroll` (F39).
  - The anchor element is read through a ref at close, never from cleared state (F37, F58). `finalFocus` returns the element and lets the primitive decide (F40).
- The base and radix filter-mode menu inside the column menu becomes `DropdownMenuSub` from the stock part, as aria already does. `ST_FilterOptionMenu` keeps its `anchorEl` mode for the text fields (F57).
- Part `10-bug-fixes`, all three bases. Play test per base: opener announces its expanded state, Tab never lands on the span, the menu follows a resize.

### D27 Show-hide column rows are checkbox menu items with controls beside them

- Each column row in `ST_ShowHideColumnsMenuItems` becomes a `DropdownMenuCheckboxItem` from the stock part: checked means visible, select toggles visibility, so Enter and Space work (F38).
- Pin buttons and the drag handle leave the menuitem and sit in a sibling group in the same row, reachable by Tab. No control is nested inside a menuitem.
- The aria switch no longer sits inside a `Label`; the checkbox item carries the column label (F48).
- Column visibility, pinning and reordering behavior is unchanged. All three bases, part `10-bug-fixes`. Play test per base: arrow to a row, press Space, column hides; Tab reaches the pin buttons.

### D28 Parts used as designed, mechanical remainder

- Aria `ST_Tooltip` triggers are the controls themselves; wrapper spans and labels go. Disabled controls show no tooltip in aria (F41).
- `ST_TableHeadCellFilterLabel` opens its popover with `PopoverTrigger` on the filter button and the stock `PopoverContent`; base drops the hand-built Portal, Positioner and Popup; aria passes a stable ref (F42).
- No `queueMicrotask` focus. The popover uses `initialFocus` in base, `onOpenAutoFocus` in radix, `autoFocus` in aria; "filter by column" hands focus over through the primitive's close-focus hook (F43).
- `tabIndex={0}` removed from `ST_ActionMenuItem` in base and radix (F44).
- `ST_EditCellTextField` wires `FieldDescription` and `FieldError` ids into `aria-describedby` on the input (F46).
- The filter clear chip button gets an `aria-label` from the locale (F47).
- Aria resize handle selects on `aria-[orientation=vertical]` (F52).
- `ST_EditRowModal` and `ST_CellActionMenu` stay mounted in `ST_TableContainer` with `open` toggled (F53).
- `ST_FilterRangeSlider` composes the consumer ref with `useST_ComposedRef` (F54) (D5).
- Base dialog `aria-describedby={undefined}` and base `closeOnClick` with its comment go (F55) (F56).
- Base grouped-by chip spreads `chipProps` before `render` and chains the consumer `onClick`, matching radix and aria (F59).
- Aria `ST_SelectCheckbox` honours `checkboxProps.title` (F60).
- F45 stays open: the per-row radio group works for mouse and keyboard; only the screen reader count and arrow navigation differ.
- No public prop, type, registry item or layout changes. All three bases, part `10-bug-fixes`. One play test per user-reachable behavior: filter popover opens with the input focused, clear chip has a name, modal close animates.

### D29 Headless toolbars get the Button props type and a full-screen container hook

- `ButtonProps` in `types.ts` becomes `React.ComponentProps<typeof Button>` in all bases, so `ST_ToggleGlobalFilterButton`, `ST_ToggleDensePaddingButton`, `ST_ShowHideColumnsButton` and `ST_ToggleFullScreenButton` accept `size` and `variant` by type as they already do at runtime (F32). Type only.
- New exported hook `hooks/useST_FullScreenContainer.ts` taking `table` and returning `{ isFullScreen, containerProps }`; `containerProps` holds the Esc `onKeyDown`, `tabIndex` and the full-screen classes. `ST_TableLayout` uses the same hook, so one copy exists (F32).
- The `custom-headless` example spreads `containerProps` on its wrapper, and the headless docs section gets one line on it.
- Part `10-bug-fixes` for hook and type; part 08 for example and docs. All three bases. Play test: headless story presses Esc in full screen and exits.

### D32 Shadow literals follow the theme

- The four fixed shadow colors (`shared/utils/style.utils.ts` two sites, `components/toolbar/ST_BottomToolbar.tsx:23`, `components/head/ST_TableHeadRow.tsx:22`) take their color from theme variables, for example `color-mix(in oklab, var(--foreground) 15%, transparent)`, so they follow theme and dark mode (F35).
- Nothing else in F35 changes: shadcn styles set literal classes per part and no tokens, so no class of ours could follow a style; `rounded-*` steps and `font-bold` are intent and MRT parity; the base filter popover is fixed by D28 (F42). F35 gets a note recording the refuted premise.
- Part 06, all three bases.

### D30 Icon sets as registry editions, one `icons.ts` per consumer

- Repo source per base: `icons.ts` stays the Lucide map and is the dev default; `icons/tabler.ts`, `icons/phosphor.ts`, `icons/hugeicons.tsx`, `icons/remixicon.ts` export the same 34 keys from their packages, with substitutes picked once per map where a library lacks an icon (density rows, search-off, first and last page) (F33).
- `ST_Icons` becomes `Record<keyof typeof ST_Default_Icons, ComponentType<ST_IconProps>>` with `ST_IconProps` (SVG props plus `size`) in `types.ts` (D10). `ST_Checkbox.tsx` and `components/toolbar/ST_TablePagination.tsx` import from `./icons` instead of `lucide-react`. The `icons` option merge in `useST_TableOptions.ts` is unchanged.
- Registry items per base, generated by `registry:build`:
  - `shadcn-table-core`: every library file except `icons.ts`, no icon dependency.
  - `shadcn-table`: file `icons.ts`, dependency `lucide-react`, registry dependency `core`. Name and hosted path unchanged.
  - `shadcn-table-tabler`, `shadcn-table-phosphor`, `shadcn-table-hugeicons`, `shadcn-table-remixicon`: file `icons/<library>.ts` with `target` at the `icons.ts` path, that icon package as dependency, registry dependency `core`.
  - Locale items and docs example items depend on `shadcn-table-core`.
- A consumer ends with one `icons.ts` holding their library's map and only that icon package installed. Switching later is the edition item with `--overwrite`; core files are identical and skipped.
- Verified on shadcn 4.23.0: dependencies resolve core first and files dedupe by target, a later edition replaces `icons.ts` under `--overwrite` without a prompt, and a module importing an uninstalled package fails the build, so no runtime choice exists.
- Docs: install page command gets an icon library selector that changes the item name; an Icons guide covers switching and notes the previous icon package stays in `package.json`. The docs app `lib:install`, the next-app and the part 09 gate install editions.
- New part `11-icon-sets` after part 01; docs in part 08. All three bases.
- Amended 2026-10-31: `icons/hugeicons.ts`, not `.tsx`; the per-icon wrapper uses `createElement`, since the file installs at the `icons.ts` target and JSX in a `.ts` file fails the consumer build.

### D31 Logical direction classes, JS only where CSS cannot express it

- The 20 static physical sites per base and the resize handle's cva `compoundVariants` become logical classes: `ms-*`, `me-*`, `pe-*`, `start-*`, `end-*`, `text-start`, `text-end`. The handle keeps one direction-neutral `end-*` position and no direction variant (F34).
- Pinned sticky offsets in `shared/utils/style.utils.ts` use `insetInlineStart` and `insetInlineEnd`; the pixel values stay computed. The resize border on cells becomes `borderInlineEnd`.
- JS keeps only the drag `translateX` sign and the pinning pixel values. `columnResizeDirection` stays as the TanStack option for drag math; the docs say to set it to `'rtl'` on RTL pages.
- Verified: today the CLI's `transformRtl` skips `compoundVariants` and inline styles, so no double flip exists; after this change it finds no physical class to rewrite either.
- Gate: `check:tailwind` fails on any physical direction class (D16). Part 06, all three bases. Part 09 adds one story check with `dir="rtl"` (unverified rendering today).

### D33 Install docs cover shadcn create and offer a registry namespace

- The install page gets a short "Created with shadcn create" section: the table follows base, theme, base color, radius, menu accent and fonts through the installed parts; the icon library is chosen by the edition item (D30); RTL pages set `columnResizeDirection: 'rtl'` (D31) (F36).
- An optional "Short form" toggle on the install command component reveals the `components.json` entry `"registries": { "@shadcn-table": "https://www.shadcn-table.com/r/{style}/{name}.json" }` and the short form `shadcn add @shadcn-table/<item>`. Verified: the CLI fills `{style}` with the project's literal `style` value such as `base-nova`.
- Hosting adds three rewrite rules, `/r/base-*/`, `/r/radix-*/` and `/r/aria-*/` to the matching base folder. Existing hosted paths are unchanged.
- The full-URL single command is the default everywhere, with base, package manager and icon library selectors; registering the namespace is never required. Item names carry the icon choice in both forms.
- Part 08, docs and hosting config only. No library change.
- Note 2026-10-31: the three rewrites already exist in the docs `next.config.mjs`; part 08 verifies them, adds none.
