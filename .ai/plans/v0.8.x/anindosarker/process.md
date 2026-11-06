# Process, v0.8.x

Project facts only. The process itself is the expedition skill; commands are in `package.json`; code rules in `docs/code-of-conduct/`; what a milestone must run is in its epic. Rules renumbered on 2026-11-06 (D88); a citation older than that reads: P2 merge → P3, P4 gates → P5, P5 sandbox → P6, P6 plans → P10, P8 styling → D23, P9 shared files → P9, P10 plays → P11, P11 attention → the skill, P12 preview → D72, P13 small fixes → P3, P14 scripts → D85.

## P1 Branches

- `claude/review`: the integration branch. Every worktree starts from it (branch `v<major>.<minor>/<slug>` created from `origin/claude/review`), and every finished milestone merges back into it.
- `dev`: the staging branch. Fast-forwarded from `claude/review` after the last feature column has merged, and again after each fix milestone the integration run produces; the only other commit on it is `chore: version <v>` by Prepare Release on the release PR. Never pushed to by hand.
- `master`: the release branch. Changes only by merging the release PR from `dev`; no other source branch, no direct push.

## P2 Milestone branch and worktree

- Branch `v<major>.<minor>/<slug>`, created from `origin/claude/review`, never from another milestone's unmerged branch.
- Worktree from the pool `../shadcn-react-table.worktrees/01`, `02`, `03` (clean, dependencies installed). Reset for the branch:

  ```sh
  git -C <wt> fetch origin && git -C <wt> checkout -B <branch> origin/claude/review && git -C <wt> push -u origin <branch>
  ```

- A new numbered worktree only when all three are busy; it joins the pool. Never remove a pool worktree; never touch `wt1` or `wt2`.
- The tracker records the branch and the worktree.
- Never force-push; never bare `git stash`.

## P3 Merge

- A milestone merges into `claude/review` the moment its recorded checks pass: `merge: <milestone> (<epic>)`, then the branch is deleted local and remote. No PR, no CI wait; the next milestone starts at once.
- A small fix (a constant, a copy change, a one-file docs fix) skips the verifier and is merged from the main session.
- `act pull_request` runs `pr.yml` locally on Linux: any agent may use it when it helps; never required, never forbidden.

## P4 Release

- One PR per release: `dev` into `master`, title `release: <version>`, the `release:` label `plan.md` names.
- Auto-merge is enabled on the PR by the owner or by the agent, as the plan says; the PR merges when every required check passes.
- After the release, the main session fast-forwards `claude/review` and `dev` to `master` and pushes both before the next plan commit; no workflow does this.

## P5 Checks on a shared machine

- Several agents share this machine. Run as much in parallel as fits, but never start work that would push CPU above 90 percent or memory pressure out of the green zone; check with `top -l 1 | head -5` and `memory_pressure | tail -1` before a long check.
- The dev registry on port 5310 (`pnpm registry:dev`) is shared: reuse it, start it when missing, never kill it.
- Known flakes, rerun once before calling a check failed: `Profiled Thousand Rows` (vitest browser mode); `PanelCollapse` "Progress And Banner Collapse" (aria, F60).

## P6 Agent sandbox

- An agent works only in the worktree and on the branch its task names.
- Ports 5340 to 5360 are for agents; stop what you start. Never kill 5273, 5310, 5320, 5330, 6006, 6007 or 6008: they are the owner's servers and the shared registry.
- `/Users/anindosarker/Work/Personal/React-table/test-projects/next-app` and its server on port 3000 are the owner's reference demo: read-only, never started, stopped or restarted (D34).
- Dependencies are added only in the first sprint's shared milestone with one `pnpm install`; later milestones never touch `package.json` or the lockfile.
- Never add an `eslint-disable` without a ` -- ` reason.

## P7 Public surface

- Never rename or remove a registry item or a hosted path: `registry.json` never loses a `"name"`, `public/r/<base>/` never loses a file.
- Never remove a public option or type: a `-export` line in `types.ts` or `index.ts` without a matching `+export` is a breaking change and needs its own decision.
- Never change a GitHub ruleset or a repository setting; the owner does that, or authorizes it once in a decision.

## P8 Commits

- Push right after every commit; never hold commits locally.
- `pnpm format` once before each commit; revert any reformat of `.ai/plans/**/reference/**`, never commit it.

## P9 Shared files

- No milestone owns these files; every milestone may append to them, in a conflict both sides are kept in order.
- `packages/shadcn-table/registry/<base>/components/ui/shadcn-table/index.ts`: each milestone's exports under its own `// spec NN` comment.
- `CHANGELOG.md`: one `#### Spec NN` block per milestone under `## Unreleased` (`#### Spec NN <milestone>` when an epic has several milestones).
- `registry.json`, the `examples-*-diff.json` lists and `apps/shadcn-table-docs/components/ui-<base>/` are generated: regenerated at merge, never hand-merged.
- `tools/registry/{base,aria}-diff.json` (today `packages/shadcn-table/scripts/registry/`) are hand-kept allow lists, owned by the milestone that adds the differing file.

## P10 Plans

- Epics follow `docs/code-of-conduct/planning-guidelines.md`.
- `plan.md` names the release's `release:` label and any epic whose label differs.
- An `Acceptance:` line points at a reference that exists: a ui.shadcn.com page, a shadcn block, the previous release, a capture of `claude/review` before the change, or a demo the owner supplied.
- A bug is reproduced in `/Users/anindosarker/Work/Personal/React-table/test-projects/` before it is planned; an upstream report is searched on `shadcn-ui/ui` before one is filed.

## P11 Plays

- Every story file has at least one play; a feature story file has one play per behaviour it shows. A story file without a play is a finding (D59).
- A play written for a fix runs on the shipped code first and must fail there; that failure is recorded in the tracker.
