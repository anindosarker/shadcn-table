import { Subscribe } from '@tanstack/react-table';
import {
  type ST_ColumnDef,
  type ST_NeutralPartPropTypes,
  type ST_RowData,
  type ST_StatefulTableOptions,
} from '@/components/ui/shadcn-table/types';
import { defaultDisplayColumnProps } from '@/components/ui/shadcn-table/shared/utils/displayColumn.utils';

export const getST_RowNumbersColumnDef = <TData extends ST_RowData>(
  tableOptions: ST_StatefulTableOptions<TData>,
): ST_ColumnDef<TData, unknown, ST_NeutralPartPropTypes> => {
  const { localization, rowNumberDisplayMode } = tableOptions;

  return {
    // The column defs are built on owner renders only, so the page is read
    // from the table here, not from the options.
    Cell: ({ row, staticRowIndex, table }) => (
      <Subscribe source={table.atoms.pagination}>
        {({ pageIndex, pageSize }) =>
          ((rowNumberDisplayMode === 'static'
            ? (staticRowIndex || 0) + (pageSize || 0) * (pageIndex || 0)
            : row.index) ?? 0) + 1
        }
      </Subscribe>
    ),
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
