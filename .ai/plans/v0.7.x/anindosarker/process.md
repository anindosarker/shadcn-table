# Expedition process, v0.7.x

Rules the expedition skill reads for this cycle. Cite as `(P<n>)`. A new cycle copies this file and trims it; a deleted rule leaves its number unused, a new rule takes the next free number, numbers never move.

## Owner input

## P1 Owner comments are feedback, not rulings; a decision exists only after the owner accepts it

## P2 Verify before proposing: file:line facts from the repo or a tool, never from memory

## P3 Lookups and sweeps go to a sub-agent; the main session plans, reviews and decides

## P4 Every listed item states the problem and the recommended action together

## P5 No housekeeping questions; park them in the handoff

## P6 A pasted side-agent note is feedback: explain the trade-off, give options with a lean, the owner picks

## P7 Questions stay in chat, never in a file and never in the question tool

## Discuss and plan

## P8 Read the last handoff and the open ATTENTION file in full before the first word

## P9 Walk ATTENTION items one at a time: facts, lean, wait for the owner

## P10 Reproduce a bug live before proposing its fix

- Test projects: `/Users/anindosarker/Work/Personal/React-table/test-projects/`.

## P11 Search upstream before proposing an upstream report

- `gh search issues --repo shadcn-ui/ui "<symptom>"`; link it and stop when it exists.

## P12 One audit agent maps every site a change touches before the part is written

## P13 Decisions are numbered items with why, what and what stays; an addendum goes under the decision it touches, dated

## P14 Parts follow `docs/code-of-conduct/planning-guidelines.md`; the Parts table lists `#`, `Part`, `Scope` only

## P15 Ride-alongs (a timeout bump, a format glob) join the part they are near, never their own part

## P16 After a release, fast-forward `claude/review` and `dev` to `master` before the next plan commit

- Tracker, ATTENTION and handoff commits during a round land on `claude/review` without a sync.

## Run

## P17 Lanes: `workflow` for a review bounce or several layers; `agent` for one bounded concern, whatever its file count; `inline` for edits with no logic (a rename, a version bump, a changelog line, a file move) and the release

## P18 `opus` for mechanical work (build, fix, verify, lookups); `fable` for plan writing, review and verify judgment

## P19 One numbered worktree per part at `../shadcn-react-table.worktrees/<NN>`, reused across cycles

- `git fetch origin && git checkout -B v<major>.<minor>/<slug> origin/claude/review && git push -u origin <branch>`; never from an unmerged tip.
- `pnpm install --frozen-lockfile` only when `node_modules` is missing.
- Never touch `wt1` and `wt2`.

## P20 Gates run once, recorded in the tracker as one line each: command, commit, result

- Per-base gates run concurrently, each on its own port: `check-pages.mjs --base <base>`, `storybook:build:<base>`, `test:<base>`.
- The verifier reruns only a gate with no valid line for HEAD; a line stays valid when `git diff --name-only <commit>..HEAD` touches only `.ai/` and `CHANGELOG.md`. This file wins over the skill's wording.
- CI is the second run for tsc, lint, tests and builds.

## P21 The main session reads an agent's commit against the part (files touched equal files planned, the changed text once) before the PR; in the `agent` lane the main session opens the PR

## P22 Workflow scripts start from the skill's `templates/workflow.js`; `meta.name`, `PARTS`, `BASE_SHA` and `SPECIFICS` change, the rest stays

- Several parts in one run: one `PARTS` entry per part, each with its own worktree, file sets named in `SPECIFICS`.

## P23 The loop tick reports which stage runs and the commits so far, from `<transcriptDir>/journal.jsonl` through a sandboxed read, never from a raw transcript; the loop is `ScheduleWakeup` dynamic mode with the skill's prompt

## P24 Known flake: `Profiled Thousand Rows` (vitest browser mode); `gh run rerun --failed <id>` once before red

## Merge and release

## P25 Branches: `claude/review` integration, `dev` its fast-forward mirror, `master` release only

## P26 Merge a part on green local gates; `pr.yml` on `claude/review` is the backstop

- PR into `claude/review` with `.github/pull_request_template.md`, the `release:` label the index names for the part, the session URL last.
- Merge commit subject `merge: v<major>.<minor> part <NN> (#<PR>)`.
- Then `dev`: `git merge --ff-only origin/claude/review && git push`.
- Start the next part at once. The next loop tick reads the backstop run; red is fixed forward by the running part, or by a fix commit when none runs.

## P27 Release once per round, in the background, never blocking the next part

- PR `dev` into `master`, title `release: <version>`, the round's `release:` label, body with summary and checklist.
- CI watcher: background loop over `gh pr checks <N> --json name,state` every 60 s; exit on `FAILURE`, `ERROR`, `CANCELLED`; done when nothing is `IN_PROGRESS`, `PENDING`, `QUEUED`. `SKIPPED` from the `labeled` run is normal.
- Merge: `merge: release <version> (#<N>)`.
- `release.yml` run 1 opens the bot PR `chore: version <version>` from `release/next`; it has no checks; merge it directly: `merge: version <version> (#<N>)`.
- `release.yml` run 2: tag, wait for production (`version.txt`, 8 to 9 min), smoke, five installs, GitHub release, PR comments. `gh run watch <id> --exit-status`, then `gh release view v<version>`.
- Sync `claude/review` and `dev` fast-forward to `origin/master` (P16).

## P28 A failed late release step leaves the tag; rerun with `gh workflow run release.yml --ref master -f version=<version> -f dry_run=false`

## P29 Never force-push `master`, `dev` or `claude/review`; never bare `git stash`

## Attention, handoff, report

## P30 Agents stage owner items under `## Attention` in the tracker; the main session writes `attentions/ATTENTION-<date>.md` only when something needs the owner

- The autopilot start script prints another ATTENTION path; the cycle's `attentions/` wins.

## P31 A deviation is reported as keep or revert, with the exact strings, never as an implementation question

## P32 One handoff per round in `handoffs/handoff-<datetime>.md`, rewritten in place at each part boundary

## P33 Final report, five bullets max: done, skipped, ATTENTION path, last commit, next; push notification before the loop stops

## P34 When a round feels slow, measure per-agent durations from the workflow transcripts before changing anything

## Agent rules

## P35 Work only in the worktree and branch named in the task; never the main checkout or another worktree

## P36 Never kill ports 5273, 5320, 5330, 6006, 6007, 6008, 5310; 5310 is the shared dev registry (`pnpm registry:dev`), reuse it when running and start it when not; take 5340 to 5360 for anything else and stop what you start

## P37 Commits: Conventional Commits, one concern each, `pnpm format` once before, push after each, trailer exactly `Claude-Session: https://claude.ai/code/session_<id>` as the harness reminder gives it

## P38 No em dashes anywhere

## P39 Never edit a shadcn part by hand; parts change only through `pnpm add-part <base> <part>`

## P40 Never reorder or change `BASES` in `packages/shadcn-table/scripts/registry/bases.mjs`

## P41 `pnpm install` without `--frozen-lockfile` rewrites unrelated lockfile lines; add a dependency by hand plus its importer entry, verify with `--frozen-lockfile`

## P42 The owner is away: pick the sensible default, stage a judgment call under `## Attention` in `trackers/<NN>-tracker.md`, halt only on a halt condition the index names and return `halt=true` with the reason

## P43 The final text is a return value for a script or the main session, not a message to a human

## Cycle files

## P44 Cycle folder: `<cycle>-plan.md`, `decisions.md`, `findings.md`, `process.md` at the root; `parts/`, `trackers/`, `attentions/`, `handoffs/`

## P45 Index edits are free before a part starts; after it starts, a change becomes a sub-part

## P46 Readiness refute: at most two passes, the second on the diff of the first

## P47 Every owner correction becomes a memory file with Why and How to apply, plus a MEMORY.md line

## P48 Gate baselines (a built tree to diff against) go in the session scratchpad, never in the repo

## P49 Pause a run with `ScheduleWakeup stop`; resume a workflow with `resumeFromRunId`; a stopped loop restarts with the skill's loop prompt

## P50 The index names each part's `release:` label and the round's version bump
