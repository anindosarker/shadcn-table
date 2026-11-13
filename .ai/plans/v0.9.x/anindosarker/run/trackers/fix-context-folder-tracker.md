# Context folder (Q82, D91), tracker

Status: running
Files owned: `packages/shadcn-table/registry/base/components/ui/shadcn-table/hooks/stTableHook.tsx`, `packages/shadcn-table/registry/base/components/ui/shadcn-table/hooks/useST_Defaults.tsx`, `packages/shadcn-table/registry/base/components/ui/shadcn-table/context/ST_TableContext.tsx`, `packages/shadcn-table/registry/base/components/ui/shadcn-table/context/ST_DefaultsContext.tsx`, `packages/shadcn-table/registry/base/components/ui/shadcn-table/hooks/createSTTableHook.ts`, `packages/shadcn-table/registry/base/components/ui/shadcn-table/index.ts`, `packages/shadcn-table/registry/radix/components/ui/shadcn-table/hooks/stTableHook.tsx`, `packages/shadcn-table/registry/radix/components/ui/shadcn-table/hooks/useST_Defaults.tsx`, `packages/shadcn-table/registry/radix/components/ui/shadcn-table/context/ST_TableContext.tsx`, `packages/shadcn-table/registry/radix/components/ui/shadcn-table/context/ST_DefaultsContext.tsx`, `packages/shadcn-table/registry/radix/components/ui/shadcn-table/hooks/createSTTableHook.ts`, `packages/shadcn-table/registry/radix/components/ui/shadcn-table/index.ts`, `packages/shadcn-table/registry/aria/components/ui/shadcn-table/hooks/stTableHook.tsx`, `packages/shadcn-table/registry/aria/components/ui/shadcn-table/hooks/useST_Defaults.tsx`, `packages/shadcn-table/registry/aria/components/ui/shadcn-table/context/ST_TableContext.tsx`, `packages/shadcn-table/registry/aria/components/ui/shadcn-table/context/ST_DefaultsContext.tsx`, `packages/shadcn-table/registry/aria/components/ui/shadcn-table/hooks/createSTTableHook.ts`, `packages/shadcn-table/registry/aria/components/ui/shadcn-table/index.ts`
Depends on: Filter editor fixes
Branch `v0.9/fix-context-folder`, worktree `shadcn-react-table.worktrees/03`
Checks:
- Check: typecheck, `pnpm test typecheck --base base` at a53287e0: pass (tsc clean)
- Check: typecheck, `pnpm test typecheck --base radix` at a53287e0: pass (tsc clean)
- Check: typecheck, `pnpm test typecheck --base aria` at a53287e0: pass (tsc clean)
- Check: lint, `pnpm test lint` at a53287e0: pass (0 errors, 9 warnings, all in apps/shadcn-table-docs/examples/*/advanced and expanding-tree-flat-parse, untouched)
- Check: validate-repo, `pnpm test validate-repo` at a53287e0: pass (bases identical, registry valid, registry fresh, 40 unit tests)
- Check: storybook-tests, `pnpm test storybook-tests --base base` at a53287e0: pass (651)
- Check: storybook-tests, `pnpm test storybook-tests --base radix` at a53287e0: pass (651)
- Check: storybook-tests, `pnpm test storybook-tests --base aria` at a53287e0: pass (651)
- Check: docs-e2e, `pnpm test docs-e2e --base base --url http://localhost:5340` (next start of `pnpm build`) at a53287e0: pass (4 sections, 109 pages)
- Check: old paths, `grep -rn "hooks/stTableHook\|hooks/useST_Defaults" packages apps` at a53287e0: nothing outside CHANGELOG.md
- Check: public API, `git diff <merge-base>..HEAD -- '*/shadcn-table/index.ts' '*/shadcn-table/types.ts'` at a53287e0: only the two `from` paths change, no exported name removed
- Verify (00fb2c5a, code changed last at a53287e0, later commits touch only .ai/): recorded checks above stay valid, none rerun
- Verify: files per base, at 00fb2c5a: pass; base, radix, aria each have `context/ST_TableContext.tsx` (`tableContext`, `useTableContext`, `useSTContext`, `ST_TableProvider`), `context/ST_DefaultsContext.tsx` (`ST_DefaultsContext`, `ST_DefaultsProvider`, `useST_Defaults`), `hooks/createSTTableHook.ts` (`createSTTableHook`); `hooks/stTableHook.tsx` and `hooks/useST_Defaults.tsx` absent
- Verify: D91 grep, at 00fb2c5a: pass on tracked files (`git ls-files packages apps | xargs grep -l ...` prints nothing outside CHANGELOG.md); the raw `grep -rn` also hits 15 files in the git-ignored `packages/shadcn-table/storybook-static/{base,radix,aria}/r/*.json`, a stale build from 2026-11-08
- Verify: public API, `git diff fca077a5..HEAD` on the six `index.ts` (three registry bases, three docs copies) and `types.ts`, at 00fb2c5a: pass; `types.ts` unchanged; each `index.ts` pairs `-export { ST_TableProvider } from '.../hooks/stTableHook'` with `+export { ST_TableProvider } from '.../context/ST_TableContext'`, and the `} from '.../hooks/useST_Defaults'` line of the `ST_DefaultsProvider`/`useST_Defaults` export with `} from '.../context/ST_DefaultsContext'`; no exported name removed
- Verify: moves only, `git diff -M fca077a5..HEAD`, at 00fb2c5a: pass; `useST_Defaults.tsx` to `context/ST_DefaultsContext.tsx` is R100 on every base and docs copy; `stTableHook.tsx` splits into `context/ST_TableContext.tsx` and `hooks/createSTTableHook.ts` with every body line carried over verbatim (removed and added lines balance), the factory now importing `tableContext` from the context file; every other changed line is an import path, a docs source link, a comment path or the registry README tree; no behavior change
- Verify: registry, at 00fb2c5a: pass; `registry.json` adds the three new paths per base, drops the two old ones, no `"name"` line removed; no tracked deletion in the branch (`git diff --name-status` has no `D`), `public/r/` git-ignored and present
- Verify: changelog, at 00fb2c5a: pass; `#### Fix D91` under `### Changed` in `## Unreleased`, names the moved files
- Verify: base copies in step, `pnpm test validate-repo` recorded at a53287e0 is valid (no code change since): pass

- Task 1 move per base: done (a53287e0); `context/ST_TableContext.tsx`, `context/ST_DefaultsContext.tsx`, `hooks/createSTTableHook.ts` on base, radix, aria; `tools/registry/{base,aria}-diff.json` list `context/ST_TableContext.tsx` in place of `hooks/stTableHook.tsx` (only the provider differs; the factory is identical on the three bases)
- Task 2 path imports: done (a53287e0); library, `example-icons.tsx`, `st-components.mdx` source links, `stFeatures.ts` comment, `registry/README.md` tree; stories import through `index.ts` and needed no change; registry item file lists are read from the tree by `buildBaseItems`
- Task 3 regenerate: done (a53287e0); `registry.json` lists the new paths and keeps every name; `public/r/` is git-ignored and keeps every item file (item names unchanged); deleted tracked files are only the generated copies `apps/shadcn-table-docs/components/ui-<base>/shadcn-table/hooks/{stTableHook,useST_Defaults}.tsx` that `lib:install` left behind, not hosted paths
- Task 4 checks: done (a53287e0)
- Task 5 format and changelog: done (a53287e0); `#### Fix D91` under `### Changed`

## Attention

- The docs page `api/st-components.mdx` links the new source paths on GitHub `master`, so the two "View Source Code" links 404 until 0.9.4 reaches master.
- `pnpm lib:install <base>` does not delete library files that left the registry; the two stale copies per base were removed by hand with `git rm`.
- The D91 grep as written (`grep -rn ... packages apps`) also matches the git-ignored, stale `packages/shadcn-table/storybook-static/` build of 2026-11-08 in this worktree, so it only prints nothing on a clean checkout or after that folder is rebuilt.
