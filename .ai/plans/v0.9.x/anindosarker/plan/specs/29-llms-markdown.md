# 29: Markdown delivery and llms.txt shape
- Epic: E10

Follow the project planning rules: docs/code-of-conduct/planning-guidelines.md, CLAUDE.md:9. Keep the expedition contract.

## 1. Architecture

### 1.1 Overview

A docs URL requested with `Accept: text/markdown` answers `content-type: text/markdown` but its `vary` header lists only the Next router keys (measured 2026-11-10): `proxy.ts:26` sets `Vary: Accept` on the rewrite, Next replaces it, so a cache may hand Markdown to a browser or HTML to an agent. `/llms.txt` starts with `# Docs` (fumadocs' `llms().index()` renders the page-tree root name) and has no summary; `/llms-full.txt` and the per-page Markdown carry raw MDX (`import` lines, `<Component />` blocks) because `lib/source.ts:28-30` renders `page.data.getText('processed')` as is. D58: the Markdown route sets `Vary: Accept` on its own response; `llms.txt` follows llmstxt.org (H1, one blockquote summary, sections of `- [title](absolute url): description`); the page renderer strips imports, JSX and frontmatter before export. The renderer is shared by `page()` (the `/llms.mdx/...` route and the "Copy page" button) and `full()`, so both deliver clean Markdown; that keeps the decided behaviour (clean Markdown for agents) rather than changing it.

### 1.2 Goals

- `curl -sI -H 'Accept: text/markdown' <docs url>` shows `vary` containing `Accept` and `content-type: text/markdown` (D58).
- `/llms.txt`: line 1 `# shadcn-table`, line 2 blank, line 3 a `> ` blockquote with the home description, then one `## <Section>` per top-level docs folder (Getting Started, API, Quick Examples, Guides, in sidebar order) with `- [<title>](<siteUrl><page.url>): <description>` per page (D58).
- `/llms-full.txt` and every `/llms.mdx/docs/<slugs>/content.md`: no line starts with `import ` or `<` followed by a capital letter; no `---` frontmatter block; headings, prose and fenced code stay (D58).
- Acceptance: programmatic. On a production build served on a P6 port with `NEXT_PUBLIC_SITE_URL=http://localhost:<port>`: `curl -sI -H 'Accept: text/markdown' localhost:<port>/docs/getting-started/introduction | grep -i '^vary:' | grep -ci accept` prints `1`; `curl -s localhost:<port>/llms.txt | sed -n '1p;3p'` prints `# shadcn-table` and a line starting with `> `; `curl -s localhost:<port>/llms.txt | grep -c '^- \[.*\](http://localhost:<port>/docs/'` prints the docs page count (103 at `claude/review` today, plus the two pages spec 31 adds if it has merged); `curl -s localhost:<port>/llms-full.txt | awk '/^```/{f=!f;next} !f' | grep -cE '^import .* from |^<[A-Z]'` prints `0` (outside code fences only: fenced code keeps its imports and JSX, the run of 2026-11-10); `curl -s localhost:<port>/llms-full.txt | grep -c '^# '` prints the page count; repo checks of 2.2 green.

### 1.3 Current structure

```
apps/shadcn-table-docs/
├── proxy.ts:20-28                        ← Accept negotiation rewrite with Vary: Accept (dropped by Next)
├── lib/source.ts:27-31                   ← docsLlms = llms(source, { renderPage: title + getText('processed') })
├── app/llms.txt/route.ts                 ← new Response(await docsLlms.index())   → "# Docs" tree
├── app/llms-full.txt/route.ts            ← new Response(await docsLlms.full())
└── app/llms.mdx/docs/[[...slug]]/route.ts ← docsLlms.page(page), Content-Type text/markdown, no Vary
```

### 1.4 Target structure

```
apps/shadcn-table-docs/
├── lib/llms.ts                           ← toPlainMarkdown(text): strips frontmatter, import lines, JSX blocks; renderLlmsIndex(): the llmstxt.org index
├── lib/source.ts                         ← renderPage uses toPlainMarkdown
├── app/llms.txt/route.ts                 ← new Response(renderLlmsIndex(), { headers: text/plain })
├── app/llms-full.txt/route.ts            ← unchanged call, text/plain header
└── app/llms.mdx/docs/[[...slug]]/route.ts ← headers gain Vary: Accept
CHANGELOG.md (P9)                         ← #### Spec 29 under ## Unreleased, ### Fixed
```

### 1.5 Flow: none

### 1.6 Components

#### 1.6.1 Data artifacts

- `CHANGELOG.md` (P9): `#### Spec 29 Markdown delivery and llms.txt shape` under `## Unreleased`, `### Fixed`: Markdown responses vary on `Accept`; `llms.txt` follows llmstxt.org; exported Markdown carries no MDX imports or components (D58).

#### 1.6.2 Plain Markdown renderer

`lib/llms.ts`, status `new`.

- `toPlainMarkdown(text)`: removes a leading `---...---` frontmatter block; removes `import ... from '...'` lines (single and multi-line); removes JSX elements whose tag starts with a capital letter, self-closing (`<Card ... />`) and paired (`<Cards>...</Cards>`, nested), together with their children when the children are only other JSX; keeps the text children of a paired element as a paragraph when they are prose (a `<Callout>` body stays as its text); removes `{/* ... */}` expressions. Fenced code blocks (```` ``` ````) are never touched: the pass skips fence interiors.
- `renderLlmsIndex()`: `# shadcn-table`, blank, `> <home description>`, blank, then for each top-level node of `source.getPageTree()` in order: `## <node name>`, one `- [<page title>](<siteUrl><page.url>): <description>` per page (depth-first, separators skipped, folder index pages first), blank line between sections. Absolute URLs on `siteUrl`.
- Does NOT render component output (an `<ExampleSnippet>` becomes nothing; the page's prose and the code block it already contains stay), does NOT change page titles or URLs.

**Interfaces:**

```typescript
export function toPlainMarkdown(text: string): string;
export function renderLlmsIndex(): string;
```

**Stays unchanged:** `content/docs/**`, `components/mdx.tsx`.

#### 1.6.3 Routes

- `lib/source.ts`, status `refactor`: `renderPage` becomes `# ${title} (${url})\n\n${toPlainMarkdown(await page.data.getText('processed'))}`.
- `app/llms.txt/route.ts`, status `refactor`: `new Response(renderLlmsIndex(), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })`.
- `app/llms-full.txt/route.ts`, status `refactor`: adds the same `Content-Type` header; the body call is unchanged.
- `app/llms.mdx/docs/[[...slug]]/route.ts`, status `refactor`: headers `{ 'Content-Type': 'text/markdown; charset=utf-8', Vary: 'Accept' }`.
- `proxy.ts`: unchanged (its `Vary` is harmless; the route's header is the one that reaches the client).

### 1.7 Dependencies and env: none

## 2. Instructions for AI

### 2.1 Milestones

### Milestone: Markdown and llms

- Files owned: `apps/shadcn-table-docs/lib/llms.ts`, `apps/shadcn-table-docs/lib/source.ts`, `apps/shadcn-table-docs/app/llms.txt/route.ts`, `apps/shadcn-table-docs/app/llms-full.txt/route.ts`, `apps/shadcn-table-docs/app/llms.mdx/docs/[[...slug]]/route.ts`
- Depends on: none
- Review: none
- Local CI: `pnpm test typecheck --base base`, `pnpm test lint`, `pnpm test validate-repo`, `pnpm test docs-e2e --base base`
- Task 1: `lib/llms.ts` (1.6.2) with a unit check: a fixture string holding frontmatter, an import, a self-closing and a paired component, a fenced block containing `<Fake />`, run through `toPlainMarkdown` by a one-off `node --experimental-strip-types` or `tsx` invocation recorded in the tracker; the fence content survives, the rest is gone. Checks: `pnpm --filter shadcn-table-docs types:check`
- Task 2: The route changes (1.6.3). Checks: `pnpm --filter shadcn-table-docs types:check`; `pnpm --filter shadcn-table-docs lint`
- Task 3: Prove the Acceptance of 1.2 on a production build served on a P6 port with `NEXT_PUBLIC_SITE_URL` set to that origin; record the counts in the tracker; stop the server. Checks: the lines of 1.2
- Task 4: Cleanup: `pnpm format`, the changelog block (1.6.1). Checks: 2.2

### 2.2 Checks

- `pnpm test typecheck --base base`, `pnpm test lint`, `pnpm test validate-repo` green
- `pnpm test docs-e2e --base base` green (the Copy page button still copies Markdown)
- The `vary`, `llms.txt` and `llms-full.txt` lines of 1.2
- Review: none (text routes; P7 untouched)
