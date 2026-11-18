# 64: Guide stories, tracker

Status: running
Branch `v0.9/guide-stories`, worktree 08
Checks:
- Task 1 picks on load: `pnpm --filter shadcn-table-docs build` + `next start` on 5340, Playwright on base at 1440 px (scratchpad capture.mjs) at 121f84fe: build pass, 10 pages 200, no page errors, server stopped

- Focused vitest of the four new stories, `ST_BASE=<base> vitest run` on the four story files at feaef866: base, radix, aria 4 passed each
- `pnpm test storybook-tests --base base` at feaef866: pass, 645 passed
- `pnpm test storybook-tests --base radix` at feaef866: pass, 645 passed
- `pnpm test storybook-tests --base aria` at feaef866: pass, 645 passed
- `pnpm --filter shadcn-table storybook:build:base` at feaef866: pass; the four new ids in storybook-static/base/index.json, 645 stories, none of the 641 ids at 121f84fe missing
- `node lib/story-pages.mjs` at 1cd00df2: 4 new pages, meta.json 4 rows; `git diff origin/v0.9/docs-layout --stat` on content/docs/examples/more: the 4 pages and meta.json only
- Task 4 Try it steps: `pnpm --filter shadcn-table-docs build` + `next start` on 5340, Playwright on base (scratchpad verify.mjs) at 3cde6305: every step as written, every Related guides link 200, no page errors, server stopped
- `pnpm test validate-repo` at 3cde6305: pass (story pages match, 603 story pages)
- `pnpm format` at 2a1c0150: no file changed besides CHANGELOG.md, none reformatted
- `pnpm test typecheck --base base` at 2a1c0150: pass
- `pnpm test typecheck --base radix` at 2a1c0150: pass
- `pnpm test typecheck --base aria` at 2a1c0150: pass
- `pnpm test lint` at 2a1c0150: pass (9 warnings, none in the milestone files; eslint --max-warnings 0 on the four story files pass)
- `pnpm test docs-e2e --base base` at 2a1c0150: pass, 5 sections, 116 pages, 0 failed

- Task 1 The ten picks on load: done at 121f84fe (captures in reference/docs-layout/image/guide-examples/, plan commit on claude/review)
  - column-size `more/styling-custom-column-widths--custom-widths-semantic`: pass. Widths on load ID 78, First Name 466, Last Name 155, Age 78, Address 280 px, clearly uneven.
  - density-toggle `more/features-dense-padding--default-to-dense-padding`: pass. Rows 40 px high (default 48), 25 rows, `Toggle density` in the toolbar.
  - overflow-tooltip `more/styling-default-look--overflow-tooltip`: pass. Name column 90 px, names cut with an ellipsis ("Build au...").
  - filter-chips `more/features-filter-chips--chips-seeded`: pass. Chips `Status fuzzy: Done` and `Priority fuzzy: High`, 2 rows.
  - global-filtering `more/features-search--search-initial-state`: FAIL. Rows filtered to 2 with "John" highlighted, but the search box is closed on load (its description says so). Replaced by new story `SearchedOnLoad`, id `features-search--searched-on-load` (box open with `John`, rows filtered).
  - sort-editor `more/features-sort-popover--sort-popover-seeded`: pass. `2 sorts` button, Status ascending and Name descending sort arrows.
  - row-selection `sticky-row-selection`: pass. One row (Ervin Reinger) selected and tinted, `Clear selection` in the toolbar.
  - toolbar-customization `more/features-toolbar--custom-top-toolbar-actions`: pass. `Create New User` button in the toolbar.
  - row-actions `more/features-row-actions--custom-row-action-buttons`: pass. `View` and `Remove` buttons on every row.
  - display-columns `more/styling-styling-display-columns--customize-display-columns`: pass. Expand, selection, row number (#) and Actions columns on every row.
- Task 2 The three stories and the replacement: done at feaef866 (SortedOnLoad, ColumnHiddenOnLoad, ColumnWidenedOnLoad, SearchedOnLoad, each with its play)
- Task 3 Pages: done at 1cd00df2
- Task 4 Text and its truth: done at 3cde6305. Labels as shown on base (same strings in the radix and aria library copies and docs copies, shared/locales/en.ts):
  - features-sorting--sorted-on-load: `2 sorts` button; editor lists `State` Ascending then `City` Descending; State column menu `Clear sort`; after it the rows sort by City alone (Valentine first).
  - features-column-hiding--column-hidden-on-load: `Show/Hide columns`; `Address` unticked; ticked, the Address column shows between Last Name and State.
  - features-column-resizing--column-widened-on-load: First Name 400 px, others 180 px; dragging the header's right edge left narrows it (250 px after 150 px); column menu `Reset column size` sets 180 px, the others' width.
  - features-search--searched-on-load: `Search` box open with `John`, 1-5 of 51; Escape clears it, 1-10 of 200; Escape again closes the box.
- Task 5 Text check: run by the workflow after verify
New story pages:
- /Users/anindosarker/Work/Personal/React-table/shadcn-react-table.worktrees/08/apps/shadcn-table-docs/content/docs/examples/more/features-sorting--sorted-on-load.mdx
- /Users/anindosarker/Work/Personal/React-table/shadcn-react-table.worktrees/08/apps/shadcn-table-docs/content/docs/examples/more/features-column-hiding--column-hidden-on-load.mdx
- /Users/anindosarker/Work/Personal/React-table/shadcn-react-table.worktrees/08/apps/shadcn-table-docs/content/docs/examples/more/features-column-resizing--column-widened-on-load.mdx
- /Users/anindosarker/Work/Personal/React-table/shadcn-react-table.worktrees/08/apps/shadcn-table-docs/content/docs/examples/more/features-search--searched-on-load.mdx
- Task 6 Cleanup: done at 2a1c0150 (changelog `#### Spec 64 Guide stories` under `### Changed`)

Pages for the second milestone (Guide examples), one per guide:
- column-size: `more/styling-custom-column-widths--custom-widths-semantic`
- density-toggle: `more/features-dense-padding--default-to-dense-padding`
- overflow-tooltip: `more/styling-default-look--overflow-tooltip`
- filter-chips: `more/features-filter-chips--chips-seeded`
- global-filtering: `more/features-search--searched-on-load` (replaces the failed pick search-initial-state)
- sort-editor: `more/features-sort-popover--sort-popover-seeded`
- row-selection: `sticky-row-selection`
- toolbar-customization: `more/features-toolbar--custom-top-toolbar-actions`
- row-actions: `more/features-row-actions--custom-row-action-buttons`
- display-columns: `more/styling-styling-display-columns--customize-display-columns`
- sorting: `more/features-sorting--sorted-on-load`
- column-hiding: `more/features-column-hiding--column-hidden-on-load`
- column-resizing: `more/features-column-resizing--column-widened-on-load`

## Attention

- Global Filtering: the D140 pick `features-search--search-initial-state` filters the rows on load but keeps the search box closed, so it fails 1.6.2 ("the search box open with its term"). It is replaced by a new story `SearchedOnLoad` ("Searched On Load", Search file default table, `initialState` globalFilter `John` and showGlobalFilter true). Revert: keep the existing pick and drop the new story.

## Notes
