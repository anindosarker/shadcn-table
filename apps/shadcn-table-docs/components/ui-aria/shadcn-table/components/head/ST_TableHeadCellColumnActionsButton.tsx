import { type MouseEvent, useState } from 'react';
import { cva } from 'class-variance-authority';
import { Button } from '@/components/ui-aria/button';
import { cn } from '@/lib/utils';
import {
  type ButtonProps,
  type ST_ColumnDef,
  type ST_Header,
  type ST_RowData,
  type ST_TableOptions,
} from '@/components/ui-aria/shadcn-table/types';
import { parseFromValuesOrFunc } from '@/components/ui-aria/shadcn-table/shared/utils/utils';
import { ST_Tooltip } from '@/components/ui-aria/shadcn-table/components/buttons/ST_Tooltip';
import { ST_ColumnActionMenu } from '@/components/ui-aria/shadcn-table/components/menus/ST_ColumnActionMenu';
import { useST_MenuAnchor } from '@/components/ui-aria/shadcn-table/hooks/useST_MenuAnchor';

const columnActionsButtonVariants = cva(
  '-mx-1 -my-2 align-middle opacity-30 transition-all duration-150 hover:opacity-100',
);

export interface ST_TableHeadCellColumnActionsButtonProps<
  TData extends ST_RowData,
> extends ButtonProps {
  header: ST_Header<TData>;
}

export const ST_TableHeadCellColumnActionsButton = <TData extends ST_RowData>({
  header,
  ...rest
}: ST_TableHeadCellColumnActionsButtonProps<TData>) => {
  const table = header.table;
  const {
    options: {
      icons: { MoreVertIcon },
      localization,
    },
  } = table;
  const {
    stColumnActionsButtonProps,
  }: Pick<ST_TableOptions<TData>, 'stColumnActionsButtonProps'> = table.options;
  const { column } = header;
  const { columnDef } = column;
  const {
    stColumnActionsButtonProps: columnColumnActionsButtonProps,
  }: Pick<ST_ColumnDef<TData>, 'stColumnActionsButtonProps'> = columnDef;

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const { openerProps, toggle } = useST_MenuAnchor({
    anchorEl,
    setAnchorEl,
  });

  const handleClick = (event: MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    if (event.currentTarget instanceof HTMLElement) toggle(event.currentTarget);
  };

  const iconButtonProps = {
    ...parseFromValuesOrFunc(stColumnActionsButtonProps, {
      column,
      table,
    }),
    ...parseFromValuesOrFunc(columnColumnActionsButtonProps, {
      column,
      table,
    }),
    ...rest,
  };

  return (
    <>
      <ST_Tooltip
        side="top"
        title={iconButtonProps?.title ?? localization.columnActions}
      >
        <Button
          aria-label={localization.columnActions}
          {...openerProps}
          onClick={handleClick}
          size="icon-sm"
          type="button"
          variant="ghost"
          {...iconButtonProps}
          className={cn(
            columnActionsButtonVariants(),
            iconButtonProps?.className,
          )}
        >
          {iconButtonProps?.children ?? <MoreVertIcon className="scale-90" />}
        </Button>
      </ST_Tooltip>
      {anchorEl && (
        <ST_ColumnActionMenu
          anchorEl={anchorEl}
          header={header}
          setAnchorEl={setAnchorEl}
        />
      )}
    </>
  );
};
