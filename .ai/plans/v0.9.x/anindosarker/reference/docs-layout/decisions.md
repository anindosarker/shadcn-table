# Docs layout decisions, v0.9.x

Accepted decisions for the docs site restructuring, rewritten on 2026-11-17 after a review of every earlier decision with the owner. Seven decisions, L24 to L30. They replace L1 to L23, which are kept in `decisions-archived.md` for reference; each decision below names the old ones it replaces. Open items are cards in `queue.md` (`LQ<n>`).

The accepted look is on the preview: branch `v0.9/preview-docs-examples` (worktree wt1) at `173444ad`. Where a decision says "as on the preview", that commit is the reference.

## L24 Top of the page: sections Get Started, Examples, Guides, API in a tab row under the top bar

- Replaces L1, L7, L10, L23.
- The docs have four sections, in this order: Get Started, Examples, Guides, API. The order applies wherever the sections are listed: the tab row, the home page menu, the footer.
- The first section is labelled "Get Started", not "Docs". Its pages are the getting-started pages (introduction, install, usage, agents, comparison) and its URLs already say `/docs/getting-started/`. The breadcrumb root "Docs" and the footer column head "Docs" stay; they name the whole docs area.
- The section tabs form a row directly under the top bar on every docs page, left aligned with the brand: mono, uppercase, letter-spaced, muted; the active tab in the accent colour with a 2px underline. The space inside a label is tighter than the gap between tabs, so "GET STARTED" reads as one tab. A dashed rule runs below the row; there is no line between the top bar and the row. Top bar and row stay in place together when the page scrolls.
- The row starts with the sidebar's hide and show button (L25), close to the first tab, with no divider. On the mobile layout the button is not shown and the row scrolls sideways when the tabs do not fit.
- The top bar holds the brand on the left, the search box in the centre (from the `lg` width up; an icon in the right group below it), then GitHub, Discord, the base selector and the theme toggle on the right.
- Owner accepted on the preview 2026-11-17.
- Source: LQ9, LQ15, LQ18

## L25 The sidebar, in every section: one list per section, flush groups, sticky labels, hide and resize

- Replaces L8, L9, and the general parts of L22.
- Each section has its own sidebar: on an Examples page it lists only the examples, on a Guides page only the guides. Guides and API open with an Overview row; Examples has none (L26). The prev/next footer still crosses from one section into the next, in the section order of L24.
- No heading row with the section's name at the top of the list; the active tab names the section.
- Group labels and their pages share one left edge: no indent, no guide line. Labels are small, mono, uppercase and muted.
- Groups never collapse. The one exception is "More examples" in the Examples sidebar (L26).
- Sticky group labels: while the sidebar scrolls, the label of the group in view sticks at the top with a dashed line below it and no fade; the next group's label pushes it out. Only one label shows at a time.
- Hide and show: the button at the start of the tab row hides the whole sidebar and brings it back. Its icon carries an arrow pointing left when the sidebar is open and right when it is hidden; the tooltip reads "Hide sidebar" or "Show sidebar". The sidebar slides in about 200 ms and the content follows; no animation on reload, while resizing, or for visitors who ask for reduced motion. The state survives a reload.
- Resize: dragging the sidebar's right edge changes its width between 220 and 480 px; a double click resets it; arrow keys work; the width survives a reload.
- The header's text links never show as rows in the sidebar, at any width; the tab row replaces them, also on the mobile layout.
- Guides and API: their labels, groups and order stay as they are today.
- Owner accepted on the preview 2026-11-17.
- Source: LQ16, LQ17, LQ7, LQ25

## L26 The Examples sidebar: Featured first, groups by demand, numbered rows, stories under "More examples"

- Replaces L13 and the Examples parts of L22. The long scrolling examples page (old L2 to L6) is not built; it never reached the live site.
- The Examples section has no overview page. `/docs/examples` and the Examples tab open the first example in the list, Basic, through a permanent redirect, so a table shows without a click.
- Regrouping moves no page: titles, URLs, descriptions and text of the 42 example pages stay as they are (LQ29 covers titles and URLs).
- Groups, in this order, labels without the word "Examples":
  - Featured: Basic (`basic`), Server-Side Pagination (`react-query`), Inline Editing (`editing-crud-inline-row`), Virtualization (`virtualized`), Advanced (`advanced`). A filter example is not featured, because the basic table already filters.
  - Filtering: `filter-variants`, `faceted-values`, `filter-switching`, `popover-filters`, `subheader-filters`, `custom-filter-ui`.
  - Server Data: `remote`, `dynamic-columns`, `lazy-detail-panel`, `lazy-sub-rows`.
  - Pinning: `sticky-header`, `column-pinning`, `sticky-row-pinning`, `static-row-pinning`, `sticky-row-selection`.
  - Virtualization: `row-virtualization`, `column-virtualization`, `infinite-scrolling`.
  - Editing: `editing-crud`, `editing-crud-inline-cell`, `editing-crud-inline-table`, `editing-crud-tree`.
  - Grouping: `column-grouping`, `customized-grouping`, `aggregation-and-grouping`.
  - Expanding: `expanding-tree`, `expanding-tree-flat-parse`, `detail-panel`, `chart-detail-panel`.
  - Drag and Drop: `column-ordering`, `row-ordering`, `row-dragging`.
  - Export: `export-csv`, `export-pdf`.
  - Customization: `minimal`, `custom-headless`, `persistent-view`.
  - More examples: every Storybook group as a labelled sub-group, with its stories as rows (L29).
- Row labels: the Featured rows use the names above; every other row is the page title without the word "Example". The short label shows only in the sidebar; page heading, browser title, breadcrumb, prev/next and the example picker keep the page title.
- Numbers, Examples only: every row starts with its running number and a dot ("1. Basic", "12. Popover Filters"), counted through the whole section in sidebar order, the "More examples" rows included, no leading zeros. Every group label ends with its row count in brackets ("Featured (5)", "More examples (652)"). The numbers are computed from the order, never typed into a page, and show in the sidebar only.
- "More examples" is the only group that collapses. It starts closed, opens when the current page is inside it, and otherwise stays as the visitor left it. Its sub-group labels do not collapse.
- Why this order and these names: `featured-examples-research.md`, `example-demand-audit.md`. Old against new position of every page: `sidebar-regroup-checklist.md`.
- Owner accepted on the preview 2026-11-17: the real Examples section, and "More examples" with the numbers and counts in the EX B demo.
- Source: LQ8, LQ10

## L27 Example pages: "Try it" steps above the table, "Related guides" below, existing text unchanged

- Replaces L14.
- Page order: title and description (unchanged); the page's existing body text, word for word; "Try it"; the live example; "Related guides".
- Try it: an h3 heading, then 2 to 4 steps in the `TryIt` component: one short line each, an action and a few words of result, small muted text, directly above the live example. On-screen labels and typed values are inline code, with the exact label the table shows (for example `Sort by First Name ascending`).
- Every step is true to the example's code and data in all three bases. Where the page text does not explain a behaviour the visitor will hit, the step carries the reason in a few words (detail panel: "these rows have no address").
- Related guides: an h2 heading and a list of links to the guide pages for the feature, below the example; every link resolves.
- The "View Extra Storybook Examples" line is removed from the page; the toolbar Storybook button replaces it.
- Text check: every Try it step and every Related guides line is verified before it ships, against four criteria. Wording: it reads right and uses the exact on-screen labels. No slop: no filler, nothing that could be deleted without loss. No unnecessary jargon: plain words where a plain word exists. Simple and short enough: one short line per step, 2 to 4 steps. A text that fails one criterion is rewritten, not shipped.
- Not part of this decision: rewording titles, descriptions or body text (LQ26, LQ29).
- Owner accepted on the preview 2026-11-16: pages `basic-new-format-2`, `detail-panel-new-format-2`, `row-dragging-new-format-2`.
- Source: LQ21, LQ23, LQ24

## L28 Guide pages: an "Example" section under the intro with the best example; the guide's text unchanged

- Replaces L15.
- Page order: title, description and intro paragraph (unchanged); the "Example" section; the rest of the guide (unchanged text, same order).
- The rules, in the owner's words of 2026-11-17:
  - Every guide gets an Example section. No guide is left without one.
  - The example in it is the best one for that guide.
  - A table that was already in the guide is removed only when both hold: the same example is now shown in the Example section, and the table is not part of the guide's story or writing. Then removing it breaks nothing. A table the writing depends on stays, even when the Example section shows the same example. A table that shows a different example stays.
  - After the implementation there is a short checklist, one line per guide, so the owner can check every guide by hand: which example the section shows, and which table was removed, if any. Nothing is released without the owner's approval of that checklist.
- The Example section is a heading "Example" at the guide's section level and the live example block, nothing else.
- The example's toolbar names the example in its left slot. One example: the example page title followed by the arrow-up-right icon, together the link to the example page. Several examples: the example picker (arrows and dropdown) listing only this guide's examples; it swaps the table in place without changing the URL, and an "Open example page" button beside it follows the selection.
- On guide pages the toolbar stays on one row: the name truncates, and Storybook and Copy prompt show only their icons when the column is narrow. Example pages are unchanged.
- Guide sections are h2 and their sub-sections h3; every guide heading moves up one level.
- Guide text is not reworded (LQ26).
- An example shown twice on one page must not repeat its element id.
- Owner accepted on the preview 2026-11-16: pages `column-pinning-new-format-3` and `virtualization-new-format-3`.
- Source: LQ22, LQ27, LQ28

## L29 Storybook and docs match one to one: every story is a docs page, the docs page owns the text

- Replaces L12, L19, L20, L21.
- Every Storybook story is also an example page in the docs. The docs list follows Storybook: its groups and its stories, with the same names and order, under "More examples" in the Examples sidebar (L26). One story is one row and one page. This replaces the earlier wording "one page per story file, its stories as tabs".
- Pairing: an audit lists every docs example with its story in a markdown file, in three lists: exact pair (same table), close pair (same feature, different table), no partner. After the audit every docs example has an exact story: the existing story where it already matches, otherwise a new story built from the example. No "closest story" links remain; the toolbar Storybook button always opens the same table.
- Text: the docs page owns the details, the Try it steps and the related guides (L27). A story's description carries a link to its docs page and nothing more. No Storybook toolbar addon is built.
- The docs page shows the story itself; story code is not copied into the docs examples. The code tab shows the story's source. How the docs mount a story for each base is settled in the plan.
- Story pages that have no text yet start with the table and the Storybook button; their text is written in the docs and goes through the owner's wording review (LQ26).
- Test stories: a story that shows the same table as another and only adds an automated check is not listed on its own; its check moves onto the story it copies and the copy is deleted. First case: "Renders Rows" in the Basic stories, a copy of "Default". A test story with its own different table stays listed like any other story; none is hidden or sorted by hand.
- The Storybook folder "Fixed Bugs" is renamed "Miscellaneous", in Storybook and in the docs, as a whole; no story is moved out of it. It is kept for completeness and easy upkeep, not as a group visitors are expected to browse.
- Every story group name is Title Case with spaces and without the word "Examples" ("sticky-footer" becomes "Sticky Footer", "useEffects" "Use Effects", "Aggregation Examples" "Aggregation"); the misspelt "click-propogation" becomes "Click Propagation". The change is made in the story files, so Storybook and the docs follow together, and the docs links to stories are regenerated in the same change. No two groups in one folder end up with the same name.
- Owner accepted 2026-11-16 and 2026-11-17; the list and the names as in the EX B demo on the preview.
- Source: LQ20

## L30 Two small fixes: the footer's Storybook link follows the selected base; the last rounded boxes go square

- Replaces L17, L18.
- The Storybook link in the home page footer opens the Storybook of the selected base. Today it always opens the Radix one.
- The last rounded frames in the docs content get square corners, matching the square dashed style of the rest: the tab frames and panels, the code tab frames, the code block copy chip, the agent bar, and inline code in the prop tables. The table frame itself and the scroll controls stay rounded on purpose.
- Settled by the lead 2026-11-16, confirmed by the owner 2026-11-17.
- Source: LQ1, LQ6
