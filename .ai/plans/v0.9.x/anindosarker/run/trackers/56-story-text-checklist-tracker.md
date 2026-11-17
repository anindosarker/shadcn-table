# 56: Story text checklist, tracker

Status: running
Branch `v0.9/story-text-checklist`, worktree 05
Checks:

- Task 1 at 7e13af53: `ls apps/shadcn-table-docs/content/docs/examples/more/*.mdx | wc -l` 594 = 127 + 109 + 109 + 115 + 71 + 63 (the six globs); `grep -L "TryIt"` and `grep -L "## Related guides"` on more/*.mdx print nothing; every page has a non-empty `description`: pass
- `pnpm test validate-repo` at 08ab12e5: pass (594 story pages)
- `pnpm test validate-repo` with the Try it block of more/basic--default.mdx removed: fail, "page more/basic--default.mdx: no "### Try it" heading with a <TryIt> block; ..."; reverted
- `pageParts` probe (empty description, 6 steps, text between </TryIt> and the story, no guide link): each named as a problem
- `node lib/story-text-checklist.mjs <main checkout>/.ai/plans/v0.9.x/anindosarker/reference/docs-layout/story-text-checklist.md` at 08ab12e5: 594 lines, in more/meta.json order (script compare): pass; second run: unchanged

- Task 1 no page left bare: done (no change needed, 7e13af53)
- Task 2 three parts in the parity check: done (08ab12e5)
- Task 3 checklist: done (08ab12e5; checklist committed on claude/review)
- Task 4 cleanup: running

## Notes

## Attention
