# 56: Story texts Styling, tracker

Status: running
Branch `v0.9/story-texts-styling`, worktree 08 (from `origin/v0.9/docs-layout` at 06d58c57, D109)
Checks:
- Check: three parts, structure script over the 71 `styling-*.mdx` pages (non-empty single-quoted description, one `### Try it` with 2 to 4 steps directly above `<StoryExample>`, one `## Related guides` with 1 to 4 links to existing guide files, no em dash) at e6eae48e: pass (161 steps, 28 guide slugs)
- Check: `grep -L "TryIt"` and `grep -L "## Related guides"` over the glob at e6eae48e: pass (print nothing)
- Check: `pnpm format`, then `git status` lists only files the glob matches, at e6eae48e: pass
- Check: build, `pnpm --filter shadcn-table-docs build` at e6eae48e: pass
- Check: step truth, Playwright run of the 40 no-play pages and the 6 play pages whose steps go past the play (pending-view, sticky-heights, custom-light-theme, max-width-and-centered, center-cells, custom-widths-grid-no-grow) on `next start -p 5340`, base selected, at e6eae48e: 46 of 46 pass with the story Tailwind classes the docs CSS lacks stood in by an injected style sheet; without it 38 pass and 8 fail, all from missing CSS (see Attention); server stopped
- Check: labels in `components/ui-radix` and `components/ui-aria`: `shared/locales/en.ts` identical to base apart from the import path; no Styling story branches on the base: pass
- Check: Related guides, all 28 `/docs/guides/<slug>` links of these pages return 200 on the production build at e6eae48e: pass
- Check: `pnpm test typecheck --base radix` at e6eae48e: pass (tsc clean)
- Check: `pnpm test lint` at e6eae48e: pass (0 errors, 9 warnings, all in files outside this milestone, same count as before it)
- Check: `pnpm test validate-repo` at e6eae48e: pass (story pages match, 40 unit tests)

- Task 1 site table: done by the writers, 20bd1a7a, run d3a60a09
- Task 2 three parts on every page: done, 20bd1a7a and e6eae48e (backticks taken out of 11 descriptions, as in A to C), run d3a60a09
- Task 3 step truth: done, b4eefb46 (steps on 7 pages corrected after the browser run), run d3a60a09
- Task 4 text check by judges: judges: run by the workflow
- Task 5 cleanup: done, `pnpm format` clean, build and guide links checked, e6eae48e, run d3a60a09
- Task 4 fix round 2: 8 lines failed by the judges rewritten on 8 pages, changed steps run on a production build (base, port 5340), 3408833c, run d3a60a09

## Attention

- The docs CSS lacks the Tailwind classes the Styling stories set, so 8 pages show a plain table on the docs site while their steps (true in Storybook and to the story code) name the style: style-mui-table-body-row (`bg-sky-500/10`), style-custom-striped-rows and its detail-panel twin (`[&_tr:...]:bg-[limegreen]`), conditionally-style-mui-table-row (`bg-red-500/20`), style-mui-table-body-cell-conditionally-in-1-column (`bg-green-500/50`), style-table-head-cells-individually (`text-red-500`), min-height (`min-h-[800px]`), max-width-and-centered (`max-w-[800px]`). By code reading the same holds for top-caption (`[&>caption]:caption-top`), customize-display-columns (`text-red-500`), style-all-mui-table-body-cell and style-all-mui-table-head-cell (`bg-sky-500/10`) and scroll-cues (`w-[700px]`, `w-[1600px]`). Cause: Tailwind source detection in `apps/shadcn-table-docs` does not scan `packages/shadcn-table/stories` nor the git-ignored `stories/.base` copies. Recommended: an `@source` line for the story files in `apps/shadcn-table-docs/app/global.css`, owned by the story pages milestone or a fix milestone; no text change needed.
- Color Sort Icon: the story's class targets `button[aria-label^=Sort] svg`, which matches no element, so the arrow never turns green (writer note, confirmed by code reading); the page does not claim green. Recommended: a story fix in the review-fixes milestone.
- Grid stories: `layoutMode` already defaults to `grid`, so Default Left Grid, Center Cells Grid and Right Cells Grid look the same as their non-grid stories; the descriptions say so.
- Columns Hold While Dragging: after `Start column drag` the grouping drop zone covers the story's buttons, so a visitor cannot click `Group by age` or `End column drag` (steps 1 and 2; the play passes because it clicks through). The row drag path (steps 3 and 4) works. Recommended: a story fix in the review-fixes milestone (buttons outside the table or above the drop zone).
