import { ST_ToggleRowActionMenuButton } from '@/components/ui/shadcn-table/buttons/ST_ToggleRowActionMenuButton';
import {
  type ST_ColumnDef,
  type ST_RowData,
  type ST_StatefulTableOptions,
} from '@/components/ui/shadcn-table/types';
import { defaultDisplayColumnProps } from '@/components/ui/shadcn-table/utils/displayColumn.utils';

export const getST_RowActionsColumnDef = <TData extends ST_RowData>(
  tableOptions: ST_StatefulTableOptions<TData>,
): ST_ColumnDef<TData> => {
  return {
    Cell: ({ cell, row, staticRowIndex, table }) => (
      <ST_ToggleRowActionMenuButton
        cell={cell}
        row={row}
        staticRowIndex={staticRowIndex}
        table={table}
      />
    ),
    ...defaultDisplayColumnProps({
      header: 'actions',
      id: 'st-row-actions',
      size: 70,
      tableOptions,
    }),
  };
};
