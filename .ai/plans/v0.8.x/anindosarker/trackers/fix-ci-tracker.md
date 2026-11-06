# CI fixes after S6, S7, tracker

Status: merged (4e5bf777)
Branch `v0.8/fix-ci`, worktree 01, PR #108
Files owned: `packages/shadcn-table/.storybook/vitest.setup.ts`, `packages/shadcn-table/vitest.config.ts`
Depends on: 06.1
Gates:
- `ST_BASE=radix vitest run --browser.api.port=5341` at 39d409b8: green (537)
- `ST_BASE=base vitest run --browser.api.port=5341` at 39d409b8: green (537); the first run failed `PanelCollapse > Progress And Banner Collapse` line 67 at load average 17 (other agents), passed alone and on the full rerun
- `ST_BASE=aria vitest run --browser.api.port=5341` at 39d409b8: green (537)
- `pnpm tsc:radix`, `pnpm tsc:baseui`, `pnpm tsc:aria` at 39d409b8: green
- `pnpm lint` (shadcn-table) at 39d409b8: green
- `pnpm check:bases` at 39d409b8: green
- CI run 41863766371 at 39d409b8: test radix, base, aria green (all three plays pass); `release impact` red on the label (see Attention); `pages (aria)` cancelled by the runner, rerun on the next push's run
- `pnpm check:tailwind` at 72889ca1 (verifier): green (0 not canonical or physical in all three bases)
- Verifier: tsc per base, lint, check:bases, full test:<base> not rerun; `git diff --name-only 39d409b8..72889ca1` touches only this tracker
- CI run https://github.com/anindosarker/shadcn-table/actions/runs/41866959330 at 72889ca1: every job green (library x3, test x3 with 537/537 each, pages x3, docs, registry, bases, install x5); the three plays `Portals Read Context`, `Select Filter And Group Value`, `Header Editor With Custom Toolbar` pass on radix, base and aria; `release impact` red only because the run's event carried `release:minor`
- Label run https://github.com/anindosarker/shadcn-table/actions/runs/41867045211 after the switch to `release:skip`: `release impact` green

- Milestone 01 Reset the real pointer between plays: done (39d409b8)

## Attention

- The PR carried `release:minor` as the task said, but the change ships nothing (test harness only, no CHANGELOG line); the `release impact` check asks for a CHANGELOG line under any non-skip label. The verifier switched the label to `release:skip` (label run 41867045211 green). Revert to `release:minor` only together with a CHANGELOG line.
- `tsc -p tsconfig.stories.json` (not a gate, not run by CI) reports two errors on `claude/review` already: `HeaderGroups.stories.tsx:295` (`ColumnPinningState` without `end`) and `ViewSettings.stories.tsx:293` (partial `ST_ViewSettingsState`). Left alone.

## Notes

- Cause of all three: Vitest runs test files one after another in the same Playwright page, and a play that uses the real pointer (`stBrowserUserEvent`: `styling/DefaultLook` Scroll Cues, `fixed-bugs/FilterPopover`) leaves it over the next file's story. Chromium hit-tests that pointer again on layout changes and sends real pointer events to the element under it. Not a library or 06.1 regression: CI's file order (no local results cache, 4 cores) puts those files before the failing ones, the local order did not.
- Failure 1, aria `TableProvider > Portals Read Context` (`Unable to find an element with the text: Density: Comfortable`): React Aria's `useHover` ends the synthetic hover on the density button when a real `pointerover` lands elsewhere, so the tooltip never opens. Reproduced: `ST_BASE=aria vitest run --no-file-parallelism stories/styling/DefaultLook.stories.tsx stories/fixed-bugs/AriaTooltips.stories.tsx stories/features/TableProvider.stories.tsx` fails the same way; passes with the fix.
- Failure 3, radix `FilterChips > Header Editor With Custom Toolbar` (`expected <body> to be <input>`, focus not on the editor input): reproduced with `ST_BASE=radix vitest run --no-file-parallelism stories/styling/DefaultLook.stories.tsx stories/features/FilterChips.stories.tsx`; passes with the fix.
- Failure 2, aria `AriaTooltips > Select Filter And Group Value` (`Expected Toggle select row, Received Toggle select all`): not reproduced locally (the parked pointer lands elsewhere with macOS fonts). The select-all tooltip can open only from a real hover or keyboard focus, and the play touches neither before line 72, so the same leak is the cause; CI run 41863766371 passes it with the fix.
- Fix: `resetPointer` browser command in `packages/shadcn-table/vitest.config.ts` (`page.mouse.move(-1, -1)`), called from an `afterEach` in `packages/shadcn-table/.storybook/vitest.setup.ts`. No play and no library file changed, so no CHANGELOG line and no registry build.
