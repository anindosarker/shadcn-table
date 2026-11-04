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

## Notes

- F19: the 24 px funnel takes 12 px more of the header, so the existing play `OpensWithRowSelection` (labels fit at 120 px columns) went red; its story's name columns are now 180 px (the export example it mirrored leaves popover mode, D56). At 120 px the label truncates with an ellipsis (min-w-0 truncate, as settled).

- `GroupedHeaderHasIconReorder` passes on the shipped code: under `groupedColumnMode: 'reorder'` the grouped column keeps its own header and icon, and the expand column shows only the expand-all button (no grouped label), so there is no defect there; the play stays as a guard.
