import { type RefObject } from 'react';
import {
  parseFromValuesOrFunc,
  type SRT_Row,
  type SRT_RowData,
  type SRT_RowVirtualizer,
  type SRT_TableInstance,
  type SRT_VirtualItem,
  type TdProps,
} from 'shadcn-react-table-core';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

export interface SRT_TableDetailPanelProps<TData extends SRT_RowData>
  extends TdProps {
  parentRowRef: RefObject<HTMLTableRowElement | null>;
  row: SRT_Row<TData>;
  rowVirtualizer?: SRT_RowVirtualizer;
  staticRowIndex: number;
  table: SRT_TableInstance<TData>;
  virtualRow?: SRT_VirtualItem;
}

const detailPanelRowVariants = cva('w-full', {
  variants: {
    layout: { grid: 'flex', semantic: '' },
  },
});

const detailPanelCellVariants = cva('w-full', {
  variants: {
    layout: { grid: 'flex', semantic: '' },
    padded: { true: 'py-4', false: 'py-0' },
    expanded: { true: '', false: 'border-b-0' },
    virtual: {
      true: 'bg-background',
      false: 'transition-all duration-150 ease-in-out',
    },
  },
});

export const SRT_TableDetailPanel = <TData extends SRT_RowData>({
  parentRowRef,
  row,
  rowVirtualizer,
  staticRowIndex,
  table,
  virtualRow,
  ...rest
}: SRT_TableDetailPanelProps<TData>) => {
  const {
    getState,
    getVisibleLeafColumns,
    options: {
      layoutMode,
      // mrtTheme: { baseBackgroundColor },
      // Note: mrtTheme registry dropped project-wide — bg-background handles theming
      renderDetailPanel,
      srtDetailPanelProps,
      srtTableBodyRowProps,
    },
  } = table;
  const { isLoading } = getState();

  const tableRowProps = parseFromValuesOrFunc(srtTableBodyRowProps, {
    isDetailPanel: true,
    row,
    staticRowIndex,
    table,
  });

  const tableCellProps = {
    ...parseFromValuesOrFunc(srtDetailPanelProps, {
      row,
      table,
    }),
    ...rest,
  };

  const DetailPanel = !isLoading && renderDetailPanel?.({ row, table });

  return (
    <tr
      data-index={renderDetailPanel ? staticRowIndex * 2 + 1 : staticRowIndex}
      ref={(node: HTMLTableRowElement) => {
        if (node) {
          rowVirtualizer?.measureElement?.(node);
        }
      }}
      {...tableRowProps}
      style={{
        position: virtualRow ? 'absolute' : undefined,
        top: virtualRow
          ? `${parentRowRef.current?.getBoundingClientRect()?.height}px`
          : undefined,
        transform: virtualRow
          ? `translateY(${virtualRow?.start}px)`
          : undefined,
        ...tableRowProps?.style,
      }}
      className={cn(
        'Srt-TableBodyCell-DetailPanel',
        detailPanelRowVariants({
          layout: layoutMode?.startsWith('grid') ? 'grid' : 'semantic',
        }),
        tableRowProps?.className,
      )}
    >
      <td
        colSpan={getVisibleLeafColumns().length}
        {...tableCellProps}
        className={cn(
          'Srt-TableBodyCell-DetailPanel',
          detailPanelCellVariants({
            layout: layoutMode?.startsWith('grid') ? 'grid' : 'semantic',
            padded: !!DetailPanel && row.getIsExpanded(),
            expanded: row.getIsExpanded(),
            virtual: !!virtualRow,
          }),
          tableCellProps?.className,
        )}
      >
        {virtualRow
          ? row.getIsExpanded() && DetailPanel
          : // <Collapse in={row.getIsExpanded()} mountOnEnter unmountOnExit>{DetailPanel}</Collapse>
            // Note: MUI Collapse dropped — the conditional render preserves its
            // mountOnEnter/unmountOnExit semantics (mount only while expanded,
            // unmount when collapsed); expand/collapse animation deferred.
            row.getIsExpanded() && DetailPanel}
      </td>
    </tr>
  );
};
