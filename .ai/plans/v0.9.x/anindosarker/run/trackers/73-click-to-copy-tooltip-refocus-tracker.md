# 73: Click-to-copy tooltip on refocus, tracker

Status: running
Branch `v0.9/click-to-copy-tooltip-refocus`, worktree 06
Checks:
- eslint + prettier on `stories/features/ClickToCopy.stories.tsx`, `pnpm tsc:radix` at 23da8782: pass
- Red run before the fix (P11), `ST_BASE=radix pnpm exec vitest run stories/features/ClickToCopy.stories.tsx` at 23da8782: fail on `Tooltip Returns On Quick Refocus` alone (`expected [] to include 'Click to copy'` at the final default wait), 5 other plays pass
- Same command, `ST_BASE=base` at 23da8782: 6 of 6 pass; base left unchanged
- Same command, `ST_BASE=aria` at 23da8782: 6 of 6 pass; aria left unchanged
- Spec 1.6.2 fix on radix (`onFocus` and `onPointerMove` on the `TooltipTrigger` call `preventDefault()` when the target's closest `button` is inside the trigger), uncommitted: eslint, prettier, `pnpm tsc:radix` pass; radix story file run: still fails on `Tooltip Returns On Quick Refocus`, 5 others pass
- Experiment, uncommitted: radix `ST_OverflowText` forced to its `wrap` branch (plain span, no overflow tooltip at all), radix run of the play: still fails (`expected [] to include 'Click to copy'`)

- Task 1 The play, run before the fix: done (23da8782)
- Task 2 The fix, docs copies, changelog: blocked, the spec's fix does not fix the play (see Attention); nothing committed

## Attention
- Spec 73 premise is wrong: on Radix the play fails with no overflow tooltip in the cell at all, so the `ST_OverflowText` event rule (D151, spec 1.6.2) cannot fix it. The fix was tried, did not turn the play green, and is not committed (diff kept at /private/tmp/claude-501/-Users-anindosarker-Work-Personal-React-table/b88680e6-61ee-425c-a2f8-8a0c282e1cc1/scratchpad/spec73-overflow-fix.diff).
- What the Radix source shows instead (radix-ui 1.8.1, `@radix-ui/react-tooltip/dist/index.mjs` and `@radix-ui/react-use-controllable-state@1.3.0`): the copy tooltip (`ST_Tooltip`, uncontrolled) calls `setOpen(true)` on focus; the uncontrolled `onChange` runs in a `useEffect` after the render and dispatches `tooltip.open` on `document` (tooltip line 101); every mounted `TooltipContentImpl` closes on that event (line 317). During the exit animation the copy tooltip's own content is still mounted by `Presence` with its listener attached, so its own open request closes itself. On a fresh open the content mounts through the Portal one pass later, after the dispatch, which is why the first focus works.
- The fix therefore sits in the copy tooltip (`ST_Tooltip` on radix, or upstream Radix), which spec 73 forbids touching ("does NOT change ST_Tooltip, ST_CopyButton or ST_TableBodyCell"). Needs a new decision on where the fix goes; the red play `Tooltip Returns On Quick Refocus` is committed on the branch (23da8782) and the branch must not merge while it is red on radix.
