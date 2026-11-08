# 07: Release 0.9.0, Integration, tracker

Status: running
Branch `dev`, main checkout (Task 1); worktree 03 at origin/dev (Task 2)
Checks:
- Check: dev equals claude/review, `git rev-parse origin/dev` equals `git rev-parse origin/claude/review` at c4960684: pass
- Check: one Unreleased section, `grep -c '^## Unreleased' CHANGELOG.md` prints 1 at c4960684: pass
- Check: no Breaking or Removed under Unreleased, every Epic 01..03 and Spec 04..06 block under a `###` group, read of `CHANGELOG.md` at c4960684: pass
- Check: typecheck (base, radix, aria), `pnpm test typecheck --base <b>` at df90bd27: pass
- Check: storybook-tests (base, radix, aria), `pnpm test storybook-tests --base <b>` at df90bd27: pass
- Check: docs-e2e (base, radix, aria), `pnpm test docs-e2e --base <b>` at df90bd27: pass
- Check: lint, `pnpm test lint` at df90bd27: pass
- Check: validate-repo, `pnpm test validate-repo` at df90bd27: pass
- Check: installation-e2e (fresh, existing, base, aria), `pnpm test installation-e2e` at df90bd27: pass
- Check: installation-e2e (nextjs-base, nextjs-radix, nextjs-aria), `pnpm test installation-e2e` at df90bd27: build and browser phases pass, diff fail (F20, F21; the diff is CI's)
- Check: storybook-static (base, radix, aria), `pnpm test storybook-static --base <b>` at df90bd27: pass

- Task 1 Changelog pass and fast-forward: done, changelog commit c4960684 on `claude/review`; `dev` fast-forwarded 712f0c36..c4960684 and pushed; fast-forwarded again c4960684..df90bd27 after the F11 fix (2026-11-08 09:55)
- Task 2 The suite on dev: green at df90bd27 except installation-e2e (F20, fixed by `refresh-installation-references`, merged into `dev` as 0adce149 per D30); installation-e2e rerun on `dev` at 0adce149 with `--no-diff` (F21): running

## Attention

- The F3 changelog line sits in its own `#### Fix F3` block under `### Fixed`, following the `#### Fix Fnn` headings of 0.8.0; the E1 and E2 blocks were already grouped and stayed as they were.

## Notes

- `dev` keeps c4960684; this tracker commit lands on `claude/review` only (plan files).
- The suite ran as one serial shell loop from the runner session (logs in its scratchpad), not inside a workflow agent: an agent that waits on a background task is forced to its final answer.
- `dev` at df90bd27 holds E1, E2, F3 and F11; the E4 merges on `claude/review` are not on it (A12).
