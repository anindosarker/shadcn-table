# 32: Release 0.9.3

Follow the project planning rules: docs/code-of-conduct/planning-guidelines.md, CLAUDE.md:9. Keep the expedition contract.

## 1. Architecture

### 1.1 Overview

E10 (specs 24 to 31: canonical and slash redirect, JSON-LD, home OG image, home title, security headers, Markdown and llms shape, home JS and API payload, docs content) lands on `claude/review`; `dev` and `master` are at 0.9.2 (`8feb7940`, tag `v0.9.2`, 2026-11-09). D61 ships E10 as 0.9.3 through the D40 flow spec 23 ran for 0.9.2: Integration does the changelog pass and fast-forwards `claude/review` into `dev`, the PR `dev` into `master` opens at once with `release:patch` (D49) and auto-merge, `pr.yml` on GitHub is the one full run, the runner approves Prepare Release (D47), the bump push skips the test jobs (D35), auto-merge merges, `release.yml` tags `v0.9.3`, verifies the deploy and publishes. Nothing else rides in (D61): E8 stays parked.

### 1.2 Goals

- `dev` carries every spec 24 to 31 commit; the PR opens right after the fast-forward, no local suite (D40, D61).
- One PR `dev` into `master`, title `release: 0.9.3`, label `release:patch` (D49: no public API change; the docs site changes only), auto-merge enabled at creation; the version 0.9.2 bumps to 0.9.3 (P4).
- Prepare Release waits on the `release` environment; the runner approves it (D47). The bump push runs no test job and prompts nobody (D35).
- `master` carries `v0.9.3`; www.shadcn-table.com and the Storybook host serve 0.9.3; the GitHub release exists with the 0.9.3 changelog section; on the live site: `/` has a canonical, two JSON-LD scripts and an `og:image`; a docs page has `vary: ...Accept...` for Markdown; `/docs/api/table-options/` answers 308; `/llms.txt` starts with `# shadcn-table` (D53 to D58).
- `claude/review` and `dev` end at `master` (P4).
- Acceptance: programmatic. `git ls-remote --tags origin v0.9.3` prints one line; `gh release view v0.9.3 --json tagName --jq .tagName` prints `v0.9.3`; `curl -fsS https://www.shadcn-table.com/version.txt` and `curl -fsS https://storybook.shadcn-table.com/version.txt` print `0.9.3`; `curl -s https://www.shadcn-table.com/ | grep -c 'rel="canonical"\|application/ld+json\|og:image'` prints `4`; `curl -s -o /dev/null -w '%{http_code}' https://www.shadcn-table.com/docs/api/table-options/` prints `308`; `curl -s https://www.shadcn-table.com/llms.txt | head -1` prints `# shadcn-table`; the Validate Production job of the `release.yml` run is green; `git rev-parse origin/claude/review origin/dev origin/master` prints one sha three times.

### 1.3 Current structure

```
claude/review  3e9aebb7 + E10 merges   ← specs 24 to 31, plan commits; contains master 8feb7940
dev, master    8feb7940              ← 0.9.2 (v0.9.2 tagged 2026-11-09)
CHANGELOG.md                         ← `## Unreleased` with Fixed (24, 29), Added (25, 26, 28), Changed (27, 30), Docs (31 x3), written by the specs (P9); `## 0.9.2 - 2026-11-09` below
packages/shadcn-table/package.json:8 ← "version": "0.9.2"
.github/workflows/pr.yml             ← head job, skip inputs (D35), record outputs (D38), prepare-release gated by environment release (D3)
.github/workflows/release.yml        ← Check Release, Verify Deployment (tags), Validate Production, Publish Release
GitHub: environment release          ← required reviewer; the runner approves through pending_deployments (D47)
```

### 1.4 Target structure

```
claude/review                        ← changelog pass; later up to master (P4)
dev                                  ← claude/review fast-forwarded, then `chore: version 0.9.3` by Prepare Release
master                               ← the release PR merged; tag v0.9.3; CHANGELOG `## 0.9.3 - <date>`
GitHub release v0.9.3                ← notes from the 0.9.3 changelog section (Publish Release)
```

### 1.5 Flow

```mermaid
sequenceDiagram
  participant R as claude/review
  participant D as dev
  participant P as pr.yml
  participant M as master
  participant W as release.yml
  R->>R: changelog pass, frontmatter script (Integration)
  R->>D: fast-forward, push (Integration)
  D->>M: PR release: 0.9.3, release:patch, auto-merge on (Release PR)
  P->>P: test jobs green, PR Summary (D37, D38)
  P->>P: Prepare Release waits on environment release
  Note over P: the runner approves (D47)
  P->>D: chore: version 0.9.3 (RELEASE_BOT_TOKEN)
  P->>P: bump run: test jobs skipped (D35); auto-merge merges
  M->>W: push to master
  W->>W: Check Release, Verify Deployment (tag v0.9.3), Validate Production, Publish Release
```

### 1.6 Components

#### 1.6.1 Changelog pass

`CHANGELOG.md`, status `refactor` (Integration). Under `## Unreleased`: one heading each of `### Fixed`, `### Added`, `### Changed`, `### Docs`, in the order the file header lists them, each holding its `#### Spec NN` blocks (24 and 29 Fixed; 25, 26, 28 Added; 27, 30 Changed; 31's three blocks Docs); duplicates from parallel merges collapsed; no `## Unreleased` left empty. The release PR's last check renames the heading to `## 0.9.3 - <date>`. Commit and push only when a heading changed.

#### 1.6.2 Fast-forward

`dev`, status `refactor` (Integration). `git fetch origin && git push origin origin/claude/review:dev` after `git merge-base --is-ancestor origin/dev origin/claude/review` holds; else stop with an ATTENTION item (never a force push, P2). Before the push: `node tools/docs/check-frontmatter.mjs apps/shadcn-table-docs/content/docs` prints `0` on every rule (spec 31, 2.2), else an ATTENTION item and a fix milestone.

#### 1.6.3 Release PR

Status `new` (Release PR). `gh pr create --base master --head dev --title "release: 0.9.3" --label release:patch --body-file <body>` with the body per `.github/pull_request_template.md` (the 0.9.3 changelog section); `gh pr merge <N> --auto --merge`. When Prepare Release waits: `gh api repos/anindosarker/shadcn-table/actions/runs/<run_id>/pending_deployments -X POST -f 'environment_ids[]=<id>' -f state=approved -f comment='runner approval (D47)'` at once. A red test job: reproduce under `act pull_request -W .github/workflows/pr.yml -j <job>` (P3, D32), fix on `claude/review` as a fix milestone, fast-forward `dev` again. Does NOT enable auto-merge on any other PR, does NOT edit the ruleset or the environment (P7), does NOT push the bump by hand, does NOT use `release:minor` (D49).

#### 1.6.4 After release

Status `new` (After release). Watch `release.yml` to green; verify the Acceptance lines of 1.2; `git fetch origin && git checkout claude/review && git merge --ff-only origin/master || git merge origin/master -m "merge: master 0.9.3"`, push; the same for `dev`; rewrite the runner's handoff. The owner-side follow-ups the specs name (Rich Results test, spec 25) are listed in the handoff, not run.

### 1.7 Dependencies and env

- `gh` authenticated as the owner (the runner's login), `RELEASE_BOT_TOKEN` set (v0.8.x D83 addendum), Docker Desktop for `act` on a red (D32); nothing new.

## 2. Instructions for AI

### 2.1 Milestones

### Milestone: Integration 0.9.3

- Files owned: `CHANGELOG.md`
- Depends on: 24, 25, 26, 27, 28, 29, 30, 31
- Review: none
- Local CI: `pnpm test validate-repo`, `pnpm test lint`
- Task 1: Changelog pass of 1.6.1 on `claude/review` (commit and push only if a heading changes), the frontmatter script, then the fast-forward of 1.6.2. Checks: `git rev-parse origin/dev` equals `git rev-parse origin/claude/review`; `grep -c '^## Unreleased' CHANGELOG.md` prints `1`; every `#### Spec 2[4-9]\|#### Spec 3[01]` heading sits under its `###` inside `## Unreleased`; `node tools/docs/check-frontmatter.mjs apps/shadcn-table-docs/content/docs` prints `0` on every rule

### Milestone: Release PR 0.9.3

- Files owned: none
- Depends on: Integration 0.9.3
- Review: none
- Local CI: none (CI runs on the PR; a red is reproduced under `act`, D32)
- Task 1: Open the PR with its label and auto-merge (1.6.3); arm the watcher. Checks: `gh pr view <N> --json labels,autoMergeRequest --jq '[.labels[].name, .autoMergeRequest.enabledAt != null]'` prints `["release:patch", true]`
- Task 2: The full run green; when Prepare Release waits, approve the deployment (1.6.3, D47) and record the response. Checks: `gh run view <id> --json jobs --jq '[.jobs[] | select(.conclusion != "success" and .conclusion != "skipped")] | length'` prints `0` apart from Prepare Release `waiting`
- Task 3: The bump run and the merge (1.6.3). Checks: `gh pr view <N> --json state --jq .state` prints `MERGED`; `git fetch origin && git show origin/master:packages/shadcn-table/package.json | grep '"version": "0.9.3"'`

### Milestone: After release 0.9.3

- Files owned: none
- Depends on: Release PR 0.9.3
- Review: none
- Local CI: none
- Task 1: Watch `release.yml` to green (1.6.4). Checks: the Acceptance lines of 1.2 for the tag, the release, the two `version.txt` URLs and the live-site lines; Validate Production `success`
- Task 2: `claude/review` and `dev` up to `master`, push both; rewrite the handoff (1.6.4). Checks: `git rev-parse origin/claude/review origin/dev origin/master` prints one sha three times; `pnpm test validate-repo` green on `claude/review`

### 2.2 Checks

- Integration: `pnpm test validate-repo`, `pnpm test lint` green on `claude/review`; `dev` equals `claude/review`; the frontmatter script prints `0`
- Release PR: `pr.yml` green on the pre-bump head; the runner's Approve (D47); the bump run with the test jobs skipped; the PR merged by auto-merge with `chore: version 0.9.3` in it
- After release: `release.yml` green (Check Release, Verify Deployment, Validate Production, Publish Release); tag `v0.9.3`; `gh release view v0.9.3`; both `version.txt` print `0.9.3`; the live-site lines of 1.2; the three branches at one sha
- Review: none (operations only; P7 untouched)
