import { Button } from '@/components/ui-base/button';
import { cn } from '@/lib/utils';
import {
  type ButtonProps,
  type ST_ColumnDef,
  type ST_Header,
  type ST_RowData,
  type ST_TableOptions,
} from '@/components/ui-base/shadcn-table/types';
import { parseFromValuesOrFunc } from '@/components/ui-base/shadcn-table/shared/utils/utils';
import { ST_ColumnActionMenu } from '@/components/ui-base/shadcn-table/components/menus/ST_ColumnActionMenu';

export interface ST_TableHeadCellColumnActionsButtonProps<
  TData extends ST_RowData,
> extends ButtonProps {
  header: ST_Header<TData>;
  /** Called when the column menu opens or closes; pairs with `open`. */
  onOpenChange?: (open: boolean) => void;
  /** Whether the column menu is open; the menu keeps its own state without it. */
  open?: boolean;
}

/** The header's chevron: the trigger of the column menu. */
export const ST_TableHeadCellColumnActionsButton = <TData extends ST_RowData>({
  header,
  onOpenChange,
  open,
  ...rest
}: ST_TableHeadCellColumnActionsButtonProps<TData>) => {
  const table = header.table;
  const {
    options: {
      icons: { ExpandMoreIcon },
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
    <ST_ColumnActionMenu
      header={header}
      onOpenChange={onOpenChange}
      open={open}
      trigger={
        <Button
          aria-label={localization.columnActions}
          size="icon-xs"
          type="button"
          variant="ghost"
          {...iconButtonProps}
          className={cn('ms-auto shrink-0', iconButtonProps?.className)}
        >
          {iconButtonProps?.children ?? <ExpandMoreIcon />}
        </Button>
      }
    />
  );
};
