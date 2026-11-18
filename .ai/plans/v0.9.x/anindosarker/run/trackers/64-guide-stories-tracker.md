# 64: Guide stories, tracker

Status: running
Branch `v0.9/guide-stories`, worktree 08
Checks:
- Task 1 picks on load: `pnpm --filter shadcn-table-docs build` + `next start` on 5340, Playwright on base at 1440 px (scratchpad capture.mjs) at 121f84fe: build pass, 10 pages 200, no page errors, server stopped

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
- Task 2 The three stories: planned
- Task 3 Pages: planned
- Task 4 Text and its truth: planned
- Task 5 Text check: planned
- Task 6 Cleanup: planned

## Attention

- Global Filtering: the D140 pick `features-search--search-initial-state` filters the rows on load but keeps the search box closed, so it fails 1.6.2 ("the search box open with its term"). It is replaced by a new story `SearchedOnLoad` ("Searched On Load", Search file default table, `initialState` globalFilter `John` and showGlobalFilter true). Revert: keep the existing pick and drop the new story.

## Notes
