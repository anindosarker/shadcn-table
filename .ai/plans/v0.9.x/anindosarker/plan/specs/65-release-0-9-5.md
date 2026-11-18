# 65: Release 0.9.5

Follow the project planning rules: docs/code-of-conduct/planning-guidelines.md, CLAUDE.md:9. Keep the expedition contract.

## 1. Architecture

### 1.1 Overview

`dev` and `master` are at 0.9.4 (`7b379866`, tag `v0.9.4`, 2026-11-14). `claude/review` (`52ebfc19` when this spec was written) carries the E15 library fixes and plan commits. `v0.9/docs-layout` (`8cd198f4`) carries all of that code plus the docs work of E14, E15 and E16 and their hotfixes: 289 commits ahead of `claude/review`, and `claude/review` is ahead of it only by plan files under `.ai/`. D141 is the owner's explicit yes (D100, P4): 0.9.5 ships everything on both branches, nothing hidden, without any date picker work. The release runs the flow spec 48 ran for 0.9.4 (v0.9.x D40, D47, D49, D35), with one step in front: the one merge of `v0.9/docs-layout` into `claude/review` that D109 reserved for the owner's word.

### 1.2 Goals

- `claude/review` contains `v0.9/docs-layout` through one merge commit; its code tree equals the docs branch's tree (D141, D109).
- `dev` carries every commit of `claude/review` up to the changelog pass; the PR opens right after the fast-forward, no local suite (D40).
- One PR `dev` into `master`, title `release: 0.9.5`, label `release:patch` (D49), auto-merge enabled at creation; the version 0.9.4 bumps to 0.9.5 (P4).
- Prepare Release waits on the `release` environment; the runner approves it (D47). The bump push runs no test job (D35).
- `master` carries `v0.9.5`; www.shadcn-table.com and the Storybook host serve 0.9.5; the GitHub release exists with the 0.9.5 changelog section.
- The live site shows the release's visible parts, all public and indexed (D141): the section tab row, a story page, a renamed example page with its redirect (D119), the 404 page (D121), the sitemap with the story pages.
- `claude/review` and `dev` end at `master` (P4); the P1 bullet about `v0.9/docs-layout` is gone from `process.md`.
- Spec 50 and its branch `v0.9/filter-input-fixes` are not part of this release (D141).
- Acceptance: programmatic. `git ls-remote --tags origin v0.9.5` prints one line; `gh release view v0.9.5 --json tagName --jq .tagName` prints `v0.9.5`; `curl -fsS https://www.shadcn-table.com/version.txt` and `curl -fsS https://storybook.shadcn-table.com/version.txt` print `0.9.5`; `curl -s -o /dev/null -w '%{http_code}' https://www.shadcn-table.com/docs/examples/more/features-sorting--sorted-on-load` prints `200`; `curl -s -o /dev/null -w '%{http_code} %{redirect_url}' https://www.shadcn-table.com/docs/examples/react-query` prints `308 https://www.shadcn-table.com/docs/examples/server-side-pagination`; `curl -s -o /dev/null -w '%{http_code}' https://www.shadcn-table.com/docs/examples/sticky-heder` prints `404` and its body contains `This page does not exist`; `curl -s https://www.shadcn-table.com/sitemap.xml | grep -c '/docs/examples/more/'` prints at least 500; `curl -s https://www.shadcn-table.com/docs/guides/sorting | grep -c 'features-sorting--sorted-on-load'` prints at least 1; the story id `features-sorting--sorted-on-load` is in `https://storybook.shadcn-table.com/base/index.json`, `/radix/index.json` and `/aria/index.json`; the hosted base registry item (the file name read from `apps/shadcn-table-docs/public/r/base/`) contains `useST_TouchDrag`.

### 1.3 Current structure

```
master, dev      7b379866                 ← 0.9.4 (v0.9.4 tagged 2026-11-14)
claude/review    52ebfc19                 ← contains master; E15 library fixes; plan files; no docs work
v0.9/docs-layout 8cd198f4                 ← contains every code commit of claude/review; E14, E15, E16 docs work, hotfixes Q109 to Q130
v0.9/filter-input-fixes                   ← spec 50, held with Q84 and Q88; not merged anywhere
CHANGELOG.md on v0.9/docs-layout          ← `## Unreleased` with 35 blocks; `### Changed` occurs twice
packages/shadcn-table/package.json:8      ← "version": "0.9.4"
.ai/plans/v0.9.x/anindosarker/process.md  ← P1 has the bullet `v0.9/docs-layout` (D109)
```

### 1.4 Target structure

```
claude/review    ← merge: v0.9/docs-layout (65); changelog pass; process.md P1 without the docs branch bullet; later up to master (P4)
dev              ← claude/review fast-forwarded, then `chore: version 0.9.5` by Prepare Release
master           ← the release PR merged; tag v0.9.5; CHANGELOG `## 0.9.5 - <date>`
GitHub release v0.9.5 ← notes from the 0.9.5 changelog section (Publish Release)
v0.9/docs-layout ← merged; deleted local and remote after the release is live (P3)
```

### 1.5 Flow

```mermaid
sequenceDiagram
  participant L as v0.9/docs-layout
  participant R as claude/review
  participant D as dev
  participant P as pr.yml
  participant M as master
  participant W as release.yml
  L->>R: one merge (Integration, D141, D109)
  R->>R: changelog pass, process.md P1 (Integration)
  R->>D: fast-forward, push (Integration)
  D->>M: PR release: 0.9.5, release:patch, auto-merge on (Release PR)
  P->>P: test jobs green, PR Summary
  P->>P: Prepare Release waits on environment release
  Note over P: the runner approves (D47)
  P->>D: chore: version 0.9.5 (RELEASE_BOT_TOKEN)
  P->>P: bump run: test jobs skipped (D35); auto-merge merges
  M->>W: push to master
  W->>W: Check Release, Verify Deployment (tag v0.9.5), Validate Production, Publish Release
  M->>R: claude/review and dev brought up to master (After release)
```

### 1.6 Components

#### 1.6.1 Data artifacts

- `CHANGELOG.md` (P9): after the merge `## Unreleased` holds the blocks the milestones of specs 51 to 64 and the hotfixes wrote. The pass puts every `#### Spec ...` block under one heading of its kind, in the order `### Added`, `### Changed`, `### Fixed`, `### Docs` (today `### Changed` occurs twice), keeps each block's text, and adds no claim. A block that names behaviour a later block of this release replaced (Spec 53 Section tab hover, replaced by the hotfix of card Q130) is brought in line with what ships, in one line. Prepare Release renames `## Unreleased` to `## 0.9.5 - <date>`; nothing else edits the file.
- `packages/shadcn-table/package.json` and the root `package.json`: version `0.9.5` through Prepare Release only; never bumped by hand.
- `.ai/plans/v0.9.x/anindosarker/process.md`: the P1 bullet that starts `` `v0.9/docs-layout`: `` is removed in the same commit as the changelog pass, because the branch has merged (D141).
- The trackers: `run/trackers/65-integration-0-9-5-tracker.md`, `65-release-pr-0-9-5-tracker.md`, `65-after-release-0-9-5-tracker.md`: check lines, the merge sha, the PR number, the run ids, the approval response, the final shas.

#### 1.6.2 Integration (D141, D109, D40, P1)

- Precondition: `status/sprints.md` has no `·`, `[ ]`, `[~]` or `[!]` row of E14, E15 or E16 (spec 50 of E13 stays `[~]` and is not part of the release); `claude/review` contains `origin/master`; `git log --oneline origin/v0.9/docs-layout..origin/claude/review -- . ':!.ai'` prints nothing (the docs branch has every code commit of `claude/review`). If that log prints a commit, `claude/review` is first merged into `v0.9/docs-layout` in a pool worktree and the docs branch's checks of spec 63 Task 1 rerun there before the next step.
- The one merge, in a pool worktree on `claude/review`: `git merge --no-ff origin/v0.9/docs-layout -m "merge: v0.9/docs-layout (65)"`. A conflict can only be under `.ai/` (plan files changed on both sides): `claude/review`'s side is kept for every file under `.ai/plans/`, except the files the docs branch alone wrote. Proof that no code was lost or changed by the merge: `git diff origin/v0.9/docs-layout HEAD -- . ':!.ai'` prints nothing.
- Then the changelog pass and the `process.md` edit of 1.6.1 (one commit, pushed), then `git fetch origin && git checkout dev && git merge --ff-only origin/claude/review && git push origin dev`: the one fast-forward of P1, in a pool worktree, never in the root checkout (P2).
- No local suite (D40): the merged code tree is the docs branch's tree, whose milestones ran their checks on three bases; `pr.yml` is the one full run. `validate-repo` and `lint` run once on the merge as a cheap guard.
- Does NOT merge `v0.9/filter-input-fixes`; does NOT touch `master`; does NOT run `validate-pr` or `validate-production` locally (P5); does NOT use `wt1`, `wt2` or the root checkout for a checkout or an install (P2).

#### 1.6.3 Release PR (D141, D49, D47, D35, P4)

- `gh pr create --base master --head dev --title "release: 0.9.5" --label release:patch --body-file <body>` with the body per `.github/pull_request_template.md` (Changes: one paragraph per epic, E13 specs 51 and 52, E14, E15, E16, and one for the hotfixes; Checklist ticked where the milestones proved it; Release impact: `release:patch`, the changelog lines present); then `gh pr merge <N> --auto --merge`.
- A background watcher per run.md (a shell loop over `gh pr checks <N> --json name,state` every 60 s) wakes the runner; the runner never waits in the foreground.
- A red job: a P5 flake reruns once (`gh run rerun --failed <id>`); any other red is reproduced under `act` against Docker (D32, P3), fixed as a fix milestone of this spec on `claude/review` (`plan/new_fix.py`, the queue card first), `dev` fast-forwarded again (the PR follows `dev`), GitHub reruns. The docs build now holds about 600 more pages than at 0.9.4: a CI or deploy job that runs out of time or memory on it is a red like any other, fixed at its cause (the build), never by removing pages (D141).
- When Prepare Release waits: the runner approves the deployment itself at once with `gh api repos/anindosarker/shadcn-table/actions/runs/<run_id>/pending_deployments -f state=approved -F 'environment_ids[]=<id>' -f comment="D47"` (the environment id from the same endpoint, `--jq '.[].environment.id'`) and records the response in the tracker (D47).
- The bump commit `chore: version 0.9.5` lands on `dev`; on that run the `head` job reports `bumped=true`, the test contexts and Prepare Release report skipped, Validate PR and PR Summary run green, auto-merge merges (D35).
- Does NOT enable auto-merge on any other PR, does NOT edit the ruleset or the environment (P7), does NOT push the bump by hand, does NOT use `release:minor` (D49).

#### 1.6.4 After release (D141, P4)

- `release.yml` runs on the push to `master`: Check Release, Verify Deployment (polls www and storybook `/version.txt` up to 20 minutes, then tags `v0.9.5`), Validate Production, Publish Release. The watcher loop over `gh run watch <id> --exit-status` wakes the runner.
- A red Verify Deployment or Validate Production: `gh workflow run release.yml -f version=0.9.5` reruns the late steps without retagging once the deploy serves 0.9.5 (v0.8.x D90); a red that needs code is a fix milestone on `claude/review` for the next version and a queue card, never a fix on `master`.
- Then `claude/review` and `dev` up to `master` (P4): `git merge --ff-only origin/master` when nothing sits past `master`, else `git merge origin/master -m "merge: master 0.9.5"`; push both. Then `v0.9/docs-layout` is deleted local and remote (P3; it is an ancestor of `master`), and the handoff is rewritten with the release facts.
- The live checks of 1.2 recorded in the tracker, one line each with what was returned; a miss is a queue card, not a fix on `master`. The DONE line to the lead names the live story page check, so the lead can tell the owner the release is out and remind him of the Search Console step (D141, Q34).
- Does NOT delete `dev`, `claude/review`, `v0.9/filter-input-fixes` or `v0.9/storybook-upgrade`; does NOT touch `test-projects/`; does NOT re-submit the sitemap or request indexing (the owner does, Q34); does NOT move the owner's worktree `wt2` (the lead does).

**Stays unchanged:** `pr.yml`, `release.yml`, `tools/release/*.mjs`, the ruleset, the environment, every library and docs file (the merge brings them, no task edits one).

### 1.7 Dependencies and env

- `gh` authenticated as the owner (the runner's login), `RELEASE_BOT_TOKEN` set (v0.8.x D83 addendum), Docker Desktop for `act` on a red (D32; started by the agent when needed); nothing new.

## 2. Instructions for AI

### 2.1 Milestones

### Milestone: Integration 0.9.5

- Files owned: `CHANGELOG.md`, `.ai/plans/v0.9.x/anindosarker/process.md`
- Depends on: none
- Review: none
- Local CI: `pnpm test validate-repo`, `pnpm test lint`
- Task 1: The precondition and the one merge of 1.6.2, pushed. Checks: `git merge-base --is-ancestor origin/v0.9/docs-layout origin/claude/review` exits 0; `git diff origin/v0.9/docs-layout origin/claude/review -- . ':!.ai'` prints nothing; `git merge-base --is-ancestor origin/v0.9/filter-input-fixes origin/claude/review` exits 1; `git log -1 --format=%s <merge sha>` prints `merge: v0.9/docs-layout (65)`
- Task 2: The changelog pass and the `process.md` edit of 1.6.1 on `claude/review` (one commit, pushed). Checks: `grep -c '^## Unreleased' CHANGELOG.md` prints `1`; `awk '/^## Unreleased/{p=1;next} p&&/^## /{exit} p' CHANGELOG.md | grep -E '^### '` prints `### Added`, `### Changed`, `### Fixed`, `### Docs`, each once, in that order; the count of `#### ` lines in the section equals the count before the pass; `grep -c 'v0.9/docs-layout' .ai/plans/v0.9.x/anindosarker/process.md` prints `0`; `pnpm test validate-repo` and `pnpm test lint` green, one at a time (P5)
- Task 3: The fast-forward of `dev` (1.6.2). Checks: `git rev-parse origin/dev` equals `git rev-parse origin/claude/review`

### Milestone: Release PR 0.9.5

- Files owned: none
- Depends on: Integration 0.9.5
- Review: none
- Local CI: none (CI runs on the PR; a red is reproduced under `act`, D32)
- Task 1: Open the PR with its label and auto-merge (1.6.3); arm the watcher. Checks: `gh pr view <N> --json labels,autoMergeRequest --jq '[.labels[].name, .autoMergeRequest.enabledAt != null]'` prints `["release:patch", true]`
- Task 2: The full run green; when Prepare Release waits, approve the deployment (1.6.3, D47) and record the response. Checks: `gh run view <id> --json jobs --jq '[.jobs[] | select(.conclusion != "success" and .conclusion != "skipped")] | length'` prints `0` apart from Prepare Release `waiting`
- Task 3: The bump run and the merge (1.6.3). Checks: `gh pr view <N> --json state --jq .state` prints `MERGED`; `git fetch origin && git show origin/master:packages/shadcn-table/package.json | grep '"version": "0.9.5"'`

### Milestone: After release 0.9.5

- Files owned: none
- Depends on: Release PR 0.9.5
- Review: none
- Local CI: none
- Task 1: Watch `release.yml` to green (1.6.4). Checks: the Acceptance lines of 1.2 for the tag, the release and the two `version.txt` URLs; Validate Production `success`
- Task 2: The live checks of 1.2 on the public addresses (1.6.4). Checks: one line per check in the tracker with the returned value: the story page, the D119 redirect, the 404 page, the sitemap count, the Sorting guide's top table, the story id in the three Storybook `index.json` files, the hosted registry item
- Task 3: `claude/review` and `dev` up to `master`, push both; delete `v0.9/docs-layout` local and remote; rewrite the handoff (1.6.4). Checks: `git rev-parse origin/claude/review origin/dev origin/master` prints one sha three times; `git ls-remote --heads origin v0.9/docs-layout` prints nothing; `git ls-remote --heads origin v0.9/filter-input-fixes` prints one line; `pnpm test validate-repo` green on `claude/review`

### 2.2 Checks

- Integration: the merge with an empty code diff against the docs branch; `pnpm test validate-repo`, `pnpm test lint` green on `claude/review`; `dev` equals `claude/review`
- Release PR: `pr.yml` green on the pre-bump head; the runner's Approve (D47); the bump run with the test jobs skipped; the PR merged by auto-merge with `chore: version 0.9.5` in it
- After release: `release.yml` green (Check Release, Verify Deployment, Validate Production, Publish Release); tag `v0.9.5`; `gh release view v0.9.5`; both `version.txt` print `0.9.5`; the live checks of 1.2; the three branches at one sha; `v0.9/docs-layout` gone
- Review: none (operations only; P7 untouched)
- Worktrees from the pool 01 to 09 only; the root checkout, `wt1` and `wt2` are never used for a checkout, an install or a build (P2); heavy checks one at a time (P5)
