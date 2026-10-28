import { type MouseEvent, useState } from 'react';
import { cva } from 'class-variance-authority';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  type ButtonProps,
  type ST_ColumnDef,
  type ST_Header,
  type ST_RowData,
  type ST_TableOptions,
} from '@/components/ui/shadcn-table/types';
import { parseFromValuesOrFunc } from '@/components/ui/shadcn-table/shared/utils/utils';
import { ST_Tooltip } from '@/components/ui/shadcn-table/ST_Tooltip';
import { ST_ColumnActionMenu } from '@/components/ui/shadcn-table/components/menus/ST_ColumnActionMenu';

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
  // table.options and the column def hold the part props tree-neutral
  // (ST_NeutralPartPropTypes); the options as written (ST_TableOptions,
  // ST_ColumnDef) type them for this tree's Button.
  const {
    stColumnActionsButtonProps,
  }: Pick<ST_TableOptions<TData>, 'stColumnActionsButtonProps'> = table.options;
  const { column } = header;
  const { columnDef } = column;
  const {
    stColumnActionsButtonProps: columnColumnActionsButtonProps,
  }: Pick<ST_ColumnDef<TData>, 'stColumnActionsButtonProps'> = columnDef;

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
