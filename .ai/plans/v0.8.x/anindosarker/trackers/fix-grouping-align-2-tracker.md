# Expand column aligns start in every grouping mode (F58), tracker

Status: merged (dd9ef656)
Branch `v0.8/fix-grouping-align-2`, worktree 01, PR #128
Files owned: `hooks/display-columns/getST_RowExpandColumnDef.tsx` in the three bases; `stories/features/ColumnGrouping.stories.tsx`
Depends on: 06.3
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
- `pnpm --filter shadcn-table test:radix` at fcfdab4a: green (79 files, 608 tests), verifier
- `pnpm --filter shadcn-table test:aria` at fcfdab4a: green (79 files, 608 tests), verifier
- `pnpm --filter shadcn-table storybook:build:aria` at fcfdab4a: green, verifier
- tsc per base, `pnpm lint`, `pnpm check:bases`, `check:tailwind`, `test:base` recorded at 051e426d stay valid (diff since touches only the tracker), verifier

- Milestone 01 F58 fix with play: done (051e426d)
- Milestone 02 verify: done

## Attention

- F58 named the play `GroupedHeaderAlignsStart` as the one to gain the `false` and `'reorder'` cases; the builder added the sibling play `GroupedExpandAlignsStartAllModes` instead (its repro line above), leaving `GroupedHeaderAlignsStart` for `'remove'`. Verifier kept it: same coverage, one behaviour per play (P10).

## Notes

- Fix: `getST_RowExpandColumnDef.tsx` sets `alignProps` to `{ align: 'left' }` whenever `grouping?.length` (after the `positionExpandColumn === 'last'` right case), in every `groupedColumnMode`; the cells already read `tableCellProps.align`, so no cell file changed. A grouped table with a detail panel also aligns start, since grouping is active there.
- Answer to the owner's question: the fix is in the library (the three registry bases), not in the docs example; the docs copy under `apps/shadcn-table-docs/components/ui-<base>/` picks it up at the merger's regen.
