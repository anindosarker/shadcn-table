# 10: Color swatches open a picker, tracker

Status: merged (38bf5ac6d3d2e76094c27e6b455375efc7fa9b2f)
Branch `v0.9/theme-color-picker`, worktree 04
Checks:

- `pnpm test docs-e2e --base base /` at f500a774 plus the Task 1 checks (shipped code, P11): fail as intended, 3 red: "theme: picker opens opened=false", "theme: picker writes live oklch(0.55 0.15 250) -> ", "theme: picker undoes in one step oklch(0.6 0.2 30) -> oklch(0.55 0.15 250) -> , undo , undo "; every other check pass (67 passed)
- `pnpm install --frozen-lockfile` after `pnpm add react-colorful@5.8.1 --filter shadcn-table-docs`: pass (clean)
- `pnpm --filter shadcn-table-docs types:check` at 55f419c6: pass
- `pnpm --filter shadcn-table-docs exec eslint components/design-system-provider.tsx lib/design-system/tokens.ts` at 55f419c6: pass
- `pnpm --filter shadcn-table-docs exec eslint components/theme-customizer.tsx` at feb69b0c: pass
- `pnpm --filter shadcn-table-docs types:check` at feb69b0c: pass
- `pnpm test docs-e2e --base base /` at feb69b0c: pass (70 passed, 0 failed; picker #ff0000, undo to the typed value, second undo to the value before it)
- `pnpm test typecheck --base radix` at 9b2cea14: pass
- `pnpm test lint` at 9b2cea14: pass (0 errors, 9 warnings, none in owned files)
- `pnpm test validate-repo` at 9b2cea14: pass
- `pnpm install --frozen-lockfile` at 9b2cea14: pass (clean)
- `pnpm test docs-e2e --base base /` at 9b2cea14: first run 1 red, the P5 flake "theme: Shift+R returns to the default" (`again` was already the default; the three `r` presses found no other primary); rerun pass (70 passed, 0 failed, the three picker checks green)
- Verifier at c233c2d9: every 2.2 check and every Acceptance (1.2) line is recorded green at 9b2cea14; `git diff --name-only 9b2cea14..c233c2d9` touches only this tracker, so nothing rerun

- Task 1 Reproduce: done (cec8cf0c)
- Task 2 Dependency: done (a6055ae0)
- Task 3 Provider session, toHex: done (55f419c6)
- Task 4 Token row popover: done (feb69b0c)
- Task 5 Cleanup: done (9b2cea14)

## Attention

- `toHex` resolves a non-hex value by painting it on a 1x1 canvas and reading the pixel, not through a hidden element's computed color as 1.6.2 says: Chrome keeps oklch as oklch in a computed style, so that route returns no hex. Same outcome (browser resolves, no color library); alpha is dropped.
