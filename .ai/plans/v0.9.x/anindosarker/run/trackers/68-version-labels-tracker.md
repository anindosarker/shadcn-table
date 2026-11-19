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
- Check: lint, `pnpm test lint` at a882a4a6: pass, 9 warnings (docs app)
- Check: validate-repo, `pnpm test validate-repo` at a882a4a6: pass, 43 unit tests, registry fresh
- Check: changelog, `grep -c '^#### Spec 68' CHANGELOG.md` at a882a4a6: 1
- Check: cherry-pick diff at end, `git diff a3d61fe9 HEAD -- apps/shadcn-table-docs/components/site-nav.tsx apps/shadcn-table-docs/lib/layout.shared.tsx` at a882a4a6: empty
- Not run here (builder): docs-e2e, storybook-static and typecheck on radix and aria
- Check (verifier): typecheck, `pnpm test typecheck --base radix` and `--base aria` at a882a4a6: pass, tsc clean on both
- Check (verifier): storybook-static, `pnpm test storybook-static --base radix` at a882a4a6: pass, `manager title version "shadcn-table v0.9.6 (Radix UI)"`, code tab of 626 stories pass
- Not rerun (verifier): typecheck base and storybook-static base at 9aab25d1 (diff to HEAD is the changelog only); docs-e2e base at 26bef0e1 (diff to HEAD touches only .storybook and test/storybook-static, not the docs app)
- Still missing (verifier stopped by the harness before they finished): storybook-static aria (was mid-run, 300 of 626), docs-e2e radix, docs-e2e aria
- Check (verifier 2): storybook-static, `pnpm test storybook-static --base aria` at a882a4a6: pass, `manager title version "shadcn-table v0.9.6 (React Aria)"`, code tab of 626 stories pass, 0 FAIL lines

- Task 1 The docs check and the header label: 26bef0e1
- Task 2 The title check and the Storybook title: 9aab25d1
- Task 3 The changelog block: a882a4a6

## Attention

## Notes
