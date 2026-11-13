# 40: Date filters compare dates
- Epic: E12

Follow the project planning rules: docs/code-of-conduct/planning-guidelines.md, CLAUDE.md:9. Keep the expedition contract.

## 1. Architecture

### 1.1 Overview

With `filterVariant: 'date'` (also `datetime`, `time` and their ranges) the filter input hands the column filter a string: `'2025-11-02'`, `'2025-11-02T10:00'` or `'10:00'`. The comparison functions in `shared/fns/filterFns.ts` then compare that string with the row value's text form; for a `Date` row value that is `"sun nov 02 2025 ..."`, so every mode is wrong: `greaterThan` and `greaterThanOrEqualTo` keep every row, `lessThan`, `lessThanOrEqualTo` and `equals` none, `notEquals` every row, `between` and `betweenInclusive` none once the upper bound is set, and a plain `'date'` column with no `filterFn` falls to `fuzzy` and keeps none (Q67, lookup in D81). Material React Table passes dayjs objects, so its greater, less and between modes work: this is a port deviation. Columns that hold ISO strings work today. D81 fixes the comparison where it happens and keeps filter values as strings. The owner also saw the react-query example keep rows dated before the filter date on the live 0.9.3 site; that example filters in its own mock route, which compares dates correctly but ignores the filter mode and builds its data with random dates per call, so its symptom has a second cause that this spec finds and fixes.

### 1.2 Goals

- For a row value that is a `Date`, the eight comparison modes (`equals`, `notEquals`, `greaterThan`, `greaterThanOrEqualTo`, `lessThan`, `lessThanOrEqualTo`, `between`, `betweenInclusive`) compare date values (D81).
- A date-only filter value reads as local midnight and equality compares by calendar day; an `HH:mm` value compares time of day; a datetime value compares the instant to the minute (D81).
- Filter values stay strings in table state (D81).
- A column with `filterVariant: 'date'`, `'datetime'` or `'time'` and no `filterFn` defaults to `equals`, not `fuzzy` (D81).
- ISO string accessors and number columns filter exactly as today.
- On the react-query example a date filter shows only rows that match it, in every mode the example offers, and the rows are the same from one request to the next (D81).
- Acceptance: programmatic. Plays in `stories/features/DateFilters.stories.tsx` on a table whose `joined` accessor returns `Date` values from fixed data, on the three bases: `GreaterThanOnDateColumn` and `LessThanOnDateColumn` fail on the code before the change (P11, recorded: every row kept, no row kept) and pass after with the exact expected row count; `EqualsMatchesCalendarDay`, `BetweenInclusiveOnDateColumn`, `TimeOfDayOnDateColumn` (variant `time`, `greaterThan`), `PlainDateVariantDefaultsToEquals` (no `filterFn`) and `IsoStringColumnUnchanged` pass after. For the route: on a production build served on a P6 port, `curl -s 'localhost:<port>/api/data?start=0&size=100&filters=[{"id":"lastLogin","value":"2025-11-02"}]'` (URL-encoded) returns only rows whose `lastLogin` is after 2025-11-02 local midnight, and the same request twice returns identical `lastLogin` values (both outputs in the tracker); `pnpm test docs-e2e --base base` green.

### 1.3 Current structure

```
packages/shadcn-table/registry/<base>/components/ui/shadcn-table/   (identical on the three bases)
├── shared/fns/filterFns.ts:85-91,95-101      ← equals, notEquals: row text === filter text
├── shared/fns/filterFns.ts:105-116,119-127   ← greaterThan, greaterThanOrEqualTo: numbers when both sides are numeric, else text compare
├── shared/fns/filterFns.ts:130-141,144-152   ← lessThan, lessThanOrEqualTo: the same
├── shared/fns/filterFns.ts:155-167,170-185   ← between, betweenInclusive: built on the four above
├── shared/fns/filterFns.ts:24-41             ← fuzzy (match-sorter rank); the default of a plain date variant
├── shared/utils/column.utils.ts:207-217      ← getDefaultColumnFilterFn: multi-select, range, select and checkbox have defaults; everything else 'fuzzy'
└── components/inputs/ST_FilterTextField.tsx:420-426,477-497 ← the native inputs send event.target.value (not changed here; spec 39 owns the file)

apps/shadcn-table-docs/
├── app/api/data/route.ts:25-39               ← lastLogin: new Date(row) > new Date(filterValue), whatever the filter mode; other columns: text includes
├── app/api/data/db.ts:1411-1414              ← getData(): the rows are mapped with lastLogin: randomDate(...) on every call
├── examples/<base>/react-query/TS.tsx:127-134 ← accessorFn new Date(row.lastLogin), filterFn 'greaterThan', filterVariant 'date'; :86 sends columnFilters as JSON; :95 keepPreviousData
└── examples/<base>/{advanced,subheader-filters,customize-filter-variants}/ ← Date accessors filtered client side: broken today, fixed by the library change, no file change
```

- Not affected: `persistent-view` (ISO strings), `server-side-data` (`app/api/users/route.ts:27-30` compares by `getTime()`).
- `new Date('2025-11-02')` is UTC midnight; `new Date(2025, 10, 2)` is local midnight.

### 1.4 Target structure

```
shared/fns/filterFns.ts                        ← a Date row value is compared as a date in the eight modes
shared/utils/column.utils.ts                   ← date, datetime and time variants default to 'equals'
packages/shadcn-table/stories/features/DateFilters.stories.tsx ← new: the plays of 1.2
apps/shadcn-table-docs/app/api/data/route.ts   ← honours the filter mode sent for lastLogin; date-only values read as local midnight
apps/shadcn-table-docs/app/api/data/db.ts      ← lastLogin values fixed per process, not per call
CHANGELOG.md (P9)                              ← #### Spec 40 Date filter compare and #### Spec 40 React Query route dates under ### Fixed
```

### 1.5 Flow: none

### 1.6 Components

#### 1.6.1 Data artifacts

- `CHANGELOG.md` (P9): `#### Spec 40 Date filter compare` under `## Unreleased`, `### Fixed`: date, datetime and time filters now work on columns that hold `Date` values; a date column without a `filterFn` filters by day (D81). `#### Spec 40 React Query route dates` under `### Fixed`: the React Query example's date filter (D81).
- Generated (P9): `registry.json`, `apps/shadcn-table-docs/components/ui-<base>/`.

#### 1.6.2 Date comparison (D81)

`shared/fns/filterFns.ts`, status `refactor`, the same edit in the three copies.

- One internal helper decides the comparable pair when `row.getValue(id)` is a `Date` with a valid time: a filter value matching `YYYY-MM-DD` becomes the local midnight of that day and the row value is truncated to its local day; a value matching `HH:mm` (optionally `:ss`) becomes minutes since local midnight and the row value its own minutes since local midnight; a value matching `YYYY-MM-DDTHH:mm` becomes that local instant and the row value is truncated to the minute; a `Date` filter value compares by `getTime()`. Any other filter value, or an invalid row date, leaves the function on today's path.
- `equals`, `notEquals`, `greaterThan`, `greaterThanOrEqualTo`, `lessThan`, `lessThanOrEqualTo` use the pair when the helper returns one; `between` and `betweenInclusive` get the fix through them and keep their empty-bound and swapped-bound rules.
- Number and string row values take exactly today's branches: no change in behaviour for them.
- Does NOT change `fuzzy`, `contains`, `startsWith`, `endsWith`, `empty`, `notEmpty`, the array modes, the exported names or signatures (P7), or what the inputs send.

#### 1.6.3 Default mode (D81)

`shared/utils/column.utils.ts`, status `refactor`, three copies.

- `getDefaultColumnFilterFn`: a `filterVariant` of `date`, `datetime` or `time` returns `'equals'`; the range variants keep `'betweenInclusive'`.

#### 1.6.4 React Query route (D81)

`apps/shadcn-table-docs/app/api/data/route.ts`, `db.ts`, status `refactor`.

- First reproduce the owner's symptom on a production build of the code before the change: open `/docs/examples/react-query`, add a Last Login filter "greater than" with a date typed digit by digit, and record in the tracker the requests sent (the `filters` parameter of each), the rows returned and the rows shown. Name the cause from that record; the fix below covers the two defects known from the code, and the cause found is fixed in these files or in the example file, never worked around in the library.
- `db.ts`: the `lastLogin` values are generated once per process (module scope), so two requests see the same rows.
- `route.ts`: a date-only filter value reads as local midnight; the comparison follows the mode the example sends (the example sends the column's filter mode with each filter when it offers more than one; with the single `greaterThan` mode of today the route keeps `>`).
- `examples/<base>/react-query/TS.tsx` changes only if the reproduction shows the client at fault (for example a request sent for a half-typed year; with spec 39 merged a typed date commits on Enter or blur). The three copies stay in step.
- Does NOT change the route's pagination, sorting or global filter code, or `app/api/users/route.ts`.

**Stays unchanged:** `ST_FilterTextField.tsx`, the examples `advanced`, `subheader-filters`, `customize-filter-variants`, `persistent-view`, `server-side-data`, `live-demo`.

### 1.7 Dependencies and env: none

## 2. Instructions for AI

### 2.1 Milestones

### Milestone: Date filter compare

- Files owned: `packages/shadcn-table/registry/base/components/ui/shadcn-table/shared/fns/filterFns.ts`, `packages/shadcn-table/registry/radix/components/ui/shadcn-table/shared/fns/filterFns.ts`, `packages/shadcn-table/registry/aria/components/ui/shadcn-table/shared/fns/filterFns.ts`, `packages/shadcn-table/registry/base/components/ui/shadcn-table/shared/utils/column.utils.ts`, `packages/shadcn-table/registry/radix/components/ui/shadcn-table/shared/utils/column.utils.ts`, `packages/shadcn-table/registry/aria/components/ui/shadcn-table/shared/utils/column.utils.ts`, `packages/shadcn-table/stories/features/DateFilters.stories.tsx`
- Depends on: none
- Review: fable
- Local CI: `pnpm test typecheck --base base`, `pnpm test typecheck --base radix`, `pnpm test typecheck --base aria`, `pnpm test lint`, `pnpm test validate-repo`, `pnpm test storybook-tests --base base`, `pnpm test storybook-tests --base radix`, `pnpm test storybook-tests --base aria`
- Task 1: Plays first (P11): `DateFilters.stories.tsx` with the seven plays of 1.2; run `GreaterThanOnDateColumn` and `LessThanOnDateColumn` on the code before the change on the three bases and record the failures. Checks: `ST_BASE=<base> pnpm exec vitest run stories/features/DateFilters.stories.tsx` fails on those two as required
- Task 2: The comparison helper and the eight modes (1.6.2), the default mode (1.6.3), the same edit in the three copies. Checks: `cmp` shows `filterFns.ts` and `column.utils.ts` identical across the bases; the seven plays pass on the three bases; `pnpm test typecheck --base <base>`
- Task 3: Regenerate (`pnpm lib:install` per base, `pnpm registry:build`), `pnpm format`, the changelog block. Checks: 2.2

### Milestone: React Query route dates

- Files owned: `apps/shadcn-table-docs/app/api/data/route.ts`, `apps/shadcn-table-docs/app/api/data/db.ts`, `apps/shadcn-table-docs/examples/base/react-query/TS.tsx`, `apps/shadcn-table-docs/examples/radix/react-query/TS.tsx`, `apps/shadcn-table-docs/examples/aria/react-query/TS.tsx`
- Depends on: Date filter compare, 39
- Review: none
- Local CI: `pnpm test typecheck --base base`, `pnpm test lint`, `pnpm test validate-repo`, `pnpm test docs-e2e --base base`
- Task 1: Reproduce on a production build before the change and record requests, returned rows and shown rows (1.6.4). Checks: the record and the named cause are in the tracker
- Task 2: The fix of 1.6.4. Checks: the two `curl` lines of 1.2 on a production build on a P6 port, outputs in the tracker; the page shows only matching rows on the three bases (one screenshot per base, paths in the tracker); `pnpm --filter shadcn-table-docs types:check`
- Task 3: `pnpm format`, the changelog block. Checks: 2.2

### 2.2 Checks

- Date filter compare: `pnpm test typecheck --base base`, `pnpm test typecheck --base radix`, `pnpm test typecheck --base aria`, `pnpm test lint`, `pnpm test validate-repo`, `pnpm test storybook-tests --base base`, `pnpm test storybook-tests --base radix`, `pnpm test storybook-tests --base aria` green; the seven plays on the three bases with the two before-the-change failures recorded; `CustomFilterFns.stories.tsx` and `Filtering.stories.tsx` plays unchanged and green
- React Query route dates: `pnpm test docs-e2e --base base` green; the `curl` records; the server stopped
- `git diff origin/claude/review -- packages/shadcn-table/registry/*/components/ui/shadcn-table/index.ts | grep '^-export'` prints nothing (P7)
- Review: fable for Date filter compare (shared filter functions and a changed default); none for the route (example code)
