# 05: release

## 1. Architecture

### 1.1 Overview

Ship `0.4.0`: the first release on the v9 architecture and the first with breaking
changes since `0.3.0`. The release flow is the merged-PR flow from the v0.3.x cycle
(`pnpm release <version>` opens the PR, merging tags and releases). This part writes the
changelog section, runs every gate on `dev`, opens the release PR and watches the release
run. Runs after [03](03-storybook.md) and [04](04-docs.md) are merged into `dev`.

### 1.2 Goals

- `CHANGELOG.md` `## 0.4.0` complete: Breaking, Fixed, Added, Changed, each line naming
  the option or component and the replacement
- Every gate from parts 01 to 04 green on `dev`
- `release/0.4.0` PR into `master` green on CI; merged; run of `release.yml` green through
  `gh release create`; `https://www.shadcn-table.com/version.txt` reads `0.4.0`
- `dev` fast-forwarded to `master` after the release

### 1.3 Current structure

`CHANGELOG.md` `## Unreleased` holds the lines parts 01 to 04 wrote. `scripts/release.mjs`
and `.github/workflows/release.yml` as shipped in 0.3.3.

### 1.4 Target structure

Same files. `## 0.4.0 - <date>` section. Tag `v0.4.0` on the merge commit, GitHub release
with the section as notes.

### 1.6 Components

#### 1.6.1 Data artifacts

- `CHANGELOG.md` `## Unreleased`, reviewed and completed:
  - Breaking: sub-components take no `table` prop (use `ST_TableProvider`); `memoMode`
    removed; `expandRowsFn` removed; `stFeatures` value no longer exported (`ST_Features`
    type stays); locale import path `shared/locales/<code>`; custom fn names resolve in
    core (unknown names warn in dev instead of falling back to `fuzzy`)
  - Fixed: cell action menu edit; `enablePagination: false` with `manualPagination: false`;
    row pinning on select under controlled selection; `isSaving` and `showProgressBars`
    defaults; headless display column headers; `getIsSomeRowsSelected` indeterminate
  - Added: `ST_TableProvider`; `mk` locale; `ST_Features` type export
  - Changed: internals on v9 custom features and subscriptions; folder layout
- Both `package.json` versions `0.4.0`

#### 1.6.2 Release PR

`pnpm release 0.4.0` from `dev`: sets versions, closes the section, commits on
`release/0.4.0`, pushes, opens the PR into `master`.

- Does NOT touch `master` directly

#### 1.6.3 Release run

Merging the PR triggers `release.yml`: tag, wait for production, smoke (registry URLs,
Storybook, `/SKILL.md`, page checks), install matrix, `gh release create`. Any red step:
fix on `dev`, new PR; no retag.

### 1.7 Dependencies and env

`gh` authenticated; `master` ruleset (pull requests only). Release flow decision:
[../../v0.3.x/anindosarker/decisions.md](../../v0.3.x/anindosarker/decisions.md) "Release".

## 2. Instructions for AI

No tracker. Work on `dev` directly for the changelog; the release script creates its
branch. Halt and ask the owner on: a changelog line that describes a change no decision
or finding covers, a red release step whose fix is not a one-file change.

### 2.1 Phases

#### 2.1.1 Phase 01: Changelog and gates

- 1.6.1; every gate from parts 01 to 04 on `dev`

#### 2.1.2 Phase 02: Release

- `pnpm release 0.4.0`; CI green; merge; watch `release.yml` to green; verify
  `version.txt`, the GitHub release, `/docs/getting-started/install` renders

#### 2.1.3 Final phase: Sync

- `dev` fast-forwarded to `master`; `claude/review` retired or synced; handoff in this
  folder

### 2.2 Gates

- Parts 01 to 04 gates, all green on `dev`
- `node scripts/release/notes.mjs 0.4.0` prints the section
- `release.yml` run green end to end; `curl https://www.shadcn-table.com/version.txt` is `0.4.0`
