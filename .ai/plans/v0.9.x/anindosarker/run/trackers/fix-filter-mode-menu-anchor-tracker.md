# Filter mode menu anchor (Q62), tracker

Status: running
Files owned: packages/shadcn-table/stories/features/Filtering.stories.tsx (story ModeMenuNextToButtonPopover), packages/shadcn-table/registry/base/components/ui/shadcn-table/components/menus/ST_FilterOptionMenu.tsx, packages/shadcn-table/registry/radix/components/ui/shadcn-table/components/menus/ST_FilterOptionMenu.tsx, apps/shadcn-table-docs/components/ui-base/shadcn-table/components/menus/ST_FilterOptionMenu.tsx (generated, `pnpm lib:install base`), apps/shadcn-table-docs/components/ui-radix/shadcn-table/components/menus/ST_FilterOptionMenu.tsx (generated, `pnpm lib:install radix`), CHANGELOG.md (`#### Fix D77` block)
Depends on: none
Branch `v0.9/fix-filter-mode-menu-anchor`, worktree 08
Checks:
- Check: P11 play fails before the fix, `ST_BASE=base pnpm exec vitest run stories/features/Filtering.stories.tsx -t "Mode Menu Next To Button Popover"` at 677cff43: fail as required, "vertical gap to the mode button: expected 97 to be less than or equal to 8"
- Check: P11 play fails before the fix, same command with `ST_BASE=radix` at 677cff43: fail as required, "vertical gap to the mode button: expected 97 to be less than or equal to 8"
- Check: play on aria, same command with `ST_BASE=aria` at 677cff43: pass
- Check: play after the fix, same command with `ST_BASE=base` and `ST_BASE=radix` at 18090f1b: pass
- Check: typecheck, `pnpm test typecheck --base base` at 18090f1b: pass (radix also clean)
- Check: lint, `pnpm test lint` at 18090f1b: pass (0 errors, 9 warnings, none in changed files)
- Check: validate-repo, `pnpm test validate-repo` at 18090f1b: pass
- Check: storybook-tests, `pnpm test storybook-tests --base base` at 18090f1b: pass, 621 passed
- Check: storybook-tests, `pnpm test storybook-tests --base radix` at 18090f1b: pass, 621 passed
- Check: Filtering plays on aria, `ST_BASE=aria pnpm exec vitest run stories/features/Filtering.stories.tsx` at 18090f1b: pass, 29 passed

- Task 1 play first: done (677cff43)
- Task 2 fix per D77: done (18090f1b)
- Task 3 checks: done (18090f1b)
- Task 4 cleanup, format and changelog: done (18090f1b)

## Attention

- The portal renders only after hydration (a `useSyncExternalStore` hydrated flag), so server and hydration output keep the anchor span in place and no `document` is read on the server; D77 names only `createPortal(..., document.body)`.
- The play waits for the popover's enter animations to finish before opening the menu: React Aria's menu is also offset when opened while the popover is still animating (its transform), which D77 left untouched.
