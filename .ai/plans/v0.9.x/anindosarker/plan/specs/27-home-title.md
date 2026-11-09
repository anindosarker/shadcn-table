# 27: Home title and hero tagline name the category
- Epic: E10

Follow the project planning rules: docs/code-of-conduct/planning-guidelines.md, CLAUDE.md:9. Keep the expedition contract.

## 1. Architecture

### 1.1 Overview

The home page `<title>`, `og:title` and H1 are the bare word "shadcn-table" and the searched phrases ("shadcn data table", "tanstack table shadcn") appear nowhere on the site (audit 2026-11-10, on-page 56/100), so the page competes only for its own name. D56: the root `title.default` becomes `shadcn-table: data table for shadcn/ui, built on TanStack Table`, the docs template `%s | shadcn-table` stays, the H1 stays "shadcn-table", and the hero eyebrow carries "data table for shadcn/ui" once. Today `app/(home)/page.tsx:5` overrides the root default with `title: { absolute: 'shadcn-table' }`; removing that line lets the home page take the new default. `app/layout.tsx` is also edited by spec 24 (canonical) and `app/(home)/page.tsx` by spec 25 (JSON-LD); this spec lands after both on those files.

### 1.2 Goals

- `<title>` and `og:title` of `/` are `shadcn-table: data table for shadcn/ui, built on TanStack Table` (D56).
- A docs page title still ends in ` | shadcn-table` (D56).
- The H1 text stays `shadcn-table`; the hero eyebrow reads `The batteries-included data table for shadcn/ui.` (the phrase "data table for shadcn/ui" once on the page) (D56).
- `pnpm test docs-e2e --base base` green: its home check accepts the H1 (`test/docs-e2e/lib/getting-started.mjs:874-877` matches `/shadcn\s*-?\s*table/i`).
- Acceptance: programmatic. On a production build served on a P6 port: `curl -s localhost:<port>/ | grep -oE '<title>[^<]*</title>|og:title" content="[^"]*"'` prints both with the new string; `curl -s localhost:<port>/docs/getting-started/introduction | grep -o '<title>[^<]*</title>'` prints `<title>Introduction | shadcn-table</title>`; `curl -s localhost:<port>/ | grep -c 'data table for shadcn/ui'` prints `2` (the title and the eyebrow; the builder records the count and explains any difference, for example the `og:title` duplicate making it 3); `pnpm test docs-e2e --base base` green.

### 1.3 Current structure

```
apps/shadcn-table-docs/
├── app/layout.tsx:16                      ← title: { default: siteName, template: `%s | ${siteName}` }
├── app/(home)/page.tsx:5                  ← title: { absolute: 'shadcn-table' }  (overrides the default)
└── components/dev-home/v12/home-page.tsx:34-36 ← eyebrow "The batteries-included table for shadcn/ui."; :37-39 H1 "shadcn-table"; :40-44 pitch paragraph
```

### 1.4 Target structure

```
apps/shadcn-table-docs/
├── app/layout.tsx                         ← title: { default: 'shadcn-table: data table for shadcn/ui, built on TanStack Table', template: `%s | ${siteName}` }
├── app/(home)/page.tsx                    ← no title key (inherits the default); description and JSON-LD as spec 25 left them
└── components/dev-home/v12/home-page.tsx  ← eyebrow "The batteries-included data table for shadcn/ui."
CHANGELOG.md (P9)                          ← #### Spec 27 under ## Unreleased, ### Changed
```

### 1.5 Flow: none

### 1.6 Components

#### 1.6.1 Data artifacts

- `CHANGELOG.md` (P9): `#### Spec 27 Home title and hero tagline name the category` under `## Unreleased`, `### Changed`: the home title names the category; the hero eyebrow says "data table for shadcn/ui" (D56).

#### 1.6.2 Root title default

`app/layout.tsx`, status `refactor`.

- `title.default` becomes the literal `shadcn-table: data table for shadcn/ui, built on TanStack Table` (a `siteTitle` constant next to `metadata`, or inline; `siteName` stays `shadcn-table` for the template and `og:site_name`).
- Does NOT change the template, `description`, `metadataBase`, `alternates` (spec 24), `openGraph`, `twitter`.

#### 1.6.3 Home page title override removed

`app/(home)/page.tsx`, status `refactor`.

- The `title: { absolute: 'shadcn-table' }` line goes; the page inherits the root default. `description` and the JSON-LD rendering (spec 25) stay.
- Does NOT add `openGraph.title`: Next derives `og:title` from the page title.

#### 1.6.4 Hero eyebrow

`components/dev-home/v12/home-page.tsx`, status `refactor`.

- Line 35 text becomes `The batteries-included data table for shadcn/ui.`; the `//` marker span stays.
- Does NOT change the H1 (lines 37-39), the pitch paragraph (40-44), the CTA, any class.

**Stays unchanged:** every other home component; `lib/shared.ts` (`siteName`, `appName`).

### 1.7 Dependencies and env: none

## 2. Instructions for AI

### 2.1 Milestones

### Milestone: Home title

- Files owned: `apps/shadcn-table-docs/app/layout.tsx`, `apps/shadcn-table-docs/app/(home)/page.tsx`, `apps/shadcn-table-docs/components/dev-home/v12/home-page.tsx`
- Depends on: 24, 25
- Review: none
- Local CI: `pnpm test typecheck --base base`, `pnpm test lint`, `pnpm test validate-repo`, `pnpm test docs-e2e --base base`
- Task 1: The three edits of 1.6.2 to 1.6.4. Checks: `pnpm --filter shadcn-table-docs types:check`; `pnpm --filter shadcn-table-docs lint`
- Task 2: Prove the Acceptance of 1.2 on a production build served on a P6 port; record the title tags and the phrase count in the tracker; stop the server. Checks: the lines of 1.2
- Task 3: Cleanup: `pnpm format`, the changelog block (1.6.1). Checks: 2.2

### 2.2 Checks

- `pnpm test typecheck --base base`, `pnpm test lint`, `pnpm test validate-repo` green
- `pnpm test docs-e2e --base base` green (home H1 check at `test/docs-e2e/lib/getting-started.mjs:874`)
- Title tags and the phrase count of 1.2
- Review: none (two strings and one deleted line; P7 untouched)
