# 64: Guide examples, tracker

Status: done (98c9fae7)
Branch `v0.9/guide-examples`, worktree 08
Checks:
- Task 1 `grep -n -A2 "GuideExamples"` on the thirteen guides at 2d3e384c: the thirteen target pages of the Guide stories tracker, no `basic`, `advanced` or `export-csv`; `git diff origin/v0.9/docs-layout --stat -- .../guides`: the thirteen files only (prettier wraps five long tags over three lines, as click-to-copy already is)
- Task 2 `git diff origin/v0.9/docs-layout --color-moved=zebra` on row-selection.mdx and sorting.mdx at 781509a5: the removed tags and heading, the one moved sentence, no added or changed sentence; display-columns.mdx unchanged below its Example section (see Attention)
- Task 2 `enable-row-pinning-select` equals `sticky-row-selection`: yes, the example page renders the same `<EnableRowPinningSelectExample />`
- Task 3 `pnpm test docs-e2e --base base --url <next start 5341> --section guides` on a production build at e3c2c6fd: pass, 48 pages, 0 failed (after two selector fixes: `Email Address` matched `Address`; the toolbar button is an icon)
- Task 3 served HTML (`fetch`, scratchpad onload.mjs) at e3c2c6fd, production build, base: each of the thirteen guides carries its Example table's `data-example` id once; sorting has no `multi-sorting` left; server stopped
- Task 4 on load, Playwright at 1440 px on base, production build at e3c2c6fd, before any click: all thirteen show their feature (lines below), 0 page errors, server stopped
- `story-text-checklist.mjs` regenerated: 603 pages, the four new story lines added, no other line changed (no ticks in the file before)
- `pnpm format` at f245a89a: no file changed
- `pnpm test typecheck --base radix` at f245a89a: first run exit 2 (output not kept), rerun pass, tsc clean
- `pnpm test lint` at f245a89a: pass (9 warnings, none in milestone files)
- `pnpm test validate-repo` at f245a89a: pass
- `pnpm test docs-e2e --base base --url <next start 5341>` on one production build at f245a89a: pass, 5 sections, 116 pages, 0 failed
- `pnpm test docs-e2e --base radix --url <same server>` at f245a89a: pass, 5 sections, 116 pages, 0 failed
- `pnpm test docs-e2e --base aria --url <same server>` at f245a89a: pass, 5 sections, 116 pages, 0 failed; server stopped
- Verifier, 2.2 Local CI line: typecheck radix, lint, validate-repo, docs-e2e base|radix|aria all recorded green at f245a89a = HEAD; not rerun (verifier)
- Verifier, Acceptance 1.2 rerun at f245a89a: production build of HEAD (built 16:16, after the HEAD commit), `next start` on 5341, `curl` of the thirteen guides: each Example table id occurs once (x1 on all thirteen), sorting has no `multi-sorting`, row-selection no second `enable-row-pinning-select`; server stopped (verifier)
- Verifier, Acceptance 1.2 storybook-tests base|radix|aria: green at 91c955a4 (Guide stories tracker); `git diff --name-only 91c955a4..HEAD` touches only the thirteen guides, `test/docs-e2e/lib/guides.mjs` and `CHANGELOG.md`, no story or library file; not rerun (verifier)
- Verifier, Acceptance 1.2 judged text (D104): first milestone's scope (new story pages), not this one (verifier)

- Task 1 The thirteen slugs: done at 2d3e384c
- Task 2 Shown once: done at 781509a5 (row-selection: heading, tag removed, sentence moved up; sorting: tag removed; display-columns: lower table kept)
- Task 3 Guide checks follow: done at e3c2c6fd (per-guide checks on the thirteen top tables, `EXPLAINERS` gains row-selection, sorting's multi-sorting check moved to the top table)
- Task 4 On load: done at e3c2c6fd
  - column-size: widths ID 59, First Name 355, Last Name 118, Age 59, Address 213 px
  - density-toggle: rows 40 px high, `Toggle density` in the toolbar
  - overflow-tooltip: Name column 90 px, 6 cells cut with an ellipsis
  - filter-chips: chips `Status fuzzy: Done`, `Priority fuzzy: High`, 2 rows
  - global-filtering: search box open with `John`, rows filtered
  - sort-editor: `2 sorts` button, 2 sort arrows
  - row-selection: 1 row selected, `Clear selection` in the toolbar; the explainer line above the table
  - toolbar-customization: `Create New User` icon button in the toolbar
  - row-actions: `View` and `Remove` on every row
  - display-columns: expand, select, `#` and Actions columns
  - sorting: State 1 ascending, City 2 descending, `2 sorts`
  - column-hiding: no Address column; `Address` unticked in the menu (docs-e2e)
  - column-resizing: First Name 400 px, others 180 px
- Task 5 Plan files: done (guide-example-plan.md and guide-checklist.md: the thirteen lines rewritten in place, the changed checklist lines unticked, the Building Production-Ready Tables remark and every other line unchanged; story-text-checklist.md regenerated)
- Task 6 Cleanup: done at f245a89a (changelog `#### Spec 64 Guide examples` under `### Changed`)

## Attention

- Display Columns: the spec says the lower `<CustomizeDisplayColumnsExample />` goes and its sentence "Here is a full example and demo for customizing display columns." moves up, read from guide-example-candidates.md ("Same options"). The code differs: the top story has a detail panel, a 160 px actions column with View and Remove and red row numbers; the lower example has three buttons, a 350 px actions column and a resizable select column. D105 and D122 keep a table that shows a different example, so the lower table and its sentence stay. Revert: remove the tag and move the sentence up.
- Commit trailer: no harness reminder with attribution lines reached this run, so the milestone commits carry no `Claude-Session:` trailer.

## Notes
