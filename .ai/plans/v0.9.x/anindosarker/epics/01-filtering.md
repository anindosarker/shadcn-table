# 01: Filter modes on by default, select clear button
- Sprint: S1

Follow the project planning rules: docs/code-of-conduct/planning-guidelines.md, CLAUDE.md:9. Keep the expedition contract.

## 1. Architecture

### 1.1 Overview

A table with column filtering shows a plain input per column and no mode picker unless the consumer sets `enableColumnFilterModes`; the option has no default (`hooks/useST_TableOptions.ts:36-62` lists every other default). D4 turns it on by default, keeps every variant's mode list as it is, and gives multi-select three labelled array modes. Once a select filter has a value, its clear button is drawn over the `SelectTrigger` chevron because the trigger's `pe-9` loses to the shadcn base `pr-2` (F1); D1 swaps it for `pr-9`. Three bases, byte-identical.

### 1.2 Goals

- A table with no `enableColumnFilterModes` shows the mode picker in chips, subheader and popover display modes; `enableColumnFilterModes: false` on the table or a column still hides it (D4).
- Mode lists unchanged: text, autocomplete, select, date, datetime and time keep all 14; range variants keep between and betweenInclusive; range-slider and checkbox none. Multi-select shows Includes any, Includes all and Excludes after its 14 (D4).
- A select filter with a value shows its chevron left of the clear button, never under it (D1).
- The column-filtering guide, the prop tables and every docs example read as if modes were always on; no example sets `enableColumnFilterModes: true`.
- Acceptance: programmatic. The plays of 1.6.5 (`ModePickerByDefaultChips`, `ModePickerByDefaultSubheader`, `ModePickerByDefaultPopover`, `MultiSelectArrayModes`, `SelectClearBesideChevron`) pass in `test:base`, `test:radix` and `test:aria` and fail on the shipped code first, the red lines recorded in the tracker (P11); `grep -rn "enableColumnFilterModes: true" apps/shadcn-table-docs/examples apps/shadcn-table-docs/content` empty, `grep -rn "enableColumnFilterModes$" apps/shadcn-table-docs/examples` empty; `pnpm test validate-repo` green (bases identical, tailwind classes valid).

### 1.3 Current structure

```
packages/shadcn-table/registry/<base>/components/ui/shadcn-table/
├── hooks/useST_TableOptions.ts:36-62         ← defaults; enableColumnFilterModes absent, so undefined
├── components/inputs/ST_FilterTextField.tsx  ← :176 mode button gated on the option; select trigger `pe-9` at radix :544, base :560, aria :591
├── components/menus/ST_FilterOptionMenu.tsx  ← :26-113 stFilterOptions (14 entries); :117 arrModes; :179-190 list filtered per column
├── shared/utils/filterSummary.utils.ts       ← :46-65 getFilterModeOptions (chip editor list)
├── shared/fns/filterFns.ts                   ← :205-227 arrIncludesSomeOrValue registered as arrIncludesSome; no arrIncludesNone
├── shared/utils/column.utils.ts:179          ← multi-select default filterFn arrIncludesSome
├── types.ts:380-396                          ← ST_Localization filter* keys
└── shared/locales/<39 files>.ts              ← one line per key, translated
apps/shadcn-table-docs/
├── content/docs/guides/column-filtering.mdx:247-253, :305; filter-chips.mdx:54; production-ready-tables.mdx:282; examples/subheader-filters.mdx:6
├── lib/prop-tables/tableOptions.ts:284-292 (defaultValue 'false'); columnOptions.ts:213
└── examples/<base>/**/*.tsx                  ← `enableColumnFilterModes: true` or the bare prop in advanced, customize-filter-modes, persistent-view, subheader-filters, server-side-data/components/UsersTable.tsx and the 39 localization-i18n-* examples, per base
test/docs-e2e/lib/examples.mjs:410-411        ← asserts the customize-filter-modes code shows `enableColumnFilterModes: true`
```

### 1.4 Target structure

```
packages/shadcn-table/registry/<base>/components/ui/shadcn-table/
├── hooks/useST_TableOptions.ts               ← `enableColumnFilterModes = true,` among the defaults
├── components/inputs/ST_FilterTextField.tsx  ← select trigger `pr-9` (D1); nothing else
├── components/menus/ST_FilterOptionMenu.tsx  ← stFilterOptions gains three array entries, shown for multi-select only; arrModes lists arrIncludesNone
├── shared/utils/filterSummary.utils.ts       ← the same multi-select rule for the chip editor list
├── shared/fns/filterFns.ts                   ← arrIncludesNone registered in ST_FilterFns
├── types.ts                                  ← filterArrIncludesSome, filterArrIncludesAll, filterArrIncludesNone
└── shared/locales/*.ts                       ← the three keys in every locale
apps/shadcn-table-docs/                       ← guide text, prop tables, examples without the flag
test/docs-e2e/lib/examples.mjs                ← asserts `enableColumnFilterModes: false` instead
```

### 1.5 Flow: none

### 1.6 Components

#### 1.6.1 Data artifacts

- `CHANGELOG.md` (P9): `#### Epic 01 Filtering` under `## Unreleased` (the block created if missing): modes on by default, the multi-select modes, the select clear button fix (D1, D4, F1).
- `apps/shadcn-table-docs/components/ui-<base>/` and `public/r/`: regenerated at merge, never hand-edited (P9).
- The tracker `trackers/01-filtering-tracker.md`: the red run of each play on the shipped code (P11).

#### 1.6.2 Default (D4)

- `useST_TableOptions.ts`: `enableColumnFilterModes = true,` in the destructured defaults, alphabetical with its neighbours; the option flows out as today. Material React Table defaults it off; this deviation is D4.
- Does NOT change `stConfigFeature.ts` (the option type stays `enableColumnFilterModes?: boolean`), `ST_ColumnActionMenu.tsx`, `ST_FilterRangeFields.tsx`, `ST_FilterRangeSlider.tsx`: they read the resolved option and start showing their mode UI on their own.

#### 1.6.3 Multi-select modes (D4)

- `shared/fns/filterFns.ts`: `arrIncludesNone` beside `arrIncludesSomeOrValue`: true when the selection is empty, else when no selected value is in the array cell value (membership test for a scalar value); `autoRemove` the same as `arrIncludesSomeOrValue`. Registered in `ST_FilterFns` after `arrIncludesSome`; `ST_FilterOption` (`types.ts:745`) picks it up from the keys.
- `ST_FilterOptionMenu.tsx`: three entries appended to `stFilterOptions`: `{ label: localization.filterArrIncludesSome, option: 'arrIncludesSome' }`, `arrIncludesAll`, `arrIncludesNone`, with symbols in the file's style; the per-column list (`:179-190`) and `getFilterModeOptions` (`filterSummary.utils.ts:63-65`) keep the three only when `columnDef.filterVariant === 'multi-select'` and drop them for every other variant, so the other lists stay at 14 and the global filter list stays at three. `arrModes` adds `'arrIncludesNone'` so switching to it resets the value to `[]` as the other array modes do (`:218-225`).
- `types.ts`: `filterArrIncludesSome`, `filterArrIncludesAll`, `filterArrIncludesNone` in `ST_Localization`, alphabetical. `shared/locales/en.ts`: `'Includes any'`, `'Includes all'`, `'Excludes'`. Every other locale: the three keys translated into that locale's language in the style of its `filterContains` line (the type makes every key mandatory).
- Does NOT change the default fn (`column.utils.ts:179`, still `arrIncludesSome`), so a multi-select mode picker opens with Includes any checked.

#### 1.6.4 Select clear button (D1, F1)

- `ST_FilterTextField.tsx`, the `SelectTrigger` className: `hasFilterValue && 'pe-9'` becomes `hasFilterValue && 'pr-9'` (radix :544, base :560, aria :591); tailwind-merge then drops the base `pr-2` and the chevron sits left of the overlaid clear button. The comment line above it stays.
- Does NOT move the clear addon (`:335-347`) or touch multi-select.

#### 1.6.5 Plays (P11)

- `stories/features/Filtering.stories.tsx`: `ModePickerByDefaultSubheader` (a table with `columnFilterDisplayMode: 'subheader'` and no `enableColumnFilterModes`; the play asserts the mode button of the Name filter renders and opens the 14-entry menu) and `ModePickerByDefaultPopover` (the same with `'popover'`).
- `stories/features/FilterChips.stories.tsx`: `ModePickerByDefaultChips` (chips mode, no flag; the play adds a Name chip, opens its editor and asserts the header mode menu); `MultiSelectArrayModes` (a multi-select column; the play opens its chip editor's mode menu, asserts the three labels after the 14, picks Excludes with one value and asserts the matching rows are gone); `SelectClearBesideChevron` (a select column with a value; the play asserts the chevron `svg` inside the `SelectTrigger` has `getBoundingClientRect().right` at or left of the clear button's `left`).
- Each play runs on the shipped code first and must fail there; the red line goes to the tracker.

#### 1.6.6 Docs and examples

- `column-filtering.mdx:247-253`: the modes section says the picker is on by default and `enableColumnFilterModes: false` on the table or a column turns it off; the code block at `:253` and `:305` drops the `true` line. `filter-chips.mdx:54`: "When a column has filter modes (the default) and ..." wording; `production-ready-tables.mdx:282` and `examples/subheader-filters.mdx:6` the same way.
- `lib/prop-tables/tableOptions.ts:284-292`: `defaultValue: 'true'`, description says modes are on and how to turn them off; `columnOptions.ts:213` description the same.
- Examples, three bases: the table-level `enableColumnFilterModes: true` and the bare `enableColumnFilterModes` prop removed from advanced, customize-filter-modes (the table line `:69`; the two column-level `false` lines stay, they are the example), persistent-view (the Name column's `:71` with its comment line `:70`), subheader-filters (`:120`, the comment moves to the `columnFilterDisplayMode` line), server-side-data `UsersTable.tsx`, and the 39 `localization-i18n-*` examples (`:39` or `:41`). `examples-*-diff.json` unchanged (P9).
- `test/docs-e2e/lib/examples.mjs:411`: the customize-filter-modes code check reads `enableColumnFilterModes: false`.

### 1.7 Dependencies and env: none

## 2. Instructions for AI

### 2.1 Milestones

### Milestone: Filtering

- Files owned: `packages/shadcn-table/registry/<base>/components/ui/shadcn-table/hooks/useST_TableOptions.ts`, `.../components/inputs/ST_FilterTextField.tsx`, `.../components/menus/ST_FilterOptionMenu.tsx`, `.../shared/utils/filterSummary.utils.ts`, `.../shared/fns/filterFns.ts`, `.../types.ts`, `.../shared/locales/*.ts` (three bases), `packages/shadcn-table/stories/features/Filtering.stories.tsx`, `packages/shadcn-table/stories/features/FilterChips.stories.tsx`, `apps/shadcn-table-docs/content/docs/guides/column-filtering.mdx`, `apps/shadcn-table-docs/content/docs/guides/filter-chips.mdx`, `apps/shadcn-table-docs/content/docs/guides/production-ready-tables.mdx`, `apps/shadcn-table-docs/content/docs/examples/subheader-filters.mdx`, `apps/shadcn-table-docs/lib/prop-tables/tableOptions.ts`, `apps/shadcn-table-docs/lib/prop-tables/columnOptions.ts`, `apps/shadcn-table-docs/examples/<base>/**/*.tsx` (three bases), `test/docs-e2e/lib/examples.mjs`
- Depends on: none
- Review: none
- Local CI: `pnpm test typecheck --base <base>` and `pnpm test storybook-tests --base <base>` for base, radix and aria one after another (P5), `pnpm test lint`, `pnpm test validate-repo`, `pnpm test docs-e2e --base base`
- Task 1: Reproduce: write the five plays of 1.6.5, run them on the shipped code, record the red lines in the tracker. Checks: `ST_BASE=radix vitest run stories/features/Filtering.stories.tsx stories/features/FilterChips.stories.tsx` red on the five
- Task 2: Library: 1.6.2, 1.6.3 and 1.6.4 in radix, then base and aria as byte-identical copies. Checks: `pnpm --filter shadcn-table tsc:radix`, `tsc:baseui`, `tsc:aria`; the same vitest command per base, one after another (P5), green on the five and on every other filtering play; `pnpm --filter shadcn-table lint`
- Task 3: Docs and examples: 1.6.6. Checks: `pnpm --filter shadcn-table-docs lint`; `pnpm test docs-e2e --base base`
- Task 4: Cleanup: `pnpm format`, the changelog block of 1.6.1, the two greps of 1.2 empty. Checks: 2.2

### 2.2 Checks

- `pnpm test typecheck --base <base>` and `pnpm test storybook-tests --base <base>` green for base, radix and aria, one base at a time (P5); `pnpm test lint` green
- `pnpm test validate-repo` green: bases identical, tailwind classes valid, registry valid
- `pnpm test docs-e2e --base base` green (`examples.mjs` and the guides pages changed)
- Review: none (checks only; a default change, no option removed, P7)
