import { type ReactNode, type JSX } from 'react';
import {
  createRow as _createRow,
  flexRender as _flexRender,
  type Renderable,
} from '@tanstack/react-table';
import {
  type SRT_ColumnHelper,
  type SRT_DisplayColumnDef,
  type SRT_GroupColumnDef,
  type SRT_Row,
  type SRT_RowData,
  type SRT_TableInstance,
} from '../types';
import { getAllLeafColumnDefs, getColumnId } from './column.utils';

export const flexRender = _flexRender as (
  Comp: Renderable<any>,
  props: any,
) => JSX.Element | ReactNode;

export function createSRTColumnHelper<
  TData extends SRT_RowData,
>(): SRT_ColumnHelper<TData> {
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
    display: (column) => column as SRT_DisplayColumnDef<TData>,
    group: (column) => column as SRT_GroupColumnDef<TData>,
  };
}

export const createRow = <TData extends SRT_RowData>(
  table: SRT_TableInstance<TData>,
  originalRow?: TData,
  rowIndex = -1,
  depth = 0,
  subRows?: SRT_Row<TData>[],
  parentId?: string,
): SRT_Row<TData> =>
  _createRow(
    table as any,
    'mrt-row-create',
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
  ) as SRT_Row<TData>;
