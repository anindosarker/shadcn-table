import { type MouseEvent, type ReactNode, useMemo } from 'react';
import {
  type SRT_Row,
  type SRT_RowData,
  type SRT_TableInstance,
  parseFromValuesOrFunc,
} from 'shadcn-react-table-core';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SRT_ActionMenuItem } from './SRT_ActionMenuItem';

export interface SRT_RowActionMenuProps<TData extends SRT_RowData> {
  anchorEl: HTMLElement | null;
  handleEdit: (event: MouseEvent) => void;
  row: SRT_Row<TData>;
  setAnchorEl: (el: HTMLElement | null) => void;
  staticRowIndex?: number;
  table: SRT_TableInstance<TData>;
}

export const SRT_RowActionMenu = <TData extends SRT_RowData>({
  anchorEl,
  handleEdit,
  row,
  setAnchorEl,
  staticRowIndex,
  table,
}: SRT_RowActionMenuProps<TData>) => {
  const {
    getState,
    options: {
      editDisplayMode,
      enableEditing,
      icons: { EditIcon },
      localization,
      renderRowActionMenuItems,
    },
  } = table;
  const { density } = getState();

  const menuItems = useMemo(() => {
    const items: ReactNode[] = [];
    const editItem = parseFromValuesOrFunc(enableEditing, row) &&
      ['modal', 'row'].includes(editDisplayMode!) && (
        <SRT_ActionMenuItem
          dense={density === 'compact'}
          key={'edit'}
          icon={<EditIcon className="h-4 w-4" />}
          label={localization.edit}
          onClick={handleEdit}
          table={table}
        />
      );
    if (editItem) items.push(editItem);
    const rowActionMenuItems = renderRowActionMenuItems?.({
      closeMenu: () => setAnchorEl(null),
      row,
      staticRowIndex,
      table,
    });
    if (rowActionMenuItems?.length) items.push(...rowActionMenuItems);
    return items;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [density, renderRowActionMenuItems, row, staticRowIndex, table]);

  if (!menuItems.length) return null;

  const rect = anchorEl?.getBoundingClientRect();

  return (
    <DropdownMenu
      open={!!anchorEl}
      onOpenChange={(open) => {
        if (!open) setAnchorEl(null);
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
        {menuItems}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
