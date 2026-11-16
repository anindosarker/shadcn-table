# Docs layout decisions, v0.9.x

Accepted decisions for the docs site restructuring, discussed in the "v0.9 docs" session. Numbered `L<n>` so they never collide with the release's `D<n>` items; the epic that implements them cites them as `(docs-layout L<n>)`. Items not yet decided are cards in `queue.md` (`LQ<n>`); a decision that came from a card ends with `- Source: LQ<n>`. Research: `docs-layout-research.md`, `perf-report.md`.

## Round 1: discussion, 2026-11-05

### L1 Nav order is Docs, Examples, Guides, API Reference (amended by L23)

- Today the order is getting-started, api, examples, guides in the sidebar root (`content/docs/meta.json:3-8`), the top nav (`lib/layout.shared.tsx:8-13`), the home nav (`components/dev-home/v12/nav.tsx:12-15`) and the footer (`components/dev-home/v12/footer.tsx:16-19`).
- New order in all four places: Docs (Getting Started: introduction, install, usage, agents), Examples, Guides, API Reference. `lib/routes.ts` follows the same order.
- Owner accepted 2026-11-08.
- Source: LQ9

### L2 `/docs/examples` is one continuous page of every example, loaded on scroll (superseded by L13)

- The examples landing renders the index intro, then every example page in `meta.json` order under its subgroup heading: title, description, the page's MDX body with its playground. Single pages `/docs/examples/<slug>` stay unchanged (metadata, search, deep links).
- Scroll-spy: as a block covers the upper 40 percent of the viewport the URL becomes `/docs/examples/<slug>` through `history.replaceState` (never `pushState`); back at the top it returns to `/docs/examples`. Sidebar highlight, breadcrumb and footer follow through `usePathname`. The spy strips Next's `__NA` and `_N` keys from the history state so the sync fires.
- Loading: the server renders the shell (intro, headings, titles, descriptions, one skeleton per block) plus the first 3 bodies, each in its own `Suspense`. Every other block fetches its body once through the server function `loadExampleBlock(slug)` when within 800 px of the viewport; the live table mounts through `LazyMount`. One skeleton per block from first paint to the mounted table: `ExampleSkeleton` (toolbar plus table) at block level, `ExampleTableSkeleton` inside the playground in place of the former "Loading example" text. Skeleton height `min-h-[560px]`.
- Each block binds its playground to its own page through `ExamplePageProvider`; the playground falls back to the pathname on single pages.
- Measured on the production build: HTML 0.49 MB (all 42 bodies inline was 1.59 MB); the 3 eager blocks carry 0.33 MB of code-explorer sources. 3 eager blocks kept.
- Preview accepted by the owner on 2026-11-08 from branch `v0.9/preview-docs-examples` at `e702398d` (commits `766458b3`, `091c7e38`, `4c682d59`, `47e3b58e`, `ab924f86`, `e702398d`); the epic applies that branch as is. `ae89917d` (persistent-view example defaults to 10 rows) rides along.
- Known, accepted for this cycle: the fumadocs mobile drawer closes on each URL change; Copy page and the GitHub link in the page bar point at the index while scrolling; heading ids can repeat across the stack; blocks load one at a time on a fast scroll.

## Round 2: discussion, 2026-11-09
- Source: LQ10

### L3 The scroll-spy writes `/docs/examples#<slug>`, never the single page URL (superseded by L13)

- Supersedes the URL part of L2: the spy writes `/docs/examples#<slug>` through `replaceState` while a block covers the upper 40 percent of the viewport, and `/docs/examples` at the top. A reload or a shared link therefore opens the stack scrolled to that block.
- Sidebar highlight keys on the hash while on `/docs/examples`; breadcrumb and prev/next stay on the examples index.
- Single pages `/docs/examples/<slug>` keep their own URLs for search, metadata and deep links.
- Owner accepted 2026-11-09.
- Source: LQ11

### L4 Sidebar example links scroll the stack while on `/docs/examples` (superseded by L13)

- On the examples stack the sidebar items under Examples link to `/docs/examples#<slug>`, so a click scrolls the stack to that block instead of leaving it. Anywhere else they link to `/docs/examples/<slug>` as today.
- `/docs/examples/<slug>` stays the plain single page for search, metadata and old links; no banner.
- Owner accepted 2026-11-09.
- Source: LQ12

### L5 A floating back-to-top button on the examples stack (superseded by L13)

- Bottom right of the viewport, shown once the page is scrolled past one viewport height, hidden at the top. Click scrolls smoothly to the top and resets the URL to `/docs/examples` (L3).
- Tailwind utilities only, no library, no global CSS (v0.8.x P8). Only on `/docs/examples`.
- Owner accepted 2026-11-09.
- Source: LQ13

### L6 The examples stack is virtualized with TanStack Virtual (superseded by L13)

- `useWindowVirtualizer` from `@tanstack/react-virtual` (already a dependency) over a flat list of items: intro, group headings, example blocks. `measureElement` for the variable heights, overscan 2. Far-away blocks leave the DOM; the virtualizer keeps their space.
- Block bodies still arrive through `loadExampleBlock(slug)` on first approach (L2) and stay cached in state, so a remount is instant. The skeleton of an unmeasured block keeps `min-h-[560px]`; measured blocks reuse their height, so nothing shifts.
- On load with a hash (L3): `scrollToIndex` to that block after mount. The scroll-spy and sidebar sync (L3, L4) read the rendered blocks.
- SEO guard: every block's title and description also render as plain server HTML outside the virtualized list; the single pages stay the indexed content.
- Targets after a full scroll, measured as in `perf-report.md`: DOM nodes under 5,000, CLS under 0.1 during the scroll, sort click under 200 ms. `filter-variants` (7.8 s load, 6.6 s forced layout) is a separate finding, LF4.
- Owner accepted 2026-11-09.

## Round 3: discussion, 2026-11-10
- Source: LQ14

### L7 The section switcher is a row under the header, TanStack style (amended by L10: the row lives at the top of the sidebar column)

- The section links Docs, Examples, Guides, API (L1 order) leave the header centre and become a row directly under the header, left-aligned over the sidebar column, the active section underlined. The header keeps brand, search, GitHub, Discord, the base selector and the theme toggle.
- One switcher only; it drives the per-section sidebar (item 8, recorded on acceptance of the preview).
- Owner accepted 2026-11-10.
- Source: LQ15

### L8 Sidebar groups flush left, small labels, section titled "Examples"

- Subgroup labels and their pages share the section pages' left edge: no indent, no guide line (`components/sidebar-subgroup.tsx`, `sidebar-separator.tsx` `px-2`; the four indent and guide-line rules in the docs `global.css` deleted). Subgroup labels `text-[9px]`, mono uppercase muted as before; page rows unchanged. Same groups, titles and collapse as before.
- The Examples section is titled "Examples" (was "Quick Examples") in `meta.json`, `lib/routes.ts` and the examples index heading.
- Owner accepted on the 5342 preview, 2026-11-10 (wt1 `d74def4d`).
- Source: LQ16

### L9 One sidebar per section (amended by L22)

- Each section folder (`getting-started`, `examples`, `guides`, `api`) is a fumadocs root (`"root": true`); the sidebar shows only the active section's pages. The section's name renders as a heading row at the top (`components/sidebar-root-heading.tsx`), then its Overview (the index page, listed explicitly in `meta.json` and named through a page-tree transformer in `lib/source.ts`), then its pages under their group labels (L8).
- The prev/next footer crosses section boundaries in L1 order through `footerNeighbours` in `lib/page-tree-utils.ts` (fix of LF5); inside a section the neighbours are unchanged.
- Owner accepted on the 5342 preview, 2026-11-10 (wt1 `11ff81ef`, `9f5a51ef`, `07b5f1eb`).
- Source: LQ17

### L10 Section tabs at the top of the sidebar, search in the header centre (amended by L23)

- Amends L7: the section switcher Docs, Examples, Guides, API (L1 order) is a one-line tab row at the top of the sidebar column (`components/sidebar-section-tabs.tsx`, sidebar banner slot, above the section heading), in the header links' former type: mono 11px uppercase, 0.12em tracking, muted, active in the accent colour with a 2px underline. No full-width row under the header; header height unchanged.
- The header is brand left, the search box centred (max 28rem, `lg` and up; the icon stays with the right group below `lg`), then GitHub, Discord, base selector and theme toggle on the right.
- The sidebar link rules in the docs `global.css` are scoped to the page tree (`[role='presentation'] a`) so they never style the tabs; no `!important` utilities.
- Owner accepted on the 5342 preview, 2026-11-10 (wt1 `b4def583`, `4e26896e`, `449443ce`, `6e0c4da9`, `8949be4c`).
- Source: LQ18

### L11 Preview servers are the owner's to start

- From 2026-11-10 agents never start a docs preview server (`next dev` or `next start`) after a build; they build, run the gates, commit, push, and report the branch head. The owner starts the server when they want to look.
- Agents still may stop a server they started themselves earlier; never one they did not start.
- Source: LQ19

### L12 Storybook stories become docs example pages; Storybook links back (amended by L19, L22)

- Roles: the docs carry description and the rendered table; Storybook carries the table with its interactions (plays); each links to the other.
- One source for descriptions: a JSDoc comment above each story export and a one-line `description` in each story file's meta, in `packages/shadcn-table/stories`. Storybook autodocs and the docs build both read them.
- Docs: three new groups at the end of the Examples section, "Features", "Fixed bugs", "Styling", one page per story file (81 files, 652 stories on 2026-11-16; 79 and 594 when decided), generated at build time from the story files: title, description, the stories as tabs rendering the table in the example playground, the toolbar Storybook button deep-linking to that story. Native rendering through `composeStories` versus an iframe of the deployed story is settled in the plan after a lookup of how the stories import the library per base. The pages join the examples stack as lazy blocks after the 42 docs examples (L2, L6).
- Storybook: a small toolbar addon reads three parameters set in each story file's meta (home URL, guide page, docs example page) and shows them as links in the Storybook header. The reverse mapping of `lib/storybook-map.ts`, generated.
- The "View Extra Storybook Examples" line on example and guide pages goes away; the toolbar Storybook button (wt1 `0160f596`, `64f2cfb5`) replaces it.
- Owner accepted 2026-11-10; confirmed 2026-11-16 after L13: every story still becomes a docs example page, as single pages (no stack).
- Source: LQ20

## Round 4: discussion, 2026-11-16

### L13 No examples stack; `/docs/examples` opens the first example

- Supersedes L2, L3, L4, L5 and L6, and the last sentence of L12's docs bullet ("The pages join the examples stack"). The continuous page, the scroll-spy, hash URLs, sidebar scroll links, the virtualized list and the back-to-top button are removed from the preview branch.
- Examples are single pages `/docs/examples/<slug>` only. `/docs/examples` redirects to the first example in `meta.json` order, so a table shows without a click (the need behind L2).
- Switching examples is done through the per-section sidebar (L8, L9, L10) and the example picker in the toolbar, which keeps its left and right arrows; both open the example's page.
- Why: the owner's PostHog screen recordings (LQ22 to LQ25) show visitors working on one example at a time and jumping to another by name; nobody was seen needing several examples on one screen. Longer descriptions and try-it steps (LQ23, LQ24) would push the stacked tables far apart. The stack demo with L3 to L6 was built on wt1 `3f027846` and never measured.
- Owner accepted 2026-11-16.
- Source: LQ8

### L14 Example pages add "Try it" steps and related guides; the existing text stays

- Page order: title and description (unchanged); the page's existing body text, word for word; `### Try it`; the live example; `## Related guides`.
- Try it: an h3 heading, then 2 to 4 steps in the `TryIt` component (`components/mdx/try-it.tsx`): one short line each, an action and a few words of result, small muted text, directly above the live example. On-screen labels and typed values are inline code, with the exact label the table shows (for example `Sort by First Name ascending`).
- Every step is true to the example's code and data in all three bases. Where the page text does not explain a behaviour the visitor will hit, the step carries the reason in a few words (detail panel: "these rows have no address"; covers LQ21).
- Related guides: a list of links to the guide pages for the feature, below the example; every link resolves.
- The "View Extra Storybook Examples" line is removed from the page (L12); the toolbar Storybook button replaces it.
- Text check, owner 2026-11-17: every Try it step and every Related guides line is verified before it ships, against four criteria. Wording: it reads right and uses the exact on-screen labels. No slop: no filler, no padding, nothing that could be deleted without loss. No unnecessary jargon: plain words where a plain word exists. Simple and short enough: one short line per step, 2 to 4 steps. A text that fails one criterion is rewritten, not shipped.
- Not part of this decision: rewording titles, descriptions or body text (LQ26).
- Owner accepted on the preview 2026-11-16: wt1 `10bd63f3`, pages `basic-new-format-2`, `detail-panel-new-format-2`, `row-dragging-new-format-2`.
- Source: LQ23, LQ24

### L15 Guides get an "Example" section under the intro with the best relevant example

- Page order: title, description and intro paragraph (unchanged); the "Example" section; the rest of the guide (unchanged text, same order).
- The Example section is a heading "Example" at the guide's section level and the live example block, nothing else. It shows the best relevant example: the guide's own example when it has one, otherwise the best match from the Examples section.
- The example's toolbar names the example in its left slot. One example: the example page title followed by the arrow-up-right icon, together the link to `/docs/examples/<slug>`. Several examples: the example picker (arrows and dropdown) listing only this guide's examples; it swaps the table in place without changing the URL, and an "Open example page" button beside it follows the selection. MDX tag `<GuideExamples slugs={[...]} />`, first slug is the default (`components/mdx/guide-examples.tsx`, `components/guide-example-switch.tsx`).
- On guide pages the toolbar stays on one row: the name truncates, and Storybook and Copy prompt show only their icons when the column is narrow. Example pages are unchanged.
- Tables already in a guide: a table the guide's text refers to stays exactly where it is. A table that is only appended as a demo and is not part of the guide's writing (for example "Column Pinning Example" at the end of the column pinning guide) is removed, because the Example section shows it. Which table is which is settled per guide by an audit (LQ28).
- Guide sections are h2 and their sub-sections h3; every guide heading moves up one level (LQ27).
- Guide text is not reworded (LQ26).
- To fix with the rollout: an example mounted twice on one page repeats its element id (`example-<name>`).
- Judgment, owner 2026-11-16: the builder decides per guide, no owner round per guide. Every guide gets the best possible example. A table is removed from a guide only when it is not part of the guide's story, that is, when no text of the guide refers to it or builds on it.
- The rules, in the owner's words of 2026-11-17 (they replace any looser reading above):
  - Every guide gets an Example section. No guide is left without one.
  - The example in it is the best one for that guide.
  - A table that was already in the guide is removed only when both hold: the same example is now shown in the Example section, and the table is not part of the guide's story or writing. Then removing it breaks nothing. A table the writing depends on stays, even when the Example section shows the same example. A table that shows a different example stays.
  - After the implementation there is a short checklist, one line per guide, so the owner can check every guide by hand: which example the section shows, and which table was removed, if any. Nothing is released without the owner's approval of that checklist.
- The owner also compares each guide before and after against the live site.
- Owner accepted on the preview 2026-11-16: wt1 `8f287c43`, pages `column-pinning-new-format-3` and `virtualization-new-format-3`.
- Source: LQ22, LQ27

### L16 The Guides overview lists every guide, as on the live site

- `/docs/guides` keeps its overview page: the guides as numbered link rows under their group headings ("Fundamentals" and so on), the look of the live site on 2026-11-16. The preview had reduced the page to one sentence (wt1 `b9d619f6`).
- The list is built from the sidebar's own data (`content/docs/guides/meta.json` through the page tree), same groups and order, so it cannot go stale. The hand-kept `lib/routes.ts` is not its source and is deleted when nothing else reads it.
- The group headings carry the anchors `usage.mdx:184` links to (`#fundamentals`, `#feature-guides`), or that link is corrected to the anchors that exist.
- Owner accepted 2026-11-16.
- Source: LQ3

### L17 The home footer's Storybook link follows the selected base

- `components/dev-home/v12/footer.tsx:40-41` always opens the radix Storybook; it uses the selected base like `StorybookLink` and the toolbar Storybook button do.
- Settled by the lead 2026-11-16: a defect with one right answer, not a choice.
- Source: LQ1

### L18 The remaining rounded content frames go square

- The docs' radius-0 rule in `global.css` is widened to the frames the audit of 2026-11-10 still found rounded: fumadocs `Tabs` frame and panel, `CodeBlockTabs` frame, the code block copy chip, the agent bar (`components/agent-bar.tsx:105`), prop-table inline code (`components/prop-tables/inline-code.tsx:7`).
- Stays rounded on purpose: the table frame (`ST_TableLayout.tsx:30`) and the fumadocs scroll controls.
- The fumadocs class positions are re-read from the installed package when this is built; they were not rechecked on 2026-11-16.
- Settled by the lead 2026-11-16: brings the leftovers in line with the square dashed style the owner already accepted, not a new choice.
- Source: LQ6

### L19 Docs examples and stories pair one to one; the docs page owns the text

- Amends L12. Still true from L12: every story becomes a docs example page, and the toolbar Storybook button opens the page's story.
- Pairing: an audit lists every docs example with its story in a markdown file, in three lists: exact pair (same table), close pair (same feature, different table), no partner (docs examples without a story; story files without a docs page). After the audit every docs example has an exact story: the existing story where it already matches, otherwise a new story built from the example. No "closest story" links remain.
- Text: the docs page owns the details, the Try it steps and the related guides (L14). Nothing is written once for both sides. This replaces L12's "one source for descriptions" in the story files.
- Storybook: a story's description carries a link to its docs page. The toolbar addon and its three parameters from L12 are not built.
- Story pages that have no text yet start with the table and the Storybook button; their details and Try it steps are written in the docs and go through the owner's wording review with LQ26.
- Story pages use the same page format as the written examples (L14), one page per story file with its stories as tabs (L12).
- The docs page shows the story itself; story code is not copied into the docs examples. The code tab shows the story's source.
- Not decided here: where the story pages sit in the sidebar; that needs its own careful discussion.
- Owner accepted 2026-11-16.

### L20 A test story that copies an example is folded into that example

- A story that shows the same table as another story and only adds an automated check (a `play` function) is not listed as its own story. Its check moves onto the story it copies, and the copy is deleted. The check keeps running; the sidebar shows one entry.
- First case: `packages/shadcn-table/stories/Basic.stories.tsx` "Renders Rows" (`:52`) is "Default" (`:49`) plus a row-count and cell-text check; nothing else references it.
- Applies to every such story (about 270 stories carry a `play` function; how many are plain copies comes out of the L19 audit). A test story that sets the table up differently from every example stays listed like any other story, in Storybook and in the docs: all stories show in the docs (L19, L21), and none is hidden or sorted by hand.
- Owner accepted 2026-11-17.

### L21 "Fixed Bugs" becomes "Miscellaneous"; story group names share one style

- The Storybook folder "Fixed Bugs" is renamed "Miscellaneous", in Storybook and in the docs. The folder is renamed as a whole; no story is moved out of it or sorted into example and test. It is kept for completeness and easy upkeep, not as a group visitors are expected to browse.
- Every story group name is Title Case with spaces: "sticky-footer" becomes "Sticky Footer", "useEffects" "Use Effects", "mobile date pickers" "Mobile Date Pickers", "gridLayout" "Grid Layout". The misspelt "click-propogation" becomes "Click Propagation".
- Group names drop the word "Examples" ("Aggregation Examples" becomes "Aggregation"), the same rule as the docs sidebar labels.
- The change is made in the story files (the meta `title`), so Storybook and the docs follow together. A renamed group changes its stories' Storybook addresses; the docs links to stories are regenerated in the same change.
- Two groups must not end up with the same name within one folder; a clash is resolved when the rename is built.
- Shown on the preview: EX B, wt1 `apps/shadcn-table-docs/preview-examples-ab/generate.mjs` (display names only; the story files are not yet changed).
- Owner accepted 2026-11-17.

### L22 The Examples sidebar: Featured first, groups by demand, story groups under "More examples"

- Amends L9 (no section heading row) and L12 (where the story pages sit). Regrouping moves no page: titles, URLs, descriptions and text of the 42 example pages stay as they are.
- Groups, in this order, labels without "Examples":
  - Featured: Basic (`basic`), Server-Side Pagination (`react-query`), Inline Editing (`editing-crud-inline-row`), Virtualization (`virtualized`), Advanced (`advanced`). Basic is first, so `/docs/examples` opens it (L13). A filter example is not featured, because the basic table already filters.
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
  - More examples: every Storybook group (L19, L21) as a labelled sub-group with its stories as rows.
- Row labels: the Featured rows use the names above; every other row is the page title without the word "Example". The short label shows only in the sidebar, through the optional frontmatter field `sidebarTitle` (`lib/source.ts`); page heading, browser title, breadcrumb, prev/next and the example picker keep the page title.
- Collapse: "More examples" is the only group that collapses. It starts closed, opens when the current page is inside it, and otherwise stays as the visitor left it. Its sub-group labels and all other groups never collapse.
- Sticky group labels: while the sidebar scrolls, the label of the group in view sticks at the top with a dashed line below it and no fade; the next group's label pushes it out. Each group is its own block, so only one label shows.
- No section heading row at the top of the sidebar list in any section; the active tab names the section.
- The whole sidebar can be collapsed with a button right after the brand in the header, and resized by dragging its right edge (220 to 480 px, double click resets); both states survive a reload.
- The header's text links no longer render as rows in the sidebar below 1024 px; the section tabs replace them there and in the mobile drawer.
- Why this order and these names: `featured-examples-research.md`, `example-demand-audit.md`. Checklist of old against new position: `sidebar-regroup-checklist.md`.
- Numbers, as in the EX B demo: every example row starts with its running number and a dot ("1. Basic", "12. Popover Filters"), counted through the whole section in sidebar order, the "More examples" rows included; no leading zeros. Every group label ends with its row count in brackets ("Featured (5)", "More examples (652)"). The numbers are computed from the sidebar order, never typed into a page; they show in the sidebar only, not in the page title (in the demo's stub pages the number is part of the title, which the real pages do not copy).
- Row numbers and group counts are for the Examples section only (owner 2026-11-17). Guides and API show neither.
- Guides and API sidebars: labels, groups and order stay as they are today (owner 2026-11-17: nothing was changed there in the demo either). They share only what the sidebar component gives every section: sticky group labels, no heading row, collapse and resize.
- Not part of this decision: page titles, descriptions and URLs (LQ29).
- Owner accepted on the preview 2026-11-17: the real Examples section at wt1 `2e6f8be2`, "More examples" in the EX B demo at wt1 `cfbe4df3`.

### L23 The section tabs sit in a row under the top bar; the first section is "Get Started"

- Amends L1 (the first section's name) and L10 (where the tabs sit). The order stays Get Started, Examples, Guides, API.
- The first section is labelled "Get Started", not "Docs", in the tab row and the home page menu: "Docs" says nothing next to "Guides", and the section's pages are the getting-started pages (its URLs already say `/docs/getting-started/`). The breadcrumb root "Docs" and the footer column head "Docs" stay; they name the whole docs area.
- The tabs leave the sidebar. They form a row directly under the top bar on every docs page, left aligned with the brand, in the same type style as before, with the dashed rule below the row. There is no line between the top bar and the tab row: the two read as one block.
- The row stays in place with the top bar when the page scrolls; sidebar, content and "On this page" start below both. On the mobile layout the row shows under the top bar too, so the drawer carries no tabs.
- The sidebar list starts with its first group, with no reserved space above it; the sticky group labels (L22) stick at the very top of the sidebar.
- Owner accepted on the preview 2026-11-17 (wt1, branch `v0.9/preview-docs-examples`, around `86e186b8`).
