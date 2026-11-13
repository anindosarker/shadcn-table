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

- Task 1 move per base: done (a53287e0); `context/ST_TableContext.tsx`, `context/ST_DefaultsContext.tsx`, `hooks/createSTTableHook.ts` on base, radix, aria; `tools/registry/{base,aria}-diff.json` list `context/ST_TableContext.tsx` in place of `hooks/stTableHook.tsx` (only the provider differs; the factory is identical on the three bases)
- Task 2 path imports: done (a53287e0); library, `example-icons.tsx`, `st-components.mdx` source links, `stFeatures.ts` comment, `registry/README.md` tree; stories import through `index.ts` and needed no change; registry item file lists are read from the tree by `buildBaseItems`
- Task 3 regenerate: done (a53287e0); `registry.json` lists the new paths and keeps every name; `public/r/` is git-ignored and keeps every item file (item names unchanged); deleted tracked files are only the generated copies `apps/shadcn-table-docs/components/ui-<base>/shadcn-table/hooks/{stTableHook,useST_Defaults}.tsx` that `lib:install` left behind, not hosted paths
- Task 4 checks: done (a53287e0)
- Task 5 format and changelog: done (a53287e0); `#### Fix D91` under `### Changed`

## Attention

- The docs page `api/st-components.mdx` links the new source paths on GitHub `master`, so the two "View Source Code" links 404 until 0.9.4 reaches master.
- `pnpm lib:install <base>` does not delete library files that left the registry; the two stale copies per base were removed by hand with `git rm`.
