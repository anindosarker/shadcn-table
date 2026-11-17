# 55: Guide pages, tracker

Status: done (807fed50)
Branch `v0.9/guide-pages`, worktree 11
Checks:
- Check: task 1 types, `pnpm --filter shadcn-table-docs types:check` + eslint on owned components at 23a4a171: pass
- Check: task 3, `ls apps/shadcn-table-docs/content/docs/guides | grep -c new-format` and `git grep -n VirtualizationGuideExamples` at dd16769c: pass (0, nothing)
- Check: docs build, `pnpm --filter shadcn-table-docs build` at 7a3354b4 plus two uncommitted scratch guide pages (deleted after): pass
- Check: task 1 scratch pages, `next start -p 5340` + Playwright at 7a3354b4: pass (`more/features-icons--provider-icon-set` alone shows the story table, name "Provider Icon Set" links `/docs/examples/more/features-icons--provider-icon-set`; `basic` + `more/features-localization--spanish` shows the picker, Next swaps to the story, Open example page follows to `/docs/examples/more/features-localization--spanish`; `/docs/guides/column-pinning` keeps the name link)
- Check: tasks 2 and 4 pages, same server + Playwright at 7a3354b4: pass (46 guides 200, each Example section shows a table with rows and its link returns 200; every page of guide-example-plan.md 200)
- Check: task 5 On this page, same server at 7a3354b4: pass (`/docs/guides/virtualization` and `/docs/guides/column-filtering` nest h3 under h2; `/docs/guides/column-pinning` has no sub-section left after its removed h4, all h2 flat)
- Check: virtualization ids, same server at 7a3354b4: pass (no repeated id on load and after four picker swaps)
- Check: tasks 5 and 6, heading and diff script against `origin/claude/review` at 8dd964ed: pass (every heading outside fences one level up, tanstack-table-with-shadcn-ui unchanged, Example heading `##` on all 46; with heading markers and the Example section stripped the diff holds only the 7 removed tables and their headings)
- Check: Acceptance grep, `grep -L "GuideExamples" apps/shadcn-table-docs/content/docs/guides/*.mdx` at 8dd964ed: pass (index.mdx only)
- Check: task 7, checklist script at 8dd964ed: pass (46 lines in meta.json order; 7 removed entries match the 7 removed tags of the diff)
- Check: docs-e2e, `pnpm test docs-e2e --base base --url http://localhost:5340` (build of 7a3354b4, test files of 8dd964ed) at 8dd964ed: pass (getting-started 262, api 111, guides 930, examples 1096, 0 failed)
- Check: typecheck, `pnpm test typecheck --base radix` at 8dd964ed: pass
- Check: lint, `pnpm test lint` at 8dd964ed: pass (9 warnings, none in owned files)
- Check: validate-repo, `pnpm test validate-repo` at 8dd964ed: pass
- Check: format, `pnpm format` at 8dd964ed: pass (no changes)
- Verifier: every 2.2 check above is recorded at 8dd964ed = HEAD (clean tree), so typecheck, lint, validate-repo and docs-e2e were not rerun; the docs-e2e build (7a3354b4) differs from HEAD only in `test/docs-e2e/lib/guides.mjs`, so it stands for HEAD
- Check: Acceptance rerun by the verifier at 8dd964ed: pass (`grep -L "GuideExamples" .../guides/*.mdx` prints only index.mdx; heading script against `origin/claude/review` and `origin/v0.9/docs-layout`: 46 guides, `## Example` on all 46, every other heading outside fences one level up, tanstack-table-with-shadcn-ui headings unchanged, 0 failures; diff script with heading markers and the Example section stripped: only 7 removed example tags and their headings, 0 other lines; docs-e2e `--base base` taken from the recorded run at the same content; judges are task 8, run by the workflow)

- Task 1 GuideExamples resolves story pages: done, 23a4a171
- Task 2 site table: done (46 rows, working file, the source of the checklist), 3c8515b5
- Task 3 comparison pages removed: done, dd16769c
- Task 4 Example section on the 46 guides: done, 7a3354b4
- Task 5 headings one level up: done, 42eaf77f
- Task 6 nothing else changed: done, 8dd964ed
- Task 7 checklist: done, claude/review 892db5e5
- Task 8 removals judged: judges: run by the workflow
- Task 9 cleanup: done, 8dd964ed

## Attention

- Each Example section sits directly before the guide's first own heading, so nothing else is in the section; on guides whose intro has several blocks (virtualization's NOTE, data-columns, editing and others) they now stand above the Example section, unlike the accepted virtualization preview where the section followed the first paragraph.
- production-ready-tables: the Example section (React Query) comes after the guide's own server-side-data table and right before "Folder Layout", whose sentence "Open the Code view above" now has the React Query panel nearest above it.
