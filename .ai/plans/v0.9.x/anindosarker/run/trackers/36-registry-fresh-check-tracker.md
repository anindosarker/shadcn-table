# 36: validate-repo fails on a stale generated registry, tracker

Status: running
Branch `v0.9/registry-fresh-check`, worktree 06
Checks:
- Check: generators deterministic, `pnpm -w registry:build && pnpm -w registry:items && pnpm -w registry:hosted` twice at 59a003a9: pass, `git status --short` empty after run 1 and after run 2
- Check: validate-repo, `pnpm test validate-repo` at dd2c0585: pass, summary "bases identical, icon maps complete, tailwind valid, registry valid, registry fresh, 40 unit tests"
- Check: lint, `pnpm test lint` at dd2c0585: pass (9 warnings, all in apps/shadcn-table-docs/examples, pre-existing)

- Task 1 generators deterministic: done (59a003a9, no generator change needed)
- Task 2 check and wiring: done (dd2c0585)

## Notes
- The registry on base 59a003a9 is fresh: the generators leave no diff, so no local regeneration was needed.
- The outputs are derived from modification times of tracked files during the run (written by a generator), then `git diff --name-only` over those; a tracked output already dirty before the run is rewritten and reported the same way. On this tree the generators write two tracked files: `packages/shadcn-table/registry.json` and `apps/shadcn-table-docs/registry.json`; the `examples-<base>-diff.json` lists are hand-kept, no generator writes them.
- The pure part (`written`) is exported but has no node:test file: the unit step globs `tools/**/*.test.mjs` and the spec owns no file there.

## Attention
