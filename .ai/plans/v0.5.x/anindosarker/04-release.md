# 04: release

## 1. Architecture

### 1.1 Overview

Ship `0.5.0`, the React Aria edition. Same merged-PR flow as 0.4.0 (`pnpm release
<version>` on `master` opens the pull request, merging tags and releases), preceded by the
`claude/review` to `dev` merge and the `dev` to `master` pull request. Runs after
[03](03-stories-and-docs.md) is merged.

### 1.2 Goals

- `CHANGELOG.md` `## 0.5.0 - <date>`: Added, React Aria edition with the install command;
  Changed, anything the n-tree guard renamed
- Every gate from parts 01 to 03 green on `claude/review`, then on `dev`
- `dev` to `master` pull request green on CI and merged; `pnpm release 0.5.0` on `master`;
  `release/0.5.0` merged; `release.yml` green through `gh release create`;
  `https://www.shadcn-table.com/version.txt` reads `0.5.0`; a real `shadcn add` of the aria
  item from the public URL succeeds (the workflow's install step)

### 1.3 Current structure: none

### 1.4 Target structure: none

### 1.5 Flow: none

### 1.6 Components

#### 1.6.1 Data artifacts

- `CHANGELOG.md` section closed by the release script
- Handoff in `handoffs/` with the release run id and the three edition URLs

### 1.7 Dependencies and env

`gh` signed in; Vercel production deploy on `master` push (as for 0.4.0).

## 2. Instructions for AI

No tracker. Halt on: a red release step whose fix is not a one-file change; a changelog
line no decision covers.

### 2.1 Phases

#### 2.1.1 Phase 01: Gates and merge chain

- Parts 01 to 03 gates on `claude/review`; merge into `dev` (fast-forward when possible);
  pull request `dev` into `master`; CI green; merge

#### 2.1.2 Phase 02: Release

- On `master`: `pnpm release 0.5.0`; CI green; merge the release pull request; watch
  `release.yml`; verify `version.txt`, the GitHub release, the aria install

#### 2.1.3 Final phase: Sync

- `dev` and `claude/review` fast-forwarded to `master`; handoff

### 2.2 Gates

- Everything in parts 01 to 03 section 2.2, on `claude/review` and on `dev`
- `release.yml` run green end to end; `curl https://www.shadcn-table.com/version.txt` is `0.5.0`
