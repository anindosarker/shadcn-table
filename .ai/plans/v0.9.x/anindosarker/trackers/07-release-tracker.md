# 07: Release 0.9.0, Integration, tracker

Status: running
Branch `dev`, main checkout
Checks:
- Check: dev equals claude/review, `git rev-parse origin/dev` equals `git rev-parse origin/claude/review` at c4960684: pass
- Check: one Unreleased section, `grep -c '^## Unreleased' CHANGELOG.md` prints 1 at c4960684: pass
- Check: no Breaking or Removed under Unreleased, every Epic 01..03 and Spec 04..06 block under a `###` group, read of `CHANGELOG.md` at c4960684: pass

- Task 1 Changelog pass and fast-forward: done, changelog commit c4960684 on `claude/review`; `dev` fast-forwarded 712f0c36..c4960684 and pushed
- Task 2 The suite on dev: planned

## Attention

- The F3 changelog line sits in its own `#### Fix F3` block under `### Fixed`, following the `#### Fix Fnn` headings of 0.8.0; the E1 and E2 blocks were already grouped and stayed as they were.

## Notes

- `dev` keeps c4960684; this tracker commit lands on `claude/review` only (plan files).
