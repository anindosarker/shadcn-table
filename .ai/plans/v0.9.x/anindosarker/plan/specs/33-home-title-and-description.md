# 33: Home title, hero line and one shared site description
- Epic: E11

Follow the project planning rules: docs/code-of-conduct/planning-guidelines.md, CLAUDE.md:9. Keep the expedition contract.

## 1. Architecture

### 1.1 Overview

Spec 27 (D56) gave the home page the title `shadcn-table: data table for shadcn/ui, built on TanStack Table` (63 characters) and the eyebrow "The batteries-included data table for shadcn/ui."; the owner found both too technical. Search Console shows the home page earning its impressions on "shadcn table" (54 of 85 in 28 days, position 6.2), and the titles and descriptions of the ranking pages lean on "react", "data table", "shadcn/ui" and "TanStack"; "production-ready" and "batteries" appear in none (D73). D73 sets a brand-first title with those words, a new hero line and a new description. The description is typed four times today (root layout, home page, OG image, `llms.txt` summary); D76 puts it in one exported constant so the four cannot drift. Both decisions edit the same lines, so they are one milestone. Spec 27 is merged and not released: this patches forward.

### 1.2 Goals

- `<title>` and `og:title` of `/` are `shadcn-table: React Data Table for shadcn/ui and TanStack` (57 characters); a docs page title still ends in ` | shadcn-table` (D73).
- The H1 stays `shadcn-table`; the hero line above it reads `The open-source React data table for shadcn/ui, built on TanStack Table.` (D73).
- The meta description, `og:description` and `twitter:description` of `/` read `Open-source React data table for shadcn/ui, built on TanStack Table. Sorting, filtering, pagination, grouping, pinning. Installs as source via shadcn CLI.` (D73).
- That sentence exists once in the source, as `siteDescription` in `lib/shared.ts`; the root layout metadata, the home page metadata and JSON-LD, the OG image and the `llms.txt` summary read it (D76).
- Acceptance: programmatic. On a production build served on a P6 port (`NEXT_PUBLIC_SITE_URL` set to that origin): `curl -s localhost:<port>/ | grep -oE '<title>[^<]*</title>|(og:title|og:description|twitter:description)" content="[^"]*"|name="description" content="[^"]*"'` prints the title and the description strings of 1.2 exactly; `curl -s localhost:<port>/ | grep -c 'The open-source React data table for'` prints at least 1; `curl -s localhost:<port>/docs/getting-started/introduction | grep -o '<title>[^<]*</title>'` prints `<title>Introduction | shadcn-table</title>`; `curl -s localhost:<port>/llms.txt | sed -n 3p` is the blockquote line with the description; `curl -s localhost:<port>/ | grep -o '"description":"[^"]*"' | head -1` (the SoftwareSourceCode JSON-LD) carries the description. `grep -rn "Open-source React data table for shadcn/ui, built on TanStack Table. Sorting" apps/shadcn-table-docs --include='*.ts' --include='*.tsx' --exclude-dir='.next*' --exclude-dir=node_modules | wc -l` prints 1; `grep -rn "production-ready table library" apps/shadcn-table-docs/app apps/shadcn-table-docs/lib` prints nothing. `pnpm test docs-e2e --base base` green.

### 1.3 Current structure

```
apps/shadcn-table-docs/
├── app/layout.tsx:16-17                   ← siteTitle = 'shadcn-table: data table for shadcn/ui, built on TanStack Table'
├── app/layout.tsx:21-22                   ← description: 'A production-ready table library built with TanStack Table and shadcn/ui. ...'
├── app/(home)/page.tsx:6-7,10,17          ← const description (same sentence), metadata.description, softwareSourceCodeJsonLd(description)
├── app/opengraph-image.tsx:11-12          ← const homeDescription (same sentence), drawn on the card
├── lib/llms.ts:6-7                        ← const siteSummary (same sentence), the llms.txt blockquote
├── components/dev-home/v12/home-page.tsx:35-38 ← eyebrow "// The batteries-included data table for shadcn/ui."
├── components/dev-home/v12/home-page.tsx:39-41 ← H1 "shadcn-table"; :42-47 the pitch paragraph (its own JSX text)
└── lib/shared.ts:3-5                      ← appName, siteName
```

`test/docs-e2e/lib/getting-started.mjs:874-877` checks the home H1 against `/shadcn\s*-?\s*table/i`; no docs E2E check reads the eyebrow, the title or the description.

### 1.4 Target structure

```
apps/shadcn-table-docs/
├── lib/shared.ts                          ← export const siteDescription = '<the D73 description>'
├── app/layout.tsx                         ← siteTitle = 'shadcn-table: React Data Table for shadcn/ui and TanStack'; description: siteDescription
├── app/(home)/page.tsx                    ← metadata.description and the JSON-LD read siteDescription; no local const
├── app/opengraph-image.tsx                ← draws siteDescription; no local const
├── lib/llms.ts                            ← the summary is siteDescription; no local const
└── components/dev-home/v12/home-page.tsx  ← eyebrow "// The open-source React data table for shadcn/ui, built on TanStack Table."
CHANGELOG.md (P9)                          ← the `#### Spec 27` block under `### Changed` rewritten to the shipped title; `#### Spec 33` under `### Changed`
```

### 1.5 Flow: none

### 1.6 Components

#### 1.6.1 Data artifacts

- `CHANGELOG.md` (P9): the `#### Spec 27 Home title and hero tagline name the category` block (never released) is replaced by `#### Spec 33 Home title, hero line and description` under `## Unreleased`, `### Changed`: the home title is "shadcn-table: React Data Table for shadcn/ui and TanStack", the hero line and the search description name the category (D73); one shared description (D76).

#### 1.6.2 Shared description (D76)

`lib/shared.ts`, status `refactor`.

- `export const siteDescription` with the exact D73 sentence and a one-line comment naming its four readers.
- `app/layout.tsx`, `app/(home)/page.tsx`, `app/opengraph-image.tsx`, `lib/llms.ts`: each drops its own copy and imports `siteDescription`. `app/(home)/page.tsx` keeps `metadata.description` (it sets `og:description` for the page) and passes `siteDescription` to `softwareSourceCodeJsonLd`.
- Does NOT change `lib/structured-data.ts` (it already takes the description as an argument), the OG card's layout or fonts, the `llms.txt` structure (spec 29).

#### 1.6.3 Title (D73)

`app/layout.tsx`, status `refactor`.

- `siteTitle` becomes `shadcn-table: React Data Table for shadcn/ui and TanStack`; its comment cites D73.
- Does NOT change the template `%s | ${siteName}`, `metadataBase`, `alternates`, `openGraph`, `twitter`.

#### 1.6.4 Hero line (D73)

`components/dev-home/v12/home-page.tsx`, status `refactor`.

- The eyebrow text (lines 36-37) becomes `The open-source React data table for shadcn/ui, built on TanStack Table.`; the `//` marker span stays.
- Does NOT change the H1, the pitch paragraph (lines 42-47), the CTA or any class.

**Stays unchanged:** `lib/structured-data.ts`, `components/json-ld.tsx`, every other home component, `test/docs-e2e/**`.

### 1.7 Dependencies and env: none

## 2. Instructions for AI

### 2.1 Milestones

### Milestone: Home title and description

- Files owned: `apps/shadcn-table-docs/lib/shared.ts`, `apps/shadcn-table-docs/app/layout.tsx`, `apps/shadcn-table-docs/app/(home)/page.tsx`, `apps/shadcn-table-docs/app/opengraph-image.tsx`, `apps/shadcn-table-docs/lib/llms.ts`, `apps/shadcn-table-docs/components/dev-home/v12/home-page.tsx`
- Depends on: 32
- Review: none
- Local CI: `pnpm test typecheck --base base`, `pnpm test lint`, `pnpm test validate-repo`, `pnpm test docs-e2e --base base`
- Task 1: The shared constant and its four readers (1.6.2), the title (1.6.3), the hero line (1.6.4). Checks: `pnpm --filter shadcn-table-docs types:check`; `pnpm --filter shadcn-table-docs lint`; the two source `grep` lines of 1.2
- Task 2: Prove the Acceptance of 1.2 on a production build served on a P6 port; record the printed tags, the `llms.txt` line and the JSON-LD description in the tracker; open `/opengraph-image` once and record that the card shows the new description; stop the server. Checks: the lines of 1.2
- Task 3: Cleanup: `pnpm format`, the changelog block (1.6.1). Checks: 2.2

### 2.2 Checks

- `pnpm test typecheck --base base`, `pnpm test lint`, `pnpm test validate-repo` green
- `pnpm test docs-e2e --base base` green (home H1 check at `test/docs-e2e/lib/getting-started.mjs:874`)
- The tag, `llms.txt`, JSON-LD and grep lines of 1.2
- Review: none (three strings the owner approved verbatim and one constant; P7 untouched)
