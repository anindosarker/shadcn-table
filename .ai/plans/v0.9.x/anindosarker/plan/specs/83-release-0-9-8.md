# 83: Release 0.9.8
- Epic: E26

Follow the project planning rules: docs/code-of-conduct/planning-guidelines.md, CLAUDE.md:9. Keep the expedition contract.

## 1. Architecture

### 1.1 Overview

`master`, `dev` and the code of `claude/review` are at 0.9.7 plus the docs-only changes that shipped without a version (specs 70 to 77). The owner's word for this release is in the epic file: "implement everything autonomously", ending in a normal table release (epic E26 Notes, 2026-11-24; D100, P4). 0.9.8 ships the date picker filters and the is-empty reset fix of spec 82 on the tooling of spec 81 (D164, D165). The library changes, so the release runs the full flow spec 69 ran for 0.9.7 (D40, D47, D49, D35), with no `ci:skip` and no `release:skip`.

### 1.2 Goals

- `dev` carries every commit of `claude/review` up to the changelog pass; the PR opens right after the fast-forward, no local suite (D40).
- One PR `dev` into `master`, title `release: 0.9.8`, label `release:patch`, auto-merge enabled at creation; the version 0.9.7 bumps to 0.9.8. Every v0.9.x release stays on the 0.9.x line, also with a `### Changed` block in the changelog (D49).
- Prepare Release waits on the `release` environment; the runner approves it (D47). The bump push runs no test job (D35).
- `master` carries `v0.9.8`; www.shadcn-table.com and the Storybook host serve 0.9.8; the GitHub release exists with the 0.9.8 changelog section.
- On the live site a date filter shows the date picker on the three bases, and the hosted core item of each base depends on the date picker item at the pinned tag (D164).
- A fresh app that installs the table from the public address gets the date picker with it (D164).
- `claude/review` and `dev` end at `master` (P4).
- Acceptance: programmatic. `git ls-remote --tags origin v0.9.8` prints one line; `gh release view v0.9.8 --json tagName --jq .tagName` prints `v0.9.8`; `curl -fsS https://www.shadcn-table.com/version.txt` and `curl -fsS https://storybook.shadcn-table.com/version.txt` print `0.9.8`; the live checks of 1.6.3 pass; `git rev-parse origin/claude/review origin/dev origin/master` prints one sha three times.

### 1.3 Current structure

```
master, dev                               ← 0.9.7 (v0.9.7) plus the unversioned docs merges of specs 70 to 77
claude/review                             ← contains master; plan files; after specs 81 and 82 their milestones
v0.9/filter-input-fixes                   ← spec 50, stopped (D164, D165); fd7059b6 reused by spec 82; never merged
CHANGELOG.md                              ← `## Unreleased` with `### Docs` blocks of specs 70 to 77 that are already live; spec 82 adds `### Changed` and `### Fixed`
packages/shadcn-table/package.json:8      ← "version": "0.9.7"
```

### 1.4 Target structure

```
claude/review    ← specs 81 and 82 merged; changelog pass; later up to master (P4)
dev              ← claude/review fast-forwarded, then `chore: version 0.9.8` by Prepare Release
master           ← the release PR merged; tag v0.9.8; CHANGELOG `## 0.9.8 - <date>`
GitHub release v0.9.8 ← notes from the 0.9.8 changelog section (Publish Release)
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
  D->>M: PR release: 0.9.8, release:patch, auto-merge on (Release PR)
  P->>P: test jobs green, PR Summary
  P->>P: Prepare Release waits on environment release
  Note over P: the runner approves (D47)
  P->>D: chore: version 0.9.8 (RELEASE_BOT_TOKEN)
  P->>P: bump run: test jobs skipped (D35); auto-merge merges
  M->>W: push to master
  W->>W: Check Release, Verify Deployment (tag v0.9.8), Validate Production, Publish Release
  M->>R: claude/review and dev brought up to master (After release)
```

### 1.6 Components

#### 1.6.1 Integration (D40, P1)

- Precondition: `status/sprints.md` has no `·`, `[ ]` or `[~]` row of spec 81 or spec 82 and no `[!]` row among them; `claude/review` contains `origin/master`; `git log --oneline origin/master..origin/claude/review -- . ':!.ai'` lists only commits of specs 81 and 82 and their fixes.
- The changelog pass on `claude/review`, one commit when anything moves, pushed: `## Unreleased` holds the blocks the specs wrote (P9); each `#### Spec ...` block sits under one heading of its kind in the order `### Added`, `### Changed`, `### Fixed`, `### Docs`, headings without a block left out; each block's text is kept and no claim is added. Prepare Release renames `## Unreleased` to `## 0.9.8 - <date>`; nothing else edits the file.
- Then the fast-forward of `dev` to the head of `claude/review`, pushed (`git push origin <claude/review head>:refs/heads/dev`, a plain push, or `git merge --ff-only` in a pool worktree), never in the root checkout (P2).
- No local suite (D40): the milestones of specs 81 and 82 ran their checks on three bases; `pr.yml` is the one full run. `validate-repo` and `lint` run once on the head as a cheap guard.
- Does NOT merge `v0.9/filter-input-fixes`; does NOT touch `master`; does NOT run `validate-pr` or `validate-production` locally (P5); does NOT bump a version by hand.

#### 1.6.2 Release PR (D49, D47, D35, P4)

- `gh pr create --base master --head dev --title "release: 0.9.8" --label release:patch --body-file <body>` with the body per `.github/pull_request_template.md` (Changes: date filters use the date picker, the is-empty reset fix; Checklist ticked where the milestones proved it; Release impact: `release:patch` by D49, the changelog lines present); then `gh pr merge <N> --auto --merge`. No `ci:skip`, no `release:skip` label.
- If Validate PR refuses the patch label against the `### Changed` block, the cause is read in `test/validate-pr/lib/release-label.mjs` and settled as a fix milestone of this spec that keeps D49 (the 0.9.1 release shipped new API with the patch label); the version is not moved to 0.10.0 without a decision.
- A background watcher per run.md (a shell loop over `gh pr checks <N> --json name,state` every 60 s) wakes the runner; the runner never waits in the foreground.
- A red job: a P5 flake reruns once (`gh run rerun --failed <id>`); any other red is reproduced under `act` against Docker, or in a Linux container when `act` cannot run the job on this machine (D32, P3), fixed as a fix milestone of this spec on `claude/review` (`plan/new_fix.py`, the queue card first), `dev` fast-forwarded again, GitHub reruns. Installation E2E pixel references that differ because a date filter is in the capture are refreshed from a `pr.yml` dispatch with `installation-e2e-only=true` (P5).
- When Prepare Release waits: the runner approves the deployment itself at once with `gh api repos/anindosarker/shadcn-table/actions/runs/<run_id>/pending_deployments -X POST -f state=approved -F 'environment_ids[]=<id>' -f comment="D47"` (the environment id from the same endpoint, `--jq '.[].environment.id'`) and records the response in the tracker (D47).
- The bump commit `chore: version 0.9.8` lands on `dev`; on that run the test contexts and Prepare Release report skipped, Validate PR and PR Summary run green, auto-merge merges (D35).
- Does NOT enable auto-merge on any other PR, does NOT edit the ruleset or the environment (P7), does NOT push the bump by hand.

#### 1.6.3 After release (P4)

- `release.yml` runs on the push to `master`: Check Release, Verify Deployment (polls www and storybook `/version.txt`, then tags `v0.9.8`), Validate Production, Publish Release. The watcher loop over `gh run watch <id> --exit-status` wakes the runner.
- A red Verify Deployment or Validate Production: `gh workflow run release.yml -f version=0.9.8` reruns the late steps without retagging once the deploy serves 0.9.8 (v0.8.x D90); a red that needs code is a fix milestone on `claude/review` for the next version and a queue card, never a fix on `master`.
- The live checks, each recorded in the tracker with what was read:
  - `https://www.shadcn-table.com/r/base/shadcn-table-core.json`, `/r/radix/...` and `/r/aria/...`: `registryDependencies` holds `anindosarker/shadcn-date-picker/date-picker-<base>#v0.1.0` (the tag of `DATE_PICKER_TAG` at the release commit).
  - In a browser, `https://storybook.shadcn-table.com/base/`, `/radix/` and `/aria/`, the story `Date Filters` default: the date filter box opens the date picker popup, a picked day filters the rows.
  - In a browser, one docs example with a date filter on `https://www.shadcn-table.com/docs/examples/` (the one the tracker of spec 82 names), on the three bases: the same.
  - A fresh Next.js app with the `base-nova` style in a scratch folder: `pnpm dlx shadcn@latest add` of the table by its public address writes `components/date-picker/date-picker.tsx`; `tsc --noEmit` passes; the scratch folder deleted.
- Then `claude/review` and `dev` up to `master` (P4): `git merge --ff-only origin/master` when nothing sits past `master`, else `git merge origin/master -m "merge: master 0.9.8"`; push both. The handoff is rewritten with the release facts.
- A missed live check is a queue card, not a fix on `master`. The DONE line to the lead names the version, the date picker tag the table depends on and the result of the fresh-app install, so the lead can tell the owner the release is out.
- Does NOT delete `dev`, `claude/review` or `v0.9/filter-input-fixes`; does NOT touch `test-projects/`; does NOT move the owner's worktrees `wt1` and `wt2`.

**Stays unchanged:** `pr.yml`, `release.yml`, `tools/release/*.mjs`, the ruleset, the environment, every library and docs file (specs 81 and 82 bring the changes, no task here edits one), the repository `shadcn-date-picker`.

### 1.7 Dependencies and env

- `gh` authenticated as the owner (the runner's login), `RELEASE_BOT_TOKEN` set (v0.8.x D83 addendum), Docker Desktop on a red (D32; started by the agent when needed); nothing new.

## 2. Instructions for AI

### 2.1 Milestones

### Milestone: Integration 0.9.8

- Files owned: `CHANGELOG.md`
- Depends on: Date filters use the date picker
- Review: none
- Local CI: `pnpm test validate-repo`, `pnpm test lint`
- Task 1: The precondition of 1.6.1. Checks: `git merge-base --is-ancestor origin/master origin/claude/review` exits 0; `git merge-base --is-ancestor origin/v0.9/filter-input-fixes origin/claude/review` exits 1; the trackers `81-date-picker-in-table-build` and `82-date-filters-on-date-picker` say `Status: done`
- Task 2: The changelog pass on `claude/review` (1.6.1). Checks: `grep -c '^## Unreleased' CHANGELOG.md` prints `1`; the `### ` headings of the section are in the order Added, Changed, Fixed, Docs, each at most once; the count of `#### ` lines in the section equals the count before the pass; `pnpm test validate-repo` and `pnpm test lint` green, one at a time (P5)
- Task 3: The fast-forward of `dev` (1.6.1). Checks: `git rev-parse origin/dev` equals the head of `claude/review` the pass ended on

### Milestone: Release PR 0.9.8

- Files owned: none
- Depends on: Integration 0.9.8
- Review: none
- Local CI: none (CI runs on the PR; a red is reproduced locally, D32)
- Task 1: Open the PR with its label and auto-merge (1.6.2); arm the watcher. Checks: `gh pr view <N> --json labels,autoMergeRequest --jq '[.labels[].name, .autoMergeRequest.enabledAt != null]'` prints `["release:patch", true]`
- Task 2: The full run green; when Prepare Release waits, approve the deployment (1.6.2, D47) and record the response. Checks: `gh run view <id> --json jobs --jq '[.jobs[] | select(.conclusion != "success" and .conclusion != "skipped")] | length'` prints `0` apart from Prepare Release `waiting`; no test job reads `skipped` on the first run
- Task 3: The bump run and the merge (1.6.2). Checks: `gh pr view <N> --json state --jq .state` prints `MERGED`; `git fetch origin && git show origin/master:packages/shadcn-table/package.json | grep '"version": "0.9.8"'`

### Milestone: After release 0.9.8

- Files owned: none
- Depends on: Release PR 0.9.8
- Review: none
- Local CI: none
- Task 1: Watch `release.yml` to green (1.6.3). Checks: the Acceptance lines of 1.2 for the tag, the release and the two `version.txt` URLs; Validate Production `success`
- Task 2: The live checks of 1.6.3. Checks: one line per check in the tracker with what was read and pass or fail; the browser closed; the scratch app deleted
- Task 3: `claude/review` and `dev` up to `master`, push both; rewrite the handoff (1.6.3). Checks: `git rev-parse origin/claude/review origin/dev origin/master` prints one sha three times; `git ls-remote --heads origin v0.9/filter-input-fixes` prints one line; `pnpm test validate-repo` green on `claude/review`

### Milestone: Docs copied check waits for the label

- Files owned: `test/docs-e2e/lib/helpers.mjs`, `test/docs-e2e/lib/getting-started.mjs`
- Depends on: Theme customizer, Theme panel copy import, Theme panel shortcut row, Theme check closes the search dialog, Theme hotkey checks wait for the change, Theme color picker, Icon library select, Style sheet on demand, Perf budgets on CI, Richer live demo, Filter editor fixes, React Aria filter popups modal again (D97), Live demo ten columns, Comparison page, Guide example block, Example ids and 404 page, Docs code panels, Docs code panel check passes in CI, Version labels, Home page version label, Example toolbar on a phone, Date filters use the date picker
- Review: none
- Starts: S45
- Task 1: Docs copied check waits for the label (Q174). Checks: every copied-state check waits for the Copied button (a locator wait with a timeout), no fixed waitForTimeout before a single count; pnpm test docs-e2e --base radix green; pnpm test lint green; process.md P5 untouched

### 2.2 Checks

- Local CI as in the milestone blocks; the release suite runs on GitHub only (P4).
- Review: none (operations only; P7 untouched).
