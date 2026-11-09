# 24: Canonical URLs and trailing-slash redirect

Follow the project planning rules: docs/code-of-conduct/planning-guidelines.md, CLAUDE.md:9. Keep the expedition contract.

## 1. Architecture

### 1.1 Overview

No page on www.shadcn-table.com carries `rel=canonical`, and every URL also answers with a trailing slash (`/docs/api/table-options/` returned 200 on 2026-11-10), so Google sees two URLs per page with no signal which one counts (D53, audit `reference/seo-audit-2026-11-10.md`). `app/layout.tsx:19` already sets `metadataBase`; `next.config.mjs` sets `skipTrailingSlashRedirect: true` for the PostHog proxy (`/ingest/e/`, `/ingest/batch/` keep their slash), which also switched off Next's default slash redirect for every page. This spec adds the canonical through the root metadata and one redirect that spares `/ingest`. It also carries E10's shared dependency milestone (P6: one `pnpm install` per epic): `zod` (spec 31's frontmatter schema), `schema-dts` (spec 25's typed JSON-LD) and `@next/bundle-analyzer` (spec 30's measurement), with the analyzer wrap in `next.config.mjs` as a ride-along of the milestone that owns that file.

### 1.2 Goals

- The head of `/` and of every docs page has exactly one `<link rel="canonical">` equal to the page's own slash-less URL on `siteUrl` (D53).
- `GET /docs/api/table-options/` (and any other path with a trailing slash outside `/ingest`) answers 308 to the slash-less path; `GET /ingest/e/` is not redirected (D53).
- `apps/shadcn-table-docs/package.json` lists `zod` (dependency), `schema-dts` and `@next/bundle-analyzer` (devDependencies); `pnpm-lock.yaml` updated by one `pnpm install`; `ANALYZE=1 pnpm --filter shadcn-table-docs build` writes the analyzer reports, a plain build does not.
- Every other route, page and header unchanged.
- Acceptance: programmatic. On a production build served on a P6 port with `NEXT_PUBLIC_SITE_URL=http://localhost:<port>`: `curl -s localhost:<port>/ | grep -o '<link rel="canonical"[^>]*>'` prints one tag with `href="http://localhost:<port>"` (Next renders the root canonical without a trailing slash; the builder records the exact form); the same on `/docs/getting-started/introduction` prints one tag with `href="http://localhost:<port>/docs/getting-started/introduction"`; `curl -s -o /dev/null -w '%{http_code} %{redirect_url}' localhost:<port>/docs/api/table-options/` prints `308 http://localhost:<port>/docs/api/table-options`; `curl -s -o /dev/null -w '%{http_code}' -X POST localhost:<port>/ingest/e/` prints no 308; repo checks of 2.2 green.

### 1.3 Current structure

```
apps/shadcn-table-docs/
├── app/layout.tsx:15-23            ← metadata: title template, description, metadataBase(siteUrl), openGraph siteName, twitter card; no alternates
├── app/docs/[[...slug]]/page.tsx:99-108 ← generateMetadata: title, description, openGraph (replaced); no alternates, so the root's is inherited
├── app/(home)/page.tsx:4-8         ← metadata: title.absolute, description; no alternates
├── next.config.mjs                 ← rewrites (/r, /ingest), skipTrailingSlashRedirect: true, redirects (/docs, two old guide URLs); no headers(), no analyzer
└── package.json                    ← no zod, schema-dts, @next/bundle-analyzer
pnpm-lock.yaml                      ← zod@4.6.7 present transitively (fumadocs-core), not linked to the docs app
```

### 1.4 Target structure

```
apps/shadcn-table-docs/
├── app/layout.tsx                  ← metadata gains alternates: { canonical: './' }
├── next.config.mjs                 ← redirects() gains the trailing-slash entry; config wrapped by withBundleAnalyzer({ enabled: process.env.ANALYZE === '1' })
└── package.json                    ← + zod, + schema-dts (dev), + @next/bundle-analyzer (dev)
pnpm-lock.yaml                      ← updated once
CHANGELOG.md (P9)                   ← #### Spec 24 under ## Unreleased, ### Fixed
```

### 1.5 Flow: none

### 1.6 Components

#### 1.6.1 Data artifacts

- `apps/shadcn-table-docs/package.json`: `"zod": "^4.6.7"` under dependencies; `"schema-dts": "^1.1.5"` and `"@next/bundle-analyzer": "16.3.8"` (the installed `next` version) under devDependencies. One `pnpm install` from the repo root; `pnpm-lock.yaml` committed with it. No other package.json changes in E10 (P6).
- `CHANGELOG.md` (P9): `#### Spec 24 Canonical URLs and trailing-slash redirect` under `## Unreleased`, `### Fixed`: every page names its canonical URL; trailing-slash URLs redirect (D53). `## Unreleased` is created above `## 0.9.2 - 2026-11-09` when no E10 spec has yet.

#### 1.6.2 Canonical (root metadata)

`app/layout.tsx`, status `refactor`.

- `metadata.alternates = { canonical: './' }`: Next resolves `./` per route against `metadataBase`, so `/` and every `/docs/...` page get their own URL (D53).
- Does NOT add `alternates` to `app/docs/[[...slug]]/page.tsx` or `app/(home)/page.tsx`: neither defines `alternates`, so the root value is inherited (Next merges metadata per key; `openGraph` is replaced in the docs page because the page defines it, `alternates` is not).
- Does NOT change title, description, openGraph or twitter (spec 27 owns the title change; it lands after this spec on the same file).

**Operations:**

| Operation | Status | Notes |
| --- | --- | --- |
| `metadata.alternates.canonical` | new | `'./'` |

**Stays unchanged:** `metadataBase`, `openGraph`, `twitter`, the layout body, `lib/shared.ts`.

#### 1.6.3 Trailing-slash redirect and analyzer wrap

`next.config.mjs`, status `refactor`.

- `redirects()` gains, first in the array: `{ source: '/:path((?!ingest).*)/', destination: '/:path', permanent: true }`. `skipTrailingSlashRedirect: true` stays (PostHog proxy paths keep their slash, D53).
- Ride-along for spec 30: `import withBundleAnalyzer from '@next/bundle-analyzer'`; `export default withBundleAnalyzer({ enabled: process.env.ANALYZE === '1' })(withMDX(config))`. A plain build is unchanged.
- Does NOT add `headers()` (spec 28), does NOT change the `/docs` redirect's `permanent` (spec 31), does NOT touch the rewrites.

**Operations:**

| Operation | Status | Notes |
| --- | --- | --- |
| trailing-slash redirect | new | 308, `/ingest` excluded |
| `withBundleAnalyzer` wrap | new | `ANALYZE=1` only |

**Stays unchanged:** `rewrites()`, `distDir`, `typescript.tsconfigPath`, the existing `redirects()` entries.

### 1.7 Dependencies and env

- `zod` ^4.6.7 (dependency; already in the lockfile through fumadocs-core, now a direct import for spec 31), `schema-dts` ^1.1.5 (dev, types only, spec 25), `@next/bundle-analyzer` 16.3.8 (dev, spec 30).
- `ANALYZE=1` enables the analyzer at build time; unset in CI and on Vercel.
- `NEXT_PUBLIC_SITE_URL` (existing) is the canonical origin.

## 2. Instructions for AI

### 2.1 Milestones

### Milestone: E10 dependencies

- Files owned: `apps/shadcn-table-docs/package.json`, `pnpm-lock.yaml`
- Depends on: none
- Review: none
- Local CI: `pnpm test typecheck --base base`, `pnpm test lint`, `pnpm test validate-repo`
- Task 1: Add the three packages (1.6.1), one `pnpm install` from the repo root, commit `package.json` and the lockfile. Checks: `pnpm ls --filter shadcn-table-docs zod schema-dts @next/bundle-analyzer` lists all three; `git status --short` shows only the two files; `pnpm --filter shadcn-table-docs types:check`

### Milestone: Canonical and slash redirect

- Files owned: `apps/shadcn-table-docs/app/layout.tsx`, `apps/shadcn-table-docs/next.config.mjs`
- Depends on: E10 dependencies
- Review: none
- Local CI: `pnpm test typecheck --base base`, `pnpm test lint`, `pnpm test validate-repo`, `pnpm test docs-e2e --base base`
- Task 1: `alternates.canonical` in the root metadata (1.6.2); the redirect entry and the analyzer wrap (1.6.3). Checks: `pnpm --filter shadcn-table-docs types:check`; `pnpm --filter shadcn-table-docs lint`
- Task 2: Prove the Acceptance of 1.2 on a production build served on a P6 port with `NEXT_PUBLIC_SITE_URL` set to that origin; record the two canonical tags, the 308 line and the `/ingest/e/` code in the tracker; stop the server. Checks: the `curl` lines of 1.2
- Task 3: Cleanup: `pnpm format`, the changelog block (1.6.1). Checks: 2.2

### 2.2 Checks

- `pnpm test typecheck --base base`, `pnpm test lint`, `pnpm test validate-repo` green
- `pnpm test docs-e2e --base base` green: every page renders as before
- Canonical tags and the 308 as in 1.2; `ANALYZE=1 pnpm --filter shadcn-table-docs build` writes `.next/analyze/*.html`, a plain build does not
- Review: none (metadata and config; P7 untouched)
