# 01: shared surface, tracker

Status: running
Branch `v0.8/shared-surface`, worktree 01, PR #97
Gates:
- `pnpm tsc:radix`, `tsc:baseui`, `tsc:aria` after the lucide-react bump at 016a792f: green

- Milestone 01 dependency, captures and changelog: done (92cfca14)
- Milestone 02 types, options, slices, helpers, icons, strings: running
- Milestone 03 cleanup and gates once: planned

## Attention

## Notes

- lucide-react `^1.64.0` resolves to 1.67.0; no alias in `icons.ts` was renamed (tsc green in all three bases without an edit).
- Captures: agent-browser at 1800 by 1150, theme by `set media light|dark` (the demo follows the system theme). The demo already overflows at 1800, so `scroll-cues` keeps that width, scrolls the box 400 px and hovers the body so both chevrons and edge shadows show.
- `chips`: Status: Done plus Priority: High with the Priority editor open; in dark it opened from the + Filter pill, in light from the toolbar filter popover (Back to columns, Priority). In light the demo blanked the whole document (body emptied, no console error) when the + Filter pill was clicked a second time, repeatably.
