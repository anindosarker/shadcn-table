# How I ran the shadcn-table cycles (0.6.1 to 0.6.4), as a process

Written 2026-10-31 from the session that shipped parts 03 to 08. Each bullet is what I did, not what the expedition skill says. The "Gaps" section at the end compares the two.

## 0. Standing rules I apply before anything

- Owner comments are feedback, not rulings. I propose, the owner accepts, then it is a decision. Nothing goes into `decisions.md` before that.
- Diagnose and propose first; no file edit until "go". Trivial choices (names, defaults, wording) I decide myself and say so.
- Verify before proposing: file:line facts from the repo or from tools, never from memory. Lookups and sweeps go to a sub-agent (Explore or general-purpose); the main session reads the conclusion.
- Every listed item states the problem and the recommended action together.
- No housekeeping questions (branch deletion, screenshot cleanup). Park them in the handoff.
- Questions stay in chat, never in plan files. Never the AskUserQuestion tool.
- No em dashes anywhere. Commits: Conventional Commits, trailer `Claude-Session: <url>`. PR bodies end with the session URL.
- Memory: every owner correction becomes a memory file with Why and How to apply, plus a MEMORY.md line.

## 1. Discuss stage

- Read the handoff and the ATTENTION file of the previous round first, in full, before saying anything.
- Go through ATTENTION items one at a time: facts, my proposal, wait for the owner. Mark each ruling in chat; collect them for `decisions.md`.
- For an item that needs evidence (a bug, an upstream behaviour), reproduce it live on the owner's test project before proposing a fix. Example: the shadcn `'use client'` `/g` regex, reproduced with two `shadcn add` orders on `test-projects/vite-app`.
- Check upstream before proposing an upstream report: `gh search issues --repo shadcn-ui/ui` for the symptom; if filed, link it and stop.
- Side-agent notes the owner pastes ("Heads up ...") are feedback too: explain the trade-off, give two options with my lean, let the owner pick.
- When the owner asks "what do we need to decide", list only decisions whose answer changes the work; say "decided already, no need to bring it up" when the owner says so and drop it.
- Record accepted decisions as one numbered item with sub-bullets (why, what, what stays), in the cycle's `decisions.md`. Addenda to an earlier decision go under that decision with a date.

## 2. Plan stage

- One part file per decision group, written by me in the project template (`docs/code-of-conduct/planning-guidelines.md`): 1.1 overview with the decision link, 1.2 measurable goals, 1.3 current structure, 1.4 target structure (one line per file), 1.6 components with does and does NOT, operations table with new, keep, refactor, "stays unchanged", 2.1 phases with a `Lane:` line and gates per phase, 2.2 gates.
- Before writing a part, one audit agent maps every site the change touches (file:line table, visible or build-only), so the part lists real files, not guesses.
- Plan index row: `#`, `Part`, `Scope` only. Dependencies and integration sections name the branch, the worktree and the release label for the round.
- Lanes: `workflow` for anything with a review bounce or several files across layers; `agent` for one bounded change (part 08: three files); `inline` for the release phase and mechanical edits.
- Ride-along items (a timeout bump, a format glob) go into the same part as a named ride-along, not their own part.
- Commit the plan on `claude/review` only after the branches are synced to `master`, so history stays fast-forward. Plan and decisions in one commit: `docs(plan): decision N and part NN, <title>`.
- Readiness: run `status.py`; fix what it reports for the new part only. Legacy parts without `Lane:` lines are left alone.

## 3. Run stage, setup

- Start script of the autopilot skill, relay its `WARN` lines (Remote Control off).
- Worktree per part: `/…/shadcn-react-table.worktrees/07`, `git checkout -B v0.6/<slug> origin/claude/review`, `git push -u`, `pnpm install --frozen-lockfile` only when `node_modules` is missing. Never touch `wt1`, `wt2`, the owner's ports (5273, 5320, 5330, 6006 to 6008, 5310), never bare `git stash`.
- Loop: `ScheduleWakeup` dynamic mode, 20 to 30 min fallback, the workflow or watcher notification is the real wake signal. Every tick writes one or two lines of visible status before the wakeup call. `noop: true` when nothing changed.

## 4. Run stage, workflow lane

- One Workflow script per part, copied from the previous part's script and edited: `PARTS` entry (worktree, branch, plan, tracker, PR title), `BASE_SHA`, `SPECIFICS` block, review focus list.
- Script shape: `build` (opus) then up to three rounds of `review` (session model, effort high) and `fix` (opus), then `verify` (opus). Schemas: build returns `halt, head, commits, notes`; review returns `pass, findings[severity, file, line, problem, fix, standardSection]`; verify returns `allPass, head, prUrl, gates[gate, pass, output], failures, notes`.
- `RULES` block in every prompt: worktree only, ports, commit format and trailer, `pnpm format` before each commit, push after each commit, no em dashes, no hand edits to shadcn parts, decisions file to read first, halt conditions, "the owner is away, pick the default, record judgment calls under Owner attention in the tracker".
- `SPECIFICS`: everything the plan leaves to implementation but I want done one way (which helper to reuse, exact wording of a banner, which file to `git mv`, a known name clash).
- Builder: "the branch may already hold commits from an interrupted attempt, read `git log` and continue". Gates per phase, recorded in the tracker as one line each (command, head, result). Per-base gates run concurrently (three docs servers on 5340 to 5360).
- Reviewer: reads the actual diff against the plan, decisions and standards, cites the standards section, runs the cheap gates itself, never edits.
- Fixer: one commit per finding, says fixed or declined per finding.
- Verifier: reruns only gates missing for HEAD (a line stays valid when the diff since touches only `.ai/plans/` and `CHANGELOG.md`), opens one draft PR into `claude/review` with the release label and the template body, polls `pr.yml`, fixes under 30 lines itself, reruns a known flake once (`gh run rerun --failed`), appends a Gates section to the tracker.
- While the workflow runs, each loop tick checks `journal.jsonl` and the latest agent transcript tail (through `ctx_execute`, never a raw read) and reports which stage is running and the commits so far.
- Model rule: opus for build, fix, verify and lookups; the session model (fable) for review. Current owner rule goes further: fable also for plan writing.

## 5. Run stage, agent and inline lanes

- `agent` lane: one opus Agent with the same `RULES` block, the plan sections to implement, the exact gates, the tracker lines to write, "return a report for a script". I read its commit myself (`git show --stat`, the changed section) against the plan before the PR.
- `inline` lane: the release sequence, run by me from the main session with background watchers.

## 6. Release sequence (inline, every round)

- Mark the draft PR ready, merge by merge commit: `gh pr merge N --merge --subject "merge: v0.6 part NN (#N)" --body "Claude-Session: …"`.
- `claude/review` pull ff, `dev` ff-merge from `origin/claude/review`, push.
- Release PR `dev` into `master`, title `release: X.Y.Z`, label `release:patch|minor|major`, body with the summary and checklist, session URL last.
- CI watcher: a background bash loop over `gh pr checks N --json name,state` every 60 s that exits on any FAILURE, ERROR or CANCELLED and on zero IN_PROGRESS. SKIPPED entries from the `labeled` event run are normal; count only failures.
- Merge the release PR: `merge: release X.Y.Z (#N)`. Release run 1 opens the bot PR `chore: version X.Y.Z` from `release/next`; it has no checks; merge it directly: `merge: version X.Y.Z (#N)`.
- Release run 2: tag, wait for production (polls `version.txt`, 8 to 9 min), smoke, five installs, GitHub release, PR comments. Watch it with `gh run watch <id> --exit-status`, then list jobs and `gh release view vX.Y.Z`.
- After a failed late step, the tag exists and the next push decides `none`; rerun with `gh workflow run release.yml --ref master -f version=X.Y.Z -f dry_run=false`.
- Sync: `claude/review` and `dev` ff to `origin/master`. Only then commit plan or handoff changes.

## 7. Attention and triage

- During a run the trackers carry an "Owner attention" section written by the agents. I condense it into `ATTENTION-<date>.md` only when something needs the owner; otherwise no file.
- After the round I walk the items with the owner one at a time (facts, lean, wait). Outcomes go into `decisions.md` as an addendum to the decision they touch, and the ATTENTION file gets a "Reviewed <date>" section pointing at them.
- A deviation the agent took (gate conflict, name clash) is reported as "kept as shipped or revert", with the exact strings, never as a question about implementation detail.

## 8. Handoff and reporting

- One handoff per round in `handoffs/handoff-<date-time>.md` via the write-handoff skill: Ask the user first, Goal, State (stage, next, releases, branch heads, PR list), Decisions, Gotchas, Next steps, References. Rewritten in place when the round extends.
- Final chat report, five bullets max: done, skipped, ATTENTION path, last commit, next. Push notification before stopping the loop.
- Timing: when the owner asks why something is slow, measure from the workflow transcripts (agent durations, time inside gate waits) and report a table, then fix the script.

## 9. Gaps between this process and the expedition skill (as of 2026-10-31)

- Release sequence (section 6) is not in the skill and not in a project rule file. The skill says it belongs in a release part or project rules; neither exists, so every round I carried it in the loop prompt. Suggestion: `docs/code-of-conduct/release.md` in the repo with section 6 verbatim, and the skill's run.md pointing to "the project's release rule file".
- CI waiting pattern (background watcher, count only FAILURE, SKIPPED is normal) is not in the skill. Suggestion: one paragraph in run.md under "Each loop fire".
- Workflow script template: the skill describes result schemas but ships no script. I copied the previous part's script each time. Suggestion: `templates/workflow.js` with the RULES block, the four prompts and the three schemas, parameterised by `PARTS` and `SPECIFICS`.
- The RULES block (worktree only, ports, trailer, no parts by hand, halt conditions) is repeated in every prompt. Suggestion: a project file the prompts reference by path, for example `.ai/agent-rules.md`, read by every sub-agent at start.
- Main-session verification of an agent's commit before the PR (files touched equals files planned, the changed text read once) is a habit, not a rule. Suggestion: one line in run.md under Lanes for the `agent` lane: "the main session reads the commit against the part before opening the PR".
- Worktree setup checklist (branch from `origin/claude/review`, push `-u`, install only if missing, reset after merge) is absent. Suggestion: three bullets in run.md under Worktrees.
- Branch sync choreography (ff `claude/review` and `dev` to `master` after each release, plan commits only after the sync) is absent. Belongs in the release rule file.
- Known-flake handling (`gh run rerun --failed` once for a named test) is a fact branch the skill does not mention. Suggestion: add to "Facts and choices" as an example, with the project naming the flaky tests in its rules.
- Side-agent notes from the owner are not covered under "Owner input". One bullet: "a pasted side-agent note is feedback; explain the trade-off, give options, the owner picks".
- Measuring run time from transcripts when a round feels slow is not in the skill. Optional bullet under "Rules that keep runs fast": "when a part exceeds its expected time, measure per-agent durations from the workflow transcript before changing anything".
- Handoff at every part boundary: the skill asks for it; I wrote one per round at the end and rewrote it once. For single-part rounds that is the same thing; for multi-part rounds the skill is right and I should follow it.
- The current owner model rule (opus mechanical, fable for plan writing and review) is newer than the skill's line "opus for coder and mechanical stages; fable only where a review or verify stage needs judgment". Update the skill's wording to match the memory `opus-for-coders-in-workflows`.
- Decision numbering: v0.6.x uses the legacy numbered list; new cycles use `### D<n>`. The skill handles both. No change.
