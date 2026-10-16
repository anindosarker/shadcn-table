import {
  type SRT_DefinedTableOptions,
  type SRT_DisplayColumnIds,
  type SRT_Localization,
  type SRT_RowData,
  type SRT_StatefulTableOptions,
} from '../types';
import { getAllLeafColumnDefs, getColumnId } from './column.utils';

export function defaultDisplayColumnProps<TData extends SRT_RowData>({
  header,
  id,
  size,
  tableOptions,
}: {
  header?: keyof SRT_Localization;
  id: SRT_DisplayColumnIds;
  size: number;
  tableOptions: SRT_DefinedTableOptions<TData>;
}) {
  const { defaultDisplayColumn, displayColumnDefOptions, localization } =
    tableOptions;
  return {
    ...defaultDisplayColumn,
    header: header ? localization[header]! : '',
    size,
    ...displayColumnDefOptions?.[id],
    id,
  } as const;
}

export const showRowPinningColumn = <TData extends SRT_RowData>(
  tableOptions: SRT_StatefulTableOptions<TData>,
): boolean => {
  const { enableRowPinning, rowPinningDisplayMode } = tableOptions;
  return !!(enableRowPinning && !rowPinningDisplayMode?.startsWith('select'));
};

export const showRowDragColumn = <TData extends SRT_RowData>(
  tableOptions: SRT_StatefulTableOptions<TData>,
): boolean => {
  const { enableRowDragging, enableRowOrdering } = tableOptions;
  return !!(enableRowDragging || enableRowOrdering);
};

export const showRowExpandColumn = <TData extends SRT_RowData>(
  tableOptions: SRT_StatefulTableOptions<TData>,
): boolean => {
  const {
    enableExpanding,
    enableGrouping,
    renderDetailPanel,
    state: { grouping },
  } = tableOptions;
  return !!(
    enableExpanding ||
    (enableGrouping && grouping?.length) ||
    renderDetailPanel
  );
};

export const showRowActionsColumn = <TData extends SRT_RowData>(
  tableOptions: SRT_StatefulTableOptions<TData>,
): boolean => {
  const {
    createDisplayMode,
    editDisplayMode,
    enableEditing,
    enableRowActions,
    state: { creatingRow },
  } = tableOptions;
  return !!(
    enableRowActions ||
    (creatingRow && createDisplayMode === 'row') ||
    (enableEditing && ['modal', 'row'].includes(editDisplayMode ?? ''))
  );
};

export const showRowSelectionColumn = <TData extends SRT_RowData>(
  tableOptions: SRT_StatefulTableOptions<TData>,
): boolean => !!tableOptions.enableRowSelection;

export const showRowNumbersColumn = <TData extends SRT_RowData>(
  tableOptions: SRT_StatefulTableOptions<TData>,
): boolean => !!tableOptions.enableRowNumbers;

export const showRowSpacerColumn = <TData extends SRT_RowData>(
  tableOptions: SRT_StatefulTableOptions<TData>,
): boolean => tableOptions.layoutMode === 'grid-no-grow';

export const getLeadingDisplayColumnIds = <TData extends SRT_RowData>(
  tableOptions: SRT_StatefulTableOptions<TData>,
) =>
  [
    showRowPinningColumn(tableOptions) && 'mrt-row-pin',
    showRowDragColumn(tableOptions) && 'mrt-row-drag',
    tableOptions.positionActionsColumn === 'first' &&
      showRowActionsColumn(tableOptions) &&
      'mrt-row-actions',
    tableOptions.positionExpandColumn === 'first' &&
      showRowExpandColumn(tableOptions) &&
      'mrt-row-expand',
    showRowSelectionColumn(tableOptions) && 'mrt-row-select',
    showRowNumbersColumn(tableOptions) && 'mrt-row-numbers',
  ].filter(Boolean) as SRT_DisplayColumnIds[];

export const getTrailingDisplayColumnIds = <TData extends SRT_RowData>(
  tableOptions: SRT_StatefulTableOptions<TData>,
) =>
  [
    tableOptions.positionActionsColumn === 'last' &&
      showRowActionsColumn(tableOptions) &&
      'mrt-row-actions',
    tableOptions.positionExpandColumn === 'last' &&
      showRowExpandColumn(tableOptions) &&
      'mrt-row-expand',
    showRowSpacerColumn(tableOptions) && 'mrt-row-spacer',
  ].filter(Boolean) as SRT_DisplayColumnIds[];

export const getDefaultColumnOrderIds = <TData extends SRT_RowData>(
  tableOptions: SRT_StatefulTableOptions<TData>,
  reset = false,
) => {
  const {
    state: { columnOrder: currentColumnOrderIds = [] },
  } = tableOptions;

  const leadingDisplayColIds: string[] =
    getLeadingDisplayColumnIds(tableOptions);
  const trailingDisplayColIds: string[] =
    getTrailingDisplayColumnIds(tableOptions);

  const defaultColumnDefIds = getAllLeafColumnDefs(tableOptions.columns).map(
    (columnDef) => getColumnId(columnDef),
  );

  let allLeafColumnDefIds = reset
    ? defaultColumnDefIds
    : Array.from(new Set([...currentColumnOrderIds, ...defaultColumnDefIds]));

  allLeafColumnDefIds = allLeafColumnDefIds.filter(
    (colId) =>
      !leadingDisplayColIds.includes(colId) &&
      !trailingDisplayColIds.includes(colId),
  );

  return [
    ...leadingDisplayColIds,
    ...allLeafColumnDefIds,
    ...trailingDisplayColIds,
  ];
};
