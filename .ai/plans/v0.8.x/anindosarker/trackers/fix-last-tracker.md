# Last fixes (F19, F28, F30, F39, F40, F41, D56, D57), tracker

Status: running
Branch `v0.8/fix-last`, worktree 01, PR #114
Gates:
- Repro on shipped code (335c749c), base, `FunnelIsClickable`: red, the funnel button is 12.07 px wide (want at least 24).
- Repro on shipped code (335c749c), base, `DropSlidesRows`: red, the moved row has no translate animation after the drop (0 animations).
- Repro on shipped code (335c749c), base, `DropNoSlideReducedMotion`: red, the moved row has no highlight animation after the drop (0 animations).
- Repro on shipped code (335c749c), base, `CheckboxesAlignSemantic`: red, the body checkbox centre sits 34.3 px left of the cell centre.
- Repro on shipped code (335c749c), base, `MenuReorderWithTableOffset`: red, the unmoved State header slides by 217 px (the table's page offset); F30 confirmed.
- Repro on shipped code (335c749c), base, `ResizeGuidesMeetEdge`: red, the hairline's trailing side is 0.5 px past the edge and the body guide is a 2 px cell border.
- Repro on shipped code (335c749c), base, `ResizeGuidesMeetEdgeOnEnd`: red, the hairline's trailing side is 0.5 px past the edge the drag will set.
- Repro on shipped code (335c749c), base, `InternalButtonsAnimateIn`: red, `Show/Hide search` has no mount animation.
- Repro on shipped code (335c749c), base, `GroupedHeaderHasIcon`: red, the `st-row-expand` header has no `svg.lucide-map`.

- Milestone 01 library fixes with plays (F19 funnel button, D57 row drop slide, F28 semantic checkbox, F30 columns menu flip offset, F39 resize hairline alignment, F40 toolbar mount animation, F41 grouped column icon in `getST_RowExpandColumnDef.tsx:63-70`): running
- Milestone 02 docs (D56 export examples on chips, page checks): planned

## Attention

- F41 icon only under `groupedColumnMode: 'remove'`: the task named 'remove' and 'reorder', but under 'reorder' the expand column shows only the expand-all button (no grouped label) and the grouped column keeps its own header and icon, so an icon there would stand alone; `getST_RowExpandColumnDef.tsx` sets `icon` for 'remove' only. Revert: drop the `groupedColumnMode === 'remove'` condition on `icon`.
- F39 under `columnResizeMode: 'onEnd'` the body shows no guide, as before: the body cells keep their width until the drop and clip their content (`overflow-hidden`), so a guide at the pointer cannot be drawn from them; the header hairline follows the pointer and ends exactly on the edge the drop will set. A body guide for onEnd would need one table-level line element (a new design, not in this story).
- F39 the "bordered box around the cell" from the owner's aria screenshot does not reproduce headless in any base (the play compares the header cell's borders, outline and box-shadow mid-drag with its resting style, green in base and aria); the guard stays.

## Notes

- F30 reproduced (no longer "found by reading"): with the table 200 px from the page edge, a Columns menu reorder slid every header, unmoved ones included, by 217 px. The menu now records `getST_ColumnFlipPositions(table)` (table-relative, the same measure the hook and the header grab handle use); `useST_ColumnFlip.ts` needed no change.

- F39 geometry: the header hairline was centred on the edge (0.5 px past it) and the body guide a 2 px end border inside the cell, so the two lines overlapped by half a pixel. Both are now the same 1 px range ending on the edge: the hairline sits at `end-1` of the centred 8 px hit area (`end-0` for the last column), the body guide is a 1 px `border-inline-end` (a border spans the row borders, an absolutely placed line in the clipping cell leaves 1 px gaps).

- F19: the 24 px funnel takes 12 px more of the header, so the existing play `OpensWithRowSelection` (labels fit at 120 px columns) went red; its story's name columns are now 180 px (the export example it mirrored leaves popover mode, D56). At 120 px the label truncates with an ellipsis (min-w-0 truncate, as settled).

- `GroupedHeaderHasIconReorder` passes on the shipped code: under `groupedColumnMode: 'reorder'` the grouped column keeps its own header and icon, and the expand column shows only the expand-all button (no grouped label), so there is no defect there; the play stays as a guard.
