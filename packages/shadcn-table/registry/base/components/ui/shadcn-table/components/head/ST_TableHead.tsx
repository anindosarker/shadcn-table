import { Subscribe } from '@tanstack/react-table';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import {
  type ST_ColumnVirtualizer,
  type ST_RowData,
  type TableHeadProps,
} from '@/components/ui/shadcn-table/types';
import {
  assignRef,
  parseFromValuesOrFunc,
} from '@/components/ui/shadcn-table/shared/utils/utils';
import { ST_ToolbarAlertBanner } from '@/components/ui/shadcn-table/components/toolbar/ST_ToolbarAlertBanner';
import { ST_TableHeadRow } from '@/components/ui/shadcn-table/components/head/ST_TableHeadRow';
import { useSTContext } from '@/components/ui/shadcn-table/hooks/stTableHook';

export interface ST_TableHeadProps extends TableHeadProps {
  columnVirtualizer?: ST_ColumnVirtualizer;
}

const tableHeadVariants = cva('opacity-[0.97]', {
  variants: {
    layout: { grid: 'grid', semantic: '' },
    sticky: { true: 'sticky z-[2]', false: 'relative' },
  },
  compoundVariants: [{ layout: 'grid', sticky: true, class: 'top-0' }],
});

export const ST_TableHead = <TData extends ST_RowData>({
  columnVirtualizer,
  ...rest
}: ST_TableHeadProps) => {
  const table = useSTContext<TData>();
  const {
    options: {
      enableStickyHeader,
      layoutMode,
      stTableHeadProps,
      positionToolbarAlertBanner,
    },
    refs: { tableHeadRef },
  } = table;

  const tableHeadProps = {
    ...parseFromValuesOrFunc(stTableHeadProps, { table }),
    ...rest,
  };

  const isHeadOverlay = positionToolbarAlertBanner === 'head-overlay';

  // The header groups follow column order, pinning, visibility and grouping;
  // the selected rows only matter while the alert banner overlays the head.
  return (
    <Subscribe
      selector={(state) => ({
        columnOrder: state.columnOrder,
        columnPinning: state.columnPinning,
        columnVisibility: state.columnVisibility,
        grouping: state.grouping,
        isFullScreen: state.isFullScreen,
        rowSelection: isHeadOverlay ? state.rowSelection : null,
        showAlertBanner: isHeadOverlay ? state.showAlertBanner : null,
      })}
      source={table.store}
    >
      {({ isFullScreen, showAlertBanner }) => {
        const stickyHeader = enableStickyHeader || isFullScreen;

        return (
          <thead
            {...tableHeadProps}
            ref={(node: HTMLTableSectionElement) => {
              tableHeadRef.current = node;
              const cleanup = assignRef(tableHeadProps?.ref, node);
              return () => {
                if (typeof cleanup === 'function') {
                  cleanup();
                } else {
                  assignRef(tableHeadProps?.ref, null);
                }
                tableHeadRef.current = null;
              };
            }}
            className={cn(
              tableHeadVariants({
                layout: layoutMode?.startsWith('grid') ? 'grid' : 'semantic',
                sticky: stickyHeader,
              }),
              tableHeadProps.className,
            )}
          >
            {isHeadOverlay &&
            (showAlertBanner || table.getSelectedRowModel().rows.length > 0) ? (
              <tr
                style={{
                  display: layoutMode?.startsWith('grid') ? 'grid' : undefined,
                }}
              >
                <th
                  colSpan={table.getVisibleLeafColumns().length}
                  style={{
                    display: layoutMode?.startsWith('grid')
                      ? 'grid'
                      : undefined,
                    padding: 0,
                  }}
                >
                  <ST_ToolbarAlertBanner />
                </th>
              </tr>
            ) : (
              table
                .getHeaderGroups()
                .map((headerGroup) => (
                  <ST_TableHeadRow
                    columnVirtualizer={columnVirtualizer}
                    headerGroup={headerGroup}
                    key={headerGroup.id}
                  />
                ))
            )}
          </thead>
        );
      }}
    </Subscribe>
  );
};
