# Grouping column aligns start (F57), tracker

Status: verified
Branch `v0.8/fix-grouping-align`, worktree 01, PR #127
Gates:
- Repro on shipped code (2c00ccfa): `ST_BASE=base pnpm --filter shadcn-table exec vitest run stories/features/ColumnGrouping.stories.tsx -t "Aligns Start"` red as expected: `GroupedHeaderAlignsStart` breadcrumb 91.2 px from the header cell's start (limit 24), first group row's chevron 108.4 px from its cell's start (limit 24)
- `pnpm --filter shadcn-table tsc:radix` at 6b05cbaa: green
- `pnpm --filter shadcn-table tsc:baseui` at 6b05cbaa: green
- `pnpm --filter shadcn-table tsc:aria` at 6b05cbaa: green
- `pnpm lint` at 6b05cbaa: green
- `pnpm check:bases` at 6b05cbaa: green
- `pnpm --filter shadcn-table check:tailwind` at 6b05cbaa: green
- `ST_BASE=base pnpm --filter shadcn-table exec vitest run stories/features/ColumnGrouping.stories.tsx` at 6b05cbaa: green (24/24)
- `ST_BASE=radix ... ColumnGrouping.stories.tsx` at 6b05cbaa: green (24/24)
- `ST_BASE=aria ... ColumnGrouping.stories.tsx` at 6b05cbaa: green (24/24)
- `ST_BASE=base ... DetailPanel.stories.tsx` at 6b05cbaa: green (15/15)
- `ST_BASE=base ... Aggregation.stories.tsx` at 6b05cbaa: green (9/9)
- `ST_BASE=radix ... DetailPanel.stories.tsx Aggregation.stories.tsx` at 6b05cbaa: green (24/24)
- `ST_BASE=aria ... DetailPanel.stories.tsx Aggregation.stories.tsx` at 6b05cbaa: green (24/24)
- `pnpm --filter shadcn-table test:base` at 6b05cbaa: green (79 files, 607 tests)
- `pnpm --filter shadcn-table test:radix` at 631fd9d2: green (79 files, 607 tests), verifier
- `pnpm --filter shadcn-table test:aria` at 631fd9d2: green (79 files, 607 tests), verifier
- `pnpm --filter shadcn-table storybook:build:aria` at 631fd9d2: green, verifier
- Recorded gates at 6b05cbaa kept: `git diff --name-only 6b05cbaa..631fd9d2` touches only this tracker, verifier

- Milestone 01 F57 fix with play: done (6b05cbaa)

## Attention

- None.

## Notes

- Fix: `getST_RowExpandColumnDef.tsx` sets `alignProps` to `{ align: 'left' }` when `groupedColumnMode === 'remove' && grouping?.length` (after the `positionExpandColumn === 'last'` right case); the head and body cells already read `tableCellProps.align === 'left'` as `text-start`, so no cell file changed. Narrow control column (no grouping, `'reorder'`, `false`) stays centred.
- D73 sum checked: the docs example `enable-column-grouping` gives its columns no `size`, so State plus Gender is 180 + 180 = 360 px, as `GroupedHeaderWidthSumsColumns` asserts in grid layout. The example uses the default semantic layout, where the browser's auto table layout hands the container's spare width to the columns, so the grouping column renders wider than 360 there; that is the table layout, not the D73 sum.
