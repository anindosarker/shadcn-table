# Custom toolbar actions follow row selection (F43), tracker

Status: merged (483e2c22)
Branch `v0.8/fix-custom-actions`, worktree 01, PR #116
Files owned: `components/toolbar/ST_TopToolbar.tsx`, `components/toolbar/ST_BottomToolbar.tsx` in the three bases; `stories/features/Toolbar.stories.tsx`
Depends on: Last fixes (F19, F28, F30, F39, F40, F41, D56, D57)
Checks:

- Repro on shipped code (345b64a3): `ST_BASE=base pnpm --filter shadcn-table exec vitest run stories/features/Toolbar.stories.tsx` with the new play: red as expected, `CustomActionsFollowSelection` failed at `expect(element).toBeEnabled()` on the top Deactivate button after a row was selected (1 failed, 19 passed)
- `pnpm --filter shadcn-table tsc:radix` at db365b35: green
- `pnpm --filter shadcn-table tsc:baseui` at db365b35: green
- `pnpm --filter shadcn-table tsc:aria` at db365b35: green
- `pnpm lint` at db365b35: green
- `pnpm check:bases` at db365b35: green
- `pnpm --filter shadcn-table check:tailwind` at db365b35: green
- `ST_BASE=radix pnpm --filter shadcn-table exec vitest run stories/features/Toolbar.stories.tsx` at db365b35: green (20 passed)
- `ST_BASE=base pnpm --filter shadcn-table exec vitest run stories/features/Toolbar.stories.tsx` at db365b35: green (20 passed)
- `ST_BASE=aria pnpm --filter shadcn-table exec vitest run stories/features/Toolbar.stories.tsx` at db365b35: green (20 passed)
- `ST_BASE=base pnpm --filter shadcn-table exec vitest run stories/features/Selection.stories.tsx` at db365b35: green (22 passed)
- `pnpm --filter shadcn-table test:base` at db365b35: green (79 files, 598 tests)
- `pnpm --filter shadcn-table test:radix` at 048c21cd: green (79 files, 598 tests), verifier
- `pnpm --filter shadcn-table test:aria` at 048c21cd: green (79 files, 598 tests), verifier
- `pnpm --filter shadcn-table storybook:build:aria` at 048c21cd: green, verifier
- Verifier: tsc per base, lint, check:bases, check:tailwind, test:base and the repro recorded at db365b35 stay valid (db365b35..048c21cd touches only the tracker)

- Milestone 01 custom actions subscribe to table state: done (db365b35)

## Attention

- The custom actions subscribe to `rowSelection`, `columnFilters`, `globalFilter` and `sorting` (not `rowSelection` alone), so an action reading the filtered selection also follows; only the actions re-render on a search keystroke, the toolbar does not. Narrow to `rowSelection` if the extra re-renders matter.
- The selection stories in `Toolbar.stories.tsx` passed `disabled` to `Button`, which the React Aria button ignores, so their actions were never disabled in aria and the new play failed there. They now spread `disabledProps(...)` (`isDisabled` in aria, `disabled` elsewhere, keyed on `ST_BASE`), as the docs aria examples use `isDisabled`.
- `CustomActionsRender` renders static actions that read no selection, so it gained a check that both actions stay rendered and clickable after a row is selected; the enabled-state assertions live in `CustomActionsFollowSelection`.

## Notes

- `tsc -p tsconfig.stories.json` reports two errors in `ViewSettings.stories.tsx` and `PinnedItemsCustomToolbar.stories.tsx` already on 345b64a3; not part of the checks and not this story's files.
