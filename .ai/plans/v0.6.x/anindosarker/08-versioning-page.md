# 08: versioning page

## 1. Architecture

### 1.1 Overview

Decision 10: one "Versioning" section on the API reference index and one README line say what is public, what is stable, how the bases relate, how TanStack is pinned, how a rename is retired and how a project upgrades. Nothing else changes. Ships as 0.6.4 (patch). Branches from `claude/review` after 0.6.3.

### 1.2 Goals

- `/docs/api` shows a "Versioning" heading below the page list with the six points of decision 10, under 200 words
- `README.md` carries one line under the base line: "Everything exported is public API; upgrade with `shadcn add --overwrite` and the [changelog](CHANGELOG.md)."
- `check-pages.mjs a` keeps passing on `/docs/api`; the existing check counts the page links, the new section adds none
- No other file changes besides `CHANGELOG.md`

### 1.3 Current structure

```
apps/shadcn-table-docs/content/docs/api/index.mdx   ← title "API Reference", TableOfContentsList of the api routes
README.md                                            ← line 20 "One copy of the table per shadcn base: ..."
```

### 1.4 Target structure

```
apps/shadcn-table-docs/content/docs/api/index.mdx   ← same list, then "## Versioning" with six bullets
README.md                                            ← line 21: the public-API and upgrade line
CHANGELOG.md                                         ← ## Unreleased ### Docs, one line
```

### 1.5 Flow: none

### 1.6 Components

#### 1.6.1 Data artifacts

- `CHANGELOG.md` `## Unreleased` `### Docs`: "The API reference index explains versioning: everything exported is public, the three bases stay at parity, TanStack Table is pinned to `^9`, renamed options keep an alias for one minor, upgrade is `shadcn add --overwrite` plus this changelog."

#### 1.6.2 Versioning section (decision 10)

`## Versioning` on `docs/api/index.mdx`, after the `TableOfContentsList`. Plain prose and bullets, fumadocs markdown, no new components.

- One sentence: the table is copied into the project like any shadcn component, so versions describe the registry, not a package
- Bullets, each one line:
  - Public surface: every name `components/ui/shadcn-table/index.ts` exports, components, hooks, helpers, types
  - Registry addresses `/r/<base>/shadcn-table.json`, `shadcn-table-locale-<code>` and `example-<slug>` under the `@st` namespace are stable; the GitHub shorthands are a fallback
  - Base UI, Radix UI and React Aria are one library at feature parity, checked in CI
  - TanStack Table is pinned to `^9`; a breaking change there is a major here
  - A renamed option keeps its old name for one minor with a console warning, listed under Deprecated in the changelog, removed in the next major
  - Upgrade: `shadcn add --overwrite` for the item, then the changelog for what moved; edits inside `components/ui/shadcn-table/` are overwritten
- Does NOT list what a major may change, does NOT add a page, does NOT change the sidebar or routes
- Does NOT touch `SKILL.md` (it already says the files belong to the project)

**Stays unchanged:** `lib/routes.ts`, the `TableOfContentsList` call, the page check for `/docs/api`.

#### 1.6.3 README line (decision 10)

- Line directly under "One copy of the table per shadcn base: Base UI, Radix UI and React Aria.": "Everything exported is public API; upgrade with `shadcn add --overwrite` and the [changelog](CHANGELOG.md)."
- Does NOT change the Quick start block

### 1.7 Dependencies and env: none

## 2. Instructions for AI

### 2.1 Phases

#### 2.1.1 Phase 1: page and README

Lane: agent

- 1.6.2, 1.6.3, 1.6.1 in one commit on `v0.6/versioning-page` (worktree 07), `docs(api): versioning section`
- Gates: docs `types:check`, `lint`, `build`; `check-pages.mjs a --url <dev server> /docs/api` green; `grep -c '## Versioning' apps/shadcn-table-docs/content/docs/api/index.mdx` prints 1

#### 2.1.2 Final phase: release

Lane: inline

- CI-only PR from `v0.6/versioning-page` into `claude/review`, `release:patch`, merged by merge commit when green; `dev` fast-forwarded; PR `dev` into `master` with `release:patch`; the bot `chore: version 0.6.4` PR merged directly; the second `release.yml` run green; `dev` and `claude/review` fast-forwarded to `master`
- Gates: `pr.yml` green on both PRs; `smoke.mjs` green in the release run (its docs page check loads `/docs/api`)

### 2.2 Gates

- Docs `types:check`, `lint`, `build` green
- `check-pages.mjs a` on `/docs/api` green for the default base
- `pr.yml` green; release run `40...` green with tag `v0.6.4`
