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
- Check: T3 moves, `git diff -M100% --name-status 5404817 HEAD` at 99948b7: 320 R100; the rest is the files 1.6.2 and 1.6.3 name (root package.json, pnpm-workspace.yaml, pnpm-lock.yaml, turbo.json, registry.json, vercel.json, ci.yml, .gitignore, .prettierignore, tools/*.mjs, the package's package.json, .storybook/main.ts, eslint.config.mjs, vite.config.ts, vitest.config.ts, registry/README.md, the app's package.json, lib/install.ts, lib/layout.shared.tsx, lib/registry-trees.mjs, app/version.txt/route.ts) plus `.prettierrc` (Task 1 extra line): pass
- Check: T3 zero-line renames, `git diff -M --stat 5404817 HEAD -- registry/*/{components,hooks,generated}/* stories/* and the packages/shadcn-date-picker counterparts` at 99948b7: 185 R100, 0 insertions, 0 deletions: pass
- Check: T3 per-base registry.json, `git diff 5404817:registry/<base>/registry.json HEAD:packages/shadcn-date-picker/registry/<base>/registry.json` at 99948b7: base, radix, aria print nothing; the generated trees the same, nothing: pass
- Check: T3 registry build, `pnpm registry:build` then `git status --short` at 99948b7: exit 0, status empty: pass
- Check: T3 install base, two fresh apps (`pnpm dlx shadcn@latest create -t next -b base -p nova --no-monorepo`, one copied), `shadcn add anindosarker/shadcn-date-picker/date-picker-base#54048178ff61d4ca5c8fe366de385284ea8dc74a` and `#date-picker-repository-layout` (branch head 99948b7) at 99948b7: 22 picker files each, `diff -r` of components/ and hooks/ empty, `pnpm exec tsc --noEmit` exit 0 in the branch app: pass
- Check: T3 install radix, same with `-b radix`, `date-picker-radix#54048178...` and `#date-picker-repository-layout` at 99948b7: 22 picker files each, `diff -r` empty, tsc exit 0: pass
- Check: T3 install aria, same with `-b aria`, `date-picker-aria#54048178...` and `#date-picker-repository-layout` at 99948b7: 22 picker files each, `diff -r` empty, tsc exit 0: pass
- Check: T3 scratch apps deleted, `test ! -e /private/tmp/claude-501/dp-layout-install` at 99948b7: pass
- Check: T3 tags, `git ls-remote --tags origin` before and after at 99948b7: equal (v0.1.0, v0.1.1 unchanged): pass

- Task 1 The map and the moves: done (8de68ce, 15eb2b0)
- Task 2 Packages, workspace, turbo and the path readers: done (fe23e8f, 99948b7)
- Task 3 The equality proofs: done (99948b7, proofs only, no commit)
- Task 4 The full checks and the local production read: planned
- Task 5 After the merge, the live reads: planned
