# CI fixes after S6, S7, tracker

Status: running
Branch `v0.8/fix-ci`, worktree 01, PR #108
Gates:
- `ST_BASE=radix vitest run --browser.api.port=5341` at 39d409b8: green (537)
- `ST_BASE=base vitest run --browser.api.port=5341` at 39d409b8: green (537); the first run failed `PanelCollapse > Progress And Banner Collapse` line 67 at load average 17 (other agents), passed alone and on the full rerun
- `ST_BASE=aria vitest run --browser.api.port=5341` at 39d409b8: green (537)
- `pnpm tsc:radix`, `pnpm tsc:baseui`, `pnpm tsc:aria` at 39d409b8: green
- `pnpm lint` (shadcn-table) at 39d409b8: green
- `pnpm check:bases` at 39d409b8: green
- CI run 41863766371: pending

- Milestone 01 Reset the real pointer between plays: running

## Attention

- The PR carries `release:minor` as the task said, but the change ships nothing (test harness only, no CHANGELOG line); the `release impact` check asks for a CHANGELOG line under any non-skip label. `release:skip` fits this PR.
- `tsc -p tsconfig.stories.json` (not a gate, not run by CI) reports two errors on `claude/review` already: `HeaderGroups.stories.tsx:295` (`ColumnPinningState` without `end`) and `ViewSettings.stories.tsx:293` (partial `ST_ViewSettingsState`). Left alone.

## Notes

- Cause of all three: Vitest runs test files one after another in the same Playwright page, and a play that uses the real pointer (`stBrowserUserEvent`: `styling/DefaultLook` Scroll Cues, `fixed-bugs/FilterPopover`) leaves it over the next file's story. Chromium hit-tests that pointer again on layout changes and sends real pointer events to the element under it. Not a library or 06.1 regression: CI's file order (no local results cache, 4 cores) puts those files before the failing ones, the local order did not.
- Failure 1, aria `TableProvider > Portals Read Context` (`Unable to find an element with the text: Density: Comfortable`): React Aria's `useHover` ends the synthetic hover on the density button when a real `pointerover` lands elsewhere, so the tooltip never opens. Reproduced: `ST_BASE=aria vitest run --no-file-parallelism stories/styling/DefaultLook.stories.tsx stories/fixed-bugs/AriaTooltips.stories.tsx stories/features/TableProvider.stories.tsx` fails the same way; passes with the fix.
- Failure 3, radix `FilterChips > Header Editor With Custom Toolbar` (`expected <body> to be <input>`, focus not on the editor input): reproduced with `ST_BASE=radix vitest run --no-file-parallelism stories/styling/DefaultLook.stories.tsx stories/features/FilterChips.stories.tsx`; passes with the fix.
- Failure 2, aria `AriaTooltips > Select Filter And Group Value` (`Expected Toggle select row, Received Toggle select all`): not reproduced locally (the parked pointer lands elsewhere with macOS fonts). The select-all tooltip can open only from a real hover or keyboard focus, and the play touches neither before line 72, so the same leak is the cause; the CI run on this PR is the proof.
- Fix: `resetPointer` browser command in `packages/shadcn-table/vitest.config.ts` (`page.mouse.move(-1, -1)`), called from an `afterEach` in `packages/shadcn-table/.storybook/vitest.setup.ts`. No play and no library file changed, so no CHANGELOG line and no registry build.
