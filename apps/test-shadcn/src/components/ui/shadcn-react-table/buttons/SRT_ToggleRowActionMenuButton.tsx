import { type MouseEvent, useState } from 'react';
import {
  type SRT_Cell,
  type SRT_Row,
  type SRT_RowData,
  type SRT_TableInstance,
  parseFromValuesOrFunc,
} from 'shadcn-react-table-core';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { SRT_EditActionButtons } from './SRT_EditActionButtons';
import { SRT_Tooltip } from '../SRT_Tooltip';
import { SRT_RowActionMenu } from '../menus/SRT_RowActionMenu';

export interface SRT_ToggleRowActionMenuButtonProps<TData extends SRT_RowData> {
  cell: SRT_Cell<TData>;
  row: SRT_Row<TData>;
  staticRowIndex?: number;
  table: SRT_TableInstance<TData>;
  className?: string;
}

export const SRT_ToggleRowActionMenuButton = <TData extends SRT_RowData>({
  cell,
  row,
  staticRowIndex,
  table,
  className,
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

  const commonButtonClass = cn(
    'ml-2.5 h-8 w-8 opacity-50 transition-opacity hover:opacity-100',
    className,
  );

  return (
    <>
      {renderRowActions && !showEditActionButtons ? (
        renderRowActions({ cell, row, staticRowIndex, table })
      ) : showEditActionButtons ? (
        <SRT_EditActionButtons row={row} table={table} />
      ) : !renderRowActionMenuItems &&
        parseFromValuesOrFunc(enableEditing, row) &&
        ['modal', 'row'].includes(editDisplayMode!) ? (
        <SRT_Tooltip title={localization.edit} side="right">
          <Button
            aria-label={localization.edit}
            className={commonButtonClass}
            onClick={handleStartEditMode}
            size="icon"
            variant="ghost"
          >
            <EditIcon className="h-4 w-4" />
          </Button>
        </SRT_Tooltip>
      ) : renderRowActionMenuItems?.({
          row,
          staticRowIndex,
          table,
        } as any)?.length ? (
        <>
          <SRT_Tooltip title={localization.rowActions}>
            <Button
              aria-label={localization.rowActions}
              className={commonButtonClass}
              onClick={handleOpenRowActionMenu}
              size="icon"
              variant="ghost"
            >
              <MoreHorizIcon className="h-4 w-4" />
            </Button>
          </SRT_Tooltip>
          {anchorEl && (
            <SRT_RowActionMenu
              anchorEl={anchorEl}
              handleEdit={handleStartEditMode}
              row={row}
              setAnchorEl={setAnchorEl}
              staticRowIndex={staticRowIndex}
              table={table}
            />
          )}
        </>
      ) : null}
    </>
  );
};
