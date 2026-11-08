# 09: One shortcut row in the theme panel, tracker

Status: running
Branch `v0.9/theme-panel-shortcut-row`, worktree 04
Checks:
- `pnpm test docs-e2e --base base /` at 7be492f6 plus the Task 1 checks (shipped code, P11): fail as intended, 5 red: "the shortcut row has Reset, Undo, Redo, Random, Next preset Reset=0 Undo=0 Redo=1 Random=0 Next preset=0", "the shortcut row does not overflow null", "Mod+Z restores it", "Mod+Shift+Z reapplies the shuffled value", "p changes nothing"; every other check pass (62 passed)
- `pnpm --filter shadcn-table-docs types:check` at 320027a0: pass
- `pnpm test docs-e2e --base base /` with the labeled row (measurement, uncommitted): row scrollWidth 622, clientWidth 327, so the compact form
- `pnpm --filter shadcn-table-docs exec eslint components/theme-customizer.tsx components/design-system-provider.tsx` at c5c50b06: pass
- `pnpm --filter shadcn-table-docs types:check` at c5c50b06: pass
- `pnpm test docs-e2e --base base /` at c5c50b06: pass (67 passed, 0 failed; row scroll=client=327)

- Task 1 Reproduce: done (48168e17)
- Task 2 Hotkeys: done (320027a0)
- Task 3 ShortcutRow, header, Presets row: done (c5c50b06)
