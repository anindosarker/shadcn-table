import { type ReactNode, type JSX } from 'react';
import {
  constructRow,
  flexRender as _flexRender,
  type Renderable,
  type Row,
  type Table,
} from '@tanstack/react-table';
import {
  type ST_ColumnHelper,
  type ST_DisplayColumnDef,
  type ST_GroupColumnDef,
  type ST_Row,
  type ST_RowData,
  type ST_CoreTableInstance,
} from '@/components/ui-base/shadcn-table/types';
import { type ST_Features } from '@/components/ui-base/shadcn-table/features/stFeatures';
import {
  getAllLeafColumnDefs,
  getColumnId,
} from '@/components/ui-base/shadcn-table/shared/utils/column.utils';

export const flexRender = _flexRender as (
  Comp: Renderable<never>,
  props: object,
) => JSX.Element | ReactNode;

export function createSRTColumnHelper<
  TData extends ST_RowData,
>(): ST_ColumnHelper<TData> {
  return {
    accessor: (accessor, column) => {
      return typeof accessor === 'function'
        ? ({
            ...column,
            accessorFn: accessor,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any -- TValue is a conditional on TAccessor that TS cannot narrow; mirrors table-core columnHelper
          } as any)
        : {
            ...column,
            accessorKey: accessor,
          };
    },
    display: (column) => column as ST_DisplayColumnDef<TData>,
    group: (column) => column as ST_GroupColumnDef<TData>,
  };
}

export const createRow = <TData extends ST_RowData>(
  table: ST_CoreTableInstance<TData>,
  originalRow?: TData,
  rowIndex = -1,
  depth = 0,
  subRows?: ST_Row<TData>[],
  parentId?: string,
): ST_Row<TData> =>
  constructRow<ST_Features, TData>(
    table as unknown as Table<ST_Features, TData>,
    'st-row-create',
    originalRow ??
      Object.assign(
        {},
        ...getAllLeafColumnDefs(table.options.columns).map((col) => ({
          [getColumnId(col)]: '',
        })),
      ),
    rowIndex,
    depth,
    subRows as unknown as Array<Row<ST_Features, TData>>,
    parentId,
  ) as unknown as ST_Row<TData>;
