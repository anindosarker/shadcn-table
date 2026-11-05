# Attention, 2026-11-05

## A11 The grouping column shows an icon only in the "remove" grouped column mode

- F41 fix: under `groupedColumnMode: 'remove'` the combined grouping column carries the first grouped column's icon. Under `'reorder'` the expand column has no grouped label, so the builder left it without an icon rather than show an icon beside nothing (`hooks/display-columns/getST_RowExpandColumnDef.tsx`, three bases). The play `GroupedHeaderHasIconReorder` passes on the shipped code and stays as a guard.
- Options:
  - a) Recommended: keep; icon only where a grouped label renders.
  - b) Revert the condition so the expand column shows the icon in both modes.

## A12 Resizing with `columnResizeMode: 'onEnd'` shows no body guide line

- F39 fix: in `'onChange'` mode the header hairline and the body guide are now one 1 px line ending on the column's trailing edge. In `'onEnd'` mode only the header hairline follows the pointer; body cells keep their width until the drop, so no body guide exists. A guide there needs a table-level line, which is a new design, not a fix.
- Options:
  - a) Recommended: keep as shipped; `'onEnd'` shows the header hairline only.
  - b) A follow-up decision for a table-level guide line in `'onEnd'` mode (next cycle).

## A13 The "bordered box around the cell" while resizing does not reproduce

- The owner's aria Storybook screenshot (F39, 2026-11-05 00:4x) showed a bordered box around the header cell during a resize drag. Headless Chromium shows no such box in any base before or after the fix; the play `ResizeGuidesMeetEdge` asserts its absence as a guard. It may have been the pre-fix 2 px body-cell border seen through the header, now gone.
- Options:
  - a) Recommended: owner rechecks `Click To Copy Enabled With Column Resizing` in the aria Storybook after the merge; if still visible, a new finding with a capture.
  - b) Treat as fixed by F39.

## A14 The toolbar buttons fade in from 10 percent opacity, not from 0

- F40 fix: every internal toolbar button now mounts with the same fade and zoom as the pinned view items. The fade starts at 10 percent opacity (`fade-in-10`), not 0: with 0 the existing play `ChipsDisplayMode` (`stories/features/Filtering.stories.tsx:133`, `toBeVisible` right after mount) fails in the full `test:base`. Visually the difference is one frame.
- Options:
  - a) Recommended: keep `fade-in-10`.
  - b) Start from 0 and change that play's assertion to wait for the animation.

## A15 Custom toolbar actions re-render on search, filter and sort changes too

- F43 fix: the custom actions of both toolbars render inside a `table.Subscribe` on `rowSelection`, `columnFilters`, `globalFilter` and `sorting` (`components/toolbar/ST_TopToolbar.tsx`, `ST_BottomToolbar.tsx`, three bases), so an action that reads any of those updates. A search keystroke therefore re-renders the actions (only the actions, not the toolbar).
- Options:
  - a) Recommended: keep the four-state selector.
  - b) Narrow it to `rowSelection` only; actions reading filters, search or sorting would need their own subscription.

## A16 A subheader filter never widens its column any more

- F44 fix: the subheader filter container has `contain-inline-size overflow-hidden` (`head/ST_TableHeadCellFilterContainer.tsx`, three bases), so a column keeps its `size` and clips a filter that is wider. Before the fix a wide filter grew the th past its size. D61 chose clipping for range fields; this applies it to every variant: a text filter (`min-w-24`) in a column under about 120 px is clipped too.
- Options:
  - a) Recommended: keep; the consumer sizes a filterable column (as Material React Table).
  - b) Let the th grow to the filter's min width again for single-field variants (text, select, multi-select), clip range fields only.

## A17 At 1280 px wide the home demo's step list never shows together with the table

- Below 1440 px the step list moves under the table (`v12.css:489-497`); the band is then 882 px (650 px table plus 232 px list) while a 720 px viewport minus the 60 px sticky nav shows 660 px, so a visitor sees the table or the list, not both. The replay no longer scrolls the page (fixed in #119). D46 makes no layout call for narrow widths.
- Options:
  - a) Recommended: below 1440 px the list drops the code lines and the hint, one row per step (about 150 px), so table and list fit a 720 px viewport together.
  - b) Fewer rows per page below 1440 px (seven rows, 506 px table).
  - c) Keep as is.

## A18 The striped rows the demo lands are faint

- The View settings step toggles Striped; odd rows go from `#0a0a0a` to `#111111` in dark and from white to `#f8f8f8` in light, the stock `--st-stripe` value (`ST_TableLayout.tsx:25`: `--muted` at 25 percent dark, 70 percent light). The demo keeps the stock tint (D46, P8), so the step's result is hard to see.
- Options:
  - a) Recommended: keep the stock tint; the demo is the library's default look.
  - b) Raise the library default (`--st-stripe` at a stronger mix), a visible change for every consumer.
  - c) The demo sets a stronger `--st-stripe` on its table root only.

## A19 The sort chip shows no sort direction

- After the Sorting step the chip reads "Due" with the swap icon and a chevron (`toolbar/ST_SortPopover.tsx:108-124`); the ascending arrow shows only in the Due header. The chip renders only while a sort exists (:105), so the step opens the editor from the toolbar Sort button.
- Options:
  - a) Recommended: keep; the header arrow carries the direction (spec 04 chip design).
  - b) The chip's icon follows the first sort's direction (arrow up or down instead of the swap icon), library change in the three bases.

## A20 The home demo no longer plays on first load at 1440x900

- D63 (F48): the replay runs only while the toolbar has 360 px of room below it. At 1440x900 with the page at the top the toolbar sits 157 px above the bottom edge, so the demo holds on "Starting" until the visitor scrolls it up; the same on any viewport where the toolbar lands within 360 px of the bottom. The first impression changes from a playing demo to a still table with "Starting".
- Options:
  - a) Recommended: keep; the demo plays as soon as the visitor scrolls to it.
  - b) Lower the room to what the sort editor needs (about 260 px) so a 1440x900 first load plays; the view settings panel (309 px) then flips up in that position.
