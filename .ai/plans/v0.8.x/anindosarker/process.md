# Expedition process, v0.8.x

Project facts the expedition skill reads for this cycle. Cite as `(P<n>)`. The process itself (lanes, models, loop, gates once, Acceptance, attention, handoff) lives in the skill; this file says only what this project is.

## P1 Branches and worktrees

- `claude/review` integration, `dev` its fast-forward mirror, `master` release only.
- A run branch is `v<major>.<minor>/<slug>` from `origin/claude/review`, never from an unmerged tip. Its worktree is one of the pool `../shadcn-react-table.worktrees/01`, `02`, `03` (clean, dependencies installed), reset for the branch with `git -C <wt> fetch origin && git -C <wt> checkout -B <branch> origin/claude/review && git -C <wt> push -u origin <branch>`; a new numbered worktree only when every pool one is in use, and it joins the pool; never remove one. Never touch `wt1` and `wt2`.
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

- Per-base gates run on their own ports: `check-pages.mjs --base <base>`, `storybook:build:<base>`, `test:<base>`. The machine is loaded while several workstreams run (owner, 2026-11-04): each agent runs its per-base gates one base after another, never two `test:<base>` or two Storybook builds at once, and starts a long gate only after its previous one exited. The dev registry on 5310 (`pnpm registry:dev`) is shared: reuse it, start it when missing, never kill it.
- A recorded gate line stays valid while `git diff --name-only <commit>..HEAD` touches only `.ai/` and `CHANGELOG.md`; CI is the second run for tsc, lint, tests and builds.
- Known flake: `Profiled Thousand Rows` (vitest browser mode), `gh run rerun --failed <id>` once before red.
- `pnpm --filter shadcn-table-docs lib:install <base>` reads `packages/shadcn-table/public/r/` (run `pnpm -w registry:build` first) and writes one shared temporary `components.json`: the three bases install one after another, never in parallel.

## P5 Agent sandbox

- Only the worktree and branch named in the task. Never kill ports 5273, 5320, 5330, 6006, 6007, 6008, 5310; take 5340 to 5360 and stop what you start.
- The owner's demo at `/Users/anindosarker/Work/Personal/React-table/test-projects/next-app` is read-only reference code; its server on port 3000 is the owner's, never started, stopped or restarted by an agent (D34).
- Commits: Conventional Commits, one concern each, `pnpm format` once before, push after each, the exact `Claude-Session:` line the harness reminder gives.
- Never edit a shadcn part by hand (`pnpm add-part <base> <part>` only). Never change `BASES` in `scripts/registry/bases.mjs`. Dependencies are added in the cycle's foundation commit with one `pnpm install`; workstreams never touch `package.json` or the lockfile; `pnpm install --frozen-lockfile` only when `node_modules` is missing.
- Never rename or remove a registry item or hosted path (`registry.json` loses a `"name"`, `public/r/<base>/` loses a file). Never remove a public option or type (a `-export` in `types.ts` or `index.ts` without a matching `+export`). Never change a GitHub ruleset or repository setting. Never add an `eslint-disable` without a ` -- ` reason. Never edit a file another workstream owns, or `eslint.config.js` and `.github/workflows/` after the foundation.
- The run never stops for one spec: a spec that cannot be finished (it contradicts an accepted decision, or its Acceptance is unreachable) commits what is coherent, records why under `## Attention` in its tracker and returns blocked; its dependents are skipped, every other workstream merges and the release ships what merged.

## P6 Plans

- Specs follow `docs/code-of-conduct/planning-guidelines.md`; the index names the round's `release:` label, the version bump, and any spec whose label differs.
- `Acceptance` references: ui.shadcn.com pages, shadcn blocks, the previous release, a capture of `claude/review` before the change, or an owner-supplied demo. Bugs are reproduced on `/Users/anindosarker/Work/Personal/React-table/test-projects/` first; upstream reports are searched on `shadcn-ui/ui` before filing.

## P7 Orchestration

- Per round, by cost: fewest main-session wakes, fewest agents that still prove every Acceptance. One dynamic Workflow per round from the skill's stage library (build, spec check, review only where a spec says `Review: fable`, verify, judges inside the script, gate, merge, release), with ultracode on in the run session; a stage that stopped (usage limit, null result, a cached failed verify) is rerun by editing the script and resuming with `resumeFromRunId`, never as loose Agent calls (owner, 2026-11-04). Inline only for mechanical edits (a rename, a version bump, a changelog line). Judged clauses run inside the workflow script, three fable judges in parallel, majority (supersedes the main-session judging of v0.7.x D52). Applies from the round after 0.7.4.

## P8 Styling lives in the components

- No stylesheet, no `globals.css` edit, no registry `cssVars`, no custom CSS class. Every style is a Tailwind utility (arbitrary properties and `dark:` twins included) on a component element; a CSS variable the library reads (`--st-*`) is declared the same way on the table root. A library install never touches the consumer's global CSS. Owner rule 2026-11-03 (D23).
