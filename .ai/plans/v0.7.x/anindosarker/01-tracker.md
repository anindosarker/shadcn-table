# 01: restructure, tracker

Status: running
Branch `v0.7/restructure`, worktree restructure, PR #67
Gates:
- `pnpm --filter shadcn-table tsc:radix` at 6f98f13f: green
- `pnpm --filter shadcn-table tsc:baseui` at 6f98f13f: green
- `pnpm --filter shadcn-table tsc:aria` at 6f98f13f: green
- `pnpm --filter shadcn-table lint` at 6f98f13f: green
- `pnpm check:bases` at 6f98f13f: green
- `pnpm registry:build` at 71c58fe1: green (registry.json diff only the moved path and target pairs, 12 removed, 12 added)
- `pnpm registry:hosted` at 71c58fe1: green (diff -r against the pre-move output lists only shadcn-table.json and registry.json per base, equal after mapping the moved paths back)
- `pnpm --filter shadcn-table-docs types:check` at 71c58fe1: green
- `pnpm --filter shadcn-table-docs lint` at 71c58fe1: green (9 warnings, all pre-existing in untouched examples)
- `pnpm --filter shadcn-table-docs build` at 71c58fe1: green
- `pnpm test:base` at 71c58fe1: green
- `pnpm test:radix` at 71c58fe1: green
- `pnpm test:aria` at 71c58fe1: green
- `pnpm --filter shadcn-table tsc:radix`, `tsc:baseui`, `tsc:aria`, `lint`, `pnpm check:bases` at d8f1c516: green
- `pnpm test:base`, `test:radix`, `test:aria` at d8f1c516: green
- `pnpm --filter shadcn-table-docs types:check`, `lint` at d8f1c516: green
- CI run 41168309522: [pending]

- Phase 01 library moves: done (6f98f13f)
- Phase 02 registry and docs copies: done (71c58fe1)
- Final phase cleanup: done (d8f1c516)
