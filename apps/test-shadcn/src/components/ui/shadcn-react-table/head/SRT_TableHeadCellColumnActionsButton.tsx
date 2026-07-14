import { type MouseEvent, useState } from 'react';
import {
  type ButtonProps,
  type SRT_Header,
  type SRT_RowData,
  type SRT_TableInstance,
  parseFromValuesOrFunc,
} from 'shadcn-react-table-core';
import { Button } from '@/components/ui/button';
import { SRT_Tooltip } from '../SRT_Tooltip';
import { SRT_ColumnActionMenu } from '../menus/SRT_ColumnActionMenu';

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
          variant="ghost"
          size="icon"
          type="button"
          aria-label={localization.columnActions}
          onClick={handleClick}
          // size="small"
          // Note: MUI IconButton sx dropped (h/w 2rem, m:'-8px -4px', opacity
          // 0.3 + hover:1, transition 150ms) — shadcn ghost/icon default wins.
          {...iconButtonProps}
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
