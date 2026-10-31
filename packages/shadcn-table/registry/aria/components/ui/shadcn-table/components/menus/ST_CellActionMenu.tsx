import { type ComponentPropsWithRef, useEffect } from 'react';
import { Subscribe } from '@tanstack/react-table';
import { Pressable } from 'react-aria-components';
import {
  DropdownMenu,
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
import { useST_MenuAnchor } from '@/components/ui/shadcn-table/hooks/useST_MenuAnchor';

export type ST_CellActionMenuProps = ComponentPropsWithRef<typeof DropdownMenu>;

export const ST_CellActionMenu = <TData extends ST_RowData>(
  props: ST_CellActionMenuProps,
) => {
  const table = useSTContext<TData>();
  return (
    <Subscribe source={table.atoms.actionCell}>
      {(actionCell) =>
        actionCell && (
          <ST_CellActionMenuContent
            {...props}
            anchorEl={table.refs.actionCellRef.current}
            cell={actionCell as ST_Cell<TData>}
          />
        )
      }
    </Subscribe>
  );
};

const ST_CellActionMenuContent = <TData extends ST_RowData>({
  anchorEl,
  cell,
  className,
  ...rest
}: ST_CellActionMenuProps & {
  anchorEl: HTMLElement | null;
  cell: ST_Cell<TData>;
}) => {
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

  const handleClose = (event?: { stopPropagation(): void }) => {
    event?.stopPropagation();
    table.setActionCell(null);
  };

  // The menu unmounts when it closes, and the action cell goes with it.
  useEffect(
    () => () => {
      actionCellRef.current = null;
    },
    [actionCellRef],
  );

  const { onOpenChange, rect, spanProps } = useST_MenuAnchor({
    anchorEl,
    setAnchorEl: (anchor) => {
      if (!anchor) handleClose();
    },
  });

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
    parseFromValuesOrFunc(enableEditing, row) && editDisplayMode === 'cell' && (
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

  return (
    (!!menuItems?.length || !!internalMenuItems?.length) && (
      <DropdownMenuTrigger isOpen={!!cell} onOpenChange={onOpenChange}>
        <Pressable>
          <span {...spanProps} role="button" />
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
};
