# 63: Docs branch catch-up, tracker

Status: running
Branch `v0.9/docs-branch-catch-up`, worktree 08
Checks:
- `git merge-base --is-ancestor origin/claude/review HEAD` at 62429d40: pass
- `git grep -n '^<<<<<<<\|^>>>>>>>' -- . ':!*.md'` at 62429d40: prints nothing
- Story ids after the merge (Storybook's CSF parser through `readStories` of `lib/story-pages.mjs`, 62429d40 against b86ae185): 638 before, 641 after; the diff adds only `features-column-dragging--touch-hold-on-range-slider`, `features-row-ordering--touch-drag-scrolls-page`, `features-row-pinning--row-pinning-select-sticky-with-virtualization` (the three new claude/review stories); none lost, no D110 export re-added
- Every line claude/review added to the story files and the two guides since the merge base 59be73e9 is present in the merge result (line check per file): pass (two comment lines reworded in ColumnGrouping)
- No story file assigns a `.play` twice at 62429d40: pass
- `pnpm install` at 10017aac: lockfile regenerated, no `10.6.2` left in it
- `pnpm ls storybook -r` at 10017aac: storybook 10.6.7 in shadcn-table and shadcn-table-docs
- `pnpm ls recharts -r` at 10017aac: recharts 2.15.4 in shadcn-table and shadcn-table-docs (as on b86ae185)
- `pnpm test typecheck --base base` at 10017aac: pass, tsc clean
- `pnpm test lint` at 10017aac: pass, 9 warnings (apps/shadcn-table-docs examples, untouched)
- `node lib/story-pages.mjs` at 10017aac: 599 story pages, 3 new
- `node lib/story-text-checklist.mjs` (main checkout file) at a62678ab: 599 pages
- `pnpm test validate-repo` at a62678ab (before commit, same tree): pass, story pages match (641 stories, 42 example pages, 599 story pages), 40 unit tests
- `pnpm --filter shadcn-table-docs build` at a62678ab: pass
- `pnpm test docs-e2e --base base --url <next start on 5340>` at a62678ab (that build): pass, 5 sections, 116 pages, 2564 checks (getting-started 268, api 111, guides 1020, examples 1107, site 58)
- `pnpm test docs-e2e --base radix --url ...` at a62678ab: pass, 116 pages, 2564 checks
- `pnpm test docs-e2e --base aria --url ...` at a62678ab: pass, 116 pages, 2564 checks
- Docs story page captures (`reference/d123-storybook-upgrade/tools/capture-docs.cjs`, same build) against `captures/before/docs-*.png`: 18 compared, all 18 differ only in the sidebar (every differing pixel at x <= 240): the More examples count and row numbers shift by the three new pages; table, Try it and toolbar equal

- Task 1 The merge: done (62429d40)
- Task 2 Pins and install: done (10017aac)
- Task 3 Story pages: running (a62678ab)

## Attention
