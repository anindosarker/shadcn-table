import { ST_TableBodyRowPinButton } from '@/components/ui/shadcn-table/components/body/ST_TableBodyRowPinButton';
import {
  type ST_ColumnDef,
  type ST_NeutralPartPropTypes,
  type ST_RowData,
  type ST_StatefulTableOptions,
} from '@/components/ui/shadcn-table/types';
import { defaultDisplayColumnProps } from '@/components/ui/shadcn-table/shared/utils/displayColumn.utils';

export const getST_RowPinningColumnDef = <TData extends ST_RowData>(
  tableOptions: ST_StatefulTableOptions<TData>,
): ST_ColumnDef<TData, unknown, ST_NeutralPartPropTypes> => {
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
