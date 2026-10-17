import { type MouseEvent, useState } from 'react';
import { cva } from 'class-variance-authority';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  type ButtonProps,
  type SRT_Header,
  type SRT_RowData,
  type SRT_TableInstance,
} from '../types';
import { parseFromValuesOrFunc } from '../utils/utils';
import { SRT_Tooltip } from '../SRT_Tooltip';
import { SRT_ColumnActionMenu } from '../menus/SRT_ColumnActionMenu';

// Note: base maps MRT's sx (m -8px -4px, opacity .3, hover opacity 1, transition all 150ms); 2rem box is icon-sm.
const columnActionsButtonVariants = cva(
  '-mx-1 -my-2 align-middle opacity-30 transition-all duration-150 hover:opacity-100',
);

export interface SRT_TableHeadCellColumnActionsButtonProps<
  TData extends SRT_RowData,
> extends ButtonProps {
  header: SRT_Header<TData>;
  table: SRT_TableInstance<TData>;
}

export const SRT_TableHeadCellColumnActionsButton = <
  TData extends SRT_RowData,
>({
  header,
  table,
  ...rest
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

  const iconButtonProps = {
    ...parseFromValuesOrFunc(srtColumnActionsButtonProps, {
      column,
      table,
    }),
    ...parseFromValuesOrFunc(columnDef.srtColumnActionsButtonProps, {
      column,
      table,
    }),
    ...rest,
  };

  return (
    <>
      <SRT_Tooltip
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
