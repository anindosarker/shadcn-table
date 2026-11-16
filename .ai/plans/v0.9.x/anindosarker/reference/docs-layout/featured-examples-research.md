# Featured examples research

Date: 2026-11-16. Question: which examples go in the top "Featured" group of the Examples sidebar, in what order, and what each row is called (two words at most). Builds on `example-demand-audit.md`; findings from that file are cited, not repeated.

## Method

- No keyword-volume tool is connected. No DataForSEO tool or key was found in the session. Absolute monthly search volumes are therefore not in this file.
- Real numbers came from four places: Search Console (own site), Google Trends (relative index, not volume), the Stack Exchange API (question counts and views), and the GitHub search API (title hit counts).
- Wording came from Google autocomplete, used as a proxy. Two passes: (1) 7 stems x 26 feature words, 686 unique suggestions; (2) an exact-phrase probe of 83 phrases on 4 stems. The probe types the phrase minus two characters and records whether Google completes it, and at what rank.
- Comparable docs were read from their source repos (navigation files) or live pages.
- No personal details were sent in any request.

## Sources

| Source | Kind | What it gave |
|---|---|---|
| Keyword volume tool (DataForSEO, Keyword Planner, Semrush, Ahrefs) | not available | Nothing. No absolute volume for any phrase. |
| Search Console, `sc-domain:shadcn-table.com`, 28 and 90 days | measured | 20 queries, 42 pages, about 25 clicks. 28 and 90 day results are identical. Too small to rank needs. |
| Google Trends, worldwide, 12 months, unofficial endpoint | measured, relative | 12 comparisons of 5 terms. Index 0 to 100 inside one comparison only. Values under about 5 are noise. Related queries were empty for the shadcn stems. |
| Stack Exchange API | measured | Question counts per title word for 4 tags, and the top 25 questions by votes with view counts for 2 tags. |
| GitHub search API | measured | Issue and PR title hits for 16 terms on TanStack/table and KevinVandy/material-react-table. |
| Google autocomplete (suggest endpoint) | proxy | 686 suggestions and an 83 phrase x 4 stem presence table. Shows wording and rough order, not volume. |
| Bing and DuckDuckGo autocomplete | proxy | 3 stems. Small cross-check. |
| Web search result titles | proxy | 4 queries. Shows how ranking pages word the need. |
| "People also ask" boxes | not available | The search tool does not return them. |
| Docs navigation of 9 comparable projects | measured (read from source) | First labels and order. AG Grid and MUI were only partly readable. |

## Measured numbers

Search Console (90 days): "shadcn table" 101 impressions, 3 clicks. "shadcn tables" 10. "table shadcn" 7. "shadcn table filter" plus "filters" 7 impressions, 1 click. "shadcn table examples" 4. "shadcn table sorting" 2. No other feature query. Top page is the column filtering guide (46 impressions, 5 clicks).

Google Trends, 12 month average index. Numbers compare only inside one row.

| Comparison | Result |
|---|---|
| Library names | react table 42, tanstack table 12, shadcn table 3, material react table 2, shadcn data table 1 |
| shadcn stems | shadcn table 55, shadcn data table 11, shadcn datatable 1, tablecn 0 |
| tanstack table + feature (a) | pagination 17, sorting 16, filter 9, virtualization 7, server side 0 |
| tanstack table + feature (b) | pagination 26, examples 6, editable 3, column pinning 1, infinite scroll 0 |
| react table + feature (a) | filter 39, export 31, pagination 12, editable 3, sticky column 0 |
| react table + feature (b) | pagination 23, drag and drop 3, server side pagination 0, virtualized 0, fixed column 0 |
| shadcn + feature | all 0 to 2. Too low to measure. |

Reading: "shadcn table" is searched about five times more than "shadcn data table". Feature phrases on the shadcn stems are below what Trends can measure. On the larger stems, pagination, filtering and sorting lead; export is high on "react table"; virtualization is mid; editing, pinning and server side are small as exact phrases.

Stack Overflow, questions with the word in the title:

| Tag (total) | Top words |
|---|---|
| react-table (1,354) | filter 83, sort 32, select 31, pagination 30, checkbox 28, width 19, server side 16, search 16, editable 13, export 10, sticky 10, edit 9, expand 7, resize 5, drag 3, group 3, fixed column 2, virtual 1 |
| tanstack-table (69) | pagination 5, server side 3, filter 2, sticky 2, drag 2, checkbox 2. Sample too small. |
| material-react-table (68) | edit 6, pagination 3, filter 3, select 3, pin 2. Sample too small. |

Stack Overflow, most viewed questions: "Changing column width in react-table" 182,923 views. "Select row on click react-table" 173,045. "Export to CSV button in react table" 171,848. "How to do default sorting in react-table" 109,468. "How to show and hide some columns" 108,012. "Export to PDF in React-Table" 38,803. "react-table add edit/delete column" 38,711. In the tanstack-table tag the top question is "how to sort server-side with manualSorting" (22 votes, 27,982 views); second by views is server-side pagination (6,315).

GitHub issue and PR title hits:

| Repo | Counts |
|---|---|
| TanStack/table | filter 304, sorting 172, pagination 152, expand 101, resize 82, selection 78, infinite 41, export 40, grouping 39, server side 38, virtual 33, edit 33, drag 26, pinning 22, sticky 13, url 10 |
| material-react-table | filter 94, virtual 46, pagination 27, edit 27, selection 26, grouping 21, resize 16, expand 12, pinning 11, sorting 10, sticky 9, export 8, infinite 6, server side 3 |

## Wording people use (proxy: Google autocomplete)

Bare stems, in the order Google lists them:

- "shadcn data table": example, pagination, column filter, component, server side pagination, sticky header, column width, github, responsive.
- "shadcn table": component, filters, examples, pagination, scrollable, sorting, design, ui, data.
- "tanstack table": examples, npm, filtering, 9, github, sorting, v8, angular, demo, grouping.

Exact-phrase probe. Columns: shadcn table / shadcn data table / tanstack table / react table. A number is the rank of the exact phrase. "p" means only longer phrases appear. "-" means absent.

| Need | Phrase | Result |
|---|---|---|
| Server | server side pagination | 1 / 1 / 1 / 1 |
| | server side | 2 / 2 / p / 3 |
| | server side filtering | - / - / 1 / 1 |
| | manual pagination | - / - / 1 / 1 |
| | react query | - / - / 1 / 1 |
| | remote data | - / - / - / - |
| Pinning | column pinning | 1 / 1 / 1 / 1 |
| | fixed column | 1 / 1 / 1 / 1 |
| | sticky column | 1 / 1 / - / 1 |
| | freeze column | 1 / - / - / 1 |
| | frozen column | - / - / 1 / 1 |
| | pinned column | - / - / p / 1 |
| | sticky header | p / 1 / p / 1 |
| | fixed header | 1 / 1 / 1 / 1 |
| Large data | virtualization | 1 / 1 / p / 1 |
| | infinite scroll | 1 / 1 / 1 / 1 |
| | virtualized | - / - / p / p |
| | virtual scrolling | - / - / 1 / - |
| | virtual scroll | - / - / - / 1 |
| | large data | - / - / 1 / - |
| | infinite scrolling | - / - / 1 / - |
| Editing | inline edit | 1 / 1 / 1 / 1 |
| | editable | 1 / 1 / 2 / 1 |
| | inline editing | - / - / 1 / 1 |
| | editable cell | - / - / 1 / 1 |
| | crud | - / - / 2 / 2 |
| | row editing | - / - / - / - |
| Filtering | column filter | 1 / 1 / 1 / 1 |
| | filtering | 1 / 1 / 1 / 1 |
| | filter multiple columns | 1 / 1 / 1 / 1 |
| | global filter | - / 1 / 1 / 1 |
| | faceted filter, advanced filter, date range filter | tanstack table only |
| Showcase | advanced | 1 / 1 / 3 / - |
| | demo | 2 / 2 / 1 / 2 |
| | kitchen sink | - / - / 1 / 1 |
| Other | sorting, pagination, grouping, drag and drop, resizable columns, select row, checkbox, responsive | present on all four |
| | export | 1 / 1 / p / 2 |
| | column width | 1 / 1 / p / 1 |
| | expandable row, nested rows | present on three or four |
| | url state, search params, row actions | tanstack table only |
| | saved views | - / - / - / - |

What the wording says:

- "Server side pagination" is the one phrase that completes at rank 1 on every stem. "Remote data" is never completed. "Manual pagination" is TanStack vocabulary only.
- "Column pinning" and "fixed column" complete on every stem. "Pinned column" completes on one. "Sticky column" on three.
- "Virtualization" (the noun) and "infinite scroll" are the common forms. "Virtualized", "virtual scrolling" and "large data" are weak.
- "Inline edit" and "editable" are the common forms. "CRUD" is weak on the shadcn stems. "Row editing" is never completed.
- "Saved views" is never completed. "URL state" exists only on "tanstack table".
- "Example" and "examples" are themselves top suggestions on every stem.

Ranking page titles (proxy, 4 web searches): "Advanced Shadcn Table: Server-Side Sort, Filter, Paginate"; "Server-Side Data Table Component for shadcn/ui"; "Pinned Columns Data Table", "Pinnable Columns Table", "Column Pinning Sticky"; "Editable Data Table", "Table with Inline Edit", "Editable Cells Data Table"; "Virtualized Data Table", "Building an Efficient Virtualized Table".

## Ranked needs

| # | Need | Evidence | Phrases people use | Example today |
|---|---|---|---|---|
| 1 | A plain starter table | "example" is the first suggestion on "shadcn data table"; "shadcn table examples" 4 impressions on own site; every comparable doc starts with it | "shadcn data table example", "shadcn table examples", "shadcn table component" | `basic` |
| 2 | Filtering | Highest count in every measured source: TanStack 304, MRT 94, Stack Overflow 83, Trends "react table filter" 39; own site top page and the only feature queries | "column filter", "filters", "filter multiple columns", "global filter" | `filter-variants`, `faceted-values` |
| 3 | Pagination, mostly server side | Trends top feature on "tanstack table" (17 to 26); TanStack 152 titles; top two tanstack-table questions on Stack Overflow are server side (27,982 and 6,315 views); the only multi-word feature phrase in the bare "shadcn data table" list; audit: top TanStack discussion #2033, tablecn headline | "server side pagination", "server side", "pagination example" | `react-query`, `remote` |
| 4 | Sorting | Trends 16; TanStack 172; 109,468 views on default sorting | "sorting", "sortable" | Inside `basic`. No own page needed. |
| 5 | Column width and resizing | Most viewed react-table question (182,923); TanStack 82; "column width" in the bare "shadcn data table" list; own site 18 plus 8 impressions on two guides | "column width", "resizable columns", "column size" | None. Gap. |
| 6 | Sticky header and pinned columns | "sticky header" in the bare "shadcn data table" list and DuckDuckGo list; audit: TanStack #848 (75 reactions); Stack Overflow sticky 10; Trends too low to measure | "column pinning", "fixed column", "sticky column", "sticky header", "fixed header" | `column-pinning`, `sticky-header` |
| 7 | Row selection and row click | 173,045 views on select row on click; Stack Overflow select 31, checkbox 28; TanStack 78; own site 3 clicks on the row selection guide | "select row", "row selection", "checkbox", "row click", "clickable row" | Inside `basic`. No row click example. |
| 8 | Export | 171,848 views (CSV) and 38,803 (PDF); Trends "react table export" 31; TanStack 40. Weak on shadcn stems and MRT (8). | "export", "export to csv", "export to excel" | `export-csv`, `export-pdf` |
| 9 | Virtualization and infinite scroll | MRT 46 titles (second after filter); Trends "tanstack table virtualization" 7; TanStack infinite 41, virtual 33; tablecn and openstatus headlines | "virtualization", "infinite scroll" | `virtualized`, `row-virtualization`, `infinite-scrolling` |
| 10 | Editing | MRT 27; TanStack 33; Stack Overflow editable 13 plus edit 9; Trends 3 | "inline edit", "editable", "editable cell" | `editing-crud-inline-row`, `editing-crud` and variants |
| 11 | Expanding rows and grouping | TanStack expand 101, grouping 39; MRT grouping 21 | "expandable row", "nested rows", "grouping" | `expanding-tree`, `detail-panel`, `column-grouping` |
| 12 | A full showcase | Suggestions "shadcn data table advanced", "shadcn ui advanced table", "tanstack table demo"; no measured number | "advanced", "demo", "kitchen sink" (TanStack only) | `advanced` |
| 13 | Drag and drop ordering | TanStack 26; completes on all four stems; Trends 3 | "drag and drop", "draggable rows" | `row-ordering`, `column-ordering`, `row-dragging` |
| 14 | Saved views, URL state | No search signal on shadcn stems; audit: TanStack #5002 (54 upvotes) | "url state", "search params" (TanStack only) | `persistent-view` (localStorage only) |

Change against the audit: export and column width are stronger than the audit said. Saved views has no search signal. Filtering ranks above server side on measured counts.

## How other docs name and order their first examples

| Docs | First rows, in order | Suffix "Example"? |
|---|---|---|
| TanStack Table, Basic Examples | Basic (useTable), Basic (useAppTable), Basic (External State), Basic (Dynamic Columns), Header Groups | No |
| TanStack Table, Feature Examples | Kitchen Sink (All Features), Cell Selection, Cell Spanning, Column Filters, Column Filters (Faceted), Fuzzy Search Filters, Column Ordering, Column Pinning, Sticky Column Pinning, Column Sizing, Column Resizing, Column Visibility, Expanding, Grouping, Pagination, Row Selection, Sorting. Later: With TanStack Virtual - Rows, With TanStack Query | No |
| Material React Table | Basic Example, Minimal Example, Advanced Example, Custom Headless Example, Export to CSV Example, Column Ordering Example, Row Ordering Example, Modal Editing Example, Inline Row Editing Example | Yes |
| Mantine React Table | Same as MRT | Yes |
| shadcn/ui Data Table page | Basic Table, Cell Formatting, Row Actions, Pagination, Sorting, Filtering, Visibility, Row Selection | No |
| Ant Design Table | Basic Usage, selection, Filter and sorter, Ajax, Expandable Row, Tree data, Fixed Header, Fixed Columns, Editable Cells, Editable Rows, Drag sorting, Virtual list | No |
| PrimeReact DataTable | Basic, Dynamic Columns, Template, Size, Paginator, Sort, Filter, Row Selection, Row Expansion, Edit, Lazy Load, Scroll (Frozen Columns), Virtual Scroll | No |
| MUI Data Grid (partial read) | Column definition, Column dimensions, Column visibility, Column pinning, Row ordering, Row pinning, Editing, Sorting, Filtering, Server-side filtering | No |
| tablecn README, features | Server-side pagination, sorting, and filtering; Customizable columns; Auto generated filters; advanced filtering; Action bar on row selection; Infinite scrolling with virtualization | No |
| AG Grid (partial read) | Demo page title: "Data Grid Performance Example - 100k+ Rows Live". Feature navigation not fully read. | No |

Shared convention:

- Seven of nine start with a row called "Basic" or "Basic X".
- Seven of nine do not put the word "Example" in the row label. Only MRT and its Mantine port do.
- Labels are noun phrases of one or two words. The common shape is "Column X" or "Row X" (Column Pinning, Column Filters, Row Selection), or a single noun (Pagination, Sorting, Filtering).
- "Server-side" is the word used for remote data (tablecn, MUI). TanStack names the tool instead (With TanStack Query). Ant Design says "Ajax", PrimeReact says "Lazy Load"; neither matches the search wording.
- "Column Pinning" is used by TanStack, MRT and MUI. "Fixed Columns" by Ant Design. "Frozen Columns" by PrimeReact. Nobody uses "Pinned Columns" as a label.

## Recommendation

Six rows, Basic first, then by demand. A seventh is optional.

| # | Name | Alternatives | Phrase evidence | Example | Confidence |
|---|---|---|---|---|---|
| 1 | Basic | Basic Table; Quick Start | "shadcn data table example" is the first suggestion; seven of nine docs open with "Basic" | `basic` | High |
| 2 | Column Filters | Filtering; Filter Variants | "column filter" rank 1 on all four stems; TanStack's own label; highest measured count in every source; own site top page | `filter-variants` | High |
| 3 | Server-Side Pagination | Server Side; React Query | "server side pagination" rank 1 on all four stems; "remote data" never completed; top two tanstack-table questions by views | `react-query` (link `remote` from it) | High on the need, medium on the name length |
| 4 | Column Pinning | Sticky Columns; Fixed Columns | "column pinning" and "fixed column" rank 1 on all four stems; "pinned column" on one; label used by TanStack, MRT and MUI | `column-pinning` | Medium |
| 5 | Virtualization | Infinite Scroll; Virtual Rows | "virtualization" rank 1 on three stems; "virtualized" and "virtual scrolling" weak; MRT second highest issue count | `virtualized` | Medium |
| 6 | Inline Editing | Editable Table; Editable Rows | "inline edit" rank 1 on all four stems; "row editing" never completed; "crud" absent on shadcn stems | `editing-crud-inline-row` | Medium |
| 7 (optional) | Advanced | Kitchen Sink; Full Demo | "shadcn data table advanced" and "shadcn ui advanced table" exist; no measured number | `advanced` | Low |

Notes on the list:

- Row 3: "Server-Side Pagination" counts as two words only if the hyphenated compound counts as one. If the limit is strict, use "Server Side". The page shows sorting and filtering too; the name follows the phrase people type.
- Row 6 points at the inline row example, not the modal one (`editing-crud`). The searched wording is "inline edit" and "editable", and the inline row page is the only editing page with own-site impressions. If the modal page stays featured, name it "Editing".
- Row 7: "Advanced" has search wording but no number. If six rows are enough, leave it out of Featured and keep it in its group.
- Filtering is placed above server side because it leads every measured count and the own-site data. The gap between the two is not large; swapping them is defensible.
- Not featured, although demand is real: export (strong on "react table", weak on shadcn stems) and saved views (no search signal).

Top needs with no example page:

- Column width and resizing. The most viewed react-table question, 82 TanStack titles, and two own-site guides with impressions. A source example exists without a page (audit).
- Row click (clickable row, row link). 173,045 views; four shadcn suggestions.
- Responsive table on small screens. In the bare "shadcn data table" suggestion list; audit: TanStack #3259.
- Table state in the URL and cursor pagination (audit). TanStack-only wording.

## Naming rule for all example rows

- Drop the word "Example" from sidebar labels. The group is already called Examples. Seven of nine comparable docs do not repeat it.
- Keep "Example" in the page title and the H1 (for instance "Column Pinning Example"). "example" and "examples" are top suggestions on every stem, and "pagination example", "filter example", "grouping example" are completed phrases. The label is for scanning; the title is for search.
- Label shape: a noun phrase of one or two words, Title Case. Use "Column X" or "Row X" for features of a column or row, a single noun otherwise.
- Use the word people type: "Server-Side" not "Remote" or "Manual"; "Pinning" or "Sticky" not "Pinned" or "Frozen"; "Virtualization" not "Virtualized"; "Inline Editing" or "Editable" not "CRUD"; "Infinite Scroll" not "Infinite Scrolling"; "Export" plus the format.
- No tool names as the label when a need name exists ("Server-Side Pagination", not "React Query"). The tool goes in the page title or description.

## What could not be determined

- Absolute search volume for any phrase. A DataForSEO, Google Keyword Planner, Semrush or Ahrefs export for the phrases in the probe table would settle the order of rows 2 to 6.
- Whether "Column Pinning" or "Sticky Columns" is searched more. Both complete; Trends shows 0 to 2 for each. Keyword volume would settle it.
- Demand on the shadcn stems specifically. Trends cannot measure feature phrases there, and own-site data is 20 queries. Three more months of Search Console data, or PostHog page views per example page, would show what this site's visitors open.
- "People also ask" questions. Not returned by the search tool. A SERP API or a manual check would add them.
- The full AG Grid and MUI feature order. Only part of each navigation was read.
- Trends values are relative, sampled, and noisy under about 5. They rank big terms; they do not rank the small ones.
