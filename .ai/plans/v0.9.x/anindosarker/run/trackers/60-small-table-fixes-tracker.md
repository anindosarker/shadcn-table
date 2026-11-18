# 60: Sticky header switch and resize grip, tracker

Status: done (099bebd8)
Branch `v0.9/sticky-header-resize-grip`, worktree 06
Checks:

- `ST_BASE=base vitest run` ColumnResizing + StickyHeader stories, c022e0f3 on the pre-fix library: fail as required (P11). `Column Resizing With Pinning`: "firstName: expected 0 to be greater than or equal to 30" (right-half drag on a pinned grip). `Enable Sticky Header`: switch off, `thead` still sticky (expected false, received true)
- `ST_BASE=base vitest run` StickyHeader + ViewSettings stories, b6fda0c8 (switch fixed, grip not yet): `Enable Sticky Header` fails at the right-half drag on unpinned `lastName` with the sticky header on ("expected 0 to be greater than or equal to 30"); `StickyHeaderDisabledDefault` and the View Settings plays pass (16 of 17)
- Hairline probe (throwaway story, not committed), `Features/Column Resizing` default story, base, old handle vs a2902939: hairline x range identical for all six columns (firstName 210.33-211.33 ... phoneNumber 1182-1183), each ending on the cell's right edge
- `ST_BASE=<b> vitest run` StickyHeader + ColumnResizing + ViewSettings stories, a2902939: base, radix, aria each 42 passed (includes DragResizesColumn, ResizeGuidesMeetEdge, DoubleClickResetsWidth, StickyHeaderDisabledDefault, full screen sticky with switch off)
- `grep -rn "enableStickyHeader ||" packages/shadcn-table/registry`, a2902939: nothing
- `pnpm registry:build`, 67bfa573: registry.json unchanged
- `pnpm test typecheck --base base|radix|aria`, 67bfa573: tsc clean on all three
- `pnpm test lint`, 67bfa573: pass
- `pnpm test validate-repo`, 67bfa573: pass
- `pnpm test storybook-tests --base base`, 67bfa573: 652 passed (first run 1 failed, `ClickToCopy` "Click Copies Value", known flake P5; rerun green)
- `pnpm test storybook-tests --base radix`, 67bfa573, verifier: 652 passed (first run 1 failed, `ClickToCopy` "Click Copies Value", known flake P5; rerun green)
- `pnpm test storybook-tests --base aria`, 67bfa573, verifier: 652 passed
- Acceptance (1.2), 67bfa573, verifier: green. storybook-tests base, radix, aria; typecheck base, radix, aria; lint; validate-repo all pass at HEAD; the plays failed on the pre-fix code (c022e0f3, b6fda0c8 above); hairline at the same pixel (probe above). Typecheck, lint, validate-repo and storybook base were recorded at HEAD by the builder, not rerun

- Task 1 Two plays first: c022e0f3
- Task 2 Sticky header switch: b6fda0c8
- Task 3 Resize grip: a2902939
- Task 4 Cleanup: 67bfa573

## Attention

- With row virtualization the table still starts sticky (`useST_TableOptions.ts:162` forces the option, which seeds the switch), but the `Sticky header` switch can now turn it off there too, as D120 says for every table; the container keeps its virtualization height either way.
