import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import {
  type ST_ColumnVirtualizer,
  type ST_RowData,
  type TableFooterProps,
} from '@/components/ui/shadcn-table/types';
import { parseFromValuesOrFunc } from '@/components/ui/shadcn-table/shared/utils/utils';
import { ST_TableFooterRow } from '@/components/ui/shadcn-table/components/footer/ST_TableFooterRow';
import { useSTContext } from '@/components/ui/shadcn-table/hooks/stTableHook';
import { useST_ComposedRef } from '@/components/ui/shadcn-table/hooks/useST_ComposedRef';

export interface ST_TableFooterProps extends TableFooterProps {
  columnVirtualizer?: ST_ColumnVirtualizer;
}

const tableFooterVariants = cva('', {
  variants: {
    layout: { grid: 'grid', semantic: '' },
    sticky: {
      true: 'bottom-0 sticky z-[1] opacity-[0.97] outline outline-1 outline-border',
      false: 'relative',
    },
  },
});

export const ST_TableFooter = <TData extends ST_RowData>({
  columnVirtualizer,
  ...rest
}: ST_TableFooterProps) => {
  const table = useSTContext<TData>();
  const {
    options: { enableStickyFooter, layoutMode, stTableFooterProps },
    refs: { tableFooterRef },
  } = table;

  const tableFooterProps = {
    ...parseFromValuesOrFunc(stTableFooterProps, { table }),
    ...rest,
  };

  const attachRef = useST_ComposedRef(tableFooterRef, tableFooterProps.ref);

  return (
    // The footer groups follow the column order, pinning, visibility and
    // grouping.
    <table.Subscribe
      selector={(state) => ({
        columnOrder: state.columnOrder,
        columnPinning: state.columnPinning,
        columnVisibility: state.columnVisibility,
        grouping: state.grouping,
        isFullScreen: state.isFullScreen,
      })}
    >
      {({ isFullScreen }) => {
        const stickFooter =
          (isFullScreen || enableStickyFooter) && enableStickyFooter !== false;

        const footerGroups = table.getFooterGroups();

        if (
          !footerGroups.some((footerGroup) =>
            footerGroup.headers?.some(
              (header) =>
                (typeof header.column.columnDef.footer === 'string' &&
                  !!header.column.columnDef.footer) ||
                header.column.columnDef.Footer,
            ),
          )
        ) {
          return null;
        }

        return (
          <tfoot
            {...tableFooterProps}
            ref={attachRef}
            className={cn(
              tableFooterVariants({
                layout: layoutMode?.startsWith('grid') ? 'grid' : 'semantic',
                sticky: !!stickFooter,
              }),
              tableFooterProps.className,
            )}
          >
            {footerGroups.map((footerGroup) => (
              <ST_TableFooterRow
                columnVirtualizer={columnVirtualizer}
                footerGroup={footerGroup}
                key={footerGroup.id}
              />
            ))}
          </tfoot>
        );
      }}
    </table.Subscribe>
  );
};
