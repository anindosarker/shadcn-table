# Docs layout decisions, v0.9.x

Accepted decisions for the docs site restructuring, discussed in the "v0.9" session. Numbered `L<n>` so they never collide with the cycle's `D<n>` items; the epic that implements them cites them as `(docs-layout L<n>)`. Research: `docs-layout-research.md`.

## Round 1: discussion, 2026-11-05

### L1 Nav order is Docs, Examples, Guides, API Reference

- Today the order is getting-started, api, examples, guides in the sidebar root (`content/docs/meta.json:3-8`), the top nav (`lib/layout.shared.tsx:8-13`), the home nav (`components/dev-home/v12/nav.tsx:12-15`) and the footer (`components/dev-home/v12/footer.tsx:16-19`).
- New order in all four places: Docs (Getting Started: introduction, install, usage, agents), Examples, Guides, API Reference. `lib/routes.ts` follows the same order.
- Owner accepted 2026-11-08.

### L2 `/docs/examples` is one continuous page of every example, loaded on scroll

- The examples landing renders the index intro, then every example page in `meta.json` order under its subgroup heading: title, description, the page's MDX body with its playground. Single pages `/docs/examples/<slug>` stay unchanged (metadata, search, deep links).
- Scroll-spy: as a block covers the upper 40 percent of the viewport the URL becomes `/docs/examples/<slug>` through `history.replaceState` (never `pushState`); back at the top it returns to `/docs/examples`. Sidebar highlight, breadcrumb and footer follow through `usePathname`. The spy strips Next's `__NA` and `_N` keys from the history state so the sync fires.
- Loading: the server renders the shell (intro, headings, titles, descriptions, one skeleton per block) plus the first 3 bodies, each in its own `Suspense`. Every other block fetches its body once through the server function `loadExampleBlock(slug)` when within 800 px of the viewport; the live table mounts through `LazyMount`. One skeleton per block from first paint to the mounted table: `ExampleSkeleton` (toolbar plus table) at block level, `ExampleTableSkeleton` inside the playground in place of the former "Loading example" text. Skeleton height `min-h-[560px]`.
- Each block binds its playground to its own page through `ExamplePageProvider`; the playground falls back to the pathname on single pages.
- Measured on the production build: HTML 0.49 MB (all 42 bodies inline was 1.59 MB); the 3 eager blocks carry 0.33 MB of code-explorer sources. 3 eager blocks kept.
- Preview accepted by the owner on 2026-11-08 from branch `v0.9/preview-docs-examples` at `e702398d` (commits `766458b3`, `091c7e38`, `4c682d59`, `47e3b58e`, `ab924f86`, `e702398d`); the epic applies that branch as is. `ae89917d` (persistent-view example defaults to 10 rows) rides along.
- Known, accepted for this cycle: the fumadocs mobile drawer closes on each URL change; Copy page and the GitHub link in the page bar point at the index while scrolling; heading ids can repeat across the stack; blocks load one at a time on a fast scroll.
