# 56: Story pages in the docs, tracker

Status: built (829eeca4), for the fable review and the verifier
Branch `v0.9/story-pages`, worktree 03
Checks:
- Check: Task 1 `node lib/story-variants.mjs` at 35688a78: pass, one copy per story file and base (85 files x 3), with index.json and sources.json per base
- Check: Task 1 `pnpm --filter shadcn-table-docs types:check` at 0ae6997a: pass
- Check: Task 1 `git diff origin/v0.9/docs-layout -- apps/shadcn-table-docs/package.json` at 829eeca4: pass, only the `build`, `predev` and `types:check` lines
- Check: Task 1, 2, 3 `NEXT_PUBLIC_SITE_URL=http://localhost:5345 pnpm --filter shadcn-table-docs build` (NODE_OPTIONS unset, `.next` and `stories/.base`, `.radix`, `.aria` removed first) at 35688a78: pass
- Check: Task 2 story page on a production build (`next start -p 5345`), `features-aggregation--aggregation` with the base stored as Base UI, Radix UI, React Aria at 35688a78: pass, table renders (10 rows) on each base, toolbar names the base, Storybook button opens that base's story, Code tab shows `Aggregation.stories.tsx`, no Copy prompt, no page errors
- Check: Task 2 all 594 story pages on the same build, per base (base, radix, aria) at 35688a78: pass, every page mounts its story with no page error; 7 render no `<table>` by design (icon grid, headless and provider stories, one that renders its own error text)
- Check: Task 2 bundle, `grep -rlE "@testing-library|dom-testing-library|@vitest/expect|before changing to fake timers" apps/shadcn-table-docs/.next/static` at 35688a78: pass, nothing (before the alias of next.config.mjs the composeStories chunk carried @testing-library/dom); the only `storybook/test` text left is a Storybook error message string
- Check: Task 3 page count at 731aab39: 594 = 636 stories - 42 exact stories (audit header 593 + the later story `features-localization--spanish`); every page file matches exactly one of the six text globs (127 + 109 + 109 + 115 + 71 + 63)
- Check: Task 3 `node lib/story-pages.mjs` twice at 35688a78: pass, the second run changes nothing; a page with a description and a body line kept both (tried, reverted)
- Check: Task 3 `/docs/examples/more/basic--default` and `/docs/examples/more/styling-theming--custom-dark-theme` at 35688a78: 200, 200
- Check: Task 4 sidebar on the production build at 35688a78: pass, "More examples (594)", 82 sub-group labels with counts summing to 594, first story row 43, last row 636; closed on `/docs/examples/basic`, open on a page inside it; opened by hand stays open after a reload, closed by hand stays closed; a sub-group label is no button and a click hides nothing; `/docs/guides/sorting` and `/docs/api/table-options` have no closed section and no "More examples"
- Check: Task 4 judge captures (main checkout, `reference/docs-layout/captures/`): `new-more-closed.png`, `new-more-open.png`, `new-more-scrolled.png` (references `ref-exb-sidebar-collapsed.png`, `ref-exb-sidebar-more-open.png`, `ref-exb-sidebar-more-open-mid.png`); story pages `new-story-page-basic--default.png`, `new-story-page-features-aggregation--aggregation-expanded-default.png`, `new-story-page-features-column-pinning--column-pinning-initial.png` next to `new-storybook-basic--default.png`, `new-storybook-features-aggregation--aggregation-expanded-default.png`, `new-storybook-features-column-pinning--column-pinning-initial.png` (local Storybook build of base); the faker stories draw new rows on each load, so the data differs and the table setup is the same
- Check: Task 5 `pnpm test validate-repo` at 829eeca4: pass (story pages match, 40 unit tests)
- Check: Task 5 deliberate breaks at b949cf15: one page file deleted fails with `story "basic--default" ... has no example page and no page more/basic--default.mdx: run node lib/story-pages.mjs`; one story export added fails with the same message plus the meta order; both reverted
- Check: Task 5, 6 `pnpm test storybook-static --base base` at b8e770f8: pass (42 example stories in index.json, 594 story pages match index.json, reset pass)
- Check: Task 6 local Storybook build of base (served on 5346) at b8e770f8: `basic--basic` links `/docs/examples/basic`, `features-editing--editing-crud-inline-cell` links `/docs/examples/editing-crud-inline-cell`, `basic--default` and `styling-theming--custom-dark-theme` link their `more/` pages; all four 200 on the production build of the branch with the host swapped to localhost:5345
- Check: Task 7 build cost, `/usr/bin/time -l pnpm --filter shadcn-table-docs build` (NODE_OPTIONS unset, spec 47.1 settings, `.next` removed): before at b194eef9 57 s, `.next` 644 MB, peak RSS 3.61 GB; after at 35688a78 44 s, `.next` 1.9 GB (server/app/docs/examples/more 1.0 GB: each story page carries the 636-row Examples sidebar, open), peak RSS 4.13 GB, 2125 static pages
- Check: Task 8 `pnpm format` at 829eeca4: pass, no diff
- Check: `pnpm test lint` at 829eeca4: pass (0 errors, 9 warnings)
- Check: `pnpm test typecheck --base radix` at 829eeca4: pass
- Check: `pnpm test docs-e2e --base base` at 829eeca4: pass (getting-started 262, api 111, guides 705, examples 1096, 112 pages, 0 failed)
- Check: every server stopped (5345 next start, 5346 serve; the test runner stopped its own)

- Task 1 per-base story copies: done, 0ae6997a
- Task 2 StoryExample in the playground: done, 35688a78
- Task 3 story pages sync: done, 731aab39
- Task 4 sidebar: done, 7611da9a
- Task 5 parity checks: done, b949cf15
- Task 6 link back from Storybook: done, b8e770f8
- Task 7 build cost: done, 35688a78 (measured, no code)
- Task 8 cleanup: done, 829eeca4

## Attention

- Files outside the milestone's list, each needed by a spec line: `apps/shadcn-table-docs/next.config.mjs` (a `turbopack.resolveAlias` of `storybook/test` to the new `lib/storybook-test-stub.ts`: Storybook's composeStories imports `storybook/test` and with it @testing-library/dom, which 1.6.4 keeps out of the bundle), `apps/shadcn-table-docs/components/story-variant.tsx` (the client half of `StoryExample`, as `example-variant.tsx` is for examples) and `CHANGELOG.md` (P9).
- The story copies under `stories/.<base>/` start with `// @ts-nocheck`: four story files do not pass `tsc` in their own package either (`FilterChips.stories.tsx:757`, `HeaderGroups.stories.tsx:295`, `ViewSettings.stories.tsx:398`, `miscellaneous/PinnedItemsCustomToolbar.stories.tsx:44`), and no gate type-checks `packages/shadcn-table/stories`. Revert the nocheck once those four are fixed.
- Story pages have no Copy prompt and no "Copy install command": a story has no registry item. The Code tab shows the story file as written, the same on every base.
- The Storybook intro line now reads "This story on the docs site: shadcn-table.com/docs/examples/..." in place of "Looking for the main docs site? Click here."; the wording is the builder's pick and can change freely.
- "More examples" stores its open state under `docs-sidebar-open:<folder id>` and also stores an automatic open (visiting a page inside it), so a reload shows the state the visitor last saw.
