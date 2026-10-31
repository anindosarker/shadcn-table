import { type RefObject } from 'react';
import { cva } from 'class-variance-authority';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import {
  type ST_Row,
  type ST_RowData,
  type ST_RowVirtualizer,
  type ST_VirtualItem,
  type TableCellProps,
} from '@/components/ui/shadcn-table/types';
import { parseFromValuesOrFunc } from '@/components/ui/shadcn-table/shared/utils/utils';
import { stCollapsibleKeyframes } from '@/components/ui/shadcn-table/shared/utils/style.utils';

export interface ST_TableDetailPanelProps<TData extends ST_RowData>
  extends TableCellProps {
  parentRowRef: RefObject<HTMLTableRowElement | null>;
  row: ST_Row<TData>;
  rowVirtualizer?: ST_RowVirtualizer;
  staticRowIndex: number;
  virtualRow?: ST_VirtualItem;
}

const detailPanelRowVariants = cva('w-full', {
  variants: {
    layout: { grid: 'flex', semantic: '' },
  },
});

const detailPanelCellVariants = cva('w-full border-b text-sm px-4', {
  variants: {
    layout: { grid: 'flex', semantic: '' },
    expanded: { true: '', false: 'border-b-0' },
    padded: { true: 'py-4', false: 'py-0' },
    virtual: {
      true: 'bg-background',
      false: 'transition-all duration-150 ease-in-out',
    },
  },
});

export const ST_TableDetailPanel = <TData extends ST_RowData>({
  parentRowRef,
  row,
  rowVirtualizer,
  staticRowIndex,
  virtualRow,
  ...rest
}: ST_TableDetailPanelProps<TData>) => {
  const table = row.table;
  const {
    getVisibleLeafColumns,
    options: {
      layoutMode,
      renderDetailPanel,
      stDetailPanelProps,
      stTableBodyRowProps,
    },
  } = table;

  const tableRowProps = {
    ...parseFromValuesOrFunc(stTableBodyRowProps, {
      isDetailPanel: true,
      row,
      staticRowIndex,
      table,
    }),
  };
  // `hover` is ST_TableBodyRow's flag, not a <tr> attribute.
  delete tableRowProps.hover;

  const tableCellProps = {
    ...parseFromValuesOrFunc(stDetailPanelProps, {
      row,
      table,
    }),
    ...rest,
  };

  return (
    <table.Subscribe
      selector={(state) => ({
        columnOrder: state.columnOrder,
        columnVisibility: state.columnVisibility,
        grouping: state.grouping,
        isExpanded: row.getIsExpanded(),
        isLoading: state.isLoading,
      })}
    >
      {({ isLoading }) => {
        const DetailPanel = !isLoading && renderDetailPanel?.({ row, table });

        return (
          <tr
            data-index={
              renderDetailPanel ? staticRowIndex * 2 + 1 : staticRowIndex
            }
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
                detailPanelCellVariants({
                  layout: layoutMode?.startsWith('grid') ? 'grid' : 'semantic',
                  expanded: row.getIsExpanded(),
                  padded: !!DetailPanel && row.getIsExpanded(),
                  virtual: !!virtualRow,
                }),
                tableCellProps.align === 'center'
                  ? 'text-center'
                  : tableCellProps.align === 'right'
                    ? 'text-end flex-row-reverse'
                    : tableCellProps.align === 'left'
                      ? 'text-start'
                      : tableCellProps.align === 'justify'
                        ? 'text-justify'
                        : 'text-start',
                tableCellProps?.className,
              )}
            >
              {virtualRow ? (
                row.getIsExpanded() && DetailPanel
              ) : (
                // Base UI sets --collapsible-panel-height, which the st-collapsible-* keyframes read.
                <Collapsible open={row.getIsExpanded()}>
                  <style href="st-collapsible" precedence="low">
                    {stCollapsibleKeyframes}
                  </style>
                  <CollapsibleContent className="overflow-hidden data-open:animate-[st-collapsible-down_200ms_ease-out] data-closed:animate-[st-collapsible-up_200ms_ease-out]">
                    {DetailPanel}
                  </CollapsibleContent>
                </Collapsible>
              )}
            </td>
          </tr>
        );
      }}
    </table.Subscribe>
  );
};
