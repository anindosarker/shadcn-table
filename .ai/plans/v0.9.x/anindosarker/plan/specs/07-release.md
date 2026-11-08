# 07: Release 0.9.0
- Epic: E3

Follow the project planning rules: docs/code-of-conduct/planning-guidelines.md, CLAUDE.md:9. Keep the expedition contract.

## 1. Architecture

### 1.1 Overview

E1 (filtering, pagination, resize animation), E2 (theme customizer, release approval, Storybook reset) and the F3 fix sit on `claude/review`; `dev` and `master` are still at 0.8.2. D15 ships them as 0.9.0 through the v0.8.x flow (v0.8.x D83, D86): `claude/review` fast-forwards into `dev` once and a verifier runs the suite there; one PR `dev` into `master` with `release:minor` and auto-merge at creation; `pr.yml` goes green, `prepare-release` waits on the `release` environment (D3, spec 05) and the runner approves it, since the owner approved 0.9.0 in advance (D15); the bump `chore: version 0.9.0` lands on `dev`, auto-merge merges, `release.yml` tags `v0.9.0`, verifies the deploy and publishes the GitHub release. The docs changes are not in it; they ship as 0.9.1 (D15). Nothing in the library or the workflows changes; the spec is operations and one changelog pass.

### 1.2 Goals

- `dev` carries every E1, E2 and F3 commit and the suite is green on it before the PR opens (D15, P1).
- One PR `dev` into `master`, title `release: 0.9.0`, label `release:minor`, auto-merge enabled at creation; the version 0.8.2 bumps to 0.9.0 (D15, P4).
- The `prepare-release` deployment is approved by the runner once, for 0.9.0 only, under the owner's advance word (D15, D3).
- `master` carries `v0.9.0`; www.shadcn-table.com and the three Storybook builds serve 0.9.0; the GitHub release exists with the 0.9.0 changelog section (D15).
- `claude/review` and `dev` end at `master` (P4).
- Acceptance: programmatic. `git ls-remote --tags origin v0.9.0` prints one line; `gh release view v0.9.0 --json tagName --jq .tagName` prints `v0.9.0`; `curl -fsS https://www.shadcn-table.com/version.txt` and `curl -fsS https://storybook.shadcn-table.com/<base>/version.txt` for base, radix and aria print `0.9.0`; the Validate Production job of the `release.yml` run for the merge is green (`gh run view <id> --json jobs --jq '.jobs[] | select(.name == "Validate Production") | .conclusion'` prints `success`; the test runs only in CI, P5); `git rev-parse origin/claude/review origin/dev origin/master` prints one sha three times.

### 1.3 Current structure

```
claude/review                         ← E1 (4a61e251, de4df68e, 54a51ee3), E2 (06 at 6c094612; 04 and 05 as they merge), F3 fix (f075a6d1), plan commits
dev, master                           ← 0.8.2 (v0.8.2 tagged), untouched since the 0.8.2 release
CHANGELOG.md                          ← `## Unreleased`, `### Changed`, `#### Epic 01 Filtering` and the later spec blocks (P9)
packages/shadcn-table/package.json    ← version 0.8.2
.github/workflows/pr.yml              ← twenty-one jobs; prepare-release gated by `environment: release` once spec 05 merges
.github/workflows/release.yml         ← Check Release, Verify Deployment (tags), Validate Production, Publish Release (v0.8.x D86, D92)
tools/release/prepare-release.mjs     ← bumps both package.json files, renames `## Unreleased` to `## <next> - <date>`
GitHub: environment `release`         ← required reviewer anindosarker, self-review allowed (spec 05)
```

### 1.4 Target structure

```
dev                                   ← claude/review fast-forwarded, then `chore: version 0.9.0` by Prepare Release
master                                ← the release PR merged; tag v0.9.0; CHANGELOG `## 0.9.0 - <date>`
claude/review                         ← fast-forwarded to master after the release (P4)
GitHub release v0.9.0                 ← notes from the 0.9.0 changelog section (Publish Release)
```

### 1.5 Flow

```mermaid
sequenceDiagram
  participant R as claude/review
  participant D as dev
  participant P as pr.yml
  participant M as master
  participant W as release.yml
  R->>D: fast-forward, push (Integration)
  D->>D: pnpm test --all green (verifier)
  D->>M: PR release: 0.9.0, release:minor, auto-merge on (Release PR)
  P->>P: twenty jobs green, PR Summary
  P->>P: Prepare Release waits on environment release
  Note over P: runner approves the deployment (D15)
  P->>D: chore: version 0.9.0 (RELEASE_BOT_TOKEN)
  P->>P: rerun on the bump, green; auto-merge merges
  M->>W: push to master
  W->>W: Check Release, Verify Deployment (tag v0.9.0), Validate Production, Publish Release
  M->>R: claude/review and dev fast-forwarded to master (After release)
```

### 1.6 Components

#### 1.6.1 Data artifacts

- `CHANGELOG.md` (P9): before the fast-forward, every `#### Spec NN` or `#### Epic NN` block of E1 and E2 sits under one of `### Added`, `### Changed`, `### Fixed`, `### Docs` inside `## Unreleased`, and the F3 fix has one line under `### Fixed` (anchored menus keep their position while they close, `useST_MenuAnchor.ts`); no `### Breaking` or `### Removed` (the `'default'` to `'compact'` rename is under `### Changed`, D6). Prepare Release renames `## Unreleased` to `## 0.9.0 - <date>`; nothing else edits the file.
- `packages/shadcn-table/package.json` and the root `package.json`: version `0.9.0` through Prepare Release only; never bumped by hand.
- The tracker `trackers/07-release-tracker.md`: the check lines of the integration run, the PR number, the run id of the `pr.yml` run that waited, the `gh api` approval response, the `release.yml` run id, the final shas.

#### 1.6.2 Integration (D15, P1)

- Precondition: every E2 milestone merged (`sprints.md` rows `E2 04`, `E2 05`, `E2 06` at `[x]`); the `release` environment exists and `pr.yml` carries `environment: release` (spec 05 merged).
- `git fetch origin && git checkout dev && git merge --ff-only origin/claude/review && git push origin dev`: the one fast-forward of P1; `dev` is never pushed to otherwise.
- The verifier runs the suite on `dev` in a pool worktree checked out at `origin/dev` (P2): `pnpm test --all` with the per-base tests one base at a time (P5); a known flake (P5 list) reruns once before it is called red. Each check is one tracker line (command, commit, result).
- A red that is not a flake: a fix milestone on `claude/review` (`new_fix.py v0.9.x <slug> "F<n>"`, the finding recorded first), then the fast-forward again and a rerun; the PR waits.
- Does NOT run `validate-pr` or `validate-production` locally (CI only, P5); does NOT touch `master`.

#### 1.6.3 Release PR (D15, D3, P4)

- `gh pr create --base master --head dev --title "release: 0.9.0" --label release:minor --body-file <body>` with the body per `.github/pull_request_template.md` (Changes: E1, E2, F3 in one paragraph each; Checklist ticked where the suite proved it; Release impact: `release:minor`, the changelog lines present); then `gh pr merge <N> --auto --merge` so auto-merge is on from creation (D15 supersedes the v0.8.x A23 default).
- A background watcher per run.md (a shell loop over `gh pr checks <N> --json name,state` every 60 s) wakes the runner; the runner never waits in the foreground.
- When the Prepare Release job shows "Waiting for review": `run_id` from `gh run list --workflow pr.yml --branch dev --event pull_request --limit 1 --json databaseId --jq '.[0].databaseId'`, environment id from `gh api repos/anindosarker/shadcn-table/environments/release --jq .id`, then one approval:

  ```sh
  gh api -X POST repos/anindosarker/shadcn-table/actions/runs/<run_id>/pending_deployments \
    -F 'environment_ids[]=<env_id>' -f state=approved -f comment='release 0.9.0, approved in advance by the owner (D15)'
  ```

  This is the one approval D15 authorizes, for 0.9.0 only; the response goes to the tracker. A second wait on the same PR (a rerun after a fix) is approved the same way, still 0.9.0. Any other version is an ATTENTION item, never an approval.
- The bump commit `chore: version 0.9.0` lands on `dev` and `pr.yml` reruns; Prepare Release skips as already bumped; auto-merge merges when every required check is green. A red job that is a P5 flake: `gh run rerun --failed <id>` once; any other red is a fix milestone on `claude/review`, the fast-forward again (the PR follows `dev`), and a rerun.
- Does NOT enable auto-merge on any other PR, does NOT edit the ruleset or the environment (P7), does NOT push the bump by hand.

#### 1.6.4 After release (D15, P4)

- `release.yml` runs on the push to `master`: Check Release, Verify Deployment (polls www and storybook `/version.txt` up to 20 minutes, then tags `v0.9.0`), Validate Production (HTTP checks, v0.8.x D92), Publish Release (the GitHub release from the `## 0.9.0` section, the "Released in v0.9.0" PR comment). The watcher loop over `gh run watch <id> --exit-status` wakes the runner.
- A red Verify Deployment or Validate Production: `gh workflow run release.yml -f version=0.9.0` reruns the late steps without retagging once the deploy serves 0.9.0 (v0.8.x D90); a red that needs code is a fix milestone on `claude/review` and the next version, reported as an ATTENTION item, not fixed on `master`.
- Then: `git checkout claude/review && git merge --ff-only origin/master && git push`, the same for `dev` (P4); the handoff rewritten with the release facts.
- Does NOT delete `dev` or `claude/review`; does NOT touch `test-projects/`.

**Stays unchanged:** `pr.yml`, `release.yml`, `tools/release/*`, the ruleset, the environment, every library and docs file.

### 1.7 Dependencies and env

- `gh` authenticated as the owner (the runner's login), `RELEASE_BOT_TOKEN` set (v0.8.x D83 addendum); nothing new.

## 2. Instructions for AI

### 2.1 Milestones

### Milestone: Integration

- Files owned: none
- Depends on: Theme customizer, Release approval, Storybook reset
- Review: none
- Local CI: `pnpm test --all` on `dev` (per-base tests one base at a time, P5)
- Task 1: Changelog pass of 1.6.1 on `claude/review` (commit, push), then the fast-forward of 1.6.2. Checks: `git rev-parse origin/dev` equals `git rev-parse origin/claude/review`; `grep -c '^## Unreleased' CHANGELOG.md` prints `1` and every spec block sits under a `###` group
- Task 2: The suite on `dev` (1.6.2), one tracker line per check. Checks: `pnpm test typecheck --base <b>`, `pnpm test storybook-tests --base <b>`, `pnpm test docs-e2e --base <b>` for base, radix and aria one after another; `pnpm test lint`; `pnpm test validate-repo`; `pnpm test installation-e2e`; `pnpm test storybook-static --base <b>` for the three bases; every line green, flakes rerun once

### Milestone: Release PR

- Files owned: none
- Depends on: Integration
- Review: none
- Local CI: none (CI runs on the PR)
- Task 1: Open the PR with its label and auto-merge (1.6.3); arm the watcher. Checks: `gh pr view <N> --json labels,autoMergeRequest --jq '[.labels[].name, .autoMergeRequest.enabledAt != null]'` prints `["release:minor", true]`
- Task 2: Approve the Prepare Release deployment when it waits (1.6.3); record the response. Checks: `gh api repos/anindosarker/shadcn-table/actions/runs/<run_id>/pending_deployments` prints `[]` after the call; the bump commit `chore: version 0.9.0` is on `origin/dev`
- Task 3: The PR merges on green (1.6.3). Checks: `gh pr view <N> --json state,mergedAt --jq .state` prints `MERGED`; `git fetch origin && git show origin/master:packages/shadcn-table/package.json | grep '"version": "0.9.0"'`

### Milestone: After release

- Files owned: none
- Depends on: Release PR
- Review: none
- Local CI: none
- Task 1: Watch `release.yml` to green (1.6.4). Checks: the Acceptance lines of 1.2 for the tag, the release and the four `version.txt` URLs
- Task 2: Fast-forward `claude/review` and `dev` to `master`, push both; rewrite the handoff (1.6.4). Checks: `git rev-parse origin/claude/review origin/dev origin/master` prints one sha three times; `pnpm test validate-repo` green on `claude/review`

### 2.2 Checks

- Integration: `pnpm test --all` green on `dev` (per-base tests serial, P5 flakes rerun once)
- Release PR: `pr.yml` green including Prepare Release; the PR merged by auto-merge with `chore: version 0.9.0` in it
- After release: `release.yml` green (Check Release, Verify Deployment, Validate Production, Publish Release); tag `v0.9.0`; `gh release view v0.9.0`; the four `version.txt` print `0.9.0`; the three branches at one sha
- Review: none (operations only; no code change, P7 untouched)
