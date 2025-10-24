import { type RefObject } from 'react';
import {
  type SRT_Row,
  type SRT_RowData,
  type SRT_RowVirtualizer,
  type SRT_TableInstance,
  type SRT_VirtualItem,
} from 'shadcn-react-table-core';
import { cn } from '@/lib/utils';

export interface SRT_TableDetailPanelProps<TData extends SRT_RowData> {
  parentRowRef: RefObject<HTMLTableRowElement | null>;
  row: SRT_Row<TData>;
  rowVirtualizer?: SRT_RowVirtualizer;
  staticRowIndex: number;
  table: SRT_TableInstance<TData>;
  virtualRow?: SRT_VirtualItem;
  className?: string;
}

/**
 * Table detail panel - expandable row content
 *
 * Barebones implementation:
 * - Renders detail panel below row when expanded
 * - Collapse animation with CSS
 * - Full-width cell spanning all columns
 *
 * TODO (Future enhancements):
 * - Add virtual scrolling support
 * - Add srtDetailPanelProps support
 * - Add custom animations
 * - Add loading state
 * - Better collapse animation with Radix UI
 */

export const SRT_TableDetailPanel = <TData extends SRT_RowData>({
  // parentRowRef,
  row,
  // rowVirtualizer,
  staticRowIndex,
  table,
  // virtualRow,
  className,
}: SRT_TableDetailPanelProps<TData>) => {
  const {
    getState,
    getVisibleLeafColumns,
    options: { renderDetailPanel },
  } = table;
  const { isLoading } = getState();

  const DetailPanel = !isLoading && renderDetailPanel?.({ row, table });

  const isExpanded = row.getIsExpanded();

  // TODO: Add custom props support
  // const tableRowProps = parseFromValuesOrFunc(srtTableBodyRowProps, {
  //   isDetailPanel: true,
  //   row,
  //   staticRowIndex,
  //   table,
  // });

  // TODO: Add virtual scrolling support
  // if (virtualRow) {
  //   // Handle virtualized detail panel
  // }

  return (
    <tr
      className={cn('border-b transition-all', className)}
      data-index={renderDetailPanel ? staticRowIndex * 2 + 1 : staticRowIndex}
    >
      <td
        colSpan={getVisibleLeafColumns().length}
        className={cn(
          'overflow-hidden transition-all duration-200',
          isExpanded ? 'py-4' : 'py-0',
        )}
      >
        <div
          className={cn(
            'transition-all duration-200 ease-in-out',
            isExpanded
              ? 'max-h-[1000px] opacity-100'
              : 'max-h-0 opacity-0 invisible',
          )}
        >
          {DetailPanel}
        </div>
      </td>
    </tr>
  );
};
