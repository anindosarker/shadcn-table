# 32: Docs wording restored, byline and dates removed

Follow the project planning rules: docs/code-of-conduct/planning-guidelines.md, CLAUDE.md:9. Keep the expedition contract.

## 1. Architecture

### 1.1 Overview

Spec 31 (D60) rewrote the description and intro of the example, guide and API pages and put a byline with a hand-written date on every docs page. The owner rejected the wording on the preview and found the byline (a fixed GitHub username and one date, `2026-11-10`, on all 105 pages) not worth keeping (D74). This spec patches forward on `claude/review`, before any of it is released: the three content folders get back their text from `33f62f5e~1` (the last commit before spec 31 touched them: `33f62f5e` added the `date:` lines, `7912d34f` to `a6936758` rewrote the copy), with the listed typos fixed; the byline, the `date` schema field and the copy-rule script go. Three ride-alongs touch the same files: the TanStack guide moves to the end of its sidebar group (D72), the comparison page leaves 0.9.3 (D75), and `registry.json` is regenerated from the restored descriptions. A rewrite of the docs wording is not planned here (D74).

### 1.2 Goals

- Every file under `content/docs/examples/`, `content/docs/guides/*.mdx` and `content/docs/api/` has the frontmatter `description` and body of `33f62f5e~1`, plus only the typo fixes of 1.6.2 (D74).
- No docs page renders a byline; no docs file has a `date:` line; the docs schema has no `date` field (D74).
- `guides/tanstack-table-with-shadcn-ui.mdx` is kept unchanged and listed last in the Fundamentals group (D72).
- `/docs/getting-started/comparison` does not exist in this release: the file and its `meta.json` entry are removed (D75).
- Kept from spec 31: the Introduction page's install snippet and demo, the rewritten descriptions of `getting-started/{install,usage,agents}.mdx`, the permanent `/docs` redirect, the sidebar Changelog link (D74).
- `apps/shadcn-table-docs/registry.json` equals the output of `pnpm -w registry:items` on the restored descriptions (D74).
- Acceptance: programmatic. `git diff 33f62f5e~1 -- apps/shadcn-table-docs/content/docs/examples apps/shadcn-table-docs/content/docs/guides apps/shadcn-table-docs/content/docs/api` shows only: the added `guides/tanstack-table-with-shadcn-ui.mdx`, its `guides/meta.json` entry at the end of Fundamentals, and the typo lines of 1.6.2 (the builder pastes the `--stat` line and the changed-line count into the tracker). `grep -rn "DocsByline\|docs-byline\|siteAuthor\|^date:" apps/shadcn-table-docs/app apps/shadcn-table-docs/components apps/shadcn-table-docs/lib apps/shadcn-table-docs/content` prints nothing. On a production build served on a P6 port: `/docs/getting-started/comparison` returns 404; `/docs/guides/tanstack-table-with-shadcn-ui` returns 200; `curl -s localhost:<port>/docs/guides/sorting | grep -c 'Updated 20'` prints 0; `curl -s localhost:<port>/sitemap.xml | grep -c '<loc>'` prints 105 (104 docs pages and the home page; 106 today with the comparison page). `pnpm -w registry:items && git diff --exit-code apps/shadcn-table-docs/registry.json` exits 0. `pnpm test validate-repo` and `pnpm test docs-e2e --base base` green.

### 1.3 Current structure

```
apps/shadcn-table-docs/
├── content/docs/examples/**               ← 43 pages, description and intro rewritten (2745db71, 5cbc6d4b, 21d1f674, 40166937, 6bddaf09), `date:` line (33f62f5e)
├── content/docs/guides/*.mdx              ← rewritten (7912d34f, a6936758), `date:`; tanstack-table-with-shadcn-ui.mdx new (da82b103, 49e56726)
├── content/docs/guides/meta.json          ← "tanstack-table-with-shadcn-ui" first under "---Fundamentals---"
├── content/docs/api/**                    ← rewritten (7912d34f, a6936758), `date:`
├── content/docs/getting-started/meta.json ← ["introduction", "comparison", "install", "usage", "agents"]
├── content/docs/getting-started/comparison.mdx ← new in spec 31 (da82b103, 7c7b2161); no other file links to it
├── content/docs/getting-started/{introduction,install,usage,agents}.mdx ← `date:` line; descriptions rewritten; introduction has install and demo
├── components/docs-byline.tsx             ← "By <siteAuthor> · Updated <date>" (3e8114a3, 805b2cef)
├── app/docs/[[...slug]]/page.tsx:23,81    ← the import and <DocsByline date={page.data.date} /> (the only two lines 3e8114a3 added)
├── lib/source.ts:12-15                    ← pageSchema.extend({ date: z.string().regex(...) }) and its comment
├── lib/shared.ts:17-21                    ← siteAuthor, read only by docs-byline.tsx
└── registry.json                          ← generated from the spec 31 descriptions (cc199f5a)
tools/docs/check-frontmatter.mjs           ← D60 copy rules (description 120 to 155 characters, 150 words, date); referenced by nothing
```

101 files differ between `33f62f5e~1` and `claude/review` under the three folders; 105 `.mdx` files exist under `content/docs`; the docs E2E suite (`test/docs-e2e/`) was not changed by spec 31.

### 1.4 Target structure

```
apps/shadcn-table-docs/
├── content/docs/examples/**, guides/*.mdx, api/** ← text of 33f62f5e~1 plus the typo fixes of 1.6.2; no `date:`
├── content/docs/guides/tanstack-table-with-shadcn-ui.mdx ← kept as merged, without `date:`
├── content/docs/guides/meta.json          ← the entry last under "---Fundamentals---" (after "accessibility")
├── content/docs/getting-started/meta.json ← ["introduction", "install", "usage", "agents"]
├── content/docs/getting-started/*.mdx     ← as merged, without `date:`; comparison.mdx deleted
├── app/docs/[[...slug]]/page.tsx          ← no byline
├── lib/source.ts                          ← schema: pageSchema (no extend)
├── lib/shared.ts                          ← no siteAuthor
└── registry.json                          ← regenerated
components/docs-byline.tsx, tools/docs/check-frontmatter.mjs ← deleted
CHANGELOG.md (P9)                          ← the three `#### Spec 31` blocks under `### Docs` rewritten to what ships (1.6.1)
```

### 1.5 Flow: none

### 1.6 Components

#### 1.6.1 Data artifacts

- `CHANGELOG.md` (P9): spec 31 never shipped, so its blocks under `## Unreleased`, `### Docs` are corrected in place: `#### Spec 31 Guides and API copy` and `#### Spec 31 Examples copy` are deleted; `#### Spec 31 Page frame and new pages` keeps only what ships (the Introduction install snippet and demo, the "TanStack Table with shadcn/ui" guide, the permanent `/docs` redirect, the sidebar Changelog link) and loses the byline and the comparison page. A `#### Spec 32 Docs wording` block under `### Docs` says: inherited typos fixed on six pages (1.6.2).
- `apps/shadcn-table-docs/registry.json`: `pnpm -w registry:items`, committed with the content.

#### 1.6.2 Content restore (D74)

`content/docs/examples/**`, `content/docs/guides/*.mdx`, `content/docs/api/**`, status `refactor`.

- `git checkout 33f62f5e~1 -- apps/shadcn-table-docs/content/docs/examples apps/shadcn-table-docs/content/docs/guides apps/shadcn-table-docs/content/docs/api` gives the old text without `date:` lines; then `guides/tanstack-table-with-shadcn-ui.mdx` is brought back from `claude/review` without its `date:` line, and `guides/meta.json` gets the entry per 1.6.3.
- Typos fixed in the restored text, nothing else: "show how use use" in the descriptions of `examples/detail-panel.mdx:3`, `examples/lazy-detail-panel.mdx:3`, `examples/lazy-sub-rows.mdx:3` (to "showing how to use"); "should also should" in `guides/column-ordering-dnd.mdx`; "news rows" in `guides/editing.mdx`; "ect." in `guides/column-size.mdx` (the builder greps each phrase in the restored files).
- Does NOT restore `content/docs/getting-started/**` or `content/docs/meta.json`: D74 names the three folders; the getting-started pages keep their merged text.
- Does NOT reword, re-describe or re-order anything else; does NOT keep any sentence of the spec 31 copy or of the Q32 fix (`a6936758`).

#### 1.6.3 Guide order and comparison page (D72, D75)

- `content/docs/guides/meta.json`, status `refactor`: `"tanstack-table-with-shadcn-ui"` sits last in the Fundamentals group, right after `"accessibility"` and before `"---Customization Guides---"` (D72).
- `content/docs/getting-started/comparison.mdx`, status `deleted`; `content/docs/getting-started/meta.json` pages become `["introduction", "install", "usage", "agents"]` (D75).
- Does NOT write the new comparison columns (D71 is not in this epic); the file stays in git history at `7c7b2161`.

#### 1.6.4 Byline and date removal (D74)

- `components/docs-byline.tsx`, status `deleted`.
- `app/docs/[[...slug]]/page.tsx`, status `refactor`: the import (line 23) and the `<DocsByline ... />` line (81) go; nothing else in the file changes.
- `lib/source.ts`, status `refactor`: `schema: pageSchema` again; the `date` comment goes, and the `z` import when nothing else uses it.
- `lib/shared.ts`, status `refactor`: `siteAuthor` and its comment go (its only reader is the byline).
- The `date: '2026-11-10'` line leaves the five getting-started files that still carry it after 1.6.2 and 1.6.3: `grep -rln "^date:" apps/shadcn-table-docs/content` prints nothing.
- `tools/docs/check-frontmatter.mjs`, status `deleted`: the D60 rules it checks fall away (D74); nothing references it.
- Does NOT touch the JSON-LD of the docs pages (spec 25), the sitemap, the OG image route, the sidebar Changelog row.

**Stays unchanged:** `next.config.mjs`, `content/docs/meta.json`, `components/sidebar-*.tsx`, every example source under `examples/`, `test/docs-e2e/**` (spec 37 owns it).

### 1.7 Dependencies and env: none

## 2. Instructions for AI

### 2.1 Milestones

### Milestone: Docs wording restore

- Files owned: `apps/shadcn-table-docs/content/docs/**`, `apps/shadcn-table-docs/components/docs-byline.tsx`, `apps/shadcn-table-docs/app/docs/[[...slug]]/page.tsx`, `apps/shadcn-table-docs/lib/source.ts`, `apps/shadcn-table-docs/lib/shared.ts`, `apps/shadcn-table-docs/registry.json`, `tools/docs/check-frontmatter.mjs`
- Depends on: none
- Review: none
- Local CI: `pnpm test typecheck --base base`, `pnpm test lint`, `pnpm test validate-repo`, `pnpm test docs-e2e --base base`
- Task 1: Content restore, guide order, comparison page removal (1.6.2, 1.6.3). Checks: the `git diff 33f62f5e~1` line of 1.2; `grep -rn "getting-started/comparison" apps/shadcn-table-docs --include='*.mdx' --include='*.json' --include='*.tsx' --include='*.ts'` prints nothing
- Task 2: Byline, date field and script removal (1.6.4); regenerate `registry.json` (1.6.1). Checks: the `grep` line of 1.2 prints nothing; `pnpm --filter shadcn-table-docs types:check`; `pnpm --filter shadcn-table-docs lint`; `pnpm -w registry:items && git diff --exit-code apps/shadcn-table-docs/registry.json`
- Task 3: Prove the Acceptance of 1.2 on a production build served on a P6 port; record the route results and the sitemap count in the tracker; stop the server. Checks: the lines of 1.2
- Task 4: Cleanup: `pnpm format`, the changelog edits (1.6.1). Checks: 2.2

### 2.2 Checks

- `pnpm test typecheck --base base`, `pnpm test lint`, `pnpm test validate-repo` green
- `pnpm test docs-e2e --base base` green
- The diff, grep, route and registry lines of 1.2
- Review: none (a restore to text the owner knows, proven by the diff against `33f62f5e~1`; P7 untouched: `registry.json` keeps every `"name"`)
