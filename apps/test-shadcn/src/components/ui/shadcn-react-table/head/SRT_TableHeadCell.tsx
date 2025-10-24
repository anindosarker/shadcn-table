import {
  flexRender,
  type SRT_Header,
  type SRT_RowData,
  type SRT_TableInstance,
} from 'shadcn-react-table-core';
import { cn } from '@/lib/utils';
import { cva } from 'class-variance-authority';
import { SRT_TableHeadCellSortLabel } from './SRT_TableHeadCellSortLabel';

export interface SRT_TableHeadCellProps<TData extends SRT_RowData> {
  header: SRT_Header<TData>;
  table: SRT_TableInstance<TData>;
}

/**
 * Table head cell component - renders individual header cell
 *
 * Implemented:
 * - Basic header rendering with flexRender
 * - Placeholder handling
 * - ColSpan support
 * - Density variations (compact/comfortable/spacious)
 *
 * TODO (Future enhancements):
 * - Sorting UI (sort label, icons)
 * - Column resizing handle
 * - Column drag handle
 * - Column actions menu button
 * - Filter label/button
 * - Column pinning styles
 * - Custom cell props
 * - Keyboard shortcuts
 */

const headCellVariants = cva(
  'text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0',
  {
    variants: {
      density: {
        compact: 'h-8 px-2 py-1',
        comfortable: 'h-12 px-4 py-2',
        spacious: 'h-16 px-6 py-4',
      },
    },
    defaultVariants: {
      density: 'comfortable',
    },
  },
);

export const SRT_TableHeadCell = <TData extends SRT_RowData>({
  header,
  table,
}: SRT_TableHeadCellProps<TData>) => {
  const { column } = header;
  const { columnDef } = column;
  const { density } = table.getState();

  // Check if this column can be sorted
  const canSort = column.getCanSort();

  return (
    <th colSpan={header.colSpan} className={cn(headCellVariants({ density }))}>
      {header.isPlaceholder ? null : (
        <div className="flex items-center gap-2">
          {/* Header content */}
          <div className="flex-1">
            {flexRender(columnDef.header, header.getContext())}
          </div>

          {/* Sort label - only show if sorting is enabled for this column */}
          {canSort && <SRT_TableHeadCellSortLabel header={header} table={table} />}

          {/* TODO: Add more header components */}
          {/* {columnDef.enableColumnFilter && <SRT_TableHeadCellFilterLabel />} */}
          {/* {columnDef.enableColumnActions && <SRT_TableHeadCellColumnActionsButton />} */}
          {/* {enableColumnResizing && <SRT_TableHeadCellResizeHandle />} */}
        </div>
      )}
    </th>
  );
};
