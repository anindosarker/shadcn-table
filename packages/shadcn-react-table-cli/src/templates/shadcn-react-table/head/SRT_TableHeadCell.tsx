import {
  flexRender,
  type SRT_Header,
  type SRT_RowData,
  type SRT_TableInstance,
} from 'shadcn-react-table-core';
import { cn } from '@/lib/utils';
import { cva } from 'class-variance-authority';

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
  const { density } = table.getState();

  return (
    <th colSpan={header.colSpan} className={cn(headCellVariants({ density }))}>
      {header.isPlaceholder
        ? null
        : flexRender(column.columnDef.header, header.getContext())}
    </th>
  );
};
