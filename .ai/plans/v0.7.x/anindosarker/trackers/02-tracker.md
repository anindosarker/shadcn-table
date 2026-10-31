# 02: lint parity, tracker

Status: running
Branch `v0.7/library-sweep`, worktree library-sweep, PR #[n]
Gates:

- Phase 01 config and dependencies: running
- Phase 02 fixes per rule group: planned
- Final phase cleanup: planned

## Attention

### Lint baseline (phase 1 config, no temporary blocks): 743 problems; library 715, stories 28, other 0

| Rule | Library | Stories | Other |
| --- | --- | --- | --- |
| `@eslint-community/eslint-comments/require-description` | 82 | 0 | 0 |
| `@typescript-eslint/no-deprecated` | 158 | 0 | 0 |
| `@typescript-eslint/no-explicit-any` | 129 | 0 | 0 |
| `@typescript-eslint/no-unused-expressions` | 6 | 0 | 0 |
| `@typescript-eslint/no-unused-vars` | 9 | 0 | 0 |
| `react-hooks/exhaustive-deps` | 45 | 0 | 0 |
| `react-hooks/immutability` | 44 | 24 | 0 |
| `react-hooks/incompatible-library` | 6 | 0 | 0 |
| `react-hooks/preserve-manual-memoization` | 12 | 0 | 0 |
| `react-hooks/refs` | 149 | 1 | 0 |
| `react-hooks/rules-of-hooks` | 42 | 0 | 0 |
| `react-hooks/set-state-in-effect` | 12 | 3 | 0 |
| `react-hooks/use-memo` | 21 | 0 | 0 |

Per file, paths below `packages/shadcn-table/`:

- `registry/aria/components/ui/shadcn-table/ShadcnTable.tsx`: require-description 1
- `registry/aria/components/ui/shadcn-table/components/body/ST_TableBody.tsx`: no-deprecated 1
- `registry/aria/components/ui/shadcn-table/components/body/ST_TableBodyCell.tsx`: require-description 2, no-deprecated 1, immutability 1, set-state-in-effect 1
- `registry/aria/components/ui/shadcn-table/components/body/ST_TableBodyCellValue.tsx`: no-deprecated 1
- `registry/aria/components/ui/shadcn-table/components/body/ST_TableBodyRow.tsx`: no-deprecated 2
- `registry/aria/components/ui/shadcn-table/components/body/ST_TableBodyRowPinButton.tsx`: require-description 1, no-deprecated 1
- `registry/aria/components/ui/shadcn-table/components/body/ST_TableDetailPanel.tsx`: no-deprecated 1, no-unused-vars 1
- `registry/aria/components/ui/shadcn-table/components/buttons/ST_EditActionButtons.tsx`: no-deprecated 3, immutability 1
- `registry/aria/components/ui/shadcn-table/components/buttons/ST_ExpandAllButton.tsx`: no-deprecated 1
- `registry/aria/components/ui/shadcn-table/components/buttons/ST_ExpandButton.tsx`: no-deprecated 1
- `registry/aria/components/ui/shadcn-table/components/buttons/ST_ToggleGlobalFilterButton.tsx`: no-deprecated 1
- `registry/aria/components/ui/shadcn-table/components/buttons/ST_ToggleRowActionMenuButton.tsx`: no-deprecated 1
- `registry/aria/components/ui/shadcn-table/components/buttons/ST_Tooltip.tsx`: refs 2
- `registry/aria/components/ui/shadcn-table/components/footer/ST_TableFooter.tsx`: no-deprecated 1, refs 1
- `registry/aria/components/ui/shadcn-table/components/footer/ST_TableFooterCell.tsx`: no-deprecated 1
- `registry/aria/components/ui/shadcn-table/components/head/ST_TableHead.tsx`: no-deprecated 1, refs 1
- `registry/aria/components/ui/shadcn-table/components/head/ST_TableHeadCell.tsx`: no-deprecated 1
- `registry/aria/components/ui/shadcn-table/components/head/ST_TableHeadCellResizeHandle.tsx`: no-deprecated 1
- `registry/aria/components/ui/shadcn-table/components/head/ST_TableHeadCellSortLabel.tsx`: no-deprecated 1
- `registry/aria/components/ui/shadcn-table/components/inputs/ST_EditCellTextField.tsx`: no-deprecated 4, immutability 1
- `registry/aria/components/ui/shadcn-table/components/inputs/ST_FilterCheckbox.tsx`: no-deprecated 1
- `registry/aria/components/ui/shadcn-table/components/inputs/ST_FilterRangeSlider.tsx`: set-state-in-effect 1
- `registry/aria/components/ui/shadcn-table/components/inputs/ST_FilterTextField.tsx`: require-description 4, no-deprecated 4, immutability 3, set-state-in-effect 1, use-memo 1
- `registry/aria/components/ui/shadcn-table/components/inputs/ST_GlobalFilterTextField.tsx`: require-description 2, set-state-in-effect 1, use-memo 1
- `registry/aria/components/ui/shadcn-table/components/inputs/ST_SelectCheckbox.tsx`: no-deprecated 1
- `registry/aria/components/ui/shadcn-table/components/menus/ST_CellActionMenu.tsx`: require-description 1
- `registry/aria/components/ui/shadcn-table/components/menus/ST_ColumnActionMenu.tsx`: no-deprecated 1
- `registry/aria/components/ui/shadcn-table/components/menus/ST_FilterOptionMenu.tsx`: require-description 4, no-deprecated 1
- `registry/aria/components/ui/shadcn-table/components/menus/ST_ShowHideColumnsMenu.tsx`: require-description 2, no-deprecated 1, use-memo 4
- `registry/aria/components/ui/shadcn-table/components/modals/ST_EditRowModal.tsx`: no-deprecated 1
- `registry/aria/components/ui/shadcn-table/components/table/ST_TableContainer.tsx`: no-deprecated 1, refs 1
- `registry/aria/components/ui/shadcn-table/components/table/ST_TableLayout.tsx`: refs 1
- `registry/aria/components/ui/shadcn-table/components/toolbar/ST_BottomToolbar.tsx`: refs 1
- `registry/aria/components/ui/shadcn-table/components/toolbar/ST_LinearProgressBar.tsx`: no-deprecated 1
- `registry/aria/components/ui/shadcn-table/components/toolbar/ST_TablePagination.tsx`: no-deprecated 3
- `registry/aria/components/ui/shadcn-table/components/toolbar/ST_ToolbarAlertBanner.tsx`: no-deprecated 1
- `registry/aria/components/ui/shadcn-table/components/toolbar/ST_ToolbarDropZone.tsx`: no-deprecated 1
- `registry/aria/components/ui/shadcn-table/components/toolbar/ST_TopToolbar.tsx`: no-deprecated 1, refs 1
- `registry/aria/components/ui/shadcn-table/features/stCellActionsFeature.ts`: require-description 1
- `registry/aria/components/ui/shadcn-table/features/stColumnDraggingFeature.ts`: require-description 1
- `registry/aria/components/ui/shadcn-table/features/stDensityFeature.ts`: require-description 1
- `registry/aria/components/ui/shadcn-table/features/stEditingFeature.ts`: require-description 1
- `registry/aria/components/ui/shadcn-table/features/stFilterModesFeature.ts`: require-description 1
- `registry/aria/components/ui/shadcn-table/features/stFullScreenFeature.ts`: require-description 1
- `registry/aria/components/ui/shadcn-table/features/stRefsFeature.ts`: require-description 1
- `registry/aria/components/ui/shadcn-table/features/stRowDraggingFeature.ts`: require-description 1
- `registry/aria/components/ui/shadcn-table/features/stToolbarsFeature.ts`: require-description 1
- `registry/aria/components/ui/shadcn-table/hooks/useST_ColumnVirtualizer.ts`: no-explicit-any 2, exhaustive-deps 3, incompatible-library 1, rules-of-hooks 7
- `registry/aria/components/ui/shadcn-table/hooks/useST_Effects.ts`: no-deprecated 3, exhaustive-deps 6, refs 2
- `registry/aria/components/ui/shadcn-table/hooks/useST_RowVirtualizer.ts`: no-explicit-any 1, incompatible-library 1, rules-of-hooks 6
- `registry/aria/components/ui/shadcn-table/hooks/useST_Rows.ts`: exhaustive-deps 2, use-memo 1
- `registry/aria/components/ui/shadcn-table/hooks/useST_TableInstance.ts`: no-deprecated 2, exhaustive-deps 2, immutability 4, refs 39
- `registry/aria/components/ui/shadcn-table/hooks/useST_TableOptions.ts`: exhaustive-deps 1, immutability 6, preserve-manual-memoization 4, rules-of-hooks 1
- `registry/aria/components/ui/shadcn-table/icons.ts`: no-explicit-any 1
- `registry/aria/components/ui/shadcn-table/shared/fns/aggregationFns.ts`: no-deprecated 1
- `registry/aria/components/ui/shadcn-table/shared/fns/filterFns.ts`: no-deprecated 1, no-explicit-any 18, no-unused-vars 2
- `registry/aria/components/ui/shadcn-table/shared/fns/sortFns.ts`: no-deprecated 2, no-explicit-any 2
- `registry/aria/components/ui/shadcn-table/shared/utils/cell.utils.ts`: no-deprecated 2, no-explicit-any 2, no-unused-expressions 1
- `registry/aria/components/ui/shadcn-table/shared/utils/column.utils.ts`: no-explicit-any 1, exhaustive-deps 1
- `registry/aria/components/ui/shadcn-table/shared/utils/pagination.utils.ts`: no-deprecated 1
- `registry/aria/components/ui/shadcn-table/shared/utils/row.utils.ts`: no-deprecated 3, no-explicit-any 2, no-unused-expressions 1
- `registry/aria/components/ui/shadcn-table/shared/utils/style.utils.ts`: no-deprecated 1
- `registry/aria/components/ui/shadcn-table/shared/utils/tanstack.helpers.ts`: no-explicit-any 5
- `registry/aria/components/ui/shadcn-table/shared/utils/utils.ts`: no-explicit-any 2
- `registry/aria/components/ui/shadcn-table/types.ts`: no-explicit-any 7
- `registry/base/components/ui/shadcn-table/ShadcnTable.tsx`: require-description 1
- `registry/base/components/ui/shadcn-table/components/body/ST_TableBody.tsx`: no-deprecated 1
- `registry/base/components/ui/shadcn-table/components/body/ST_TableBodyCell.tsx`: require-description 2, no-deprecated 1, immutability 1, set-state-in-effect 1
- `registry/base/components/ui/shadcn-table/components/body/ST_TableBodyCellValue.tsx`: no-deprecated 1
- `registry/base/components/ui/shadcn-table/components/body/ST_TableBodyRow.tsx`: no-deprecated 2
- `registry/base/components/ui/shadcn-table/components/body/ST_TableBodyRowPinButton.tsx`: require-description 1, no-deprecated 1
- `registry/base/components/ui/shadcn-table/components/body/ST_TableDetailPanel.tsx`: no-deprecated 1, no-unused-vars 1
- `registry/base/components/ui/shadcn-table/components/buttons/ST_EditActionButtons.tsx`: no-deprecated 3, immutability 1
- `registry/base/components/ui/shadcn-table/components/buttons/ST_ExpandAllButton.tsx`: no-deprecated 1
- `registry/base/components/ui/shadcn-table/components/buttons/ST_ExpandButton.tsx`: no-deprecated 1
- `registry/base/components/ui/shadcn-table/components/buttons/ST_ToggleGlobalFilterButton.tsx`: no-deprecated 1
- `registry/base/components/ui/shadcn-table/components/buttons/ST_ToggleRowActionMenuButton.tsx`: no-deprecated 1
- `registry/base/components/ui/shadcn-table/components/footer/ST_TableFooter.tsx`: no-deprecated 1, refs 1
- `registry/base/components/ui/shadcn-table/components/footer/ST_TableFooterCell.tsx`: no-deprecated 1
- `registry/base/components/ui/shadcn-table/components/head/ST_TableHead.tsx`: no-deprecated 1, refs 1
- `registry/base/components/ui/shadcn-table/components/head/ST_TableHeadCell.tsx`: no-deprecated 1
- `registry/base/components/ui/shadcn-table/components/head/ST_TableHeadCellResizeHandle.tsx`: no-deprecated 1
- `registry/base/components/ui/shadcn-table/components/head/ST_TableHeadCellSortLabel.tsx`: no-deprecated 1
- `registry/base/components/ui/shadcn-table/components/inputs/ST_EditCellTextField.tsx`: no-deprecated 2, immutability 1
- `registry/base/components/ui/shadcn-table/components/inputs/ST_FilterCheckbox.tsx`: no-deprecated 1
- `registry/base/components/ui/shadcn-table/components/inputs/ST_FilterRangeSlider.tsx`: set-state-in-effect 1
- `registry/base/components/ui/shadcn-table/components/inputs/ST_FilterTextField.tsx`: require-description 4, immutability 1, set-state-in-effect 1, use-memo 1
- `registry/base/components/ui/shadcn-table/components/inputs/ST_GlobalFilterTextField.tsx`: require-description 2, set-state-in-effect 1, use-memo 1
- `registry/base/components/ui/shadcn-table/components/inputs/ST_SelectCheckbox.tsx`: require-description 2, no-deprecated 1
- `registry/base/components/ui/shadcn-table/components/menus/ST_CellActionMenu.tsx`: require-description 1
- `registry/base/components/ui/shadcn-table/components/menus/ST_ColumnActionMenu.tsx`: no-deprecated 1, refs 1
- `registry/base/components/ui/shadcn-table/components/menus/ST_FilterOptionMenu.tsx`: require-description 4, no-deprecated 1, refs 1
- `registry/base/components/ui/shadcn-table/components/menus/ST_RowActionMenu.tsx`: refs 1
- `registry/base/components/ui/shadcn-table/components/menus/ST_ShowHideColumnsMenu.tsx`: require-description 2, no-deprecated 1, refs 1, use-memo 4
- `registry/base/components/ui/shadcn-table/components/modals/ST_EditRowModal.tsx`: no-deprecated 1
- `registry/base/components/ui/shadcn-table/components/table/ST_TableContainer.tsx`: no-deprecated 1, refs 1
- `registry/base/components/ui/shadcn-table/components/table/ST_TableLayout.tsx`: refs 1
- `registry/base/components/ui/shadcn-table/components/toolbar/ST_BottomToolbar.tsx`: refs 1
- `registry/base/components/ui/shadcn-table/components/toolbar/ST_LinearProgressBar.tsx`: no-deprecated 1
- `registry/base/components/ui/shadcn-table/components/toolbar/ST_TablePagination.tsx`: no-deprecated 1
- `registry/base/components/ui/shadcn-table/components/toolbar/ST_ToolbarAlertBanner.tsx`: no-deprecated 1
- `registry/base/components/ui/shadcn-table/components/toolbar/ST_ToolbarDropZone.tsx`: no-deprecated 1
- `registry/base/components/ui/shadcn-table/components/toolbar/ST_TopToolbar.tsx`: no-deprecated 1, refs 1
- `registry/base/components/ui/shadcn-table/features/stCellActionsFeature.ts`: require-description 1
- `registry/base/components/ui/shadcn-table/features/stColumnDraggingFeature.ts`: require-description 1
- `registry/base/components/ui/shadcn-table/features/stDensityFeature.ts`: require-description 1
- `registry/base/components/ui/shadcn-table/features/stEditingFeature.ts`: require-description 1
- `registry/base/components/ui/shadcn-table/features/stFilterModesFeature.ts`: require-description 1
- `registry/base/components/ui/shadcn-table/features/stFullScreenFeature.ts`: require-description 1
- `registry/base/components/ui/shadcn-table/features/stRefsFeature.ts`: require-description 1
- `registry/base/components/ui/shadcn-table/features/stRowDraggingFeature.ts`: require-description 1
- `registry/base/components/ui/shadcn-table/features/stToolbarsFeature.ts`: require-description 1
- `registry/base/components/ui/shadcn-table/hooks/useST_ColumnVirtualizer.ts`: no-explicit-any 2, exhaustive-deps 3, incompatible-library 1, rules-of-hooks 7
- `registry/base/components/ui/shadcn-table/hooks/useST_Effects.ts`: no-deprecated 3, exhaustive-deps 6, refs 2
- `registry/base/components/ui/shadcn-table/hooks/useST_RowVirtualizer.ts`: no-explicit-any 1, incompatible-library 1, rules-of-hooks 6
- `registry/base/components/ui/shadcn-table/hooks/useST_Rows.ts`: exhaustive-deps 2, use-memo 1
- `registry/base/components/ui/shadcn-table/hooks/useST_TableInstance.ts`: no-deprecated 2, exhaustive-deps 2, immutability 4, refs 39
- `registry/base/components/ui/shadcn-table/hooks/useST_TableOptions.ts`: exhaustive-deps 1, immutability 6, preserve-manual-memoization 4, rules-of-hooks 1
- `registry/base/components/ui/shadcn-table/icons.ts`: no-explicit-any 1
- `registry/base/components/ui/shadcn-table/shared/fns/aggregationFns.ts`: no-deprecated 1
- `registry/base/components/ui/shadcn-table/shared/fns/filterFns.ts`: no-deprecated 1, no-explicit-any 18, no-unused-vars 2
- `registry/base/components/ui/shadcn-table/shared/fns/sortFns.ts`: no-deprecated 2, no-explicit-any 2
- `registry/base/components/ui/shadcn-table/shared/utils/cell.utils.ts`: no-deprecated 2, no-explicit-any 2, no-unused-expressions 1
- `registry/base/components/ui/shadcn-table/shared/utils/column.utils.ts`: no-explicit-any 1, exhaustive-deps 1
- `registry/base/components/ui/shadcn-table/shared/utils/pagination.utils.ts`: no-deprecated 1
- `registry/base/components/ui/shadcn-table/shared/utils/row.utils.ts`: no-deprecated 3, no-explicit-any 2, no-unused-expressions 1
- `registry/base/components/ui/shadcn-table/shared/utils/style.utils.ts`: no-deprecated 1
- `registry/base/components/ui/shadcn-table/shared/utils/tanstack.helpers.ts`: no-explicit-any 5
- `registry/base/components/ui/shadcn-table/shared/utils/utils.ts`: no-explicit-any 2
- `registry/base/components/ui/shadcn-table/types.ts`: no-explicit-any 7
- `registry/radix/components/ui/shadcn-table/ShadcnTable.tsx`: require-description 1
- `registry/radix/components/ui/shadcn-table/components/body/ST_TableBody.tsx`: no-deprecated 1
- `registry/radix/components/ui/shadcn-table/components/body/ST_TableBodyCell.tsx`: require-description 2, no-deprecated 1, immutability 1, set-state-in-effect 1
- `registry/radix/components/ui/shadcn-table/components/body/ST_TableBodyCellValue.tsx`: no-deprecated 1
- `registry/radix/components/ui/shadcn-table/components/body/ST_TableBodyRow.tsx`: no-deprecated 2
- `registry/radix/components/ui/shadcn-table/components/body/ST_TableBodyRowPinButton.tsx`: require-description 1, no-deprecated 1
- `registry/radix/components/ui/shadcn-table/components/body/ST_TableDetailPanel.tsx`: no-deprecated 1, no-unused-vars 1
- `registry/radix/components/ui/shadcn-table/components/buttons/ST_EditActionButtons.tsx`: no-deprecated 3, immutability 1
- `registry/radix/components/ui/shadcn-table/components/buttons/ST_ExpandAllButton.tsx`: no-deprecated 1
- `registry/radix/components/ui/shadcn-table/components/buttons/ST_ExpandButton.tsx`: no-deprecated 1
- `registry/radix/components/ui/shadcn-table/components/buttons/ST_ToggleGlobalFilterButton.tsx`: no-deprecated 1
- `registry/radix/components/ui/shadcn-table/components/buttons/ST_ToggleRowActionMenuButton.tsx`: no-deprecated 1
- `registry/radix/components/ui/shadcn-table/components/footer/ST_TableFooter.tsx`: no-deprecated 1, refs 1
- `registry/radix/components/ui/shadcn-table/components/footer/ST_TableFooterCell.tsx`: no-deprecated 1
- `registry/radix/components/ui/shadcn-table/components/head/ST_TableHead.tsx`: no-deprecated 1, refs 1
- `registry/radix/components/ui/shadcn-table/components/head/ST_TableHeadCell.tsx`: no-deprecated 1
- `registry/radix/components/ui/shadcn-table/components/head/ST_TableHeadCellResizeHandle.tsx`: no-deprecated 1
- `registry/radix/components/ui/shadcn-table/components/head/ST_TableHeadCellSortLabel.tsx`: no-deprecated 1
- `registry/radix/components/ui/shadcn-table/components/inputs/ST_EditCellTextField.tsx`: no-deprecated 2, immutability 1
- `registry/radix/components/ui/shadcn-table/components/inputs/ST_FilterCheckbox.tsx`: no-deprecated 1
- `registry/radix/components/ui/shadcn-table/components/inputs/ST_FilterRangeSlider.tsx`: set-state-in-effect 1
- `registry/radix/components/ui/shadcn-table/components/inputs/ST_FilterTextField.tsx`: require-description 4, immutability 1, set-state-in-effect 1, use-memo 1
- `registry/radix/components/ui/shadcn-table/components/inputs/ST_GlobalFilterTextField.tsx`: require-description 2, set-state-in-effect 1, use-memo 1
- `registry/radix/components/ui/shadcn-table/components/inputs/ST_SelectCheckbox.tsx`: require-description 2, no-deprecated 1
- `registry/radix/components/ui/shadcn-table/components/menus/ST_CellActionMenu.tsx`: require-description 1
- `registry/radix/components/ui/shadcn-table/components/menus/ST_ColumnActionMenu.tsx`: no-deprecated 1
- `registry/radix/components/ui/shadcn-table/components/menus/ST_FilterOptionMenu.tsx`: require-description 4, no-deprecated 1, refs 1
- `registry/radix/components/ui/shadcn-table/components/menus/ST_RowActionMenu.tsx`: refs 1
- `registry/radix/components/ui/shadcn-table/components/menus/ST_ShowHideColumnsMenu.tsx`: require-description 2, no-deprecated 1, use-memo 4
- `registry/radix/components/ui/shadcn-table/components/modals/ST_EditRowModal.tsx`: no-deprecated 1
- `registry/radix/components/ui/shadcn-table/components/table/ST_TableContainer.tsx`: no-deprecated 1, refs 1
- `registry/radix/components/ui/shadcn-table/components/table/ST_TableLayout.tsx`: refs 1
- `registry/radix/components/ui/shadcn-table/components/toolbar/ST_BottomToolbar.tsx`: refs 1
- `registry/radix/components/ui/shadcn-table/components/toolbar/ST_LinearProgressBar.tsx`: no-deprecated 1
- `registry/radix/components/ui/shadcn-table/components/toolbar/ST_TablePagination.tsx`: no-deprecated 1
- `registry/radix/components/ui/shadcn-table/components/toolbar/ST_ToolbarAlertBanner.tsx`: no-deprecated 1
- `registry/radix/components/ui/shadcn-table/components/toolbar/ST_ToolbarDropZone.tsx`: no-deprecated 1
- `registry/radix/components/ui/shadcn-table/components/toolbar/ST_TopToolbar.tsx`: no-deprecated 1, refs 1
- `registry/radix/components/ui/shadcn-table/features/stCellActionsFeature.ts`: require-description 1
- `registry/radix/components/ui/shadcn-table/features/stColumnDraggingFeature.ts`: require-description 1
- `registry/radix/components/ui/shadcn-table/features/stDensityFeature.ts`: require-description 1
- `registry/radix/components/ui/shadcn-table/features/stEditingFeature.ts`: require-description 1
- `registry/radix/components/ui/shadcn-table/features/stFilterModesFeature.ts`: require-description 1
- `registry/radix/components/ui/shadcn-table/features/stFullScreenFeature.ts`: require-description 1
- `registry/radix/components/ui/shadcn-table/features/stRefsFeature.ts`: require-description 1
- `registry/radix/components/ui/shadcn-table/features/stRowDraggingFeature.ts`: require-description 1
- `registry/radix/components/ui/shadcn-table/features/stToolbarsFeature.ts`: require-description 1
- `registry/radix/components/ui/shadcn-table/hooks/useST_ColumnVirtualizer.ts`: no-explicit-any 2, exhaustive-deps 3, incompatible-library 1, rules-of-hooks 7
- `registry/radix/components/ui/shadcn-table/hooks/useST_Effects.ts`: no-deprecated 3, exhaustive-deps 6, refs 2
- `registry/radix/components/ui/shadcn-table/hooks/useST_RowVirtualizer.ts`: no-explicit-any 1, incompatible-library 1, rules-of-hooks 6
- `registry/radix/components/ui/shadcn-table/hooks/useST_Rows.ts`: exhaustive-deps 2, use-memo 1
- `registry/radix/components/ui/shadcn-table/hooks/useST_TableInstance.ts`: no-deprecated 2, exhaustive-deps 2, immutability 4, refs 39
- `registry/radix/components/ui/shadcn-table/hooks/useST_TableOptions.ts`: exhaustive-deps 1, immutability 6, preserve-manual-memoization 4, rules-of-hooks 1
- `registry/radix/components/ui/shadcn-table/icons.ts`: no-explicit-any 1
- `registry/radix/components/ui/shadcn-table/shared/fns/aggregationFns.ts`: no-deprecated 1
- `registry/radix/components/ui/shadcn-table/shared/fns/filterFns.ts`: no-deprecated 1, no-explicit-any 18, no-unused-vars 2
- `registry/radix/components/ui/shadcn-table/shared/fns/sortFns.ts`: no-deprecated 2, no-explicit-any 2
- `registry/radix/components/ui/shadcn-table/shared/utils/cell.utils.ts`: no-deprecated 2, no-explicit-any 2, no-unused-expressions 1
- `registry/radix/components/ui/shadcn-table/shared/utils/column.utils.ts`: no-explicit-any 1, exhaustive-deps 1
- `registry/radix/components/ui/shadcn-table/shared/utils/pagination.utils.ts`: no-deprecated 1
- `registry/radix/components/ui/shadcn-table/shared/utils/row.utils.ts`: no-deprecated 3, no-explicit-any 2, no-unused-expressions 1
- `registry/radix/components/ui/shadcn-table/shared/utils/style.utils.ts`: no-deprecated 1
- `registry/radix/components/ui/shadcn-table/shared/utils/tanstack.helpers.ts`: no-explicit-any 5
- `registry/radix/components/ui/shadcn-table/shared/utils/utils.ts`: no-explicit-any 2
- `registry/radix/components/ui/shadcn-table/types.ts`: no-explicit-any 7
- `stories/features/ColumnGrouping.stories.tsx`: set-state-in-effect 1
- `stories/features/Creating.stories.tsx`: immutability 5
- `stories/features/Editing.stories.tsx`: immutability 18
- `stories/features/Filtering.stories.tsx`: set-state-in-effect 1
- `stories/features/Selection.stories.tsx`: immutability 1
- `stories/fixed-bugs/CallbackRefs.stories.tsx`: refs 1, set-state-in-effect 1
