# 11: icon editions, tracker

Status: running
Branch `v0.7/icon-sets`, worktree icon-sets, PR #[n]
Gates:
- `pnpm --filter shadcn-table tsc:radix`, `tsc:baseui`, `tsc:aria` at M1: green
- `pnpm --filter shadcn-table lint` at M1: green (0 errors; 15 warnings, all unused `no-explicit-any` disables in the foundation's `types.ts`, not spec 11 files)
- `pnpm check:icons` at M1: green (35 keys, 0 problems per base)
- `pnpm check:bases` at M1: green
- `grep -rn "lucide-react" packages/shadcn-table/registry/*/components/ui/shadcn-table` at M1: the three `icons.ts` only
- `grep -rn "no-explicit-any" .../icons.ts` and `grep -rn "edition" .../icons.ts .../icons/` at M1: empty
- docs `eslint examples/*/font-awesome-icons/TS.tsx` at M1: green

- Milestone 01 Maps and imports: done (M1)

## Attention

- `ST_Checkbox.tsx` line 22 is touched besides line 2 (spec 1.6.2 names `ST_Checkbox.tsx:2,22`): the dash renders `ST_Default_Icons.IndeterminateIcon` imported from `@/components/ui/shadcn-table/icons` (D30 "import from `./icons`"), not `table.options.icons`, since the checkbox has no table prop; a consumer `icons.IndeterminateIcon` override does not reach it.
