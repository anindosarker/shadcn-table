# 69: Release 0.9.7
- Epic: E19

Follow the project planning rules: docs/code-of-conduct/planning-guidelines.md, CLAUDE.md:9. Keep the expedition contract.

## 1. Architecture

### 1.1 Overview

`master`, `dev` and the code of `claude/review` are at 0.9.6 (`022f8770`, tag `v0.9.6`, 2026-11-19). D149 is the owner's word for this release ("do a new release with both changes, Epic and Go", 2026-11-19; D100, P4): 0.9.7 ships the two version labels of spec 68 and nothing else. The release runs the flow spec 67 ran for 0.9.6 (D40, D47, D49, D35).

### 1.2 Goals

- `dev` carries every commit of `claude/review` up to the changelog pass; the PR opens right after the fast-forward, no local suite (D40).
- One PR `dev` into `master`, title `release: 0.9.7`, label `release:patch` (D49), auto-merge enabled at creation; the version 0.9.6 bumps to 0.9.7 (P4).
- Prepare Release waits on the `release` environment; the runner approves it (D47). The bump push runs no test job (D35).
- `master` carries `v0.9.7`; www.shadcn-table.com and the Storybook host serve 0.9.7; the GitHub release exists with the 0.9.7 changelog section.
- On the live site the docs header reads `// shadcn-table v0.9.7` and the Storybook title reads `shadcn-table v0.9.7 (<base label>)` on the three bases (D149).
- `claude/review` and `dev` end at `master` (P4).
- Spec 50 and its branch `v0.9/filter-input-fixes`, and any date picker work, are not part of this release.
- Acceptance: programmatic. `git ls-remote --tags origin v0.9.7` prints one line; `gh release view v0.9.7 --json tagName --jq .tagName` prints `v0.9.7`; `curl -fsS https://www.shadcn-table.com/version.txt` and `curl -fsS https://storybook.shadcn-table.com/version.txt` print `0.9.7`; the live label checks of 1.6.3 pass; `git rev-parse origin/claude/review origin/dev origin/master` prints one sha three times.

### 1.3 Current structure

```
master, dev      022f8770                 ← 0.9.6 (v0.9.6 tagged 2026-11-19)
claude/review                             ← contains master; plan files; after spec 68 its milestone
v0.9/filter-input-fixes                   ← spec 50, held with Q84 and Q88; not merged anywhere
v0.9/docs-version-label                   ← the owner's preview branch of D147; not merged, spec 68 takes its commit over
CHANGELOG.md:10                           ← `## 0.9.6 - 2026-11-19`; spec 68 adds `## Unreleased` with its block (P9)
packages/shadcn-table/package.json:8      ← "version": "0.9.6"
```

### 1.4 Target structure

```
claude/review    ← spec 68 merged; changelog pass; later up to master (P4)
dev              ← claude/review fast-forwarded, then `chore: version 0.9.7` by Prepare Release
master           ← the release PR merged; tag v0.9.7; CHANGELOG `## 0.9.7 - <date>`
GitHub release v0.9.7 ← notes from the 0.9.7 changelog section (Publish Release)
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
  D->>M: PR release: 0.9.7, release:patch, auto-merge on (Release PR)
  P->>P: test jobs green, PR Summary
  P->>P: Prepare Release waits on environment release
  Note over P: the runner approves (D47)
  P->>D: chore: version 0.9.7 (RELEASE_BOT_TOKEN)
  P->>P: bump run: test jobs skipped (D35); auto-merge merges
  M->>W: push to master
  W->>W: Check Release, Verify Deployment (tag v0.9.7), Validate Production, Publish Release
  M->>R: claude/review and dev brought up to master (After release)
```

### 1.6 Components

#### 1.6.1 Integration (D149, D40, P1)

- Precondition: `status/sprints.md` has no `·`, `[ ]`, `[~]` or `[!]` row of spec 68 (spec 50 of E13 stays `[~]` and is not part of the release); `claude/review` contains `origin/master`; `git log --oneline origin/master..origin/claude/review -- . ':!.ai'` lists only commits of spec 68 and its fixes.
- The changelog pass on `claude/review`, one commit when anything moves, pushed: `## Unreleased` holds the block spec 68 wrote (P9); each `#### Spec ...` block sits under one heading of its kind in the order `### Added`, `### Changed`, `### Fixed`, `### Docs`, headings without a block left out; each block's text is kept and no claim is added. Prepare Release renames `## Unreleased` to `## 0.9.7 - <date>`; nothing else edits the file.
- Then the fast-forward of `dev` to the head of `claude/review`, pushed (`git push origin <claude/review head>:refs/heads/dev`, a plain push, or `git merge --ff-only` in a pool worktree), never in the root checkout (P2).
- No local suite (D40): spec 68's milestone ran its checks on three bases; `pr.yml` is the one full run. `validate-repo` and `lint` run once on the head as a cheap guard.
- Does NOT merge `v0.9/filter-input-fixes` or `v0.9/docs-version-label`; does NOT touch `master`; does NOT run `validate-pr` or `validate-production` locally (P5); does NOT bump a version by hand.

#### 1.6.2 Release PR (D149, D49, D47, D35, P4)

- `gh pr create --base master --head dev --title "release: 0.9.7" --label release:patch --body-file <body>` with the body per `.github/pull_request_template.md` (Changes: the version labels of spec 68; Checklist ticked where the milestone proved it; Release impact: `release:patch`, the changelog lines present); then `gh pr merge <N> --auto --merge`.
- A background watcher per run.md (a shell loop over `gh pr checks <N> --json name,state` every 60 s) wakes the runner; the runner never waits in the foreground.
- A red job: a P5 flake reruns once (`gh run rerun --failed <id>`); any other red is reproduced under `act` against Docker, or in a Linux container when `act` cannot run the job on this machine (D32, P3), fixed as a fix milestone of this spec on `claude/review` (`plan/new_fix.py`, the queue card first), `dev` fast-forwarded again, GitHub reruns.
- When Prepare Release waits: the runner approves the deployment itself at once with `gh api repos/anindosarker/shadcn-table/actions/runs/<run_id>/pending_deployments -X POST -f state=approved -F 'environment_ids[]=<id>' -f comment="D47"` (the environment id from the same endpoint, `--jq '.[].environment.id'`) and records the response in the tracker (D47).
- The bump commit `chore: version 0.9.7` lands on `dev`; on that run the test contexts and Prepare Release report skipped, Validate PR and PR Summary run green, auto-merge merges (D35).
- Does NOT enable auto-merge on any other PR, does NOT edit the ruleset or the environment (P7), does NOT push the bump by hand, does NOT use `release:minor` (D49).

#### 1.6.3 After release (D149, P4)

- `release.yml` runs on the push to `master`: Check Release, Verify Deployment (polls www and storybook `/version.txt`, then tags `v0.9.7`), Validate Production, Publish Release. The watcher loop over `gh run watch <id> --exit-status` wakes the runner.
- A red Verify Deployment or Validate Production: `gh workflow run release.yml -f version=0.9.7` reruns the late steps without retagging once the deploy serves 0.9.7 (v0.8.x D90); a red that needs code is a fix milestone on `claude/review` for the next version and a queue card, never a fix on `master`.
- The live label checks, in a browser against the public addresses, each recorded in the tracker with the text read:
  - `https://www.shadcn-table.com/docs/examples/basic` and `https://www.shadcn-table.com/`: the header shows a link with the text `v0.9.7` right after `shadcn-table`, its `href` ends in `/releases`; the same at a phone width.
  - `https://storybook.shadcn-table.com/base/`, `/radix/` and `/aria/`: the sidebar title reads `shadcn-table v0.9.7 (Base UI)`, `(Radix UI)` and `(React Aria)`.
- Then `claude/review` and `dev` up to `master` (P4): `git merge --ff-only origin/master` when nothing sits past `master`, else `git merge origin/master -m "merge: master 0.9.7"`; push both. The handoff is rewritten with the release facts.
- A missed live check is a queue card, not a fix on `master`. The DONE line to the lead names the two live label texts, so the lead can tell the owner the release is out.
- Does NOT delete `dev`, `claude/review`, `v0.9/filter-input-fixes` or `v0.9/docs-version-label`; does NOT touch `test-projects/`; does NOT move the owner's worktrees `wt1` and `wt2`.

**Stays unchanged:** `pr.yml`, `release.yml`, `tools/release/*.mjs`, the ruleset, the environment, every library and docs file (spec 68 brings the changes, no task here edits one).

### 1.7 Dependencies and env

- `gh` authenticated as the owner (the runner's login), `RELEASE_BOT_TOKEN` set (v0.8.x D83 addendum), Docker Desktop on a red (D32; started by the agent when needed); nothing new.

## 2. Instructions for AI

### 2.1 Milestones

### Milestone: Integration 0.9.7

- Files owned: `CHANGELOG.md`
- Depends on: Version labels
- Review: none
- Local CI: `pnpm test validate-repo`, `pnpm test lint`
- Task 1: The precondition of 1.6.1. Checks: `git merge-base --is-ancestor origin/master origin/claude/review` exits 0; `git merge-base --is-ancestor origin/v0.9/filter-input-fixes origin/claude/review` exits 1; the tracker of spec 68 says `Status: done`
- Task 2: The changelog pass on `claude/review` (1.6.1). Checks: `grep -c '^## Unreleased' CHANGELOG.md` prints `1`; the `### ` headings of the section are in the order Added, Changed, Fixed, Docs, each at most once; the count of `#### ` lines in the section equals the count before the pass; `pnpm test validate-repo` and `pnpm test lint` green, one at a time (P5)
- Task 3: The fast-forward of `dev` (1.6.1). Checks: `git rev-parse origin/dev` equals the head of `claude/review` the pass ended on

### Milestone: Release PR 0.9.7

- Files owned: none
- Depends on: Integration 0.9.7
- Review: none
- Local CI: none (CI runs on the PR; a red is reproduced locally, D32)
- Task 1: Open the PR with its label and auto-merge (1.6.2); arm the watcher. Checks: `gh pr view <N> --json labels,autoMergeRequest --jq '[.labels[].name, .autoMergeRequest.enabledAt != null]'` prints `["release:patch", true]`
- Task 2: The full run green; when Prepare Release waits, approve the deployment (1.6.2, D47) and record the response. Checks: `gh run view <id> --json jobs --jq '[.jobs[] | select(.conclusion != "success" and .conclusion != "skipped")] | length'` prints `0` apart from Prepare Release `waiting`
- Task 3: The bump run and the merge (1.6.2). Checks: `gh pr view <N> --json state --jq .state` prints `MERGED`; `git fetch origin && git show origin/master:packages/shadcn-table/package.json | grep '"version": "0.9.7"'`

### Milestone: After release 0.9.7

- Files owned: none
- Depends on: Release PR 0.9.7
- Review: none
- Local CI: none
- Task 1: Watch `release.yml` to green (1.6.3). Checks: the Acceptance lines of 1.2 for the tag, the release and the two `version.txt` URLs; Validate Production `success`
- Task 2: The live label checks of 1.6.3. Checks: one line per check in the tracker with the text read and pass or fail; the browser closed
- Task 3: `claude/review` and `dev` up to `master`, push both; rewrite the handoff (1.6.3). Checks: `git rev-parse origin/claude/review origin/dev origin/master` prints one sha three times; `git ls-remote --heads origin v0.9/filter-input-fixes v0.9/docs-version-label` prints two lines; `pnpm test validate-repo` green on `claude/review`

### 2.2 Checks

- Integration: `pnpm test validate-repo`, `pnpm test lint` green on `claude/review`; `dev` equals `claude/review`
- Release PR: `pr.yml` green on the pre-bump head; the runner's Approve (D47); the bump run with the test jobs skipped; the PR merged by auto-merge with `chore: version 0.9.7` in it
- After release: `release.yml` green (Check Release, Verify Deployment, Validate Production, Publish Release); tag `v0.9.7`; `gh release view v0.9.7`; both `version.txt` print `0.9.7`; the live label checks of 1.6.3; the three branches at one sha
- Review: none (operations only; P7 untouched)
- Worktrees from the pool 01 to 09 only; the root checkout, `wt1` and `wt2` are never used for a checkout, an install or a build (P2); heavy checks one at a time (P5)
