# Home demo steps and titles (F45), tracker

Status: merged (6139e4cb)
Branch `v0.8/fix-home-demo`, worktree 02, PR #118
Files owned: `apps/shadcn-table-docs/components/dev-home/v12/signal-demo.tsx`, `apps/shadcn-table-docs/components/dev-home/v12/signal-table.tsx`; `apps/shadcn-table-docs/scripts/page-checks/_helpers.mjs` DEMO_LAST, `apps/shadcn-table-docs/scripts/page-checks/e.mjs` home entry
Depends on: Last fixes (F19, F28, F30, F39, F40, F41, D56, D57)
Checks:
- `pnpm --filter shadcn-table-docs types:check` at 9b9e900b: green
- `pnpm --filter shadcn-table-docs lint` (errors only) at 9b9e900b: green
- `node scripts/check-pages.mjs e --base radix --url http://localhost:5344 /` at 9b9e900b: green (29 passed)
- `node scripts/check-pages.mjs e --base base --url http://localhost:5344 /` at 9b9e900b: green (29 passed)
- `node scripts/check-pages.mjs e --base aria --url http://localhost:5344 /` at 9b9e900b: green (29 passed)
- `pnpm --filter shadcn-table-docs build` at f2842f9b: green, `git status --short` clean (verifier)
- headless Chromium full replay of the home demo, dev server on 5346, 1440x900, at f2842f9b: green, all six steps active in order (Sorting 1.1 s, Search 6.5 s, Editing 11.9 s, Filtering 17.3 s, Column order 24.6 s, View settings 30.0 s), titles match F45 (verifier)
- types:check, lint and check-pages e (radix, base, aria) not rerun: recorded at 9b9e900b, only the tracker and CHANGELOG.md changed since (verifier)

- Milestone 01 fix with play: done (9b9e900b)

## Attention

- Column order step title is "Column order" (owner's word in F45), not "Column reordering" from the story brief; the last step is "Striped rows", not "View settings", since the "Now showing" label already reads "View settings". Change the `title` in `signal-demo.tsx` STEPS and the expected list in `e.mjs` to revert.
- The skip did not reproduce in headless Chromium: the fix covers the mechanisms found in code (below); if the owner still sees a step skipped on 5320, note the width, the theme and whether a key was pressed with focus in the table.

## Notes

- Reproduction, dev server on 5344 at 7fc6473e (Strict Mode on), headless Chromium at 1440x900 and 1280x720, the step list sampled every frame through one full replay: all six steps carried `data-state="active"` in order (Sorting 0.8 s, Search 6.3 s, Editing 11.4 s, Filtering 16.8 s, Column order 24.1 s, View settings 28.4 s), with "Now showing" matching. No index is skipped in code: the hold effect advances by one and `active = i === step && mode === 'playing'` (`signal-demo.tsx:435-443` at 7fc6473e).
- Causes fixed: (1) the beats effect cleanup always called `land()` (`signal-demo.tsx:336-340` at 7fc6473e), so any remount of the effect with the same step (Strict Mode, Fast Refresh while the owner's dev server rebuilds) jumped the step to its final state and cut its interaction; a `Run` object now outlives the effect, a remount resumes the unplayed beats on the run's own clock, and only a real stop (microtask after cleanup with no remount) lands it. (2) Replay or a jump during a step: the old cleanup compared only the step index (`stepRef`), so Replay during step 0 landed step 0 over the restart and skipped its beats; a token bumped on every move replaces it. (3) Column order played one 700 ms beat and held 4.1 s, the shortest step; it now pulses again after the slide, and `MIN_STEP_MS = 5200` floors every step's active time.
- (b) of the brief checked: the replay's `click()` calls dispatch no pointerdown or keydown and are untrusted, so `takeControl` never trips on them; a visitor's key press with focus left on a toolbar button inside the table (the replay focuses the triggers it opens) does stop the replay, by design.
- "Now showing" reads the step's `feature` (unchanged); `_helpers.mjs` DEMO_LAST matches it and needed no change.
- P10: the new home checks run on the shipped code (7fc6473e): `demo: step titles` fails; `demo: every step active in one replay` passes there, as the headless reproduction showed.
