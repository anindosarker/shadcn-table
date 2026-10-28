import { type RefObject } from 'react';
import { ST_TableBodyRowGrabHandle } from '@/components/ui-aria/shadcn-table/components/body/ST_TableBodyRowGrabHandle';
import {
  type ST_ColumnDef,
  type ST_NeutralPartPropTypes,
  type ST_RowData,
  type ST_StatefulTableOptions,
} from '@/components/ui-aria/shadcn-table/types';
import { defaultDisplayColumnProps } from '@/components/ui-aria/shadcn-table/shared/utils/displayColumn.utils';

export const getST_RowDragColumnDef = <TData extends ST_RowData>(
  tableOptions: ST_StatefulTableOptions<TData>,
): ST_ColumnDef<TData, unknown, ST_NeutralPartPropTypes> => {
  return {
    Cell: ({ row, rowRef }) => (
      <ST_TableBodyRowGrabHandle
        row={row}
        rowRef={rowRef as RefObject<HTMLTableRowElement | null>}
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
