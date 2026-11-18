# Guide example candidates (Q128)

Lookup 2026-11-18, code read on `origin/v0.9/docs-layout`, nothing rendered. For each guide whose Example section shows `basic` or an example not made for its feature: the best existing table with the feature visibly in use on load.

- `GuideExamples` takes only an example page slug or `more/<story id>`. Many tables embedded lower in a guide (MultiSorting, EnableColumnResizing, CustomTopToolbar, RowActions menu items and buttons, row-numbers static) have no page, so showing one on top first needs a page or story for it.
- Story play functions never run on docs pages (`components/story-example.tsx`), so a seeded story shows only its initial state.

| Guide | Shows today | Better candidate | What the reader sees on load | Confidence | Note |
|---|---|---|---|---|---|
| best-practices | basic | basic stays | Plain typed table | high | The guide covers TypeScript, updates and debugging; no table shows that more |
| data-columns | basic | basic stays | Accessor columns, one with a nested key | medium | Lower ColumnAlignmentExample has no page; advanced has custom cells but the subject gets lost |
| accessibility | basic | basic stays | Plain table | high | No table shows keyboard navigation on load |
| tanstack-table-with-shadcn-ui | basic | basic stays | Plain table | high | Concept guide; it links basic |
| column-size | basic | Custom Widths Semantic, `/docs/examples/more/styling-custom-column-widths--custom-widths-semantic`, story page | Columns at sizes 50 / 300 / 100 / 50, clearly uneven | medium | Basic sets only 150 and 200, so its widths look normal |
| column-resizing | basic | none | - | low | New story: `initialState.columnSizing` on one column (ResetSizeAnimates has `firstName: 400` but no page). Existing resize pages start at default widths; lower EnableColumnResizingExample has no page |
| density-toggle | basic | Default To Dense Padding, `/docs/examples/more/features-dense-padding--default-to-dense-padding`, story page | Compact rows, 25 per page, toggle still in the toolbar | high | Lower DisableDensityToggleExample is compact but hides the toggle, so it is wrong for the top |
| full-screen-toggle | basic | basic stays | Plain table with the full screen button | high | default-full-screen-on would cover the docs page on load |
| overflow-tooltip | basic | Overflow Tooltip, `/docs/examples/more/styling-default-look--overflow-tooltip`, story page | Narrow Name column (size 90) cuts task names off; hover shows the tooltip | high | Lower BasicExample repeats basic; drop it (D122) |
| filter-chips | basic | Chips Seeded, `/docs/examples/more/features-filter-chips--chips-seeded`, story page | Two chips, Status Done and Priority High; 2 rows | high | - |
| global-filtering | basic | Search Initial State, `/docs/examples/more/features-search--search-initial-state`, story page | Rows filtered by the search term "John" | medium | Not verified whether the search box shows open. Lower RemoteExample and CustomizeGlobalFilter start with no term |
| column-hiding | basic | View Settings Seeded, `/docs/examples/more/features-view-settings--view-settings-seeded`, story page | Priority column hidden, compact density | medium | Only story page with a hidden column the reader can bring back. The columns-hidden-and-not-visible story also hides it from the menu. Cleaner new story: default table plus `initialState.columnVisibility` |
| sorting | basic | Sort Ranking, `/docs/examples/more/features-sorting--sort-ranking`, story page | Sorted by First Name ascending, row numbers on | medium | Uses a fuzzy sortFn, a niche. Lower MultiSortingExample (state asc, city desc) is the natural table but has no page. Alternative: sort-popover-seeded |
| sort-editor | basic | Sort Popover Seeded, `/docs/examples/more/features-sort-popover--sort-popover-seeded`, story page | Two sorts (Status asc, Name desc) and the sort button | high | Lower MultiSortingExample has no page |
| column-actions | basic | basic stays | Plain table, menus closed | medium | Every table starts with the menu closed. menu-items-follow-the-column-state (sort, filter and pin seeded) is the only alternative, low value |
| row-selection | export-csv | Sticky Row Selection, `/docs/examples/sticky-row-selection`, example page | One row selected and pinned on top | high | Same table as lower EnableRowPinningSelectExample; drop the lower one (D122) |
| row-numbers | row-virtualization | current stays | Row numbers on, counting to 10000 | medium | Alternative: `/docs/examples/more/features-row-number--enable-row-numbers-static` (paged, numbers on) |
| tint-tokens | sticky-row-selection | current stays | Selected and pinned rows, so the tints show at once | high | Striped and hover tints can't be seen on load |
| table-event-listeners | row-dragging | current stays | Drag handles | low | Click-propagation stories call alert(), unfit. Possible new story: `stTableBodyRowProps` onClick that writes the clicked row under the table |
| column-icons | persistent-view | current stays | Icons in the headers | medium | Alternative: chips-seeded shows icons in headers and chips |
| view-settings | persistent-view | current stays | Every view settings item pinned to the toolbar | high | Alternative: view-settings-seeded (compact, Priority hidden) |
| toolbar-customization | advanced | Custom Top Toolbar Actions, `/docs/examples/more/features-toolbar--custom-top-toolbar-actions`, story page | A custom "Create New User" button in the toolbar | medium | The button calls prompt() on click. Lower CustomTopToolbarExample has no page |
| row-actions | advanced | Custom Row Action Buttons, `/docs/examples/more/features-row-actions--custom-row-action-buttons`, story page | Action buttons on every row | medium | Alternative: `features-row-actions--row-actions-enabled` (menu). Lower RowActions examples have no page |
| click-to-copy | own story (copy-button-props) | current stays | Click to copy on for the whole table | high | Already built for this guide |
| display-columns | advanced | Customize Display Columns, `/docs/examples/more/styling-styling-display-columns--customize-display-columns`, story page | Row numbers, selection and actions columns with custom sizes | medium | Same options as lower CustomizeDisplayColumnsExample; drop the lower one (D122) |

Count: 12 have a better existing table, 1 needs a new story (column-resizing), 6 keep basic, 6 keep their current non-basic example.

Not verified: whether Search Initial State shows the search box open, and how uneven Custom Widths Semantic looks on screen.
