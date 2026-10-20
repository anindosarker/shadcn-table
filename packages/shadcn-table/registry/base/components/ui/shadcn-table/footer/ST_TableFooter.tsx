import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import {
  type ST_ColumnVirtualizer,
  type ST_RowData,
  type ST_TableInstance,
  type TableFooterProps,
} from '@/components/ui/shadcn-table/types';
import { parseFromValuesOrFunc } from '@/components/ui/shadcn-table/utils/utils';
import { ST_TableFooterRow } from '@/components/ui/shadcn-table/footer/ST_TableFooterRow';

export interface ST_TableFooterProps<TData extends ST_RowData>
  extends TableFooterProps {
  columnVirtualizer?: ST_ColumnVirtualizer;
  table: ST_TableInstance<TData>;
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
  table,
  ...rest
}: ST_TableFooterProps<TData>) => {
  const {
    options: { enableStickyFooter, layoutMode, stTableFooterProps },
    refs: { tableFooterRef },
  } = table;
  const { isFullScreen } = table.state;

  const tableFooterProps = {
    ...parseFromValuesOrFunc(stTableFooterProps, { table }),
    ...rest,
  };

  const stickFooter =
    (isFullScreen || enableStickyFooter) && enableStickyFooter !== false;

  const footerGroups = table.getFooterGroups();

  //if no footer cells at all, skip footer
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
      ref={(ref: HTMLTableSectionElement) => {
        tableFooterRef.current = ref;
        if (tableFooterProps?.ref) {
          //@ts-expect-error ref can be either RefCallback or RefObject
          tableFooterProps.ref.current = ref;
        }
      }}
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
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          footerGroup={footerGroup as any}
          key={footerGroup.id}
          table={table}
        />
      ))}
    </tfoot>
  );
};
