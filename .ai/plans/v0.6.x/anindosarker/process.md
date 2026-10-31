# Expedition process, v0.6.x

Project facts the expedition skill reads for this cycle. Cite as `(P<n>)`. The process itself (lanes, models, loop, gates once, Done when, attention, handoff) lives in the skill; this file says only what this project is.

## P1 Branches and worktrees

- `claude/review` integration, `dev` its fast-forward mirror, `master` release only.
- A run branch is `v<major>.<minor>/<slug>` from `origin/claude/review`, never from an unmerged tip; its worktree is `../shadcn-react-table.worktrees/<slug>`. Never touch `wt1` and `wt2`.
- Never force-push these branches; never bare `git stash` (shared stack).
- After a release, fast-forward `claude/review` and `dev` to `master` before the next plan commit; tracker, ATTENTION and handoff commits during a round need no sync.

## P2 Merge a part on green local gates

- `pr.yml` runs on pull requests only: the builder opens the draft PR into `claude/review` at its first push (body per `.github/pull_request_template.md`, the label the index names, the session URL last) so every push gets a CI run.
- Merge commit the moment the recorded gates are green: `merge: v<major>.<minor> part <NN> (#<PR>)`, or `parts <NN>, <NN>` for a shared run. Then `dev` fast-forward. Start the next run at once.

## P3 Release once per round, in the background

- PR `dev` into `master`, title `release: <version>`, the round's `release:` label, summary and checklist; a background watcher on `gh pr checks` (count `FAILURE`, `ERROR`, `CANCELLED`; `SKIPPED` from the labeled run is normal); merge `merge: release <version> (#<N>)`.
- `release.yml` run 1 opens the bot PR `chore: version <version>`; no checks; merge `merge: version <version> (#<N>)`. Run 2: tag, production wait (`version.txt`, 8 to 9 min), smoke, five installs, GitHub release, comments. `gh run watch <id> --exit-status`, `gh release view v<version>`.
- A failed late step leaves the tag: `gh workflow run release.yml --ref master -f version=<version> -f dry_run=false`.

## P4 Gates

- Per-base gates run concurrently on their own ports: `check-pages.mjs --base <base>`, `storybook:build:<base>`, `test:<base>`. The dev registry on 5310 (`pnpm registry:dev`) is shared: reuse it, start it when missing, never kill it.
- A recorded gate line stays valid while `git diff --name-only <commit>..HEAD` touches only `.ai/` and `CHANGELOG.md`; CI is the second run for tsc, lint, tests and builds.
- Known flake: `Profiled Thousand Rows` (vitest browser mode), `gh run rerun --failed <id>` once before red.

## P5 Agent sandbox

- Only the worktree and branch named in the task. Never kill ports 5273, 5320, 5330, 6006, 6007, 6008, 5310; take 5340 to 5360 and stop what you start.
- Commits: Conventional Commits, one concern each, `pnpm format` once before, push after each, the exact `Claude-Session:` line the harness reminder gives.
- Never edit a shadcn part by hand (`pnpm add-part <base> <part>` only). Never change `BASES` in `scripts/registry/bases.mjs`. Add a dependency by hand plus its lockfile importer entry, verify with `pnpm install --frozen-lockfile`. `pnpm install --frozen-lockfile` only when `node_modules` is missing.

## P6 Plans

- Parts follow `docs/code-of-conduct/planning-guidelines.md`; the index names the round's `release:` label, the version bump, and any part whose label differs.
- `Done when` references: ui.shadcn.com pages, shadcn blocks, the previous release, a capture of `claude/review` before the change, or an owner-supplied demo. Bugs are reproduced on `/Users/anindosarker/Work/Personal/React-table/test-projects/` first; upstream reports are searched on `shadcn-ui/ui` before filing.
