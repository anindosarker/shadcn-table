# Docs build memory (Q76), tracker

Status: running
Files owned: `apps/shadcn-table-docs/package.json`, `apps/shadcn-table-docs/tsconfig.build.json`, `apps/shadcn-table-docs/tsconfig.preview.json`, `apps/shadcn-table-docs/tsconfig.ui-base.json`, `apps/shadcn-table-docs/tsconfig.ui-aria.json`, `.gitignore`, `CHANGELOG.md` (Fix Q76 block)
Depends on: none
Branch `v0.9/fix-docs-build-memory`, worktree `shadcn-react-table.worktrees/06`
Checks:
- Check: types:check, `pnpm --filter shadcn-table-docs types:check` (NODE_OPTIONS unset, fresh tsbuildinfo) at 13eef88a: pass, peak RSS 2.22 GB
- Check: build, `NEXT_PUBLIC_SITE_URL=http://localhost:5352 pnpm --filter shadcn-table-docs build` (NODE_OPTIONS unset) at 13eef88a: pass, peak RSS 2.30 GB, TypeScript step 13.3 s
- Check: deliberate error, `export const __q76: number = 'x'` in `components/base-selector.tsx`, `examples/radix/basic/TS.tsx`, `examples/base/basic/TS.tsx`, `examples/aria/basic/TS.tsx` at 13eef88a: types:check fails on each (TS2322 in the build, ui-base and ui-aria programs), reverted
- Check: coverage, non-node_modules files of the old program vs the union of the three new programs at 13eef88a: identical, 1433 files
- Check: typecheck, `pnpm test typecheck --base base` at 13eef88a: pass
- Check: typecheck, `pnpm test typecheck --base radix` at 13eef88a: pass
- Check: typecheck, `pnpm test typecheck --base aria` at 13eef88a: pass
- Check: lint, `pnpm test lint` at 13eef88a: pass (9 warnings, all in example files, none from this change)
- Check: validate-repo, `pnpm test validate-repo` at 13eef88a: pass
- Check (verifier): types:check, `/usr/bin/time -l pnpm --filter shadcn-table-docs types:check` (NODE_OPTIONS unset, tsbuildinfo deleted) at a6a2d2df: pass, peak RSS 1.91 GB, 34.1 s
- Check (verifier): deliberate error, `export const __q76v: number = 'x'` in `examples/aria/aggregation-and-grouping/TS.tsx` and in `components/callout.tsx` at a6a2d2df: types:check fails on each (TS2322, ui-aria and build programs), reverted, `git status --short` empty
- Check (verifier): coverage, `tsc --listFilesOnly` non-node_modules files of the merge-base `tsconfig.build.json` vs the union of build, ui-base and ui-aria at a6a2d2df: identical, 1433 files
- Check (verifier): diff since merge-base: no `ignoreBuildErrors`, no `max-old-space-size`; the only excludes added are the base and aria copies, checked in their own programs; the builder's build, typecheck, lint and validate-repo lines at 13eef88a stay valid (later diff touches only .ai/ and CHANGELOG.md)

- Task 1 measure and find the cause: done (13eef88a)
- Task 2 fix at the source: done (13eef88a)
- Task 3 prove it: done (13eef88a)
- Task 4 format and changelog: done

Cause: the docs type check holds the radix, base and aria library copies in one program, and each copy declares the same `@tanstack/react-table` feature maps (`declare module`, 13 feature files), so the merged maps carry the first copy's types and every other copy's code is compared structurally with them (ST_Column, ST_ColumnDef, ST_Cell, ST_CoreTableInstance base to radix in the trace); the copies alone are 2.7M instantiations each, radix with base together 8.9M, all three 14.8M, the full program 21.7M.

Before (unchanged code, 6844 files, 21.7M instantiations, 1.38M types):
- Node default old-space limit on this machine (24 GB, Node 24.15.0): 4288 MB; CI's is not in the workflow files or logs.
- tsc `Memory used` 4.30 to 4.44 GB, peak RSS 4.48 to 4.56 GB; passes at `--max-old-space-size=4096`, fails at 3968: under 5 percent headroom, so a run fails or passes by GC timing.
- Same size at v0.9.0 (21.6M instantiations, 4.27 GB): no single commit after 0.9.0 pushed it over; the three-copy program sat at the limit already.
- Not the cause: generated JSON (87 lines of JSON in the program), `.next` types, a duplicated dependency (only cmdk's older radix-ui pieces), phosphor-icons (3031 declaration files, parsed once).

After (13eef88a), three programs run one after another:
- `tsconfig.build.json` (app, radix copy, radix examples, the 23 base and aria files `components/example-icons.tsx` imports): 6098 files, 5.66M instantiations, 1.93 GB heap.
- `tsconfig.ui-base.json`: 4855 files, 4.44M instantiations, 1.42 GB heap.
- `tsconfig.ui-aria.json`: 4659 files, 4.32M instantiations, 1.37 GB heap.
- No heap setting in any script: the size is not inherent.

## Attention

- `next build` now runs `types:bases` (the base and aria programs, about 20 s) before `next build`, because Next's own type check reads only `tsconfig.build.json`; this keeps the build checking every file it checked before.
