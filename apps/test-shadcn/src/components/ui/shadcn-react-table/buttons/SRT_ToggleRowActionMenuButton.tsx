import { type MouseEvent } from 'react';
import { EditIcon, MoreHorizontalIcon } from 'lucide-react';
import {
  type SRT_Cell,
  type SRT_Row,
  type SRT_RowData,
  type SRT_TableInstance,
  parseFromValuesOrFunc,
} from 'shadcn-react-table-core';
import { Button } from '@/components/ui/button';
import { SRT_EditActionButtons } from './SRT_EditActionButtons';
import { cn } from '@/lib/utils';
// import { SRT_RowActionMenu } from '../menus/SRT_RowActionMenu';

export interface SRT_ToggleRowActionMenuButtonProps<TData extends SRT_RowData> {
  cell: SRT_Cell<TData>;
  row: SRT_Row<TData>;
  staticRowIndex?: number;
  table: SRT_TableInstance<TData>;
  className?: string;
}

/**
 * Toggle row action menu button - shows edit/menu buttons or custom actions
 *
 * Barebones implementation:
 * - Shows SRT_EditActionButtons when in edit mode
 * - Shows edit button when editing enabled
 * - Shows menu button when renderRowActionMenuItems exists
 * - Shows custom actions via renderRowActions
 * - Hover opacity effect
 *
 * TODO (Future enhancements):
 * - Add SRT_RowActionMenu component
 * - Add tooltip
 * - Add keyboard shortcuts
 * - Add custom button props support
 */

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

  // const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleOpenRowActionMenu = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    event.preventDefault();
    // setAnchorEl(event.currentTarget);
    // TODO: Implement menu when SRT_RowActionMenu is ready
  };

  const handleStartEditMode = (event: MouseEvent) => {
    event.stopPropagation();
    setEditingRow({ ...row });
    // setAnchorEl(null);
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
        <Button
          variant="ghost"
          size="icon"
          onClick={handleStartEditMode}
          title={localization.edit}
          aria-label={localization.edit}
          className={commonButtonClass}
        >
          <EditIcon className="h-4 w-4" />
        </Button>
      ) : renderRowActionMenuItems?.({
          row,
          staticRowIndex,
          table,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any)?.length ? (
        <>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleOpenRowActionMenu}
            title={localization.rowActions}
            aria-label={localization.rowActions}
            className={commonButtonClass}
          >
            <MoreHorizontalIcon className="h-4 w-4" />
          </Button>
          {/* TODO: Implement SRT_RowActionMenu */}
          {/* {anchorEl && (
            <SRT_RowActionMenu
              anchorEl={anchorEl}
              handleEdit={handleStartEditMode}
              row={row}
              setAnchorEl={setAnchorEl}
              staticRowIndex={staticRowIndex}
              table={table}
            />
          )} */}
        </>
      ) : null}
    </>
  );
};
