# Component fixes (F3, F4, F5, F6), tracker

Status: merged (e6db62a9)
Branch `claude/review` (fix commits on the integration branch), worktree none, PR none
Files owned: `components/body/ST_TableBodyCell.tsx`, `components/body/ST_TableDetailPanel.tsx`, `components/toolbar/ST_ViewSettingsButton.tsx`, `components/toolbar/ST_ViewSettingsItems.tsx` in the three bases; `components/menus/ST_ColumnActionMenu.tsx` in radix and base
Depends on: 02, 03, 04
Checks:
- `tsc:radix`, `tsc:baseui`, `tsc:aria`, `lint`, `check:tailwind`, `check:bases` at e6db62a9: green
- `test:radix`, `test:base`, `test:aria` at e6db62a9: green except the four spec 05 stories rewritten by spec 05 (merged later at 7db14760)
- `test:radix`, `test:base`, `test:aria` on `v0.8/defaults-stories` at dcaae068 (after the merge of these fixes): 519/519 green

- Milestone 01 four component fixes: done (304283b4 F3, 8c3b06ee F4, f607d9b6 F5, 811cbd94 F6, registry rebuild e6db62a9; workflow wf_84936485-286)

## Attention

## Notes

- Found by spec 05's default flips (round D stopped as blocked); fixed on `claude/review` first, then merged into `v0.8/defaults-stories` as dcaae068.
