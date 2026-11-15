# 28: Security response headers
- Epic: E10

Follow the project planning rules: docs/code-of-conduct/planning-guidelines.md, CLAUDE.md:9. Keep the expedition contract.

## 1. Architecture

### 1.1 Overview

The live site sends only `strict-transport-security` (measured 2026-11-10); `next.config.mjs` has no `headers()`. D57 adds four headers on every path through `headers()`: `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`, `Permissions-Policy`. No `Content-Security-Policy` (it needs nonces for Next inline scripts, PostHog and fonts; its own decision when wanted). The two-hop `http://shadcn-table.com` redirect is Vercel's standard behaviour and stays. `next.config.mjs` is also edited by spec 24 (redirect, analyzer wrap) and spec 31 (`/docs` redirect); this spec lands after 24 and before 31 on that file.

### 1.2 Goals

- Every response (`/`, a docs page, `/sitemap.xml`, `/r/base/registry.json`, `/ingest/*`) carries `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: SAMEORIGIN`, `Permissions-Policy: camera=(), microphone=(), geolocation=()` (D57).
- The PostHog proxy (`/ingest/*` rewrite) and the registry JSON (`/r/*`) still work: the headers add to the response, nothing else changes (D57).
- No `Content-Security-Policy` header (D57).
- Acceptance: programmatic. On a production build served on a P6 port: for each of `/`, `/docs/getting-started/introduction`, `/sitemap.xml`, `/r/base/registry.json`: `curl -sI localhost:<port><path> | grep -iE '^(x-content-type-options|referrer-policy|x-frame-options|permissions-policy):' | wc -l` prints `4`; `curl -sI localhost:<port>/ | grep -ic '^content-security-policy'` prints `0`; `curl -s -o /dev/null -w '%{http_code}' localhost:<port>/r/base/registry.json` prints `200`; `curl -s -o /dev/null -w '%{http_code}' -X POST -H 'Content-Type: text/plain' --data '{}' localhost:<port>/ingest/e/` prints a PostHog status (not 404 and not 500; the builder records it); repo checks of 2.2 green.

### 1.3 Current structure

```
apps/shadcn-table-docs/next.config.mjs   ← rewrites(), skipTrailingSlashRedirect, redirects() (+ spec 24's slash redirect and analyzer wrap); no headers()
```

### 1.4 Target structure

```
apps/shadcn-table-docs/next.config.mjs   ← headers(): one rule, source '/:path*', the four headers
CHANGELOG.md (P9)                        ← #### Spec 28 under ## Unreleased, ### Added
```

### 1.5 Flow: none

### 1.6 Components

#### 1.6.1 Data artifacts

- `CHANGELOG.md` (P9): `#### Spec 28 Security response headers` under `## Unreleased`, `### Added`: every response carries nosniff, Referrer-Policy, X-Frame-Options and Permissions-Policy (D57).

#### 1.6.2 headers()

`next.config.mjs`, status `refactor`.

- `headers: async () => [{ source: '/:path*', headers: [ { key: 'X-Content-Type-Options', value: 'nosniff' }, { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' }, { key: 'X-Frame-Options', value: 'SAMEORIGIN' }, { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' } ] }]`.
- `/:path*` matches the root too (Next treats the empty match as `/`); the builder verifies `/` in the Acceptance and adds a second rule with `source: '/'` only if the first does not cover it.
- Does NOT add `Content-Security-Policy`, `Strict-Transport-Security` (Vercel sets it), `Cross-Origin-*` headers; does NOT touch `rewrites()`, `redirects()`, `skipTrailingSlashRedirect`, the analyzer wrap.

**Operations:**

| Operation | Status | Notes |
| --- | --- | --- |
| `headers()` | new | one rule, four headers |

**Stays unchanged:** everything else in `next.config.mjs`; `proxy.ts`; `vercel` settings (the apex redirect hops stay, D57).

### 1.7 Dependencies and env: none

## 2. Instructions for AI

### 2.1 Milestones

### Milestone: Security headers

- Files owned: `apps/shadcn-table-docs/next.config.mjs`
- Depends on: 24
- Review: none
- Local CI: `pnpm test typecheck --base base`, `pnpm test lint`, `pnpm test validate-repo`, `pnpm test docs-e2e --base base`
- Task 1: `headers()` (1.6.2). Checks: `pnpm --filter shadcn-table-docs lint`
- Task 2: Prove the Acceptance of 1.2 on a production build served on a P6 port; record the four counts, the CSP count and the two status codes in the tracker; stop the server. Checks: the lines of 1.2
- Task 3: Cleanup: `pnpm format`, the changelog block (1.6.1). Checks: 2.2

### 2.2 Checks

- `pnpm test typecheck --base base`, `pnpm test lint`, `pnpm test validate-repo` green
- `pnpm test docs-e2e --base base` green (pages and the search dialog render with the headers in place)
- Header counts and status codes of 1.2
- Review: none (config; P7 untouched)
