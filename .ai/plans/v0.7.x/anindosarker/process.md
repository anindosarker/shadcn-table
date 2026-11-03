# Expedition process, v0.7.x

Project facts the expedition skill reads for this cycle. Cite as `(P<n>)`. The process itself (lanes, models, loop, gates once, Acceptance, attention, handoff) lives in the skill; this file says only what this project is.

## P1 Branches and worktrees

- `claude/review` integration, `dev` its fast-forward mirror, `master` release only.
- A run branch is `v<major>.<minor>/<slug>` from `origin/claude/review`, never from an unmerged tip. It is checked out in a pool worktree: `../shadcn-react-table.worktrees/01` to `09` exist, clean, dependencies installed; the run plan assigns one per workstream and the main session runs `git -C <wt> checkout -B v<major>.<minor>/<slug> origin/claude/review && git -C <wt> push -u origin v<major>.<minor>/<slug>` there. A run that needs more worktrees than the pool holds adds `10`, `11`, ... beside them (same layout, `pnpm install --frozen-lockfile` once) and they join the pool; never remove a pool worktree, never touch `wt1`, `wt2` and `changelog`; after the merge the pool worktree keeps its branch until the next run reuses it. `pnpm install --frozen-lockfile` only when the lockfile changed since the worktree's last install.
- Never force-push these branches; never bare `git stash` (shared stack).
- After a release, fast-forward `claude/review` and `dev` to `master` before the next plan commit; tracker, ATTENTION and handoff commits during a round need no sync.

## P2 Merge a spec on green local gates

- `pr.yml` runs on pull requests only: the builder opens the draft PR into `claude/review` at its first push (body per `.github/pull_request_template.md`, the label the index names, the session URL last) so every push gets a CI run.
- Merge commit the moment the recorded gates are green: `merge: v<major>.<minor> spec <NN> (#<PR>)`, or `specs <NN>, <NN>` for a shared run. Then `dev` fast-forward. Start the next run at once.

## P3 Release once per round, in the background

- PR `dev` into `master`, title `release: <version>`, the round's `release:` label, summary and checklist; a background watcher on `gh pr checks` (count `FAILURE`, `ERROR`, `CANCELLED`; `SKIPPED` from the labeled run is normal); merge `merge: release <version> (#<N>)`.
- `release.yml` run 1 opens the bot PR `chore: version <version>`; no checks; merge `merge: version <version> (#<N>)`. Run 2: tag, production wait (`version.txt`, 8 to 9 min), smoke, five installs, GitHub release, comments. `gh run watch <id> --exit-status`, `gh release view v<version>`.
- A failed late step leaves the tag: `gh workflow run release.yml --ref master -f version=<version> -f dry_run=false`.

## P4 Gates

- Per-base gates run concurrently on their own ports: `check-pages.mjs --base <base>`, `storybook:build:<base>`, `test:<base>`. When the owner says the machine is slow or hot (2026-11-02), the release gate apps and any gate the main session starts run one base after another; builders keep one burst per spec. The dev registry on 5310 (`pnpm registry:dev`) is shared during a run: reuse it, start it when missing, never kill it mid-run; the main session stops it at the end of the run when the run started it.
- A recorded gate line stays valid while `git diff --name-only <commit>..HEAD` touches only `.ai/` and `CHANGELOG.md`; CI is the second run for tsc, lint, tests and builds.
- Known flake: `Profiled Thousand Rows` (vitest browser mode), `gh run rerun --failed <id>` once before red.

## P5 Agent sandbox

- Only the worktree and branch named in the task. Never kill ports 5273, 5320, 5330, 6006, 6007, 6008, 5310; take a free port in 5340 to 5360 (check with `lsof` first, other agents share the range), never kill a listener you did not start, and stop what you start.
- Every agent stops what it started before it returns (dev servers, Storybook, `next start`, registry serves other than 5310, agent-browser and Chrome processes). The main session, at the end of a run, stops its own servers and watchers, removes the round's worktrees, deletes the throwaway apps under `test-projects/checks/`, stops the 5310 registry when the run started it, and ends its finished sub-agents.
- Gates, smoke runs and bug repros never install into or modify an owner project (`test-projects/next-app`, `test-projects/vite-app`). Each gate creates its own throwaway app under `test-projects/checks/<base>-<purpose>/`.
- Commits: Conventional Commits, one concern each, `pnpm format` once before, push after each, the exact `Claude-Session:` line when a harness reminder gives one, otherwise no trailer. Stage named files only (`git add <path>`), never `git add .ai`, `-A` or `.`: the main checkout may hold another session's unsaved plan edits.
- Never edit a shadcn part by hand (`pnpm add-part <base> <part>` only). Never change `BASES` in `scripts/registry/bases.mjs`. Dependencies are added in the cycle's foundation commit with one `pnpm install`; workstreams never touch `package.json` or the lockfile; `pnpm install --frozen-lockfile` only when `node_modules` is missing.
- Never rename or remove a registry item or hosted path (`registry.json` loses a `"name"`, `public/r/<base>/` loses a file). Never remove a public option or type (a `-export` in `types.ts` or `index.ts` without a matching `+export`). Never change a GitHub ruleset or repository setting. Never add an `eslint-disable` without a ` -- ` reason. Never edit a file another workstream owns, or `eslint.config.js` and `.github/workflows/` after the foundation (S1's config switch excepted).
- The run never stops for one spec: a spec that cannot be finished (it contradicts an accepted decision, or its Acceptance is unreachable) commits what is coherent, records why under `## Attention` in its tracker and returns blocked; its dependents are skipped, every other workstream merges and the release ships what merged.

## P6 Plans

- Specs follow `docs/code-of-conduct/planning-guidelines.md`; the index names the round's `release:` label, the version bump, and any spec whose label differs.
- `Acceptance` references: ui.shadcn.com pages, shadcn blocks, the previous release, a capture of `claude/review` before the change, or an owner-supplied demo. Bugs are reproduced in a throwaway app under `/Users/anindosarker/Work/Personal/React-table/test-projects/checks/` first (P5); upstream reports are searched on `shadcn-ui/ui` before filing.

## P7 Orchestration

- Per round, by cost: fewest main-session wakes, fewest agents that still prove every Acceptance. As a rule one Workflow per round from the skill's stage library (build, spec check, review only where a spec says `Review: fable`, verify, judges inside the script, gate, merge, release); a single Agent for one bounded task; inline for mechanical edits. Judged clauses run inside the workflow script, three fable judges in parallel, majority (supersedes the main-session judging of D52). Applies from the round after 0.7.4.
