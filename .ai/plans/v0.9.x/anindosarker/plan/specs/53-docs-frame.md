# 53: Docs frame from the preview

Follow the project planning rules: docs/code-of-conduct/planning-guidelines.md, CLAUDE.md:9. Keep the expedition contract.

## 1. Architecture

### 1.1 Overview

The docs frame the owner accepted exists only on the preview branch `v0.9/preview-docs-examples` (head `173444ad`): the section tab row under the top bar (D101), the per-section sidebar with sticky group labels, hide and resize (D102), and the regrouped Examples sidebar that opens on the first example (D103). This spec lands that branch on `claude/review` without its demo sections, adds the row numbers and group counts the Examples sidebar still lacks (D103), and makes the two small fixes of D107. Every other spec of E14 builds on its first milestone.

This spec starts from the preview branch: its first milestone merges `origin/v0.9/preview-docs-examples` into a milestone branch created from `origin/claude/review` and passes the full gates before it merges.

### 1.2 Goals

- `claude/review` carries the top bar, tab row and sidebar exactly as on the preview at `173444ad` (D101, D102), and the Examples sidebar grouping, short labels and first-example redirect (D103).
- The two demo sections EX A and EX B are not on `claude/review`; captures of the EX B sidebar are saved as the reference for the numbers, counts and "More examples" (D103).
- The Guides overview page lists every guide again, as on the live site, built from the sidebar's data.
- Every Examples row shows its running number, every Examples group label its row count; Guides and API show neither (D103, D102).
- The footer's Storybook link opens the selected base; the last rounded frames are square (D107).
- Acceptance: reference plus judges. Captures of `/docs/examples/basic`, `/docs/guides/column-pinning`, `/docs/api` and `/docs/getting-started/introduction` at 1440, 920 and 390 px, sidebar open and hidden, from a production build of the milestone branch, next to the same captures from the preview at `173444ad`; three judges on the named points of D101 and D102 (tab order and labels, no line between top bar and row, dashed rule below, hide button first in the row with the arrow icons, sticky label with dashed line and no fade, no heading row, flush groups). For the numbers: the Examples sidebar next to the EX B captures, judges on number format, count format and "Examples only". Programmatic: the Local CI line of each milestone green.

### 1.3 Current structure

```
origin/claude/review (bbe6c4e7)                         preview 173444ad, merge base 9d0973c8
apps/shadcn-table-docs/
├── components/site-nav.tsx                             ← header; preview mounts the tab row at :101
├── components/section-tabs.tsx                         ← preview only: tab row :21-47, hide button :26-28
├── components/sidebar-collapse-button.tsx              ← preview only
├── components/sidebar-resize-handle.tsx                ← preview only; mounted as the sidebar banner, app/docs/layout.tsx:36
├── components/sidebar-separator.tsx                    ← preview: group block and sticky label :33-47
├── components/sidebar-item.tsx                         ← preview: row label from sidebarName :59
├── components/sidebar-section.tsx                      ← preview: closable folder :40-84
├── components/sidebar-group-context.ts, lib/sidebar-state.ts ← preview only
├── lib/layout.shared.tsx                               ← NAV_LINKS :9-14; PREVIEW_NAV_LINKS :17-20 (demo)
├── lib/source.ts                                       ← sidebarTitle :15-18, :50-59; demo exclusion :92-106
├── lib/examples-entry.mjs                              ← first example :23-30; preview suffix helper :38-46 (spec 54 removes it)
├── next.config.mjs                                     ← examples redirect :107-111; demo redirects :112-117
├── app/global.css                                      ← dashed chrome 183-204, sidebar 269-377, header height 551-573, square list 910-937
├── content/docs/meta.json                              ← lists examples-a, examples-b :8-9 (demo)
├── content/docs/examples-a/, examples-b/               ← demo, 1,097 files
├── preview-examples-ab/                                ← demo generator
├── content/docs/guides/index.mdx                       ← preview: one sentence; review: TableOfContentsList fed by lib/routes.ts
├── components/table-of-contents-list.tsx, lib/routes.ts ← the hand-kept page list
├── components/dev-home/v12/footer.tsx:40-43            ← Storybook link, storybookUrl.radix
├── components/agent-bar.tsx:96,105,113                 ← rounded classes
└── components/prop-tables/inline-code.tsx:7            ← rounded-md
test/docs-e2e/lib/examples.mjs:456-463                  ← redirect check, never run
test/docs-e2e/lib/guides.mjs:837-840                    ← expects more than 10 guide links on /docs/guides
```

- `git merge-tree --write-tree origin/claude/review origin/v0.9/preview-docs-examples` exits 0: no conflict.
- The preview changes 106 files outside the two demo folders. Its last full `pnpm build` passed at `8f287c43`; later commits ran `types:check` and lint only.
- In EX B the numbers and counts are typed into page titles by the generator. The real sidebar must compute them: `SidebarSeparator` knows its group's pages (`separatorPages`), `SidebarItem` gets only `item` and `root`; no component receives a running index.
- fumadocs frames still rounded on `@fumadocs/base-ui` 16.17.5: `tabs.js:29,60`, `codeblock.js:33,51,101`.

### 1.4 Target structure

```
apps/shadcn-table-docs/
├── (every preview file outside the demo folders)        ← merged as is
├── content/docs/meta.json                               ← the four sections only
├── lib/layout.shared.tsx, components/section-tabs.tsx   ← four tabs, no demo links
├── lib/source.ts, next.config.mjs                       ← no demo exclusion, no demo redirect
├── content/docs/guides/index.mdx                        ← the guide list, under its group headings
├── components/table-of-contents-list.tsx                ← reads the page tree
├── lib/routes.ts                                        ← deleted
├── lib/page-tree-utils.ts                               ← row number and group count of the Examples section
├── components/sidebar-item.tsx, sidebar-separator.tsx, sidebar-section.tsx ← show them
├── components/dev-home/v12/footer.tsx                   ← Storybook link by base
└── app/global.css, components/agent-bar.tsx, components/prop-tables/inline-code.tsx ← square
.ai/plans/v0.9.x/anindosarker/reference/docs-layout/captures/ ← EX B and frame reference captures
```

### 1.5 Flow: none

### 1.6 Components

#### 1.6.1 Data artifacts

- `CHANGELOG.md` (P9): `#### Spec 53 <milestone>` blocks under `## Unreleased`: the docs sections and tab row (D101), the sidebar (D102), the Examples sidebar (D103), the footer link and square corners (D107).
- `reference/docs-layout/captures/`: PNG captures of the EX B sidebar (collapsed, "More examples" open, mid-scroll with a stuck label) and of the frame pages of 1.2, taken from the preview at `173444ad` before the demo sections are removed. They are the reference for milestone 2, spec 56 and the judges.
- `apps/shadcn-table-docs/registry.json`, `packages/shadcn-table/registry.json`: unchanged; no description or registry source changes (`pnpm test validate-repo` proves it).

#### 1.6.2 Preview merge (D101, D102, D103)

Status `new` on `claude/review`: every file of the preview outside the demo folders, unchanged in behaviour.

- Merges the preview into the milestone branch; resolves nothing by rewriting, the merge is clean.
- Removes the demo sections: `content/docs/examples-a`, `content/docs/examples-b`, `preview-examples-ab/`, their root `meta.json` entries, `PREVIEW_NAV_LINKS`, the `PREVIEW_SECTIONS` exclusion and `publicSource` when nothing else needs it, the demo redirects.
- Keeps the six example comparison pages, the "Format previews" group, the preview suffix helper, the five guide comparison pages and `VirtualizationGuideExamples.tsx`: specs 54 and 55 remove them.
- Proves the stuck label's dashed line in Chromium, Firefox and WebKit; the label sticks in all three.
- Does NOT change the look or behaviour accepted on the preview, any page title, description, URL or body text.

**Stays unchanged:** `packages/shadcn-table/**`, `content/docs/api/**` body text, every example folder under `examples/`.

#### 1.6.3 Guides overview list

`content/docs/guides/index.mdx`, `components/table-of-contents-list.tsx`, status `refactor`; `lib/routes.ts`, status deleted.

- `/docs/guides` shows every guide as a link row under its group heading, the look of the live site.
- The list is read from the page tree of the Guides section, so `meta.json` is its only source.
- The group headings carry ids; `content/docs/getting-started/usage.mdx:184` links two that exist.
- Does NOT add an overview page to Examples (D103) or change the API overview.

#### 1.6.4 Example row numbers and group counts (D103)

`lib/page-tree-utils.ts`, `components/sidebar-item.tsx`, `components/sidebar-separator.tsx`, `components/sidebar-section.tsx`, status `refactor`.

- Each row of the Examples section shows `<n>. <label>`, n counted through the whole section in sidebar order, rows inside a closable folder included, no leading zeros.
- Each group label of the Examples section ends with its row count in brackets; a closable folder shows the count of all rows inside it, and a sub-group label inside it shows its own row count, as on the EX B capture.
- Computed from the page tree at render; no page file carries a number.
- Does NOT show numbers or counts in Get Started, Guides or API, in the page heading, the browser title, the breadcrumb, the prev/next footer or the example picker.

**Interfaces:**

```typescript
/** Row number of a page inside its root section, 1-based, or undefined outside a numbered section. */
export function rowNumber(root: PageTree.Root | PageTree.Folder, url: string): number | undefined;
/** Number of page rows under a separator group or a folder. */
export function groupCount(node: PageTree.Separator | PageTree.Folder, siblings: PageTree.Node[]): number;
```

#### 1.6.5 Footer link and square corners (D107)

- `components/dev-home/v12/footer.tsx`: the Storybook link uses the selected base, read with `useBase()` as the toolbar Storybook button does. The first link of the "Docs" column reads "Get Started" (D101; it reads "Get started" at `:16` on the preview).
- `app/global.css`: the square list covers the fumadocs tab frame and panel, the code tab frame, the code block figure and the copy chip; `components/agent-bar.tsx` and `components/prop-tables/inline-code.tsx` lose their rounded classes.
- Does NOT square the table frame (`ST_TableLayout.tsx`) or the fumadocs scroll controls.

### 1.7 Dependencies and env: none

## 2. Instructions for AI

### 2.1 Milestones

### Milestone: Preview lands on review

- Files owned: `apps/shadcn-table-docs/app/**`, `apps/shadcn-table-docs/components/site-nav.tsx`, `apps/shadcn-table-docs/components/section-tabs.tsx`, `apps/shadcn-table-docs/components/sidebar-collapse-button.tsx`, `apps/shadcn-table-docs/components/sidebar-resize-handle.tsx`, `apps/shadcn-table-docs/components/sidebar-group-context.ts`, `apps/shadcn-table-docs/components/sidebar-item.tsx`, `apps/shadcn-table-docs/components/sidebar-section.tsx`, `apps/shadcn-table-docs/components/sidebar-separator.tsx`, `apps/shadcn-table-docs/components/sidebar-subgroup.tsx`, `apps/shadcn-table-docs/components/docs-breadcrumb.tsx`, `apps/shadcn-table-docs/components/example-playground.tsx`, `apps/shadcn-table-docs/components/example-switcher.tsx`, `apps/shadcn-table-docs/components/page-switcher.tsx`, `apps/shadcn-table-docs/components/example-variant.tsx`, `apps/shadcn-table-docs/components/example-skeleton.tsx`, `apps/shadcn-table-docs/components/guide-example-switch.tsx`, `apps/shadcn-table-docs/components/mdx.tsx`, `apps/shadcn-table-docs/components/mdx/guide-examples.tsx`, `apps/shadcn-table-docs/components/mdx/try-it.tsx`, `apps/shadcn-table-docs/components/table-of-contents-list.tsx`, `apps/shadcn-table-docs/components/dev-home/v12/nav.tsx`, `apps/shadcn-table-docs/components/dev-home/v12/footer.tsx`, `apps/shadcn-table-docs/lib/layout.shared.tsx`, `apps/shadcn-table-docs/lib/source.ts`, `apps/shadcn-table-docs/lib/page-tree-utils.ts`, `apps/shadcn-table-docs/lib/sidebar-state.ts`, `apps/shadcn-table-docs/lib/examples-entry.mjs`, `apps/shadcn-table-docs/lib/example-pages.mjs`, `apps/shadcn-table-docs/lib/storybook-map.ts`, `apps/shadcn-table-docs/lib/llms.ts`, `apps/shadcn-table-docs/lib/structured-data.ts`, `apps/shadcn-table-docs/lib/routes.ts`, `apps/shadcn-table-docs/next.config.mjs`, `apps/shadcn-table-docs/example-groups/map.tsx`, `apps/shadcn-table-docs/example-groups/VirtualizationGuideExamples.tsx`, `apps/shadcn-table-docs/preview-examples-ab/**`, `apps/shadcn-table-docs/content/docs/**`, `test/docs-e2e/lib/**`, `.ai/plans/v0.9.x/anindosarker/reference/docs-layout/captures/**`
- Depends on: none
- Review: fable
- Local CI: `pnpm test typecheck --base radix`, `pnpm test lint`, `pnpm test validate-repo`, `pnpm test docs-e2e --base base`, `pnpm test docs-e2e --base radix`, `pnpm test docs-e2e --base aria`
- Task 1: Reference captures (1.6.1) from a production build of `origin/v0.9/preview-docs-examples` at `173444ad` on a P6 port, saved under `reference/docs-layout/captures/`. Checks: the files exist and each shows the named state; the server stopped
- Task 2: Merge `origin/v0.9/preview-docs-examples` into the milestone branch (1.6.2). Checks: `git merge` exits 0 with no conflict; `pnpm --filter shadcn-table-docs types:check`
- Task 3: Remove the demo sections and their wiring (1.6.2). Checks: `grep -rn "examples-a\|examples-b\|PREVIEW_NAV_LINKS\|PREVIEW_SECTIONS\|preview-examples-ab" apps/shadcn-table-docs --include='*.ts' --include='*.tsx' --include='*.mjs' --include='*.json'` prints nothing; `ls apps/shadcn-table-docs/content/docs` lists `api examples getting-started guides meta.json`
- Task 4: Guides overview list from the page tree, `lib/routes.ts` deleted (1.6.3). Checks: `/docs/guides` on a production build lists 46 guide links under their group headings; both anchors of `usage.mdx:184` resolve; `grep -rn "lib/routes" apps/shadcn-table-docs` prints nothing
- Task 5: docs E2E follows the frame: the tab row, the hide button, the Examples redirect (`examples.mjs:456-463`), the guides list (`guides.mjs:837-840`), with no decided behaviour bent to a test. Checks: `pnpm test docs-e2e --base base`
- Task 6: The stuck label's dashed line in Chromium, Firefox and WebKit (1.6.2). Checks: one capture per engine of a stuck label on `/docs/examples/basic`, paths in the tracker
- Task 7: Cleanup: `pnpm format`, the changelog block. Checks: 2.2; the frame captures of 1.2 for the judges

### Milestone: Example row numbers

- Files owned: `apps/shadcn-table-docs/lib/page-tree-utils.ts`, `apps/shadcn-table-docs/components/sidebar-item.tsx`, `apps/shadcn-table-docs/components/sidebar-separator.tsx`, `apps/shadcn-table-docs/components/sidebar-section.tsx`
- Depends on: Preview lands on review
- Review: fable
- Local CI: `pnpm test typecheck --base radix`, `pnpm test lint`, `pnpm test docs-e2e --base base`
- Task 1: `rowNumber` and `groupCount` (1.6.4). Checks: `pnpm --filter shadcn-table-docs types:check`
- Task 2: Rows and group labels of the Examples section show them (1.6.4). Checks: on a production build `/docs/examples/basic` shows `1. Basic` and `Featured (5)`, the last row's number equals the number of Examples rows; `/docs/guides/column-pinning`, `/docs/api` and `/docs/getting-started/introduction` show no number and no count; the page heading of `/docs/examples/basic` reads `Basic Example`
- Task 3: Cleanup: `pnpm format`, the changelog block. Checks: 2.2; the Examples sidebar captures next to the EX B captures for the judges (the docs E2E check of the first and last row number is in spec 56, which owns `examples.mjs` by then)

### Milestone: Footer link and square corners

- Files owned: `apps/shadcn-table-docs/components/dev-home/v12/footer.tsx`, `apps/shadcn-table-docs/app/global.css`, `apps/shadcn-table-docs/components/agent-bar.tsx`, `apps/shadcn-table-docs/components/prop-tables/inline-code.tsx`
- Depends on: Preview lands on review
- Review: none
- Local CI: `pnpm test typecheck --base radix`, `pnpm test lint`, `pnpm test docs-e2e --base base`
- Task 1: The footer Storybook link by base and the "Get Started" label (1.6.5). Checks: on a production build, with each base selected the footer link's `href` is `https://storybook.shadcn-table.com/<base>/`; the home page footer shows "Get Started"
- Task 2: The square corners (1.6.5). Checks: computed `border-radius` is `0px` on a tab frame and panel and a code tab frame of `/docs/getting-started/install`, a code block copy chip, the agent bar and a prop-table inline code; the table frame of `/docs/examples/basic` is still rounded
- Task 3: Cleanup: `pnpm format`, the changelog block. Checks: 2.2

### 2.2 Checks

- `pnpm test typecheck --base radix` (runs the docs `types:check`), `pnpm test lint`, `pnpm test validate-repo`, `pnpm test docs-e2e --base base|radix|aria` green; every server stopped
- `pnpm --filter shadcn-table-docs build` passes on the merged tree
- The Acceptance captures and judges of 1.2
- Review: fable on "Preview lands on review" (the whole frame arrives in one diff) and on "Example row numbers" (shared sidebar components)
