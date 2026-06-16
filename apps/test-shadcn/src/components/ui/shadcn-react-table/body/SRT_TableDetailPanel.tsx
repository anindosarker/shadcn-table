import { type CSSProperties, type RefObject } from 'react';
import {
  mergeSRT_HtmlProps,
  parseSRT_HtmlProps,
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
    options: { renderDetailPanel, srtDetailPanelProps, srtTableBodyRowProps },
  } = table;
  const { isLoading } = getState();

  const tableRowProps = parseSRT_HtmlProps(srtTableBodyRowProps, {
    row,
    staticRowIndex,
    table,
  });
  const tableCellProps = parseSRT_HtmlProps(srtDetailPanelProps, {
    row,
    table,
  });

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

  const rowProps = mergeSRT_HtmlProps({ style: rowStyle }, tableRowProps);
  const cellProps = mergeSRT_HtmlProps({}, tableCellProps);

  return (
    <tr
      data-index={renderDetailPanel ? staticRowIndex * 2 + 1 : staticRowIndex}
      ref={(node) => {
        if (node) {
          rowVirtualizer?.measureElement?.(node);
        }
      }}
      {...rowProps}
      className={cn(
        'border-b',
        !virtualRow && 'transition-all',
        className,
        rowProps?.className,
      )}
    >
      <td
        colSpan={getVisibleLeafColumns().length}
        {...cellProps}
        className={cn(
          'w-full overflow-hidden',
          !virtualRow && 'transition-all duration-150 ease-in-out',
          !!DetailPanel && isExpanded ? 'py-4' : 'py-0',
          !isExpanded && 'border-b-0',
          cellProps?.className,
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
