import { type ComponentPropsWithRef } from 'react';
import { Subscribe } from '@tanstack/react-table';
import { Pressable } from 'react-aria-components';
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from '@/components/ui-aria/dropdown-menu';
import { cn } from '@/lib/utils';
import {
  type ST_Cell,
  type ST_RowData,
} from '@/components/ui-aria/shadcn-table/types';
import { openEditingCell } from '@/components/ui-aria/shadcn-table/shared/utils/cell.utils';
import { parseFromValuesOrFunc } from '@/components/ui-aria/shadcn-table/shared/utils/utils';
import { ST_ActionMenuItem } from '@/components/ui-aria/shadcn-table/components/menus/ST_ActionMenuItem';
import { useSTContext } from '@/components/ui-aria/shadcn-table/hooks/stTableHook';

export type ST_CellActionMenuProps = ComponentPropsWithRef<typeof DropdownMenu>;

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

        const rect = actionCellRef.current?.getBoundingClientRect();

        return (
          (!!menuItems?.length || !!internalMenuItems?.length) && (
            <DropdownMenuTrigger
              isOpen={!!cell}
              onOpenChange={(open) => {
                if (!open) handleClose();
              }}
            >
              {/* MenuTrigger positions the menu against its pressable child. */}
              <Pressable>
                <span
                  aria-hidden
                  role="button"
                  tabIndex={-1}
                  style={{
                    position: 'fixed',
                    left: rect?.left ?? 0,
                    top: rect?.top ?? 0,
                    width: rect?.width ?? 0,
                    height: rect?.height ?? 0,
                    pointerEvents: 'none',
                  }}
                />
              </Pressable>
              {/* placement, crossOffset and offset, measured from the anchor's bottom edge, put the menu at top = anchorTop - 8, left = anchorLeft + 100 */}
              <DropdownMenu
                placement="bottom start"
                crossOffset={100}
                offset={-((rect?.height ?? 0) + 8)}
                onClick={(event) => event.stopPropagation()}
                className={cn('w-max', className)}
                {...rest}
              >
                {menuItems ?? internalMenuItems}
              </DropdownMenu>
            </DropdownMenuTrigger>
          )
        );
      }}
    </Subscribe>
  );
};
