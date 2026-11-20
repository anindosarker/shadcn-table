# 75: Ship the phone example toolbar
- Epic: E22

Follow the project planning rules: docs/code-of-conduct/planning-guidelines.md, CLAUDE.md:9. Keep the expedition contract.

## 1. Architecture

### 1.1 Overview

E21 merged two changes into `claude/review` and stopped there: the two-row example toolbar with a More menu on a phone (spec 74, D156) and the fixes of the `ci:skip` label (spec 72, D154, D155). The owner said "Ship it" (D158): both go live by one PR from `dev` into `master` that carries `release:skip` and `ci:skip` (D153), with no version bump and no tag, so the sites stay 0.9.7. The same PR is the proof spec 72 still owes: created with both labels, it must be mergeable after its first run, with no further push and no rerun. One milestone, no code: the fast-forward, the PR, the live reads, the branches.

### 1.2 Goals

- The phone example toolbar of spec 74 is live on `https://www.shadcn-table.com/docs/examples/basic`: at phone width two rows and the More menu with its entries; at desktop width the single row, unchanged (D158, D156).
- The `ci:skip` fixes of spec 72 are on `master` (D158).
- The shipping PR, created with `release:skip` and `ci:skip`, reports `mergeStateStatus` `CLEAN` after its first run with one push and no rerun, and that read is recorded in tracker 72 as the proof of D155 (D158).
- No version bump, no tag, no GitHub release: both sites answer `0.9.7` (D158, D153).
- `claude/review` and `dev` end at `master` (P4).
- Acceptance: programmatic. `gh pr view <N> --json mergeStateStatus --jq .mergeStateStatus` prints `CLEAN` after the first run, read before auto-merge is enabled; `gh pr view <N> --json state --jq .state` prints `MERGED`; `git ls-remote --tags origin 'v0.9.8'` prints nothing; `curl -fsS https://www.shadcn-table.com/version.txt` and `curl -fsS https://storybook.shadcn-table.com/version.txt` print `0.9.7`; the live reads of 1.6.1 pass. Reference for the phone layout: `.ai/plans/v0.9.x/anindosarker/reference/q145-after-390.png` and `q145-after-390-menu.png`, the captures of `claude/review` taken by spec 74.

### 1.3 Current structure

```
origin/master (229e6113)                        ← 0.9.7 plus the home page label; live
origin/dev (229e6113)                           ← equal to master
origin/claude/review                            ← master + spec 74 (8e42da3a, 000f55d7, 304c8161) + spec 72 (merge 80f9cfdd)
.github/workflows/pr.yml                        ← on master: reads ci:skip on any base; label events start a second run (the fault of Q144)
.github/workflows/pr.yml, pr-labels.yml         ← on claude/review: ci:skip only into master (D154); label events run in pr-labels.yml (D155)
run/trackers/72-ci-skip-label-fixes-tracker.md  ← Status done; the CLEAN proof is owed on the next labelled PR from dev into master
origin/v0.9/ci-skip-trial-1, -2, -3             ← trial branches of spec 72, still on the remote; their PRs are closed
CHANGELOG.md                                    ← ## Unreleased, ### Docs: #### Spec 70, #### Spec 74
```

### 1.4 Target structure

```
origin/master                                   ← + the merge of the shipping PR; package version stays 0.9.7
origin/dev, origin/claude/review                ← at master
run/trackers/72-ci-skip-label-fixes-tracker.md  ← + one Check line: the CLEAN read of the shipping PR (D155)
origin/v0.9/ci-skip-trial-1, -2, -3             ← deleted (ride-along)
CHANGELOG.md                                    ← unchanged: the Spec 70 and Spec 74 blocks stay under ## Unreleased until the next release
```

### 1.5 Flow

```
claude/review ── fast-forward ──> dev ── gh pr create (release:skip, ci:skip) ──> first run ── CLEAN read ── auto-merge ──> master ── Vercel build ──> live reads
                                                                                   Head: skip=true, 16 legs green with no steps
```

### 1.6 Components

#### 1.6.1 Shipping (D158, D153, D155, P1, P4)

- Precondition: `claude/review` contains `origin/master`; the trackers of spec 72 (`72-ci-skip-label-fixes`) and spec 74 (`74-example-toolbar-phone`) say `Status: done`; `git log --oneline origin/master..origin/claude/review -- . ':!.ai'` lists only the commits and merges of specs 72 and 74; `origin/v0.9/filter-input-fixes` and `origin/v0.9/click-to-copy-tooltip-refocus` are not ancestors of `claude/review`; no PR is open (`gh pr list --state open`).
- The fast-forward of `dev` to the head of `claude/review`, pushed (a plain push of that head to `refs/heads/dev`, or `git merge --ff-only` in a pool worktree), never in the root checkout (P2). One push: the PR is created only after it.
- `gh pr create --base master --head dev --title "docs: two-row example toolbar on a phone" --label release:skip --label ci:skip --body-file <body>`, the body per `.github/pull_request_template.md`: the phone toolbar of spec 74, the label fixes of spec 72, and one line that the test jobs are skipped by the owner's word (D158, D153). Auto-merge is not enabled yet.
- The first run, and the proof of D155: wait until the one `PR checks` run and the `PR labels` runs of the head have ended, without a push and without a rerun. Then read `gh pr view <N> --json mergeStateStatus --jq .mergeStateStatus`: it must print `CLEAN`. The read, the run ids (`gh run list --branch dev --json databaseId,workflowName,event,conclusion`) and the count of pushes (one) go to this tracker and, as one `- Check (D155, spec 75):` line, to tracker 72. Head prints `skip=true (label ci:skip)`; the 16 matrix legs succeed with no step run; Lint, Validate Repo and Prepare Release are skipped; Validate PR says `No release (release:skip)`.
- Then `gh pr merge <N> --auto --merge`; the PR merges.
- When the read is not `CLEAN`: the per-context table of spec 72, 1.6.2 is taken for the head (`gh api repos/{owner}/{repo}/commits/<sha>/check-runs --paginate`), the cause goes to the tracker, and the fix is a fix milestone of this spec on `claude/review` (`plan/new_fix.py`), reproduced under `act` where `act` can show it (P3), `dev` fast-forwarded again. That second push is named in tracker 72 as what the proof still lacks; no rerun, no empty commit, no merge past the checks.
- `release.yml` on the `master` push: Check Release says `none` and every other job skips; the warning that `## Unreleased` holds blocks is expected.
- Vercel builds `master`. The live reads, in a browser against `https://www.shadcn-table.com/docs/examples/basic`, each as one line in the tracker with what was read and pass or fail, the browser closed after:
  - at 390 wide: the panel header's controls sit on two rows; row 1 previous, the example name, next; row 2 Preview, Code, Both, the base switcher and the More button at the right end; no Storybook, Copy prompt or full screen button is visible in the header.
  - at 390 wide: the More button opens a menu whose entries read, in order, Open in Storybook, Copy prompt, Copy install command, Fullscreen, then the old entries.
  - at 1440 wide: one row, with the Storybook link, Copy prompt, its arrow and the full screen button visible, as on 0.9.7.
  - one capture at 390 with the menu open, compared by eye with `reference/q145-after-390-menu.png`; one line says what matches.
- Then `claude/review` and `dev` up to `master` (P4): `git merge --ff-only origin/master` when nothing sits past `master`, else `git merge origin/master -m "merge: master 0.9.7"`; push both.
- Ride-along: `git push origin --delete v0.9/ci-skip-trial-1 v0.9/ci-skip-trial-2 v0.9/ci-skip-trial-3` for each that `git ls-remote --heads origin 'v0.9/ci-skip-trial-*'` still lists, after `gh pr list --state open --head <branch>` shows no open PR for it (spec 72 says they are deleted once read).
- The DONE line to the lead names the live phone toolbar read and whether the first-run read was `CLEAN`, so the lead can tell the owner it is out.
- Does NOT bump a version, tag, or create a GitHub release; does NOT write or move a `CHANGELOG.md` block; does NOT change a workflow file, the ruleset, its required checks or the `release` environment (P7); does NOT rerun a run or push a second time to get the merge; does NOT merge `v0.9/filter-input-fixes` or `v0.9/click-to-copy-tooltip-refocus`; does NOT delete `v0.9/home-version-label` or `v0.9/docs-version-label`, and does NOT move the owner's worktrees `wt1` and `wt2`; does NOT deploy with the Vercel CLI.

**Stays unchanged:** every file of the repository outside `.ai/plans/` (this milestone commits nothing but its tracker lines), `packages/shadcn-table/package.json` (version 0.9.7), `package.json` and the lockfile.

### 1.7 Dependencies and env

- `gh` authenticated as the owner (the runner's login); a browser for the live reads; nothing new.

## 2. Instructions for AI

### 2.1 Milestones

### Milestone: Ship the phone example toolbar

- Files owned: none
- Depends on: none
- Review: none
- Local CI: none (the PR's run is the proof; a red is reproduced under `act`, P3)
- Task 1: The precondition and the fast-forward of `dev` (1.6.1). Checks: `git merge-base --is-ancestor origin/master origin/claude/review` exits 0; the trackers of spec 72 and spec 74 say `Status: done`; `git merge-base --is-ancestor origin/v0.9/filter-input-fixes origin/claude/review` exits 1; `gh pr list --state open --json number --jq length` prints `0`; `git rev-parse origin/dev` equals the head of `claude/review`
- Task 2: The PR with both labels, its first run, the `CLEAN` read, then auto-merge and the merge (1.6.1). Checks: `gh pr view <N> --json labels --jq '[.labels[].name] | sort'` prints `["ci:skip","release:skip"]`; the Head log holds `skip=true`; `gh pr view <N> --json mergeStateStatus --jq .mergeStateStatus` prints `CLEAN` after the first run, with one push and no rerun, the line also in tracker 72; `gh run view <id> --json jobs --jq '[.jobs[] | select(.conclusion != "success" and .conclusion != "skipped")] | length'` prints `0`; `gh pr view <N> --json state --jq .state` prints `MERGED`
- Task 3: After the merge (1.6.1): `release.yml` says `none`, the live reads, the branches up to `master`, the trial branches. Checks: `git ls-remote --tags origin v0.9.8` prints nothing; `curl -fsS https://www.shadcn-table.com/version.txt` and `curl -fsS https://storybook.shadcn-table.com/version.txt` print `0.9.7`; one line per live read in the tracker with the text read and pass or fail, the browser closed; `git rev-parse origin/claude/review origin/dev origin/master` prints one sha three times; `git ls-remote --heads origin 'v0.9/ci-skip-trial-*'` prints nothing

### 2.2 Checks

- Ship the phone example toolbar: the first-run `CLEAN` read in both trackers, the PR run with no test step, the merge, no tag, the live reads at 390 and 1440
- Review: none (operations only, no file changed; P7 untouched)
- Worktrees from the pool 01 to 09 only; the root checkout, `wt1` and `wt2` are never used for a checkout, an install or a build (P2)
