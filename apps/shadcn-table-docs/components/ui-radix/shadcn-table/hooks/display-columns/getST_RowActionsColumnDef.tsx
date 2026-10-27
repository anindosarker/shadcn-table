import { ST_ToggleRowActionMenuButton } from '@/components/ui-radix/shadcn-table/components/buttons/ST_ToggleRowActionMenuButton';
import {
  type ST_ColumnDef,
  type ST_NeutralPartPropTypes,
  type ST_RowData,
  type ST_StatefulTableOptions,
} from '@/components/ui-radix/shadcn-table/types';
import { defaultDisplayColumnProps } from '@/components/ui-radix/shadcn-table/shared/utils/displayColumn.utils';

export const getST_RowActionsColumnDef = <TData extends ST_RowData>(
  tableOptions: ST_StatefulTableOptions<TData>,
): ST_ColumnDef<TData, unknown, ST_NeutralPartPropTypes> => {
  return {
    Cell: ({ cell, row, staticRowIndex }) => (
      <ST_ToggleRowActionMenuButton
        cell={cell}
        row={row}
        staticRowIndex={staticRowIndex}
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
