import {
  parseFromValuesOrFunc,
  type SRT_ColumnVirtualizer,
  type SRT_RowData,
  type SRT_TableInstance,
  type TableSectionProps,
} from 'shadcn-react-table-core';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { SRT_TableFooterRow } from './SRT_TableFooterRow';

export interface SRT_TableFooterProps<TData extends SRT_RowData>
  extends TableSectionProps {
  columnVirtualizer?: SRT_ColumnVirtualizer;
  table: SRT_TableInstance<TData>;
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

export const SRT_TableFooter = <TData extends SRT_RowData>({
  columnVirtualizer,
  table,
  ...rest
}: SRT_TableFooterProps<TData>) => {
  const {
    getState,
    options: { enableStickyFooter, layoutMode, srtTableFooterProps },
    refs: { tableFooterRef },
  } = table;
  const { isFullScreen } = getState();

  const tableFooterProps = {
    ...parseFromValuesOrFunc(srtTableFooterProps, { table }),
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
        <SRT_TableFooterRow
          columnVirtualizer={columnVirtualizer}
          footerGroup={footerGroup}
          key={footerGroup.id}
          table={table}
        />
      ))}
    </tfoot>
  );
};
