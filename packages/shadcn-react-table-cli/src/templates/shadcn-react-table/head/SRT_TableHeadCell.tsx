import {
  flexRender,
  type SRT_Header,
  type SRT_RowData,
  type SRT_TableInstance,
} from 'shadcn-react-table-core';
import { cn } from '@/lib/utils';

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

export const SRT_TableHeadCell = <TData extends SRT_RowData>({
  header,
}: SRT_TableHeadCellProps<TData>) => {
  const { column } = header;

  return (
    <th
      colSpan={header.colSpan}
      className={cn(
        'h-12 px-4 text-left align-middle font-medium text-muted-foreground',
        '[&:has([role=checkbox])]:pr-0',
      )}
    >
      {header.isPlaceholder
        ? null
        : flexRender(column.columnDef.header, header.getContext())}
    </th>
  );
};
