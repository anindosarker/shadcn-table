# 04: Theme customizer, tracker

Status: done
Branch `v0.9/theme-customizer`, worktree 03
Checks:
- Check: red, `pnpm test docs-e2e --base base /` at 546bcabd (shipped code plus the new checks): fail as expected, 7 failed: default look (no design system style element), stale choice (entry not removed), panel (no Customize theme button), r, p, Shift+R (no shortcut), token edit (no panel)
- Check: install, `pnpm install --frozen-lockfile` after the hotkeys add (Task 2): pass
- Check: parts, `pnpm add-part radix --all` then `git status --short` (Task 2): pass, nothing beyond the new sheet
- Check: `pnpm --filter shadcn-table-docs types:check` at 73c60884 plus the Task 4 working tree (Task 3): pass
- Check: `pnpm --filter shadcn-table-docs lint` at 73c60884 plus the Task 4 working tree (Task 3): pass, 0 errors (9 warnings in examples, unchanged)
- Check: `pnpm test typecheck --base radix` at c1b56e57 (Task 4): pass, tsc clean
- Check: `pnpm test docs-e2e --base base /` at c1b56e57 (Task 4): pass, 63 passed, 0 failed (all seven theme checks green)
- Check: grep `theme-presets|data-theme|applyThemePreset` in apps/shadcn-table-docs at 2cff5076 (Task 5): pass, comments only (tweakcn Apache header in color-presets.ts, v12.css CSS comment, demo-themes.ts doc comment)
- Check: `pnpm format` at 2cff5076 (Task 5): pass, no file changed
- Check: `pnpm test typecheck --base radix` at 2cff5076 (Task 5): pass, tsc clean
- Check: `pnpm test lint` at 2cff5076 (Task 5): pass, 0 errors (9 warnings in examples, unchanged)
- Check: `pnpm test validate-repo` at 2cff5076 (Task 5): pass, 27 unit tests, registry valid
- Check: `pnpm test docs-e2e --base base` at 2cff5076 (Task 5): pass, getting-started 189, api 109, guides 689, examples 936, 0 failed
- Check: `pnpm lib:install radix|base|aria` with `sheet` in `EXTRA_PARTS`, then `git status --short` (fix round): pass, only `components/ui-<base>/sheet.tsx` written (the hand-placed radix copy replaced by the installer's)
- Check: `pnpm format` at e62b5262 (fix round): pass, no file changed
- Check: `pnpm test typecheck --base radix`, `--base base`, `--base aria` at e62b5262 (fix round): pass, tsc clean on all three
- Check: `pnpm --filter shadcn-table-docs types:check` at e62b5262 (fix round): pass
- Check: `pnpm test lint` at e62b5262 (fix round): pass, 0 errors (9 warnings in examples, unchanged)
- Check: `pnpm test validate-repo` at e62b5262 (fix round): pass, 27 unit tests, registry valid
- Check: `pnpm test docs-e2e --base base` at e62b5262 (fix round): pass, 1923 checks on 107 pages (getting-started, api, guides, examples 936), 0 failed
- Check: verifier, 2.2 checks not rerun: all recorded at e62b5262, and `git diff --name-only e62b5262..e62f30c7` touches only .ai/
- Check: Acceptance rerun, `pnpm test docs-e2e --base base /` at e62f30c7 (verifier): pass, 63 passed, 0 failed (all seven theme checks green)
- Check: Acceptance rerun, `pnpm test typecheck --base radix` at e62f30c7 (verifier): pass, tsc clean
- Check: Acceptance rerun, `pnpm test lint` at e62f30c7 (verifier): pass, 0 errors (9 warnings in examples, unchanged)
- Check: Acceptance rerun, `pnpm test validate-repo` at e62f30c7 (verifier): pass, 27 unit tests, registry valid

- Task 1 Reproduce (docs E2E theme checks red on the shipped code): done, fb2aa071
- Task 2 Dependencies (react-hotkeys, sheet part): done, 8d0670db
- Task 3 Core and provider: done, 73c60884
- Task 4 Panel, controls, layout, demo: done, c1b56e57
- Task 5 Cleanup: done, 2cff5076
- Review fixes: done, 17d7daf7 to e62b5262 (sheet through the installer, Reset kbd hint, hotkeys guard, data-icon, observer invariant comment, e2e reset, cn import)

## Attention

- The sheet part sits in the docs only: it is in `EXTRA_PARTS` of `apps/shadcn-table-docs/lib/install.mjs` (as alert-dialog is), so `pnpm lib:install <base>` writes `components/ui-<base>/sheet.tsx` for every base; the registry gains no unused part. The first cut hand-placed a radix copy, replaced in the fix round. Revert: keep it in the registry too (then base and aria need it as well).
- `@tanstack/react-hotkeys` is `^0.22.0`, published 2026-11-02 (beta, six days old at install).
- Menu Color, Menu Accent and Style have no visible effect on the docs menus and primitives: the docs `components/ui-radix/` parts carry no `cn-menu-target` or other `cn-*` hook, so the style layers and the menu provider code match nothing there (1.6.3 does NOT regenerate the primitives). The controls stay; tokens, fonts and radius do apply. Revert: hook the docs parts in a later spec.
- The pre-paint script stays a plain `<script dangerouslySetInnerHTML>` in `app/layout.tsx` (the docs' existing pattern) instead of next-app's `<InlineScript>` component, which the docs do not have; the docs E2E hydration and script-tag checks pass. Revert: port `components/inline-script.tsx`.
- `no-step-3.tsx` reads the current preset from `useDesignSystem()` (the same store the nav panel writes) instead of a MutationObserver on `data-design-system`; every pick, from the panel, a shortcut or the cycle button, updates its label. Revert: observe the attribute as 1.6.7 words it.
- Each valid keystroke in a Colors tab input is one history entry, so undo steps back through a typed value one valid prefix at a time. Revert: record a token edit on blur.
- `components/theme-demo/demo-themes.ts:42` (not owned by spec 04) still names `lib/theme-presets.ts, themes/*.css` in a doc comment; left as is. Revert: reword the comment in a spec that owns the file.

## Notes

- The shipped build computes `--primary` as `lab(...)` (Lightning CSS rewrites oklch in compiled CSS); the design system's inline style element keeps the `oklch(...)` strings the checks compare.
