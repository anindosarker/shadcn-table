import { ST_TableBodyRowPinButton } from '@/components/ui-base/shadcn-table/components/body/ST_TableBodyRowPinButton';
import {
  type ST_ColumnDef,
  type ST_RowData,
  type ST_StatefulTableOptions,
} from '@/components/ui-base/shadcn-table/types';
import { defaultDisplayColumnProps } from '@/components/ui-base/shadcn-table/shared/utils/displayColumn.utils';

export const getST_RowPinningColumnDef = <TData extends ST_RowData>(
  tableOptions: ST_StatefulTableOptions<TData>,
): ST_ColumnDef<TData> => {
  return {
    Cell: ({ row }) => <ST_TableBodyRowPinButton row={row} />,
    grow: false,
    ...defaultDisplayColumnProps({
      header: 'pin',
      id: 'st-row-pin',
      size: 60,
      tableOptions,
    }),
  };
};
