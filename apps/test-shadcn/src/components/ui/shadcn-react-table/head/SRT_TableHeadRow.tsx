import {
  parseFromValuesOrFunc,
  type SRT_ColumnVirtualizer,
  type SRT_Header,
  type SRT_HeaderGroup,
  type SRT_RowData,
  type SRT_TableInstance,
  type SRT_VirtualItem,
  type TableRowProps,
} from 'shadcn-react-table-core';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { SRT_TableHeadCell } from './SRT_TableHeadCell';

export interface SRT_TableHeadRowProps<TData extends SRT_RowData>
  extends TableRowProps {
  columnVirtualizer?: SRT_ColumnVirtualizer;
  headerGroup: SRT_HeaderGroup<TData>;
  table: SRT_TableInstance<TData>;
}

const tableHeadRowVariants = cva(
  'top-0 bg-background shadow-[4px_0_8px_rgba(0,0,0,0.1)]',
  {
    variants: {
      layout: { grid: 'flex', semantic: '' },
      sticky: { true: 'sticky', false: 'relative' },
    },
  },
);

export const SRT_TableHeadRow = <TData extends SRT_RowData>({
  columnVirtualizer,
  headerGroup,
  table,
  ...rest
}: SRT_TableHeadRowProps<TData>) => {
  const {
    options: {
      enableStickyHeader,
      layoutMode,
      // mrtTheme: { baseBackgroundColor },
      // Note: mrtTheme registry dropped project-wide — bg-background handles theming
      srtTableHeadRowProps,
    },
  } = table;

  const { virtualColumns, virtualPaddingLeft, virtualPaddingRight } =
    columnVirtualizer ?? {};

  const tableRowProps = {
    ...parseFromValuesOrFunc(srtTableHeadRowProps, {
      headerGroup,
      table,
    }),
    ...rest,
  };

  return (
    <tr
      {...tableRowProps}
      className={cn(
        tableHeadRowVariants({
          layout: layoutMode?.startsWith('grid') ? 'grid' : 'semantic',
          sticky: !!(enableStickyHeader && layoutMode === 'semantic'),
        }),
        tableRowProps.className,
      )}
    >
      {virtualPaddingLeft ? (
        <th style={{ display: 'flex', width: virtualPaddingLeft }} />
      ) : null}
      {(virtualColumns ?? headerGroup.headers).map(
        (headerOrVirtualHeader, staticColumnIndex) => {
          let header = headerOrVirtualHeader as SRT_Header<TData>;
          if (columnVirtualizer) {
            staticColumnIndex = (headerOrVirtualHeader as SRT_VirtualItem)
              .index;
            header = headerGroup.headers[staticColumnIndex];
          }

          return header ? (
            <SRT_TableHeadCell
              columnVirtualizer={columnVirtualizer}
              header={header}
              key={header.id}
              staticColumnIndex={staticColumnIndex}
              table={table}
            />
          ) : null;
        },
      )}
      {virtualPaddingRight ? (
        <th style={{ display: 'flex', width: virtualPaddingRight }} />
      ) : null}
    </tr>
  );
};
