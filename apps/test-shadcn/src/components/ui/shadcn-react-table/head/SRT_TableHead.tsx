import {
  parseFromValuesOrFunc,
  type SRT_ColumnVirtualizer,
  type SRT_RowData,
  type SRT_TableInstance,
  type TableSectionProps,
} from 'shadcn-react-table-core';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { SRT_ToolbarAlertBanner } from '../toolbar/SRT_ToolbarAlertBanner';
import { SRT_TableHeadRow } from './SRT_TableHeadRow';

export interface SRT_TableHeadProps<TData extends SRT_RowData>
  extends TableSectionProps {
  columnVirtualizer?: SRT_ColumnVirtualizer;
  table: SRT_TableInstance<TData>;
}

const tableHeadVariants = cva('opacity-[0.97]', {
  variants: {
    layout: { grid: 'grid', semantic: '' },
    sticky: { true: 'sticky z-[2]', false: 'relative' },
  },
  compoundVariants: [{ layout: 'grid', sticky: true, class: 'top-0' }],
});

export const SRT_TableHead = <TData extends SRT_RowData>({
  columnVirtualizer,
  table,
  ...rest
}: SRT_TableHeadProps<TData>) => {
  const {
    getState,
    options: {
      enableStickyHeader,
      layoutMode,
      srtTableHeadProps,
      positionToolbarAlertBanner,
    },
    refs: { tableHeadRef },
  } = table;
  const { isFullScreen, showAlertBanner } = getState();

  const tableHeadProps = {
    ...parseFromValuesOrFunc(srtTableHeadProps, { table }),
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
            <SRT_ToolbarAlertBanner table={table} />
          </th>
        </tr>
      ) : (
        table
          .getHeaderGroups()
          .map((headerGroup) => (
            <SRT_TableHeadRow
              columnVirtualizer={columnVirtualizer}
              headerGroup={headerGroup}
              key={headerGroup.id}
              table={table}
            />
          ))
      )}
    </thead>
  );
};
