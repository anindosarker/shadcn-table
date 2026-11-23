# 81: Date picker in the table's build, tracker

Status: running
Branch `v0.9/date-picker-in-table-build`, worktree 03
Checks:

- Check: site map table in the tracker, each `passes through` line names its line: pass
- Check: `pnpm add-date-picker base --check`, `radix --check`, `aria --check` at 20cd9241: pass (exit 0, 23 files each)
- Check: `find packages/shadcn-table/registry/<base>/components/date-picker -type f | wc -l` at 20cd9241: pass (22 on base, radix, aria)
- Check: `pnpm test typecheck --base base` at 20cd9241: fail (`utils/values.ts(98,7)` TS2591 `process`); fixed in 591d6d57
- Check: `pnpm test typecheck --base base`, `--base radix`, `--base aria` at 591d6d57: pass (tsc clean each)
- Check: `pnpm test lint` at 591d6d57: pass (0 errors; 9 docs warnings)
- Check: `git diff --stat origin/claude/review -- 'packages/shadcn-table/registry/*/components/ui/shadcn-table'` at 591d6d57: pass (empty)
- Check: `node --test tools/registry/lib.test.mjs` at d1d313ed: pass (9 tests: the fixture gives `anindosarker/shadcn-date-picker/date-picker-<base>#v0.1.0` on base, radix, aria, plain and `--dev`; no import, no address)
- Check: `pnpm -w registry:build` then `git diff --stat -- packages/shadcn-table/registry.json registry.json` at d1d313ed: pass (empty)
- Check: `grep -c "v0.1.0" tools/registry/*.mjs` at d1d313ed: pass (1, `lib.mjs`, the constant; 0 in every other file)

- Task 1 site map: done (a9378baf)
- Task 2 packages, parts, tool, trees: done (20cd9241, 591d6d57)
- Task 3 registry build mapping and test: done (d1d313ed)

## Site map

Every place that reads imports, aliases or dependencies for an item, a tree or the docs copy, at `origin/claude/review` (76b1df28).

| Site | Reads | Verdict |
|---|---|---|
| `tools/registry/lib.mjs:109-120` `uiImports` | `@/components/ui/<x>` imports of the library files | changes: also maps `@/components/date-picker/` to the picker address |
| `tools/registry/lib.mjs:188-190` core `registryDependencies` | the scan above over the core files | changes: takes the base to build the picker address |
| `tools/registry/lib.mjs:46-49` `itemAddress` | table item names | passes through: the picker address is built by its own function, line 49 is only for `anindosarker/shadcn-table` items |
| `tools/registry/lib.mjs:155-159` `fileEntry` | files below `components/ui` | passes through: `walk(libDir)` at line 162 lists `components/ui/shadcn-table` only, so the picker and hook folders are no item file |
| `tools/registry/build.mjs:83` | the items `registry.ts` returns | passes through: items are written as built, no dependency rewrite |
| `tools/registry/hosted.mjs:77-82` `onHostedCore` | `registryDependencies` of the hosted items | passes through: line 80 rewrites only a dependency ending in `/<core name>`; `.../date-picker-<base>#v0.1.0` does not |
| `tools/registry/examples.mjs:157-167` | example imports | passes through: examples do not import the picker; their core dependency (line 191) brings it |
| `tools/registry/add-part.mjs:51-53, 156-176` | the base's `components.json` aliases, part files | passes through: parts only, `registry:ui` files of one part item |
| `apps/shadcn-table-docs/lib/install.mjs:156-160` | `@/components/ui/` in the library copy | changes: also `@/components/date-picker/` and `@/hooks/` |
| `apps/shadcn-table-docs/lib/install.mjs:173-176` | the temporary `components.json` aliases | changes: `components` and `hooks` aliases so the picker lands below `components/ui-<base>/` |
| `apps/shadcn-table-docs/lib/install.mjs:207-236` `pruneLibrary` | the library copy folder | changes: also clears the picker folder |
| `apps/shadcn-table-docs/lib/install.mjs:270-276` `installHookedParts` | top-level `*.tsx` of `components/ui-<base>/` | passes through: line 275 filters `readdirSync(uiDir)` to top-level `.tsx`, the picker sits in `date-picker/` |
| `test/validate-repo/lib/bases-identical.mjs:24, 30-35` | `components/ui/shadcn-table` per base | passes through: the picker folder is outside the compared tree |
| `test/validate-repo/lib/icon-maps.mjs:16, 39` | `components/ui/shadcn-table` | passes through |
| `test/validate-repo/lib/tailwind-classes.mjs:26, 85` | `components/ui/shadcn-table` | passes through |
| `test/validate-repo/lib/registry-valid.mjs:9-13` | `shadcn registry validate` on `registry.json` | passes through: no catalog change in this spec |
| `test/validate-repo/lib/registry-fresh.mjs:14` | the three generators | passes through |
| `test/installation-e2e/test.mjs:247` | `shadcn add <dev registry>/<item>.json` | passes through: the CLI resolves a GitHub address dependency of the core item itself |

## Notes

- Q160: `packages/shadcn-table/registry/base/components/ui/calendar.tsx` as add-part wrote it has no ref line on the day button: `CalendarDayButton` creates `ref` and its focus effect at lines 199-202, but the `<Button>` at line 205 has no `ref={ref}`; the radix part has it at `registry/radix/components/ui/calendar.tsx:206`. Nothing changed for it.
- The picker files import `cn` from the npm package `cn` (5 files, e.g. `components/date-picker/components/day-calendar.tsx:12`), so `cn` (`^0.5.0`, the picker's package.json range) joined `packages/shadcn-table/package.json` beside `react-day-picker` and `date-fns`; without it the trees do not type-check. The picker item carries it for users.
- The registry scripts test is the new `tools/registry/lib.test.mjs`, run by validate-repo's unit check (`tools/**/*.test.mjs`); the fixture is written to a temporary folder.
- `packages/shadcn-table/tsconfig.radix.json` (base and aria extend it) gained `node` in `types`: `components/date-picker/utils/values.ts:98` reads `process.env.NODE_ENV`, as the picker repo's own tsconfigs allow. Owned here as the fix of the typecheck the spec runs.

## Attention
