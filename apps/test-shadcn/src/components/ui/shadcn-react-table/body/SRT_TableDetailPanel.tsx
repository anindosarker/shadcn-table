import { type CSSProperties, type RefObject } from 'react';
import {
  type SRT_Row,
  type SRT_RowData,
  type SRT_RowVirtualizer,
  type SRT_TableInstance,
  type SRT_VirtualItem,
} from 'shadcn-react-table-core';
import { cn } from '@/lib/utils';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';

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
 * Table detail panel - expandable row content rendered beneath its parent row.
 *
 * Ports material-react-table's MRT_TableDetailPanel:
 * - Renders `renderDetailPanel({ row, table })` (suppressed while loading)
 * - Virtualized mode: absolutely positioned with translateY, content rendered
 *   directly only when the row is expanded; measured by the row virtualizer
 * - Non-virtualized mode: shadcn Collapsible (mount on enter / unmount on exit)
 * - Full-width cell spanning all visible leaf columns
 * - data-index parity with MRT (staticRowIndex * 2 + 1 when detail panels are
 *   enabled, so virtual indices interleave row / detail-panel)
 */
export const SRT_TableDetailPanel = <TData extends SRT_RowData>({
  parentRowRef,
  row,
  rowVirtualizer,
  staticRowIndex,
  table,
  virtualRow,
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

  const rowStyle: CSSProperties = {
    position: virtualRow ? 'absolute' : undefined,
    top: virtualRow
      ? `${parentRowRef.current?.getBoundingClientRect()?.height ?? 0}px`
      : undefined,
    transform: virtualRow ? `translateY(${virtualRow.start}px)` : undefined,
    width: '100%',
  };

  return (
    <tr
      className={cn('border-b', !virtualRow && 'transition-all', className)}
      data-index={renderDetailPanel ? staticRowIndex * 2 + 1 : staticRowIndex}
      ref={(node) => {
        if (node) {
          rowVirtualizer?.measureElement?.(node);
        }
      }}
      style={rowStyle}
    >
      <td
        colSpan={getVisibleLeafColumns().length}
        className={cn(
          'w-full overflow-hidden',
          !virtualRow && 'transition-all duration-150 ease-in-out',
          !!DetailPanel && isExpanded ? 'py-4' : 'py-0',
          !isExpanded && 'border-b-0',
        )}
      >
        {virtualRow ? (
          isExpanded && DetailPanel
        ) : (
          <Collapsible open={isExpanded}>
            <CollapsibleContent>{isExpanded && DetailPanel}</CollapsibleContent>
          </Collapsible>
        )}
      </td>
    </tr>
  );
};
