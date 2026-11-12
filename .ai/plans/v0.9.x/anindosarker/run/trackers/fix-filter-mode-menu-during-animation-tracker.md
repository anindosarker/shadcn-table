# Filter mode menu during popover animation (Q65, D80), tracker

Status: running
Files owned: `packages/shadcn-table/registry/base/components/ui/shadcn-table/hooks/useST_MenuAnchor.ts`, `packages/shadcn-table/registry/radix/components/ui/shadcn-table/hooks/useST_MenuAnchor.ts`, `packages/shadcn-table/registry/aria/components/ui/shadcn-table/hooks/useST_MenuAnchor.ts`, `packages/shadcn-table/registry/aria/components/ui/shadcn-table/components/menus/ST_FilterOptionMenu.tsx`, `packages/shadcn-table/stories/features/Filtering.stories.tsx`, `CHANGELOG.md`
Depends on: none
Branch `v0.9/fix-filter-mode-menu-during-animation`, worktree 08
Checks:
- Check: P11 play before the fix (aria), `ST_BASE=aria pnpm exec vitest run stories/features/Filtering.stories.tsx -t "Mode Menu Next To Button"` at bc01c1ef: fail as required, `Mode Menu Next To Button During Popover Animation` "vertical gap to the mode button: expected 116.9375 to be less than or equal to 8"
- Check: P11 play before the fix (base), same command with `ST_BASE=base` at bc01c1ef: pass (2 passed; the mid-animation click did not misplace the menu)
- Check: P11 play before the fix (radix), same command with `ST_BASE=radix` at bc01c1ef: pass (2 passed; the mid-animation click did not misplace the menu)
- Check: play after the fix, same command on aria (3 runs), base, radix at cd6f7ffe: pass (2 passed each)
- Check: typecheck base, `pnpm test typecheck --base base` at cd6f7ffe: pass (tsc clean)
- Check: typecheck radix, `pnpm test typecheck --base radix` at cd6f7ffe: pass (tsc clean)
- Check: typecheck aria, `pnpm test typecheck --base aria` at cd6f7ffe: pass (tsc clean)
- Check: lint, `pnpm test lint` at cd6f7ffe: pass (9 warnings, all in docs examples, none in owned files)
- Check: validate-repo, `pnpm test validate-repo` at cd6f7ffe: pass (bases identical, icon maps complete, tailwind valid, registry valid, registry fresh, 40 unit tests)
- Check: storybook-tests base, `pnpm test storybook-tests --base base` at cd6f7ffe: pass (622 passed)
- Check: storybook-tests radix, `pnpm test storybook-tests --base radix` at cd6f7ffe: pass (622 passed)
- Check: storybook-tests aria, `pnpm test storybook-tests --base aria` at cd6f7ffe: pass (622 passed)

- Task 1 play first: done (bc01c1ef)
- Task 2 fix per D80: done (cd6f7ffe)
- Task 3 checks: done (cd6f7ffe)
- Task 4 cleanup and changelog: done (124374cb)
