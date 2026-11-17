# 56: Story and docs fixes found while writing the story texts, tracker

Status: done
Branch `v0.9/story-fixes`, worktree 03 (from `origin/v0.9/docs-layout` at 3ca2156c, D109)
Checks:

- `pnpm test typecheck --base base`, `--base radix` (package, stories tsconfig, docs types:check), `--base aria`: 55c60402, pass
- `pnpm test lint`: 55c60402, pass (9 warnings)
- `pnpm test validate-repo`: 55c60402, pass
- `pnpm test storybook-tests --base base|radix|aria`: 55c60402, pass (636 each)
- `pnpm test storybook-static --base base`: 55c60402, pass
- `pnpm test docs-e2e --base base`: 55c60402, pass (112 pages)
- Production build, base selected (next start 5340, Playwright): styles show on striped rows, max width and centered, top caption; Try it steps of Search custom fn, Secondary Color, Color Sort Icon, Columns Hold While Dragging, Custom Aggregate, Disable Per Column, both Row Number pages, Disable Full Screen Toggle: 55c60402, pass after the 216bcbed step fix
- `node lib/story-pages.mjs`: 216bcbed, 0 new, 0 updated, 0 removed

- Task 1 Story and docs fixes found while writing the story texts: done, 216bcbed

## Attention
