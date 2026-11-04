# 05: defaults and stories, tracker

Status: done
Branch `v0.8/defaults-stories`, worktree 01, PR #101
Gates:
- `tsc:radix`, `tsc:baseui`, `tsc:aria` at e62987b8: green
- `node reference/05-check.mjs` at e62987b8: green
- `pnpm -w check:bases` at e62987b8: green
- `check-pages.mjs --base radix` at 2b0a0506: red, 1683 passed, 3 failed (density-toggle, two chart-detail-panel; Attention 3 and 4)
- `check-pages.mjs --base base` at 2b0a0506: red, same 3
- `check-pages.mjs --base aria` at 2b0a0506: red, same 3
- `test:radix` at 2b0a0506: red, 517 of 519 (`Accessor Key While Loading`, MenuOpeners `Column Actions`; Attention 1 and 2)
- `test:base` at 2b0a0506: red, same 2
- `test:aria` at 2b0a0506: red, `Accessor Key While Loading` and MenuOpeners `Column Actions` (aria-haspopup `true`, fixed in the next commit: MenuOpeners file rerun on aria 4 of 4 green)
- `storybook:build:base`, `storybook:build:radix`, `storybook:build:aria` at 44fab6ff: green
- `tsc:radix`, `tsc:baseui`, `tsc:aria`, `lint`, `check:tailwind`, `check:bases`, `check:icons`, docs `types:check` and `lint`, `05-check.mjs`, `01-check.mjs` at 44fab6ff: green
- `test:radix`, `test:base`, `test:aria` at dcaae068: green, 519 of 519 each (run after the F3 to F6 merge)
- `node reference/05-check.mjs`, `node reference/01-check.mjs`, `pnpm -w check:bases` at dcaae068: green
- `tsc:radix`, `tsc:baseui`, `tsc:aria`, `lint`, `check:tailwind`, `check:icons` at dcaae068: green
- docs `types:check` and `lint` at dcaae068: green (lint 0 errors, 9 existing warnings)
- `check-pages.mjs --base radix`, `--base base`, `--base aria` at dcaae068 (own docs server 5345): green, 1686 passed each, `disable-density-toggle` and both `chart-detail-panel` checks pass
- `storybook:build:radix`, `storybook:build:base`, `storybook:build:aria` at dcaae068: green
- `pnpm format` at dcaae068: no change

- Milestone 01 Flips and seed: done (e62987b8)
- Milestone 02 Stories and docs examples: done (44fab6ff; F3 to F6 merged at dcaae068)
- Milestone 03 Cleanup and gates once: done (dcaae068)

## Attention

## Notes

- F3 to F6 (findings.md), the four component bugs the flipped defaults exposed, are fixed on claude/review (304283b4 overflow tooltip skips skeleton rows, 8c3b06ee chips Filter item keeps editor focus, f607d9b6 `enableDensityToggle: false` hides the density view setting, 811cbd94 grid detail panel fills the cell; registry rebuild e6db62a9) and merged here at dcaae068; the red `test:<base>` and `check-pages` lines at 2b0a0506 are superseded.
- MenuOpeners accepts `aria-haspopup` `menu` or `true` (React Aria's MenuTrigger writes `true`).
- Selection `Selection Enabled` asserts the select-all control centred on the header label line (first child of the th); the row is 39 px plus the 1 px border.
- `RenderCounts`: `Profiled Thousand Rows` budget unchanged (passed in every base); `Row Model Follows State` custom button renamed `Reset filters` (chips add a `Clear filters` button).
