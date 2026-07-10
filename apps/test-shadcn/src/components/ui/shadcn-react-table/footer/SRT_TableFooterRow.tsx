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
import { SRT_TableFooterCell } from './SRT_TableFooterCell';

export interface SRT_TableFooterRowProps<TData extends SRT_RowData>
  extends TableRowProps {
  columnVirtualizer?: SRT_ColumnVirtualizer;
  footerGroup: SRT_HeaderGroup<TData>;
  table: SRT_TableInstance<TData>;
}

const tableFooterRowVariants = cva('relative w-full bg-background', {
  variants: {
    layout: { grid: 'flex', semantic: '' },
  },
});

export const SRT_TableFooterRow = <TData extends SRT_RowData>({
  columnVirtualizer,
  footerGroup,
  table,
  ...rest
}: SRT_TableFooterRowProps<TData>) => {
  const {
    options: {
      layoutMode,
      // mrtTheme: { baseBackgroundColor },
      // Note: mrtTheme registry dropped project-wide — bg-background handles theming
      srtTableFooterRowProps,
    },
  } = table;

  const { virtualColumns, virtualPaddingLeft, virtualPaddingRight } =
    columnVirtualizer ?? {};

  // if no content in row, skip row
  if (
    !footerGroup.headers?.some(
      (header) =>
        (typeof header.column.columnDef.footer === 'string' &&
          !!header.column.columnDef.footer) ||
        header.column.columnDef.Footer,
    )
  ) {
    return null;
  }

  const tableRowProps = {
    ...parseFromValuesOrFunc(srtTableFooterRowProps, {
      footerGroup,
      table,
    }),
    ...rest,
  };

  return (
    <tr
      {...tableRowProps}
      className={cn(
        tableFooterRowVariants({
          layout: layoutMode?.startsWith('grid') ? 'grid' : 'semantic',
        }),
        tableRowProps.className,
      )}
    >
      {virtualPaddingLeft ? (
        <th style={{ display: 'flex', width: virtualPaddingLeft }} />
      ) : null}
      {(virtualColumns ?? footerGroup.headers).map(
        (footerOrVirtualFooter, staticColumnIndex) => {
          let footer = footerOrVirtualFooter as SRT_Header<TData>;
          if (columnVirtualizer) {
            staticColumnIndex = (footerOrVirtualFooter as SRT_VirtualItem)
              .index;
            footer = footerGroup.headers[staticColumnIndex];
          }

          return footer ? (
            <SRT_TableFooterCell
              footer={footer}
              key={footer.id}
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
