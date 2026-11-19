# 67: Release 0.9.6, Integration 0.9.6, tracker

Status: done (020465a0)
Branch `claude/review`, worktree 08 (checks only)
Checks:
- Check: Task 1, `git merge-base --is-ancestor origin/master origin/claude/review` at 6d6647ac: exit 0; `git merge-base --is-ancestor origin/v0.9/filter-input-fixes origin/claude/review`: exit 1; the three trackers of spec 66 say `Status: done` (a7735eb8, 68a5d989, 172b3739); `git log --oneline origin/master..origin/claude/review -- . ':!.ai'` lists 14 commits, all of spec 66, pass
- Check: Task 2, the changelog pass at 6d6647ac: nothing to move, so no commit. `## Unreleased` occurs once and holds one heading, `### Fixed`, with the two blocks `#### Spec 66 Storybook Code tab` and `#### Spec 66 Docs code panels` (2 `#### ` lines before and after), pass
- Check: `pnpm test validate-repo` at 6d6647ac in worktree 08: green (story code complete, 43 unit tests), pass
- Check: `pnpm test lint` at 6d6647ac in worktree 08: 0 errors, 9 warnings, pass
- Check: Task 3, `git push origin <claude/review head>:refs/heads/dev` (plain push, fast-forward): `git rev-parse origin/dev` 020465a0; claude/review moves on by plan commits only (this tracker)

- Task 1 The precondition: done (6d6647ac)
- Task 2 The changelog pass: done (6d6647ac, no change needed)
- Task 3 The fast-forward of dev: done (020465a0)

## Attention

## Notes
