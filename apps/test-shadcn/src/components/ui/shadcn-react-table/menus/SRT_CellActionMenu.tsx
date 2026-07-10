import { type ComponentPropsWithRef } from 'react';
import { cva } from 'class-variance-authority';
import {
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
import { cn } from '@/lib/utils';
import { SRT_ActionMenuItem } from './SRT_ActionMenuItem';

const cellActionMenuContentVariants = cva('', {
  variants: {
    // Note: MRT MenuListProps.dense (density === 'compact') stays menu-level, tightening item padding
    dense: {
      false: '',
      true: '[&>*]:py-1',
    },
  },
});

export interface SRT_CellActionMenuProps<TData extends SRT_RowData>
  extends ComponentPropsWithRef<typeof DropdownMenuContent> {
  table: SRT_TableInstance<TData>;
}

export const SRT_CellActionMenu = <TData extends SRT_RowData>({
  className,
  table,
  ...rest
}: SRT_CellActionMenuProps<TData>) => {
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
  const { actionCell, density } = getState();
  const cell = actionCell!;
  const { row } = cell;
  const { column } = cell;
  const { columnDef } = column;

  const handleClose = (event?: { stopPropagation?: () => void }) => {
    event?.stopPropagation?.();
    table.setActionCell(null);
    actionCellRef.current = null;
  };

  const internalMenuItems = [
    (parseFromValuesOrFunc(enableClickToCopy, cell) === 'context-menu' ||
      parseFromValuesOrFunc(columnDef.enableClickToCopy, cell) ===
        'context-menu') && (
      <SRT_ActionMenuItem
        icon={<ContentCopy className="h-4 w-4" />}
        key={'mrt-copy'}
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
        key={'mrt-edit'}
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

  const rect = actionCellRef.current?.getBoundingClientRect();

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
        {/* Note: MRT transformOrigin={{horizontal:-100,vertical:8}} → align="start" alignOffset={100} sideOffset={8} approximates its offset placement near the click point */}
        <DropdownMenuContent
          align="start"
          alignOffset={100}
          sideOffset={8}
          onClick={(event) => event.stopPropagation()}
          {...rest}
          className={cn(
            cellActionMenuContentVariants({ dense: density === 'compact' }),
            className,
          )}
        >
          {menuItems ?? internalMenuItems}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  );
};
