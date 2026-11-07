# 02: Pages footer row range, compact mode
- Sprint: S1

Follow the project planning rules: docs/code-of-conduct/planning-guidelines.md, CLAUDE.md:9. Keep the expedition contract.

## 1. Architecture

### 1.1 Overview

The default `pages` footer shows Rows per page, the page buttons and the chevrons, never how many rows there are or which range is shown; only the `default` mode renders `1-10 of 21`. D6 adds that range span to the `pages` branch, previewed and accepted as a diff, and renames the compact mode's value from `'default'` to `'compact'` with no alias. D7 carries the rename through the stories, guide, API entry, examples and the docs E2E, and takes "Default" out of the pagination story names (F5, F7).

### 1.2 Goals

- The `pages` footer reads `Rows per page [10]  1-10 of 200  ‹ 1 2 3 … 20 ›`; the range is localized, follows the filtered count, and reads `1-2 of 2` on one page (D6).
- `paginationDisplayMode` is `'custom' | 'compact' | 'pages'`; `'default'` is a type error (D6, no users yet).
- No story name, guide, API entry or example calls the compact footer "default"; the guide and API entry say `'pages'` is the default and `'compact'` the alternative (D7).
- Acceptance: programmatic. The plays `PagesFooterRowRange` and `CompactFooter` of 1.6.4 pass in `test:base`, `test:radix` and `test:aria` and fail on the shipped code first (P11, the red lines in the tracker); `grep -rn "paginationDisplayMode: 'default'\|paginationDisplayMode=\"default\"\|=== 'default'\|'custom' | 'default' | 'pages'" packages apps test --include='*.ts' --include='*.tsx' --include='*.mdx' --include='*.mjs'` empty; `grep -n "PaginationEnabledDefault" packages/shadcn-table/stories/features/Pagination.stories.tsx` empty; `pnpm test validate-repo` green.

### 1.3 Current structure

```
packages/shadcn-table/registry/<base>/components/ui/shadcn-table/
├── components/toolbar/ST_TablePagination.tsx ← `pages` branch :225-277 (radix); `default` branch :278-287 with the range span; `=== 'default'` at radix :278, base :294, aria :281
└── features/stConfigFeature.ts:391           ← paginationDisplayMode?: 'custom' | 'default' | 'pages'
packages/shadcn-table/stories/features/
├── Pagination.stories.tsx                    ← :56 PaginationEnabledDefault, :60-64 PaginationEnabledDefaultMoreData (compact, play :84-96 expects `1-10 of 551`), :103 ...BigData, :116 ...BigDataLanguage, :133 ...NoRowsPerPage
├── TableProvider.stories.tsx:63,169,218,224  ← paginationDisplayMode: 'default'
├── NestedTable.stories.tsx:89,99             ← paginationDisplayMode="default"
└── RowPinningOnSelect.stories.tsx:66,282,332 ← comment and two props
apps/shadcn-table-docs/
├── content/docs/guides/pagination.mdx:102-110 ← "By default ('pages') ..."; "set ... to 'default'"; code block :110
├── content/docs/guides/best-practices.mdx:199
├── lib/prop-tables/tableOptions.ts:1827-1836  ← description names 'default'; type string
└── examples/<base>/alternate-pagination/TS.tsx:13
test/docs-e2e/lib/guides.mjs:139              ← codeToggle asserts "paginationDisplayMode: 'default'"
```

### 1.4 Target structure

```
packages/shadcn-table/registry/<base>/components/ui/shadcn-table/
├── components/toolbar/ST_TablePagination.tsx ← rangeLabel const (D6 diff) used by the `pages` and `compact` branches; `=== 'compact'`
└── features/stConfigFeature.ts:391           ← 'custom' | 'compact' | 'pages'
packages/shadcn-table/stories/features/
├── Pagination.stories.tsx                    ← PaginationEnabled, PaginationCompactMoreData, PaginationEnabledBigData, PaginationEnabledBigDataLanguage, PaginationEnabledNoRowsPerPage; plays PagesFooterRowRange, CompactFooter
└── TableProvider, NestedTable, RowPinningOnSelect stories ← 'compact'
apps/shadcn-table-docs/                       ← guide, best practices, API entry, example on 'compact'
test/docs-e2e/lib/guides.mjs                  ← asserts "paginationDisplayMode: 'compact'"
```

### 1.5 Flow: none

### 1.6 Components

#### 1.6.1 Data artifacts

- `CHANGELOG.md` (P9): `#### Epic 02 Pagination` under `## Unreleased`: the range in the pages footer; `paginationDisplayMode: 'default'` renamed `'compact'`, no alias (D6, D7). The 0.3.x entry at `:122` stays.
- `apps/shadcn-table-docs/components/ui-<base>/` and `public/r/`: regenerated at merge (P9).
- The tracker `trackers/02-pagination-tracker.md`: the red runs of the two plays on the shipped code (P11).

#### 1.6.2 Range span and compact branch (D6)

- The D6 diff applied as is to `ST_TablePagination.tsx` in radix, base and aria (the docs-copy path rewritten to the registry path): the span lifted into `const rangeLabel = (...)` after `shownRowRange`, rendered before `<Pagination>` in the `pages` branch and in place of the old span in the other branch; `pnpm format` fixes the indent of the moved `<Pagination>` block. The branch test `paginationDisplayMode === 'default'` becomes `=== 'compact'`.
- `stConfigFeature.ts:391`: `paginationDisplayMode?: 'compact' | 'custom' | 'pages';` (sorted as the file sorts unions).
- Does NOT change `useST_TableOptions.ts:90` (`'pages'` stays the default), `pagination.utils.ts`, `ST_BottomToolbar.tsx`, the rows-per-page select or the chevrons.

#### 1.6.3 Rename sites (D7)

- File reason for the dependency on Filtering: both milestones edit `apps/shadcn-table-docs/lib/prop-tables/tableOptions.ts` and files under `apps/shadcn-table-docs/examples/<base>/`; Pagination branches after Filtering has merged.

- Stories: `TableProvider.stories.tsx:63,169,218,224`, `NestedTable.stories.tsx:89,99`, `RowPinningOnSelect.stories.tsx:66,282,332`, `Pagination.stories.tsx:64`: `'default'` and `"default"` become `'compact'` and `"compact"`.
- Story exports in `Pagination.stories.tsx`: `PaginationEnabledDefaultMoreData` (`:60`) becomes `PaginationCompactMoreData`; `PaginationEnabledDefault` (`:56`) `PaginationEnabled`; `PaginationEnabledDefaultBigData` (`:103`) `PaginationEnabledBigData`; `PaginationEnabledDefaultBigDataLanguage` (`:116`) `PaginationEnabledBigDataLanguage`; `PaginationEnabledDefaultNoRowsPerPage` (`:133`) `PaginationEnabledNoRowsPerPage`. Any `storyName` or `name` field follows; the story ids change and no docs page links them (D7).
- Docs: `pagination.mdx:102-110` says `'pages'` is the default, `'compact'` the range-and-arrows footer, the code block uses `'compact'`; `best-practices.mdx:199` the same; `lib/prop-tables/tableOptions.ts:1827-1836` description and `type: "'compact' | 'custom' | 'pages'"`, `defaultValue` stays `"'pages'"`; `examples/<base>/alternate-pagination/TS.tsx:13` `'compact'` with its comment; `test/docs-e2e/lib/guides.mjs:139` asserts `"paginationDisplayMode: 'compact'"`.
- Does NOT touch the next-app demo (`test-projects/next-app`, D34) or `CHANGELOG.md:122`.

#### 1.6.4 Plays (P11)

- `Pagination.stories.tsx`: `PagesFooterRowRange` renders a 21-row `pages` table; the play asserts the footer text `1-10 of 21`, types `Liam` in the global filter and asserts the footer text matches `1-\d+ of \d+` with the filtered count and a single page button. `CompactFooter` renders `paginationDisplayMode: 'compact'`; the play asserts the range text and four navigation buttons.
- Both run on the shipped code first: `PagesFooterRowRange` fails (no range text); `CompactFooter` fails at `tsc` (`'compact'` is not in the union). The red lines go to the tracker.

### 1.7 Dependencies and env: none

## 2. Instructions for AI

### 2.1 Milestones

### Milestone: Pagination

- Files owned: `packages/shadcn-table/registry/<base>/components/ui/shadcn-table/components/toolbar/ST_TablePagination.tsx`, `.../features/stConfigFeature.ts` (three bases), `packages/shadcn-table/stories/features/Pagination.stories.tsx`, `packages/shadcn-table/stories/features/TableProvider.stories.tsx`, `packages/shadcn-table/stories/features/NestedTable.stories.tsx`, `packages/shadcn-table/stories/features/RowPinningOnSelect.stories.tsx`, `apps/shadcn-table-docs/content/docs/guides/pagination.mdx`, `apps/shadcn-table-docs/content/docs/guides/best-practices.mdx`, `apps/shadcn-table-docs/lib/prop-tables/tableOptions.ts`, `apps/shadcn-table-docs/examples/<base>/alternate-pagination/TS.tsx` (three bases), `test/docs-e2e/lib/guides.mjs`
- Depends on: Filtering
- Review: none
- Local CI: `pnpm test typecheck --base <base>` and `pnpm test storybook-tests --base <base>` for base, radix and aria one after another (P5), `pnpm test lint`, `pnpm test validate-repo`, `pnpm test docs-e2e --base base`
- Task 1: Reproduce: write the two plays of 1.6.4, run them on the shipped code, record the red lines in the tracker. Checks: `ST_BASE=radix vitest run stories/features/Pagination.stories.tsx` red on `PagesFooterRowRange`; `pnpm --filter shadcn-table tsc:radix` red on `'compact'`
- Task 2: Library: 1.6.2 in radix, then base and aria as byte-identical copies. Checks: `pnpm --filter shadcn-table tsc:radix`, `tsc:baseui`, `tsc:aria`; `ST_BASE=<base> vitest run stories/features/Pagination.stories.tsx stories/features/TableProvider.stories.tsx stories/features/NestedTable.stories.tsx stories/features/RowPinningOnSelect.stories.tsx` per base, one after another (P5); `pnpm --filter shadcn-table lint`
- Task 3: Rename sites: 1.6.3. Checks: the greps of 1.2 empty; `pnpm --filter shadcn-table-docs lint`; `pnpm test docs-e2e --base base`
- Task 4: Cleanup: `pnpm format`, the changelog block of 1.6.1. Checks: 2.2

### 2.2 Checks

- `pnpm test typecheck --base <base>` and `pnpm test storybook-tests --base <base>` green for base, radix and aria, one base at a time (P5); `pnpm test lint` green
- `pnpm test validate-repo` green: bases identical, tailwind classes valid, registry valid
- `pnpm test docs-e2e --base base` green (the pagination guide, the alternate-pagination example and `guides.mjs` changed)
- Review: none (a public option value renamed by D6, its own decision, P7; no other API change)
