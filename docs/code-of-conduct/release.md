# Release rules

How a part reaches `master` and becomes a release. Applies to humans and agents. The
expedition skill reads this file as the project's release rule file.

## Branches

- `claude/review`: integration. Parts merge here.
- `dev`: fast-forward mirror of `claude/review`; the release PR comes from it.
- `master`: release only. Every push runs `release.yml`.
- A part branch is `v<major>.<minor>/<slug>` from `origin/claude/review`, in its own worktree.

## Merge a part

1. Local gates green (the part file's section 2.2, per base where it says so, recorded in
   the tracker with command, commit and result).
2. The main session reads the commit against the part file: files touched equal files
   planned, the changed text read once.
3. Open the PR into `claude/review` with the template body and exactly one `release:` label
   (`release:patch`, `release:minor`, `release:major`, `release:skip`). The body ends with the
   session URL when the repo's attribution rule applies.
4. Merge at once by merge commit, subject `merge: v<major>.<minor> part <NN> (#<PR>)`. Do not
   wait for `pr.yml` on the PR: it runs again on the push to `claude/review` and is the
   backstop. Read its result later; a red backstop is the next fix, not a revert.
5. `git checkout claude/review && git pull --ff-only`, then `dev`: `git merge --ff-only
   origin/claude/review && git push`.
6. Start the next part now. Nothing below blocks it.

## Release a round

Once per round, not per part, in the background.

1. PR `dev` into `master`, title `release: <version>`, the round's `release:` label, body
   with the summary and the checklist (`pr.yml` green on the part PRs, `CHANGELOG.md`
   `## Unreleased` present, the label).
2. CI watcher, not a foreground wait: a background loop over
   `gh pr checks <N> --json name,state` every 60 s. Exit on any `FAILURE`, `ERROR` or
   `CANCELLED`; done when no check is `IN_PROGRESS`, `PENDING` or `QUEUED`. `SKIPPED`
   entries come from the `labeled` event run and are normal.
3. Merge: `merge: release <version> (#<N>)`.
4. `release.yml` run 1 (`decide`): `## Unreleased` present and a label, so it opens the bot
   PR `chore: version <version>` from `release/next` (version in both `package.json`, the
   changelog heading). That PR has no checks (`pr.yml` on `release/next` is
   `action_required`). Merge it directly: `merge: version <version> (#<N>)`.
5. `release.yml` run 2: tag `v<version>`, wait for production (polls
   `https://www.shadcn-table.com/version.txt` every 30 s, 20 min timeout, Vercel takes 8 to
   9 min), smoke (`scripts/release/smoke.mjs`), five installs, GitHub release, comments on
   the round's PRs. Watch with `gh run watch <id> --exit-status`, then
   `gh release view v<version>`.
6. Sync: `claude/review` and `dev` fast-forward to `origin/master`. Plan and handoff commits
   go on `claude/review` only after this sync, so history stays fast-forward.

## When a release step fails

- Smoke or install red after the tag exists: the next push to `master` decides `none`. Fix
  on `claude/review`, merge through `dev` as a `release:patch` round, or rerun the same
  version with `gh workflow run release.yml --ref master -f version=<version> -f
  dry_run=false` once the deploy is fixed.
- A single timeout of `Profiled Thousand Rows` (vitest browser mode) is a known runner
  flake: `gh run rerun --failed <id>` once before treating it as red.
- Never force-push `master`, `dev` or `claude/review`. Never bare `git stash` (the stack is
  shared across worktrees).
