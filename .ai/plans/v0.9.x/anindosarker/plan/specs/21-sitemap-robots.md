# 21: Sitemap and robots for the docs site

Follow the project planning rules: docs/code-of-conduct/planning-guidelines.md, CLAUDE.md:9. Keep the expedition contract.

## 1. Architecture

### 1.1 Overview

`https://www.shadcn-table.com/sitemap.xml` and `/robots.txt` both return 404 (measured 2026-11-10): `apps/shadcn-table-docs` has no `app/sitemap.ts`, `app/robots.ts` or `next-sitemap` config, so Google finds the 103 docs pages only by following links and Search Console has nothing to accept as a sitemap. D50 adds both as Next.js metadata routes; Next 16 serves `/sitemap.xml` and `/robots.txt` from them at build time. The page list comes from fumadocs, `source.getPages()` in `lib/source.ts:21`, the same list `app/llms.txt/route.ts` already reads. Absolute URLs use `siteUrl` from `lib/shared.ts:21` (`NEXT_PUBLIC_SITE_URL`, set on Vercel: the live `og:image` is absolute on `https://www.shadcn-table.com`; `http://localhost:5320` otherwise).

### 1.2 Goals

- `GET /sitemap.xml` returns 200, `application/xml`, one `<url>` per docs page plus the home page, every `<loc>` absolute on `siteUrl`, no `/dev`, `/r`, `/ingest`, `/og`, `/llms` or `/api` URL (D50).
- `GET /robots.txt` returns 200, `text/plain`: `User-Agent: *`, `Allow: /`, `Disallow: /ingest/` and `/r/`, and `Sitemap: <siteUrl>/sitemap.xml` (D50; `/dev/` is not blocked, spec 22 removes those routes, D51).
- No `lastmod`, no `changefreq`; the home entry carries `priority: 1`, the docs pages none (D50).
- Every other route and page renders as before; no dependency added (P6).
- Acceptance: programmatic. On a production build (`pnpm --filter shadcn-table-docs build`, then `NEXT_PUBLIC_SITE_URL=http://localhost:5345 next start -p 5345` in the worktree, P6 ports): `curl -s localhost:5345/sitemap.xml` parses as XML (`xmllint --noout`), its `<loc>` count equals `source.getPages().length + 1` (103 + 1 = 104 at `claude/review` today; the builder computes the number with a one-line `node` script against `.source` or by counting `content/docs/**/*.mdx`), every `<loc>` starts with `http://localhost:5345/`, `grep -cE '/(dev|r|ingest|og|llms|api)(/|$)'` on the body is 0; `curl -s localhost:5345/robots.txt` equals the text of 1.6.3 with the port's origin. Repo checks of 2.2 green.

### 1.3 Current structure

```
apps/shadcn-table-docs/
├── app/layout.tsx:15-23             ← metadataBase (siteUrl), title template, openGraph siteName, twitter card
├── app/dev/layout.tsx:7             ← robots: { index: false, follow: false } on every /dev page
├── app/llms.txt/route.ts            ← reads source.getPages() for the llms index (the page-list pattern)
├── lib/source.ts:21                 ← export const source = loader({ baseUrl: docsRoute, ... })
├── lib/shared.ts:21                 ← export const siteUrl (NEXT_PUBLIC_SITE_URL, fallback http://localhost:5320)
├── next.config.mjs                  ← rewrites /r/*, /ingest/*; redirects /docs, /docs/getting-started, two old guide URLs
└── content/docs/**/*.mdx            ← 103 pages; no index.mdx at /docs or /docs/getting-started (both are redirects)
```

No `sitemap.*`, `robots.*`, `next-sitemap.config.*` anywhere in `apps/`.

### 1.4 Target structure

```
apps/shadcn-table-docs/app/
├── sitemap.ts                       ← MetadataRoute.Sitemap: home + source.getPages()
└── robots.ts                        ← MetadataRoute.Robots: allow all, three disallows, sitemap URL
CHANGELOG.md (P9)                    ← #### Spec 21 under ## Unreleased, ### Added
```

### 1.5 Flow: none

### 1.6 Components

#### 1.6.1 Data artifacts

- `CHANGELOG.md` (P9): `#### Spec 21 Sitemap and robots for the docs site` under `## Unreleased`, `### Added`: the docs site serves `/sitemap.xml` and `/robots.txt` (D50). `## Unreleased` does not exist after 0.9.1 (`CHANGELOG.md:10` is `## 0.9.1 - 2026-11-08`): the first of specs 21 and 22 to merge adds it above `## 0.9.1`; the second appends under it (P9: both sides kept in a conflict).
- No dependency, no `package.json`, lockfile or `next.config.mjs` change. No `vercel.json`.

#### 1.6.2 Sitemap route

`app/sitemap.ts`, status `new`. Default export, `MetadataRoute.Sitemap`.

- Entry 1: `{ url: siteUrl, priority: 1 }` (the home page `app/(home)/page.tsx`).
- Then one entry per `source.getPages()` item: `{ url: \`${siteUrl}${page.url}\` }`; `page.url` is already `/docs/<slugs>` from `loader({ baseUrl: docsRoute })`.
- No `lastModified`, `changeFrequency` or `priority` on the docs entries (D50: Vercel shallow clones make git dates unreliable).
- Does NOT list `/dev/*` (noindex today, `app/dev/layout.tsx:7`; gone after spec 22), `/r/*` (registry JSON, rewrites), `/ingest/*` (PostHog proxy), `/og/*`, `/llms*`, `/SKILL.md`, `/version.txt`, `/api/*`.
- Does NOT list `/docs` or `/docs/getting-started`: they are not pages (no `index.mdx`), they redirect in `next.config.mjs`.
- Does NOT compute `lastmod` from git or frontmatter.

**Operations:**

| Operation | Status | Notes |
| --- | --- | --- |
| `default function sitemap(): MetadataRoute.Sitemap` | new | home + `source.getPages()` |

**Interfaces:**

```typescript
import type { MetadataRoute } from 'next';
import { source } from '@/lib/source';
import { siteUrl } from '@/lib/shared';

export default function sitemap(): MetadataRoute.Sitemap;
```

**Stays unchanged:** `lib/source.ts`, `lib/shared.ts`, `app/layout.tsx`, `app/llms.txt/route.ts`, `next.config.mjs`, `content/docs/**`.

#### 1.6.3 Robots route

`app/robots.ts`, status `new`. Default export, `MetadataRoute.Robots`.

```typescript
import type { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/shared';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/ingest/', '/r/'] },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
```

Rendered text, origin per environment:

```
User-Agent: *
Allow: /
Disallow: /ingest/
Disallow: /r/

Sitemap: https://www.shadcn-table.com/sitemap.xml
```

- Does NOT disallow `/dev/`: spec 22 deletes those routes (D51), and a robots block would hide a page's `noindex` from Google (D50 edit, 2026-11-10).
- Does NOT disallow `/llms*`, `/SKILL.md`, `/og/` or `/api/`: those stay crawlable as today (a future decision may change that; D50 names two paths).
- Does NOT add per-agent rules (AI crawlers) or a `host` line.

### 1.7 Dependencies and env

- `NEXT_PUBLIC_SITE_URL` (existing, `lib/shared.ts:21`): the origin of every sitemap URL and of the robots `Sitemap:` line; set on Vercel to `https://www.shadcn-table.com`, set to the `next start` origin in the local check.
- No new package.

## 2. Instructions for AI

### 2.1 Milestones

### Milestone: Sitemap and robots

- Files owned: `apps/shadcn-table-docs/app/sitemap.ts`, `apps/shadcn-table-docs/app/robots.ts`
- Depends on: none
- Review: none
- Local CI: `pnpm test typecheck --base base`, `pnpm test lint`, `pnpm test validate-repo`
- Task 1: Write `app/sitemap.ts` (1.6.2) and `app/robots.ts` (1.6.3). Checks: `pnpm --filter shadcn-table-docs types:check`; `pnpm --filter shadcn-table-docs lint`
- Task 2: Prove the Acceptance of 1.2 on a production build served on a P6 port with `NEXT_PUBLIC_SITE_URL` set to that origin; record the `<loc>` count, the page count and both `curl` outputs in the tracker; stop the server. Checks: `xmllint --noout` on the sitemap body; `<loc>` count = pages + 1; zero excluded-prefix matches; robots body equals 1.6.3
- Task 3: Cleanup: `pnpm format`, the changelog block (1.6.1). Checks: 2.2

### 2.2 Checks

- `pnpm test typecheck --base base`, `pnpm test lint`, `pnpm test validate-repo` green
- `pnpm --filter shadcn-table-docs build` green; `/sitemap.xml` and `/robots.txt` served by `next start` as in 1.2
- After the merge deploys, the owner submits `https://www.shadcn-table.com/sitemap.xml` in Search Console (not a builder step, D50)
