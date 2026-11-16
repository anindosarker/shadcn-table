# Example demand audit

Date: 2026-11-16. Question: which 5 or 6 examples belong in a "Featured" group at the top of the Examples sidebar.

## What was checked

- Google Search Console, property `sc-domain:shadcn-table.com`, pages and queries, last 28 and 90 days. Checked.
- GitHub issues, PRs and discussions on anindosarker/shadcn-table. Checked.
- Plan notes under `.ai/plans` for recorded user asks, PostHog notes and screen recordings. Checked.
- Market: top issues and discussions on TanStack/table and KevinVandy/material-react-table (GitHub search, sorted by reactions, comments and upvotes); the shadcn/ui Data Table docs page (section headings of `apps/v4/content/docs/components/radix/data-table.mdx`); popular shadcn table repos (stars); one web search for "shadcn data table server side pagination sorting filtering". Checked.
- Source of `remote` and `react-query` examples and the mock API `app/api/data/route.ts` in wt1. Checked.

## What could not be checked

- PostHog page views per docs page. No query script or documented API use exists in the repo, and no PostHog variable is set in the environment. Skipped.
- The virtualization ask the owner mentions. It is not in any issue, discussion or plan note. Treated as an owner report, not verified.
- Search volume per phrase. No keyword tool was used.

## Source notes

### Own site (Search Console)

- Very little data. The 28 day and 90 day results are identical, so all traffic falls in the last 28 days. Total about 25 clicks and 400 impressions.
- Top page by clicks and impressions: guide `column-filtering`, 5 clicks, 46 impressions, position 5.4. Plus anchors for filter variants, display modes and custom filter functions.
- Other guides with clicks: `row-selection` (3 clicks), `column-resizing` (2 clicks, 18 impressions), `column-grouping` (2), `virtualization` (1 click, 10 impressions), `localization`, `column-actions`, `global-filtering` (1 each). `sorting` has 10 impressions, no click.
- Example pages are almost absent: `react-query` 1 click, `export-csv` 4 impressions, `column-pinning`, `editing-crud-inline-row`, `row-dragging` 2 impressions each. The `/docs/examples` index: 1 click, 7 impressions.
- Queries: "shadcn table" (101 impressions, 3 clicks). Feature queries: "shadcn table filter" and "shadcn table filters" (7 impressions, 1 click), "shadcn table sorting" (2), "shadcn table examples" (4). No query mentions server side, pagination, virtualization, editing, export, pinning, grouping or drag.

### Own project asks

- Issues: 4, all closed, all opened by the owner as build tasks (#4 to #7). No outside asks.
- PRs from outside contributors: none. Discussions: not enabled.
- Plan notes: no recorded user feature ask. PostHog screen recording notes in `.ai/plans/v0.9.x/anindosarker/reference/docs-layout/queue.md` (lines 44, 48, 53, 57, 60, 70) are about navigation and page clarity: visitors switch examples by name, land on guides without a demo, and get lost in an example. `.ai/plans/v0.9.x/anindosarker/queue.md` line 352 notes the usage page demo uses only text filters, and select filters would show the library better.

### Market

- TanStack/table discussions by upvotes: #1 is "A server side external sorting and filtering example" (#2033, 58 upvotes). Also: URL search params for column filters (#5002, 54), usage with react-query (#2193, 20), cursor-based pagination (#5861, 20), manual grouping on server (#4990, 19), date range filter (#4284, 16), fixed and auto-sized column widths (#3192, #4179), responsive collapse of columns (#3259, 33).
- TanStack/table issues by reactions (feature topics): sticky columns (#848, 75 reactions, 75 comments), column sizing and resizing (#58, #43, #5115, #4825), pagination with row selection (#4781), slow selection and paging at 300 rows (#2774), editable-data rerenders (#4794, 20), reorder columns by drag (#1570, 19).
- MRT issues by comments: virtualization errors and blinking rows (#445, 15 comments; #37, 14; #441, 8), manual pagination bugs (#943, #1251, #776), table editing refresh (#189, #1081), detail panel with virtualization (#365), slow large page sizes (#1164, #1321). MRT discussions: add a new row in editing mode (#283), custom edit component (#274).
- shadcn/ui Data Table docs walk one table through: basic table, cell formatting, row actions, pagination, sorting, filtering, column visibility, row selection, reusable header, pagination and column toggle.
- Popular shadcn table repos and their headline: sadmann7/tablecn (6,384 stars) "sorting, filtering, pagination, infinite scrolling", server side by default; openstatusHQ/data-table-filters (2,288 stars) "faceted filters, sorting, infinite scroll", cursor pagination in SQL; nainglinnkhant/shadcn-view-table (345 stars) "server side sorting, pagination, filtering, and custom views". Web search for the server side phrase returns tablecn, its forks and articles, all on server side sort, filter and paginate.

## Server side examples today

- Both `remote` and `react-query` do true server side sorting, filtering and pagination. Both set `manualFiltering`, `manualPagination`, `manualSorting` and `rowCount`, and send `start`, `size`, `filters`, `globalFilter` and `sorting` to `/api/data`, which filters, sorts and slices on the server.
- `remote` uses plain `fetch` in a `useEffect`, no extra library.
- `react-query` uses `useQuery` with `keepPreviousData`, a refetch button, error state and per column filter modes. It is closer to how apps fetch data today, and it is the only example page with a Search Console click.
- Recommendation: feature `react-query` as the server side example, and link `remote` from its page for readers without React Query.

## What people look for

| # | Need | Evidence | Sources | Matching example | Gap |
|---|------|----------|---------|------------------|-----|
| 1 | Server side sorting, filtering and pagination | Strong | TanStack #2033 (top discussion), #2193, #5861; tablecn, shadcn-view-table headlines; web search results; MRT manual pagination issues | `react-query`, `remote` | Cursor based pagination has no example |
| 2 | Filtering, column and faceted | Strong | Own site: top guide and the only feature queries; openstatus repo headline; TanStack #4284, #5617; shadcn docs section | `filter-variants` (9 variants incl. select, multi-select, date range), `faceted-values` | None |
| 3 | A plain table with sort, filter, paginate, select | Strong | shadcn/ui docs walk; "shadcn table" is the top query; row-selection guide clicks | `basic` | None |
| 4 | Sticky or pinned columns | Strong | TanStack #848 (most reacted feature issue) | `column-pinning`, also in `advanced` | None |
| 5 | Column sizing and resizing | Medium | TanStack #58, #43, #3192, #4179, #4825; own site column-resizing 18 impressions, 2 clicks | Only inside `virtualized`, `aggregation-and-grouping` | No example page; source `examples/base/enable-column-resizing` exists without a page |
| 6 | Large data and virtualization | Medium | MRT #445, #37, #441, #365, #1164; TanStack #2774; own site virtualization guide 10 impressions, 1 click; owner report (unverified) | `virtualized`, `row-virtualization`, `column-virtualization`, `infinite-scrolling` | None |
| 7 | Editing, CRUD | Medium | TanStack #4794; MRT #189, #1081, #283, #274; own site 2 impressions on inline row | `editing-crud` and inline variants | None |
| 8 | Infinite scroll | Medium | tablecn and openstatus headlines | `infinite-scrolling` | None |
| 9 | Saved views and state in the URL | Medium | TanStack #5002 (54 upvotes, URL search params); shadcn-view-table "custom views" | `persistent-view` (localStorage only) | No URL state example |
| 10 | Full featured showcase | Medium (inferred) | Repo headlines list many features at once; covers pinning, grouping, faceting, selection, actions | `advanced` | None |
| 11 | Row and column drag ordering | Weak | TanStack #1570; own site 2 impressions on row-dragging | `column-ordering`, `row-ordering`, `row-dragging` | None |
| 12 | Grouping and aggregation | Weak | Own site column-grouping 2 clicks; TanStack #4990 (server side grouping) | `aggregation-and-grouping`, `column-grouping` | Server side grouping has no example |
| 13 | Export | Weak | Own site export-csv 4 impressions; no market signal found | `export-csv`, `export-pdf` | None |
| 14 | Responsive columns on small screens | Weak | TanStack #3259 (33 upvotes) | None | No example |

## Proposed Featured list

1. `basic`. The shadcn/ui docs and the top query "shadcn table" point to one plain table with sort, filter, paginate and select.
2. `react-query`. Server side sort, filter and paginate is the most upvoted TanStack discussion and the headline of the two biggest shadcn table repos.
3. `filter-variants`. Filtering is the strongest own-site signal: top guide by clicks and impressions and the only feature queries.
4. `advanced`. One page shows pinning (the most reacted TanStack feature issue), grouping, faceting, selection and row actions.
5. `virtualized`. Virtualization and large-data performance fill the most commented MRT issues, plus the owner's report.
6. `editing-crud`. Editing is a steady ask across TanStack and MRT issues and discussions.

Agreement with the owner's list:

- Agrees on `basic` first, a server side example second, then `advanced` and `virtualized`.
- Server side pick: `react-query` over `remote`. Both are true server side; `react-query` matches how apps fetch today.
- Adds `filter-variants`. The owner's list has no filter example, but filtering is the clearest demand on the site itself.
- Swaps `persistent-view` for `editing-crud`. The saved view demand in the market is about state in the URL, which `persistent-view` does not show (it uses localStorage). If the owner keeps six with `persistent-view`, drop `editing-crud` rather than `filter-variants`.

## Demand with no example today

- Column resizing: a guide exists and gets clicks, but no example page. Source `examples/base/enable-column-resizing` already exists.
- Table state in the URL (filters, sort, page in search params). TanStack #5002, 54 upvotes.
- Cursor based pagination on the server. TanStack #5861; openstatus headline.
- Server side grouping. TanStack #4990.
- Responsive column collapse on small screens. TanStack #3259.
