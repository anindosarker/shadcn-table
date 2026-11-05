# Expand column aligns start in every grouping mode (F58), tracker

Status: running
Branch `v0.8/fix-grouping-align-2`, worktree 01, PR #128
Gates:
- Repro on shipped code (f8d924f5): `ST_BASE=base pnpm --filter shadcn-table exec vitest run stories/features/ColumnGrouping.stories.tsx` red as expected (1 failed, 24 passed): `GroupedExpandAlignsStartAllModes` under `groupedColumnMode: false` the depth-0 group row's chevron 34 px from its cell's start (limit 24)
- `pnpm --filter shadcn-table tsc:radix` at 051e426d: green
- `pnpm --filter shadcn-table tsc:baseui` at 051e426d: green
- `pnpm --filter shadcn-table tsc:aria` at 051e426d: green
- `pnpm lint` at 051e426d: green
- `pnpm check:bases` at 051e426d: green
- `pnpm --filter shadcn-table check:tailwind` at 051e426d: green
- `ST_BASE=base pnpm --filter shadcn-table exec vitest run stories/features/ColumnGrouping.stories.tsx` at 051e426d: green (25/25)
- `ST_BASE=radix ... ColumnGrouping.stories.tsx` at 051e426d: green (25/25)
- `ST_BASE=aria ... ColumnGrouping.stories.tsx` at 051e426d: green (25/25)
- `ST_BASE=base ... DetailPanel.stories.tsx` at 051e426d: green (15/15)
- `ST_BASE=base ... Aggregation.stories.tsx` at 051e426d: green (9/9)
- `ST_BASE=radix ... DetailPanel.stories.tsx Aggregation.stories.tsx` at 051e426d: green (24/24)
- `ST_BASE=aria ... DetailPanel.stories.tsx Aggregation.stories.tsx` at 051e426d: green (24/24)
- `pnpm --filter shadcn-table test:base` at 051e426d: green (79 files, 608 tests)

- Milestone 01 F58 fix with play: done (051e426d)

## Attention

- None.

## Notes

- Fix: `getST_RowExpandColumnDef.tsx` sets `alignProps` to `{ align: 'left' }` whenever `grouping?.length` (after the `positionExpandColumn === 'last'` right case), in every `groupedColumnMode`; the cells already read `tableCellProps.align`, so no cell file changed. A grouped table with a detail panel also aligns start, since grouping is active there.
- Answer to the owner's question: the fix is in the library (the three registry bases), not in the docs example; the docs copy under `apps/shadcn-table-docs/components/ui-<base>/` picks it up at the merger's regen.
