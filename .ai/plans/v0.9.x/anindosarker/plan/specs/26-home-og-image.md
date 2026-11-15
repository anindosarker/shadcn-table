# 26: Home page Open Graph image
- Epic: E10

Follow the project planning rules: docs/code-of-conduct/planning-guidelines.md, CLAUDE.md:9. Keep the expedition contract.

## 1. Architecture

### 1.1 Overview

`/` declares `twitter:card summary_large_image` (`app/layout.tsx:22`) but no `og:image` (measured 2026-11-10; `/opengraph-image` 404), so a shared link to the site shows no preview card. Docs pages already have one: `app/og/docs/[...slug]/route.tsx` renders `generateOGImage` from `fumadocs-ui/og` with the page title, description and `appName`. D55 adds `app/opengraph-image.tsx`, the Next.js file convention that adds `og:image` and `twitter:image` to the root route automatically, rendering the same way with the site name and the home description.

### 1.2 Goals

- The head of `/` has `og:image` and `twitter:image` whose URL is on `siteUrl` and ends in `/opengraph-image` (plus Next's cache query), and the URL returns 200 `image/png` 1200x630 (D55).
- Docs pages keep their `/og/docs/<slugs>/image.png` images (D55).
- Acceptance: programmatic. On a production build served on a P6 port with `NEXT_PUBLIC_SITE_URL=http://localhost:<port>`: `curl -s localhost:<port>/ | grep -oE '<meta (property="og:image"|name="twitter:image") content="[^"]*"'` prints two tags whose `content` starts with `http://localhost:<port>/opengraph-image`; `curl -s -o /tmp/og.png -w '%{http_code} %{content_type}' "<that url>"` prints `200 image/png`; `python3 -c "import struct;d=open('/tmp/og.png','rb').read(24);print(struct.unpack('>II',d[16:24]))"` prints `(1200, 630)`; `curl -s localhost:<port>/docs/getting-started/introduction | grep -o 'og:image" content="[^"]*"'` still names `/og/docs/getting-started/introduction/image.png`.

### 1.3 Current structure

```
apps/shadcn-table-docs/
├── app/layout.tsx:21-22                 ← openGraph { siteName, type: 'website' }, twitter { card: 'summary_large_image' }; no images
├── app/(home)/page.tsx:4-8              ← metadata title, description; no images
└── app/og/docs/[...slug]/route.tsx      ← generateOGImage({ title, description, site: appName }) per docs page
```

### 1.4 Target structure

```
apps/shadcn-table-docs/app/
└── opengraph-image.tsx                  ← size, contentType, alt; default export renders generateOGImage for the site
CHANGELOG.md (P9)                        ← #### Spec 26 under ## Unreleased, ### Added
```

### 1.5 Flow: none

### 1.6 Components

#### 1.6.1 Data artifacts

- `CHANGELOG.md` (P9): `#### Spec 26 Home page Open Graph image` under `## Unreleased`, `### Added`: the home page has a social preview image (D55).

#### 1.6.2 Root opengraph-image

`app/opengraph-image.tsx`, status `new`. Next.js metadata file convention; static at build (`export const dynamic = 'force-static'` or `revalidate = false`, as the docs OG route does).

- Exports `size = { width: 1200, height: 630 }`, `contentType = 'image/png'`, `alt = siteName`.
- Default export returns `generateOGImage({ title: siteName, description: <the home description string>, site: appName })` from `fumadocs-ui/og`, the renderer of `app/og/docs/[...slug]/route.tsx`, so the home card matches the docs cards.
- The description string is the one in `app/(home)/page.tsx:6-7`; this spec does not own that file (spec 25 refactors it), so the string is repeated here as a module constant with a comment naming its source.
- Does NOT change `app/layout.tsx` or `app/(home)/page.tsx` metadata: Next adds `openGraph.images` and `twitter.images` to the root route from the file.
- Does NOT add a static PNG under `public/`.

**Operations:**

| Operation | Status | Notes |
| --- | --- | --- |
| `default function Image()` | new | `generateOGImage` |
| `size`, `contentType`, `alt` | new | 1200x630 PNG |

**Stays unchanged:** `app/og/docs/[...slug]/route.tsx`, `app/layout.tsx`, `app/(home)/page.tsx`, `lib/shared.ts`.

### 1.7 Dependencies and env: none (`fumadocs-ui/og` already installed; `NEXT_PUBLIC_SITE_URL` for the absolute URL)

## 2. Instructions for AI

### 2.1 Milestones

### Milestone: Home OG image

- Files owned: `apps/shadcn-table-docs/app/opengraph-image.tsx`
- Depends on: none
- Review: none
- Local CI: `pnpm test typecheck --base base`, `pnpm test lint`, `pnpm test validate-repo`
- Task 1: Write `app/opengraph-image.tsx` (1.6.2). Checks: `pnpm --filter shadcn-table-docs types:check`; `pnpm --filter shadcn-table-docs lint`
- Task 2: Prove the Acceptance of 1.2 on a production build served on a P6 port with `NEXT_PUBLIC_SITE_URL` set to that origin; record the two tags, the status line and the dimensions in the tracker; stop the server. Checks: the lines of 1.2
- Task 3: Cleanup: `pnpm format`, the changelog block (1.6.1). Checks: 2.2

### 2.2 Checks

- `pnpm test typecheck --base base`, `pnpm test lint`, `pnpm test validate-repo` green
- `pnpm --filter shadcn-table-docs build` green; the tags, status and dimensions of 1.2
- Review: none (one additive file; P7 untouched)
