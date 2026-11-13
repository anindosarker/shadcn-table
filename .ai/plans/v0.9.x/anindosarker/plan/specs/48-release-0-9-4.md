# 48: Release 0.9.4

Follow the project planning rules: docs/code-of-conduct/planning-guidelines.md, CLAUDE.md:9. Keep the expedition contract.

## 1. Architecture

### 1.1 Overview

`dev` and `master` are at 0.9.3 (`9378b9f8`, tag `v0.9.3`, 2026-11-12). Once this epic's other milestones merge, `claude/review` carries specs 39 to 47 and 49: the filter debounce hook, the date filter fix, four filter editor fixes, the caption gap, the ten-column live demo, the comparison page and the home hero wording. D89: E12 ships as 0.9.4 in the same epic, through the D40 flow spec 38 ran for 0.9.3. Integration does the changelog pass and fast-forwards `claude/review` into `dev`, the PR `dev` into `master` opens at once with `release:patch` (D49) and auto-merge, `pr.yml` on GitHub is the one full run, the runner approves Prepare Release (D47), the bump push skips the test jobs (D35), auto-merge merges, `release.yml` tags `v0.9.4`, verifies the deploy and publishes. There is no preview stop; the one owner step of the epic, the read of the comparison table, happens inside spec 47 before its milestone merges (D89).

### 1.2 Goals

- `dev` carries every commit of `claude/review` up to the last merge of specs 39 to 47 and 49; the PR opens right after the fast-forward, no local suite (D40, D89).
- One PR `dev` into `master`, title `release: 0.9.4`, label `release:patch` (D49), auto-merge enabled at creation; the version 0.9.3 bumps to 0.9.4 (P4).
- Prepare Release waits on the `release` environment; the runner approves it (D47). The bump push runs no test job and prompts nobody (D35).
- `master` carries `v0.9.4`; www.shadcn-table.com and the Storybook host serve 0.9.4; the GitHub release exists with the 0.9.4 changelog section.
- The live site shows the release's visible parts: the D90 hero line on `/`, the comparison page (D71), the ten-column live demo source (D84).
- `claude/review` and `dev` end at `master` (P4).
- Acceptance: programmatic. `git ls-remote --tags origin v0.9.4` prints one line; `gh release view v0.9.4 --json tagName --jq .tagName` prints `v0.9.4`; `curl -fsS https://www.shadcn-table.com/version.txt` and `curl -fsS https://storybook.shadcn-table.com/version.txt` print `0.9.4`; `curl -s https://www.shadcn-table.com/ | sed 's/<[^>]*>//g' | grep -c 'The open-source shadcn data table for React'` prints at least 1; `curl -s https://www.shadcn-table.com/ | grep -o '<title>[^<]*</title>'` prints `<title>shadcn-table: React Data Table for shadcn/ui and TanStack</title>`; `curl -s -o /dev/null -w '%{http_code}' https://www.shadcn-table.com/docs/getting-started/comparison` prints `200`; `curl -s https://www.shadcn-table.com/r/base/shadcn-table-base.json | grep -c useST_DebouncedCallback` prints at least 1 (the hosted item path as `public/r/` names it; the builder reads the exact file name from `public/r/base/` before the check); the Validate Production job of the `release.yml` run is green; `git rev-parse origin/claude/review origin/dev origin/master` prints one sha three times.

### 1.3 Current structure

```
claude/review                        ← contains master 9378b9f8; plan commits; specs 39 to 47 and 49 merge here in this epic
dev, master    9378b9f8              ← 0.9.3 (v0.9.3 tagged 2026-11-12)
CHANGELOG.md                         ← `## Unreleased` with no block; `## 0.9.3 - 2026-11-12` below
packages/shadcn-table/package.json:8 ← "version": "0.9.3"
.github/workflows/pr.yml             ← head job, skip inputs (D35), record outputs (D38), prepare-release gated by environment release (D3)
.github/workflows/release.yml        ← Check Release, Verify Deployment (tags), Validate Production, Publish Release
GitHub: environment release          ← required reviewer; the runner approves through pending_deployments (D47)
```

### 1.4 Target structure

```
claude/review                        ← changelog pass; later up to master (P4)
dev                                  ← claude/review fast-forwarded, then `chore: version 0.9.4` by Prepare Release
master                               ← the release PR merged; tag v0.9.4; CHANGELOG `## 0.9.4 - <date>`
GitHub release v0.9.4                ← notes from the 0.9.4 changelog section (Publish Release)
```

### 1.5 Flow

```mermaid
sequenceDiagram
  participant R as claude/review
  participant D as dev
  participant P as pr.yml
  participant M as master
  participant W as release.yml
  R->>R: changelog pass (Integration)
  R->>D: fast-forward, push (Integration)
  D->>M: PR release: 0.9.4, release:patch, auto-merge on (Release PR)
  P->>P: test jobs green, PR Summary (D37, D38)
  P->>P: Prepare Release waits on environment release
  Note over P: the runner approves (D47)
  P->>D: chore: version 0.9.4 (RELEASE_BOT_TOKEN)
  P->>P: bump run: test jobs skipped (D35); auto-merge merges
  M->>W: push to master
  W->>W: Check Release, Verify Deployment (tag v0.9.4), Validate Production, Publish Release
  M->>R: claude/review and dev brought up to master (After release)
```

### 1.6 Components

#### 1.6.1 Data artifacts

- `CHANGELOG.md` (P9): before the fast-forward, `## Unreleased` holds exactly: `### Added` with `#### Spec 39`; `### Changed` with `#### Spec 45`, `#### Spec 49`; `### Fixed` with `#### Spec 40 Date filter compare`, `#### Spec 40 React Query route dates`, `#### Spec 41`, `#### Spec 42`, `#### Spec 43`, `#### Spec 44`; `### Docs` with `#### Spec 46`, `#### Spec 47`. A fix milestone merged in this epic (a row `fix ...` in `status/sprints.md`) gets one `#### Fix <queue id>` line under `### Fixed`. The pass reorders and completes the blocks the milestones wrote; it writes no new claim. Prepare Release renames `## Unreleased` to `## 0.9.4 - <date>`; nothing else edits the file.
- `packages/shadcn-table/package.json` and the root `package.json`: version `0.9.4` through Prepare Release only; never bumped by hand.
- The trackers: `run/trackers/48-integration-0-9-4-tracker.md`, `48-release-pr-0-9-4-tracker.md`, `48-after-release-0-9-4-tracker.md`: check lines, the PR number, the run ids, the approval response, the final shas.

#### 1.6.2 Integration (D40, D89, P1)

- Precondition: specs 39 to 47 and 49 merged (`status/sprints.md` has no `·`, `[ ]` or `[!]` row for them; a `[!]` row stops this milestone and becomes a queue card, the release does not ship a partial epic); the comparison page milestone merged only after the owner's read (spec 47, D89); `claude/review` contains `origin/master` (`git merge-base --is-ancestor origin/master origin/claude/review`).
- The changelog pass of 1.6.1 lands on `claude/review` (commit, push); then `git fetch origin && git checkout dev && git merge --ff-only origin/claude/review && git push origin dev`: the one fast-forward of P1.
- No local suite (D40): the milestones ran their checks; `pr.yml` is the one full run. No preview stop and no message to the owner before the PR (D89).
- Does NOT run `validate-pr` or `validate-production` locally (CI only, P5); does NOT touch `master`; does NOT include any docs restructuring work.

#### 1.6.3 Release PR (D89, D49, D47, D35, P4)

- `gh pr create --base master --head dev --title "release: 0.9.4" --label release:patch --body-file <body>` with the body per `.github/pull_request_template.md` (Changes: one paragraph per spec 39 to 47 and 49; Checklist ticked where the milestones proved it; Release impact: `release:patch`, the changelog lines present); then `gh pr merge <N> --auto --merge`.
- A background watcher per run.md (a shell loop over `gh pr checks <N> --json name,state` every 60 s) wakes the runner; the runner never waits in the foreground.
- A red job: a P5 flake reruns once (`gh run rerun --failed <id>`); any other red is reproduced under `act` against Docker (D32, P3: a stopped daemon is started by the agent, the owner keeps Docker off otherwise), fixed as a fix milestone on `claude/review` (`new_fix.py`, the queue card first), `dev` fast-forwarded again (the PR follows `dev`), GitHub reruns.
- When Prepare Release waits: the runner approves the deployment itself at once with `gh api repos/anindosarker/shadcn-table/actions/runs/<run_id>/pending_deployments -f state=approved -F 'environment_ids[]=<id>' -f comment="D47"` (the environment id from `gh api repos/anindosarker/shadcn-table/actions/runs/<run_id>/pending_deployments --jq '.[].environment.id'`) and records the response in the tracker; no approval line to the lead or the owner (D47).
- The bump commit `chore: version 0.9.4` lands on `dev`; on that run the `head` job reports `bumped=true`, the test contexts and Prepare Release report skipped, Validate PR and PR Summary run green, auto-merge merges (D35, D44).
- Does NOT enable auto-merge on any other PR, does NOT edit the ruleset or the environment (P7), does NOT push the bump by hand, does NOT use `release:minor` (D49).

#### 1.6.4 After release (D89, P4)

- `release.yml` runs on the push to `master`: Check Release, Verify Deployment (polls www and storybook `/version.txt` up to 20 minutes, then tags `v0.9.4`), Validate Production, Publish Release (the GitHub release from the `## 0.9.4` section, the "Released in v0.9.4" PR comment). The watcher loop over `gh run watch <id> --exit-status` wakes the runner.
- A red Verify Deployment or Validate Production: `gh workflow run release.yml -f version=0.9.4` reruns the late steps without retagging once the deploy serves 0.9.4 (v0.8.x D90); a red that needs code is a fix milestone on `claude/review` for the next version and a queue card, never a fix on `master`.
- Then `claude/review` and `dev` up to `master` (P4): `git merge --ff-only origin/master` when nothing sits past `master`, else `git merge origin/master -m "merge: master 0.9.4"`; push both; the handoff rewritten with the release facts (State and Open, the session uuid).
- The live checks of 1.2 recorded in the tracker; a miss is a queue card, not a fix on `master`. The DONE line to the lead names the live hero check so the lead can tell the owner the release is out.
- Does NOT delete `dev` or `claude/review`; does NOT touch `test-projects/`; does NOT re-submit the sitemap or request indexing.

**Stays unchanged:** `pr.yml`, `release.yml`, `tools/release/*.mjs`, the ruleset, the environment, every library and docs file.

### 1.7 Dependencies and env

- `gh` authenticated as the owner (the runner's login), `RELEASE_BOT_TOKEN` set (v0.8.x D83 addendum), Docker Desktop for `act` on a red (D32; started by the agent when needed); nothing new.

## 2. Instructions for AI

### 2.1 Milestones

### Milestone: Integration 0.9.4

- Files owned: `CHANGELOG.md`
- Depends on: 39, 40, 41, 42, 43, 44, 45, 46, 47, 49
- Review: none
- Local CI: `pnpm test validate-repo`, `pnpm test lint`
- Task 1: Changelog pass of 1.6.1 on `claude/review` (commit and push), then the fast-forward of 1.6.2. Checks: `git rev-parse origin/dev` equals `git rev-parse origin/claude/review`; `grep -c '^## Unreleased' CHANGELOG.md` prints `1`; `awk '/^## Unreleased/{p=1;next} p&&/^## /{exit} p' CHANGELOG.md | grep -E '^###+ '` prints the headings of 1.6.1 and no other

### Milestone: Release PR 0.9.4

- Files owned: none
- Depends on: Integration 0.9.4
- Review: none
- Local CI: none (CI runs on the PR; a red is reproduced under `act`, D32)
- Task 1: Open the PR with its label and auto-merge (1.6.3); arm the watcher. Checks: `gh pr view <N> --json labels,autoMergeRequest --jq '[.labels[].name, .autoMergeRequest.enabledAt != null]'` prints `["release:patch", true]`
- Task 2: The full run green; when Prepare Release waits, approve the deployment (1.6.3, D47) and record the response. Checks: `gh run view <id> --json jobs --jq '[.jobs[] | select(.conclusion != "success" and .conclusion != "skipped")] | length'` prints `0` apart from Prepare Release `waiting`
- Task 3: The bump run and the merge (1.6.3). Checks: `gh pr view <N> --json state --jq .state` prints `MERGED`; `git fetch origin && git show origin/master:packages/shadcn-table/package.json | grep '"version": "0.9.4"'`

### Milestone: After release 0.9.4

- Files owned: none
- Depends on: Release PR 0.9.4
- Review: none
- Local CI: none
- Task 1: Watch `release.yml` to green (1.6.4). Checks: the Acceptance lines of 1.2 for the tag, the release, the two `version.txt` URLs and the four live checks; Validate Production `success`
- Task 2: `claude/review` and `dev` up to `master`, push both; rewrite the handoff (1.6.4). Checks: `git rev-parse origin/claude/review origin/dev origin/master` prints one sha three times; `pnpm test validate-repo` green on `claude/review`

### 2.2 Checks

- Integration: `pnpm test validate-repo`, `pnpm test lint` green on `claude/review`; `dev` equals `claude/review`
- Release PR: `pr.yml` green on the pre-bump head; the runner's Approve (D47); the bump run with the test jobs skipped; the PR merged by auto-merge with `chore: version 0.9.4` in it
- After release: `release.yml` green (Check Release, Verify Deployment, Validate Production, Publish Release); tag `v0.9.4`; `gh release view v0.9.4`; both `version.txt` print `0.9.4`; the live hero line, title, comparison page and hosted hook checks of 1.2; the three branches at one sha
- Review: none (operations only; P7 untouched)
