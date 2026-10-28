import { type ComponentPropsWithRef, useRef } from 'react';
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

  // Base UI reads the popup's finalFocus when the menu closes, after
  // handleClose cleared actionCellRef; the ref keeps the element from the
  // last open render.
  const anchorRef = useRef<HTMLElement | null>(null);

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
        if (anchorEl) anchorRef.current = anchorEl;
        const rect = anchorEl?.getBoundingClientRect();

        return (
          (!!menuItems?.length || !!internalMenuItems?.length) && (
            <DropdownMenu
              open={!!cell}
              onOpenChange={(open) => {
                if (!open) handleClose();
              }}
            >
              <DropdownMenuTrigger
                // The library anchors its menus to an invisible span, not a button.
                nativeButton={false}
                render={
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
                }
              />
              {/* align, alignOffset and sideOffset, measured from the anchor's bottom edge, put the menu at top = anchorTop - 8, left = anchorLeft + 100 */}
              <DropdownMenuContent
                align="start"
                alignOffset={100}
                sideOffset={-((rect?.height ?? 0) + 8)}
                onClick={(event) => event.stopPropagation()}
                // The menu opens on contextmenu, which Chrome on macOS fires on
                // mousedown, so the right button's mouseup lands on the menu item
                // that is now under the cursor. Base UI's MenuItem turns a mouseup
                // into a click only after a mousedown on the trigger armed it
                // (allowMouseUpTriggerRef), which the invisible span never gets, and
                // activates on click, which a right-button release does not fire.
                // Swallow right-button mouseups in the capture phase anyway so the
                // item's onMouseUp never sees the release; Escape, outside click and
                // left click still work.
                onMouseUpCapture={(event) => {
                  if (event.button === 2) event.stopPropagation();
                }}
                // Focus goes back to the cell unless editing started; returning
                // false keeps Base UI off the invisible trigger.
                finalFocus={() => {
                  if (!table.atoms.editingCell.get())
                    anchorRef.current?.focus();
                  return false;
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
