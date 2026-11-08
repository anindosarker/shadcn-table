# 14: The Icon Library select switches the example tables' icons, tracker

Status: running
Branch `v0.9/icon-library-select`, worktree 04
Checks:
- `pnpm test typecheck --base radix` at c827660c + Task 1 files: pass (the docs and registry tsconfigs do not include stories/, so the story red is read from the stories tsconfig below)
- `tsc -p packages/shadcn-table/tsconfig.stories.json --noEmit` at c827660c + Task 1 files: fail as expected, `Icons.stories.tsx(5,3): TS2305 no exported member 'ST_DefaultsProvider'` (P11); 3 older errors in HeaderGroups, ViewSettings, PinnedItemsCustomToolbar stories are not this milestone's
- `ST_BASE=radix vitest run stories/features/Icons.stories.tsx` at c827660c + Task 1 files: fail as expected, "does not provide an export named 'ST_DefaultsProvider'" (P11)
- `pnpm test docs-e2e --base base /` at c827660c + Task 1 files: fail as expected, 3 failed: `icons: Tabler switches the home tables` (picked=false, the select is disabled), `icons: the pick survives a reload` (stored=lucide), `icons: Shift+R returns to Lucide` (P11)
- `pnpm test docs-e2e --base base /docs/examples/basic` at c827660c + Task 1 files: fail as expected, 1 failed: `basic: stored Tabler pick switches the example icons` (class lucide lucide-search) (P11)
- `pnpm install --frozen-lockfile` after the Task 2 install at a59bca71 + Task 2 files: pass, clean
- `pnpm test typecheck --base radix`, `--base base`, `--base aria` at 15ddc6da + Task 3 files: pass, tsc clean
- `ST_BASE=<base> vitest run stories/features/Icons.stories.tsx` for radix, base, aria at 15ddc6da + Task 3 files: pass, 1 passed each
- `eslint` on the Task 3 library files and the story: pass

- Task 1 Reproduce (story typecheck and the icon checks red on the shipped code): done, a59bca71
- Task 2 Dependencies (the five icon packages): done, 15ddc6da
- Task 3 Library (ST_DefaultsProvider, hook merge, exports, types): planned
- Task 4 Installer and copies (icons/<set>.ts per base): planned
- Task 5 Docs (config, select, example-icons, layout, API page, guide): planned
- Task 6 Cleanup: planned

## Attention

- [Staging for the ATTENTION file, one bullet per item, self-explanatory first line.]

## Notes

- [Optional: only what a later task, a resume or the owner would otherwise rediscover.]
