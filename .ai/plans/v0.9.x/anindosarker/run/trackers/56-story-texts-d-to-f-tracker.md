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
- Check (verifier): rerun at b4b2ae7f, clean tree, because 52cd0934..HEAD touches 7 page files of the glob; each heavy run under the shared build lock, one at a time
- Check (verifier): Task 2 at b4b2ae7f: pass; 109 files, `grep -L "TryIt"` and `grep -L "## Related guides"` print nothing, every `description` non-empty, 2 to 4 steps directly above `<StoryExample>` on every page (288 steps), 1 to 4 guide links below it, all 22 guide slugs existing files, no em dash
- Check (verifier): `git diff origin/v0.9/docs-layout...HEAD --stat` at b4b2ae7f: pass, 109 files, all matched by the glob (merge base 06d58c57; origin/v0.9/docs-layout is now cd1daf88, so the two-dot diff lists that branch's own later changes)
- Check (verifier): `pnpm test typecheck --base radix` at b4b2ae7f: pass, tsc clean
- Check (verifier): `pnpm test lint` at b4b2ae7f: pass, 0 errors, 9 warnings
- Check (verifier): `pnpm test validate-repo` at b4b2ae7f: pass (story pages match: 636 stories, 42 example pages, 594 story pages; 40 unit tests)
- Check (verifier): `pnpm --filter shadcn-table-docs build` at b4b2ae7f: pass, 2125 static pages
- Check (verifier): Acceptance 1.2 at b4b2ae7f: pass. `pnpm test storybook-tests` base, radix, aria: 636 passed each; the first run of each (cold vitest cache, "Failed to fetch dynamically imported module" after a dependency re-optimize reload, 47/97/113 failed) was rerun once and passed, no file changed between. `pnpm test storybook-static --base base`: pass (594 story pages match index.json, reset pass, server on 5341 stopped). `pnpm test docs-e2e` base, radix, aria: pass, each 112 pages (api 111, guides 705, examples 1096, 0 failed). Parity check 1.6.5 green (validate-repo, storybook-static). `lib/storybook-map.ts` 42 keys = the 42 example pages, 42 different ids, each a story in `storybook-static/base/index.json` (audit list 1 is empty, so the map is the exact-pair list checked). Judged text part: passed in this workflow (Task 4). No server left on 5340 to 5360

- Task 1 site table: done by the writers (b23a00f5), run text-run.js
- Task 2 three parts on every page: done (b23a00f5), run text-run.js
- Task 3 step truth: done (52cd0934), run text-run.js
- Task 4 text check by judges: judges: run by the workflow
- Task 4 fix round 1: 7 failed lines rewritten (2f224958); `disable-full-screen-toggle` step 2 run on `next start` port 5341, base, build of 52cd0934 (story code unchanged): Salary filter opens, table not fixed, server stopped; `pnpm format` pass
- Task 4 fix round 2: 2 failed lines rewritten (b4b2ae7f), the `iso-date-time-string-column-by-day` description and `disable-full-screen-toggle` step 2 (now `View settings`); step 2 run on `next start` port 5340, base, build of the rewrite: no `Toggle full screen` button, `View settings` menu lists `Columns`, `Density` and the rest with no full screen row, server stopped; `pnpm format` pass
- Task 5 cleanup: done (52cd0934, format and build without change), run text-run.js

## Attention

- The workflow run id was not given to the assembler; the task lines name the run script text-run.js instead.
- The play stories' part of Task 3 (`pnpm test storybook-tests` on base, radix and aria) is not in the milestone's Local CI line and was not run here; no story file changed, so the plays are as on `06d58c57`. Verifier: storybook-tests on the three bases ran at b4b2ae7f under the Acceptance line and passed.
