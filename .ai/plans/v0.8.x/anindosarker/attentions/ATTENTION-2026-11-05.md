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
