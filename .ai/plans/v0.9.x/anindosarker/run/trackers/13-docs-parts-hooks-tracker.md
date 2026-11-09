# 13: Docs parts carry the design-system hooks, tracker

Status: merged (6cef142dc733e8ff62ed1695497187b4897c63ff)
Branch `v0.9/docs-parts-hooks`, worktree 06
Checks:
- `pnpm test docs-e2e --base base /docs/guides/view-settings`, checks at b47f9afc on the shipped parts (P11): red as expected: `style changes menus` FAIL (item padding 4px 32px 4px 6px, gap 6px, unchanged after Sera), `menu color inverts` FAIL (dark=false); `menu accent bold` PASS (see Attention)
- `grep -L "cn-" apps/shadcn-table-docs/components/ui-<base>/*.tsx` at 4fdf49d3: lists only collapsible, separator, spinner for radix, base and aria
- `pnpm --filter shadcn-table-docs types:check` at 4fdf49d3: pass
- `pnpm test typecheck --base radix`, `--base base`, `--base aria` at 4fdf49d3: pass (tsc clean)
- `pnpm test docs-e2e --base base` at 4fdf49d3: first run FAIL 1 (getting-started `/` "theme: Shift+R returns to the default", timing under load; passed twice alone on `/`), rerun pass (4 sections, 107 pages, all three theme-part checks green)
- `pnpm test lint` at 4fdf49d3 plus the changelog: pass (9 warnings, pre-existing, examples/*/advanced and expanding-tree-flat-parse)
- `pnpm test validate-repo` at 4fdf49d3 plus the changelog: pass (registry and public/r untouched)
- Verifier at bc026a10: every 2.2 check and the 1.2 Acceptance lines are recorded at 4fdf49d3 (P11 red at b47f9afc); `git diff --name-only 4fdf49d3..bc026a10` touches only the tracker and CHANGELOG.md, so none is rerun; all green, CI is the second run

- Task 1 Reproduce: done (b47f9afc)
- Task 2 Installer phase 2: done (4fdf49d3)
- Task 3 Export gaps: done, none (exports of every part match; no installer change) (4fdf49d3)
- Task 4 Cleanup: done (5a66f4cc)

## Attention

- `menu accent bold` passes on the shipped parts: Menu Accent is a token swap (`--accent` = `--primary`, config.ts:411) that `focus:bg-accent` already consumes without any hook, so it cannot be red there (P11). Kept as a guard. The spec's `style changes menus` measure (content border-radius and box-shadow) also passed on the shipped parts, because a Style pick sets `--radius` too; the check reads the first item's padding and gap instead (set only by the `.cn-*` layer).
- Upstream at the pinned sha imports `cn` from `"cn"` (not `@/registry/bases/<b>/lib/utils` as 1.6.2 says) and renders icons through `IconPlaceholder` from `@/app/(create)/...`; phase 2 keeps the `cn` module phase 1 used and turns each IconPlaceholder into its Lucide icon (the CLI's icon transform, done in the installer). Every part is prettier-formatted, so collapsible, separator and spinner change too (formatting only), unlike 1.6.1's diff-stat line.
- New flake candidate for P5: getting-started `/` "theme: Shift+R returns to the default" failed once under load in the full suite (200 ms wait after the key), passed on rerun.
