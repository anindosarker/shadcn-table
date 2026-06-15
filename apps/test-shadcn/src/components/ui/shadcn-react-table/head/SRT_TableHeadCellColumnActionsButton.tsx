import { type MouseEvent, useState } from 'react';
import {
  type SRT_Header,
  type SRT_RowData,
  type SRT_TableInstance,
  mergeSRT_HtmlProps,
  parseSRT_HtmlProps,
} from 'shadcn-react-table-core';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { SRT_Tooltip } from '../SRT_Tooltip';
import { SRT_ColumnActionMenu } from '../menus/SRT_ColumnActionMenu';

export interface SRT_TableHeadCellColumnActionsButtonProps<
  TData extends SRT_RowData,
> {
  header: SRT_Header<TData>;
  table: SRT_TableInstance<TData>;
  className?: string;
}

/**
 * Column actions button - opens the column action menu.
 *
 * Ported 1:1 from MRT_TableHeadCellColumnActionsButton:
 * - More icon button (from the icon registry) with a tooltip
 *   (localization.columnActions).
 * - Hover raises opacity from 0.3 to 1.
 * - Click captures the anchor element and opens SRT_ColumnActionMenu.
 * - Resolves the `srtColumnActionsButtonProps` slot (table-level then columnDef,
 *   columnDef winning) and composes its handlers/`className` over the library
 *   defaults via mergeSRT_HtmlProps. `children` overrides the default icon.
 */

export const SRT_TableHeadCellColumnActionsButton = <
  TData extends SRT_RowData,
>({
  header,
  table,
  className,
}: SRT_TableHeadCellColumnActionsButtonProps<TData>) => {
  const {
    options: {
      icons: { MoreVertIcon },
      localization,
      srtColumnActionsButtonProps,
    },
  } = table;
  const { column } = header;
  const { columnDef } = column;

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    event.preventDefault();
    setAnchorEl(event.currentTarget);
  };

  // Merge table-level then column-level slot props (columnDef wins), composing
  // over the library's own handlers/className via mergeSRT_HtmlProps.
  const tableActionsProps = parseSRT_HtmlProps(srtColumnActionsButtonProps, {
    column,
    table,
  });
  const columnActionsProps = parseSRT_HtmlProps(
    columnDef.srtColumnActionsButtonProps,
    { column, table },
  );
  const userActionsProps = mergeSRT_HtmlProps(
    tableActionsProps,
    columnActionsProps,
  );

  const { children, title, ...restActionsProps } = userActionsProps ?? {};

  const baseActionsProps = {
    'aria-label': localization.columnActions,
    onClick: handleClick,
    className: cn(
      'h-8 w-8 opacity-30 transition-opacity hover:opacity-100 group-hover:opacity-100',
      className,
    ),
  };
  const mergedActionsProps = mergeSRT_HtmlProps(
    baseActionsProps,
    restActionsProps,
  );

  return (
    <>
      <SRT_Tooltip title={title ?? localization.columnActions}>
        <Button variant="ghost" size="icon" {...mergedActionsProps}>
          {children ?? <MoreVertIcon className="h-3.5 w-3.5" />}
        </Button>
      </SRT_Tooltip>
      {anchorEl && (
        <SRT_ColumnActionMenu
          anchorEl={anchorEl}
          header={header}
          setAnchorEl={setAnchorEl}
          table={table}
        />
      )}
    </>
  );
};
