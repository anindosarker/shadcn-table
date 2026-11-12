# 36: validate-repo fails on a stale generated registry, tracker

Status: done
Branch `v0.9/registry-fresh-check`, worktree 06
Checks:
- Check: generators deterministic, `pnpm -w registry:build && pnpm -w registry:items && pnpm -w registry:hosted` twice at 59a003a9: pass, `git status --short` empty after run 1 and after run 2
- Check: validate-repo, `pnpm test validate-repo` at dd2c0585: pass, summary "bases identical, icon maps complete, tailwind valid, registry valid, registry fresh, 40 unit tests"
- Check: lint, `pnpm test lint` at dd2c0585: pass (9 warnings, all in apps/shadcn-table-docs/examples, pre-existing)
- Check: acceptance pass 1, `pnpm test validate-repo` at fbebe20a: pass, summary contains "registry fresh"; run again: pass, `git status --short` empty
- Check: acceptance failing case, "The default" changed to "The plain" in the `description` of `apps/shadcn-table-docs/content/docs/examples/basic.mdx`, `pnpm test validate-repo` at fbebe20a: fail (exit 1) as expected, error line `registry-fresh: apps/shadcn-table-docs/registry.json is stale: run pnpm -w registry:build && pnpm -w registry:items and commit the result`
- Check: acceptance restore, `git checkout -- apps/shadcn-table-docs` then `pnpm test validate-repo` at fbebe20a: pass, `git status --short` empty
- Check: act, `act pull_request -W .github/workflows/pr.yml -j validate-repo -P ubuntu-latest=catthehacker/ubuntu:act-latest --pull=false` at fbebe20a (run from a scratch clone of the branch): pass, job summary contains "registry fresh"
- Check: local CI, `pnpm test typecheck --base base` at bb9018a4: pass (tsc clean)
- Check: local CI, `pnpm test lint` at bb9018a4: pass (9 pre-existing warnings)
- Check: local CI, `pnpm test validate-repo` at bb9018a4: pass, "bases identical, icon maps complete, tailwind valid, registry valid, registry fresh, 40 unit tests"
- Check: `pnpm format` at bb9018a4: no change beyond the changelog block

- Task 1 generators deterministic: done (59a003a9, no generator change needed)
- Task 2 check and wiring: done (dd2c0585)

- Task 3 acceptance: done (fbebe20a, no code change)
- Task 4 cleanup and changelog: done (bb9018a4)

## Notes
- The registry on base 59a003a9 is fresh: the generators leave no diff, so no local regeneration was needed.
- The outputs are derived from modification times of tracked files during the run (written by a generator), then `git diff --name-only` over those; a tracked output already dirty before the run is rewritten and reported the same way. On this tree the generators write two tracked files: `packages/shadcn-table/registry.json` and `apps/shadcn-table-docs/registry.json`; the `examples-<base>-diff.json` lists are hand-kept, no generator writes them.
- The pure part (`written`) is exported but has no node:test file: the unit step globs `tools/**/*.test.mjs` and the spec owns no file there.

- act from the worktree itself fails the new step with `git ls-files: exit 128 fatal: not a git repository`: a pool worktree's `.git` is a file pointing to the host path, so act's copied tree has no repository; GitHub's actions/checkout gives a real one, so the act proof ran from a scratch clone of the branch.
- act's default image `node:16-buster-slim` fails `pnpm/action-setup@v6`; the run used `-P ubuntu-latest=catthehacker/ubuntu:act-latest`.
- The Linux generators under act wrote the same bytes as macOS: no diff.

## Attention
