import { SRT_ToggleRowActionMenuButton } from '../../buttons/SRT_ToggleRowActionMenuButton';
import {
  type SRT_ColumnDef,
  type SRT_RowData,
  type SRT_StatefulTableOptions,
} from '../../types';
import { defaultDisplayColumnProps } from '../../utils/displayColumn.utils';

export const getSRT_RowActionsColumnDef = <TData extends SRT_RowData>(
  tableOptions: SRT_StatefulTableOptions<TData>,
): SRT_ColumnDef<TData> => {
  return {
    Cell: ({ cell, row, staticRowIndex, table }) => (
      <SRT_ToggleRowActionMenuButton
        cell={cell}
        row={row}
        staticRowIndex={staticRowIndex}
        table={table}
      />
    ),
    ...defaultDisplayColumnProps({
      header: 'actions',
      id: 'srt-row-actions',
      size: 70,
      tableOptions,
    }),
  };
};
