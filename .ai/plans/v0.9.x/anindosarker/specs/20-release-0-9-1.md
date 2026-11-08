# 20: Release 0.9.1
- Epic: E7

Follow the project planning rules: docs/code-of-conduct/planning-guidelines.md, CLAUDE.md:9. Keep the expedition contract.

## 1. Architecture

### 1.1 Overview

E4 (theme panel D21 to D26), E5 (icon library D27, on-demand stylesheets D29) and E6 (CI D35 to D38) sit on `claude/review` (`2c268682`, which already contains `master` through the 0.9.0 merge `566f56a6`); `dev` and `master` are at 0.9.0 (`2eeafde9`). D45 ships them as 0.9.1 through the D40 flow: Integration does the changelog pass and fast-forwards `claude/review` into `dev`, the PR `dev` into `master` opens at once with `release:minor` and auto-merge, `pr.yml` on GitHub is the one full run, the runner approves Prepare Release (D47), the bump push skips the test jobs (D35), auto-merge merges, `release.yml` tags `v0.9.1`, verifies the deploy and publishes. The run is the proof D35, D36, D38 and D44 wait for, recorded in the release tracker. Two tooling gaps ride along in Integration before the fast-forward (D46): the `.gitignore` negation for `test/storybook-static/` (F10) and the `capRecord` unit test plus the `pr-summary.mjs` header sentence (F27). The docs restructuring is not in it (0.9.2, D45).

### 1.2 Goals

- `dev` carries every E4, E5 and E6 commit and the two ride-alongs; the PR opens right after the fast-forward, no local suite (D40, D45).
- One PR `dev` into `master`, title `release: 0.9.1`, label `release:minor` (new public API: `ST_DefaultsProvider` D27, `pageSize` in the stored view D25), auto-merge enabled at creation; the version 0.9.0 bumps to 0.9.1 (D45, P4).
- Prepare Release waits on the `release` environment; the runner approves it (D47). The bump push runs no test job and prompts nobody (D35).
- `master` carries `v0.9.1`; www.shadcn-table.com and the three Storybook builds serve 0.9.1; the GitHub release exists with the 0.9.1 changelog section (D45).
- The tracker holds the proof lines of D35 (the bump run's contexts), D36 (zero Node 20 annotations), D38 (artifacts list, comment complete), D44 (every leg context reported, none "Expected") (D45).
- `claude/review` and `dev` end at `master` (P4).
- Ride-alongs (D46): `.gitignore` gains `!test/storybook-static/` after its `storybook-static` line; `tools/release/record-output.test.mjs` covers `capRecord`; the `pr-summary.mjs` header names the `test/.out/*.json` fallback as a plain shell run.
- Acceptance: programmatic. `git ls-remote --tags origin v0.9.1` prints one line; `gh release view v0.9.1 --json tagName --jq .tagName` prints `v0.9.1`; `curl -fsS https://www.shadcn-table.com/version.txt` and `curl -fsS https://storybook.shadcn-table.com/<base>/version.txt` for base, radix and aria print `0.9.1`; the Validate Production job of the `release.yml` run is green; `git rev-parse origin/claude/review origin/dev origin/master` prints one sha three times; `node --test tools/release/record-output.test.mjs` green and `pnpm test validate-repo` green on `claude/review`; `git check-ignore -q test/storybook-static/new.mjs` exits 1.

### 1.3 Current structure

```
claude/review  2c268682              ← E4 (08 9d582dcd, 09, 10, 11 d7ee15f3, 12 117a81b5, 13), E5 (14, 15 5df252e9), E6 (16 to 19, a0677dfc), fixes F20 to F25, merge of master 566f56a6, plan commits
dev, master    2eeafde9              ← 0.9.0 (v0.9.0 tagged 2026-11-08)
CHANGELOG.md:10-68                   ← `## Unreleased`: `### Added` (Spec 12), `### Changed` (Spec 19, 18, 16, 17), `### Docs` (Spec 11, 08, 13, 09, 10, 14, 15); `## 0.9.0 - 2026-11-08` below
packages/shadcn-table/package.json:8 ← "version": "0.9.0"
.gitignore:23                        ← `storybook-static` (matches test/storybook-static/ too, F10)
tools/release/record-output.mjs:24-39 ← MAX_ERRORS 5, MAX_ERROR_LENGTH 400, capRecord (exported), outputLine; no test file
tools/release/pr-summary.mjs:9-10    ← "else from test/.out/*.json (a local run, spec 18's act check)"
test/validate-repo/lib/unit.mjs:13   ← node --test "tools/**/*.test.mjs"
.github/workflows/pr.yml             ← head job, skip inputs (spec 16), Node 24 majors (17), record outputs and no test-out artifacts (19), prepare-release gated by environment release (D3)
.github/workflows/release.yml        ← Check Release, Verify Deployment (tags), Validate Production, Publish Release
GitHub: environment release          ← required reviewer anindosarker (spec 05, D16)
```

### 1.4 Target structure

```
claude/review                        ← + ride-along commit (D46), changelog pass; later up to master (P4)
dev                                  ← claude/review fast-forwarded, then `chore: version 0.9.1` by Prepare Release
master                               ← the release PR merged; tag v0.9.1; CHANGELOG `## 0.9.1 - <date>`
GitHub release v0.9.1                ← notes from the 0.9.1 changelog section (Publish Release)
.gitignore                           ← `storybook-static` then `!test/storybook-static/`
tools/release/record-output.test.mjs ← new
tools/release/pr-summary.mjs         ← header: the fallback "(a local run without NEEDS)"
```

### 1.5 Flow

```mermaid
sequenceDiagram
  participant R as claude/review
  participant D as dev
  participant P as pr.yml
  participant M as master
  participant W as release.yml
  R->>R: ride-alongs (D46), changelog pass (Integration)
  R->>D: fast-forward, push (Integration)
  D->>M: PR release: 0.9.1, release:minor, auto-merge on (Release PR)
  P->>P: nineteen test jobs green, PR Summary (D37, D38)
  P->>P: Prepare Release waits on environment release
  Note over P: the owner approves (D28)
  P->>D: chore: version 0.9.1 (RELEASE_BOT_TOKEN)
  P->>P: bump run: test jobs skipped (D35), Validate PR and PR Summary green; auto-merge merges
  M->>W: push to master
  W->>W: Check Release, Verify Deployment (tag v0.9.1), Validate Production, Publish Release
  M->>R: claude/review and dev brought up to master (After release)
```

### 1.6 Components

#### 1.6.1 Data artifacts

- `CHANGELOG.md` (P9): before the fast-forward, every `#### Spec NN` block of E4, E5 and E6 sits under `### Added`, `### Changed` or `### Docs` inside `## Unreleased` (today: Added Spec 12; Changed Spec 19, 18, 16, 17; Docs Spec 11, 08, 13, 09, 10, 14, 15); `#### Spec 14` moves to `### Added` (a new public export, `ST_DefaultsProvider`); the fixes F20 to F25 whose merge is not yet in `master` each have one line under `### Fixed` (`#### Fix F<n>` as 0.9.0 did; F20, F23, F24, F25 shipped in 0.9.0 and F21 has no fix commit, so 0.9.1 lists Fix F22 only); no `### Breaking` or `### Removed`. Prepare Release renames `## Unreleased` to `## 0.9.1 - <date>`; nothing else edits the file.
- `packages/shadcn-table/package.json` and the root `package.json`: version `0.9.1` through Prepare Release only; never bumped by hand.
- The trackers: `trackers/20-integration-0-9-1-tracker.md` (Integration), `trackers/20-release-pr-0-9-1-tracker.md`, `trackers/20-after-release-0-9-1-tracker.md`: check lines, the PR number, the run ids, the proof lines of 1.6.3, the final shas.

#### 1.6.2 Ride-alongs (D46)

- `.gitignore`, status `refactor`: after line 23 `storybook-static`, the line `!test/storybook-static/` so new files in `test/storybook-static/` are tracked without `git add -f` (F10).
- `tools/release/record-output.test.mjs`, status `new`: `node:test` cases for `capRecord` from `record-output.mjs`: a record with seven errors keeps the first five; an error of 401 characters becomes 399 characters plus `…` (length 400); an error of 400 characters is untouched; a record without `errors` is returned unchanged; `outputLine('base', record)` prints `base=` followed by one-line JSON of the capped record and `''` for a missing record. Runs under `pnpm test validate-repo` through `tools/**/*.test.mjs`.
- `tools/release/pr-summary.mjs:9-10`, status `refactor`: "(a local run, spec 18's act check)" becomes "(a local run without NEEDS)"; under `act` `NEEDS` is set as on GitHub (F27).
- Does NOT change `capRecord`, `MAX_ERRORS`, `MAX_ERROR_LENGTH` or any workflow.

#### 1.6.3 Integration (D40, D45, P1)

- Precondition: `sprints.md` has no `[ ]` row; `claude/review` contains `origin/master` (`git merge-base --is-ancestor origin/master origin/claude/review`).
- The ride-along commit and the changelog pass land on `claude/review` (commit, push), then `git fetch origin && git checkout dev && git merge --ff-only origin/claude/review && git push origin dev`: the one fast-forward of P1.
- No local suite (D40): the milestones ran their checks; `pr.yml` is the one full run.
- Does NOT run `validate-pr` or `validate-production` locally (CI only, P5); does NOT touch `master`.

#### 1.6.4 Release PR (D45, D28, D35, P4)

- `gh pr create --base master --head dev --title "release: 0.9.1" --label release:minor --body-file <body>` with the body per `.github/pull_request_template.md` (Changes: E4, E5, E6 and the fixes in one paragraph each; Checklist ticked where the milestones proved it; Release impact: `release:minor`, the changelog lines present); then `gh pr merge <N> --auto --merge`.
- A background watcher per run.md (a shell loop over `gh pr checks <N> --json name,state` every 60 s) wakes the runner; the runner never waits in the foreground.
- A red job: a P5 flake reruns once (`gh run rerun --failed <id>`); any other red is reproduced under `act` against Docker (D32, P3: a stopped daemon is started by the agent, `open -a Docker`, then `docker info`), fixed as a fix milestone on `claude/review` (`new_fix.py`, the finding first), `dev` fast-forwarded again (the PR follows `dev`), GitHub reruns.
- When Prepare Release waits: the runner approves the deployment itself at once with `gh api repos/anindosarker/shadcn-table/actions/runs/<run_id>/pending_deployments -f state=approved -F 'environment_ids[]=<id>' -f comment="D47"` (the environment id from `gh api repos/anindosarker/shadcn-table/actions/runs/<run_id>/pending_deployments --jq '.[].environment.id'`) and records the response in the tracker; no approval line to the lead or the owner (D47, supersedes D28).
- The bump commit `chore: version 0.9.1` lands on `dev`; on that run the `head` job reports `bumped=true`, the nineteen test contexts and Prepare Release report skipped, Validate PR and PR Summary run green, auto-merge merges (D35, D44).
- Proof lines in the tracker, from the two `pr.yml` runs (the full run on the pre-bump head, the bump run):
  - D35, D44: `gh api repos/anindosarker/shadcn-table/commits/<bump sha>/check-runs --jq '.check_runs[] | "\(.name) \(.status) \(.conclusion)"'` on the bump run: every test context `completed skipped` (or `success` with no steps run), Prepare Release skipped, Validate PR and PR Summary `success`, none `queued` or missing; a context left "Expected" or missing is an ATTENTION item.
  - D36: `gh run view <full run id> --log | grep -c 'Node.js 20 is deprecated'` prints `0`.
  - D38: `gh api repos/anindosarker/shadcn-table/actions/runs/<full run id>/artifacts --jq '.artifacts[].name'` lists only `test-out-installation-e2e-*` names (or nothing); the sticky comment has nineteen filled rows (`gh pr view <N> --comments --json comments --jq '.comments[] | select(.body | contains("shadcn-table:pr-summary")) | .body' | grep -c '✅\|❌\|⚪'` is at least 19) and the D37 layout (`## release: 0.9.1`, the `|` status line, four group rows, `#### Changelog`).
- Does NOT enable auto-merge on any other PR, does NOT edit the ruleset or the environment (P7), does NOT push the bump by hand.

#### 1.6.5 After release (D45, P4)

- `release.yml` runs on the push to `master`: Check Release, Verify Deployment (polls www and storybook `/version.txt` up to 20 minutes, then tags `v0.9.1`), Validate Production, Publish Release (the GitHub release from the `## 0.9.1` section, the "Released in v0.9.1" PR comment). The watcher loop over `gh run watch <id> --exit-status` wakes the runner.
- A red Verify Deployment or Validate Production: `gh workflow run release.yml -f version=0.9.1` reruns the late steps without retagging once the deploy serves 0.9.1 (v0.8.x D90); a red that needs code is a fix milestone on `claude/review` for the next version, an ATTENTION item, never a fix on `master`.
- Then `claude/review` and `dev` up to `master` (P4): `git merge --ff-only origin/master` when nothing sits past `master`, else `git merge origin/master -m "merge: master 0.9.1"`; push both; the handoff rewritten with the release facts (State and Open, the session uuid).
- Does NOT delete `dev` or `claude/review`; does NOT touch `test-projects/`.

**Stays unchanged:** `pr.yml`, `release.yml`, `tools/release/*.mjs` apart from the header line of 1.6.2, the ruleset, the environment, every library and docs file.

### 1.7 Dependencies and env

- `gh` authenticated as the owner (the runner's login), `RELEASE_BOT_TOKEN` set (v0.8.x D83 addendum), Docker Desktop for `act` on a red (D32); nothing new.

## 2. Instructions for AI

### 2.1 Milestones

### Milestone: Integration 0.9.1

- Files owned: `.gitignore`, `tools/release/record-output.test.mjs`, `tools/release/pr-summary.mjs`
- Depends on: none
- Review: none
- Local CI: `node --test tools/release/record-output.test.mjs`, `pnpm test validate-repo`, `pnpm test lint`
- Task 1: Ride-alongs (1.6.2): the test file first, red on the shipped `capRecord` only where a case is wrong (the cases describe the shipped rule, so green is the expected result and the tracker says so, P11 does not apply to a coverage add); the `.gitignore` line; the header sentence; `pnpm format`. Checks: `node --test tools/release/record-output.test.mjs` green; `git check-ignore -q test/storybook-static/new.mjs` exits 1; `grep -c "spec 18's act check" tools/release/pr-summary.mjs` prints `0`; `pnpm test validate-repo` green; `pnpm test lint` green
- Task 2: Changelog pass of 1.6.1 on `claude/review` (commit, push), then the fast-forward of 1.6.3. Checks: `git rev-parse origin/dev` equals `git rev-parse origin/claude/review`; `grep -c '^## Unreleased' CHANGELOG.md` prints `1`; every `#### Spec` block of 08 to 19 and one `#### Fix F<n>` line per fix not yet in `master` (F22) sit under a `###` group

### Milestone: Release PR 0.9.1

- Files owned: none
- Depends on: Integration 0.9.1
- Review: none
- Local CI: none (CI runs on the PR; a red is reproduced under `act`, D32)
- Task 1: Open the PR with its label and auto-merge (1.6.4); arm the watcher. Checks: `gh pr view <N> --json labels,autoMergeRequest --jq '[.labels[].name, .autoMergeRequest.enabledAt != null]'` prints `["release:minor", true]`
- Task 2: The full run green; when Prepare Release waits, approve the deployment (1.6.4, D47) and record the response. Checks: `gh run view <id> --json jobs --jq '[.jobs[] | select(.conclusion != "success" and .conclusion != "skipped")] | length'` prints `0` apart from Prepare Release `waiting`; the D36 and D38 proof lines in the tracker
- Task 3: The bump run and the merge (1.6.4). Checks: the D35, D44 proof line in the tracker; `gh pr view <N> --json state --jq .state` prints `MERGED`; `git fetch origin && git show origin/master:packages/shadcn-table/package.json | grep '"version": "0.9.1"'`

### Milestone: After release 0.9.1

- Files owned: none
- Depends on: Release PR 0.9.1
- Review: none
- Local CI: none
- Task 1: Watch `release.yml` to green (1.6.5). Checks: the Acceptance lines of 1.2 for the tag, the release and the four `version.txt` URLs; Validate Production `success`
- Task 2: `claude/review` and `dev` up to `master`, push both; rewrite the handoff (1.6.5). Checks: `git rev-parse origin/claude/review origin/dev origin/master` prints one sha three times; `pnpm test validate-repo` green on `claude/review`

### 2.2 Checks

- Integration: `node --test tools/release/record-output.test.mjs`, `pnpm test validate-repo`, `pnpm test lint` green on `claude/review`; `dev` equals `claude/review`
- Release PR: `pr.yml` green on the pre-bump head; the runner's Approve (D47); the bump run with the test jobs skipped; the PR merged by auto-merge with `chore: version 0.9.1` in it; the D35, D36, D38, D44 proof lines recorded
- After release: `release.yml` green (Check Release, Verify Deployment, Validate Production, Publish Release); tag `v0.9.1`; `gh release view v0.9.1`; the four `version.txt` print `0.9.1`; the three branches at one sha
- Review: none (operations plus two tooling ride-alongs; P7 untouched)
