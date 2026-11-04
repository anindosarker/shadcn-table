# 05: defaults and stories, tracker

Status: blocked (four component bugs the flipped defaults expose; specs 02 to 04 own the files, P5)
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
- `storybook:build:base`, `storybook:build:radix`, `storybook:build:aria` at the MenuOpeners commit: green
- `tsc:radix`, `tsc:baseui`, `tsc:aria`, `lint`, `check:tailwind`, `check:bases`, `check:icons`, docs `types:check` and `lint`, `05-check.mjs`, `01-check.mjs` at the MenuOpeners commit: green

- Milestone 01 Flips and seed: done (e62987b8)
- Milestone 02 Stories and docs examples: done except the four red items below (2b0a0506 and the MenuOpeners commit)
- Milestone 03 Cleanup and gates once: done, gates above

## Attention

- Blocked: four component bugs surface under the new defaults and keep `test:<base>` and `check-pages` red; each fix is in a component file specs 02 to 04 own, which spec 05 may not edit (1.6.2 "Does NOT change any ... component", P5). Each needs the same change in radix, base and aria; then rerun `test:<base>` and `check-pages.mjs --base <base>` per base.
- 1. `components/body/ST_TableBodyCell.tsx` (spec 02): the overflow tooltip (`enableCellOverflowTooltip`, now on) calls `cell.getValue()` on skeleton rows while `isLoading` or `showSkeletons`, so an `accessorFn` reading nested data throws on the placeholder rows (`fixed-bugs/loading` `Accessor Key While Loading`, all bases). Fix: compute `overflowTooltip` only when `!(isLoading || showSkeletons)`.
- 2. `components/menus/ST_ColumnActionMenu.tsx` (spec 03): in chips mode the menu's Filter item opens the header chip editor, then the trigger branch's `onCloseAutoFocus` hands focus back to the chevron, so the editor input loses focus (MenuOpeners `Column Actions`, radix and base; aria passes). Fix: in `handleFilterByColumn` chips branch set a ref the trigger branch's `onCloseAutoFocus` reads to `preventDefault()`.
- 3. `components/toolbar/ST_ViewSettingsItems.tsx` (spec 04): `enableDensityToggle: false` is ignored; the pinned density button and the Density row still render (check-pages b `disable-density-toggle: no density button`). Fix: leave out the density row and pin when `enableDensityToggle` is false.
- 4. `components/body/ST_TableDetailPanel.tsx` (spec 02): under `layoutMode: 'grid'` (now the default) the detail cell is `flex` and its `CollapsibleContent` shrinks to its content, so a `ResponsiveContainer` measures 0 width and recharts draws nothing (check-pages b `chart-detail-panel: recharts chart`, d `chart-detail-panel: chart rendered`). Fix: `w-full min-w-0` on the `CollapsibleContent` in the grid layout.

## Notes

- MenuOpeners accepts `aria-haspopup` `menu` or `true` (React Aria's MenuTrigger writes `true`).
- Selection `Selection Enabled` asserts the select-all control centred on the header label line (first child of the th); the row is 39 px plus the 1 px border.
- `RenderCounts`: `Profiled Thousand Rows` budget unchanged (passed in every base); `Row Model Follows State` custom button renamed `Reset filters` (chips add a `Clear filters` button).
