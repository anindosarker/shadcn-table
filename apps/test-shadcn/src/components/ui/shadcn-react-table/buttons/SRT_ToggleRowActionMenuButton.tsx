import { type MouseEvent, useState } from 'react';
import { cva } from 'class-variance-authority';
import {
  type ButtonProps,
  type SRT_Cell,
  type SRT_Row,
  type SRT_RowData,
  type SRT_TableInstance,
  parseFromValuesOrFunc,
} from 'shadcn-react-table-core';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { SRT_Tooltip } from '../SRT_Tooltip';
import { SRT_EditActionButtons } from './SRT_EditActionButtons';
import { SRT_RowActionMenu } from '../menus/SRT_RowActionMenu';

// Note: dropped MUI sx style overrides — h-8 w-8 (size; size="icon"/size-9 wins),
// opacity-50 + hover:opacity-100 (opacity) and transition-opacity (paired with
// that opacity). The row-action button now renders at full opacity per the sweep
// ruling. Kept: ml-2.5 (layout, MUI ml:10px).
const commonIconButtonStyles = cva('ml-2.5');

export interface SRT_ToggleRowActionMenuButtonProps<TData extends SRT_RowData>
  extends ButtonProps {
  cell: SRT_Cell<TData>;
  row: SRT_Row<TData>;
  staticRowIndex?: number;
  table: SRT_TableInstance<TData>;
}

export const SRT_ToggleRowActionMenuButton = <TData extends SRT_RowData>({
  cell,
  row,
  staticRowIndex,
  table,
  ...rest
}: SRT_ToggleRowActionMenuButtonProps<TData>) => {
  const {
    getState,
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

  const { creatingRow, editingRow } = getState();

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
        <SRT_EditActionButtons row={row} table={table} />
      ) : !renderRowActionMenuItems &&
        parseFromValuesOrFunc(enableEditing, row) &&
        ['modal', 'row'].includes(editDisplayMode!) ? (
        <SRT_Tooltip side="right" title={localization.edit}>
          <Button
            aria-label={localization.edit}
            onClick={handleStartEditMode}
            size="icon"
            variant="ghost"
            {...rest}
            className={cn(
              commonIconButtonStyles({ className: rest.className }),
            )}
          >
            <EditIcon />
          </Button>
        </SRT_Tooltip>
      ) : renderRowActionMenuItems?.({
          row,
          staticRowIndex,
          table,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any)?.length ? (
        <>
          <SRT_Tooltip title={localization.rowActions}>
            <Button
              aria-label={localization.rowActions}
              onClick={handleOpenRowActionMenu}
              size="icon"
              variant="ghost"
              {...rest}
              className={cn(
                commonIconButtonStyles({ className: rest.className }),
              )}
            >
              <MoreHorizIcon />
            </Button>
          </SRT_Tooltip>
          <SRT_RowActionMenu
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
