# 58: Guide placement, Basic steps and three page names
- Epic: E15

Follow the project planning rules: docs/code-of-conduct/planning-guidelines.md, CLAUDE.md:9. Keep the expedition contract.

## 1. Architecture

### 1.1 Overview

Three content corrections to the docs E14 built, found by the owner on the preview. On 15 guides the Example section sits below a note or a second intro block instead of right after the first paragraph (D117). The Basic page's Try it steps never filter a column, although Basic is the page a visitor looking for column filtering lands on (D118). Three example pages carry a title and an address that differ from their sidebar name (D119). One builder holds all three, because D117 and D119 edit the same guide files.

Branch: created from `origin/v0.9/docs-layout`, merges into `v0.9/docs-layout` (process.md P1, D109). The D122 guide hotfix (merge 77a4a0c2) is on that branch and edits four of the same guides; Task 1 confirms it before anything is moved.

### 1.2 Goals

- On every guide the Example section follows the first intro paragraph; notes and further intro blocks come after it. No guide sentence is reworded (D117, D105).
- A guide whose Example section carries an explainer line (D122) keeps the section as heading, line, table.
- The Basic page's Try it list is the four steps of D118, with "column filtering" in step 2 and `Sort ascending` in step 1; every step is true on base, radix and aria (D118, D104).
- `react-query`, `editing-crud-inline-row` and `virtualized` become "Server-Side Pagination Example" at `/docs/examples/server-side-pagination`, "Inline Editing Example" at `/docs/examples/inline-editing` and "Virtualization Example" at `/docs/examples/virtualization`; heading, browser title, breadcrumb, prev/next and example picker follow the title (D119).
- Each old address redirects permanently to the new one; every docs link to the three resolves; a link text that named the old title names the new one (D119).
- The other 39 example pages, the six shorter addresses D119 names, every description and every other sentence are unchanged (D119).
- Acceptance: programmatic, plus judged for the four Basic steps. `pnpm test docs-e2e --base base|radix|aria` and `pnpm test validate-repo` green; the diff checks of Task 2 and Task 4; on a production build `curl -sI` of the three old addresses answers 308 with the new `location`. Judged: three judges read the four Basic steps against the four criteria of D104, majority per line; the reference for tone is the accepted page `basic-new-format-2` (`origin/v0.9/preview-docs-examples`). The reference for D117 is the accepted preview page `virtualization-new-format-3` (same branch): section after the first paragraph, the NOTE after it.

### 1.3 Current structure

```
apps/shadcn-table-docs/
├── content/docs/guides/<guide>.mdx          ← `## Example` + `<GuideExamples slugs={[...]} />`; first paragraph ends at line 6
├── content/docs/examples/
│   ├── basic.mdx:9-15                       ← Try it: sort, search Nebraska, clear the search
│   ├── react-query.mdx:2,13                 ← title; link to /docs/examples/virtualized
│   ├── editing-crud-inline-row.mdx:2, virtualized.mdx:2
│   ├── meta.json:8-10                       ← the three slugs in Featured
│   └── lazy-sub-rows.mdx:11, remote.mdx:9, advanced.mdx:9, infinite-scrolling.mdx:7   ← links to the three (`[Virtualized Example](/docs/examples/virtualized)` at infinite-scrolling :7)
├── content/docs/getting-started/usage.mdx:51
├── lib/storybook-map.ts:13-15               ← keys `react-query`, `editing-crud-inline-row`, `virtualized` (page slugs, all three; `virtualized` is written unquoted)
└── next.config.mjs:100-112                  ← redirects: [{ source, destination, permanent }]
packages/shadcn-table/.storybook/preview.tsx:40-60   ← reads the map keys as page slugs (docsPageUrl); not edited here
test/docs-e2e/lib/examples.mjs:464-468,577,864-877   ← the three addresses
test/docs-e2e/lib/guides.mjs                          ← per-guide checks
```

- Guides with a block between the first paragraph and `## Example` (line of the heading): aggregation 10, column-resizing 10, customize-components 10, customize-icons 10, data-columns 12, detail-panel 10, display-columns 10, editing 10, expanding-sub-rows 10, row-actions 10, row-ordering-dnd 10, state-management 12, table-event-listeners 10, view-settings 18, virtualization 10; async-loading 10 (hotfixed by D122); production-ready-tables 30 (D130 hotfix, outside E15; moved as found: with D130 merged its Example section is already on top and nothing moves).
- Guide files that link or name the three pages: async-loading :8, :12, :14; editing :12; production-ready-tables :32, :382; column-filtering :355; toolbar-customization :225; virtualization :143.
- The page slug is the mdx file name only. Example folders (`react-query`, `editing-crud-row`, `virtualized`), registry item names and hosted paths use the folder name and do not change (P7).
- Sitemap, search index, llms output, picker and prev/next are built from the content source and follow by themselves.
- Filter flow labels on Basic (`shared/locales/en.ts`): toolbar button `Filter` (:6), picker rows are the column headers, the text field placeholder is `Filter by State` (:51), `Remove filter` (:107).

### 1.4 Target structure

```
apps/shadcn-table-docs/content/docs/examples/
├── server-side-pagination.mdx   ← was react-query.mdx
├── inline-editing.mdx           ← was editing-crud-inline-row.mdx
├── virtualization.mdx           ← was virtualized.mdx
└── meta.json                    ← the three new slugs, same places
apps/shadcn-table-docs/next.config.mjs   ← + three permanent redirects
```

### 1.5 Flow: none

### 1.6 Components

#### 1.6.1 Data artifacts

- `CHANGELOG.md` (P9): `#### Spec 58` under `## Unreleased`, `### Changed`.
- No registry file changes; `pnpm test validate-repo` proves it.

#### 1.6.2 Example section placement (D117)

- In each of the 17 guides of 1.3 the block `## Example`, its explainer line when it has one (D122), and the `<GuideExamples>` tag move to directly after the first intro paragraph. Everything that stood between keeps its words and order and now follows the section.
- Does NOT change any sentence, heading level or example slug.

#### 1.6.3 Basic Try it steps (D118)

`content/docs/examples/basic.mdx:9-15`, the list becomes:

1. Click `First Name` and choose `Sort ascending`. The rows reorder.
2. Try column filtering: click `Filter`, choose `State` and type `Nebraska`. Two rows remain.
3. Remove the filter. All five rows return.
4. Open search and type `Ohio`. One row remains.

- A label that differs on screen on any base is corrected to the on-screen one; the four steps and the words "column filtering" stay (D118).
- Does NOT change the frontmatter, the body text or the Related guides list.

#### 1.6.4 Three page names (D119)

- The three files are renamed with `git mv`; their `title` becomes the sidebar name plus " Example"; `sidebarTitle`, description and body stay.
- `meta.json`, the three `lib/storybook-map.ts` keys, every `GuideExamples` slug and every link of 1.3 take the new slug; a link text "React Query Example", "Editing CRUD Inline Row Example" or "Virtualized Example" becomes the new title. A link text that does not name the title (for example "fully virtualized example") stays.
- `next.config.mjs`: three entries `{ source: '/docs/examples/<old>', destination: '/docs/examples/<new>', permanent: true }`.
- Does NOT rename an example folder, a registry item or a hosted path; does NOT touch `column-ordering`, `row-ordering`, `expanding-tree-flat-parse`, `export-csv`, `export-pdf`, `remote`.

**Stays unchanged:** `examples/**`, `components/**`, `content/docs/examples/more/**`, every guide not listed in 1.3.

### 1.7 Dependencies and env: none

## 2. Instructions for AI

### 2.1 Milestones

### Milestone: Docs content fixes

- Files owned: `apps/shadcn-table-docs/content/docs/guides/aggregation.mdx`, `apps/shadcn-table-docs/content/docs/guides/column-resizing.mdx`, `apps/shadcn-table-docs/content/docs/guides/customize-components.mdx`, `apps/shadcn-table-docs/content/docs/guides/customize-icons.mdx`, `apps/shadcn-table-docs/content/docs/guides/data-columns.mdx`, `apps/shadcn-table-docs/content/docs/guides/detail-panel.mdx`, `apps/shadcn-table-docs/content/docs/guides/display-columns.mdx`, `apps/shadcn-table-docs/content/docs/guides/editing.mdx`, `apps/shadcn-table-docs/content/docs/guides/expanding-sub-rows.mdx`, `apps/shadcn-table-docs/content/docs/guides/row-actions.mdx`, `apps/shadcn-table-docs/content/docs/guides/row-ordering-dnd.mdx`, `apps/shadcn-table-docs/content/docs/guides/state-management.mdx`, `apps/shadcn-table-docs/content/docs/guides/table-event-listeners.mdx`, `apps/shadcn-table-docs/content/docs/guides/view-settings.mdx`, `apps/shadcn-table-docs/content/docs/guides/virtualization.mdx`, `apps/shadcn-table-docs/content/docs/guides/async-loading.mdx`, `apps/shadcn-table-docs/content/docs/guides/production-ready-tables.mdx`, `apps/shadcn-table-docs/content/docs/guides/column-filtering.mdx`, `apps/shadcn-table-docs/content/docs/guides/toolbar-customization.mdx`, `apps/shadcn-table-docs/content/docs/examples/*.mdx`, `apps/shadcn-table-docs/content/docs/examples/meta.json`, `apps/shadcn-table-docs/content/docs/getting-started/usage.mdx`, `apps/shadcn-table-docs/lib/storybook-map.ts`, `apps/shadcn-table-docs/next.config.mjs`, `test/docs-e2e/lib/examples.mjs`, `test/docs-e2e/lib/guides.mjs`
- Depends on: none
- Review: fable
- Local CI: `pnpm test typecheck --base radix`, `pnpm test lint`, `pnpm test validate-repo`, `pnpm test docs-e2e --base base`, `pnpm test docs-e2e --base radix`, `pnpm test docs-e2e --base aria`, `pnpm test storybook-static --base base`
- Task 1: Start state: the D122 hotfix is on the branch point. Checks: `git merge-base --is-ancestor 77a4a0c2 origin/v0.9/docs-layout` succeeds; `async-loading`, `pagination`, `scroll-cues` and `click-to-copy` each show their table once; whether D130 (production-ready-tables) has merged is noted in the tracker, and that guide is moved as found
- Task 2: Placement on the 17 guides (1.6.2). Checks: in each of the 17 guides `## Example` is the first heading and directly follows the first paragraph; `git diff origin/v0.9/docs-layout --color-moved=zebra -- apps/shadcn-table-docs/content/docs/guides` shows moved lines only, no added or removed sentence; a docs E2E check in `guides.mjs` that on every guide the Example section's heading is the first `h2` and follows one paragraph
- Task 3: Three page names (1.6.4). Checks: `grep -rn "examples/react-query\|examples/editing-crud-inline-row\|examples/virtualized\b\|React Query Example\|Editing CRUD Inline Row Example\|Virtualized Example" apps/shadcn-table-docs/content apps/shadcn-table-docs/lib test/docs-e2e` prints nothing; `grep -n "^  virtualized:\|'react-query':\|'editing-crud-inline-row':" apps/shadcn-table-docs/lib/storybook-map.ts` prints nothing; on a production build the three old addresses answer 308 to the new ones and the three new pages show the new title in `h1`, `<title>` and the breadcrumb; the Storybook button of `/docs/examples/server-side-pagination`, `/docs/examples/inline-editing` and `/docs/examples/virtualization` opens its story (`pnpm test storybook-static --base base`), and in a browser that story's intro link leads back to the new address; the example picker lists the three under their new titles
- Task 4: Nothing else renamed. Checks: `git diff origin/v0.9/docs-layout --stat -- apps/shadcn-table-docs/examples apps/shadcn-table-docs/registry.json packages/shadcn-table/registry.json tools/registry` prints nothing; the frontmatter `title` of the other 39 example pages is unchanged (`git diff` shows three title lines)
- Task 5: Basic steps (1.6.3) and their truth: each step run once in a browser on a production build with base, radix and aria selected, on a P6 port, its result seen. Checks: one line per base in the tracker with the label of each control as shown; a corrected label named there; the server stopped
- Task 6: The text check of D104 by three judges on the four Basic steps. Checks: every line passes by majority; for a failed line only a label is corrected to the on-screen one; any other failure goes to the tracker's Attention with the judges' reason, and the text of D118 stays unchanged
- Task 7: Cleanup: `pnpm format`, the changelog block, docs E2E checks follow the new slugs and the Basic steps. Checks: 2.2

### 2.2 Checks

- The Local CI line green; every server stopped
- The Acceptance checks of 1.2
- Review: fable on the whole diff (public addresses and redirects), rounds as run.md says
