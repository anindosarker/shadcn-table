# 46: Live demo with ten columns
- Epic: E12

Follow the project planning rules: docs/code-of-conduct/planning-guidelines.md, CLAUDE.md:9. Keep the expedition contract.

## 1. Architecture

### 1.1 Overview

The live demo on the Introduction and Usage pages (D78, `examples/<base>/live-demo`) has six columns: First Name, Last Name, State, Age, Joined, Status. At the docs content width it sometimes needs the table's sideways scroll for the last column, which the run filed as a cut-off (Q70). The owner turned it around: the demo gets more columns, so the table scrolls sideways on purpose and pinning, hiding and reordering have columns to act on. D84: four more columns, Email, City, Department (select filter) and Salary (range filter), ten in all; no column pinned by default.

### 1.2 Goals

- The live demo shows ten columns in this order: First Name, Last Name, Email, City, State, Department, Age, Salary, Joined, Status (D84).
- Department has a select filter, Salary a range filter; the four filters of D78 (State select, Age range, Joined date, Status multi-select) work as before (D84).
- At the docs content width the table scrolls sideways; no column is pinned by default (D84).
- The demo's source stays one short file a reader can follow: no option beyond `columns` and `data` is added to `useShadcnTable`.
- The three base copies stay identical.
- Acceptance: programmatic. On a production build served on a P6 port, `pnpm test docs-e2e --base base`, `--base radix` and `--base aria` green with `liveDemoFilters` extended by a Department case (select, pick one department, the expected row count) and a Salary case (range, min and max, the expected row count), on `/docs/getting-started/usage` and `/docs/getting-started/introduction`; a new check in the same helper asserts the demo has 10 header cells and that the table's scroll container is wider inside than outside (`scrollWidth > clientWidth`) at the 1280 px viewport. `diff -r apps/shadcn-table-docs/examples/base/live-demo apps/shadcn-table-docs/examples/radix/live-demo` and the same for `aria` print nothing.

### 1.3 Current structure

```
apps/shadcn-table-docs/examples/<base>/live-demo/TS.tsx:27-80   ← six column definitions (sizes 150, 150, 150, 110, 150, 140); :82-85 useShadcnTable({ columns, data })
apps/shadcn-table-docs/examples/<base>/live-demo/makeData.ts:1-8 ← type Member: firstName, lastName, state, age, joined (YYYY-MM-DD), status
apps/shadcn-table-docs/examples/<base>/live-demo/makeData.ts:10-19 ← usStateList (6), statusList (3)
apps/shadcn-table-docs/examples/<base>/live-demo/makeData.ts:21-183 ← 20 fixed rows
apps/shadcn-table-docs/content/docs/getting-started/usage.mdx, introduction.mdx ← embed the example by name; no sentence names its columns
test/docs-e2e/lib/helpers.mjs:681-770                            ← liveDemoFilters: four cases with fixed expected counts (State Ohio 3, Age 30 to 40 6, Joined after 2023-01-01 6, Status Suspended 4)
test/docs-e2e/lib/getting-started.mjs:1364-1386                  ← calls liveDemoFilters on the two pages
```

- The three base copies of both files are identical today.
- The `joined` column keeps its ISO string accessor: D81 allows a `Date` accessor once spec 40 has merged, and it is not taken here, so this milestone does not wait on spec 40.

### 1.4 Target structure

```
examples/<base>/live-demo/makeData.ts   ← Member gains email, city, department, salary; departmentList exported; the 20 rows gain the four values
examples/<base>/live-demo/TS.tsx        ← ten column definitions in the order of 1.2
test/docs-e2e/lib/helpers.mjs           ← liveDemoFilters: Department and Salary cases, the ten-column and sideways-scroll check
CHANGELOG.md (P9)                       ← #### Spec 46 under ### Docs
```

### 1.5 Flow: none

### 1.6 Components

#### 1.6.1 Data artifacts

- `makeData.ts`: `email: string` (first.last@example.com in lower case), `city: string` (a real city of the row's state), `department: string` (one of `departmentList = ['Design', 'Engineering', 'Marketing', 'Sales', 'Support']`), `salary: number` (whole thousands between 48000 and 160000). The existing six values of each row do not change, so the four expected counts of the helper stay valid.
- `CHANGELOG.md` (P9): `#### Spec 46 Live demo with ten columns` under `## Unreleased`, `### Docs` (D84).
- Generated (P9): the example registry items and `examples-*-diff.json` through their scripts, `examples/.<base>/`.

#### 1.6.2 Columns (D84)

`examples/<base>/live-demo/TS.tsx`, status `refactor`, three identical copies.

- Email: `accessorKey: 'email'`, a mail icon from `lucide-react`, size 240, text filter. City: `accessorKey: 'city'`, size 160, text filter. Department: `filterVariant: 'select'`, `filterSelectOptions: departmentList`, size 170. Salary: `filterVariant: 'range'`, `filterFn: 'between'`, size 140, `Cell` formatting the number as US dollars with no decimals.
- The existing six definitions keep their options; only their position changes to the order of 1.2.
- Does NOT add `initialState`, column pinning, or any table option; does NOT edit the MDX pages.

#### 1.6.3 Docs E2E (D84)

`test/docs-e2e/lib/helpers.mjs`, status `refactor`.

- Two cases join `cases` in `liveDemoFilters`, with expected counts computed from the fixed rows and written as literals, in the form of the State and Age cases.
- One check before the cases: 10 `thead th` cells with the header texts of 1.2 in order, and the sideways-scroll assertion of 1.2.

**Stays unchanged:** `usage.mdx`, `introduction.mdx`, `getting-started.mjs`, the home page demo (`components/dev-home/**`), every other example.

### 1.7 Dependencies and env: none

## 2. Instructions for AI

### 2.1 Milestones

### Milestone: Live demo ten columns

- Files owned: `apps/shadcn-table-docs/examples/base/live-demo/TS.tsx`, `apps/shadcn-table-docs/examples/base/live-demo/makeData.ts`, `apps/shadcn-table-docs/examples/radix/live-demo/TS.tsx`, `apps/shadcn-table-docs/examples/radix/live-demo/makeData.ts`, `apps/shadcn-table-docs/examples/aria/live-demo/TS.tsx`, `apps/shadcn-table-docs/examples/aria/live-demo/makeData.ts`, `test/docs-e2e/lib/helpers.mjs`
- Depends on: 42
- Review: none
- Local CI: `pnpm test typecheck --base base`, `pnpm test lint`, `pnpm test validate-repo`, `pnpm test docs-e2e --base base`, `pnpm test docs-e2e --base radix`, `pnpm test docs-e2e --base aria`
- Task 1: The data and the columns (1.6.1, 1.6.2) in the Base UI copy, copied to Radix and React Aria. Checks: the two `diff -r` lines of 1.2; `pnpm --filter shadcn-table-docs types:check`
- Task 2: The helper (1.6.3); on a production build on a P6 port open both pages on the three bases, record one screenshot per base and page (paths in the tracker), stop the server. Checks: `pnpm test docs-e2e --base <base>` on the three bases
- Task 3: Regenerate the example items (`pnpm registry:items`), `pnpm format`, the changelog block. Checks: 2.2

### 2.2 Checks

- The Local CI lines green; the `diff -r` lines of 1.2
- The six screenshots; the Department and Salary cases and the ten-column check named in the docs E2E record
- Review: none (example data and columns; P7 untouched)
