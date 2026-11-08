# 10: Color swatches open a picker, tracker

Status: running
Branch `v0.9/theme-color-picker`, worktree 04
Checks:

- `pnpm test docs-e2e --base base /` at f500a774 plus the Task 1 checks (shipped code, P11): fail as intended, 3 red: "theme: picker opens opened=false", "theme: picker writes live oklch(0.55 0.15 250) -> ", "theme: picker undoes in one step oklch(0.6 0.2 30) -> oklch(0.55 0.15 250) -> , undo , undo "; every other check pass (67 passed)
- `pnpm install --frozen-lockfile` after `pnpm add react-colorful@5.8.1 --filter shadcn-table-docs`: pass (clean)
- `pnpm --filter shadcn-table-docs types:check` at 55f419c6: pass
- `pnpm --filter shadcn-table-docs exec eslint components/design-system-provider.tsx lib/design-system/tokens.ts` at 55f419c6: pass
- `pnpm --filter shadcn-table-docs exec eslint components/theme-customizer.tsx` at feb69b0c: pass
- `pnpm --filter shadcn-table-docs types:check` at feb69b0c: pass
- `pnpm test docs-e2e --base base /` at feb69b0c: pass (70 passed, 0 failed; picker #ff0000, undo to the typed value, second undo to the value before it)
