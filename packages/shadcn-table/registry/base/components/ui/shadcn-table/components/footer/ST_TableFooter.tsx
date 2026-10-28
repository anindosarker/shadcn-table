import { useCallback, useRef } from 'react';
import { Subscribe } from '@tanstack/react-table';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import {
  type ST_ColumnVirtualizer,
  type ST_RowData,
  type TableFooterProps,
} from '@/components/ui/shadcn-table/types';
import {
  assignRef,
  parseFromValuesOrFunc,
} from '@/components/ui/shadcn-table/shared/utils/utils';
import { ST_TableFooterRow } from '@/components/ui/shadcn-table/components/footer/ST_TableFooterRow';
import { useSTContext } from '@/components/ui/shadcn-table/hooks/stTableHook';

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

  // The user's ref is read through a ref so the callback keeps one identity:
  // a new callback each render would detach and reattach the node, leaving
  // tableFooterRef null while the children's layout effects run.
  const userRef = useRef(tableFooterProps.ref);
  userRef.current = tableFooterProps.ref;
  const attachRef = useCallback(
    (node: HTMLTableSectionElement) => {
      tableFooterRef.current = node;
      const ref = userRef.current;
      const cleanup = assignRef(ref, node);
      return () => {
        if (typeof cleanup === 'function') {
          cleanup();
        } else {
          assignRef(ref, null);
        }
        tableFooterRef.current = null;
      };
    },
    [tableFooterRef],
  );

  return (
    // The footer groups follow the column order, pinning, visibility and
    // grouping.
    <Subscribe
      selector={(state) => ({
        columnOrder: state.columnOrder,
        columnPinning: state.columnPinning,
        columnVisibility: state.columnVisibility,
        grouping: state.grouping,
        isFullScreen: state.isFullScreen,
      })}
      source={table.store}
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
    </Subscribe>
  );
};
