# 03: header, column menu and dragging, tracker

Status: done
Branch `v0.8/header-menu-drag`, worktree 02, PR #99
Gates:
- `pnpm tsc:radix`, `tsc:baseui`, `tsc:aria`, `pnpm lint`, `pnpm check:tailwind`, `pnpm check:bases` at a86805e0: green
- `pnpm tsc:radix`, `tsc:baseui`, `tsc:aria`, `pnpm lint`, `pnpm check:tailwind`, `pnpm check:bases` at 2cfe9cf5: green
- `pnpm test:base`, `test:radix`, `test:aria` at f63f34fb, with `stories/fixed-bugs/MenuOpeners.stories.tsx` and `MenuFocusReturn.stories.tsx` excluded (the other 71 files passed as explicit paths; vitest `--exclude` does not reach the storybook project): 471 passed, 2 red per base, `Selection Enabled` and `Portals Read Context` (see Attention)
- `pnpm tsc:radix`, `tsc:baseui`, `tsc:aria`, `pnpm lint`, `pnpm check:tailwind`, `pnpm check:icons`, `pnpm check:bases`, `node reference/01-check.mjs`, `pnpm registry:build`, `lib:install` per base at f63f34fb: green
- `pnpm storybook:build:radix` at f63f34fb: green

- Milestone 01 header, menu and handle: done (a86805e0)
- Milestone 02 drag, flip, locked: done (2cfe9cf5)
- Milestone 03 stories, captures, judges: done (4c758da1)
- Milestone 04 cleanup and gates once: done (f63f34fb)

## Attention

- No `Claude-Session:` line reached this builder from the harness, so the spec 03 commits and the PR carry no attribution line.
- The column menu groups follow the reference capture (`01-column-menu-*.png`, demo `column-header.tsx`): sort and filter items share the first group, pin, reset size, group by and Fixed position the second, Hide the third; the spec text puts a separator between sort and filter and Fixed position beside Hide.
- `Selection Enabled` (`stories/features/Selection.stories.tsx`, spec 05's file) is red: it asserts the select-all control's top on the th's padding-top line; the D2 header has `p-0` and a centred 40 px row, so the control sits 9.5 px down, level with the label text line (10 px). Spec 05 should assert against the label's line instead.
- `Portals Read Context` (`stories/features/TableProvider.stories.tsx`) is red: it expects the old menu text `Sort by First Name ascending`; the D5 menu says `Sort ascending`. Spec 03 1.6.8 asks this spec to fix it, but the Run plan gives the file to workstream A (spec 02), so it is left untouched per P5; a one-line change to `/^Sort ascending$/` fixes it, by spec 02 or at merge.

## Notes

Captures: /private/tmp/claude-501/-Users-anindosarker-Work-Personal-React-table/252fd84e-2c81-46e1-b175-d3dcca5f3984/scratchpad/captures/03/<base>-<view>-<theme>.png for base radix, base, aria; view rest, menu, drag; theme light, dark (18 files)
Captures: rest against `reference/01-default-*.png`, menu (Status) against `reference/01-column-menu-*.png`, drag (Assignee over Project) against `reference/01-drag-*.png`
- The drag captures still show the old body feedback (faded dragged column, dashed hovered column): `getCommonSRTCellStyles` in `style.utils.ts` is spec 02's file and spec 02 removes that rule (1.6.7); the header preview, gap and faded dashed dragged header are this spec's and match the reference.
