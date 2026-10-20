import { type RefObject } from 'react';
import { ST_TableBodyRowGrabHandle } from '@/components/ui/shadcn-table/body/ST_TableBodyRowGrabHandle';
import {
  type ST_ColumnDef,
  type ST_RowData,
  type ST_StatefulTableOptions,
} from '@/components/ui/shadcn-table/types';
import { defaultDisplayColumnProps } from '@/components/ui/shadcn-table/utils/displayColumn.utils';

export const getST_RowDragColumnDef = <TData extends ST_RowData>(
  tableOptions: ST_StatefulTableOptions<TData>,
): ST_ColumnDef<TData> => {
  return {
    Cell: ({ row, rowRef, table }) => (
      <ST_TableBodyRowGrabHandle
        row={row}
        rowRef={rowRef as RefObject<HTMLTableRowElement | null>}
        table={table}
      />
    ),
    grow: false,
    ...defaultDisplayColumnProps({
      header: 'move',
      id: 'st-row-drag',
      size: 60,
      tableOptions,
    }),
  };
};
