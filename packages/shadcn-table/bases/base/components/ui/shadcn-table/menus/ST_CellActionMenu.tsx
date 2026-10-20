import { type ComponentPropsWithRef, useRef } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import {
  type ST_RowData,
  type ST_TableInstance,
} from '@/components/ui/shadcn-table/types';
import { openEditingCell } from '@/components/ui/shadcn-table/utils/cell.utils';
import { parseFromValuesOrFunc } from '@/components/ui/shadcn-table/utils/utils';
import { ST_ActionMenuItem } from '@/components/ui/shadcn-table/menus/ST_ActionMenuItem';

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
  const { actionCell } = table.state;
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
  // Base UI reads the popup's finalFocus when the menu closes, after
  // handleClose cleared actionCellRef; the ref keeps the element from the
  // last open render.
  const anchorRef = useRef<HTMLElement | null>(null);
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
        {/* Note: MRT disableScrollLock dropped — Base UI Menu owns scroll-lock behavior */}
        {/* Note: MRT transformOrigin={{horizontal:-100,vertical:8}} on MUI's top/left anchorOrigin puts the menu at top = anchorTop - 8, left = anchorLeft + 100; align="start" alignOffset={100} and sideOffset={-(height + 8)} from the anchor's bottom edge land on the same point */}
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
          // left click still work as before.
          onMouseUpCapture={(event) => {
            if (event.button === 2) event.stopPropagation();
          }}
          // Focus goes back to the cell unless editing started; returning
          // false keeps Base UI off the invisible trigger.
          finalFocus={() => {
            if (!table.state.editingCell) anchorRef.current?.focus();
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
};
