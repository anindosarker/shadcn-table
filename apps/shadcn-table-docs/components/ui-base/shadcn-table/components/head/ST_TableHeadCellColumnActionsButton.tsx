import { type MouseEvent, useState } from 'react';
import { cva } from 'class-variance-authority';
import { Button } from '@/components/ui-base/button';
import { cn } from '@/lib/utils';
import {
  type ButtonProps,
  type ST_Header,
  type ST_RowData,
} from '@/components/ui-base/shadcn-table/types';
import { parseFromValuesOrFunc } from '@/components/ui-base/shadcn-table/shared/utils/utils';
import { ST_Tooltip } from '@/components/ui-base/shadcn-table/ST_Tooltip';
import { ST_ColumnActionMenu } from '@/components/ui-base/shadcn-table/components/menus/ST_ColumnActionMenu';

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
      stColumnActionsButtonProps,
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

  const iconButtonProps = {
    ...parseFromValuesOrFunc(stColumnActionsButtonProps, {
      column,
      table,
    }),
    ...parseFromValuesOrFunc(columnDef.stColumnActionsButtonProps, {
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
          onClick={handleClick}
          size="icon-sm"
          type="button"
          variant="ghost"
          {...iconButtonProps}
          className={cn(
            columnActionsButtonVariants(),
            iconButtonProps?.className,
          )}
          title={undefined}
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
