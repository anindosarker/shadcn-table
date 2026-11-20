# 72: CI skip label fixes
- Epic: E21

Follow the project planning rules: docs/code-of-conduct/planning-guidelines.md, CLAUDE.md:9. Keep the expedition contract.

## 1. Architecture

### 1.1 Overview

Spec 71 added the PR label `ci:skip` (D153) and used it once, on PR 142. That first use showed two faults. The label is read on a PR into any branch, while D153 and the two documents say a PR into `master` (Q143). And PR 142, opened with the label as documented, stayed blocked on `16 of 21 required status checks are expected` until a second commit was pushed (Q144). This spec scopes the label to `master` (D154) and makes a labelled PR merge on its first run (D155). Both changes sit in the Head job and the trigger of `pr.yml`, so one builder does both. No release and no ship step: the milestone merges into `claude/review` and stops (P4, D100).

### 1.2 Goals

- `ci:skip` counts only when the PR's base branch is `master`; on any other base the Head job prints `skip=false` and every test job runs (D154).
- A PR into `master` created with `gh pr create --label release:skip --label ci:skip` is mergeable once its first run ends: no further push, no rerun (D155).
- The 21 required check contexts keep their names; a PR without the label, a `workflow_dispatch` and the version commit behave as today (P7).
- Acceptance: programmatic. Under `act`, Head prints `skip=false` for a labelled PR whose base is `dev` and `skip=true` for a labelled PR whose base is `master` (P3). On GitHub, a trial PR into `master` created with both labels reports `mergeStateStatus` `CLEAN` after its first run, with one push and no rerun; the same trial on the code before the change reports `BLOCKED`.

### 1.3 Current structure

```
.github/workflows/pr.yml:25-27     ← on: pull_request types opened, synchronize, reopened, labeled, unlabeled
.github/workflows/pr.yml:36-38     ← concurrency: one group for label events, one for the checks
.github/workflows/pr.yml:55-104    ← Head: skipped on label events; reads `ci:skip` live for any PR, whatever its base
.github/workflows/pr.yml:106-150   ← the four called workflows and Lint, Validate Repo: `if:` skips them on label events
.github/workflows/pr.yml:14-24     ← header comment: `ci:skip` set at `gh pr create --label`, or added later and followed by a rerun
run/trackers/71-ship-the-home-page-label-tracker.md:11-12 ← PR 142: three runs on the first head (opened, one per label), merge refused; one run on the second head, merged
CONTRIBUTING.md, docs/code-of-conduct/coding-standards.md ← already say "a PR into `master`" (D153); unchanged (D154)
```

### 1.4 Target structure

```
.github/workflows/pr.yml           ← Head: the label counts only when the base is `master`; the cause of the blocked merge removed; comments name D154 and D155
.github/workflows/pr-labels.yml    ← new, only when the cause is the label runs of `pr.yml` (1.6.2): the label-event work, under the same check names
```

### 1.6 Components

#### 1.6.1 Base branch (D154)

- The Head step gets `BASE: ${{ github.event.pull_request.base.ref }}`. The label read runs only when `BASE` is `master`; on another base `skip` equals `bumped` and the printed reason is `none, base <name>`.
- The comment above Head and the header comment say "a PR into `master`".
- Does NOT change `CONTRIBUTING.md` or `docs/code-of-conduct/coding-standards.md` (D154: they already say it), does NOT police the label in `test/validate-pr/`.

#### 1.6.2 First-run merge (D155)

- The cause is found before any edit. Likely, not proven (Q144): the three events of a PR created with two labels (opened, labeled, labeled) start three runs of `pr.yml` on one head; in a label run the callers of the four called workflows are skipped, so that run carries no matrix legs, and GitHub counts the 16 leg checks as expected when that run is the newest. On a normal release PR the legs run for minutes and end last, which hides it.
- Task 1 reproduces it with a trial PR on the code as it is and reads, for the head commit, every check run with its workflow run id, conclusion and completion time (`gh api repos/{owner}/{repo}/commits/<sha>/check-runs --paginate`) beside `gh pr view <N> --json mergeStateStatus,statusCheckRollup`. The tracker records which run owns the newest entry of each of the 21 contexts and states the cause in one sentence, with that evidence.
- The fix removes that cause at its source, in the workflow definition: no rerun step, no empty commit, no sleep. When the cause is the label runs, the label events leave `pr.yml` (its `types` lose `labeled` and `unlabeled`, its label conditions and the label concurrency group go) and the work they did (Validate PR and PR Summary on a label change) moves to `.github/workflows/pr-labels.yml`, with job names that keep the check contexts `Validate PR` and `PR Summary`. When the evidence shows another cause, the fix is the smallest change to `pr.yml` that removes it, and the tracker names why the label-run reading was wrong.
- The header comment of `pr.yml` is rewritten to the new behaviour: how a label set at creation and a label added later each take effect.
- Trial PRs (D155 allows them): head branch `v0.9/ci-skip-trial-<n>`, the milestone branch pushed under that name, base `master`, labels `release:skip` and `ci:skip`, title `trial: ci:skip, do not merge`, auto-merge never enabled, never merged. Each is closed and its branch deleted as soon as its reads are in the tracker. At most one open at a time.
- Proof before the push of each workflow edit (P3): `act pull_request -W .github/workflows/pr.yml -j head` for the three cases of 1.2 and D153 (labelled into `dev`, labelled into `master`, unlabelled into `master`); a new workflow file is run under `act` for a `labeled` event. What `act` cannot show (how GitHub counts required checks across runs) is proven by the trial PR and named in the tracker.
- Does NOT change the ruleset, its required checks or the `release` environment (P7), does NOT rename a check context, does NOT change `release.yml`, `tools/release/` or the four called workflows, does NOT merge a trial PR, does NOT use `ci:skip` on any real PR, does NOT write a `CHANGELOG.md` line (tooling, ships nothing).

**Stays unchanged:** `CONTRIBUTING.md`, `docs/code-of-conduct/coding-standards.md`, `test/validate-pr/`, the label `ci:skip` itself, `package.json` and the lockfile.

### 1.7 Dependencies and env

- `gh` authenticated as the owner (the runner's login); Docker Desktop for `act` (started by the agent when it is down, P3); nothing new.

## 2. Instructions for AI

### 2.1 Milestones

### Milestone: CI skip label fixes

- Files owned: `.github/workflows/pr.yml`, `.github/workflows/pr-labels.yml`
- Depends on: none
- Review: fable
- Local CI: `pnpm test lint`, `pnpm test validate-repo`, the `act` runs of 1.6.2
- Task 1: The trial PR on the code before any change, and the cause (1.6.2, P11). Checks: `gh pr view <N> --json mergeStateStatus --jq .mergeStateStatus` prints `BLOCKED` after the first run ended; the tracker holds the per-context table (context, run id, conclusion, completed at) and the cause sentence; the trial PR is closed and its branch deleted (`gh pr view <N> --json state --jq .state` prints `CLOSED`, `git ls-remote --heads origin 'v0.9/ci-skip-trial-*'` prints nothing)
- Task 2: The base branch condition (1.6.1). Checks: `act pull_request -W .github/workflows/pr.yml -j head` prints `skip=false` for the labelled PR into `dev`, `skip=true` for the labelled PR into `master`, `skip=false` for the unlabelled PR into `master`, the three lines in the tracker with what `act` could not reproduce named (P3)
- Task 3: The fix of the cause and the comments (1.6.2). Checks: the `act` runs of 1.6.2 recorded; a new trial PR on the fixed code: `gh pr view <N> --json mergeStateStatus --jq .mergeStateStatus` prints `CLEAN` after its first run, `gh run list --branch v0.9/ci-skip-trial-<n> --json databaseId --jq length` and the tracker show no rerun and one push; `gh pr view <N> --json statusCheckRollup --jq '[.statusCheckRollup[] | select(.conclusion != "SUCCESS" and .conclusion != "SKIPPED")] | length'` prints `0`; the trial PR closed and its branch deleted as in Task 1; `pnpm test lint` and `pnpm test validate-repo` green

### 2.2 Checks

- CI skip label fixes: the red trial before, the green trial after, the three `act` lines, lint and validate-repo green; review by fable on the whole diff (a change to what gates `master`)
- Worktrees from the pool 01 to 09 only; the root checkout, `wt1` and `wt2` are never used for a checkout, an install or a build (P2); heavy checks one at a time (P5)
