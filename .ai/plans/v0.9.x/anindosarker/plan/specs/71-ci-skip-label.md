# 71: CI skip label
- Epic: E20

Follow the project planning rules: docs/code-of-conduct/planning-guidelines.md, CLAUDE.md:9. Keep the expedition contract.

## 1. Architecture

### 1.1 Overview

A small change can reach the live site only through a PR into `master`, and that PR runs all 21 required checks even when the change is one line of the docs site (Q142). `pr.yml` already has a way to report every check green without running it: on the bot's version commit the Head job says `bumped`, and each test job skips its steps (D35). This spec lets a PR label, `ci:skip`, trigger the same path (D153), and then uses it once: the home page label of spec 70 goes live with `release:skip` and `ci:skip`, no version, no tag. Two milestones: the workflow change, which shares no file with spec 70 and runs beside it, and the shipping, which needs both.

### 1.2 Goals

- A PR into `master` that carries the label `ci:skip` runs no test job: every Typecheck, Storybook Tests, Docs E2E and Installation E2E leg reports success with no step run, Lint, Validate Repo and Prepare Release are skipped, and the PR merges (D153).
- The label is read live from the PR, so a label added after the PR opened counts on the next run or re-run of the checks.
- Validate PR and PR Summary still run on such a PR: they check the labels and write the comment, they are not test jobs, and they take under two minutes. This keeps D153's intent (no test run, the merge at once).
- A PR without the label, a `workflow_dispatch` and the version commit behave exactly as today.
- The home page label of spec 70 (D152) is live on `https://www.shadcn-table.com/` as `v0.9.7`, shipped by one PR `dev` into `master` with `release:skip` and `ci:skip`: no version bump, no tag, no GitHub release (D153).
- `claude/review` and `dev` end at `master` (P4).
- Acceptance: programmatic. Under `act`, the Head job prints `skip=true` for a PR with the label and `skip=false` for one without (P3). On GitHub, the run of the shipping PR shows every required check `success` or `skipped` with no test step run; `gh pr view <N> --json state --jq .state` prints `MERGED`; `git ls-remote --tags origin 'v0.9.8'` prints nothing; `curl -fsS https://www.shadcn-table.com/version.txt` prints `0.9.7`; the live home page header holds the link `v0.9.7`.

### 1.3 Current structure

```
.github/workflows/pr.yml:48-72                  ← Head: output `bumped`, true on the bot's `chore: version <v>` commit
.github/workflows/pr.yml:80,109,117,148         ← the four called workflows get `skip: ${{ needs.head.outputs.bumped == 'true' }}`
.github/workflows/pr.yml:85,124                 ← Lint and Validate Repo: `needs.head.outputs.bumped != 'true'` in their `if:`
.github/workflows/pr.yml:14-21,40-47            ← the comments that describe the skip
.github/workflows/pr.yml:154-178                ← Validate PR: reads the `release:` labels live (`gh pr view`), runs on label events too
.github/workflows/pr.yml:214-217                ← Prepare Release: needs every job, so a skipped Lint skips it (D35)
.github/workflows/{typecheck,storybook-tests,docs-e2e,installation-e2e}.yml  ← input `skip`: every step skipped, each leg reports success
test/validate-pr/lib/release-label.mjs:52-77    ← one `release:` label on a PR into master; `release:skip` means no version; other labels are ignored
.github/workflows/release.yml:7-17              ← on a push to master without a bump: Check Release says `none`, every job skips
CONTRIBUTING.md:298,308                         ← the release label and the release PR, for contributors
docs/code-of-conduct/coding-standards.md:126-133 ← the checks paragraph that names the labels
GitHub labels                                   ← release:patch, release:minor, release:major, release:skip; no ci:skip
```

### 1.4 Target structure

```
.github/workflows/pr.yml                        ← Head: + output `skip` (bumped, or the PR carries `ci:skip`, read live); the six `bumped` uses read `skip`; comments name D153
.github/workflows/{typecheck,storybook-tests,docs-e2e,installation-e2e}.yml  ← the `skip` input's description names the label beside the version commit
CONTRIBUTING.md                                 ← + one sentence: `ci:skip`, maintainers only, with `release:skip`
docs/code-of-conduct/coding-standards.md        ← + the same fact in the checks paragraph
GitHub labels                                   ← + ci:skip (`gh label create`, by the shipping milestone)
master                                          ← + the merge of the shipping PR; package version stays 0.9.7
```

### 1.5 Flow

```
spec 70 merged ─┐
                ├─ claude/review ── fast-forward ──> dev ── PR (release:skip, ci:skip) ──> master ── Vercel build ──> live
milestone 1 ────┘                                           Head: skip=true, legs green with no steps
```

### 1.6 Components

#### 1.6.1 The label in `pr.yml` (D153)

- The Head job gets a second output, `skip`. It is `true` when `bumped` is true, or when the event is a `pull_request` and the PR carries the label `ci:skip`. The label is read live in the same step with `gh pr view "$PR" --json labels --jq 'any(.labels[]; .name == "ci:skip")'`, the way Validate PR reads its labels; the job gets `GH_TOKEN: ${{ github.token }}`, `PR: ${{ github.event.pull_request.number }}` and `pull-requests: read`. Without a PR number `skip` equals `bumped`. The step prints `skip=<value>` and the reason (`version commit`, `label ci:skip` or `none`).
- The six uses of `needs.head.outputs.bumped` (the four `skip:` inputs, the `if:` of Lint and of Validate Repo) read `needs.head.outputs.skip`. `bumped` stays an output, for the log.
- Nothing else moves: Validate PR and PR Summary keep their conditions; Prepare Release is skipped through its skipped needs, as on the version commit, so no approval is asked.
- A label event still runs Validate PR and PR Summary alone (the test jobs skip those events). So the label is set when the PR is created (`gh pr create --label`), or added later and followed by `gh run rerun <id>` of the PR's checks run; the comment at the top of `pr.yml` says so in one sentence.
- The comments of `pr.yml` (the header block and the block above Head) and the `skip` input description of the four called workflows name the label and D153 beside the version commit and D35.
- `CONTRIBUTING.md` (after the release label bullet) and `docs/code-of-conduct/coding-standards.md` (the checks paragraph) get one sentence each: `ci:skip` on a PR into `master` reports every test job green without running it; it is for maintainers, for a change the owner said ships without a release, together with `release:skip`.
- Proof before the push (P3): `act pull_request -W .github/workflows/pr.yml -j head` twice, with an event file naming a PR that has the label and one that has not, and `-s GITHUB_TOKEN="$(gh auth token)"` for the live read. The two PRs are existing ones; when no open PR carries the label yet, the labelled case is run with the step's label read replaced by an env value in the event, and the tracker says the live read is proven by the GitHub run of milestone 2 (P3, what `act` cannot reproduce).
- Does NOT add a path filter or a docs-only detection, does NOT change the ruleset, its required checks or the `release` environment (P7), does NOT change `test/validate-pr/` (a `ci:skip` label without `release:skip` is not policed: D153 names the runner as the one who sets both), does NOT change `release.yml`, does NOT add the label to `.github/pull_request_template.md` (contributors never set it), does NOT write a `CHANGELOG.md` line (tooling, ships nothing).

#### 1.6.2 Shipping the home page label (D153, D152, P1, P4)

- Precondition: the milestones `Home page version label` (spec 70) and `CI skip label` are merged into `claude/review`; `claude/review` contains `origin/master`; `git log --oneline origin/master..origin/claude/review -- . ':!.ai'` lists only their commits and merges.
- `gh label create ci:skip --description "Report every test job green without running it (maintainers, with release:skip)"` when `gh label list` does not show it.
- The fast-forward of `dev` to the head of `claude/review`, pushed (a plain push of that head to `refs/heads/dev`, or `git merge --ff-only` in a pool worktree), never in the root checkout (P2).
- `gh pr create --base master --head dev --title "docs: version label on the home page" --label release:skip --label ci:skip --body-file <body>`, the body per `.github/pull_request_template.md`: the home page label of spec 70, the label mechanism of this spec, and one line that the test jobs are skipped by the owner's word (D153). Then `gh pr merge <N> --auto --merge`.
- The run: Head prints `skip=true` with the reason `label ci:skip`; the 16 matrix legs succeed with no step run; Lint, Validate Repo and Prepare Release are skipped; Validate PR says `No release (release:skip)`; PR Summary is green; the PR merges. A red here is a fault of milestone 1: it is reproduced under `act`, fixed as a fix milestone of this spec on `claude/review` (`plan/new_fix.py`), `dev` fast-forwarded again.
- `release.yml` on the `master` push: Check Release says `none` and every other job skips (`## Unreleased` keeps the `#### Spec 70` block until the next release; that warning is expected).
- Vercel builds `master`. The live check, in a browser against `https://www.shadcn-table.com/` at 1440 and 390 wide: the home header holds one visible link `v0.9.7` right after `shadcn-table`, its `href` ends in `/releases`; `https://www.shadcn-table.com/nope` shows the same; a docs page still shows the docs label. Each read goes to the tracker; the browser is closed.
- Then `claude/review` and `dev` up to `master` (P4): `git merge --ff-only origin/master` when nothing sits past `master`, else `git merge origin/master -m "merge: master 0.9.7"`; push both.
- The DONE line to the lead names the live home label text, so the lead can tell the owner it is out.
- Does NOT bump a version, tag, or create a GitHub release; does NOT use `ci:skip` on any other PR; does NOT merge `v0.9/filter-input-fixes`; does NOT delete `v0.9/home-version-label` or move the owner's worktrees `wt1` and `wt2`; does NOT deploy with the Vercel CLI.

**Stays unchanged:** the ruleset and its 21 required checks, the `release` environment, `release.yml`, `test/validate-pr/`, `tools/release/`, `packages/shadcn-table/package.json` (version 0.9.7), `package.json` and the lockfile.

### 1.7 Dependencies and env

- `gh` authenticated as the owner (the runner's login); Docker Desktop for `act` (started by the agent when it is down, P3); nothing new.

## 2. Instructions for AI

### 2.1 Milestones

### Milestone: CI skip label

- Files owned: `.github/workflows/pr.yml`, `.github/workflows/typecheck.yml`, `.github/workflows/storybook-tests.yml`, `.github/workflows/docs-e2e.yml`, `.github/workflows/installation-e2e.yml`, `CONTRIBUTING.md`, `docs/code-of-conduct/coding-standards.md`
- Depends on: none
- Review: fable
- Local CI: `pnpm test lint`, `pnpm test validate-repo`, the `act` runs of 1.6.1
- Task 1: The `skip` output of Head, the six uses, the comments and the four input descriptions (1.6.1). Checks: `grep -c 'needs.head.outputs.bumped' .github/workflows/pr.yml` prints `0`; `grep -c 'needs.head.outputs.skip' .github/workflows/pr.yml` prints `6`; `act pull_request -W .github/workflows/pr.yml -j head` prints `skip=false` for a PR without the label and `skip=true` for the labelled case, both lines in the tracker with what `act` could not reproduce named (P3)
- Task 2: The sentence in `CONTRIBUTING.md` and in `docs/code-of-conduct/coding-standards.md` (1.6.1). Checks: `grep -c 'ci:skip' CONTRIBUTING.md docs/code-of-conduct/coding-standards.md` prints `1` or more for each file; `pnpm test lint` and `pnpm test validate-repo` green

### Milestone: Ship the home page label

- Files owned: none
- Depends on: CI skip label, Home page version label
- Review: none
- Local CI: none (the PR's run is the proof; a red is reproduced under `act`, P3)
- Task 1: The precondition, the label and the fast-forward of `dev` (1.6.2). Checks: `git merge-base --is-ancestor origin/master origin/claude/review` exits 0; the trackers of spec 70 and of `CI skip label` say `Status: done`; `gh label list --json name --jq '[.[].name] | index("ci:skip") != null'` prints `true`; `git rev-parse origin/dev` equals the head of `claude/review`
- Task 2: The PR with both labels and auto-merge, its run and the merge (1.6.2). Checks: `gh pr view <N> --json labels --jq '[.labels[].name] | sort'` prints `["ci:skip","release:skip"]`; the Head log holds `skip=true`; `gh run view <id> --json jobs --jq '[.jobs[] | select(.conclusion != "success" and .conclusion != "skipped")] | length'` prints `0`; no matrix leg ran a `pnpm test` step (the job's step list in the tracker for one leg); `gh pr view <N> --json state --jq .state` prints `MERGED`
- Task 3: After the merge (1.6.2): `release.yml` says `none`, the live check, the branches up to `master`. Checks: `git ls-remote --tags origin v0.9.8` prints nothing; `curl -fsS https://www.shadcn-table.com/version.txt` prints `0.9.7`; one line per live read in the tracker with the text read and pass or fail, the browser closed; `git rev-parse origin/claude/review origin/dev origin/master` prints one sha three times

### 2.2 Checks

- CI skip label: lint and validate-repo green; the two `act` lines recorded; review by fable on the whole diff (a change to what gates `master`)
- Ship the home page label: the PR run with no test step, the merge, no tag, the live reads
- Worktrees from the pool 01 to 09 only; the root checkout, `wt1` and `wt2` are never used for a checkout, an install or a build (P2); heavy checks one at a time (P5)
