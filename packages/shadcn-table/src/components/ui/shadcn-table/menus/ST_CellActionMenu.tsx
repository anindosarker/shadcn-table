import { type ComponentPropsWithRef } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { type ST_RowData, type ST_TableInstance } from '../types';
import { openEditingCell } from '../utils/cell.utils';
import { parseFromValuesOrFunc } from '../utils/utils';
import { ST_ActionMenuItem } from './ST_ActionMenuItem';

export interface ST_CellActionMenuProps<TData extends ST_RowData>
  extends ComponentPropsWithRef<typeof DropdownMenuContent> {
  table: ST_TableInstance<TData>;
}

export const ST_CellActionMenu = <TData extends ST_RowData>({
  className,
  table,
  ...rest
}: ST_CellActionMenuProps<TData>) => {
  const {
    getState,
    options: {
      editDisplayMode,
      enableClickToCopy,
      enableEditing,
      icons: { ContentCopy, EditIcon },
      localization,
      // Note: mrtTheme.menuBackgroundColor dropped project-wide — DropdownMenuContent's bg-popover themes via shadcn CSS vars
      renderCellActionMenuItems,
    },
    refs: { actionCellRef },
  } = table;
  const { actionCell } = getState();
  const cell = actionCell!;
  const { row } = cell;
  const { column } = cell;
  const { columnDef } = column;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleClose = (event?: any) => {
    event?.stopPropagation();
    table.setActionCell(null);
    actionCellRef.current = null;
  };

  const internalMenuItems = [
    (parseFromValuesOrFunc(enableClickToCopy, cell) === 'context-menu' ||
      parseFromValuesOrFunc(columnDef.enableClickToCopy, cell) ===
        'context-menu') && (
      <ST_ActionMenuItem
        icon={<ContentCopy />}
        key={'st-copy'}
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
      <ST_ActionMenuItem
        icon={<EditIcon />}
        key={'st-edit'}
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

  const anchorEl = actionCellRef.current;
  const rect = anchorEl?.getBoundingClientRect();

  return (
    (!!menuItems?.length || !!internalMenuItems?.length) && (
      <DropdownMenu
        open={!!cell}
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
        {/* Note: MRT disableScrollLock dropped — Radix DropdownMenu owns scroll-lock behavior */}
        {/* Note: MRT transformOrigin={{horizontal:-100,vertical:8}} on MUI's top/left anchorOrigin puts the menu at top = anchorTop - 8, left = anchorLeft + 100; align="start" alignOffset={100} and sideOffset={-(height + 8)} from the anchor's bottom edge land on the same point */}
        <DropdownMenuContent
          align="start"
          alignOffset={100}
          sideOffset={-((rect?.height ?? 0) + 8)}
          onClick={(event) => event.stopPropagation()}
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            if (!table.getState().editingCell) anchorEl?.focus();
          }}
          className={cn('w-max', className)}
          {...rest}
        >
          {menuItems ?? internalMenuItems}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  );
};
