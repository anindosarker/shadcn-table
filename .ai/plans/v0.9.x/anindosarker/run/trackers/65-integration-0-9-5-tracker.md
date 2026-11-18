# 65: Release 0.9.5, Integration 0.9.5, tracker

Status: running
Branch `claude/review`, worktree 08
Checks:
- Check: precondition, `git show origin/claude/review:.ai/plans/v0.9.x/anindosarker/status/sprints.md` open E14 to E16 rows at cf759857: none, pass
- Check: precondition, `git merge-base --is-ancestor origin/master origin/claude/review` at cf759857: exit 0, pass
- Check: precondition, `git log --oneline origin/v0.9/docs-layout..origin/claude/review -- . ':!.ai'` at cf759857: empty, pass
- Check: merge proof, `git diff origin/v0.9/docs-layout HEAD -- . ':!.ai'` at 7f891d1f: empty, pass
- Check: Task 1, `git merge-base --is-ancestor origin/v0.9/docs-layout origin/claude/review` at 7f891d1f: exit 0, pass
- Check: Task 1, `git diff origin/v0.9/docs-layout origin/claude/review -- . ':!.ai'` at 7f891d1f: empty, pass
- Check: Task 1, `git merge-base --is-ancestor origin/v0.9/filter-input-fixes origin/claude/review` at 7f891d1f: exit 1, pass
- Check: Task 1, `git log -1 --format=%s 7f891d1f` at 7f891d1f: `merge: v0.9/docs-layout (65)`, pass
- Check: Task 2, `grep -c '^## Unreleased' CHANGELOG.md` at 904c9998: 1, pass
- Check: Task 2, Unreleased `### ` headings at 904c9998: Added, Changed, Fixed, Docs, each once in order, pass
- Check: Task 2, `#### ` lines in Unreleased at 904c9998: 35 before, 35 after, pass
- Check: Task 2, `grep -c 'v0.9/docs-layout' .ai/plans/v0.9.x/anindosarker/process.md` at 904c9998: 0, pass
- Check: Task 2, installed packages against `pnpm-lock.yaml` at 904c9998: match, no install, pass
- Check: Task 2, `pnpm test validate-repo` at 904c9998: green, pass
- Check: Task 2, `pnpm test lint` at 904c9998: 0 errors, 9 warnings, pass
- Check: Task 3, `git rev-parse origin/dev` equals `git rev-parse origin/claude/review` at 904c9998: equal, pass

- Task 1 The one merge of v0.9/docs-layout into claude/review: done, 7f891d1f, no conflict
- Task 2 Changelog pass and process.md P1: done, 904c9998
- Task 3 Fast-forward of dev: done, dev 7b379866..904c9998

## Attention

## Notes
