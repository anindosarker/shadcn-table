# 31: Docs content, descriptions and discoverability pages
- Epic: E10

Follow the project planning rules: docs/code-of-conduct/planning-guidelines.md, CLAUDE.md:9. Keep the expedition contract.

## 1. Architecture

### 1.1 Overview

Audit 2026-11-10 (content 62/100): docs intros and descriptions are 38 to 53 percent Material React Table wording with its typos carried over (`examples/detail-panel.mdx:3`, `lazy-sub-rows.mdx:3`, `lazy-detail-panel.mdx:3` all read "show how use use"); measured on `claude/review` the same day over 103 pages: 16 descriptions under 60 characters (`api/index.mdx` has none, `guides/column-size.mdx` reads "How to column width"), 2 over 160, 2 pairs duplicated (sticky-header / sticky-row-pinning examples; row-selection guide / example), 48 pages under 150 words (41 example pages, 7 API pages); the Introduction page (where `/docs` lands with a 307) has no install snippet or demo; no page targets "TanStack Table" together with "shadcn/ui"; no comparison page; the GitHub repo has no topics (`gh repo view`, 2026-11-10); the docs show no byline or dates. D60 fixes all of it. The frontmatter gains a `date` field (fumadocs' `pageSchema` strips unknown keys, so the schema is extended with `zod`, spec 24's dependency), the docs page renders byline and date, `/docs` redirects permanently, the sidebar links the changelog, two pages are added, and the repo gets topics. The copy work is split by folder into three milestones so three builders run in one sprint after the page frame lands; the owner has accepted that E8 (docs restructuring) builds on whatever this spec leaves (E10 notes).

### 1.2 Goals

- Every docs page has a unique `description` of 120 to 155 characters and a `date` (`YYYY-MM-DD`) in frontmatter; no description contains "Shadcn Table example show how", "use use" or any other MRT typo; no two pages share a description (D60).
- Every page has at least 150 words of prose (examples: two or three sentences on what the example shows and when to use it; API pages: one paragraph on what the table lists and how the options relate); intros are written around what is shadcn-specific (D60).
- The Introduction page has the install snippet (`<InstallCommand />`, the component the install page uses) and a demo (`<ExampleSnippet>` of the basic example, as the examples pages render it) after the motivation section (D60).
- `/docs` redirects with 308 to `/docs/getting-started/introduction` (D60).
- Two new pages: `guides/tanstack-table-with-shadcn-ui.mdx` ("TanStack Table with shadcn/ui", first in the Fundamentals group) and `getting-started/comparison.mdx` ("Comparison", after Introduction) with a feature matrix against tablecn, Material React Table and the shadcn/ui data-table recipe, every cell checkable against the compared project's public docs on the day of writing (D60).
- Every docs page shows `By anindosarker · Updated <date>` under the description, the name linking to `https://github.com/anindosarker`; the sidebar's last entry links the changelog (`https://github.com/anindosarker/shadcn-table/blob/master/CHANGELOG.md`) (D60).
- The repo has the topics `react`, `shadcn-ui`, `tanstack-table`, `data-table`, `typescript`, `nextjs` (D60).
- Acceptance: programmatic plus one review. A script over `content/docs/**/*.mdx` (the one in 1.6.1, run by each copy milestone on its folder and by the frame milestone on all) prints `0` for: descriptions outside 120 to 155 characters, missing `date`, duplicate descriptions, pages under 150 words, matches of `/use use|example show how|Shadcn Table example/`; `curl -s -o /dev/null -w '%{http_code} %{redirect_url}' localhost:<port>/docs` prints `308 .../docs/getting-started/introduction`; `curl -s localhost:<port>/docs/getting-started/introduction | grep -o 'Updated 20[0-9-]*</p>' | wc -l` prints `1` (the plain `grep -c` counts the RSC payload line too, the run of 2026-11-10); `curl -s localhost:<port>/sitemap.xml | grep -c 'tanstack-table-with-shadcn-ui\|getting-started/comparison'` prints `2`; `gh repo view anindosarker/shadcn-table --json repositoryTopics --jq '[.repositoryTopics[].name] | length'` prints `6`; `pnpm test docs-e2e --base base` green; the fable review of the frame milestone passes on the comparison page's claims and the new guide (1.6.4).

### 1.3 Current structure

```
apps/shadcn-table-docs/
├── lib/source.ts:7-18                   ← defineDocs({ docs: { schema: pageSchema } })  (title, description, icon, full)
├── lib/shared.ts                        ← siteName, gitConfig { user: 'anindosarker', repo: 'shadcn-table' }
├── app/docs/[[...slug]]/page.tsx:72-75  ← DocsTitle, DocsDescription; no byline, no date
├── next.config.mjs:67-71                ← /docs → /docs/getting-started/introduction, permanent: false
├── content/docs/meta.json               ← pages: getting-started, api, examples, guides
├── content/docs/getting-started/        ← meta.json [introduction, install, usage, agents]; introduction.mdx (no install snippet, no demo)
├── content/docs/guides/                 ← meta.json (Fundamentals group starts with production-ready-tables); 45 pages
├── content/docs/examples/               ← meta.json; 42 pages + index (41 under 150 words)
└── content/docs/api/                    ← meta.json; 9 pages + index (index has no description; 7 under 150 words)
```

### 1.4 Target structure

```
apps/shadcn-table-docs/
├── lib/source.ts                        ← schema: pageSchema.extend({ date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/) })
├── lib/shared.ts                        ← + siteAuthor = { name: 'anindosarker', url: 'https://github.com/anindosarker' }
├── components/docs-byline.tsx           ← "By <name> · Updated <date>", muted, under the description
├── app/docs/[[...slug]]/page.tsx        ← renders <DocsByline /> after DocsDescription
├── next.config.mjs                      ← /docs redirect permanent: true
├── content/docs/meta.json               ← + "[Changelog](https://github.com/anindosarker/shadcn-table/blob/master/CHANGELOG.md)"
├── content/docs/getting-started/        ← meta.json [introduction, comparison, install, usage, agents]; introduction.mdx (+ install, + demo); comparison.mdx (new); all four rewritten descriptions + date
├── content/docs/guides/                 ← meta.json (Fundamentals: tanstack-table-with-shadcn-ui first); tanstack-table-with-shadcn-ui.mdx (new); 45 pages: description, date, intro copy
├── content/docs/examples/               ← 43 pages: description, date, two or three sentences each
├── content/docs/api/                    ← 10 pages: description, date, one paragraph each
└── tools/docs/check-frontmatter.mjs     ← the Acceptance script (1.6.1)
CHANGELOG.md (P9)                        ← #### Spec 31 <milestone> under ## Unreleased, ### Docs (one block per milestone)
```

### 1.5 Flow: none

### 1.6 Components

#### 1.6.1 Data artifacts

- `tools/docs/check-frontmatter.mjs` (`new`, frame milestone): walks `apps/shadcn-table-docs/content/docs/**/*.mdx` (or the folder given as argument), parses frontmatter, counts words outside code fences and JSX tags, prints one line per rule with its count and the offending paths: description length outside 120 to 155, missing or malformed `date`, duplicate descriptions, under 150 words, typo matches (`/use use|example show how|Shadcn Table example/`). Exit 1 when any count is above 0. Run by hand in the checks; not wired into `pnpm test` (no new test name in this spec).
- Frontmatter `date`: the day the page's copy was last written, `YYYY-MM-DD`; every page gets one in this spec (the day its milestone edits it).
- `CHANGELOG.md` (P9): one `#### Spec 31 <milestone>` block per milestone under `## Unreleased`, `### Docs`: the frame (bylines, dates, changelog link, 308, two new pages), the examples copy, the guides and API copy (D60).
- GitHub topics: `gh repo edit anindosarker/shadcn-table --add-topic react,shadcn-ui,tanstack-table,data-table,typescript,nextjs` (frame milestone, Task 4; a repository setting authorised by D60, P7).

#### 1.6.2 Frontmatter schema and byline

- `lib/source.ts`, status `refactor`: `import { z } from 'zod'`; `schema: pageSchema.extend({ date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/) })`. `date` is required, so a page without one fails the build: the frame milestone adds `date` to every page it does not otherwise touch (all 103 at the current day) in one commit, and the copy milestones rewrite it on the pages they edit (both sides keep the later value in a conflict; the copy milestones merge after the frame).
- `lib/shared.ts`, status `refactor`: `export const siteAuthor = { name: gitConfig.user, url: \`https://github.com/${gitConfig.user}\` }`.
- `components/docs-byline.tsx`, status `new`, server component: `<p className="docs-byline text-sm text-fd-muted-foreground">By <a href={siteAuthor.url}>{siteAuthor.name}</a> · Updated {date}</p>`; the date rendered as given (`2026-11-10`), no locale formatting.
- `app/docs/[[...slug]]/page.tsx`, status `refactor`: `<DocsByline date={page.data.date} />` directly after `DocsDescription`; `generateMetadata` unchanged. Spec 25's JSON-LD `techArticleJsonLd` may read `page.data.date` as `dateModified` once this schema exists; that extension is a one-line ride-along here (`lib/structured-data.ts` is not owned by this spec, so it is NOT done here; a later spec may add it).

**Interfaces:**

```typescript
// lib/shared.ts
export const siteAuthor: { readonly name: string; readonly url: string };
// components/docs-byline.tsx
export function DocsByline({ date }: { date: string }): JSX.Element;
```

**Stays unchanged:** `DocsTitle`, `DocsDescription`, the page bar, MDX rendering, `generateStaticParams`.

#### 1.6.3 Redirect, sidebar link, meta order

- `next.config.mjs`, status `refactor`: the `/docs` entry's `permanent: false` becomes `true` (308). The `/docs/getting-started` entry stays `false` (a sidebar convenience, not a canonical move). No other change (specs 24 and 28 own the rest of the file's E10 edits and merge first).
- `content/docs/meta.json`: `"[Changelog](https://github.com/anindosarker/shadcn-table/blob/master/CHANGELOG.md)"` appended to `pages` (fumadocs renders a link item).
- `content/docs/getting-started/meta.json`: `["introduction", "comparison", "install", "usage", "agents"]`.
- `content/docs/guides/meta.json`: `"tanstack-table-with-shadcn-ui"` inserted right after `"---Fundamentals---"`.

#### 1.6.4 New pages and the Introduction

- `content/docs/guides/tanstack-table-with-shadcn-ui.mdx` (`new`): title `TanStack Table with shadcn/ui`; what TanStack Table gives (headless state and row models), what shadcn/ui gives (the components you own), how this library wires the two (`useShadcnTable` over `useReactTable`, `ST_*` components over your `components/ui`), when to reach for the plain shadcn/ui data-table recipe instead; links to Usage, Table Options, the basic example. 400 to 700 words, one code block (the hook call), no marketing.
- `content/docs/getting-started/comparison.mdx` (`new`): title `Comparison`; a table with rows for install model (copied source vs package), base libraries (Base UI / Radix / React Aria), built-in features (sorting, filtering, grouping, pinning, virtualization, editing, export, i18n), styling, TanStack version, license, and columns shadcn-table, tablecn, Material React Table, shadcn/ui data-table recipe. Each cell states only what the compared project's public documentation shows on the day of writing (the builder records the URLs and the date in the tracker); unknown stays "not documented". One paragraph on when each is the better fit. No superlatives.
- `content/docs/getting-started/introduction.mdx` (`refactor`): after "## Motivation" a "## Install" section with `<InstallCommand />` (the component `install.mdx` uses) and a "## See it" section with the basic example snippet (the same component call `examples/basic.mdx` uses); the Cards block stays; description rewritten.
- Review: the frame milestone takes a `fable` review on the two new pages (claims, tone, accuracy against the cited docs) and the Introduction; nits fixed by the builder.

#### 1.6.5 Copy rewrites (examples; guides and API)

- Every page in the milestone's folder: a unique description of 120 to 155 characters naming the feature and the shadcn-table option or component involved; `date` set; MRT phrasing and typos replaced; "Shadcn Table" as a product name in prose becomes "shadcn-table".
- Examples (43 pages): two or three sentences after the frontmatter: what the example shows, which options it turns on (named, in backticks), when to use it; the `<ExampleSnippet>`/`<StorybookLink>` calls stay as they are.
- Guides (45 pages): the intro paragraph rewritten around the shadcn-specific behaviour (the option, the `ST_` component, the base copies), the rest of the body untouched unless it carries an MRT typo (fixed in place).
- API (10 pages): one paragraph after the switcher describing what the table lists and how it relates to TanStack's options; `api/index.mdx` gets a description.
- Does NOT change headings, anchors, example components, code blocks or page URLs (E8 restructures later; nothing here moves a file).

### 1.7 Dependencies and env

- `zod` (spec 24's dependency milestone); `gh` authenticated as the owner for the topics; no env change.

## 2. Instructions for AI

### 2.1 Milestones

### Milestone: Page frame and new pages

- Files owned: `apps/shadcn-table-docs/lib/source.ts`, `apps/shadcn-table-docs/lib/shared.ts`, `apps/shadcn-table-docs/components/docs-byline.tsx`, `apps/shadcn-table-docs/app/docs/[[...slug]]/page.tsx`, `apps/shadcn-table-docs/next.config.mjs`, `apps/shadcn-table-docs/content/docs/meta.json`, `apps/shadcn-table-docs/content/docs/getting-started/**`, `apps/shadcn-table-docs/content/docs/guides/meta.json`, `apps/shadcn-table-docs/content/docs/guides/tanstack-table-with-shadcn-ui.mdx`, `tools/docs/check-frontmatter.mjs`
- Depends on: 24, 25, 28, 29
- Review: fable
- Local CI: `pnpm test typecheck --base base`, `pnpm test lint`, `pnpm test validate-repo`, `pnpm test docs-e2e --base base`
- Task 1: Schema, `siteAuthor`, byline, page wiring (1.6.2); `date` added to every page under `content/docs` in one commit (the frame owns that one-line change on files the copy milestones later rewrite; conflicts keep the later date). Checks: `pnpm --filter shadcn-table-docs types:check`; `pnpm --filter shadcn-table-docs build`
- Task 2: Redirect, sidebar link, meta order (1.6.3); `tools/docs/check-frontmatter.mjs` (1.6.1). Checks: `node tools/docs/check-frontmatter.mjs apps/shadcn-table-docs/content/docs/getting-started` prints `0` on every rule after Task 3
- Task 3: The two new pages and the Introduction (1.6.4); getting-started descriptions and dates. Checks: the frontmatter script on `getting-started` and on `guides/tanstack-table-with-shadcn-ui.mdx`; `pnpm --filter shadcn-table-docs build`
- Task 4: Prove the Acceptance lines of 1.2 for the 308, the byline, the sitemap entries on a production build on a P6 port; `gh repo edit ... --add-topic` and the topics count; stop the server. Checks: the lines of 1.2
- Task 5: Cleanup: `pnpm format`, the changelog block (1.6.1). Checks: 2.2

### Milestone: Examples copy

- Files owned: `apps/shadcn-table-docs/content/docs/examples/**`
- Depends on: Page frame and new pages
- Review: fable
- Local CI: `pnpm test typecheck --base base`, `pnpm test lint`, `pnpm test validate-repo`, `pnpm test docs-e2e --base base`
- Task 1: Rewrite the 43 example pages (1.6.5): description, date, two or three sentences. Checks: `node tools/docs/check-frontmatter.mjs apps/shadcn-table-docs/content/docs/examples` prints `0` on every rule; `pnpm --filter shadcn-table-docs build`
- Task 2: Cleanup: `pnpm format`, the changelog block (1.6.1). Checks: 2.2

### Milestone: Guides and API copy

- Files owned: `apps/shadcn-table-docs/content/docs/guides/*.mdx`, `apps/shadcn-table-docs/content/docs/api/**`
- Depends on: Page frame and new pages
- Review: fable
- Local CI: `pnpm test typecheck --base base`, `pnpm test lint`, `pnpm test validate-repo`, `pnpm test docs-e2e --base base`
- Task 1: Rewrite the 45 guide pages (the new guide excluded, it belongs to the frame) and the 10 API pages (1.6.5). Checks: `node tools/docs/check-frontmatter.mjs apps/shadcn-table-docs/content/docs/guides` and `... content/docs/api` print `0` on every rule; `pnpm --filter shadcn-table-docs build`
- Task 2: Cleanup: `pnpm format`, the changelog block (1.6.1). Checks: 2.2

### 2.2 Checks

- `pnpm test typecheck --base base`, `pnpm test lint`, `pnpm test validate-repo` green
- `pnpm test docs-e2e --base base` green: every page renders, the byline present, the two new pages in the sidebar and the sitemap
- `node tools/docs/check-frontmatter.mjs` on the whole `content/docs` prints `0` on every rule once all three milestones have merged (the release spec's Integration runs it)
- Review: fable on each milestone (public text; the comparison page's claims against the cited docs)
