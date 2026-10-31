# 11: icon editions, tracker

Status: running
Branch `v0.7/icon-sets`, worktree icon-sets, PR #73
Gates:
- `pnpm --filter shadcn-table tsc:radix`, `tsc:baseui`, `tsc:aria` at 97072f29: green
- `pnpm --filter shadcn-table lint` at 97072f29: green (0 errors; 15 warnings, all unused `no-explicit-any` disables in the foundation's `types.ts`, not spec 11 files)
- `pnpm check:icons` at 97072f29: green (35 keys, 0 problems per base)
- `pnpm check:bases` at 97072f29: green
- `grep -rn "lucide-react" packages/shadcn-table/registry/*/components/ui/shadcn-table` at 97072f29: the three `icons.ts` only
- `grep -rn "no-explicit-any" .../icons.ts` and `grep -rn "edition" .../icons.ts .../icons/` at 97072f29: empty
- docs `eslint examples/*/font-awesome-icons/TS.tsx` at 97072f29: green
- `pnpm registry:build`, `registry:items`, `registry:hosted`, `registry:dev` at 20bd77f2: green; per base core (106 files), `shadcn-table-<base>` (icons.ts, lucide-react), 4 icon set items (target `@ui/shadcn-table/icons.ts`), 38 locales on core; hosted `/r/<base>/` 159 items; `.dev` 460 example items with core at `http://localhost:5310/r/shadcn-table-<base>-core.json`
- registry.json diffs at 20bd77f2: additions plus the core re-point only (removed lines are the old main-item dependencies and JSON commas)
- `pnpm check:bases`, `pnpm --filter shadcn-table lint` at 20bd77f2: green
- six `shadcn add http://localhost:5310/r/<item>.json --dry-run` (shadcn-table-radix, shadcn-table, shadcn-table-base-tabler, example-basic-radix, -base, -aria) from the docs app at 20bd77f2: all exit 0, one `icons.ts` per add

- Milestone 01 Maps and imports: done (97072f29)
- Milestone 02 Registry build: done (20bd77f2)

## Attention

- Example items now list `lucide-react` in `dependencies` when an example imports it (17 per base): core no longer installs it, so an icon set project would miss it.

- `ST_Checkbox.tsx` line 22 is touched besides line 2 (spec 1.6.2 names `ST_Checkbox.tsx:2,22`): the dash renders `ST_Default_Icons.IndeterminateIcon` imported from `@/components/ui/shadcn-table/icons` (D30 "import from `./icons`"), not `table.options.icons`, since the checkbox has no table prop; a consumer `icons.IndeterminateIcon` override does not reach it.
