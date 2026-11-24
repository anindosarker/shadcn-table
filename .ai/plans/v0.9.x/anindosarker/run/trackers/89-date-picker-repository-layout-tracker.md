# 89: Date picker repository layout, tracker

Status: running
Branch `date-picker-repository-layout`, worktree shadcn-date-picker.worktrees/date-picker-repository-layout, from origin/main 5404817 (start sha 54048178ff61d4ca5c8fe366de385284ea8dc74a, holds spec 86's merge commit 5404817)
Checks:
- Check: setup, `pnpm install --frozen-lockfile` at 5404817: pass
- Check: start holds spec 86, `git merge-base --is-ancestor 5404817 origin/main` at 5404817: pass
- Check: tags before, `git ls-remote --tags origin` at 5404817: v0.1.0 310b4a0 (908300d), v0.1.1 5fa8f7d (2cf6e6f)
- Check: T1 reader grep repeated on the branch, `git grep -nE "tools/|registry/|../package.json|stories|.storybook|storybook-static|docs|ROOT|REPO"` at 5404817: every line of the 1.6.3 map found; spec 86 brought none; extra: `.prettierrc:9` `"tailwindStylesheet": "registry/base/index.css"` (root file, reads a moved path; updated in Task 2 to the package path, same meaning)
- Check: T1 extra reader, `tools/registry-build.mjs:10-12` imports `prettier`, `shadcn/schema`, `shadcn/utils` at 5404817: resolved from the root node_modules; after the move `shadcn` must stay resolvable from `tools/` (root devDependency `shadcn`, same range, Task 2)
- Check: T1 move commits renames only, `git show -M100% --name-status 8de68ce` at 8de68ce: 210 R100, nothing else: pass
- Check: T1 move commits renames only, `git show -M100% --name-status 15eb2b0` at 15eb2b0: 120 R100, nothing else: pass
- Check: T1 old folders gone, `test ! -e registry && test ! -e stories && test ! -e docs && test ! -e .storybook` at 15eb2b0: exit 0, pass
- Check: T2 the one install, `pnpm install` then `pnpm install --frozen-lockfile` at 99948b7: exit 0, pass
- Check: T2 lockfile diff, `git diff 15eb2b0 fe23e8f -- pnpm-lock.yaml` at fe23e8f: importer keys (`docs` to `apps/shadcn-date-picker-docs`, new `packages/shadcn-date-picker`, root importer now turbo, prettier, prettier-plugin-tailwindcss, shadcn) and the `turbo@2.5.6` entries; no resolved version moved; two peer suffixes lost their root context (`eslint-config-next@16.3.8` without the optional `@typescript-eslint/parser` peer, `fumadocs-mdx@15.4.7` without the optional `vite` peer), same versions: pass
- Check: T2 root devDependency `shadcn` (^4.22.0, same resolution), `node tools/registry-build.mjs` needs `shadcn/schema` and `shadcn/utils` resolvable from `tools/` at 99948b7: added beside turbo, prettier and its plugin
- Check: T2 `.prettierrc` tailwindStylesheet, `prettier --check packages/shadcn-date-picker/stories` with the old `registry/base/index.css` path at 99948b7: errors (9 files), so the path follows the move: pass with the new path
- Check: T2 lint, `pnpm lint` at 99948b7: exit 0, pass
- Check: T2 typecheck, `pnpm typecheck` at 99948b7: exit 0, pass
- Check: T2 registry check, `pnpm registry:check` at 99948b7: exit 0, three bases up to date (22 files each), pass
- Check: T2 version, `node -e` on `packages/shadcn-date-picker/package.json` and `package.json` at 99948b7: `0.1.1` and `undefined`, pass
- Check: T2 root catalog, `grep -c 'packages/shadcn-date-picker/registry/' registry.json` at 99948b7: 3, pass
- Check: T2 lint coverage, root `eslint .` linted `tools/*.mjs` before the move; the package's `eslint .` does not reach `tools/` (outside its config folder); prettier still checks them at 99948b7: noted

- Task 1 The map and the moves: done (8de68ce, 15eb2b0)
- Task 2 Packages, workspace, turbo and the path readers: done (fe23e8f, 99948b7)
- Task 3 The equality proofs: planned
- Task 4 The full checks and the local production read: planned
- Task 5 After the merge, the live reads: planned
