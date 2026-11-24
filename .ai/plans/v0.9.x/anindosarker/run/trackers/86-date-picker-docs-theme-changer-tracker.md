# 86: Date picker docs theme changer, tracker

Status: running
Branch `date-picker-docs-theme-changer`, worktree shadcn-date-picker.worktrees/date-picker-docs-theme-changer (from origin/main 0c007cf)
Checks:
- Check: setup, `pnpm install --frozen-lockfile` at 0c007cf: pass
- Check: task 1 import list (1.6.1), every `from '@/` of the taken files against docs/ at 0c007cf: all resolve
  - `@/lib/design-system/{config,history,tokens,color-presets,themes}`: taken in this list
  - `@/components/theme-customizer`, `@/components/design-system-provider`, `@/components/ui-radix/{sheet,select,tabs}`: taken in this list
  - `@/components/ui-radix/{button,input,popover,tooltip}`, `@/lib/cn`: present in docs/, each byte-equal to the table's at v0.9.8
  - bare `cn`, `radix-ui`, `next-themes`, `lucide-react`, `class-variance-authority`, `shadcn/preset`, `next/font/google`, `fumadocs-ui/contexts/search`, `fumadocs-ui/layouts/shared/slots/theme-switch`: in docs/package.json at the table's versions; `react-colorful`, `@tanstack/react-hotkeys` added by this task
- Check: task 1 `diff <(git show v0.9.8:apps/shadcn-table-docs/<f>) docs/<f>` for the 19 as-is files (provider, theme-controls, sheet, tabs, select, six lib/design-system, eight styles incl. nova) at 432b9bb: prints nothing
- Check: task 1 `diff` of components/theme-customizer.tsx against the table's at 432b9bb: deletions only (the Icon Library SelectField with its comment, lines 183-199, and the `ICON_LIBRARIES` import it alone used)
- Check: task 1 `pnpm install --frozen-lockfile` after `pnpm --filter docs add react-colorful@5.8.1 @tanstack/react-hotkeys@^0.22.0` at 432b9bb: exit 0 (specifier kept `^0.22.0`, resolves 0.22.3)
- Check: task 1 `ls docs/styles/style-*.css | wc -l` at 432b9bb: 8
- Check: task 2 `test ! -e docs/app/theme.css` at 5841bdc: pass
- Check: task 2 `grep -c 'style-nova\|data-menu-color' docs/app/layout.tsx` at 5841bdc: 0
- Check: task 2 `grep -c 'designSystemScript\|DesignSystemProvider\|designSystemFontVariables' docs/app/layout.tsx` at 5841bdc: 6
- Check: task 2 restored global.css rules: none (the table-only rules are the stories @source, `.docs-playground[data-fullscreen]`, `.docs-index*`, the agent-bar button selector and the `st-tok-*` code tokens; no taken file renders them)
- Check: task 2 `pnpm --filter docs types:check` at 5841bdc: pass
- Check: task 2 `pnpm --filter docs lint` at 5841bdc: pass
- Check: task 2 `pnpm --filter docs build` at 5841bdc: pass
- Check: task 2 `ls docs/public/styles/style-*.css | wc -l` at 5841bdc: 8

- Task 1 The taken files and the two packages: done (432b9bb)
- Task 2 The layout and the default look: done (5841bdc)
- Task 3 The local production build read and the captures: running
- Task 4 After the merge, the live reads: planned
