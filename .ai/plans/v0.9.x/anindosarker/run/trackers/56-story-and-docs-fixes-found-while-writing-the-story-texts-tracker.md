# 56: Story and docs fixes found while writing the story texts, tracker

Status: done (7e13af53)
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
- Verifier, 216bcbed (diff since 55c60402 is one story page mdx; typecheck, lint, storybook-tests and storybook-static not rerun, CI is the second run):
  - `pnpm test validate-repo`: 216bcbed, pass (636 stories, 42 example pages, 594 story pages match), verifier
  - `pnpm --filter shadcn-table-docs build`, one `next start` on 5340, stopped after: 216bcbed, pass, verifier
  - `pnpm test docs-e2e --base base --url http://localhost:5340`: 216bcbed, pass (112 pages, examples 1101 passed), verifier
  - `pnpm test docs-e2e --base radix --url http://localhost:5340`: 216bcbed, pass (112 pages, examples 1101 passed), verifier
  - `pnpm test docs-e2e --base aria --url http://localhost:5340`: 216bcbed, pass (112 pages, examples 1101 passed), verifier
  - Acceptance 1.2, programmatic part: storybook-tests three bases (55c60402, stories unchanged since), validate-repo parity check and docs-e2e three bases above green; the 42 example pages each map to one distinct story id in `lib/storybook-map.ts`, all 42 present in `storybook-static/base/index.json`: 216bcbed, pass, verifier. The judged parts belong to the text milestones and the checklist.
  - Every server stopped; worktree clean

- Task 1 Story and docs fixes found while writing the story texts: done, 216bcbed

## Attention
