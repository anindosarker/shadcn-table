# Docs layout research, v0.9.x discussion

Facts gathered on 2026-11-05 for the docs restructuring items (nav order, examples placement, examples page shape, Storybook discoverability). Two lookup agents: one on the docs app at `claude/review`, one on six reference sites read as server-rendered HTML. Paths are under `apps/shadcn-table-docs/` unless prefixed.

## 1. Our docs site today

### Navigation

- Top nav `NAV_LINKS` at `lib/layout.shared.tsx:8-13`: Docs `/docs/getting-started/introduction`, API `/docs/api`, Examples `/docs/examples`, Guides `/docs/guides`. Discord icon link at :26-33.
- Docs layout: fumadocs notebook `DocsLayout` (`app/docs/layout.tsx:2,15`), `nav mode:'top'`, `tabs={false}`, header slot `SiteNav` (:17-20). Sidebar from `source.getPageTree()` (:21) with custom `SidebarSection` and `SidebarSeparator` (:24).
- Home page carries its own nav copy in the same order (`components/dev-home/v12/nav.tsx:12-15`); footer lists Get started, API, Guides, Examples (`components/dev-home/v12/footer.tsx:16-19`).
- Sidebar root order: getting-started, api, examples, guides (`content/docs/meta.json:3-8`). API Reference is second, Examples third, Guides fourth.
  - Getting Started (`getting-started/meta.json:4`): introduction, install, usage, agents. No index page; `/docs` and `/docs/getting-started` redirect to `/introduction` (`next.config.mjs:66-77`).
  - API Reference (`api/meta.json`): 3 subgroups, 9 pages, landing `api/index.mdx`.
  - Examples, titled "Quick Examples" (`examples/meta.json:2`): 5 top pages plus 8 subgroups, 42 pages (:4-55), landing `examples/index.mdx`.
  - Guides (`guides/meta.json`): 10 subgroups, 46 pages, landing `guides/index.mdx`.
- Second, hand-kept route list `lib/routes.ts:11`, examples block at :107, external "Extra Storybook Examples" entry at :392. Feeds `TableOfContentsList` on `examples/index.mdx:10-12`.

### Routes (`app/`)

- `/` is `(home)/page.tsx:11`, renders `HomePage` from `components/dev-home/v12/home-page.tsx`; bare layout `(home)/layout.tsx:5-7`.
- `/docs/[[...slug]]` is `docs/[[...slug]]/page.tsx`, fumadocs `DocsPage` rendering the MDX body (:28-84). Example pages go full width when the TOC is empty (:35-41).
- `/api/data`, `/api/moredata/[phoneNumber]`, `/api/treedata`, `/api/users`: mock data for remote examples.
- `/api/search`: fumadocs `createFromSource` (`api/search/route.ts:2-4`).
- `/dev`, `/dev/theme/1-9`: dev pages (`dev/pages.ts`, `dev-bar.tsx`).
- `/llms.txt`, `/llms-full.txt`, `/llms.mdx/docs/[[...slug]]`, `/SKILL.md`, `/version.txt`, `/og/docs/[...slug]`: route handlers.
- `proxy.ts:2-21`: fumadocs negotiation serves markdown to clients that ask for it.

### Examples

- Hand-written per base in `examples/{radix,base,aria}/<slug>/`: 117 folders each, 116 examples (v0.8.x `decisions.md:363`).
- `lib/example-variants.mjs:3-18` copies them to gitignored `examples/.{radix,base,aria}/` and rewrites `@/components/ui/` imports to `@/components/ui-<base>/`. Runs on `predev` and `build`.
- 43 MDX example pages in `content/docs/examples/` (44 files with `index.mdx`). Each page is prose plus one component, e.g. `basic.mdx:8` `<BasicExample />`; `examples/map.tsx:20` maps it to `<ExampleSnippet name="basic"/>` (`components/mdx/example-snippet.tsx:34`), which renders `ExamplePlayground`.
- `ExamplePlayground` (`components/example-playground.tsx`): Preview and Code modes (:69-70; a "Both" mode is named in comments but absent from the tab list, :128); code view is `CodeExplorer` (:403); "Open in CodeSandbox" (:348), copy prompt, full screen, base switch (:272).
- The other examples sit in tab sets in `example-groups/*.tsx` (13 files), e.g. `BasicExamples.tsx:9-25` builds `ExampleTabs` with 4 tabs.
- Base switch is UI only, no URL parameter. `BaseSwitch` (`components/base-selector.tsx:144`) in the site header (`site-nav.tsx:89`) and the example toolbar; choice stored in sessionStorage then localStorage (`base-selector.tsx:63,86`). `BaseTabs` at :194.

### Storybook

- One story set for all three bases; `ST_BASE` picks the base (`packages/shadcn-table/.storybook/main.ts:4,26-28`; `package.json:14-19`, `storybook:{base,radix,aria}`, `storybook:build:*`).
- 79 story files, 594 exported stories, same set per base: `Basic.stories.tsx` 1, `features/` 38, `fixed-bugs/` 25, `styling/` 15.
- Deploy: `vercel.json` "storybook" service builds all three into `storybook-static/`; the root redirects to `/base/`. Also `README.md:14`, `CHANGELOG.md:749`, `scripts/release/smoke.mjs:35`.
- URLs `https://storybook.shadcn-table.com/{radix,base,aria}/` (`components/mdx/storybook-link.tsx:14-18`).
- Links from the docs:
  - `StorybookLink` (`storybook-link.tsx:24-35`) follows the selected base; on 68 pages (42 example, 26 guide), always "View Extra Storybook Examples", e.g. `content/docs/examples/basic.mdx:10`. No API or getting-started page has one.
  - `lib/routes.ts:392`: bare root URL "Extra Storybook Examples" in the examples index TOC (`components/table-of-contents-list.tsx:6,21`).
  - Home footer `footer.tsx:40-41` always uses `storybookUrl.radix`, not the selected base.
  - No link in the top nav, sidebar or home page body. No docs page indexes or embeds individual stories.

### Home page (`components/dev-home/v12/home-page.tsx`)

- Starfield and Nav (:33-34).
- Hero `section.v12-hero` (:37): Dune, h1, AgentBar, CTA to `/docs/getting-started/install` (:58-59), link to `/docs/examples` (:65).
- Demo `section.v12-demo` (:72): RiseFigure "Live demo", `<SignalDemo/>` (:76-77).
- Theming (:82): `<ThemeDemo/>` (:107).
- Features (:112): link to `/docs/guides` (:130), `AutoplayTileGrid` (:135).
- Install (:139): link to `/docs/getting-started/usage` (:154), `CodeStrip` (:163).
- Footer (:169).
- Links to examples: hero :65, nav (`nav.tsx:14`), footer :19.

### Framework

- Next 16.3.8, React 19.3. fumadocs-core 16.17.5, fumadocs-mdx 15.4.7, fumadocs-ui is `@fumadocs/base-ui` 16.17.5; `createMDX` at `next.config.mjs:1-3`.
- MDX source `content/docs` (`lib/source.ts:7-8`, `defineDocs` from `fumadocs-mdx/macro`). Search: fumadocs built-in.

### Prior decisions that touch docs

- No decision in any cycle covers nav order, sidebar structure or Storybook discoverability.
- v0.3.x Docs app #2: per-base UI folders; `examples/<slug>` shows `@/components/ui` imports; variants generated.
- v0.6.x #1: examples follow the base model, one hand-written set per base. #7: Base UI preselected; Storybook root redirects to `/base/`; builds under `/radix/`, `/base/`, `/aria/`. #8: Base UI listed first; docs and Storybook base selectors are dropdowns. #9: "edition" renamed "base".
- v0.7.x D3: base selector on every example toolbar. D24: headless example documents the row spacer column. D38: examples keep Lucide.
- v0.8.x D33: docs ship with 0.8.0, a guide per feature. D45, D49: every docs example and every story sets column icons. D46, D54, D55, D62, D63, D69: home demo look and behaviour. D50: persistent-view example uses the header demo data. D51: filtering examples use chips, new "Subheader Filters Example" page.

## 2. Reference sites (server-rendered HTML, 2026-11-05)

### shadcnstudio.com/docs/components/data-table?base=base

- First viewport: h1, one-paragraph intro, Discord callout, "Built using TanStack Table" note. Then a "Data Table Variants" block: "Open in new tab" link and one iframe `/preview/components/base/data-table?index=0`.
- The iframe holds a grid of 13 variants, "Data Table 1" to "Data Table 13"; each cell shows its title on hover and a "View code" button; the registry JSON gives each a name, title and one-line description.
- Then 6 prose h2 (what it is, why, production tips, integration, Base UI support, Radix UI support) and 11 FAQ h3. No install, usage or API section.
- Base switcher `?base=base` in the URL; preview path contains `/base/`.
- Breadcrumb Home > Components > Data Table. No Storybook or playground link. 8 h2, 12 h3.

### ui.shadcn.com/docs/components/base/data-table

- First viewport: h1, Copy Page, Previous/Next, one-line description, 3-way switcher Base UI / React Aria / Radix UI, then a live demo table (5 rows, Columns menu, row selection, pagination).
- Sections: Introduction, TOC, Installation, Prerequisites, Project Structure, Set up Table Features, Basic Table, Cell Formatting, Row Actions, Pagination, Sorting, Filtering, Visibility, Row Selection, Reusable Components, RTL. A build-it-yourself guide, 2 `component-preview` blocks, no Examples section, no API section.
- Base switcher by route `/docs/components/{base|aria|radix}/data-table`.
- Sidebar groups: Sections, Components, AI Elements, Get Started, @shadcn/react, @shadcn/helpers, Forms, Utilities, Registry. No Examples group. No Storybook link. 16 h2, 17 h3.

### www.tablecn.com

- First viewport: h1 "Data Table", then a live full-width app demo with Mode (Server / Client) and Filter (Plain / Advanced / Command) toggles.
- No prose sections (0 h2, 0 h3). Each example is its own route in the top nav: Data Table, Data Grid, Data Grid Multiplayer, Data Grid Rapid, Data Grid DOOM, plus Docs (links out to diceui.com) and GitHub.
- No base switcher, no Storybook link.

### www.shadcn.io/ui/data-table

- First viewport: h1, one-line description, Copy / Copy Markdown, intro paragraph ("no DataTable component, on purpose"), then a Preview / Code tab block with a "Preview width" control and a caption.
- Sections: Install, How it fits together, A basic table (3 h3), Pagination, Sorting, Filtering, Column visibility, Row selection, Row actions, Expandable rows, Server-side data, Right to left, Accessibility, Examples, FAQ (10 h3). Right-hand "On this page" TOC. 3 Preview/Code blocks inside the guide.
- "Examples" h2 near the bottom: one paragraph linking to `/data-table-examples` ("8 tables, each adding one feature") and `/table-examples`. `/data-table-examples` is "8 Data Table Examples for React": an "Every data table example" grid of cards (not headings), an MCP/Pro h2, 13 FAQ h3.
- Sidebar "175 pages": Get started (12), then Guides (Form, Data Table, Typography, Markdown, AI SDK, TanStack AI), then All components by category. Global nav has a separate "Examples" entry and a "Built On" menu (Base UI / Radix UI / Ark UI / React Aria). No base switcher on the page, no Storybook link. 14 content h2, 13 h3.

### shadcnspace.com/blocks/dashboard-ui/tables

- First viewport: h1 "Shadcn Tables", one-line description, "View All Blocks", Sort by (Newest / Price / All), then the first block.
- One continuous page with 11 blocks, each an h2 ("Table 11 - Project Tracking Table" down to "Table 01"), newest first. Each block: title, Pro/Free badge (10 Pro, 1 Free), 1 to 2 sentence description, live preview, Show Code and Copy Prompt, some "Preview in Figma".
- Code panel: "Select component library" (implicit base/radix switcher) and "Select package manager"; file explorer shows `app/table-11/page.tsx` and `components/shadcn-space/blocks/table-11/table11.tsx`.
- Previews also exist as separate `/preview/table-NN` pages. Top nav: Blocks, Animated blocks, Templates, Components, Dashboard, Pages, AI Tools, Resources. No Storybook link. 11 h2, 0 h3.

### www.shadcn-vue.com/docs/components/data-table

- First viewport: h1, Copy Page, Previous/Next, one-line description, live demo table (5 rows, Columns menu, selection, pagination), then the full demo source inline.
- Sections: same guide shape as ui.shadcn.com plus Expanding. No Examples section, no API section, no base switcher.
- Sidebar groups: Sections, Components, AI Elements, Directory, Forms, Registry, Utilities, Get Started. No Examples group. No Storybook link. 16 h2, 21 h3.

### Comparison

| site | first viewport | examples per page | continuous or per-route | examples placement in nav | base switcher |
|---|---|---|---|---|---|
| shadcnstudio | intro prose, then iframe grid of variants | 13 (one iframe grid) | one page per component, grid inside | under Components | `?base=base` URL param, `/base/` preview path |
| ui.shadcn.com | 3-way switcher plus live demo | 2 previews (guide) | guide page, no examples gallery | no Examples group; under Components | route segment `/base|aria|radix/` |
| tablecn | full live app demo with Mode/Filter toggles | 1 | per-route (5 demos in top nav) | top nav; docs hosted externally (diceui) | none |
| shadcn.io | intro prose, then Preview/Code demo | 3 in guide; 8 on `/data-table-examples` | guide page plus separate examples route | page under Guides; Examples in global nav; Examples h2 near page end | none on page |
| shadcnspace | title, sort controls, first block | 11 | one continuous page | Blocks > Dashboard UI category | per-block "Select component library" |
| shadcn-vue | live demo plus inline source | 1 | guide page | no Examples group; under Components | none |

- None of the six links to Storybook, StackBlitz, CodeSandbox or v0 in its server HTML. None has an API or props section.

## 3. Discussion items drawn from this

1. Nav order: Examples third after API Reference in all four navs (sidebar root, top nav, home nav, footer). Posted 2026-11-05, open.
2. Examples landing page shape: 43 MDX pages with one playground each today; continuous page versus grid versus per-route.
3. Storybook discoverability: 594 stories reachable only through "View Extra Storybook Examples" on 68 pages and one index entry; no nav link, no per-story index in the docs.
4. Base switch in the URL: UI-only today (sessionStorage and localStorage); shadcnstudio uses `?base=`, ui.shadcn.com a route segment.
