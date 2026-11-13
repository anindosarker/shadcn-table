# 47: Comparison page returns with the searched names

Follow the project planning rules: docs/code-of-conduct/planning-guidelines.md, CLAUDE.md:9. Keep the expedition contract.

## 1. Architecture

### 1.1 Overview

Spec 31 (D60) added `content/docs/getting-started/comparison.mdx`, second in Getting Started, comparing shadcn-table with tablecn, Material React Table and the shadcn data-table recipe. D71 changed its place and its columns after a look at what people search ("tanstack table vs shadcn table", "shadcn data table vs tanstack table", "material react table vs ag grid", "ag grid alternative" exist; "tablecn vs" returns nothing). The page was taken out for 0.9.3 (D75, spec 32, commit 1853327f; the file is in git history at that commit's parent) and returns here: last in Getting Started, columns shadcn-table, TanStack Table, the shadcn data-table recipe, Material React Table, AG Grid. The owner reads the table in chat before this milestone merges (D89).

### 1.2 Goals

- `/docs/getting-started/comparison` exists; `meta.json` order is `introduction, install, usage, agents, comparison` (D71).
- The feature matrix has the columns shadcn-table, TanStack Table, shadcn/ui data-table recipe, Material React Table, AG Grid, in this order; no tablecn column (D71).
- Every cell is a claim shown by the cited project's own docs or repository, with the source in the Sources section and the date of the reading on the page; a cell that cannot be sourced is left out (D71).
- The sidebar label is "Comparison"; the page's `<title>` names the compared libraries (D71).
- The page has no byline and no `date` frontmatter field (D74).
- The owner reads the full table in chat before the merge (D89).
- Acceptance: programmatic and one owner read. On a production build served on a P6 port: `curl -s -o /dev/null -w '%{http_code}' localhost:<port>/docs/getting-started/comparison` prints `200`; `curl -s localhost:<port>/docs/getting-started/comparison | grep -o '<title>[^<]*</title>'` prints a title that contains `TanStack Table`, `Material React Table` and `AG Grid` and ends in ` | shadcn-table`; the sidebar's Getting Started group lists Introduction, Installation, Usage, AI Agent Setup, Comparison in that order (a named docs E2E check); `grep -ci tablecn apps/shadcn-table-docs/content/docs/getting-started/comparison.mdx` prints 0; `curl -s localhost:<port>/sitemap.xml | grep -c getting-started/comparison` prints 1; `pnpm test docs-e2e --base base` green. The tracker holds the table under `## Table for the owner` and the owner's answer.

### 1.3 Current structure

```
apps/shadcn-table-docs/content/docs/getting-started/meta.json      ← "pages": ["introduction", "install", "usage", "agents"]
apps/shadcn-table-docs/content/docs/getting-started/               ← agents.mdx, install.mdx, introduction.mdx, usage.mdx; no comparison.mdx
git show 1853327f^:apps/shadcn-table-docs/content/docs/getting-started/comparison.mdx ← the spec 31 page: frontmatter title 'Comparison', description, date; "## Feature matrix" (13 rows: install model, base libraries, sorting, filtering, grouping and aggregation, column and row pinning, virtualization, editing, export, i18n, styling, TanStack Table version, license), "## Which one fits", "## Sources"
apps/shadcn-table-docs/app/docs/[[...slug]]/page.tsx:76            ← <DocsTitle>{page.data.title}</DocsTitle>
apps/shadcn-table-docs/app/docs/[[...slug]]/page.tsx:96-112        ← generateMetadata: title: page.data.title, description
apps/shadcn-table-docs/lib/source.ts:5-12                          ← defineDocs with fumadocs' pageSchema; no field for a separate search title
test/docs-e2e/lib/getting-started.mjs                              ← the per-page checks of Getting Started; none for a comparison page
```

- The copy-rule description script D71's checks name was removed by spec 32 (D74); that check no longer exists and is not run.
- `app/sitemap.ts` and `lib/llms.ts` list pages from the source, so a new page joins both without an edit; Task 2 confirms it.

### 1.4 Target structure

```
content/docs/getting-started/comparison.mdx   ← restored from 1853327f^, rewritten to the five columns, no date field
content/docs/getting-started/meta.json        ← "comparison" appended
lib/source.ts                                 ← the page schema extended by one optional string field for the search title
app/docs/[[...slug]]/page.tsx                 ← generateMetadata uses that field when a page sets it, else title
test/docs-e2e/lib/getting-started.mjs         ← a named check for the page and the sidebar order
CHANGELOG.md (P9)                             ← #### Spec 47 under ### Docs
```

### 1.5 Flow: none

### 1.6 Components

#### 1.6.1 Data artifacts

- `CHANGELOG.md` (P9): `#### Spec 47 Comparison page` under `## Unreleased`, `### Docs`: a Comparison page in Getting Started compares shadcn-table with TanStack Table, the shadcn/ui data-table recipe, Material React Table and AG Grid (D71).
- The tracker section `## Table for the owner`: the feature matrix as Markdown, exactly as the page renders it, with the source link of every non-shadcn-table cell.

#### 1.6.2 Page (D71)

`content/docs/getting-started/comparison.mdx`, status `new` (restored and rewritten).

- Frontmatter: `title: 'Comparison'`, the search title field of 1.6.3 set to `shadcn-table vs TanStack Table, shadcn/ui data-table, Material React Table and AG Grid`, a `description` naming the five and the compared aspects in under 160 characters. No `date`.
- Intro paragraph as before with today's date of reading and five ways in place of four.
- `## Feature matrix`: the 13 rows of the spec 31 page. The shadcn-table, Material React Table and recipe columns start from the old page's cells, each re-read against its source on the day of writing. The TanStack Table column (the headless library itself: what its docs offer as row models and APIs, with no UI) and the AG Grid column (Community against Enterprise named in the cell wherever a feature is Enterprise only) are written from tanstack.com/table and ag-grid.com docs. A claim with no source line is left out, not softened.
- `## Which one fits`: one sentence per option, rewritten for the five; no claim that is not in the matrix.
- `## Sources`: one bullet per project with the links read.
- Does NOT mention tablecn; does NOT add a byline; does NOT change any other docs page.

#### 1.6.3 Search title (D71)

`lib/source.ts`, `app/docs/[[...slug]]/page.tsx`, status `refactor`.

- The docs schema becomes `pageSchema` extended by one optional string field (name `searchTitle`), with the schema tool fumadocs' `pageSchema` is built on, imported from where fumadocs re-exports it; no package is added to `package.json` (zod left the docs app with D79; if the extension cannot be written without adding a dependency, the long title goes in `title` and the short sidebar label is set in `meta.json` through fumadocs' own page-tree means, and the tracker records which form was used).
- `generateMetadata`: `title: page.data.searchTitle ?? page.data.title`. The page heading and the sidebar keep `page.data.title`.
- Does NOT change the title template, JSON-LD, or any other page's title.

#### 1.6.4 Owner read (D89)

- When the page and its checks are done and before the merge, the milestone stops: the tracker gets `## Attention` with one line "the owner reads the comparison table (D89)" and the table under `## Table for the owner`; the runner sends `BLOCKED E12 <tracker path>`. The lead pastes the table in chat. The owner's answer comes back as a typed `NOTE E12:` line; corrections are applied, the checks rerun, and the milestone merges. No other milestone waits for this one except the release Integration.

**Stays unchanged:** every other docs page, `lib/llms.ts`, `app/sitemap.ts`, `reference/docs-layout/` (the docs session's work).

### 1.7 Dependencies and env: none

## 2. Instructions for AI

### 2.1 Milestones

### Milestone: Comparison page

- Files owned: `apps/shadcn-table-docs/content/docs/getting-started/comparison.mdx`, `apps/shadcn-table-docs/content/docs/getting-started/meta.json`, `apps/shadcn-table-docs/app/docs/[[...slug]]/page.tsx`, `apps/shadcn-table-docs/lib/source.ts`, `test/docs-e2e/lib/getting-started.mjs`
- Depends on: none
- Review: none
- Local CI: `pnpm test typecheck --base base`, `pnpm test lint`, `pnpm test validate-repo`, `pnpm test docs-e2e --base base`
- Task 1: The search title field (1.6.3). Checks: `pnpm --filter shadcn-table-docs types:check`; `git diff origin/claude/review -- apps/shadcn-table-docs/package.json` prints nothing
- Task 2: The page and `meta.json` (1.6.2), every cell read against its source that day; the docs E2E check. Checks: the `curl` and `grep` lines of 1.2 on a production build on a P6 port; every link of the Sources section returns 200 (`curl -s -o /dev/null -w '%{http_code}'` per link, the list in the tracker); the server stopped
- Task 3: `pnpm format`, the changelog block, then the owner read (1.6.4). Checks: 2.2; the owner's answer recorded in the tracker before the merge

### 2.2 Checks

- The Local CI lines green; the Acceptance lines of 1.2
- The table and the owner's answer in the tracker (D89)
- Review: none (docs content read by the owner; one optional schema field; P7 untouched)
