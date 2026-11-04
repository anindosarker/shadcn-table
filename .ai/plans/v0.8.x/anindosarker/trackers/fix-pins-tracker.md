# Pinned view items in custom toolbars (F36), tracker

Status: merged (1a0f67a73ea1fe69346b5e6a3b8e54810307e734)
Branch `v0.8/fix-pins`, worktree 03, PR #111
Gates:
- Repro on shipped code (040c7460), `ST_BASE=base vitest run stories/fixed-bugs/PinnedItemsCustomToolbar.stories.tsx`: red as expected, `PinInCustomToolbar` fails at `findByRole('button', { name: 'Toggle density' })` (no pinned item beside the custom-placed settings button); `PinsInStockToolbarOrder` green (guards the stock order).
- `pnpm --filter shadcn-table tsc:radix` at f131ccbf: green
- `pnpm --filter shadcn-table tsc:baseui` at f131ccbf: green
- `pnpm --filter shadcn-table tsc:aria` at f131ccbf: green
- `pnpm lint` at f131ccbf: green (docs app: 9 existing warnings, 0 errors)
- `pnpm check:bases` at f131ccbf: green
- `pnpm --filter shadcn-table check:tailwind` at f131ccbf: green
- `ST_BASE=radix vitest run` PinnedItemsCustomToolbar, ViewSettings, Toolbar stories at f131ccbf: green (3 files, 29 tests)
- `ST_BASE=base vitest run` same three files at f131ccbf: green (3 files, 29 tests)
- `ST_BASE=aria vitest run` same three files at f131ccbf: green (3 files, 29 tests)
- `pnpm --filter shadcn-table test:base` at f131ccbf: green (79 files, 543 tests)
- `pnpm --filter shadcn-table test:radix` at 5379dd15: green (79 files, 543 tests), verifier
- `pnpm --filter shadcn-table test:aria` at 5379dd15: green (79 files, 543 tests), verifier
- `pnpm --filter shadcn-table storybook:build:aria` at 5379dd15: green, verifier
- tsc per base, lint, check:bases, check:tailwind, test:base: not rerun, recorded at f131ccbf and `git diff --name-only f131ccbf..HEAD` touches only the tracker and `CHANGELOG.md`, verifier

- Milestone 01 F36 fix: done (f131ccbf)

## Attention

- `ST_InternalButtonsContext` is a new public export: it lives in `ST_ViewSettingsItems.tsx`, which `index.ts` re-exports with `export *`. A separate internal module would need new `registry.ts` and `registry.json` file entries outside this story's files. Revert option: move it to an internal file in a later change.

## Notes

- The stock toolbar wraps only its default branch in the context provider, so a custom `renderToolbarInternalActions` that renders `ST_ViewSettingsButton` also gets the pinned items.
