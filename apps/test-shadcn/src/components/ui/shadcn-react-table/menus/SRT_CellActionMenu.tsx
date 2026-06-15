import { type ReactNode } from 'react';
import { CopyIcon, EditIcon } from 'lucide-react';
import {
  type SRT_Cell,
  type SRT_RowData,
  type SRT_TableInstance,
  openEditingCell,
  parseFromValuesOrFunc,
} from 'shadcn-react-table-core';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SRT_ActionMenuItem } from './SRT_ActionMenuItem';

export interface SRT_CellActionMenuProps<TData extends SRT_RowData> {
  /**
   * Optional explicit anchor. When provided (along with `cell`), drives the
   * open/anchor state directly. When omitted, falls back to MRT behavior:
   * the table's `actionCell` state + `actionCellRef`.
   */
  anchorEl?: HTMLElement | null;
  cell?: SRT_Cell<TData>;
  setAnchorEl?: (el: HTMLElement | null) => void;
  table: SRT_TableInstance<TData>;
}

/**
 * Cell action menu - copy/edit + custom cell actions. Port of MRT_CellActionMenu.
 *
 * Driven by the table's `actionCell` state and `actionCellRef` (set when a cell
 * is right-clicked / the context menu is opened), matching MRT. MUI Menu ->
 * shadcn DropdownMenu, anchored to the action cell ref. Callers may instead
 * pass an explicit `anchorEl` + `cell` to control it locally.
 */
export const SRT_CellActionMenu = <TData extends SRT_RowData>({
  anchorEl,
  cell: cellProp,
  setAnchorEl,
  table,
}: SRT_CellActionMenuProps<TData>) => {
  const {
    getState,
    options: {
      editDisplayMode,
      enableClickToCopy,
      enableEditing,
      localization,
      renderCellActionMenuItems,
    },
    refs: { actionCellRef },
  } = table;
  const { actionCell } = getState();
  const cell = (cellProp ?? actionCell)!;

  const handleClose = (event?: { stopPropagation?: () => void }) => {
    event?.stopPropagation?.();
    table.setActionCell(null);
    actionCellRef.current = null;
    setAnchorEl?.(null);
  };

  if (!cell) return null;

  const { row } = cell;
  const { column } = cell;
  const { columnDef } = column;

  const internalMenuItems: ReactNode[] = [
    (parseFromValuesOrFunc(enableClickToCopy, cell) === 'context-menu' ||
      parseFromValuesOrFunc(columnDef.enableClickToCopy, cell) ===
        'context-menu') && (
      <SRT_ActionMenuItem
        icon={<CopyIcon className="h-4 w-4" />}
        key={'srt-copy'}
        label={localization.copy}
        onClick={(event) => {
          event.stopPropagation();
          navigator.clipboard.writeText(cell.getValue() as string);
          handleClose();
        }}
        table={table}
      />
    ),
    parseFromValuesOrFunc(enableEditing, row) && editDisplayMode === 'cell' && (
      <SRT_ActionMenuItem
        icon={<EditIcon className="h-4 w-4" />}
        key={'srt-edit'}
        label={localization.edit}
        onClick={() => {
          openEditingCell({ cell, table });
          handleClose();
        }}
        table={table}
      />
    ),
  ].filter(Boolean);

  const renderActionProps = {
    cell,
    closeMenu: handleClose,
    column,
    internalMenuItems,
    row,
    table,
  };

  const menuItems =
    columnDef.renderCellActionMenuItems?.(renderActionProps) ??
    renderCellActionMenuItems?.(renderActionProps);

  if (!menuItems?.length && !internalMenuItems?.length) return null;

  const anchorNode = anchorEl ?? actionCellRef.current;
  const isOpen = anchorEl !== undefined ? !!anchorEl : !!cell;
  const rect = anchorNode?.getBoundingClientRect();

  return (
    <DropdownMenu
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
    >
      <DropdownMenuTrigger asChild>
        <span
          aria-hidden
          style={{
            position: 'fixed',
            left: rect?.left ?? 0,
            top: rect?.top ?? 0,
            width: rect?.width ?? 0,
            height: rect?.height ?? 0,
            pointerEvents: 'none',
          }}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        onClick={(event) => event.stopPropagation()}
      >
        {menuItems ?? internalMenuItems}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
