# Process, v0.9.x

Project facts only. The process itself is the expedition skill; commands are in `package.json`; code rules in `docs/code-of-conduct/`; what a milestone must run is in its spec. Copied from v0.8.x and audited on 2026-11-08 (D9); the numbers P1 to P11 are unchanged, so v0.8.x citations still read.

## P1 Branches

- `claude/review`: the integration branch. Every worktree starts from it (branch `v<major>.<minor>/<slug>` created from `origin/claude/review`), and every finished milestone merges back into it.
- `dev`: the staging branch. Untouched until a release spec runs; then fast-forwarded from `claude/review` once, and again after each fix milestone the integration run produces; the only other commit on it is `chore: version <v>` by Prepare Release on the release PR. Never pushed to by hand.
- `master`: the release branch. Changes only by merging the release PR from `dev`; no other source branch, no direct push.

## P2 Milestone branch and worktree

- The worktree pool is `../shadcn-react-table.worktrees/01` to `09`, each clean with dependencies installed; `wt1`, `wt2` and `changelog` beside them are not pool worktrees and are never touched.
- Never force-push; never bare `git stash` (the stash stack is shared by every worktree).

## P3 Merge

- The merge commit of a milestone into `claude/review` is `merge: <milestone> (<spec>)`; the milestone branch is deleted local and remote right after.
- `act pull_request` runs `pr.yml` locally on Linux: any agent may use it when it helps; never required, never forbidden.

## P4 Release

- No release is planned for v0.9.x yet; every epic merges into `claude/review` and stays there until a release spec is decided (owner, 2026-11-08).
- A release is one PR, `dev` into `master`, title `release: <version>`, with the release label, auto-merge enabled at creation; the bump job `prepare-release` waits for the owner's Approve on the GitHub Environment `release` (D3). The environment and the `environment: release` line in `pr.yml` are not in place yet; D3's spec adds them.
- After a release, the main session fast-forwards `claude/review` and `dev` to `master` and pushes both before the next plan commit; no workflow does this.

## P5 Checks on a shared machine

- The test runner is `pnpm test` followed by the test name, with `--base base|radix|aria`, `--scenario` and `--ci` as flags, from the repo root (`test/run.mjs`); `pnpm test --list` names the tests, `--all` runs every one, `--changed` runs those touched since `origin/claude/review`; runs are never parallel and their records go to `test/.out/`. `validate-pr` and `validate-production` run only in CI.
- Several agents share this machine. Run as much in parallel as fits, but never start work that would push CPU above 90 percent or memory pressure out of the green zone; check with `top -l 1 | head -5` and `memory_pressure | tail -1` before a long check.
- The dev registry on port 5310 (`pnpm registry:dev`) is shared: reuse it, start it when missing, never kill it.
- Known flakes, rerun once before calling a check failed: `Profiled Thousand Rows` (vitest browser mode); `PanelCollapse` "Progress And Banner Collapse" (aria, v0.8.x F60); docs E2E "pauses when scrolled away mid-step" (v0.8.x F61); `ClickToCopy` "Click Copies Value" (base, radix) and `RowOrdering` "Drag Reorders Rows" (aria) under load (F8, D14).

## P6 Agent sandbox

- The talker session runs in `/Users/anindosarker/Work/Personal/React-table` (the workspace folder above the repo); the runner and the spec forks are started from that same folder, never from the repo root or a subfolder, so every session resolves the same paths.
- Ports 5340 to 5360 are for agents; stop what you start. Never kill 5273 (the owner's test-shadcn vite server), 5310, 5320, 5330, 6006, 6007 or 6008: they are the owner's servers and the shared registry.
- `/Users/anindosarker/Work/Personal/React-table/test-projects/next-app` and its server on port 3000 are the owner's reference demo: read-only, never started, stopped or restarted (v0.8.x D34).
- A new dependency is added by the first milestone of the epic that needs it, with one `pnpm install`, and that milestone owns `package.json` and the lockfile for its epic; no other running milestone touches them.

## P7 Public surface

- Never rename or remove a registry item or a hosted path: `registry.json` never loses a `"name"`, `public/r/<base>/` never loses a file.
- Never remove a public option or type: a `-export` line in `types.ts` or `index.ts` without a matching `+export` is a breaking change and needs its own decision.
- Never change a GitHub ruleset or a repository setting; the owner does that, or authorizes it once in a decision.

## P8 Commits

- Push right after every commit; never hold commits locally.
- A reformat of `.ai/plans/**/reference/**` is reverted before the commit, never committed.

## P9 Shared files

- No milestone owns these files; every milestone may append to them, in a conflict both sides are kept in order.
- `packages/shadcn-table/registry/<base>/components/ui/shadcn-table/index.ts`: each milestone's exports under its own `// spec NN` comment.
- `CHANGELOG.md`: one `#### Spec NN` block per milestone under `## Unreleased` (`#### Spec NN <milestone>` when a spec has several milestones); released versions keep their older `Spec` headings.
- Generated, never hand-edited: `registry.json`, the `examples-*-diff.json` lists, `apps/shadcn-table-docs/components/ui-<base>/` and `public/r/`.
- `tools/registry/{base,aria}-diff.json` are hand-kept allow lists, owned by the milestone that adds the differing file.

## P10 Plans

- An `Acceptance:` line points at a reference that exists: a ui.shadcn.com page, a shadcn block, the previous release, a capture of `claude/review` before the change, or a demo the owner supplied.
- A bug is reproduced in `/Users/anindosarker/Work/Personal/React-table/test-projects/` before it is planned; an upstream report is searched on `shadcn-ui/ui` before one is filed.

## P11 Plays

- A play written for a fix runs on the shipped code first and must fail there; that failure is recorded in the tracker. (The rule that every story file has a play is in `docs/code-of-conduct/coding-standards.md`, Checks.)
