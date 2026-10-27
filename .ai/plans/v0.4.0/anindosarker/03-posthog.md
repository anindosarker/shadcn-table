# 03: PostHog

## 1. Architecture

### 1.1 Overview

The docs app has no analytics. Decision: [decisions-archive.md](decisions-archive.md) "Docs site" 2.
Product and web analytics on PostHog US cloud, in the docs app only; the library is
untouched.

### 1.2 Goals

- With `NEXT_PUBLIC_POSTHOG_KEY` set, every docs page visit produces a `$pageview`, one per
  route change
- Each custom event in 1.6.3 fires once per user action with its listed properties
- Without the key, nothing loads and nothing errors
- Requests go to `www.shadcn-table.com/ingest/...`, never to a `posthog.com` origin, so ad
  blockers do not drop them

### 1.3 Current structure

```
apps/shadcn-table-docs/
├── app/layout.tsx                   ← RootProvider, TooltipProvider
├── next.config.mjs                  ← registry rewrites, redirects
├── components/base-selector.tsx     ← setBase, useBase
├── components/mdx/copy-button.tsx   ← clipboard copy
├── components/example-playground.tsx← mode state
├── components/code-explorer.tsx     ← activePath state
├── components/mdx/storybook-link.tsx
└── components/site-nav.tsx          ← GitHub, Discord links
```

### 1.4 Target structure

```
apps/shadcn-table-docs/
├── app/layout.tsx                   ← mounts PostHogProvider inside RootProvider
├── next.config.mjs                  ← plus /ingest rewrites, skipTrailingSlashRedirect
├── components/posthog-provider.tsx  ← client; posthog.init once, when the key is set
├── lib/analytics.ts                 ← one function per event, typed properties
├── .env.local                       ← NEXT_PUBLIC_POSTHOG_KEY (gitignored)
└── (hook points in 1.3 call lib/analytics.ts)
CONTRIBUTING.md                      ← Analytics section
```

### 1.5 Flow: none

### 1.6 Components

#### 1.6.1 PostHogProvider

`components/posthog-provider.tsx`, client. Mounted in `app/layout.tsx` inside
`RootProvider`.

- `posthog.init(key, { api_host: '/ingest', ui_host: 'https://us.posthog.com',
  capture_pageview: 'history_change', capture_pageleave: true, person_profiles:
  'identified_only', autocapture: false })` in `useEffect`, once, only when the key is set
- Registers the current base as a super property (`posthog.register({ base })`) so every
  report can break down by base
- Wraps `children` in `PostHogProvider` from `posthog-js/react`
- Does NOT autocapture: the custom events are the signal; autocapture on a docs site with
  hundreds of buttons is noise and quota
- Does NOT call `identify`

**Operations:**

| Operation          | Status | Notes                         |
| ------------------ | ------ | ----------------------------- |
| `PostHogProvider`  | new    | no-op without the key         |

**Stays unchanged:** `RootProvider`, `TooltipProvider`, theme script.

#### 1.6.2 Ingest rewrites

`next.config.mjs` `afterFiles` gains `/ingest/static/:path*` to
`https://us-assets.i.posthog.com/static/:path*` and `/ingest/:path*` to
`https://us.i.posthog.com/:path*`; `skipTrailingSlashRedirect: true` because PostHog paths
end with a slash. External rewrites run on the edge; no function invocations.

**Operations:**

| Operation            | Status   | Notes                    |
| -------------------- | -------- | ------------------------ |
| `rewrites.afterFiles`| refactor | two entries added        |
| `skipTrailingSlashRedirect` | new | top-level config    |

**Stays unchanged:** registry rewrites, redirects, `distDir`.

#### 1.6.3 lib/analytics.ts

One module, one function per event, each a thin `posthog.capture` with typed properties.
Components call these, never `posthog` directly, so renaming an event is one file.

| event                    | properties                                                              | hook point                                                                 |
| ------------------------ | ----------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| `base_switched`          | `from`, `to`, `surface` (`header`, `command_bar`, `tabs`)               | `components/base-selector.tsx` `setBase` callers                           |
| `install_command_copied` | `item`, `base`, `package_manager`, `surface` (`docs_page`, `example`, `home`) | `components/mdx/copy-button.tsx` via an `onCopied` prop; `install-command.tsx` and the example panel pass the properties |
| `example_code_opened`    | `example`, `base`, `mode` (`code`, `both`)                              | `components/example-playground.tsx` mode change                            |
| `example_file_viewed`    | `example`, `base`, `file`                                               | `components/code-explorer.tsx` active file change                          |
| `storybook_opened`       | `base`, `surface` (`mdx_link`, `nav`, `footer`)                         | `components/mdx/storybook-link.tsx`, nav and footer links                  |
| `outbound_clicked`       | `target` (`github`, `discord`), `surface`                               | `components/site-nav.tsx`, footer                                          |
| `search_used`          | none                                                                    | `RootProvider` `search` options if fumadocs exposes an open callback; otherwise the event is dropped, fumadocs is not patched |

**Interfaces:**

```typescript
export type Surface = 'header' | 'command_bar' | 'tabs' | 'docs_page' | 'example' | 'home' | 'mdx_link' | 'nav' | 'footer';
export const trackBaseSwitched = (p: { from: Base; to: Base; surface: Surface }) => void;
export const trackInstallCommandCopied = (p: { item: string; base: Base; package_manager: PackageManager; surface: Surface }) => void;
// one function per row above, same shape
```

**Operations:**

| Operation               | Status | Notes                                  |
| ----------------------- | ------ | -------------------------------------- |
| `track*` functions      | new    | seven, one per event                   |
| `copy-button.tsx`       | refactor | `onCopied` prop                      |
| the other hook points   | refactor | one call each                        |

**Stays unchanged:** component markup and behaviour at every hook point.

#### 1.6.4 CONTRIBUTING.md Analytics section

How it is wired (1.6.1 to 1.6.3 in five lines), how to run locally with a key, and how to
read the data, kept in the repo so the next person has it:

- Web analytics (left nav): visitors, page views, top pages, referrers, countries, devices.
  The daily glance.
- Product analytics, Trends: pick an event, for example `install_command_copied`, break
  down by `base` and `package_manager`. Save as an insight, pin to a dashboard named
  "shadcn-table".
- Funnels: `$pageview` on an example page, then `example_code_opened`, then
  `install_command_copied`; breakdown by `base` shows which base converts.
- Paths: start at `$pageview` on the install page to see where readers go next.
- Three insights to create on day one: page views by base, install copies by base and
  package manager, example-to-install funnel.

### 1.7 Dependencies and env

**New packages:**

```bash
pnpm --filter shadcn-table-docs add posthog-js
```

**New env vars:**

| Variable                  | Default | Purpose                                         |
| ------------------------- | ------- | ----------------------------------------------- |
| `NEXT_PUBLIC_POSTHOG_KEY` | unset   | PostHog project key; Vercel Production and Preview, local `.env.local` |

Host is fixed in code (US cloud), not an env. `.env*.local` added to the docs `.gitignore`.
Session replay, surveys, feature flags, error tracking: not enabled. No cookie banner:
`identified_only` without `identify` stores an anonymous id only; revisit if an EU audience
grows.

## 2. Instructions for AI

### 2.1 Phases

#### 2.1.1 Phase 1: Wiring

- Package, provider per 1.6.1, rewrites per 1.6.2, `.gitignore` entry

#### 2.1.2 Phase 2: Events

- `lib/analytics.ts` and the hook points per 1.6.3

#### 2.1.3 Final phase: Cleanup

- `CONTRIBUTING.md` section per 1.6.4
- `pnpm format`; docs `types:check`, `lint`, `build`

### 2.2 Gates

- Docs `types:check`, `lint`, `build`
- Playwright against `next start` with a test key: load a page, switch base, copy an install
  command, open Code and a file; one request per event to `/ingest/e/` or `/ingest/batch/`
  carrying the event name and properties. Then without a key: zero `/ingest` requests, no
  console errors
- First production deploy with the real key: PostHog "Verify installation" turns green and
  `$pageview` events show the production host
