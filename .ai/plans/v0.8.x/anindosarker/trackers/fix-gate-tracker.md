# Check fixes (F8, F9), tracker

Status: merged (7e1a96b7)
Branch `claude/review` (inline, main checkout), no PR; `dev` fast-forwarded to 7e1a96b7
Files owned: `components/table/ST_ScrollButtons.tsx` in the three bases; `components/buttons/ST_Tooltip.tsx` in aria; `packages/shadcn-table/.storybook/vitest.setup.ts`; `stories/styling/DefaultLook.stories.tsx`
Depends on: 06
Checks:
- `pnpm tsc:radix` at 7e1a96b7: green
- `pnpm tsc:baseui` at 7e1a96b7: green
- `pnpm tsc:aria` at 7e1a96b7: green
- `pnpm lint` at 7e1a96b7: green
- `pnpm check:tailwind` at 7e1a96b7: green
- `pnpm -w check:bases` at 7e1a96b7: green
- `pnpm check:aria-warnings --url http://localhost:5345` (aria Storybook dev on 5345, 6008 untouched) at 7e1a96b7: green (0 React Aria warnings)
- `pnpm test:aria` at 7e1a96b7: green (76 files, 519 tests)
- `pnpm test:radix` at 7e1a96b7: green (76 files, 519 tests)
- `pnpm test:base` at 7e1a96b7: green (76 files, 519 tests)

- Milestone 01 F8 scroll chevron press: done (61349a41)
- Milestone 02 F9 aria Focusable warnings: done (aa627d95)
- Milestone 03 Registry rebuild and lib:install radix, base, aria: done (7e1a96b7)

## Attention

- F9 root cause differs from the finding's guess: the warnings come from the Row Actions tooltip buttons on rows that mount while a modal editor popover has set `inert` outside it; aria `ST_Tooltip` now uses React Aria's `TooltipTrigger` directly for a shadcn Button (no `<Focusable>` wrapper), other children keep the shadcn part.
- F8 proof needs trusted input: `.storybook/vitest.setup.ts` exposes `vitest/browser`'s `userEvent` as `globalThis.stBrowserUserEvent`; the ScrollCues play uses it under Vitest and falls back to `element.click()` in the Storybook UI.

## Notes

- F8 before the fix: ScrollCues (radix) failed, Playwright reported the Project column menu button intercepting the click at the chevron's centre; after: passed.
- F9 before the fix (DefaultLook story, aria): 18 warnings on choosing a sort column, 15 on typing in the filter chip editor, all on `Row Actions` buttons with `tabindex=0` inside an inert ancestor; after: 0. FilterChips and SortPopover stories with a console listener: 0 before and after (their tables have no row actions).
