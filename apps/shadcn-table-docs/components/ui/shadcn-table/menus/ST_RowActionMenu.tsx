import { type MouseEvent, type ReactNode, useMemo, useRef } from 'react';
import { cn } from '@/lib/utils';
import { type ST_Row, type ST_RowData, type ST_TableInstance } from '../types';
import {
  Menu,
  MenuContent,
  type MenuContentProps,
  MenuTrigger,
} from '../primitives/menu';
import { parseFromValuesOrFunc } from '../utils/utils';
import { ST_ActionMenuItem } from './ST_ActionMenuItem';

export interface ST_RowActionMenuProps<TData extends ST_RowData>
  extends MenuContentProps {
  anchorEl: HTMLElement | null;
  handleEdit: (event: MouseEvent) => void;
  row: ST_Row<TData>;
  setAnchorEl: (anchorEl: HTMLElement | null) => void;
  staticRowIndex?: number;
  table: ST_TableInstance<TData>;
}

export const ST_RowActionMenu = <TData extends ST_RowData>({
  className,
  anchorEl,
  handleEdit,
  row,
  setAnchorEl,
  staticRowIndex,
  table,
  ...rest
}: ST_RowActionMenuProps<TData>) => {
  const {
    options: {
      editDisplayMode,
      enableEditing,
      icons: { EditIcon },
      localization,
      // Note: mrtTheme.menuBackgroundColor dropped project-wide — MenuContent's bg-popover themes via shadcn CSS vars
      renderRowActionMenuItems,
    },
  } = table;

  const anchorRef = useRef<HTMLElement | null>(null);
  if (anchorEl) anchorRef.current = anchorEl;

  const menuItems = useMemo(() => {
    const items: ReactNode[] = [];
    const editItem = parseFromValuesOrFunc(enableEditing, row) &&
      ['modal', 'row'].includes(editDisplayMode!) && (
        <ST_ActionMenuItem
          key={'edit'}
          icon={<EditIcon />}
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
  }, [renderRowActionMenuItems, row, staticRowIndex, table]);

  if (!menuItems.length) return null;

  const rect = anchorEl?.getBoundingClientRect();

  return (
    <Menu
      open={!!anchorEl}
      onOpenChange={(open) => {
        if (!open) setAnchorEl(null);
      }}
    >
      <MenuTrigger>
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
      </MenuTrigger>
      {/* Note: MRT disableScrollLock dropped — Radix DropdownMenu owns scroll-lock behavior */}
      <MenuContent
        align="start"
        onClick={(event) => event.stopPropagation()}
        onClose={() => anchorRef.current?.focus()}
        className={cn('w-max', className)}
        {...rest}
      >
        {menuItems}
      </MenuContent>
    </Menu>
  );
};
