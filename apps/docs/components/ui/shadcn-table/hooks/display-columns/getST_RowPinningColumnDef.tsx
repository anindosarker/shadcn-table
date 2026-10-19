import { ST_TableBodyRowPinButton } from '@/components/ui/shadcn-table/body/ST_TableBodyRowPinButton';
import {
  type ST_ColumnDef,
  type ST_RowData,
  type ST_StatefulTableOptions,
} from '@/components/ui/shadcn-table/types';
import { defaultDisplayColumnProps } from '@/components/ui/shadcn-table/utils/displayColumn.utils';

export const getST_RowPinningColumnDef = <TData extends ST_RowData>(
  tableOptions: ST_StatefulTableOptions<TData>,
): ST_ColumnDef<TData> => {
  return {
    Cell: ({ row, table }) => (
      <ST_TableBodyRowPinButton row={row} table={table} />
    ),
    grow: false,
    ...defaultDisplayColumnProps({
      header: 'pin',
      id: 'st-row-pin',
      size: 60,
      tableOptions,
    }),
  };
};
