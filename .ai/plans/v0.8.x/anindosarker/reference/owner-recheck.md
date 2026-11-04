# 0.8 recheck, owner

Local docs site on http://localhost:5320, restarted after `claude/review` moved. One line per finding, the page, what to see.

## Library

- [ ] F12 `/docs/examples/export-csv`: select checkboxes centred in header and body, same x; `/docs/examples/row-virtualization`: row numbers centred, muted, tabular digits.
- [ ] F16 `/docs/examples/persistent-view`, view settings, Row numbers on, grid lines All: every body cell edge matches its header cell. (Not reproduced in Storybook; if still wrong, screenshot it.)
- [ ] F17 `/docs/examples/advanced`: column menu on Name, Filter, the editor opens on the header and filters; the chips row shows in the custom toolbar.
- [ ] F18 `/docs/examples/advanced`: Employee and Job Info group headers end exactly where their columns end; pin a column from its menu, the group still matches.
- [ ] F19 `/docs/examples/export-csv`: the funnel opens the filter popover; First Name and Last Name no longer truncate.
- [ ] F22 `/docs/examples/editing-crud-inline-row` (and modal, cell, table, tree): actions column first, "Actions" header, edit and delete both visible; editing a row shows cancel and save.
- [ ] F24 `/docs/examples/detail-panel`: row 3 has no expand button; other rows expand to a panel with content.
- [ ] F25 `/docs/examples/chart-detail-panel`: the charts draw lines.
- [ ] F29 `/docs/examples/filter-variants`: State multi-select, pick two states, rows filter.
- [ ] F31 any chip editor: the focused input shows the same 3 px ring as the search box. (Fix in flight at the time of writing.)
- [ ] D47 sort editor on a table with `maxMultiSortColCount`: "Add sort" disappears at the cap (Storybook `SortPopover` story).
- [ ] D48 columns menu (view settings, Columns): an icon before each column name.
- [ ] D41 view settings: the row reads "Row numbers".

## Docs

- [ ] D46 `/`: home demo is the stock table on the demo data with icons; the steps run Sorting, Search, Editing, Filtering, Column order, View settings.
- [ ] D45, D49 any example and any Storybook story: every column header has an icon.
- [ ] D50, F13 `/docs/examples/persistent-view`: 50 rows, 15 columns, sticky header visible when scrolling.
- [ ] D51 `/docs/examples/subheader-filters`: the 0.7 filter row with variants and the mode picker; Popover Filters page unchanged.
- [ ] F26 `/docs/examples/filter-variants`, `faceted-values`, `filter-switching`: chips, no subheader inputs; each variant control appears inside the chip editor.
- [ ] F14 any example: the pagination row is fully inside the frame; `/docs/examples/react-query`: first row not under the sticky header.
- [ ] F15 `/docs/examples/export-csv`, `export-pdf`: ID column digits not clipped.
- [ ] F21 `/docs/examples/row-ordering`, `row-dragging`: intro copy says row, not column.
- [ ] F27 `/docs/examples/advanced`, `custom-top-toolbar`, `custom-headless`, `external-toolbar`, `custom-filter-ui`, `row-ordering`: view settings button present; `minimal` has none, by design.
- [ ] F10 Storybook `Styling / Default Look`: the story passes only columns, data, `getRowId`, `enableRowActions`.

## Not changed, your call later

- F20 row drag animation (parked), F28 semantic layout checkbox centring, F30 columns menu flip offset (unreproduced).
