# 17: Workflows use the Node 24 action majors
- Epic: E6

Follow the project planning rules: docs/code-of-conduct/planning-guidelines.md, CLAUDE.md:9. Keep the expedition contract.

## 1. Architecture

### 1.1 Overview

Every job of `pr.yml` and `release.yml` annotates "Node.js 20 is deprecated. The following actions target Node.js 20 but are being forced to run on Node.js 24: actions/checkout@v4, actions/setup-node@v4, actions/upload-artifact@v4, pnpm/action-setup@v4" (30 warnings per run, 0.9.0 run 42496942383). D36 moves every `uses:` to the major whose `action.yml` says `runs.using: node24`, read on 2026-11-08 from each repository's latest release: `actions/checkout@v7` (v7.0.1), `actions/setup-node@v7` (v7.1.0), `actions/upload-artifact@v7` (v7.0.2), `actions/download-artifact@v8` (v8.0.2), `actions/cache@v6` (v6.1.0), `pnpm/action-setup@v6` (v6.1.1). `pnpm/action-setup` v6 reads the version from `packageManager` (`package.json:44`, `pnpm@10.13.1`), as v4 did here (no `version:` input in any step). `upload-artifact` v7 and `download-artifact` v8 share the v2 artifact API, so the one download (`pr.yml:152`) keeps reading the uploads until spec 19 removes it.

### 1.2 Goals

- No `@v4` action remains in `.github/workflows/*.yml`; the six actions sit on the majors above (D36).
- Every job behaves as before: pnpm resolved from `packageManager`, the pnpm and Playwright caches hit, artifacts uploaded and downloaded.
- Acceptance: programmatic. `grep -rn '@v4' .github/workflows/` prints nothing; `act pull_request -W .github/workflows/pr.yml -j lint` green (act pulls the new majors from GitHub); the next `pr.yml` run on GitHub (the 0.9.1 release PR or an earlier PR) has zero annotations containing `Node.js 20 is deprecated`: `gh api repos/anindosarker/shadcn-table/check-runs/<id>/annotations` over its jobs, or `gh run view <id> --log | grep -c 'Node.js 20 is deprecated'` prints 0.

### 1.3 Current structure

```
.github/workflows/
├── pr.yml:47-49,55 80-82,88 117-119,125 148-149,152 186,191   ← checkout@v4 (6), pnpm/action-setup@v4 (3), setup-node@v4 (6), upload-artifact@v4 (3), download-artifact@v4 (1)
├── typecheck.yml:22-24,30                                      ← checkout, pnpm/action-setup, setup-node, upload-artifact @v4
├── storybook-tests.yml:22-24,31                                ← same four
├── docs-e2e.yml:25-27,35,42,49                                 ← same four plus cache@v4 (2)
├── installation-e2e.yml:30-32,43,51                            ← same four plus cache@v4 (1)
└── release.yml:52-53,75-76,100-102,109,132,135                 ← checkout@v4 (4), setup-node@v4 (4), pnpm/action-setup@v4 (1), upload-artifact@v4 (1)
package.json:44                                                  ← "packageManager": "pnpm@10.13.1"
```

Counts: checkout 13, setup-node 13, upload-artifact 8, download-artifact 1, cache 3, pnpm/action-setup 8.

### 1.4 Target structure

```
.github/workflows/*.yml   ← actions/checkout@v7, actions/setup-node@v7, actions/upload-artifact@v7, actions/download-artifact@v8, actions/cache@v6, pnpm/action-setup@v6; nothing else changes
```

### 1.5 Flow: none

### 1.6 Components

#### 1.6.1 Data artifacts

- `CHANGELOG.md` (P9): `#### Spec 17 CI: Node 24 action majors` under `## Unreleased`, `### Changed` (D36).

#### 1.6.2 The `uses:` lines

Six workflow files, status `refactor`: a one-token change per line, 46 lines. The `with:` blocks stay (`node-version: 22`, `cache: pnpm`, `path`, `key`, `restore-keys`, `name`, `include-hidden-files`, `overwrite`, `pattern`, `merge-multiple`, `ref`, `token`, `fetch-depth`); every input used here exists unchanged in the new majors (checked against each action's `action.yml` at the pinned release before the edit; a renamed or removed input is a tracker Attention line, not a silent workaround).

- Does NOT pin to a sha; the project pins majors.
- Does NOT touch the `node-version: 22` of the jobs: that is the project's Node, the action runtime is GitHub's.

### 1.7 Dependencies and env

- Network for `act` to pull the six actions once.

## 2. Instructions for AI

### 2.1 Milestones

### Milestone: CI Node 24 actions

- Files owned: `.github/workflows/pr.yml`, `.github/workflows/typecheck.yml`, `.github/workflows/storybook-tests.yml`, `.github/workflows/docs-e2e.yml`, `.github/workflows/installation-e2e.yml`, `.github/workflows/release.yml`
- Depends on: CI skip bump commit
- Review: none
- Local CI: `act -W .github/workflows/pr.yml -l`, `act -W .github/workflows/release.yml -l`, `act pull_request -W .github/workflows/pr.yml -j lint`, `pnpm test validate-repo`
- Task 1: Read each action's `action.yml` at the pinned release (`gh api repos/<owner>/<action>/contents/action.yml?ref=<tag>`), confirm `runs.using: node24` and every input this repo passes; record the six lines in the tracker. Checks: the tracker lines
- Task 2: The 46 `uses:` lines (1.6.2). Checks: `grep -rn '@v4' .github/workflows/` empty; both `act -l` parse; `act pull_request -W .github/workflows/pr.yml -j lint` green
- Task 3: Cleanup: the changelog block, `pnpm format`. Checks: 2.2

### 2.2 Checks

- `grep -rn '@v4' .github/workflows/` prints nothing
- `act -W .github/workflows/pr.yml -l` and `act -W .github/workflows/release.yml -l` list every job
- `act pull_request -W .github/workflows/pr.yml -j lint` green
- `pnpm test validate-repo` green
- The next GitHub run: `gh run view <id> --log | grep -c 'Node.js 20 is deprecated'` prints 0 (recorded in the tracker of the spec whose PR runs first)
