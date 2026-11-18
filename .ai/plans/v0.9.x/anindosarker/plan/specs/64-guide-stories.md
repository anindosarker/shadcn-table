# 64: Guides open with their feature at work

Follow the project planning rules: docs/code-of-conduct/planning-guidelines.md, CLAUDE.md:9. Keep the expedition contract.

## 1. Architecture

### 1.1 Overview

E14 gave every guide an Example section. For 15 guides the builder picked Basic because "the feature is on by default", and for four more it borrowed the Advanced or CSV Export table. A reader then sees a plain table and has to find the feature himself. D140 sharpens D105: the Example section shows a table in which the guide's feature is already visibly in use when the page opens. Ten guides take a table that exists, three get a new story (D140).

Two milestones, one after the other. "Guide stories" first confirms the ten picks in a browser, because the list in `reference/docs-layout/guide-example-candidates.md` was read from code and nothing was rendered, then builds the three new stories and any replacement a failed pick needs, with their pages and text. "Guide examples" then points the thirteen guides at their tables. The cut is by file set (story files and story pages; guide files and the guide checks); one spec, because the second milestone only wires what the first one proves.

Branch: both milestones are created from `origin/v0.9/docs-layout` and merge into `v0.9/docs-layout` (process.md P1, D109). Nothing merges into `claude/review` except the plan files of 1.6.1.

### 1.2 Goals

- Ten guides show, in their Example section, the existing table D140 names; each shows its feature in use on load on base, radix and aria (D140).
- Sorting, Column Hiding and Column Resizing show a new story: sorted by state ascending then city descending on load; one column hidden that the reader can bring back from the menu; one column already widened (D140).
- Each new story is a page under "More examples" with a description, 2 to 4 Try it steps and Related guides, every step true on the three bases (D106, D104).
- A pick that does not show its feature on load is replaced by a new story for that guide, never by Basic (D140).
- A table that is now on top and also stood further down the guide shows once; the lower copy goes and its explainer line moves up word for word (D122).
- The six guides that keep Basic and the six that keep their table are untouched; no guide sentence is reworded (D140, D105).
- Acceptance: programmatic, plus judged for the new story page text. `pnpm test storybook-tests --base base|radix|aria`, `pnpm test validate-repo` and `pnpm test docs-e2e --base base|radix|aria` green; on a production build each of the thirteen guide pages shows the table 1.6.4 names, once. Judged: three judges read each new description and Try it step against the four criteria of D104, majority per line. The reference for the format of a guide's Example section with an explainer line is `/docs/guides/scroll-cues` on `origin/v0.9/docs-layout` at 121f84fe; for a story page, `content/docs/examples/more/features-server-data--production-ready-table.mdx` there.

### 1.3 Current structure

```
apps/shadcn-table-docs/
├── content/docs/guides/<guide>.mdx:8-10     ← `## Example`, `<GuideExamples slugs={['<slug>']} />`
├── content/docs/examples/more/<story id>.mdx ← story pages, written by lib/story-pages.mjs; text by hand
├── content/docs/examples/more/meta.json      ← order, follows the story files
├── components/mdx/guide-examples.tsx         ← takes an example page slug or `more/<story id>`; not edited
├── components/story-example.tsx              ← plays never run on docs pages; not edited
├── lib/story-pages.mjs, lib/story-variants.mjs, lib/story-text-checklist.mjs
└── examples/base/multi-sorting/              ← the Sorting guide's own table
packages/shadcn-table/stories/features/
├── Sorting.stories.tsx        ← title 'Features/Sorting', 8 stories
├── ColumnHiding.stories.tsx   ← title 'Features/Column Hiding', 11 stories
└── ColumnResizing.stories.tsx ← title 'Features/Column Resizing', 23 stories
test/docs-e2e/lib/guides.mjs:1243-1263        ← EXPLAINERS, INTRO_BLOCKS; per-guide checks
test/validate-repo/lib/story-pages.mjs        ← every story has a page with the three parts
```

Today's slug and what stands further down, per guide (lines on `origin/v0.9/docs-layout` at 121f84fe):

| Guide | Slug today | Further down |
|---|---|---|
| column-size | `basic` | no table |
| density-toggle | `basic` | `<DisableDensityToggleExample />` :52, a different table |
| overflow-tooltip | `basic` | `<BasicExample />` :91 under `## Overflow Tooltip Example` |
| filter-chips | `basic` | no table |
| global-filtering | `basic` | `<RemoteExample />` :196, `<CustomizeGlobalFilterComponentExample />` :230 |
| sort-editor | `basic` | `<MultiSortingExample />` :73 under `## Sort Editor Example` |
| row-selection | `export-csv` | `<EnableRowPinningSelectExample />` :245 under `## Sticky Pinned Row Selection` :241, sentence :243 |
| toolbar-customization | `advanced` | `<CustomTopToolbarExample />` :173, no page |
| row-actions | `advanced` | `<RowActionsMenuItemsExample />` :56, `<RowActionsButtonsExample />` :82, no pages |
| display-columns | `advanced` | `<CustomizeDisplayColumnsExample />` :119, sentence :117 |
| sorting | `basic` | `<MultiSortingExample />` :133, `<RemoteExample />` :207 |
| column-hiding | `basic` | `<DisableColumnHidingExample />` :82 |
| column-resizing | `basic` | `<EnableColumnResizingExample />` :82 |

- The ten story and example pages D140 names all exist on the branch.
- `guides.mjs` checks the lower tables by example id: `customize-display-columns` :807, `multi-sorting` :905 (sort-editor) and :1147 (sorting), `enable-row-pinning-select` :1111 and :1131.
- Sidebar numbers, counts, search, sitemap and prev/next are built from the content source and follow by themselves.

### 1.4 Target structure

```
packages/shadcn-table/stories/features/
├── Sorting.stories.tsx        ← + SortedOnLoad
├── ColumnHiding.stories.tsx   ← + ColumnHiddenOnLoad
└── ColumnResizing.stories.tsx ← + ColumnWidenedOnLoad
apps/shadcn-table-docs/content/docs/examples/more/
├── features-sorting--sorted-on-load.mdx
├── features-column-hiding--column-hidden-on-load.mdx
├── features-column-resizing--column-widened-on-load.mdx
└── meta.json                  ← the three rows, in story file order
```

### 1.5 Flow: none

### 1.6 Components

#### 1.6.1 Data artifacts

- `CHANGELOG.md` (P9): `#### Spec 64 Guide stories` and `#### Spec 64 Guide examples` under `## Unreleased`, `### Changed`.
- Plan files, committed on `claude/review` where plan files live (P1), by the second milestone's last task: `reference/docs-layout/guide-example-plan.md` and `guide-checklist.md` get the thirteen new lines (the owner's remarks and ticks in `guide-checklist.md` stay; a changed line is unticked), and `reference/docs-layout/story-text-checklist.md` is regenerated with `node lib/story-text-checklist.mjs`.
- No registry file changes; `pnpm test validate-repo` proves it.

#### 1.6.2 The ten picks, confirmed on load

Each page is opened on a production build of the branch point, on base, and judged by one question: does a reader see the guide's feature in use before touching anything?

| Guide | Page | Must be visible on load |
|---|---|---|
| column-size | `more/styling-custom-column-widths--custom-widths-semantic` | columns of clearly different widths |
| density-toggle | `more/features-dense-padding--default-to-dense-padding` | compact rows, the density toggle in the toolbar |
| overflow-tooltip | `more/styling-default-look--overflow-tooltip` | cell text cut off with an ellipsis |
| filter-chips | `more/features-filter-chips--chips-seeded` | filter chips set, rows filtered |
| global-filtering | `more/features-search--search-initial-state` | the search box open with its term, rows filtered |
| sort-editor | `more/features-sort-popover--sort-popover-seeded` | two sorts applied, the sort button showing them |
| row-selection | `sticky-row-selection` (example page) | at least one row selected |
| toolbar-customization | `more/features-toolbar--custom-top-toolbar-actions` | a custom button in the toolbar |
| row-actions | `more/features-row-actions--custom-row-action-buttons` | action buttons on every row |
| display-columns | `more/styling-styling-display-columns--customize-display-columns` | row numbers, selection and actions columns |

- A pick that fails gets a new story for its guide in the story file of that feature, built like the three of 1.6.3, and the tracker names it; the second milestone uses that story's page (D140).
- Does NOT change an existing story's options or its page text to make it pass.

#### 1.6.3 Three new stories

- `SortedOnLoad`, name "Sorted On Load", id `features-sorting--sorted-on-load`: the table of `examples/base/multi-sorting`, sorted by state ascending then city descending through `initialState.sorting`; both sort indicators show on load.
- `ColumnHiddenOnLoad`, name "Column Hidden On Load", id `features-column-hiding--column-hidden-on-load`: the file's default table with one column hidden through `initialState.columnVisibility`, density and every other option at their defaults; the column is listed unticked in the show/hide columns menu.
- `ColumnWidenedOnLoad`, name "Column Widened On Load", id `features-column-resizing--column-widened-on-load`: the file's default resizing table with one column wider than the rest through `initialState.columnSizing`; the resize grips work.
- Each story has a play (coding standards, Checks) that asserts the state on load and one user step: clear a sort, bring the column back from the menu, drag the widened column narrower.
- No two stories in a file show the same table with the same options (D106): if an existing story already equals a new one, the new export is not added and the existing story's page is used.
- Does NOT change the library or any existing story.

#### 1.6.4 Pages and text of the new stories

- `node lib/story-pages.mjs` writes the pages and the `meta.json` rows; nothing is typed into `meta.json`.
- Each page: `description` in the frontmatter, `### Try it` with 2 to 4 `<TryIt>` steps above `<StoryExample>`, `## Related guides` below, in the D104 format; the first Related guide is the guide the story was built for.
- Step truth: each step is run once in a browser on base, and its labels read in the radix and aria library copies.

#### 1.6.5 The thirteen guides

- In each guide the `slugs` of the Example section's `<GuideExamples>` becomes the page of 1.6.2, the replacement the first milestone's tracker names, or the new story page of 1.4.
- Shown once (D122): where the table now on top is the same table as one further down, the lower tag goes, with its heading when the heading holds nothing but that table, and its explainer sentence moves between `## Example` and the tag, word for word.
  - row-selection: `<EnableRowPinningSelectExample />` :245 and `## Sticky Pinned Row Selection` :241 go; the sentence :243 moves up. Only when its options equal the `sticky-row-selection` example's; otherwise all three stay.
  - display-columns: `<CustomizeDisplayColumnsExample />` :119 goes; the sentence :117 moves up; the heading `## Customize Built-in ST Display Columns` keeps its text and stays.
  - sorting: `<MultiSortingExample />` :133 goes; no sentence points at it, none moves.
- Every other lower table stays, among them `<BasicExample />` in overflow-tooltip and `<MultiSortingExample />` in sort-editor: they are not the table on top.
- `guides.mjs`: the per-guide checks follow the new top table, the checks of a removed lower table move to the top one, and `EXPLAINERS` gains the guides whose sentence moved.
- Does NOT reword a sentence, change a heading level, or touch the twelve guides D140 leaves as they are.

**Stays unchanged:** `packages/shadcn-table/registry/**`, `apps/shadcn-table-docs/components/**`, `apps/shadcn-table-docs/examples/**`, the 42 example pages, every existing story page.

### 1.7 Dependencies and env: none

## 2. Instructions for AI

### 2.1 Milestones

### Milestone: Guide stories

- Files owned: `packages/shadcn-table/stories/features/**`, `apps/shadcn-table-docs/content/docs/examples/more/**`
- Depends on: none
- Review: fable
- Local CI: `pnpm test typecheck --base base`, `pnpm test typecheck --base radix`, `pnpm test typecheck --base aria`, `pnpm test lint`, `pnpm test validate-repo`, `pnpm test storybook-tests --base base`, `pnpm test storybook-tests --base radix`, `pnpm test storybook-tests --base aria`, `pnpm test docs-e2e --base base`
- Task 1: The ten picks on load (1.6.2): a production build of the branch point on a P6 port, each page opened on base. Checks: one line per pick in the tracker, pass or fail, with what is seen on load; one capture per pick saved under `reference/docs-layout/image/guide-examples/`; each failed pick named with the story that replaces it; the server stopped
- Task 2: The three stories and any replacement (1.6.3), each with its play. Checks: `pnpm test storybook-tests --base base|radix|aria`, one base at a time, pass for the three story files; after `pnpm --filter shadcn-table storybook:build:base` the new ids are in `storybook-static/base/index.json`; no existing story id is missing from it
- Task 3: Pages (1.6.4): `node lib/story-pages.mjs`. Checks: `pnpm test validate-repo` passes its story-pages check; `git diff origin/v0.9/docs-layout --stat -- apps/shadcn-table-docs/content/docs/examples/more` shows only the new pages and `meta.json`
- Task 4: Text of each new page and its truth (1.6.4): each Try it step run once in a browser on a production build on base, its labels read in the radix and aria copies. Checks: every new page has the three parts; one line per page in the tracker with the labels as shown; every Related guides link resolves; the server stopped
- Task 5: The text check of D104 by three judges on each new description and step. Checks: every line passes by majority; a failed line is rewritten and judged again
- Task 6: Cleanup: `pnpm format`, the changelog block. Checks: 2.2

### Milestone: Guide examples

- Files owned: `apps/shadcn-table-docs/content/docs/guides/column-size.mdx`, `apps/shadcn-table-docs/content/docs/guides/density-toggle.mdx`, `apps/shadcn-table-docs/content/docs/guides/overflow-tooltip.mdx`, `apps/shadcn-table-docs/content/docs/guides/filter-chips.mdx`, `apps/shadcn-table-docs/content/docs/guides/global-filtering.mdx`, `apps/shadcn-table-docs/content/docs/guides/sort-editor.mdx`, `apps/shadcn-table-docs/content/docs/guides/row-selection.mdx`, `apps/shadcn-table-docs/content/docs/guides/toolbar-customization.mdx`, `apps/shadcn-table-docs/content/docs/guides/row-actions.mdx`, `apps/shadcn-table-docs/content/docs/guides/display-columns.mdx`, `apps/shadcn-table-docs/content/docs/guides/sorting.mdx`, `apps/shadcn-table-docs/content/docs/guides/column-hiding.mdx`, `apps/shadcn-table-docs/content/docs/guides/column-resizing.mdx`, `test/docs-e2e/lib/guides.mjs`, `.ai/plans/v0.9.x/anindosarker/reference/docs-layout/guide-example-plan.md`, `.ai/plans/v0.9.x/anindosarker/reference/docs-layout/guide-checklist.md`, `.ai/plans/v0.9.x/anindosarker/reference/docs-layout/story-text-checklist.md`
- Depends on: Guide stories
- Review: none
- Local CI: `pnpm test typecheck --base radix`, `pnpm test lint`, `pnpm test validate-repo`, `pnpm test docs-e2e --base base`, `pnpm test docs-e2e --base radix`, `pnpm test docs-e2e --base aria`
- Task 1: The thirteen slugs (1.6.5), from 1.6.2, 1.4 and the first milestone's tracker. Checks: `grep -n "GuideExamples slugs" ` on the thirteen guides prints the thirteen target pages and no `basic`, `advanced` or `export-csv`; `git diff origin/v0.9/docs-layout --stat -- apps/shadcn-table-docs/content/docs/guides` lists the thirteen files only
- Task 2: Shown once (1.6.5): row-selection, display-columns, sorting. Checks: `git diff origin/v0.9/docs-layout --color-moved=zebra` on the three files shows the removed tags and headings, the moved sentences, and no added or changed sentence; the tracker says whether `enable-row-pinning-select` equals `sticky-row-selection`, with the differing option when it does not
- Task 3: Guide checks follow (1.6.5) in `guides.mjs`. Checks: `pnpm test docs-e2e --base base|radix|aria`, one base at a time; on each of the thirteen pages the Example section's table is the target one and its example id occurs once in the served HTML of a production build (`curl`)
- Task 4: On load, in a browser on a production build on base: each of the thirteen guide pages shows its feature in use in the Example section before any click. Checks: one line per guide in the tracker; the server stopped
- Task 5: Plan files (1.6.1), committed on `claude/review`. Checks: `guide-example-plan.md` and `guide-checklist.md` each carry the thirteen new lines and every owner remark of before; `story-text-checklist.md` has one line per new story page
- Task 6: Cleanup: `pnpm format`, the changelog block. Checks: 2.2

### 2.2 Checks

- The Local CI line green, heavy checks one at a time (P5); every server stopped
- The Acceptance checks of 1.2
- Review: fable on the first milestone's diff (new stories and reader-facing text), rounds as run.md says
- Worktrees from the pool 01 to 09 only; the root checkout, `wt1` and `wt2` are never used (P2)
