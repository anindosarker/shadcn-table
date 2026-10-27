import { type ComponentPropsWithRef } from 'react';
import { Subscribe } from '@tanstack/react-table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import {
  type ST_Cell,
  type ST_RowData,
} from '@/components/ui/shadcn-table/types';
import { openEditingCell } from '@/components/ui/shadcn-table/shared/utils/cell.utils';
import { parseFromValuesOrFunc } from '@/components/ui/shadcn-table/shared/utils/utils';
import { ST_ActionMenuItem } from '@/components/ui/shadcn-table/components/menus/ST_ActionMenuItem';
import { useSTContext } from '@/components/ui/shadcn-table/hooks/stTableHook';

export type ST_CellActionMenuProps = ComponentPropsWithRef<
  typeof DropdownMenuContent
>;

export const ST_CellActionMenu = <TData extends ST_RowData>({
  className,
  ...rest
}: ST_CellActionMenuProps) => {
  const table = useSTContext<TData>();
  const {
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleClose = (event?: any) => {
    event?.stopPropagation();
    table.setActionCell(null);
    actionCellRef.current = null;
  };

  return (
    <Subscribe source={table.atoms.actionCell}>
      {(actionCell) => {
        if (!actionCell) return null;
        const cell = actionCell as ST_Cell<TData>;
        const { row } = cell;
        const { column } = cell;
        const { columnDef } = column;

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
            />
          ),
          parseFromValuesOrFunc(enableEditing, row) &&
            editDisplayMode === 'cell' && (
              <ST_ActionMenuItem
                icon={<EditIcon />}
                key={'st-edit'}
                label={localization.edit}
                onClick={() => {
                  openEditingCell({ cell, table });
                  handleClose();
                }}
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
                // The menu opens on contextmenu, which Chrome on macOS fires on
                // mousedown, so the right button's pointerup lands on the menu item
                // that is now under the cursor. Radix MenuItem selects on a pointerup
                // without a prior pointerdown on it, closing the menu (and running
                // the item) before the user lets go. Swallow right-button pointerups
                // in the capture phase; Escape, outside click and left click still
                // work as before.
                onPointerUpCapture={(event) => {
                  if (event.button === 2) event.stopPropagation();
                }}
                onCloseAutoFocus={(event) => {
                  event.preventDefault();
                  if (!table.atoms.editingCell.get()) anchorEl?.focus();
                }}
                className={cn('w-max', className)}
                {...rest}
              >
                {menuItems ?? internalMenuItems}
              </DropdownMenuContent>
            </DropdownMenu>
          )
        );
      }}
    </Subscribe>
  );
};
