# 83: Release 0.9.8, Integration 0.9.8, tracker

Status: done (2423d81a)
Branch `claude/review`, worktree 03 (checks only)
Checks:
- Check: Task 1, `git merge-base --is-ancestor origin/master origin/claude/review` at 2423d81a: exit 0; `git merge-base --is-ancestor origin/v0.9/filter-input-fixes origin/claude/review`: exit 1; the trackers `81-date-picker-in-table-build`, `82-date-filters-on-date-picker` and `82-a-popup-pick-of-the-typed-day-filters-at-once` say `Status: done`; `status/sprints.md` rows of 81, 81.1, 82 and its fix read `[x]`; `git log --oneline origin/master..origin/claude/review -- . ':!.ai'` lists 24 commits, all of specs 81, 81.1, 82 and the fix (6dcd219e is the spec 50 commit fd7059b6 reused by spec 82, named in its tracker; 05106d91 is the spec 81 review fix), pass
- Check: Task 2, the changelog pass at 2423d81a: nothing to move, so no commit. `grep -c '^## Unreleased'` prints 1; headings `### Added`, `### Changed`, `### Docs` in that order, each once; 7 `#### ` lines before and after (Spec 81; Spec 81.1, Spec 82; Spec 70, 74, 76, 77). The two `Fixed:` lines stay inside the `#### Spec 82` block as written; the live Docs blocks of specs 70 to 77 stay under `### Docs`, as the 0.9.7 pass kept such blocks, pass
- Check: `pnpm test validate-repo` at 2423d81a in worktree 03 (heavy.sh): exit 0, bases identical, date picker matches, registry fresh, story code complete, 52 unit tests; tree clean after, pass
- Check: `pnpm test lint` at 2423d81a in worktree 03 (heavy.sh): exit 0, 0 errors, 9 warnings, pass
- Check: Task 3, `git push origin "${H}:refs/heads/dev"` with H 2423d81a (plain push, fast-forward 83e13730..2423d81a; dev was an ancestor of H): `git rev-parse origin/dev` 2423d81a, pass

- Task 1 The precondition: done (2423d81a)
- Task 2 The changelog pass: done (2423d81a, no change needed)
- Task 3 The fast-forward of dev: done (2423d81a)

## Notes

- claude/review moves on past 2423d81a by plan commits only (this tracker, the sprint mark).

## Attention
