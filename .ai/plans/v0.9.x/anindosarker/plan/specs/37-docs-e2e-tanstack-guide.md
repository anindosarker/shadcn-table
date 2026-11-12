# 37: Docs e2e check for the TanStack guide
- Epic: E11

Follow the project planning rules: docs/code-of-conduct/planning-guidelines.md, CLAUDE.md:9. Keep the expedition contract.

## 1. Architecture

### 1.1 Overview

Spec 31 added the guide `/docs/guides/tanstack-table-with-shadcn-ui` and expected `pnpm test docs-e2e` to prove it, but no milestone owned `test/docs-e2e`, so the page was proven by curl and the generic route run only (Q31). D65 gives it a named check. The byline check D65 first asked for is gone with the byline (D74), and the comparison page is out of 0.9.3 (D75), so its check comes with D71 in a later epic: this spec covers the one guide.

### 1.2 Goals

- `pnpm test docs-e2e --base base` runs named checks for `/docs/guides/tanstack-table-with-shadcn-ui`: the page title and its first section heading (D65).
- The run summary counts the new checks (D65).
- Acceptance: programmatic. `pnpm test docs-e2e --base base --section guides` (the flag form the suite accepts; the builder uses the suite's own way to run one section) passes and its record in `test/.out/docs-e2e-base.json` lists the new check names under `/docs/guides/tanstack-table-with-shadcn-ui`; the full `pnpm test docs-e2e --base base` is green with a pass count higher than the count on `claude/review` before the change by the number of checks added (both counts in the tracker). With the guide's H1 text changed locally, the title check fails; the change is reverted (recorded in the tracker).

### 1.3 Current structure

```
test/docs-e2e/lib/guides.mjs               ← one entry per guide route: '/docs/guides/<slug>': async ({ page, check }) => { check('<name>', <boolean>) ... } (for example :340-344 best-practices)
test/docs-e2e/lib/helpers.mjs              ← count(page, selector) and the shared helpers
apps/shadcn-table-docs/content/docs/guides/tanstack-table-with-shadcn-ui.mdx ← title 'TanStack Table with shadcn/ui'; first section '## What TanStack Table gives you'
```

No entry for the guide exists in `guides.mjs`; the route run still loads it (render, hydration, console).

### 1.4 Target structure

```
test/docs-e2e/lib/guides.mjs               ← new entry '/docs/guides/tanstack-table-with-shadcn-ui' with the checks of 1.6.1, placed with the Fundamentals guides
```

### 1.5 Flow: none

### 1.6 Components

#### 1.6.1 Guide checks (D65)

`test/docs-e2e/lib/guides.mjs`, status `refactor`.

- `check('title', ...)`: the article's H1 reads `TanStack Table with shadcn/ui`.
- `check('first section', ...)`: an H2 with the text `What TanStack Table gives you` exists in the article.
- `check('headings', ...)`: the article has at least 3 `h2`/`h3` headings, the form the neighbouring guides use.
- Written with the helpers the file already imports; no new helper unless two checks need the same code.
- Does NOT add a comparison page check (D71, later), a byline check (D74), or any check on other routes.

**Stays unchanged:** `test/docs-e2e/run.mjs`, `test.mjs`, the other `lib/*.mjs` files, every docs page.

### 1.7 Dependencies and env: none

## 2. Instructions for AI

### 2.1 Milestones

### Milestone: Docs e2e TanStack guide

- Files owned: `test/docs-e2e/lib/guides.mjs`
- Depends on: 32
- Review: none
- Local CI: `pnpm test lint`, `pnpm test docs-e2e --base base`
- Task 1: Record the pass count of `pnpm test docs-e2e --base base` on the branch before the change. Checks: the count is in the tracker
- Task 2: The entry and its checks (1.6.1). Checks: `pnpm test lint`; the section run of 1.2 lists the new check names
- Task 3: Prove the Acceptance of 1.2: the full run's count, the failing case with the H1 changed, the revert. Checks: the lines of 1.2; `git status --short` prints nothing
- Task 4: Cleanup: `pnpm format`. Checks: 2.2

### 2.2 Checks

- `pnpm test lint` green
- `pnpm test docs-e2e --base base` green with the new checks counted
- The failing case of 1.2 recorded
- Review: none (test-only; no changelog block, the docs site does not change)
