# 74: Example toolbar on a phone, tracker

Status: running
Branch `v0.9/example-toolbar-phone`, worktree 07
Checks:
- Red: docs-e2e, `pnpm test docs-e2e --base base --url <next start of 408e4287 app code> /docs/examples/basic /docs/examples/more/styling-theming--custom-dark-theme /docs/guides/pagination` at 000f55d7 (checks only): fail, the only 7 fails of 117: `FAIL /docs/examples/basic phone toolbar: two rows Previous select Next / Preview Code Both Base / Storybook Copy prompt More actions Toggle full screen`, `FAIL /docs/examples/basic phone toolbar: More menu Copy install command,---,Open in GitHub,Open in StackBlitz,Open in CodeSandbox | header: Storybook,Copy prompt,Toggle full screen`, `FAIL /docs/examples/basic phone toolbar: Fullscreen entry on=false exit=false off=true`, the same three on `/docs/examples/more/styling-theming--custom-dark-theme` (story page, menu without Copy prompt and install), `FAIL /docs/guides/pagination phone toolbar: guide panel Remote Data Fetching Example / Preview Code Both Base / Storybook Copy prompt More actions Toggle full screen`; `PASS toolbar: desktop unchanged at 1440` and `PASS toolbar: desktop unchanged at 768` on `/docs/examples/basic`
- Capture: before, 390 wide `/docs/examples/basic` on 408e4287 app code: reference/q145-before-390.png (three rows: steps and name; view modes and base; Storybook, Copy prompt, arrow, full screen)
- Check: docs-e2e short form, `pnpm test docs-e2e --base base --url <next start of the 8e42da3a app build> /docs/examples/basic /docs/examples/more/styling-theming--custom-dark-theme /docs/guides/pagination` at 8e42da3a: pass, 117 checks, 0 failed; the 7 red lines now pass, `toolbar: desktop unchanged` at 1440 and 768 still passes with the same row signatures
- Check: docs-e2e, `pnpm test docs-e2e --base base` at 8e42da3a: pass, 2654 checks, 0 failed (5 sections, 117 pages); `phone toolbar: two rows`, `phone toolbar: More menu`, `phone toolbar: Fullscreen entry` on `/docs/examples/basic` and `/docs/examples/more/styling-theming--custom-dark-theme`, `phone toolbar: guide panel` on `/docs/guides/pagination`, `toolbar: desktop unchanged at 1440` and `at 768` on `/docs/examples/basic` in the passed list
- Check: viewport grep, `grep -c -E 'matchMedia|innerWidth|resize'` on example-playground.tsx and example-switcher.tsx at 8e42da3a: 0 and 0, origin/claude/review 0 and 0
- Check: typecheck, `pnpm test typecheck --base radix` at 8e42da3a: pass, tsc clean
- Check: lint, `pnpm test lint` at 8e42da3a: pass, 9 warnings (docs examples, none in this milestone's files)
- Check: changelog, `grep -c '^#### Spec 74' CHANGELOG.md` at 304c8161: 1
- Check: validate-repo, `pnpm test validate-repo` at 304c8161: pass, 43 unit tests, registry fresh, worktree clean after
- Capture: after, 390 wide `/docs/examples/basic` at 8e42da3a: reference/q145-after-390.png, reference/q145-after-390-menu.png
- Compare q145-after-390.png with variant A: matches, row 1 previous, the name select filling the space to next, next at the right edge; row 2 Preview, Code, Both, Base UI and the `...` More button at the right end; differs, the name is centred in a dashed box as the docs chrome draws every group, and the More button sits in its own bordered box
- Compare q145-after-390-menu.png with variant A: matches, the menu opens from More aligned to the right edge with Open in Storybook, Copy prompt, Copy install command, Fullscreen in that order; differs, each entry has its icon and after a separator follow Open in GitHub and the two "soon" entries (spec 1.2), which variant A does not draw
- Looked at (not committed): 768 and 1440 `/docs/examples/basic` unchanged from before (768 keeps its three wrapped rows, 1440 one row); the guide panel of `/docs/guides/pagination` at 390, row 1 the example link, row 2 as on the example page, menu opens; the story page `/docs/examples/more/styling-theming--custom-dark-theme` at 390, two rows, menu Open in Storybook, Fullscreen, then the open-in entries
- Not run here (builder): docs-e2e radix and aria (verifier)

- Task 1 The checks of 1.6.3, red, and the before capture: 000f55d7
- Task 2 The layout and the menu: 8e42da3a
- Task 3 The after captures, the comparison and the changelog block: 304c8161

## Attention

## Notes
