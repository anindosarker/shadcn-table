import {
  type ST_ColumnDef,
  type ST_RowData,
  type ST_StatefulTableOptions,
} from '@/components/ui/shadcn-table/types';
import { defaultDisplayColumnProps } from '@/components/ui/shadcn-table/utils/displayColumn.utils';

export const getST_RowNumbersColumnDef = <TData extends ST_RowData>(
  tableOptions: ST_StatefulTableOptions<TData>,
): ST_ColumnDef<TData> => {
  const { localization, rowNumberDisplayMode } = tableOptions;
  const {
    pagination: { pageIndex, pageSize },
  } = tableOptions.state;

  return {
    Cell: ({ row, staticRowIndex }) =>
      ((rowNumberDisplayMode === 'static'
        ? (staticRowIndex || 0) + (pageSize || 0) * (pageIndex || 0)
        : row.index) ?? 0) + 1,
    Header: () => localization.rowNumber,
    grow: false,
    ...defaultDisplayColumnProps({
      header: 'rowNumbers',
      id: 'st-row-numbers',
      size: 50,
      tableOptions,
    }),
  };
};
