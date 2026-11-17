# 56: Story texts D to F, tracker

Status: running
Branch `v0.9/story-texts-d-f`, worktree 05
Checks:

- Completeness over `content/docs/examples/more/features-[d-f]*.mdx` (109 files) at 52cd0934: pass; `grep -L "TryIt"` and `grep -L "## Related guides"` print nothing, every `description` non-empty, 2 to 4 steps directly above `<StoryExample>`, 1 to 4 guide links below it, every `/docs/guides/<slug>` names an existing guide file, no em dash
- `git diff 06d58c57 --name-only` at 52cd0934: 109 files, all matched by the glob (origin/v0.9/docs-layout moved on to 807fed50 after the branch point; the diff against it lists that branch's own changes)
- `pnpm format` at 52cd0934: pass, no change
- `pnpm --filter shadcn-table-docs build` at 52cd0934: pass
- Step truth, `next start` on port 5340, base selected, Playwright script asserting each step (the 48 pages without a play, every step) at 52cd0934: pass, 140 steps, 0 failed; labels read in `components/ui-radix` and `components/ui-aria` (`locales/en.ts` differs only in its import path); server stopped
- Related guides links on the same server at 52cd0934: pass, 22 guide pages, each 200
- `pnpm test typecheck --base radix` at 52cd0934: pass
- `pnpm test lint` at 52cd0934: pass (9 warnings, none in this milestone's files)
- `pnpm test validate-repo` at 52cd0934: pass

- Task 1 site table: done by the writers (b23a00f5), run text-run.js
- Task 2 three parts on every page: done (b23a00f5), run text-run.js
- Task 3 step truth: done (52cd0934), run text-run.js
- Task 4 text check by judges: judges: run by the workflow
- Task 5 cleanup: done (52cd0934, format and build without change), run text-run.js

## Attention

- The workflow run id was not given to the assembler; the task lines name the run script text-run.js instead.
- The play stories' part of Task 3 (`pnpm test storybook-tests` on base, radix and aria) is not in the milestone's Local CI line and was not run here; no story file changed, so the plays are as on `06d58c57`.
