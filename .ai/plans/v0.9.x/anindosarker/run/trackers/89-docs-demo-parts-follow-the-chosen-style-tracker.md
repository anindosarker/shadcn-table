# 89: Docs demo parts follow the chosen style (Q181), tracker

Status: running
Branch `date-picker-docs-demo-parts-style` (anindosarker/shadcn-date-picker, from main 0d62301), worktree ~/Work/Personal/React-table/shadcn-date-picker.worktrees/date-picker-docs-demo-parts-style
Checks:
- Check: reproduce, unfixed production build of main 0d62301, fresh Playwright context, /docs/ranges cleared, luma: empty range trigger radii TL/TR/BR/BL 10/26/26/10 px on base, radix and aria; single date box of /docs/date 10/10/10/10: reproduced
- Check: parts byte for byte, `git show v0.9.8:apps/shadcn-table-docs/components/ui-<base>/<part>.tsx | cmp - <docs part>` at c6415d6: pass, 38 equal. ui-base added: badge, button, button-group, calendar, dialog, field, input-group, native-select, popover, input, label, separator, textarea. ui-radix added: badge, button-group, calendar, field, label, native-select, separator; kept (already equal): button, dialog, input-group, popover, input, textarea. ui-aria added: badge, button, button-group, dialog, field, input-group, native-select, popover, input, label, separator, textarea (the aria tree imports no calendar)
- Check: trees import, `node lib/registry-trees.mjs` at c6415d6: pass, registry/<base> holds components/date-picker and hooks only, every `@/components/ui/` import reads `@/components/ui-<base>/`
- Check: docs types:check, `pnpm types:check` (apps/shadcn-date-picker-docs, one tsconfig for all three bases) at c6415d6: pass
- Check: docs lint, `pnpm lint` (apps/shadcn-date-picker-docs) at c6415d6: pass
- Check: docs build, `pnpm build` (apps/shadcn-date-picker-docs) at c6415d6: pass
- Check: production read, `next start -p 5341` at c6415d6, fresh Playwright context per run, 1440, dark, /docs/ranges range demo cleared, radii TL/TR/BR/BL against the /docs/date single box: pass, 24 of 24 equal and matching (table below)
- Check: picker opens and takes a day, /docs/date box button, day 15, at c6415d6: pass on base, radix, aria, every style ("2026-11-21" to "2026-11-15"); base switch confirmed by the popup (Base UI popup, Radix popper wrapper, React Aria data-rac)
- Check: captures, q181-fixed-<base>-<luma|vega|nova>.png, 9 files in reference/q149-calendar-library/docs-site/q181/: pass
- Check: Local CI at c6415d6, one at a time: `pnpm install --frozen-lockfile` pass, `pnpm lint` pass, `pnpm typecheck` pass, `pnpm registry:check` pass, `pnpm test` pass (39 of 39 per base, three bases), `pnpm --filter shadcn-date-picker-docs lint` pass, `pnpm --filter shadcn-date-picker-docs types:check` pass, `pnpm --filter shadcn-date-picker-docs build` pass
- Check: fresh clone of the branch in <scratchpad>, `pnpm install --frozen-lockfile` then `pnpm exec turbo run build` at c6415d6: pass, exit 0

| Style | base trigger / box | radix trigger / box | aria trigger / box |
|---|---|---|---|
| vega | 8 / 8 | 8 / 8 | 8 / 8 |
| nova | 10 / 10 | 10 / 10 | 10 / 10 |
| maia | 26 / 26 | 26 / 26 | 26 / 26 |
| lyra | 0 / 0 | 0 / 0 | 0 / 0 |
| mira | 8 / 8 | 8 / 8 | 8 / 8 |
| luma | 26 / 26 | 26 / 26 | 26 / 26 |
| sera | 0 / 0 | 0 / 0 | 0 / 0 |
| rhea | 18 / 18 | 18 / 18 | 18 / 18 |

Px, all four corners equal in every cell.

- Task 1 Docs demo parts follow the chosen style: running (c6415d6, not merged)
