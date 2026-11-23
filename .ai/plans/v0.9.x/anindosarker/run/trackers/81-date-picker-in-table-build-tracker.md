# 81: Date picker in the table's build, tracker

Status: done
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
- Check: review round 1 fixes (working tree on fecd5c2e, committed below): `pnpm add-date-picker base`, `radix`, `aria` rewrote the trees (only change: `"use client"` added to the 8 files per base that had lost it); then `--check` on the three bases: pass (23 files each)
- Check: review round 1, `pnpm test typecheck --base base`, `--base radix`, `--base aria`: pass (tsc clean each)
- Check: review round 1, `pnpm test lint`: pass (0 errors; 9 docs warnings)
- Check: review round 1, `node --test tools/registry/lib.test.mjs`: pass (9 of 9)
- Check: review round 1, `pnpm test validate-repo`: pass (bases identical, date picker matches, icon maps complete, tailwind valid, registry valid, registry fresh, story pages match, story code complete, 52 unit tests)
- Check: review round 1, plain `pnpm --filter shadcn-table-docs lib:install base`: pass (no picker folder, `git status` clean below `components/ui-base`)
- Check: review round 1, scratch proof base without `rewritePicker` (fixture line in `registry/base/components/ui/shadcn-table/index.ts`, `pnpm -w registry:build`, `lib:install base`, `types:check`): pass (`components/ui-base/date-picker/date-picker.tsx` and `hooks/use-mobile.ts` existed; every `@/` import of the picker is `@/components/ui-base/<part>` or `@/components/ui-base/hooks/use-mobile`; `types:check` exit 0); state discarded, registry rebuilt, `git status` shows only the round 1 files
- Check: review round 1, `pnpm test installation-e2e`: not rerun; no file it reads changed (the trees' picker is in no item yet, `registry.json` unchanged)
- Check: review round 2: no rerun; the round changes only this tracker. Reviewer reran at 8e0ba9b0: `pnpm add-date-picker <base> --check` match on base, radix, aria (23 files each); `pnpm test lint` 0 errors, 9 warnings
- Check: verifier, files: `git diff --name-only origin/claude/review...HEAD` at 7d8c7031: pass (owned files, tracker, CHANGELOG.md; extras each needed by an owned file: `apps/shadcn-table-docs/package.json` for the docs copy's type check, `packages/shadcn-table/tsconfig.radix.json` for the trees' type check, `tools/registry/lib.test.mjs` the spec's registry scripts test, `test/validate-repo/test.mjs` registers the check in place of `run.mjs`; no generated file in the diff)
- Check: verifier, `pnpm test typecheck --base base`, `--base radix`, `--base aria` at 7d8c7031: pass (tsc clean each)
- Check: verifier, `pnpm test validate-repo` at 7d8c7031: pass (date picker matches on base, radix, aria, 23 files each; 52 unit tests)
- Check: verifier, `node --test tools/registry/lib.test.mjs` at 7d8c7031: pass (9 of 9, plain and `--dev` on three bases)
- Check: verifier, `grep -c "v0.1.0" tools/registry/*.mjs` at 7d8c7031: pass (1, `lib.mjs:55`, the constant)
- Check: verifier, `find packages/shadcn-table/registry/<base>/components/date-picker -type f | wc -l` at 7d8c7031: pass (22 on base, radix, aria)
- Check: verifier, `pnpm -w registry:build` then `git diff origin/claude/review -- packages/shadcn-table/registry.json registry.json` at 7d8c7031: pass (empty); `git diff --stat origin/claude/review -- 'packages/shadcn-table/registry/*/components/ui/shadcn-table'`: empty
- Check: verifier, plain `pnpm --filter shadcn-table-docs lib:install base`, `radix`, `aria`, then `types:check` at 7d8c7031: pass (no `date-picker/` or `hooks/` below any `components/ui-<base>/`; exit 0; `git status --short` empty)
- Check: verifier, scratch proof per base at 7d8c7031 (fixture line in `registry/<base>/components/ui/shadcn-table/index.ts`, `pnpm -w registry:build`, `lib:install <base>`, `types:check`, discard, rebuild): pass on base, radix, aria (core item carried `anindosarker/shadcn-date-picker/date-picker-<base>#v0.1.0`; `components/ui-<base>/date-picker/date-picker.tsx` and `hooks/use-mobile.ts` existed; `types:check` exit 0; `git status --short` empty after each discard)
- Check: verifier, first `export` to `Export` in `packages/shadcn-table/registry/aria/components/date-picker/utils/range.ts`, `pnpm test validate-repo` at 7d8c7031: fails as intended, `date-picker: registry/aria: differs: packages/shadcn-table/registry/aria/components/date-picker/utils/range.ts`; restored with `git checkout --`
- Check: verifier, `pnpm test installation-e2e --no-diff` at 7d8c7031: pass (7 passed, 0 failed); no listener on 5340 to 5360 after
- Check: verifier, `pnpm test lint` and `pnpm add-date-picker <base> --check`: reviewer lines at 8e0ba9b0 stand (8e0ba9b0..7d8c7031 touches only `.ai/`)
- Check: verifier, stays unchanged at 7d8c7031: `git diff --stat origin/claude/review...HEAD -- 'packages/shadcn-table/registry/*/components/ui/*.tsx'` lists only the six new `calendar.tsx`, `button-group.tsx` (additions); `tools/registry/hosted.mjs tools/registry/examples.mjs` empty; `shadcn-date-picker` clone `git status --short` empty; Q160 note confirmed (`registry/base/components/ui/calendar.tsx:199-205`, no `ref={ref}` on the `<Button>`): pass

- Task 1 site map: done (a9378baf)
- Task 2 packages, parts, tool, trees: done (20cd9241, 591d6d57)
- Task 3 registry build mapping and test: done (d1d313ed)
- Task 4 docs install and scratch proof: done (b6312d3d, 2552a233)
- Task 5 repo check and CONTRIBUTING section: done (6a5b3db0); CHANGELOG `#### Spec 81` (06da91e0)
- Review round 1: 1 major, 6 minors, fixed at 05106d91 (the major staged under Attention; two minors answered in Notes)
- Review round 2: 0 majors, 2 minors, fixed at 8e0ba9b0 (no code change: both answered in Notes and Attention)

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
- Review round 1, `"use client"`: the CLI's rsc transform (`@shadcn/registry` 0.2.0, `dist/chunk-GP5XIDBG.js`) tests a `/g` regex with `.test()`, so with `rsc: false` it strips the directive from every other file and the set depends on the parts before it in the run. `add-date-picker.mjs` now installs into a scratch with `rsc: true`: the trees keep every directive of the picker source, the same on every run; harmless at runtime in the trees' `rsc: false` projects.
- Review round 1, hook: `hooks/use-mobile.ts` comes from the live shadcn registry, not the tag; the tool header and `test/validate-repo/lib/date-picker.mjs` now say so. A `--check` failure from a shadcn change of the hook is wanted: users get the new hook.
- Review round 1, `rewritePicker()` in `apps/shadcn-table-docs/lib/install.mjs` removed: the picker run's aliases already make the CLI write `@/components/ui-base/...` imports and the picker's own imports are relative (scratch proof above). Spec 1.6.4's rewrite is met by the aliases.
- Review round 1, two runs in `lib:install`: the comment at `install.mjs:143-145` now states only what the scratch proof at b6312d3d saw in this install (library types imports rewritten to the picker's `types.ts` in one run with the docs' merged item), not a general CLI fact. The reviewer's user-shaped one-run install kept them intact, so spec 82's user install is not affected.
- Review round 1, files outside the owned list: each is already explained above (`apps/shadcn-table-docs/package.json`, `packages/shadcn-table/tsconfig.radix.json`, `tools/registry/lib.test.mjs`, `test/validate-repo/test.mjs` in place of `run.mjs`, `cn` in `packages/shadcn-table/package.json`).
- Review round 1, `--dev` cases of `lib.test.mjs` kept: `DEV` is read from `process.argv` at import (`tools/registry/lib.mjs:36`) and `itemAddress` changes under it (`lib.mjs:45`); the child run guards spec 1.6.3's rule that the picker address stays the same under `--dev` if `datePickerItemAddress` (`lib.mjs:63-64`) ever reads `DEV`.
- Review round 1, `process`: the `node` types line in `packages/shadcn-table/tsconfig.radix.json` stays for now (the trees are tool output and must type-check); staged under Attention.

- Review round 2, `node` in `packages/shadcn-table/tsconfig.radix.json:9`: stays at HEAD on purpose; it goes in the commit that moves `DATE_PICKER_TAG` to the fixed picker (Attention). Until then the tree type-check proves nothing for a Vite user's `tsc` and lets library files use Node globals unnoticed.
- Review round 2, `rewritePicker` removal proved on base only: radix and aria proofs at b6312d3d ran with the rewrite. No rerun here: the CLI's import transform (`@shadcn/registry` 0.2.0, `dist/chunk-ECVSMHVI.js`, function `L`) maps `@/components/ui` and `@/hooks` by alias on every base, and the picker at v0.1.0 imports only `@/components/ui/<part>` and `@/hooks/use-mobile`. Spec 82 records the real proof: `lib:install` on base, radix, aria plus `types:check`.

## Attention

- A Vite user's `tsc` fails once spec 82 makes the table install the date picker: picker v0.1.0 reads `process.env.NODE_ENV` and a stock Vite app has no Node types.
  - Source: `packages/shadcn-table/registry/<base>/components/date-picker/utils/values.ts:98`; reviewer proof: stock `shadcn init --template vite --base base --preset nova`, `shadcn add anindosarker/shadcn-date-picker/date-picker-base#v0.1.0`, `tsc --noEmit -p tsconfig.app.json` exit 2, `TS2591: Cannot find name 'process'`. The table's tree type-check passes only through `"node"` in `packages/shadcn-table/tsconfig.radix.json:9`, which also lets library files use Node globals unnoticed. Spec 82's installation-e2e vite scenarios would fail at `test/installation-e2e/test.mjs:262-264, 382-384`.
  - Recommended: a picker v0.1.1 without the `process` read (beside Q160 and Q162), then `DATE_PICKER_TAG` moves and the `node` line goes in that commit; spec 82 does not merge on v0.1.0 and its merge gate names this item. For the lead: a queue card beside Q160 and Q162.
  - Other option: keep v0.1.0 and the `node` line; every Vite user of the table fails `tsc` after install.
