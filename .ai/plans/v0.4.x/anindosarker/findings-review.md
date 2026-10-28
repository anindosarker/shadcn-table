# v0.4.x review findings

Bugs the owner found on 2026-10-28 reviewing the parts 01 to 04 run on Storybook (radix,
`pnpm preview`). Each goes to part 04.1 with a story that reproduces it. Files to blame are
not yet located; the first step of the part is the diagnosis per bullet.

### Row pinning on select, stories `features-row-pinning-on-select--*`

Re-run on `e26804d6` (Playwright, Radix, 1440 px): the first and third bullets were the
"next page" arrow in the owner's sequence, the label is right for page 2; the second bullet is
a real bug with a different shape: on page 2 the header box toggles only the page's own rows, the kept pinned rows stay selected and lose their pins. Ruling pending.

- `select-all-page-mode` (8 rows, page size 5): after select all on page 1 the five pinned
  rows render on top and the page shows the three remaining rows, but the pagination label
  reads `6-8 of 8`, the page index moved to the second page. Every later state keeps the
  wrong page.
- Same story: with every page row selected the select-all checkbox shows indeterminate and
  does not unselect; only the toolbar `Clear selection` clears. `getIsAllPageRowsSelected`
  likely reads the center row model, which excludes the pinned rows.
- Same story: after `Clear selection` the table shows `6-8 of 8` with the three rows of the
  second page; the page index did not come back.
- `select-all-all-mode` (`selectAllMode: 'all'`): select all pins all eight rows and the
  label reads `1-5 of 8` while eight rows are visible; the row order changes to the pin
  order (Jackson, Nora, Owen, Mason, ...) instead of the data order, and comes back to the
  data order on unselect. Expected: pinned rows keep the data order, the label counts what
  is shown.
- Decision 9 in `decisions-review.md`: unselect all unpins everything, as 0.3.3 did.

### Row pinning select sticky, story `features-row-pinning-examples--row-pinning-select-sticky-mode`

- 50 rows: select all pins 46 of 50 (count off by the page?) and the sticky pinned rows
  paint over the sticky header row, so the select-all checkbox is covered and nothing can
  be unselected from the header. The pinned rows need the header's height as their top
  offset, or a lower z-index than the head.
