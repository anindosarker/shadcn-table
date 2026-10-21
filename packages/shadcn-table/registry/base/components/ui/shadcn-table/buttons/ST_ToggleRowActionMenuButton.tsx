import { type MouseEvent, useState } from 'react';
import { cva } from 'class-variance-authority';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  type ButtonProps,
  type ST_Cell,
  type ST_Row,
  type ST_RowData,
  type ST_TableInstance,
} from '@/components/ui/shadcn-table/types';
import { parseFromValuesOrFunc } from '@/components/ui/shadcn-table/utils/utils';
import { ST_Tooltip } from '@/components/ui/shadcn-table/ST_Tooltip';
import { ST_EditActionButtons } from '@/components/ui/shadcn-table/buttons/ST_EditActionButtons';
import { ST_RowActionMenu } from '@/components/ui/shadcn-table/menus/ST_RowActionMenu';

// height: '2rem', width: '2rem', opacity: 0.5, '&:hover': { opacity: 1 }, transition: 'opacity 150ms'
// Note: size/opacity overrides dropped per the buttons sweep ruling.
const commonIconButtonStyles = cva('ml-2.5');

export interface ST_ToggleRowActionMenuButtonProps<TData extends ST_RowData>
  extends ButtonProps {
  cell: ST_Cell<TData>;
  row: ST_Row<TData>;
  staticRowIndex?: number;
  table: ST_TableInstance<TData>;
}

export const ST_ToggleRowActionMenuButton = <TData extends ST_RowData>({
  cell,
  row,
  staticRowIndex,
  table,
  ...rest
}: ST_ToggleRowActionMenuButtonProps<TData>) => {
  const {
    options: {
      createDisplayMode,
      editDisplayMode,
      enableEditing,
      icons: { EditIcon, MoreHorizIcon },
      localization,
      renderRowActionMenuItems,
      renderRowActions,
    },
    setEditingRow,
  } = table;

  const { creatingRow, editingRow } = table.state;

  const isCreating = creatingRow?.id === row.id;
  const isEditing = editingRow?.id === row.id;

  const showEditActionButtons =
    (isCreating && createDisplayMode === 'row') ||
    (isEditing && editDisplayMode === 'row');

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleOpenRowActionMenu = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    event.preventDefault();
    setAnchorEl(event.currentTarget);
  };

  const handleStartEditMode = (event: MouseEvent) => {
    event.stopPropagation();
    setEditingRow({ ...row });
    setAnchorEl(null);
  };

  return (
    <>
      {renderRowActions && !showEditActionButtons ? (
        renderRowActions({ cell, row, staticRowIndex, table })
      ) : showEditActionButtons ? (
        <ST_EditActionButtons row={row} table={table} />
      ) : !renderRowActionMenuItems &&
        parseFromValuesOrFunc(enableEditing, row) &&
        ['modal', 'row'].includes(editDisplayMode!) ? (
        <ST_Tooltip side="right" title={localization.edit}>
          <Button
            aria-label={localization.edit}
            onClick={handleStartEditMode}
            size="icon"
            type="button"
            variant="ghost"
            {...rest}
            className={cn(commonIconButtonStyles(), rest.className)}
          >
            <EditIcon />
          </Button>
        </ST_Tooltip>
      ) : renderRowActionMenuItems?.({
          row,
          staticRowIndex,
          table,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any)?.length ? (
        <>
          <ST_Tooltip title={localization.rowActions}>
            <Button
              aria-label={localization.rowActions}
              onClick={handleOpenRowActionMenu}
              size="icon-sm"
              type="button"
              variant="ghost"
              {...rest}
              className={cn(commonIconButtonStyles(), rest.className)}
            >
              <MoreHorizIcon />
            </Button>
          </ST_Tooltip>
          <ST_RowActionMenu
            anchorEl={anchorEl}
            handleEdit={handleStartEditMode}
            row={row}
            setAnchorEl={setAnchorEl}
            staticRowIndex={staticRowIndex}
            table={table}
          />
        </>
      ) : null}
    </>
  );
};
