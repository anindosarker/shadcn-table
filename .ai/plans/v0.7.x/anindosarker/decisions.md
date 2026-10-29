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
- Menu anchors: `ST_ColumnActionMenu`, `ST_FilterOptionMenu`, `ST_RowActionMenu`, `ST_ShowHideColumnsMenu` keep the last non-null anchor in `useState`, updated in an effect, instead of `anchorRef.current = anchorEl` in render (F2).
- Latest-value refs in `hooks/useST_Effects.ts` (`latestTable`, `latestCheckPageIndex`) become `useEffectEvent` handlers; the `react` and `react-dom` peer ranges move from `^19.1.1` to `^19.2.0` (F2).
- `hooks/useST_TableInstance.ts` (the 39 hits from the `tableRef.current?.store.state` read) is out of scope here; a design note comes first, then its own decision.
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

- The 15 `exhaustive-deps` sites (F9: `hooks/useST_Effects.ts` 6, `hooks/useST_ColumnVirtualizer.ts` 3, `hooks/useST_Rows.ts` 2, `hooks/useST_TableInstance.ts` 2, `hooks/useST_TableOptions.ts` 1, `shared/utils/column.utils.ts` 1) list every value they read; `table` is stable, so adding it changes nothing at runtime.
- Mount-only effects by design keep `[]` with one `// eslint-disable-next-line react-hooks/exhaustive-deps` and a reason.
- Complex expressions in dependency arrays are extracted to locals first (with D9).
- All three bases. No behavior change.

### D13 No `table.store` access; `table.Subscribe`, atoms and per-atom subscriptions instead

- The 30 `<Subscribe source={table.store} selector={s}>` sites become `<table.Subscribe selector={s}>` (source defaults to the store inside react-table, same selector, same shallow compare, same re-render set) (F8).
- The 11 `table.store.state.<slice>` snapshot reads (handlers, effects, utils under a subscription) become `table.atoms.<slice>.get()`; `getDefaultColumnOrderIds` takes the slices it reads instead of the whole state (F8).
- `hooks/useST_Effects.ts:114`: the debounced page index check subscribes to the atoms that change the pre-paginated row count (`columnFilters`, `globalFilter`, `columnFilterFns`, `globalFilterFn`, `grouping`, `expanded`, `pagination`, `isLoading`, `showSkeletons`) instead of `table.store.subscribe` on every state change; accepted narrowing, closer to MRT (F8).
- `hooks/useST_TableInstance.ts:225` `useSelector(table.store, ...)` goes with D6.
- All three bases. Gate: zero `table.store` in the library, Storybook pagination and filter checks green.

### D14 The virtualizer hooks opt out of the React Compiler

- `hooks/useST_RowVirtualizer.ts` and `hooks/useST_ColumnVirtualizer.ts` start with the `'use no memo'` directive, since `useVirtualizer` returns mutable functions the Compiler cannot memoize (F10). Behavior identical. All three bases.

### D15 No unused `_` bindings, no ternaries as statements

- `components/body/ST_TableDetailPanel.tsx:63`: `hover` is dropped without binding `_hover`; `shared/fns/filterFns.ts:180,188`: the unused `_filterValue` parameters are removed (F11).
- `shared/utils/cell.utils.ts:121` and `shared/utils/row.utils.ts:211`: `if / else` instead of a ternary statement (F12).
- All three bases. No behavior change.

### D16 Canonical Tailwind classes, with a gate

- The 22 distinct non-canonical classes (37 sites, F13) take their canonical form in all three bases: `z-[n]` to `z-n`, spacing-scale pixel and rem values to scale steps (`min-h-[100px]` to `min-h-25`, `min-w-[70px]` to `min-w-17.5`, `mt-[3px]` to `mt-0.75`, `size-[18px]` to `size-4.5`, `m-[-0.25rem]` to `-m-1`, and the rest listed in F13), `rotate-[135deg]` to `rotate-135`, `-mx-[0.1rem]` to `mx-[-0.1rem]`, `outline-offset-[-2px]` to `-outline-offset-2`, `[&>[data-align=...]]:py-0` to `*:data-[align=...]:py-0`, the scrollbar `supports-[...]` form to `scrollbar-thin`. Same CSS output.
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
