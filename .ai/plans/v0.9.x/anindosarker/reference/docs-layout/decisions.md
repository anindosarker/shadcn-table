# Docs layout decisions, v0.9.x

Accepted decisions for the docs site restructuring, discussed in the "v0.9 docs" session. Numbered `L<n>` so they never collide with the release's `D<n>` items; the epic that implements them cites them as `(docs-layout L<n>)`. Items not yet decided are cards in `queue.md` (`LQ<n>`); a decision that came from a card ends with `- Source: LQ<n>`. Research: `docs-layout-research.md`, `perf-report.md`.

## Round 1: discussion, 2026-11-05

### L1 Nav order is Docs, Examples, Guides, API Reference

- Today the order is getting-started, api, examples, guides in the sidebar root (`content/docs/meta.json:3-8`), the top nav (`lib/layout.shared.tsx:8-13`), the home nav (`components/dev-home/v12/nav.tsx:12-15`) and the footer (`components/dev-home/v12/footer.tsx:16-19`).
- New order in all four places: Docs (Getting Started: introduction, install, usage, agents), Examples, Guides, API Reference. `lib/routes.ts` follows the same order.
- Owner accepted 2026-11-08.
- Source: LQ9

### L2 `/docs/examples` is one continuous page of every example, loaded on scroll

- The examples landing renders the index intro, then every example page in `meta.json` order under its subgroup heading: title, description, the page's MDX body with its playground. Single pages `/docs/examples/<slug>` stay unchanged (metadata, search, deep links).
- Scroll-spy: as a block covers the upper 40 percent of the viewport the URL becomes `/docs/examples/<slug>` through `history.replaceState` (never `pushState`); back at the top it returns to `/docs/examples`. Sidebar highlight, breadcrumb and footer follow through `usePathname`. The spy strips Next's `__NA` and `_N` keys from the history state so the sync fires.
- Loading: the server renders the shell (intro, headings, titles, descriptions, one skeleton per block) plus the first 3 bodies, each in its own `Suspense`. Every other block fetches its body once through the server function `loadExampleBlock(slug)` when within 800 px of the viewport; the live table mounts through `LazyMount`. One skeleton per block from first paint to the mounted table: `ExampleSkeleton` (toolbar plus table) at block level, `ExampleTableSkeleton` inside the playground in place of the former "Loading example" text. Skeleton height `min-h-[560px]`.
- Each block binds its playground to its own page through `ExamplePageProvider`; the playground falls back to the pathname on single pages.
- Measured on the production build: HTML 0.49 MB (all 42 bodies inline was 1.59 MB); the 3 eager blocks carry 0.33 MB of code-explorer sources. 3 eager blocks kept.
- Preview accepted by the owner on 2026-11-08 from branch `v0.9/preview-docs-examples` at `e702398d` (commits `766458b3`, `091c7e38`, `4c682d59`, `47e3b58e`, `ab924f86`, `e702398d`); the epic applies that branch as is. `ae89917d` (persistent-view example defaults to 10 rows) rides along.
- Known, accepted for this cycle: the fumadocs mobile drawer closes on each URL change; Copy page and the GitHub link in the page bar point at the index while scrolling; heading ids can repeat across the stack; blocks load one at a time on a fast scroll.

## Round 2: discussion, 2026-11-09
- Source: LQ10

### L3 The scroll-spy writes `/docs/examples#<slug>`, never the single page URL

- Supersedes the URL part of L2: the spy writes `/docs/examples#<slug>` through `replaceState` while a block covers the upper 40 percent of the viewport, and `/docs/examples` at the top. A reload or a shared link therefore opens the stack scrolled to that block.
- Sidebar highlight keys on the hash while on `/docs/examples`; breadcrumb and prev/next stay on the examples index.
- Single pages `/docs/examples/<slug>` keep their own URLs for search, metadata and deep links.
- Owner accepted 2026-11-09.
- Source: LQ11

### L4 Sidebar example links scroll the stack while on `/docs/examples`

- On the examples stack the sidebar items under Examples link to `/docs/examples#<slug>`, so a click scrolls the stack to that block instead of leaving it. Anywhere else they link to `/docs/examples/<slug>` as today.
- `/docs/examples/<slug>` stays the plain single page for search, metadata and old links; no banner.
- Owner accepted 2026-11-09.
- Source: LQ12

### L5 A floating back-to-top button on the examples stack

- Bottom right of the viewport, shown once the page is scrolled past one viewport height, hidden at the top. Click scrolls smoothly to the top and resets the URL to `/docs/examples` (L3).
- Tailwind utilities only, no library, no global CSS (v0.8.x P8). Only on `/docs/examples`.
- Owner accepted 2026-11-09.
- Source: LQ13

### L6 The examples stack is virtualized with TanStack Virtual

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

### L9 One sidebar per section

- Each section folder (`getting-started`, `examples`, `guides`, `api`) is a fumadocs root (`"root": true`); the sidebar shows only the active section's pages. The section's name renders as a heading row at the top (`components/sidebar-root-heading.tsx`), then its Overview (the index page, listed explicitly in `meta.json` and named through a page-tree transformer in `lib/source.ts`), then its pages under their group labels (L8).
- The prev/next footer crosses section boundaries in L1 order through `footerNeighbours` in `lib/page-tree-utils.ts` (fix of LF5); inside a section the neighbours are unchanged.
- Owner accepted on the 5342 preview, 2026-11-10 (wt1 `11ff81ef`, `9f5a51ef`, `07b5f1eb`).
- Source: LQ17

### L10 Section tabs at the top of the sidebar, search in the header centre

- Amends L7: the section switcher Docs, Examples, Guides, API (L1 order) is a one-line tab row at the top of the sidebar column (`components/sidebar-section-tabs.tsx`, sidebar banner slot, above the section heading), in the header links' former type: mono 11px uppercase, 0.12em tracking, muted, active in the accent colour with a 2px underline. No full-width row under the header; header height unchanged.
- The header is brand left, the search box centred (max 28rem, `lg` and up; the icon stays with the right group below `lg`), then GitHub, Discord, base selector and theme toggle on the right.
- The sidebar link rules in the docs `global.css` are scoped to the page tree (`[role='presentation'] a`) so they never style the tabs; no `!important` utilities.
- Owner accepted on the 5342 preview, 2026-11-10 (wt1 `b4def583`, `4e26896e`, `449443ce`, `6e0c4da9`, `8949be4c`).
- Source: LQ18

### L11 Preview servers are the owner's to start

- From 2026-11-10 agents never start a docs preview server (`next dev` or `next start`) after a build; they build, run the gates, commit, push, and report the branch head. The owner starts the server when they want to look.
- Agents still may stop a server they started themselves earlier; never one they did not start.
- Source: LQ19

### L12 Storybook stories become docs example pages; Storybook links back

- Roles: the docs carry description and the rendered table; Storybook carries the table with its interactions (plays); each links to the other.
- One source for descriptions: a JSDoc comment above each story export and a one-line `description` in each story file's meta, in `packages/shadcn-table/stories`. Storybook autodocs and the docs build both read them.
- Docs: three new groups at the end of the Examples section, "Features", "Fixed bugs", "Styling", one page per story file (79 files, 594 stories), generated at build time from the story files: title, description, the stories as tabs rendering the table in the example playground, the toolbar Storybook button deep-linking to that story. Native rendering through `composeStories` versus an iframe of the deployed story is settled in the plan after a lookup of how the stories import the library per base. The pages join the examples stack as lazy blocks after the 42 docs examples (L2, L6).
- Storybook: a small toolbar addon reads three parameters set in each story file's meta (home URL, guide page, docs example page) and shows them as links in the Storybook header. The reverse mapping of `lib/storybook-map.ts`, generated.
- The "View Extra Storybook Examples" line on example and guide pages goes away; the toolbar Storybook button (wt1 `0160f596`, `64f2cfb5`) replaces it.
- Owner accepted 2026-11-10.
- Source: LQ20
