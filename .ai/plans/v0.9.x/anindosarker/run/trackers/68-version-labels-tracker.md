# 68: Version labels, tracker

Status: running
Branch `v0.9/version-labels`, worktree 03
Checks:
- Red: docs-e2e `header version`, `pnpm test docs-e2e --base base /docs/getting-started/install` at 5d16e986 (before the cherry-pick): fail, `FAIL /docs/getting-started/install @1440 header version v0.9.6: []` and `... header version at 390 v0.9.6: []`, the only 2 fails of 35
- Check: cherry-pick diff, `git diff a3d61fe9 HEAD -- apps/shadcn-table-docs/components/site-nav.tsx apps/shadcn-table-docs/lib/layout.shared.tsx` at 26bef0e1: empty
- Check: docs-e2e, `pnpm test docs-e2e --base base` at 26bef0e1: pass, 2637 checks, `header version` and `header version at 390` passed
- Red: storybook-static `manager title version`, `pnpm test storybook-static --base base --ids 0:3` at 9f4a690e (before the main.ts and themes.ts edit): fail, `FAIL manager title version "shadcn-table (Base UI)" (expected "shadcn-table v0.9.6 (Base UI)")`, the only fail
- Check: typecheck, `pnpm test typecheck --base base` at 9aab25d1 (tree of 9aab25d1 before its commit): pass, tsc clean
- Check: lint, `pnpm test lint` at 9aab25d1: pass, 9 warnings (docs app, none in this milestone's files: `eslint components/site-nav.tsx lib/layout.shared.tsx` clean)
- Check: storybook-static, `pnpm test storybook-static --base base` at 9aab25d1: pass, `manager title version "shadcn-table v0.9.6 (Base UI)"`, code tab of 626 stories pass

- Task 1 The docs check and the header label: 26bef0e1
- Task 2 The title check and the Storybook title: 9aab25d1
- Task 3 The changelog block: planned

## Attention

## Notes
