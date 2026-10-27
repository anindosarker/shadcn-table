# 03: storybook, tracker

Deviations and gate results. Plan: [03-storybook.md](03-storybook.md). Rulings: [decisions.md](decisions.md) items 3 to 8. Parts 01 and 02: [01-tracker.md](01-tracker.md), [02-tracker.md](02-tracker.md).

## Deviations

### Story ids

- `features-fn-registries--*`, `features-phase-two-verify--*` and `features-phase-three-verify--*` are gone; their files are deleted and every story moved into a plan 1.4 target file under the same export name (mapping below). Nothing linked them: `check-storybook.mjs` reads the first story id from `index.json`, and the docs app has no story ids.
- `Memod.stories.tsx` and the `memoMode` Virtualization variants were already removed in part 01.
- `features-pagination--pagination-disabled-manual-pagination-false` (part 01, `80f28a0`) stays; `fixed-bugs-pagination-disabled--pagination-disabled-twenty-five-rows` asserts the same 25 rows.

### Part 01 and 02 verify stories, new home

| From | Story | To |
| --- | --- | --- |
| FnRegistries | CustomColumnFilterFn, CustomGlobalFilterFn, DefaultFuzzyGlobalFilter, CustomSortFn, CustomAggregationFn, TwoTablesDifferentRegistries, UnknownFilterFnName | features/CustomFilterFns |
| FnRegistries | ControlledInputInCustomToolbar, ProviderWithTwoTables | features/TableProvider |
| PhaseTwoVerify | ShiftRangeExternalAtom | features/RowPinningOnSelect |
| PhaseTwoVerify | PaginationDisabledTwentyFiveRows, ColumnFiltersWithEveryFilterFlagOff | fixed-bugs/PaginationDisabled |
| PhaseTwoVerify | HeadlessDisplayColumnHeaders, HeadlessDisplayColumnHeaderComponents | fixed-bugs/HeadlessDisplayColumn |
| PhaseTwoVerify | GlobalFilterModeSwitch | features/CustomFilterFns |
| PhaseThreeVerify | ProgrammaticGlobalFilterMode, ProgrammaticColumnFilterMode | features/CustomFilterFns |
| PhaseThreeVerify | RootSkipsStateRenders, DataReplacement, ControlledPagination, ProfiledThousandRows, RowModelFollowsState, ControlledDensityAndSelection, ExternalAtomsDensityAndSelection | styling/RenderCounts |
| PhaseThreeVerify | OptionChangeAfterMount, PortalsReadContext, NoProviderThrows | features/TableProvider |
| PhaseThreeVerify | NestedDetailPanelTable | features/NestedTable |
| PhaseThreeVerify | CellActionMenuEditKeepsFocus | fixed-bugs/CellActionMenuEdit |

New stories: `CustomFilterFns` `AggregationFnArray`, `ColumnFilterModeSwitch` (decision 3, the `ST_FilterOptionMenu` switch and its helper label); `RowPinningOnSelect` select-top and select-bottom with internal, controlled and external-atom selection (6); `TableProvider` `HandComposition`.

### Verify items, how asserted

- Decision 3, unknown name logs core's dev warning: the `console.warn` spy is asserted only when `process.env.NODE_ENV` is `development` (Storybook dev). Under vitest core does not warn; the play asserts every row stays and nothing throws.
- Decision 5, toggle density: the density button itself commits (it renders the density); the other toolbar buttons do not.
- Decision 4, guide examples in `check-pages.mjs`: part 04.
- Stories tsc under `ST_BASE=base`: not honoured. `tsconfig.stories.json` includes `registry/radix` only (02-tracker); the base tree is covered by `test:base` and `storybook:build:base`.

### Library finding (not fixed here)

- `shared/utils/column.utils.ts:84` writes the picked filter mode onto the column def the user passed (`columnDef.filterFn = filterFn`), and `hooks/useST_TableInstance.ts:100-103` seeds `columnFilterFns` from `col.filterFn` first. A module-level `columns` array therefore carries the last picked mode into the next mount: pick Starts With, remount with `key`, the label still reads `Filter Mode: Starts With` and the column def holds `filterFn: 'startsWith'` (fuzzy expected). Both trees. `ColumnFilterModeSwitch` builds its columns per render to stay independent of story order.

### Existing stories

- 53 files imported `ShadcnTable` from `@/components/ui/shadcn-table/ShadcnTable`; now the barrel. `CellActions` takes `ST_ActionMenuItem` from the barrel; `SubRowTree` drops the `shared/locales/he` import for an inline `Partial<ST_Localization>` (16 keys).
- `DetailPanel` `DetailPanelSingleExpand`: `ST_ExpandButton` already calls `row.toggleExpanded()` before the user `onClick` (`ST_ExpandButton.tsx:58-62`); the story only collapses the other rows, play added.
- `Editing`: play on `EditingEnabledEditModeModalDefault` (the row action Edit opens the modal with the live row, Cancel closes it); `EditingEnabledEditModeRowCustomSave` reads `creatingRow` through `<Subscribe source={table.atoms.creatingRow}>`.
- `Selection`: the `[table.state.sorting]` effect becomes a `table.atoms.sorting.subscribe` effect.
- External-atom stories create their atom with `table._reactivity.createWritableAtom` (public table property); the package has no direct `@tanstack/store` dependency.

## Gates

- `npx tsc -p tsconfig.stories.json --noEmit`, `pnpm lint`: pass, no output.
- `pnpm test`: `Test Files 62 passed (62)`, `Tests 437 passed (437)` before `ColumnFilterModeSwitch`; the file then 12 of 12 on both bases.
- `pnpm test:base`: `Test Files 62 passed (62)`, `Tests 437 passed (437)`, same note.
- `pnpm storybook:build`, `pnpm storybook:build:base`: `Storybook build completed successfully`.
- `node scripts/check-storybook.mjs --base http://localhost:6066` on a Python static server over `storybook-static`: `14 passed, 0 failed`.
- Greps over `stories/`: `memoMode` none; `table={table}` only on `ShadcnTable` and `ST_TableProvider`; `shadcn-table/{hooks,features,shared,components}/` and `shadcn-table/ShadcnTable` none; `table.state` none; em dash none.

## Gates, verifier run (clean tree at `0cb8715`)

- `npx tsc -p tsconfig.stories.json --noEmit`: pass, no output. The same command with `ST_BASE=base`: pass, no output (the env is not read by that tsconfig, see above).
- `pnpm lint`: pass, exit 0, no output.
- `pnpm test`: `Test Files 62 passed (62)`, `Tests 438 passed (438)`.
- `pnpm test:base`: `Test Files 62 passed (62)`, `Tests 438 passed (438)`.
- `pnpm storybook:build`, `pnpm storybook:build:base`: `Storybook build completed successfully`, both.
- `node scripts/check-storybook.mjs --base http://127.0.0.1:6066` (Python static server over `storybook-static`): `14 passed, 0 failed`.
- Greps over `stories/`: `memoMode` none; `table={table}` only on `ShadcnTable` and `ST_TableProvider`; `shadcn-table/{hooks,features,shared,components}/` none; `table.state` none; em dash none.
- Playwright over the eight target files, 43 stories each, radix build on `:6066` and base build on `:6067` (`storybook-static/base`): every story `storyFinished` with `status: success`, no `playFunctionThrewException`, no page error. One console error on both bases, `features-table-provider--no-provider-throws`: React's default caught-error log for the `useTableContext` throw that the story's error boundary catches on purpose; the play asserts that message, so this is the story's expected output, not a defect.
