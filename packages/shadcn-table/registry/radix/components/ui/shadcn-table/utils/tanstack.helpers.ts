import { type ReactNode, type JSX } from 'react';
import {
  constructRow,
  flexRender as _flexRender,
  type Renderable,
} from '@tanstack/react-table';
import {
  type ST_ColumnHelper,
  type ST_DisplayColumnDef,
  type ST_GroupColumnDef,
  type ST_Row,
  type ST_RowData,
  type ST_TableInstance,
} from '@/components/ui/shadcn-table/types';
import { type ST_Features } from '@/components/ui/shadcn-table/utils/tanstack.features';
import {
  getAllLeafColumnDefs,
  getColumnId,
} from '@/components/ui/shadcn-table/utils/column.utils';

export const flexRender = _flexRender as (
  Comp: Renderable<any>,
  props: any,
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
  table: ST_TableInstance<TData>,
  originalRow?: TData,
  rowIndex = -1,
  depth = 0,
  subRows?: ST_Row<TData>[],
  parentId?: string,
): ST_Row<TData> =>
  constructRow<ST_Features, TData>(
    table as any,
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
    subRows as any,
    parentId,
  ) as ST_Row<TData>;
