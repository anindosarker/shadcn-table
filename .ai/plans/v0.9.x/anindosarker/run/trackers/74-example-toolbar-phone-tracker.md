# 74: Example toolbar on a phone, tracker

Status: running
Branch `v0.9/example-toolbar-phone`, worktree 07
Checks:
- Red: docs-e2e, `pnpm test docs-e2e --base base --url <next start of 408e4287 app code> /docs/examples/basic /docs/examples/more/styling-theming--custom-dark-theme /docs/guides/pagination` at 000f55d7 (checks only): fail, the only 7 fails of 117: `FAIL /docs/examples/basic phone toolbar: two rows Previous select Next / Preview Code Both Base / Storybook Copy prompt More actions Toggle full screen`, `FAIL /docs/examples/basic phone toolbar: More menu Copy install command,---,Open in GitHub,Open in StackBlitz,Open in CodeSandbox | header: Storybook,Copy prompt,Toggle full screen`, `FAIL /docs/examples/basic phone toolbar: Fullscreen entry on=false exit=false off=true`, the same three on `/docs/examples/more/styling-theming--custom-dark-theme` (story page, menu without Copy prompt and install), `FAIL /docs/guides/pagination phone toolbar: guide panel Remote Data Fetching Example / Preview Code Both Base / Storybook Copy prompt More actions Toggle full screen`; `PASS toolbar: desktop unchanged at 1440` and `PASS toolbar: desktop unchanged at 768` on `/docs/examples/basic`
- Capture: before, 390 wide `/docs/examples/basic` on 408e4287 app code: reference/q145-before-390.png (three rows: steps and name; view modes and base; Storybook, Copy prompt, arrow, full screen)

- Task 1 The checks of 1.6.3, red, and the before capture: 000f55d7

## Attention

## Notes
