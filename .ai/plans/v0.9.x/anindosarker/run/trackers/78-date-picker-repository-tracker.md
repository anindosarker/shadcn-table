# 78: Date picker repository, tracker

Status: running
Branch `date-picker-repository`, worktree /Users/anindosarker/Work/Personal/React-table/shadcn-date-picker.worktrees/date-picker-repository
Checks:
- Check: `git -C /Users/anindosarker/Work/Personal/React-table status --short | grep -c shadcn-date-picker` at 4587f8a: pass (0)
- Check: `gh repo view anindosarker/shadcn-date-picker --json defaultBranchRef --jq .defaultBranchRef.name` at 4587f8a: pass (main)
- Check: `git -C shadcn-date-picker log --oneline origin/main | wc -l` at 4587f8a: pass (1)
- Check: `ls registry/<base>/components/ui` for base, radix, aria at 2d89c47: pass (badge, button, button-group, calendar, dialog, field, input-group, native-select, popover in all three, plus the parts they import: input, label, separator, textarea, and select on aria)
- Check: second run of the same shadcn `add` on base, then `git diff --stat` at 2d89c47: pass (prints nothing)
- Check: `pnpm typecheck` at 2d89c47: pass
- Check: `pnpm lint` at 2d89c47: pass
- Check: `git -C test-projects/next-app diff --quiet 53f4b4f -- components/date-picker` at a44305a: pass (exit 0)
- Check: `diff -r test-projects/next-app/components/date-picker registry/base/components/date-picker` at a44305a: pass (prints nothing)
- Check: `find registry/base/components/date-picker -type f | wc -l` at a44305a: pass (22)
- Check: `pnpm typecheck` and `pnpm lint` with the folder unchanged at a44305a: pass
- Check: `git -C test-projects/next-app status --short` before and after Task 3 at a44305a: pass (empty both times)
- Check: `pnpm registry:check` at 10e41b0: pass
- Check: `node -e` on `registry/base/registry.json` at 10e41b0: pass (one item date-picker-base, 22 files; registryDependencies badge, button, button-group, calendar, dialog, field, input-group, native-select, popover, use-mobile; dependencies @base-ui/react, cn, date-fns, lucide-react, react-day-picker)
- Check: `registry/radix/registry.json` and `registry/aria/registry.json` items at 10e41b0: pass (0 each)
- Check: deleted `utils/time.ts`, then `pnpm registry:check` at 10e41b0: pass (exit 1, file restored, exit 0 again)
- Check: install proof `pnpm dlx shadcn@latest add anindosarker/shadcn-date-picker/date-picker-base#607d384075f928dee8be08f83316d99ea7d8be67` in a fresh `shadcn init -d` Next.js app (base-nova) at 607d384: pass
- Check: `find components/date-picker -type f | wc -l` in the scratch app at 607d384: pass (22)
- Check: `diff -r components/date-picker <approved folder>` in the scratch app at 607d384: pass (prints nothing)
- Check: `pnpm exec tsc --noEmit` in the scratch app at 607d384: pass
- Check: `pnpm exec next build` in the scratch app at 607d384: pass
- Check: scratch app deleted at 607d384: pass
- Check: `grep -c 'anindosarker/shadcn-date-picker/date-picker-base' README.md` at 216d5d4: pass (1)
- Check: Local CI `pnpm install --frozen-lockfile`, `pnpm lint`, `pnpm typecheck`, `pnpm registry:check` at 216d5d4: pass

- Task 1 clone, excludes, initial commit, branch and worktree: done (4587f8a)
- Task 2 scaffold: done (2d89c47)
- Task 3 exact copy: done (a44305a)
- Task 4 registry: done (10e41b0, 607d384)
- Task 5 install proof and README: done (216d5d4)

## Notes

- LICENSE: the MIT text of the table repository with the holder Anindo Sarker only; the second line there (Kevin Vandy) is for the material-react-table port, which the picker is not.
- Config, not code, for the copy: `tsconfig.baseui.json` adds the `node` types, since `utils/values.ts:98` reads `process.env.NODE_ENV`, as it did in the Next.js app.
- Item files are `registry:file` with `@components/date-picker/...` targets. As `registry:component`, the CLI's install transforms dropped the `cn-*` hook classes in three places (`picker-popup.tsx:101`, `picker-trigger.tsx:47`, `day-range-picker.tsx:248`), so the installed files were not the approved ones. As `registry:file` the CLI writes them as they are; the cost is that the CLI does not rewrite the `@/` imports for a project with other aliases.
- The picker is controlled only (`value` and `onChange` are required), so the proof page passed `value` and `onChange` to `<DatePicker type="date" />` and `<DatePicker type="date" range />`.
- The parts come from the shadcn CLI in a scratch project that carries the tree's `components.json` and `index.css` (the CLI does not run in a folder without its own package.json); the steps are in `registry/README.md`. `rsc` is `false` in the trees' `components.json`, as in the table repository's trees; the aliases are the test application's.
- `.prettierignore` added (not in the owned list): it keeps the CLI-written parts and the hook and `pnpm-lock.yaml` out of `prettier --check`, since these are never edited. ESLint ignores the same folders.
- `index.css` is `app/globals.css` of the test application without its eight `styles/style-*.css` imports, which belong to the test application's design system switch.
- `package.json` already carries the scripts `test`, `storybook` and `storybook:build` of milestone 2 (that milestone owns no `package.json`), and `@tailwindcss/vite`, `@vitejs/plugin-react`, `@types/react`, `@types/react-dom`, `@types/node` besides the 1.7 list, so milestone 2 runs no `pnpm add`. `vite` is `rolldown-vite@7.1.12`, as the table repository pins it.
