# 81: Date picker in the table's build, tracker

Status: running
Branch `v0.9/date-picker-in-table-build`, worktree 03
Checks:

- Check: site map table in the tracker, each `passes through` line names its line: pass

- Task 1 site map: done (this commit)

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

## Attention
