# 04: Theme customizer, tracker

Status: running
Branch `v0.9/theme-customizer`, worktree 03
Checks:
- Check: red, `pnpm test docs-e2e --base base /` at 546bcabd (shipped code plus the new checks): fail as expected, 7 failed: default look (no design system style element), stale choice (entry not removed), panel (no Customize theme button), r, p, Shift+R (no shortcut), token edit (no panel)
- Check: install, `pnpm install --frozen-lockfile` after the hotkeys add (Task 2): pass
- Check: parts, `pnpm add-part radix --all` then `git status --short` (Task 2): pass, nothing beyond the new sheet
- Check: `pnpm --filter shadcn-table-docs types:check` at 73c60884 plus the Task 4 working tree (Task 3): pass
- Check: `pnpm --filter shadcn-table-docs lint` at 73c60884 plus the Task 4 working tree (Task 3): pass, 0 errors (9 warnings in examples, unchanged)

- Task 1 Reproduce (docs E2E theme checks red on the shipped code): done, fb2aa071
- Task 2 Dependencies (react-hotkeys, sheet part): done, 8d0670db
- Task 3 Core and provider: done, 73c60884
- Task 4 Panel, controls, layout, demo: planned
- Task 5 Cleanup: planned

## Attention

- The sheet part sits in the docs only: `pnpm add-part radix sheet` writes to `packages/shadcn-table/registry/radix/components/ui/`, so its output was moved to `apps/shadcn-table-docs/components/ui-radix/sheet.tsx` (the file the spec owns) with the button import pointed at `@/components/ui-radix/button`; the registry gains no unused part and `add-part radix --all` stays clean. Revert: keep it in the registry too (then base and aria need it as well).
- `@tanstack/react-hotkeys` is `^0.22.0`, published 2026-11-02 (beta, six days old at install).

## Notes

- The shipped build computes `--primary` as `lab(...)` (Lightning CSS rewrites oklch in compiled CSS); the design system's inline style element keeps the `oklch(...)` strings the checks compare.
