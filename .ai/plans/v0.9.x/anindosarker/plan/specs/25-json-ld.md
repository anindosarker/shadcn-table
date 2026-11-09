# 25: JSON-LD structured data
- Epic: E10

Follow the project planning rules: docs/code-of-conduct/planning-guidelines.md, CLAUDE.md:9. Keep the expedition contract.

## 1. Architecture

### 1.1 Overview

No page on www.shadcn-table.com emits JSON-LD (0 `application/ld+json` on `/`, measured 2026-11-10; schema 10/100 in `reference/seo-audit-2026-11-10.md`), so search engines get no machine-readable statement of what the site and each page are. D54 adds `WebSite` and `SoftwareSourceCode` on the home page, `TechArticle` and `BreadcrumbList` on every docs page, from the metadata the pages already carry. Breadcrumbs come from the fumadocs page tree server side (`getBreadcrumbItems` in `fumadocs-core/breadcrumb`, the same helper `components/docs-breadcrumb.tsx` uses on the client). Types come from `schema-dts` (spec 24's dependency milestone).

### 1.2 Goals

- `/` renders exactly two `<script type="application/ld+json">` elements: one `WebSite`, one `SoftwareSourceCode` (D54).
- Every docs page renders exactly two: one `TechArticle`, one `BreadcrumbList` whose items are Docs > section > page with absolute URLs (D54).
- Each script body parses as JSON; the objects are typed with `schema-dts` and compile; no `FAQPage`, no `HowTo` (D54).
- Visible rendering unchanged.
- Acceptance: programmatic. On a production build served on a P6 port with `NEXT_PUBLIC_SITE_URL=http://localhost:<port>`: `curl -s localhost:<port>/ | grep -o '<script type="application/ld+json">[^<]*' | sed 's/.*>//' | node -e 'let i="";process.stdin.on("data",d=>i+=d).on("end",()=>{const t=i.trim().split("\n").map(l=>JSON.parse(l)["@type"]);console.log(t.join(","))})'` prints `WebSite,SoftwareSourceCode`; the same on `/docs/getting-started/introduction` prints `TechArticle,BreadcrumbList`, and its `BreadcrumbList` has `itemListElement` of length 3 with `item` values `http://localhost:<port>/docs`, `.../docs/getting-started`, `.../docs/getting-started/introduction` (the section item is the folder's index URL when it has one, else the first page of the section, as the fumadocs breadcrumb resolves it; the builder records the actual value); `pnpm --filter shadcn-table-docs types:check` green with the objects typed as `WithContext<WebSite>` and friends.

### 1.3 Current structure

```
apps/shadcn-table-docs/
├── app/(home)/page.tsx                 ← metadata + <HomePage />; no JSON-LD
├── app/docs/[[...slug]]/page.tsx:23-86 ← DocsPage with breadcrumb bar, title, description, MDX; no JSON-LD
├── components/docs-breadcrumb.tsx:29   ← client breadcrumb from useTreePath + getBreadcrumbItemsFromPath
├── lib/shared.ts                       ← siteName, appName, siteUrl, gitConfig {user, repo, branch}, docsRoute
└── lib/source.ts                       ← source (loader), getPageTree()
```

### 1.4 Target structure

```
apps/shadcn-table-docs/
├── components/json-ld.tsx              ← <JsonLd data={...} />: one script tag per object
├── lib/structured-data.ts              ← builders: websiteJsonLd(), softwareSourceCodeJsonLd(), techArticleJsonLd(page), breadcrumbJsonLd(page)
├── app/(home)/page.tsx                 ← renders <JsonLd> for WebSite and SoftwareSourceCode above <HomePage />
└── app/docs/[[...slug]]/page.tsx       ← renders <JsonLd> for TechArticle and BreadcrumbList inside DocsPage
CHANGELOG.md (P9)                       ← #### Spec 25 under ## Unreleased, ### Added
```

### 1.5 Flow: none

### 1.6 Components

#### 1.6.1 Data artifacts

- `CHANGELOG.md` (P9): `#### Spec 25 JSON-LD structured data` under `## Unreleased`, `### Added`: the home page and every docs page carry Schema.org JSON-LD (D54).

#### 1.6.2 JsonLd component

`components/json-ld.tsx`, status `new`. Server component.

- Renders `<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />` for one object; the JSON is serialised with `<` escaped as `<` so a description containing a tag cannot close the script.
- Does NOT render anything visible, does NOT dedupe across calls (each page renders exactly the two objects its route names).

**Interfaces:**

```typescript
import type { Thing, WithContext } from 'schema-dts';

export function JsonLd<T extends Thing>({ data }: { data: WithContext<T> }): JSX.Element;
```

#### 1.6.3 Structured data builders

`lib/structured-data.ts`, status `new`. Pure functions over `lib/shared.ts` constants and a fumadocs page.

- `websiteJsonLd()`: `{ '@context': 'https://schema.org', '@type': 'WebSite', name: siteName, url: siteUrl }`.
- `softwareSourceCodeJsonLd()`: `@type: 'SoftwareSourceCode'`, `name: siteName`, `url: siteUrl`, `codeRepository: https://github.com/${gitConfig.user}/${gitConfig.repo}`, `programmingLanguage: 'TypeScript'`, `runtimePlatform: 'React'`, `license: 'https://opensource.org/license/mit'`, `description` passed in as an argument by `app/(home)/page.tsx`, which already holds the string (this spec does not own `lib/shared.ts`).
- `techArticleJsonLd(page)`: `@type: 'TechArticle'`, `headline: page.data.title`, `description: page.data.description`, `url: ${siteUrl}${page.url}`, `author: { '@type': 'Organization', name: siteName, url: siteUrl }`, `publisher` the same organization, `image: ${siteUrl}${getPageImageUrl(page).url}`.
- `breadcrumbJsonLd(page)`: `@type: 'BreadcrumbList'`, `itemListElement` from `[{ name: 'Docs', url: docsRoute }, ...getBreadcrumbItems(page.url, source.getPageTree(), { includePage: true })]`, each `{ '@type': 'ListItem', position: i + 1, name, item: ${siteUrl}${url} }`; an item without a URL (a folder with no index) takes the URL of its first page, as `components/docs-breadcrumb.tsx` renders it.
- Does NOT emit `FAQPage`, `HowTo`, `dateModified` (spec 31 adds frontmatter dates later; it may extend `techArticleJsonLd` then).

**Interfaces:**

```typescript
import type { BreadcrumbList, SoftwareSourceCode, TechArticle, WebSite, WithContext } from 'schema-dts';
import type { InferPageType } from 'fumadocs-core/source';
import type { source } from '@/lib/source';

type DocsPage = InferPageType<typeof source>;

export function websiteJsonLd(): WithContext<WebSite>;
export function softwareSourceCodeJsonLd(description: string): WithContext<SoftwareSourceCode>;
export function techArticleJsonLd(page: DocsPage): WithContext<TechArticle>;
export function breadcrumbJsonLd(page: DocsPage): WithContext<BreadcrumbList>;
```

**Stays unchanged:** `lib/shared.ts`, `lib/source.ts`, `components/docs-breadcrumb.tsx`.

#### 1.6.4 Page wiring

- `app/(home)/page.tsx`, status `refactor`: the description string becomes a module constant used by both `metadata.description` and `softwareSourceCodeJsonLd(description)`; the component returns a fragment: `<JsonLd data={websiteJsonLd()} />`, `<JsonLd data={softwareSourceCodeJsonLd(description)} />`, `<HomePage />`. The `title` line is untouched here (spec 27 removes it; this spec lands first on the file).
- `app/docs/[[...slug]]/page.tsx`, status `refactor`: inside `<DocsPage>`, before the bar: `<JsonLd data={techArticleJsonLd(page)} />` and `<JsonLd data={breadcrumbJsonLd(page)} />`. `generateMetadata` unchanged.

**Stays unchanged:** the rendered DOM apart from the two script elements per page; `generateStaticParams`.

### 1.7 Dependencies and env

- `schema-dts` (dev, types only), added by spec 24's E10 dependencies milestone; `NEXT_PUBLIC_SITE_URL` (existing) for absolute URLs.

## 2. Instructions for AI

### 2.1 Milestones

### Milestone: JSON-LD

- Files owned: `apps/shadcn-table-docs/components/json-ld.tsx`, `apps/shadcn-table-docs/lib/structured-data.ts`, `apps/shadcn-table-docs/app/(home)/page.tsx`, `apps/shadcn-table-docs/app/docs/[[...slug]]/page.tsx`
- Depends on: 24
- Review: none
- Local CI: `pnpm test typecheck --base base`, `pnpm test lint`, `pnpm test validate-repo`, `pnpm test docs-e2e --base base`
- Task 1: `components/json-ld.tsx` and `lib/structured-data.ts` (1.6.2, 1.6.3). Checks: `pnpm --filter shadcn-table-docs types:check`
- Task 2: Wire both pages (1.6.4). Checks: `pnpm --filter shadcn-table-docs types:check`; `pnpm --filter shadcn-table-docs lint`
- Task 3: Prove the Acceptance of 1.2 on a production build served on a P6 port with `NEXT_PUBLIC_SITE_URL` set to that origin; record the two type lists and the breadcrumb items in the tracker; stop the server. Checks: the lines of 1.2
- Task 4: Cleanup: `pnpm format`, the changelog block (1.6.1). Checks: 2.2

### 2.2 Checks

- `pnpm test typecheck --base base`, `pnpm test lint`, `pnpm test validate-repo` green
- `pnpm test docs-e2e --base base` green: pages render as before
- Type lists and breadcrumb items as in 1.2; after the deploy, Google's Rich Results test on `/` and one docs page reports no errors (owner-side, D54)
- Review: none (additive metadata; P7 untouched)
