# 65: Release 0.9.5, Integration 0.9.5, tracker

Status: done (7f891d1f)
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
- Check: verify Task 1, `git merge-base --is-ancestor origin/v0.9/docs-layout origin/claude/review` at 323f183a: exit 0, pass
- Check: verify Task 1, `git diff origin/v0.9/docs-layout origin/claude/review -- . ':!.ai' ':!CHANGELOG.md'` at 323f183a: empty, pass
- Check: verify Task 1, `git merge-base --is-ancestor origin/v0.9/filter-input-fixes origin/claude/review` at 323f183a: exit 1, pass
- Check: verify Task 1, `git log -1 --format='%s|%P' 7f891d1f` at 7f891d1f: `merge: v0.9/docs-layout (65)`, parents cf759857 and 8cd198f4, pass
- Check: verify Task 2, `grep -c '^## Unreleased' CHANGELOG.md` at 323f183a: 1, pass
- Check: verify Task 2, Unreleased `### ` headings at 323f183a: Added, Changed, Fixed, Docs, each once in order, pass
- Check: verify Task 2, `#### ` lines in Unreleased, origin/v0.9/docs-layout against 323f183a: 35 and 35, pass
- Check: verify Task 2, non-empty Unreleased lines old against new at 323f183a: none lost except the duplicate `### Changed` heading and the Spec 53 Section tab hover line, pass
- Check: verify Task 2, `git diff 7f891d1f 904c9998 -- process.md` at 904c9998: only the P1 `v0.9/docs-layout` bullet removed; `grep -c 'v0.9/docs-layout'` 0, pass
- Check: verify Task 2, CHANGELOG.md from `## 0.9.4` down, 323f183a against origin/master 7b379866: byte-identical (cmp), pass
- Check: verify plan files, `git diff 7f891d1f^1 7f891d1f -- decisions.md queue.md status run/trackers` at 7f891d1f: empty, pass
- Check: verify Task 3, `git rev-parse origin/dev` and `origin/claude/review` at 323f183a: equal, pass
- Check: verify Task 3, `git merge-base --is-ancestor origin/master` origin/dev and origin/claude/review at 7b379866: exit 0 both, pass
- Check: verify version, `packages/shadcn-table/package.json` at 323f183a: 0.9.4; root package.json has no version field (none on master either), pass
- Check: verify local CI, `git diff --name-only 904c9998 origin/claude/review -- . ':!.ai'` at 323f183a: empty, recorded validate-repo and lint stand, pass

- Task 1 The one merge of v0.9/docs-layout into claude/review: done, 7f891d1f, no conflict
- Task 2 Changelog pass and process.md P1: done, 904c9998
- Task 3 Fast-forward of dev: done, dev 7b379866..904c9998

## Attention

## Notes
