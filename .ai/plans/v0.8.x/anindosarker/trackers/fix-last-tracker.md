# Last fixes (F19, F28, F30, F39, F40, F41, D56, D57), tracker

Status: running (gates green, PR #114 open, not merged)
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
- `pnpm --filter shadcn-table tsc:radix` at ccbae6f3: green
- `pnpm --filter shadcn-table tsc:baseui` at ccbae6f3: green
- `pnpm --filter shadcn-table tsc:aria` at ccbae6f3: green
- `pnpm lint` at 4fa8c378: green (9 docs warnings, pre-existing, none in touched files)
- `pnpm check:bases` at 3259e974: green
- `pnpm --filter shadcn-table check:tailwind` at 3259e974: green
- `pnpm check:icons` at 3259e974: green
- `ST_BASE=radix vitest run` the seven touched story files at 3259e974: green (100 tests); `RowOrdering.stories.tsx` again at ccbae6f3: green (8)
- `ST_BASE=base vitest run` the seven touched story files at 3259e974: green (100 tests)
- `ST_BASE=aria vitest run` the seven touched story files at 3259e974: green (100 tests); `RowOrdering.stories.tsx` again at ccbae6f3: green (8)
- `pnpm --filter shadcn-table test:base` at ccbae6f3: green (79 files, 553 tests)
- `pnpm --filter shadcn-table-docs types:check` at 7fdacefb: green
- `node scripts/check-pages.mjs d --base radix --url http://localhost:5341` at 4fa8c378: green (261 passed)
- `node scripts/check-pages.mjs d --base base --url http://localhost:5341` at 4fa8c378: green (261 passed)
- `node scripts/check-pages.mjs d --base aria --url http://localhost:5341` at 4fa8c378: green (261 passed)
- CI run: none reported on the draft PR at 4fa8c378 (`gh pr checks 114`: no checks)

- Milestone 01 library fixes with plays (F19 funnel button, D57 row drop slide, F28 semantic checkbox, F30 columns menu flip offset, F39 resize hairline alignment, F40 toolbar mount animation, F41 grouped column icon in `getST_RowExpandColumnDef.tsx:63-70`): done (ccbae6f3)
- Milestone 02 docs (D56 export examples on chips, page checks): done (4fa8c378)

## Attention

- F41 icon only under `groupedColumnMode: 'remove'`: the task named 'remove' and 'reorder', but under 'reorder' the expand column shows only the expand-all button (no grouped label) and the grouped column keeps its own header and icon, so an icon there would stand alone; `getST_RowExpandColumnDef.tsx` sets `icon` for 'remove' only. Revert: drop the `groupedColumnMode === 'remove'` condition on `icon`.
- F39 under `columnResizeMode: 'onEnd'` the body shows no guide, as before: the body cells keep their width until the drop and clip their content (`overflow-hidden`), so a guide at the pointer cannot be drawn from them; the header hairline follows the pointer and ends exactly on the edge the drop will set. A body guide for onEnd would need one table-level line element (a new design, not in this story).
- F39 the "bordered box around the cell" from the owner's aria screenshot does not reproduce headless in any base (the play compares the header cell's borders, outline and box-shadow mid-drag with its resting style, green in base and aria); the guard stays.
- F40 mount fade starts at 10% opacity (`fade-in-10`), not 0 as on the pinned items: from 0, the existing play `ChipsDisplayMode` (`stories/features/Filtering.stories.tsx:133`, `toBeVisible` on the Filter button right after mount) went red in the full `test:base` because the button was at opacity 0 in its first frame. The difference is not visible at 200 ms. Revert: `*:fade-in` in `ST_ToolbarInternalButtons.tsx` and wait for the animation in that play.
- CHANGELOG: the task asked for the block under "### Fixed"; D57 is a new behaviour (the commit is `feat`), its line sits in the same `#### Fix ...` block as asked. Move it under `### Added` if wanted.
- No `Claude-Session:` line was given in this run's harness reminder, so the commits carry none.

## Notes

- Gate commits: tsc, lint, check:bases, check:tailwind and check:icons ran at 3259e974 after the last library change; later commits touch only stories (ccbae6f3, reran tsc, lint, the story file per base and full test:base) and `d.mjs` (4fa8c378, reran lint and the page checks).

- D57 plays read the animations through a recorder around `Element.prototype.animate` instead of `getAnimations()` after the drop: in the full `test:base` on the loaded machine the real-pointer drag returned after 4.7 s, when the 200 ms slide had finished, and `DropSlidesRows` went red. The recorder asserts the same: the moved row and the first row get a translate slide, row 6 none, the moved row's cells a highlight; under reduced motion no slide and the highlight.

- D57: `hooks/useST_RowFlip.ts` (mounted from `ST_TableBody`) mirrors the column flip's drop path. The grip's dragend measures every unpinned row's top by its row data into the new `rowFlipPending` state (`stRowDraggingFeature`) before the consumer's `onDragEnd` reorders the data; after the commit the hook matches rows by data (index row ids work), slides each moved `tr` with `element.animate()` and flashes the dropped row's cells with `flashST_Highlight`. A row that left the table plays nothing (cross-table drop), as does a drop that changed nothing (the pending clears on the next task). No `registry.ts` entry was needed: `buildBaseItems` lists every file of the tree; `registry.json` regenerated. Detail panel rows do not slide with their parent row (a known limit).
- `DropNoSlideReducedMotion` emulates reduced motion by stubbing `window.matchMedia` in the play (the library reads the preference through it), since the Vitest browser runner has no media emulation command.

- F30 reproduced (no longer "found by reading"): with the table 200 px from the page edge, a Columns menu reorder slid every header, unmoved ones included, by 217 px. The menu now records `getST_ColumnFlipPositions(table)` (table-relative, the same measure the hook and the header grab handle use); `useST_ColumnFlip.ts` needed no change.

- F39 geometry: the header hairline was centred on the edge (0.5 px past it) and the body guide a 2 px end border inside the cell, so the two lines overlapped by half a pixel. Both are now the same 1 px range ending on the edge: the hairline sits at `end-1` of the centred 8 px hit area (`end-0` for the last column), the body guide is a 1 px `border-inline-end` (a border spans the row borders, an absolutely placed line in the clipping cell leaves 1 px gaps).

- F19: the 24 px funnel takes 12 px more of the header, so the existing play `OpensWithRowSelection` (labels fit at 120 px columns) went red; its story's name columns are now 180 px (the export example it mirrored leaves popover mode, D56). At 120 px the label truncates with an ellipsis (min-w-0 truncate, as settled).

- `GroupedHeaderHasIconReorder` passes on the shipped code: under `groupedColumnMode: 'reorder'` the grouped column keeps its own header and icon, and the expand column shows only the expand-all button (no grouped label), so there is no defect there; the play stays as a guard.
