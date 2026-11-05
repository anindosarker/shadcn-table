# Moved column slides on top (F47), tracker

Status: merged (dacf201e85bff20e43e12fe2a1bd22d224f31df5)
Branch `v0.8/fix-column-flip-zorder`, worktree 01, PR #120
Gates:
- Repro on shipped code (905ef298): `ST_BASE=base pnpm --filter shadcn-table exec vitest run stories/features/ColumnDragging.stories.tsx`: red as intended, `MovedColumnOnTop` failed with `expected { time: 30, body: false } to deeply equal { time: 30, body: true }` (the City body cell, sliding two slots left, was covered by a later sibling at 30 ms into the slide)
- `pnpm --filter shadcn-table tsc:radix` at 7ac08fb4: green
- `pnpm --filter shadcn-table tsc:baseui` at 7ac08fb4: green
- `pnpm --filter shadcn-table tsc:aria` at 7ac08fb4: green
- `pnpm lint` at 7ac08fb4: green
- `pnpm check:bases` at 7ac08fb4: green
- `pnpm --filter shadcn-table check:tailwind` at 7ac08fb4: green
- `ST_BASE=radix|base|aria vitest run stories/features/ColumnDragging.stories.tsx`, one base after another, at 7ac08fb4: green (7/7 each)
- `ST_BASE=radix|base|aria vitest run stories/features/ColumnOrdering.stories.tsx stories/features/ColumnHiding.stories.tsx`, one base after another, at 7ac08fb4: green (23/23 each)
- `pnpm --filter shadcn-table test:base` at 7ac08fb4: green (79 files, 600 tests)
- `pnpm --filter shadcn-table-docs types:check` at 7ac08fb4: green
- `node scripts/check-pages.mjs e --base radix|base|aria --url http://localhost:5341` after `registry:build` and `lib:install` radix, base, aria, at 7ac08fb4: green (686 passed, 0 failed each; home "moved column slides on top" onTop=14 covered=0); server stopped, installed copies restored
- `pnpm --filter shadcn-table test:radix` at 8d8baa79: green (79 files, 600 tests), verifier
- `pnpm --filter shadcn-table test:aria` at 8d8baa79: green (79 files, 600 tests), verifier
- `pnpm --filter shadcn-table storybook:build:aria` at 8d8baa79: green, verifier
- Gates recorded at 7ac08fb4 reused by the verifier: `git diff --name-only 7ac08fb4..HEAD` touches only this tracker

- Milestone 01 F47 fix with play, demo workaround removed: done (ad59379b, 7ac08fb4)

## Attention

- Pinned cells are raised to inline `z-index: 2` for the 200 ms slide, not only the moved column to 1: the moved column needs a level above unpinned `z-0` and below pinned `z-1`, and integers leave no room, so a tie at 1 would let it cover start-pinned cells (earlier in the DOM). Body rows are stacking contexts, so the raise stays inside each row; in the header it is the same level the dragged header already uses.

## Notes

- The play uses the existing synthetic header drag (`fireEvent`), not `stBrowserUserEvent`; it pauses the slide animations and steps `currentTime` 0 to 100 ms so a loaded machine cannot skip the overlap window. A header drop does not slide the header row (D37), so the header hit test there is trivially green; the body cell carries the repro, and the docs home check covers a sliding header (the replay uses `dragDrop: false`).
- The header drag preview needed no change: the dragged header already takes `z-1` while previewing (`ST_TableHeadCell`).
- Cells are already `position: relative` (`getCommonSRTCellStyles`), so the lift sets only `z-index`.
- No `Claude-Session:` line was given to this run, so the commits carry none.
