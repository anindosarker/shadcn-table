# Subheader filter layout (F44), tracker

Status: running
Branch `v0.8/fix-subheader-filters`, worktree 01, PR #117
Gates:
- Repro on shipped code (7fc6473e), `ST_BASE=base pnpm --filter shadcn-table exec vitest run stories/features/Filtering.stories.tsx`: red as intended, 2 of 23 failed. FilteringChangeModeEnabledFaceted `SliderCaptionBelowTrack`: caption top 220 above track bottom 223. SubheaderRangeFieldsNarrow `SubheaderInputsInsideCell`: the table overflows its scroll box (445 > 442), the range fields widen their th past its size.
- `pnpm --filter shadcn-table tsc:radix` at cdce2707: green
- `pnpm --filter shadcn-table tsc:baseui` at cdce2707: green
- `pnpm --filter shadcn-table tsc:aria` at cdce2707: green
- `pnpm lint` at cdce2707: green
- `pnpm check:bases` at cdce2707: green
- `pnpm --filter shadcn-table check:tailwind` at cdce2707: green
- `ST_BASE=radix ... vitest run stories/features/Filtering.stories.tsx` at cdce2707: green (23 of 23)
- `ST_BASE=base ... vitest run stories/features/Filtering.stories.tsx` at cdce2707: green (23 of 23)
- `ST_BASE=aria ... vitest run stories/features/Filtering.stories.tsx` at cdce2707: green (23 of 23)
- `pnpm --filter shadcn-table test:base` at cdce2707: green (79 files, 599 tests)
- `pnpm --filter shadcn-table-docs types:check` at cdce2707: green
- `node scripts/check-pages.mjs e --base radix --url http://localhost:5345` at cdce2707: green (675 passed)
- `node scripts/check-pages.mjs e --base base --url http://localhost:5345` at cdce2707: green (675 passed)
- `node scripts/check-pages.mjs e --base aria --url http://localhost:5345` at cdce2707: red (674 passed, 1 failed: the caption text check read the React Aria checkbox label); fixed in c4c11912
- `node scripts/check-pages.mjs e /docs/examples/subheader-filters --base radix|base|aria --url http://localhost:5345` at c4c11912: green (37 passed each; only that entry changed)

- Milestone 01 fix with play: done (c4c11912)

## Attention

- The subheader filter container carries `contain-inline-size`, so a filter adds no width to its th and a column keeps its `size` (D61 clips). Before, a filter wider than its column widened the th past `size`. A text filter (`min-w-24`) in a column under about 120 px is now clipped too, not only range fields.
- The docs subheader-filters columns are wider than the task's starting sizes, measured so no placeholder is cut: Age 240 (170 cut "Min" to "M"), Hire Date 380, Arrival 480, Departure 320 (300, 360 and 240 cut the date and time placeholders behind the mode button).
- The range caption check (`SubheaderInputsInsideCell`) needs a fitted range column, so FilteringChangeModeEnabledFaceted gained a 'date-range' Birth Date column (size 320); the narrow story checks one row, the th size and no table overflow.
- React Aria: the subheader-filters Salary slider renders both thumbs at 0 with no fill (thumb inputs read value 0 against `min: 30_000`). Not a layout issue and not changed here; shipped behaviour, worth a finding.

## Notes

- The earlier attempt (4496061b) stacked Min and Max under a width computation; ac570117 removes it per D61 and keeps the caption, padding and slider work.
- The filter mode caption of a range filter renders once in `ST_FilterRangeFields` under the grid; `ST_FilterTextField` skips its caption when `rangeFilterIndex` is set.
