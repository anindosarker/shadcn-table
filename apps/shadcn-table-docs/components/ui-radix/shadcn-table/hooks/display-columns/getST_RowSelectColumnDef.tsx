import { ST_SelectCheckbox } from '@/components/ui-radix/shadcn-table/components/inputs/ST_SelectCheckbox';
import {
  type ST_ColumnDef,
  type ST_RowData,
  type ST_StatefulTableOptions,
} from '@/components/ui-radix/shadcn-table/types';
import { defaultDisplayColumnProps } from '@/components/ui-radix/shadcn-table/shared/utils/displayColumn.utils';

export const getST_RowSelectColumnDef = <TData extends ST_RowData>(
  tableOptions: ST_StatefulTableOptions<TData>,
): ST_ColumnDef<TData> => {
  const { enableMultiRowSelection, enableSelectAll } = tableOptions;

  return {
    Cell: ({ row, staticRowIndex }) => (
      <ST_SelectCheckbox row={row} staticRowIndex={staticRowIndex} />
    ),
    Header:
      enableSelectAll && enableMultiRowSelection
        ? () => <ST_SelectCheckbox />
        : undefined,
    grow: false,
    ...defaultDisplayColumnProps({
      header: 'select',
      id: 'st-row-select',
      size: enableSelectAll ? 60 : 70,
      tableOptions,
    }),
  };
};
