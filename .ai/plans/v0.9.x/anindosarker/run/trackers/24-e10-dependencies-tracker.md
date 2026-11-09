# 24: E10 dependencies, tracker

Status: done
Branch `v0.9/e10-dependencies`, worktree 03
Checks:
- `pnpm ls --filter shadcn-table-docs zod schema-dts @next/bundle-analyzer` at d73330b5: pass (zod 4.6.7, schema-dts 1.1.5, @next/bundle-analyzer 16.3.8)
- `git status --short` after `pnpm install` at d73330b5: pass (only `apps/shadcn-table-docs/package.json`, `pnpm-lock.yaml`)
- `pnpm --filter shadcn-table-docs types:check` at d73330b5: pass
- `pnpm test typecheck --base base` at d73330b5: pass
- `pnpm test lint` at d73330b5: pass
- `pnpm test validate-repo` at d73330b5: pass

- Task 1 Add the three packages: done (d73330b5)

Notes:
- The lockfile diff also re-resolves the optional `@emnapi/core`/`@emnapi/runtime` peer suffix on the rolldown-vite entries from 1.9.2 to 1.11.0 (pnpm's own resolution in the one `pnpm install`; no package.json change).
- The analyzer reports check of 2.2 (`ANALYZE=1` build) needs the `next.config.mjs` wrap of the Canonical milestone; it is proven there.
