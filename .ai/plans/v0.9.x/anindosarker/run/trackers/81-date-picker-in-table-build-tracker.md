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
- Check: scratch proof at 2552a233, per base (script: fixture line `export { DatePicker as ST_DatePickerFixture } from '@/components/date-picker/date-picker';` appended to `registry/<base>/components/ui/shadcn-table/index.ts`; `pnpm -w registry:build`; `pnpm --filter shadcn-table-docs lib:install <base>`; `pnpm --filter shadcn-table-docs types:check`; then `git checkout --` of the touched tracked files and `git clean -fd -- apps/shadcn-table-docs/components/ui-<base>`):
  - base: core item carried `anindosarker/shadcn-date-picker/date-picker-base#v0.1.0`; `components/ui-base/date-picker/date-picker.tsx` existed, hook at `components/ui-base/hooks/use-mobile.ts`, imports `@/components/ui-base/...`; `types:check` exit 0; after the discard `git status --short` empty: pass
  - radix: `components/ui-radix/date-picker/date-picker.tsx` existed; `types:check` exit 0; after the discard `git status --short` empty: pass
  - aria: `components/ui-aria/date-picker/date-picker.tsx` existed; `types:check` exit 0; after the discard `git status --short` empty: pass
- Check: scratch proof, base, at b6312d3d: fail (one CLI run for library and picker: the CLI resolved the library's `.../shadcn-table/types` imports to the picker's `types.ts`; then with the `components` alias moved for both runs, imports became `@/components/ui-base/ui-base/...`); fixed in 2552a233 (picker in a run of its own, the moved aliases for that run only)
- Check: `pnpm -w registry:build`, then plain `pnpm --filter shadcn-table-docs lib:install base`, `radix`, `aria` at 2552a233: pass (no `date-picker/` or `hooks/` below any `components/ui-<base>/`, `git status --short` empty)
- Check: `pnpm --filter shadcn-table-docs types:check` after the plain installs at 2552a233: pass (exit 0, `git status --short` empty)
- Check: `pnpm test validate-repo` at 6a5b3db0: pass (bases identical, date picker matches, icon maps complete, tailwind valid, registry valid, registry fresh, story pages match, story code complete, 52 unit tests)
- Check: one byte changed in `packages/shadcn-table/registry/radix/components/date-picker/utils/time.ts` (first `export` to `Export`), `pnpm test validate-repo` at 6a5b3db0: fails as intended, `date-picker: registry/radix: differs: packages/shadcn-table/registry/radix/components/date-picker/utils/time.ts`; byte restored with `git checkout --`, `git status --short` empty
- Check: `pnpm test installation-e2e --no-diff` at 6a5b3db0: pass (7 passed, 0 failed; agent ports 5340 to 5349, all stopped by the runner)
- Check: Local CI `pnpm test typecheck --base base`, `--base radix`, `--base aria` at 06da91e0: pass (tsc clean each)
- Check: Local CI `pnpm test lint` at 06da91e0: pass (0 errors; 9 docs warnings)
- Check: Local CI `pnpm test validate-repo` and `pnpm test installation-e2e --no-diff`: pass at 6a5b3db0; 06da91e0 adds only `CHANGELOG.md`, which neither test reads

- Task 1 site map: done (a9378baf)
- Task 2 packages, parts, tool, trees: done (20cd9241, 591d6d57)
- Task 3 registry build mapping and test: done (d1d313ed)
- Task 4 docs install and scratch proof: done (b6312d3d, 2552a233)
- Task 5 repo check and CONTRIBUTING section: done (6a5b3db0); CHANGELOG `#### Spec 81` (06da91e0)

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
- The date-picker check is registered in `test/validate-repo/test.mjs` (where the step list lives); `test/validate-repo/run.mjs` needed no change, its paths already cover `tools/**` and `packages/shadcn-table/registry/**`. It is skipped with a printed line when GitHub cannot be reached locally and fails under `--ci`.
- The registry scripts test is the new `tools/registry/lib.test.mjs`, run by validate-repo's unit check (`tools/**/*.test.mjs`); the fixture is written to a temporary folder.
- `apps/shadcn-table-docs/package.json` gained `date-fns` and `react-day-picker` (the picker's ranges): `lib:install` restores the docs package.json and lockfile after the CLI run (its header: every package the item needs is already a dependency here), so the docs copy of the picker type-checks only with them declared. This milestone owns the lockfile for the epic, so spec 82 needs no install. `cn` was there already (`^0.4.0`).
- `lib:install` adds the picker in a second CLI run: in one run the CLI resolves imports by file name among the files it writes, and the picker's `types.ts` captured the library's `shadcn-table/types` imports. The scratch proof read the built items in `packages/shadcn-table/public/r/`, which is what `lib:install` reads; the dev registry on 5310 was not needed.
- `packages/shadcn-table/tsconfig.radix.json` (base and aria extend it) gained `node` in `types`: `components/date-picker/utils/values.ts:98` reads `process.env.NODE_ENV`, as the picker repo's own tsconfigs allow. Owned here as the fix of the typecheck the spec runs.

## Attention
