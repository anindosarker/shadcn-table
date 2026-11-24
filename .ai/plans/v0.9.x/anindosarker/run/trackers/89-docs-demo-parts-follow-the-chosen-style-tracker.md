# 89: Docs demo parts follow the chosen style (Q181), tracker

Status: done
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

- Verify: diff scope, `git diff --name-only origin/main...date-picker-docs-demo-parts-style` at c6415d6: pass, 34 files, all under apps/shadcn-date-picker-docs (ui-base, ui-radix, ui-aria parts, eslint.config.mjs ignore of the new part folders, lib/registry-trees.mjs); nothing under packages/, tools/ or vercel.json
- Verify: task greps rerun at c6415d6: pass, 45 of 45 parts in components/ui-<base>/ equal `git show v0.9.8:apps/shadcn-table-docs/components/ui-<base>/<part>.tsx` by cmp; `node lib/registry-trees.mjs` writes components/date-picker and hooks only (23 files per base), no `@/components/ui/` import left, every imported ui-<base> part present (aria imports no calendar)
- Verify: local CI lines at c6415d6 valid (head unchanged since); own fresh clone of the branch in <scratchpad>, `pnpm install --frozen-lockfile` exit 0, `pnpm exec turbo run build` exit 0 (cache miss, real next build)
- Verify: own production read, `next start -p 5345` from the fresh clone, new Playwright context per run, 1440, style set in the theme sheet and base in the header menu, styles luma, nova, vega, lyra on base, radix, aria: pass, 12 of 12; cleared range trigger radii equal on all four corners and equal to the /docs/date box (luma 26, nova 10, vega 8, lyra 0 px), day 15 picked on /docs/date ("2026-11-21" to "2026-11-15"), theme sheet opened, 0 console errors
- Verify: server stopped by pid, browsers closed, scratch deleted, worktree clean at c6415d6: pass

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

- Task 1 Docs demo parts follow the chosen style: done (c6415d6, merged in 3f20d72)

- Merge: 3f20d72, `merge: date-picker-docs-demo-parts-style (89)` on main of anindosarker/shadcn-date-picker (origin/main 0d62301 was an ancestor of the branch, no catch-up merge)
- Check: production deployment of 3f20d72, commit status Vercel: success
- Check: CI run of 3f20d72: completed, success
- Check: live read https://date-picker.shadcn-table.com/ at 3f20d72, fresh Playwright context: 200, 0 console errors
- Check: live read https://date-picker.shadcn-table.com/docs/install at 3f20d72: 200, 0 console errors
- Check: live read https://date-picker.shadcn-table.com/docs/date at 3f20d72: 200, 0 console errors
- Check: live read https://date-picker.shadcn-table.com/storybook/base/ at 3f20d72: 200, 0 console errors
- Check: live read https://date-picker.shadcn-table.com/storybook/radix/ at 3f20d72: 200, 0 console errors
- Check: live read https://date-picker.shadcn-table.com/storybook/aria/ at 3f20d72: 200, 0 console errors
- Check: live read https://date-picker.shadcn-table.com/version.txt at 3f20d72: 200, "0.1.1"
- Check: live read https://date-picker.shadcn-table.com/docs/ranges at 3f20d72, style set in the theme sheet, base in the header menu, range cleared: luma 26/26/26/26 px on Base UI, Radix UI and React Aria; vega 8/8/8/8 px on all three; 0 console errors: pass
- Check: branch date-picker-docs-demo-parts-style deleted on origin and locally, worktree removed, `git status --short` on main empty: pass
