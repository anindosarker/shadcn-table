import { type MouseEvent, useState } from 'react';
import { cva } from 'class-variance-authority';
import {
  type ButtonProps,
  type SRT_Header,
  type SRT_RowData,
  type SRT_TableInstance,
  parseFromValuesOrFunc,
} from 'shadcn-react-table-core';
import { cn } from '@/lib/utils';
import { SRT_Tooltip } from '../SRT_Tooltip';
import { SRT_ColumnActionMenu } from '../menus/SRT_ColumnActionMenu';

export interface SRT_TableHeadCellColumnActionsButtonProps<
  TData extends SRT_RowData,
> extends ButtonProps {
  header: SRT_Header<TData>;
  table: SRT_TableInstance<TData>;
}

// Base folds MUI IconButton reset defaults (inline-flex centering, rounded)
// per the "MUI defaults count as spec" convention, plus the mapped sx object
// (h-8/w-8 = MUI's 2rem, -my-2/-mx-1 = m:'-8px -4px', opacity + transition).
const columnActionsButtonVariants = cva(
  'inline-flex h-8 w-8 -mx-1 -my-2 items-center justify-center rounded-md opacity-30 transition-all duration-150 hover:opacity-100',
);

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
        <button
          type="button"
          aria-label={localization.columnActions}
          onClick={handleClick}
          // size="small"
          // Note: sizing lives in the h-8/w-8 classes (MUI IconButton size prop dropped).
          {...iconButtonProps}
          className={cn(
            columnActionsButtonVariants(),
            iconButtonProps?.className,
          )}
          title={undefined}
        >
          {iconButtonProps?.children ?? (
            <MoreVertIcon style={{ transform: 'scale(0.9)' }} size={16} />
          )}
        </button>
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
