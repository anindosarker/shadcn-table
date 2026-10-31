# 11: icon editions, tracker

Status: done
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
- docs `lib:install base`, `radix`, `aria` (one after another) at 26f40dd3: green, 145 table files per copy, `icons.ts` Lucide, no `icons/`
- `pnpm --filter shadcn-table-docs types:check`, `lint`, `build` at 26f40dd3: green (lint 0 errors, 9 warnings in other examples)
- CLI smoke per base (scratch `shadcn init --template next --base <b> --preset nova`, dev registry 5310) at 20bd77f2 build: Tabler item adds 107 files (106 core plus one `icons.ts` from `@tabler/icons-react`, no `icons/`), package gains `@tabler/icons-react` only (`lucide-react` came from init); Lucide item `--overwrite`, stdin closed: exit 0, `icons.ts` imports `lucide-react`, file count unchanged; locale `de`: exit 0, one file, `package.json` unchanged; `example-basic-<b>`: exit 0, core from 5310; scratch `tsc --noEmit` 0 errors. Green for base, radix, aria
- CLI smoke, fresh base project, `shadcn-table` only at 20bd77f2 build: exit 0, one `icons.ts` on `lucide-react`, no `@tabler/icons-react`
- `pnpm --filter shadcn-table tsc:radix`, `tsc:baseui`, `tsc:aria`, `lint`, `check:icons`, `test:base` (446 passed), `storybook:build:base` at b50b56b6: green
- `node scripts/check-pages.mjs --url http://localhost:5342 --base base` (docs dev on 5342) at b50b56b6: green, 1654 passed, 0 failed
- CI run 41188659456 at b50b56b6: `registry` and the five `install` jobs green, `docs`, `test` x3, `bases` green; `library` x3 red on the foundation's `check:tailwind` step only (S1 scope, red by design until S1 merges; spec 11 files add no class)
- six `shadcn add http://localhost:5310/r/<item>.json --dry-run` (shadcn-table-radix, shadcn-table, shadcn-table-base-tabler, example-basic-radix, -base, -aria) from the docs app at 20bd77f2: all exit 0, one `icons.ts` per add

- Milestone 01 Maps and imports: done (97072f29)
- Milestone 02 Registry build: done (20bd77f2)
- Milestone 03 Installs, CLI smoke: done (c1aa55e4, run 41188659456)
- Final milestone Gates once: done (b50b56b6)

## Attention

- Acceptance clause "the Tabler-then-Lucide `--overwrite` smoke leaves ... no `@tabler/icons-react` in the scratch `package.json`" contradicts D30 ("the previous icon package stays in `package.json`"): the shadcn CLI never removes a dependency, so `@tabler/icons-react` stays after the switch. The rest of the clause holds (one `icons.ts`, on `lucide-react`); a fresh project adding `shadcn-table` gets no `@tabler/icons-react`. Owner: reword the Acceptance clause, or decide on a removal step in the Icons guide (spec 08).
- Example items now list `lucide-react` in `dependencies` when an example imports it (17 per base): core no longer installs it, so an icon set project would miss it.

- `ST_Checkbox.tsx` line 22 is touched besides line 2 (spec 1.6.2 names `ST_Checkbox.tsx:2,22`): the dash renders `ST_Default_Icons.IndeterminateIcon` imported from `@/components/ui/shadcn-table/icons` (D30 "import from `./icons`"), not `table.options.icons`, since the checkbox has no table prop; a consumer `icons.IndeterminateIcon` override does not reach it.
