# Expedition process, v0.8.x

Project facts the expedition skill reads for this cycle. Cite as `(P<n>)`. The process itself (orchestration, models, loop, gates once, Acceptance, attention, handoff) lives in the skill; this file says only what this project is.

## P1 Branches, merges, PRs and CI (D81, D83)

- `claude/review` is where work lands, `dev` the release staging branch, `master` release only.
- A milestone runs on a branch `v<major>.<minor>/<slug>` cut from `origin/claude/review`, never from an unmerged tip, in a pool worktree `../shadcn-react-table.worktrees/01`, `02`, `03` (clean, dependencies installed), reset with `git -C <wt> fetch origin && git -C <wt> checkout -B <branch> origin/claude/review && git -C <wt> push -u origin <branch>`; a new numbered worktree only when every pool one is busy, and it joins the pool; never remove one; never touch `wt1` and `wt2`. Branch and worktree are recorded in the tracker. Never force-push; never bare `git stash`.
- Gates run locally: the `pr.yml` jobs are pnpm scripts; the builder runs the ones the epic names for its milestone and records them, the verifier reruns what is missing. A milestone merges into `claude/review` with a merge commit the moment its recorded gates are green (`merge: <milestone> (<epic>)`), the branch is deleted local and remote, the next milestone starts at once. No PR, no CI wait. A small fix (a constant, a copy change, a one-file docs fix) skips the verifier and is merged from the main session.
- `dev` is untouched during the sprints. After the last feature column merges, `claude/review` fast-forwards into `dev` once; the release epic's integration milestone runs the suite on `dev` through a verifier; a red is a fix milestone on `claude/review`, then `dev` again. `act pull_request` (nektos act, Docker) runs `pr.yml` locally on Linux: available to any agent at any stage when it helps, never required, never forbidden.
- One PR per release: `dev` into `master`, created with its `release:` label and auto-merge; `pr.yml` is the CI run, its last job bumps the version onto the PR after every other job is green; the owner approves; `release.yml` runs once on the merge (P3). `.github/pull_request_template.md` applies to that PR only.
- After a release, fast-forward `claude/review` and `dev` to `master` before the next plan commit.

## P3 Release once per release, in the background

- PR `dev` into `master`, title `release: <version>`, the release's `release:` label, summary and checklist; a background watcher on `gh pr checks` (count `FAILURE`, `ERROR`, `CANCELLED`; `SKIPPED` from the labeled run is normal); merge `merge: release <version> (#<N>)`.
- `release.yml` run 1 opens the bot PR `chore: version <version>`; no checks; merge `merge: version <version> (#<N>)`. Run 2: tag, production wait (`version.txt`, 8 to 9 min), smoke, five installs, GitHub release, comments. `gh run watch <id> --exit-status`, `gh release view v<version>`.
- A failed late step leaves the tag: `gh workflow run release.yml --ref master -f version=<version> -f dry_run=false`.

## P4 Gates

- Per-base gates run on their own ports: `check-pages.mjs --base <base>`, `storybook:build:<base>`, `test:<base>`. The machine is loaded while several stories run (owner, 2026-11-04): each agent runs its per-base gates one base after another, never two `test:<base>` or two Storybook builds at once, and starts a long gate only after its previous one exited. The dev registry on 5310 (`pnpm registry:dev`) is shared: reuse it, start it when missing, never kill it.
- A recorded gate line stays valid while `git diff --name-only <commit>..HEAD` touches only `.ai/` and `CHANGELOG.md`; CI is the second run for tsc, lint, tests and builds.
- Known flake: `Profiled Thousand Rows` (vitest browser mode), `gh run rerun --failed <id>` once before red.
- Plays that move the real pointer (`stBrowserUserEvent`) leave it over the next file's story; `vitest.setup.ts` resets it after each test (`resetPointer`). A play that needs the real pointer uses that helper, never raw `page.mouse` without the reset.
- `pnpm --filter shadcn-table-docs lib:install <base>` reads `packages/shadcn-table/public/r/` (run `pnpm -w registry:build` first) and writes one shared temporary `components.json`: the three bases install one after another, never in parallel.

## P5 Agent sandbox

- Only the worktree and branch named in the task. Never kill ports 5273, 5320, 5330, 6006, 6007, 6008, 5310; take 5340 to 5360 and stop what you start.
- The owner's demo at `/Users/anindosarker/Work/Personal/React-table/test-projects/next-app` is read-only reference code; its server on port 3000 is the owner's, never started, stopped or restarted by an agent (D34).
- Commits: Conventional Commits, one concern each, `pnpm format` once before, push after each, the exact `Claude-Session:` line the harness reminder gives.
- Never edit a shadcn part by hand (`pnpm add-part <base> <part>` only). Never change `BASES` in `scripts/registry/bases.mjs`. Dependencies are added in the first sprint's shared story with one `pnpm install`; later stories never touch `package.json` or the lockfile; `pnpm install --frozen-lockfile` only when `node_modules` is missing.
- Never rename or remove a registry item or hosted path (`registry.json` loses a `"name"`, `public/r/<base>/` loses a file). Never remove a public option or type (a `-export` in `types.ts` or `index.ts` without a matching `+export`). Never change a GitHub ruleset or repository setting. Never add an `eslint-disable` without a ` -- ` reason. Never edit a file another story owns, or `eslint.config.js` and `.github/workflows/` after the first sprint.
- The run never stops for one spec: a spec that cannot be finished (it contradicts an accepted decision, or its Acceptance is unreachable) commits what is coherent, records why under `## Attention` in its tracker and returns blocked; its dependents are skipped, every other story merges and the release ships what merged.

## P6 Plans

- Specs follow `docs/code-of-conduct/planning-guidelines.md`; the index names the release's `release:` label, the version bump, and any spec whose label differs.
- `Acceptance` references: ui.shadcn.com pages, shadcn blocks, the previous release, a capture of `claude/review` before the change, or an owner-supplied demo. Bugs are reproduced on `/Users/anindosarker/Work/Personal/React-table/test-projects/` first; upstream reports are searched on `shadcn-ui/ui` before filing.

## P7 Orchestration

- Per story, by cost: fewest main-session wakes, fewest agents that still prove every Acceptance. Stories run in sprints per `sprints.md`; one dynamic Workflow per story from the skill's stage library (build, spec check, review only where a spec says `Review: fable`, verify, judges inside the script, gate, merge, release), with ultracode on in the run session (the run manager may be its own session, brief first word `ultracode`); a stage that stopped (usage limit, null result, a cached failed verify) is rerun by editing the script and resuming with `resumeFromRunId`, never as loose Agent calls (owner, 2026-11-04). Inline only for mechanical edits (a rename, a version bump, a changelog line). Judged clauses run inside the workflow script, three fable judges in parallel, majority (supersedes the main-session judging of v0.7.x D52). Models: `opus` for mechanical work (the first sprint's shared story, build, fix, spec check, verify, gate, merge, release steps, baselines, lookups); `fable` for judgment (review, judges, plan writing, readiness review). Applies from the round after 0.7.4.

## P8 Styling lives in the components

- No stylesheet, no `globals.css` edit, no registry `cssVars`, no custom CSS class. Every style is a Tailwind utility (arbitrary properties and `dark:` twins included) on a component element; a CSS variable the library reads (`--st-*`) is declared the same way on the table root. A library install never touches the consumer's global CSS. Owner rule 2026-11-03 (D23).

## P9 Shared files

- No story owns these. `index.ts`: appends under a `// spec NN` comment, both sides kept in order. `CHANGELOG.md`: one `#### Spec NN` block per story (`#### Spec NN <story>` when an epic has several), appended. `registry.json`, the `examples-*-diff.json` lists and `apps/shadcn-table-docs/components/ui-<base>/`: regenerated by the merger, never hand-merged. `scripts/registry/{base,aria}-diff.json` are hand-kept allow lists owned by the story that adds the differing file. A comment-only hunk in conflict yields to the code change.

## P10 Plays

- Every story file ships with at least one play, and a feature file with one play per behaviour it demonstrates. A play added for a fix is run on the shipped code first and must fail there; the failure is noted in the tracker. A story file without a play is a finding (D59).

## P11 Attention items earn their place

- Before an ATTENTION item or a discussion item reaches the owner, the agent reads the decisions of this cycle and the earlier cycles (`.ai/plans/*/anindosarker/decisions.md`, the specs they cite) and the findings: a question an existing decision already answers is settled by citing it (an addendum under that decision, `Source: A<n>`), never re-asked. A proposal the owner rejected before is not re-proposed. Only an unruled real choice (a visible behaviour or look, a public API, a scope change) is posted, with the decisions it touches named. Owner, 2026-11-05, after A12 re-proposed what D6 had rejected.

## P12 A previewed change is recorded as its diff

- When the owner wants to see a change before deciding, the preview is built on the generated docs copy under `apps/shadcn-table-docs/components/ui-<base>/` in a scratch worktree (no package rebuild, no browser tests unless asked) and shown on a dev server on 5340 to 5360. Once accepted, the decision carries the accepted diff verbatim (paths rewritten to the registry source), and the fix story applies that diff as is to the three bases, in place, no new helper functions. Owner, 2026-11-05 (D72).

## P14 Release gates are scripts, never agents

- A gate an agent would run by hand (an install, a build, a browser check, a capture comparison) is a checked-in script or a CI step before the spec that needs it is written; the spec's Acceptance names the script and its exit code. An agent runs a gate only when a script cannot (a judgment on a failing diff). Owner, 2026-11-06, after the 0.8.0 release (D78 to D80).
