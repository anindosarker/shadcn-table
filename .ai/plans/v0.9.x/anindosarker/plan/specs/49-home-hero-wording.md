# 49: Home hero line and sentence carry the search words

Follow the project planning rules: docs/code-of-conduct/planning-guidelines.md, CLAUDE.md:9. Keep the expedition contract.

## 1. Architecture

### 1.1 Overview

The owner disliked that the big home heading is only the name (Q72). After the SEO research in session "v0.9.x heading" the owner chose to keep the heading and move the search words into the two lines around it. D90 amends D73 (live in 0.9.3): the h1 stays `shadcn-table`; the line above it and the sentence below it change. The title tag and the meta description of D73 do not change.

### 1.2 Goals

- The h1 stays `shadcn-table` (D90).
- The line above it reads `The open-source shadcn data table for React, built on TanStack Table.` (D90).
- The sentence below it reads `A production-ready data table library built with TanStack Table and shadcn/ui. Sorting, filtering, pagination, grouping, pinning, virtualization, and more, all built in.` (D90).
- `<title>`, the meta description, `og:` and `twitter:` tags of `/` are unchanged (D90).
- Acceptance: programmatic. On a production build served on a P6 port (`NEXT_PUBLIC_SITE_URL` set to that origin), with tags stripped from the hero (`curl -s localhost:<port>/ | sed -e 's/<[^>]*>//g' -e 's/&#x27;/'"'"'/g'`): the output contains `The open-source shadcn data table for React, built on TanStack Table.` and `A production-ready data table library built with TanStack Table and shadcn/ui. Sorting, filtering, pagination, grouping, pinning, virtualization, and more, all built in.` exactly (whitespace collapsed), and does not contain `The open-source React data table for` or `A production-ready table library`; `curl -s localhost:<port>/ | grep -o '<title>[^<]*</title>'` prints `<title>shadcn-table: React Data Table for shadcn/ui and TanStack</title>`; `git diff origin/claude/review -- apps/shadcn-table-docs/lib/shared.ts apps/shadcn-table-docs/app/layout.tsx` prints nothing; `pnpm test docs-e2e --base base` green.

### 1.3 Current structure

```
apps/shadcn-table-docs/components/dev-home/v12/home-page.tsx:35-38 ← eyebrow: <span>{'//'}</span> The open-source React data table for shadcn/ui, built on TanStack Table.
apps/shadcn-table-docs/components/dev-home/v12/home-page.tsx:39-41 ← <h1 id="v12-title" className="v4-display v12-h1">shadcn<span className="v7-wordmark-dash">-</span>table</h1>
apps/shadcn-table-docs/components/dev-home/v12/home-page.tsx:42-47 ← pitch: A production-ready table library built with <span className="v12-accent">TanStack Table</span> and <span className="v12-accent">shadcn/ui</span>. Sorting, filtering, grouping, pinning, virtualization, and more, all built in.
apps/shadcn-table-docs/lib/shared.ts:10                            ← siteDescription (D76): not the pitch, not changed
apps/shadcn-table-docs/app/layout.tsx:16                           ← siteTitle (D73): not changed
test/docs-e2e/lib/getting-started.mjs:874-877                      ← checks the home h1 against /shadcn\s*-?\s*table/i; no check reads the eyebrow or the pitch
```

### 1.4 Target structure

```
components/dev-home/v12/home-page.tsx   ← the eyebrow text and the pitch text of 1.2; markup and classes unchanged
CHANGELOG.md (P9)                       ← #### Spec 49 under ### Changed
```

### 1.5 Flow: none

### 1.6 Components

#### 1.6.1 Data artifacts

- `CHANGELOG.md` (P9): `#### Spec 49 Home hero wording` under `## Unreleased`, `### Changed`: the home hero line and sentence name the shadcn data table and the data table library (D90).

#### 1.6.2 Hero text (D90)

`components/dev-home/v12/home-page.tsx`, status `refactor`.

- The eyebrow text after the `//` span becomes `The open-source shadcn data table for React, built on TanStack Table.`
- The pitch becomes `A production-ready data table library built with TanStack Table and shadcn/ui. Sorting, filtering, pagination, grouping, pinning, virtualization, and more, all built in.`; `TanStack Table` and `shadcn/ui` keep their `v12-accent` spans.
- Does NOT change the h1, any class, the agent bar, the CTA, `siteDescription`, the title, the OG image or `llms.txt`.

**Stays unchanged:** every other file.

### 1.7 Dependencies and env: none

## 2. Instructions for AI

### 2.1 Milestones

### Milestone: Home hero wording

- Files owned: `apps/shadcn-table-docs/components/dev-home/v12/home-page.tsx`
- Depends on: none
- Review: none
- Local CI: `pnpm test typecheck --base base`, `pnpm test lint`, `pnpm test validate-repo`, `pnpm test docs-e2e --base base`
- Task 1: The two texts (1.6.2). Checks: `pnpm --filter shadcn-table-docs types:check`; `pnpm --filter shadcn-table-docs lint`
- Task 2: Prove the Acceptance of 1.2 on a production build on a P6 port; one screenshot of the hero at 1280 px and one at 390 px (paths in the tracker: the eyebrow and the pitch wrap without overflow); stop the server. Checks: the lines of 1.2
- Task 3: `pnpm format`, the changelog block. Checks: 2.2

### 2.2 Checks

- The Local CI lines green; the Acceptance lines of 1.2; the two screenshots
- Review: none (two strings the owner picked verbatim; P7 untouched)
