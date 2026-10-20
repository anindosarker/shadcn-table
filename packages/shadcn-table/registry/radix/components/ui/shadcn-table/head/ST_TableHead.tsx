import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import {
  type ST_ColumnVirtualizer,
  type ST_RowData,
  type ST_TableInstance,
  type TableHeadProps,
} from '@/components/ui/shadcn-table/types';
import { parseFromValuesOrFunc } from '@/components/ui/shadcn-table/utils/utils';
import { ST_ToolbarAlertBanner } from '@/components/ui/shadcn-table/toolbar/ST_ToolbarAlertBanner';
import { ST_TableHeadRow } from '@/components/ui/shadcn-table/head/ST_TableHeadRow';

export interface ST_TableHeadProps<TData extends ST_RowData>
  extends TableHeadProps {
  columnVirtualizer?: ST_ColumnVirtualizer;
  table: ST_TableInstance<TData>;
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
  table,
  ...rest
}: ST_TableHeadProps<TData>) => {
  const {
    options: {
      enableStickyHeader,
      layoutMode,
      stTableHeadProps,
      positionToolbarAlertBanner,
    },
    refs: { tableHeadRef },
  } = table;
  const { isFullScreen, showAlertBanner } = table.state;

  const tableHeadProps = {
    ...parseFromValuesOrFunc(stTableHeadProps, { table }),
    ...rest,
  };

  const stickyHeader = enableStickyHeader || isFullScreen;

  return (
    <thead
      {...tableHeadProps}
      ref={(ref: HTMLTableSectionElement) => {
        tableHeadRef.current = ref;
        if (tableHeadProps?.ref) {
          //@ts-expect-error ref can be either RefCallback or RefObject
          tableHeadProps.ref.current = ref;
        }
      }}
      className={cn(
        tableHeadVariants({
          layout: layoutMode?.startsWith('grid') ? 'grid' : 'semantic',
          sticky: stickyHeader,
        }),
        tableHeadProps.className,
      )}
    >
      {positionToolbarAlertBanner === 'head-overlay' &&
      (showAlertBanner || table.getSelectedRowModel().rows.length > 0) ? (
        <tr
          style={{
            display: layoutMode?.startsWith('grid') ? 'grid' : undefined,
          }}
        >
          <th
            colSpan={table.getVisibleLeafColumns().length}
            style={{
              display: layoutMode?.startsWith('grid') ? 'grid' : undefined,
              padding: 0,
            }}
          >
            <ST_ToolbarAlertBanner table={table} />
          </th>
        </tr>
      ) : (
        table.getHeaderGroups().map((headerGroup) => (
          <ST_TableHeadRow
            columnVirtualizer={columnVirtualizer}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            headerGroup={headerGroup as any}
            key={headerGroup.id}
            table={table}
          />
        ))
      )}
    </thead>
  );
};
