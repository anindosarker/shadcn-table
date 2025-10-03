import type { SRT_RowData, SRT_TableInstance } from 'shadcn-react-table-core';
import { SRT_TableHeadRow } from './SRT_TableHeadRow';

export interface SRT_TableHeadProps<TData extends SRT_RowData> {
  table: SRT_TableInstance<TData>;
}

/**
 * Table head component - renders all header groups and rows
 *
 * TODO (Future enhancements):
 * - Sticky header support
 * - Column virtualization
 * - Alert banner overlay (head-overlay position)
 * - Custom thead props
 * - Layout mode support (grid vs semantic)
 */

export const SRT_TableHead = <TData extends SRT_RowData>({
  table,
}: SRT_TableHeadProps<TData>) => {
  const headerGroups = table.getHeaderGroups();

  return (
    <thead className="border-b bg-muted/50">
      {headerGroups.map((headerGroup) => (
        <SRT_TableHeadRow
          key={headerGroup.id}
          headerGroup={headerGroup}
          table={table}
        />
      ))}
    </thead>
  );
};
