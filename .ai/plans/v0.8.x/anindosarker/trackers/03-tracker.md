# 03: header, column menu and dragging, tracker

Status: running
Branch `v0.8/header-menu-drag`, worktree 02, PR #99
Gates:
- `pnpm tsc:radix`, `tsc:baseui`, `tsc:aria`, `pnpm lint`, `pnpm check:tailwind`, `pnpm check:bases` at a86805e0: green
- `pnpm tsc:radix`, `tsc:baseui`, `tsc:aria`, `pnpm lint`, `pnpm check:tailwind`, `pnpm check:bases` at 2cfe9cf5: green

- Milestone 01 header, menu and handle: done (a86805e0)
- Milestone 02 drag, flip, locked: done (2cfe9cf5)
- Milestone 03 stories, captures, judges: running
- Milestone 04 cleanup and gates once: planned

## Attention

- No `Claude-Session:` line reached this builder from the harness, so the spec 03 commits and the PR carry no attribution line.
- The column menu groups follow the reference capture (`01-column-menu-*.png`, demo `column-header.tsx`): sort and filter items share the first group, pin, reset size, group by and Fixed position the second, Hide the third; the spec text puts a separator between sort and filter and Fixed position beside Hide.

## Notes
