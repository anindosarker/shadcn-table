# 47: Comparison page, tracker

Status: running (stopped before the merge for the lead verification, D89)
Branch `v0.9/comparison-page`, worktree 05
Checks:
- Check: Task 1, `pnpm --filter shadcn-table-docs types:check` at 146db937: pass on the second run; the first run aborted in `tsc` (exit 134, out of heap under load), the rerun at default heap was clean
- Check: Task 1, `git diff origin/claude/review -- apps/shadcn-table-docs/package.json` at 146db937: prints nothing
- Check: production build, `pnpm --filter shadcn-table-docs build` at b2151355 content: `next build` type check out of heap (`FATAL ERROR: Ineffective mark-compacts near heap limit`) twice, also with the two Task 1 files reverted to `origin/claude/review`; built with `NODE_OPTIONS=--max-old-space-size=8192 npx next build`: pass
- Check: `curl -s -o /dev/null -w '%{http_code}' localhost:5355/docs/getting-started/comparison` (next start, port 5355) at b2151355: `200`
- Check: `<title>` at b2151355: `<title>shadcn-table vs TanStack Table, shadcn/ui data-table, Material React Table and AG Grid | shadcn-table</title>`; h1 `Comparison`
- Check: `curl -s localhost:5355/sitemap.xml | grep -c getting-started/comparison` at b2151355: `1`; `/llms.txt` lists the page with no edit to `lib/llms.ts`
- Check: `grep -ci tablecn apps/shadcn-table-docs/content/docs/getting-started/comparison.mdx` at b2151355: `0`
- Check: named docs E2E entry, `pnpm test docs-e2e --base base --url http://localhost:5355 /docs/getting-started/comparison` at b2151355: pass, 10 checks (`title`, `search title`, `matrix columns`, `sidebar order` Introduction,Installation,Usage,AI Agent Setup,Comparison, plus route checks at 1440 and 700)
- Check: every Sources link, `curl -s -o /dev/null -w '%{http_code}'` per link on 2026-11-13: 31 of 31 return 200 (list below); `ui.shadcn.com/docs/components/data-table` returned 307 to `/docs/components/base/data-table`, so the page links the target
- Check: `pnpm format` at 72658df0: no changes after the changelog block
- Check: `pnpm test typecheck --base base` at 72658df0: pass, tsc clean
- Check: `pnpm test lint` at 72658df0: pass (9 warnings, none in this milestone's files)
- Check: `pnpm test validate-repo` at 72658df0: pass (bases identical, registry valid, registry fresh, 40 unit tests)
- Check: `pnpm test docs-e2e --base base --url http://localhost:5355` (next start of the b2151355 build) at 72658df0: pass, getting-started 243, api 109, guides 701, examples 939, 110 pages; server on 5355 stopped
Local CI: `pnpm test typecheck --base base` pass, `pnpm test lint` pass, `pnpm test validate-repo` pass, `pnpm test docs-e2e --base base` pass, at 72658df0

- Task 1 search title field: done (146db937); `searchTitle` built as `pageSchema.extend({ searchTitle: pageSchema.shape.title.optional() })`, the zod methods of fumadocs' own schema object, no import of zod and no package added; the `meta.json` fallback form was not needed
- Task 2 page, `meta.json`, docs E2E check: done (b2151355)
- Task 3 format and changelog: done (72658df0); lead verification: waiting

Sources checked (status code, 2026-11-13):
- 200 https://github.com/anindosarker/shadcn-table
- 200 https://tanstack.com/table/latest/docs/overview
- 200 https://tanstack.com/table/latest/docs/installation
- 200 https://tanstack.com/table/latest/docs/guide/features
- 200 https://tanstack.com/table/latest/docs/framework/react/guide/virtualization
- 200 https://tanstack.com/table/latest/docs/framework/react/examples/with-tanstack-form
- 200 https://github.com/TanStack/table/blob/main/packages/react-table/package.json
- 200 https://ui.shadcn.com/docs/components/base/data-table
- 200 https://github.com/shadcn-ui/ui/blob/main/LICENSE.md
- 200 https://github.com/KevinVandy/material-react-table
- 200 https://www.material-react-table.com/docs/getting-started/install
- 200 https://github.com/KevinVandy/material-react-table/blob/v3/packages/material-react-table/package.json
- 200 https://www.material-react-table.com/docs/guides/virtualization
- 200 https://www.material-react-table.com/docs/guides/editing
- 200 https://www.material-react-table.com/docs/examples/export-csv
- 200 https://www.material-react-table.com/docs/examples/export-pdf
- 200 https://www.material-react-table.com/docs/guides/localization
- 200 https://www.material-react-table.com/docs/guides/customize-components
- 200 https://www.ag-grid.com/react-data-grid/getting-started/
- 200 https://www.ag-grid.com/react-data-grid/community-vs-enterprise/
- 200 https://www.ag-grid.com/react-data-grid/filtering/
- 200 https://www.ag-grid.com/react-data-grid/grouping/
- 200 https://www.ag-grid.com/react-data-grid/aggregation/
- 200 https://www.ag-grid.com/react-data-grid/column-pinning/
- 200 https://www.ag-grid.com/react-data-grid/row-pinning/
- 200 https://www.ag-grid.com/react-data-grid/dom-virtualisation/
- 200 https://www.ag-grid.com/react-data-grid/cell-editing/
- 200 https://www.ag-grid.com/react-data-grid/csv-export/
- 200 https://www.ag-grid.com/react-data-grid/localisation/
- 200 https://www.ag-grid.com/react-data-grid/theming/
- 200 https://github.com/ag-grid/ag-grid/blob/latest/packages/ag-grid-community/package.json

## Table for the lead

Read on 2026-11-13; exactly as the page renders it (`content/docs/getting-started/comparison.mdx`):

| | shadcn-table | TanStack Table | shadcn/ui data-table recipe | Material React Table | AG Grid |
| --- | --- | --- | --- | --- | --- |
| Install model | Copied source, shadcn registry (`shadcn add`) | npm package (`@tanstack/react-table`) | A guide; you write the code | npm package (`material-react-table`) | npm package (`ag-grid-react`) |
| Base libraries | Base UI, Radix UI, React Aria | None; headless, no markup or styles | Base UI, Radix UI, React Aria | Material UI | None; the grid ships its own UI and styles |
| Sorting | Built in | Sorting feature and sorted row model | Covered in the guide | Built in | Built in (Community) |
| Filtering | Built in, several filter modes | Column and global filtering features, faceting | One text input filtering one column | Built in | Text, number and date filters (Community); set, multi and advanced filters (Enterprise) |
| Grouping and aggregation | Built in | Grouping and aggregation features | Not covered | Built in | Enterprise |
| Column and row pinning | Built in | Column and row pinning features | Not covered | Built in | Built in (Community) |
| Virtualization | Built in, rows and columns | Not a table feature; examples with TanStack Virtual | Not covered | Built in, rows and columns | Built in, rows and columns (Community) |
| Editing | Built in | Not a stock feature; TanStack Form example | Not covered | Built in | Built in (Community) |
| Export | Not built in; CSV and PDF examples | Not a stock feature | Not covered | Not built in; CSV and PDF examples | CSV (Community); Excel and PDF (Enterprise) |
| i18n | 39 locales | No UI text (headless) | RTL guide | 38 locales | 46 provided locales |
| Styling | Your shadcn/ui components and Tailwind CSS | Your own markup and styles | shadcn/ui `Table` and Tailwind CSS | Material UI theme, `sx` and `mui*Props` | Built-in themes, theme parameters and CSS |
| TanStack Table version | v9 | v9 (`9.3.1`) | v9 | v8 (`8.20.6`) | Not built on TanStack Table |
| License | MIT | MIT | MIT (shadcn/ui) | MIT | Community MIT; Enterprise commercial |

Source of every non-shadcn-table cell:

- TanStack Table, Install model: https://tanstack.com/table/latest/docs/installation ("react: @tanstack/react-table").
- TanStack Table, Base libraries; Styling; i18n: https://tanstack.com/table/latest/docs/overview ("headless UI library", "do not provide markup, styles, or pre-built implementations").
- TanStack Table, Sorting; Filtering; Grouping and aggregation; Column and row pinning; Editing and Export ("not a stock feature"): https://tanstack.com/table/latest/docs/guide/features (Stock Features list: `rowSortingFeature`, `columnFilteringFeature`, `globalFilteringFeature`, `columnFacetingFeature`, `columnGroupingFeature`, `rowAggregationFeature`, `columnPinningFeature`, `rowPinningFeature`; no editing or export feature).
- TanStack Table, Virtualization: https://tanstack.com/table/latest/docs/framework/react/guide/virtualization ("do not come with any virtualization APIs or features built in", examples use TanStack Virtual).
- TanStack Table, Editing example: https://tanstack.com/table/latest/docs/framework/react/examples/with-tanstack-form (cells are `form.AppField` inputs).
- TanStack Table, version and License: https://github.com/TanStack/table/blob/main/packages/react-table/package.json (`9.3.1`, MIT).
- shadcn/ui recipe, all cells: https://ui.shadcn.com/docs/components/base/data-table (Base UI, React Aria, Radix UI tabs; installs `table` and `@tanstack/react-table`, "This guide uses TanStack Table v9"; sections Pagination, Sorting, Filtering (one `Filter emails...` input on the `email` column), Visibility, Row Selection, Reusable Components, RTL; no grouping, pinning, virtualization, editing or export section). License: https://github.com/shadcn-ui/ui/blob/main/LICENSE.md (MIT).
- Material React Table, Install model; Base libraries: https://www.material-react-table.com/docs/getting-started/install (`npm i material-react-table @mui/material ...`).
- Material React Table, Sorting, Filtering, Grouping and aggregation, pinning, Virtualization, Editing: https://www.material-react-table.com/docs/guides/sorting, .../column-filtering, .../aggregation-and-grouping, .../column-pinning, .../row-pinning, .../virtualization (`enableRowVirtualization`, `enableColumnVirtualization`), .../editing (all 200 on 2026-11-13; options read on the pages: `enableSorting`, `enableColumnFilters` and `filterFn`, `enableGrouping` and `AggregatedCell`, `enableColumnPinning`, `enableRowPinning`, `enableEditing` with `editDisplayMode`).
- Material React Table, Export: https://www.material-react-table.com/docs/examples/export-csv ("does not have a data exporting feature built in"), https://www.material-react-table.com/docs/examples/export-pdf.
- Material React Table, i18n: https://www.material-react-table.com/docs/guides/localization (38 built-in locales, `ar` to `zh-Hant`).
- Material React Table, Styling: https://www.material-react-table.com/docs/guides/customize-components (`mui...Props`, `sx`, Material UI theme).
- Material React Table, TanStack Table version and License: https://github.com/KevinVandy/material-react-table/blob/v3/packages/material-react-table/package.json (3.2.1, `@tanstack/react-table` `8.20.6`, MIT).
- AG Grid, Install model: https://www.ag-grid.com/react-data-grid/getting-started/ (`npm install ag-grid-react`).
- AG Grid, Base libraries and TanStack Table version: https://github.com/ag-grid/ag-grid/blob/latest/packages/ag-grid-community/package.json (dependencies `ag-stack`, `ag-charts-types` only); Styling: https://www.ag-grid.com/react-data-grid/theming/ ("ships with built-in styles", Built-in Theme, Theme Parameters, CSS).
- AG Grid, Community or Enterprise per feature: the docs menu flags `isEnterprise` on grouping, aggregation, filter-set, filter-multi, filter-advanced, excel-export, pdf-export, cell-editing-batch; not on row-sorting, filtering, filter-text, column-pinning, row-pinning, dom-virtualisation, cell-editing, csv-export, localisation. Pages: https://www.ag-grid.com/react-data-grid/community-vs-enterprise/, .../filtering/ (Text, Number, BigInt, Date, Set filters plus Multi Filter), .../grouping/, .../aggregation/, .../column-pinning/, .../row-pinning/, .../dom-virtualisation/ ("row and column virtualisation"), .../cell-editing/, .../csv-export/.
- AG Grid, i18n: https://www.ag-grid.com/react-data-grid/localisation/ (46 provided locales in `@ag-grid-community/locale`; npm description "translations in 46 languages").
- AG Grid, License: https://www.ag-grid.com/react-data-grid/community-vs-enterprise/ ("AG Grid Community is available under the MIT licence", Enterprise "requires a commercial, EULA licence").

## Attention
- the lead verifies the comparison table (D89)
- `next build` of the docs app runs out of the default Node heap in its type check on this machine (also without this milestone's code changes); the build passed with `NODE_OPTIONS=--max-old-space-size=8192`, and nothing in the repo sets a heap size.
- The computed task named the section "Table for the owner" and the line "the owner reads the comparison table"; the spec and E12 Notes were edited on 2026-11-13 to "the lead", so the tracker follows the spec.
