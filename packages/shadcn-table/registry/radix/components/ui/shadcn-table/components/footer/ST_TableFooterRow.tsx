import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import {
  type ST_ColumnVirtualizer,
  type ST_Header,
  type ST_HeaderGroup,
  type ST_RowData,
  type ST_VirtualItem,
  type TableRowProps,
} from '@/components/ui/shadcn-table/types';
import { parseFromValuesOrFunc } from '@/components/ui/shadcn-table/shared/utils/utils';
import { ST_TableFooterCell } from '@/components/ui/shadcn-table/components/footer/ST_TableFooterCell';
import { useSTContext } from '@/components/ui/shadcn-table/hooks/stTableHook';

export interface ST_TableFooterRowProps<TData extends ST_RowData>
  extends TableRowProps {
  columnVirtualizer?: ST_ColumnVirtualizer;
  footerGroup: ST_HeaderGroup<TData>;
}

const tableFooterRowVariants = cva('relative w-full bg-background', {
  variants: {
    layout: { grid: 'flex', semantic: '' },
  },
});

export const ST_TableFooterRow = <TData extends ST_RowData>({
  columnVirtualizer,
  footerGroup,
  ...rest
}: ST_TableFooterRowProps<TData>) => {
  const table = useSTContext<TData>();
  const {
    options: { layoutMode, stTableFooterRowProps },
  } = table;

  const { virtualColumns, virtualPaddingLeft, virtualPaddingRight } =
    columnVirtualizer ?? {};

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
    ...parseFromValuesOrFunc(stTableFooterRowProps, {
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
          let footer = footerOrVirtualFooter as ST_Header<TData>;
          if (columnVirtualizer) {
            staticColumnIndex = (footerOrVirtualFooter as ST_VirtualItem).index;
            footer = footerGroup.headers[staticColumnIndex];
          }

          return footer ? (
            <ST_TableFooterCell
              footer={footer}
              key={footer.id}
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
