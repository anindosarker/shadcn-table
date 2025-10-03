import type {
  SRT_HeaderGroup,
  SRT_RowData,
  SRT_TableInstance,
} from 'shadcn-react-table-core';
import { SRT_TableHeadCell } from './SRT_TableHeadCell';

export interface SRT_TableHeadRowProps<TData extends SRT_RowData> {
  headerGroup: SRT_HeaderGroup<TData>;
  table: SRT_TableInstance<TData>;
}

/**
 * Table head row component - renders a single header row with all its cells
 *
 * TODO (Future enhancements):
 * - Column virtualization support (virtualColumns, virtualPaddingLeft/Right)
 * - Custom row props
 * - Layout mode support (grid vs semantic)
 */

export const SRT_TableHeadRow = <TData extends SRT_RowData>({
  headerGroup,
  table,
}: SRT_TableHeadRowProps<TData>) => {
  return (
    <tr className="border-b transition-colors hover:bg-muted/50">
      {headerGroup.headers.map((header) => (
        <SRT_TableHeadCell key={header.id} header={header} table={table} />
      ))}
    </tr>
  );
};
