# 07: Release 0.9.0, Integration, tracker

Status: running
Branch `dev`, main checkout (Task 1); worktree 03 at origin/dev (Task 2)
Checks:
- Check: dev equals claude/review, `git rev-parse origin/dev` equals `git rev-parse origin/claude/review` at c4960684: pass
- Check: one Unreleased section, `grep -c '^## Unreleased' CHANGELOG.md` prints 1 at c4960684: pass
- Check: no Breaking or Removed under Unreleased, every Epic 01..03 and Spec 04..06 block under a `###` group, read of `CHANGELOG.md` at c4960684: pass

- Task 1 Changelog pass and fast-forward: done, changelog commit c4960684 on `claude/review`; `dev` fast-forwarded 712f0c36..c4960684 and pushed; fast-forwarded again c4960684..df90bd27 after the F11 fix (2026-11-08 09:55)
- Task 2 The suite on dev: running (worktree 03 at df90bd27)

## Attention

- The F3 changelog line sits in its own `#### Fix F3` block under `### Fixed`, following the `#### Fix Fnn` headings of 0.8.0; the E1 and E2 blocks were already grouped and stayed as they were.

## Notes

- `dev` keeps c4960684; this tracker commit lands on `claude/review` only (plan files).
