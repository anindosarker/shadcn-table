import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import {
  type ST_ColumnVirtualizer,
  type ST_Header,
  type ST_HeaderGroup,
  type ST_RowData,
  type ST_VirtualItem,
  type TableRowProps,
} from '@/components/ui-base/shadcn-table/types';
import { parseFromValuesOrFunc } from '@/components/ui-base/shadcn-table/shared/utils/utils';
import { ST_TableHeadCell } from '@/components/ui-base/shadcn-table/components/head/ST_TableHeadCell';
import { useSTContext } from '@/components/ui-base/shadcn-table/hooks/stTableHook';

export interface ST_TableHeadRowProps<TData extends ST_RowData>
  extends TableRowProps {
  columnVirtualizer?: ST_ColumnVirtualizer;
  headerGroup: ST_HeaderGroup<TData>;
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

export const ST_TableHeadRow = <TData extends ST_RowData>({
  columnVirtualizer,
  headerGroup,
  ...rest
}: ST_TableHeadRowProps<TData>) => {
  const table = useSTContext<TData>();
  const {
    options: {
      enableStickyHeader,
      layoutMode,
      // mrtTheme: { baseBackgroundColor },
      // Note: mrtTheme registry dropped project-wide: bg-background handles theming
      stTableHeadRowProps,
    },
  } = table;

  const { virtualColumns, virtualPaddingLeft, virtualPaddingRight } =
    columnVirtualizer ?? {};

  const tableRowProps = {
    ...parseFromValuesOrFunc(stTableHeadRowProps, {
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
          let header = headerOrVirtualHeader as ST_Header<TData>;
          if (columnVirtualizer) {
            staticColumnIndex = (headerOrVirtualHeader as ST_VirtualItem).index;
            header = headerGroup.headers[staticColumnIndex];
          }

          return header ? (
            <ST_TableHeadCell
              columnVirtualizer={columnVirtualizer}
              header={header}
              key={header.id}
              staticColumnIndex={staticColumnIndex}
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
