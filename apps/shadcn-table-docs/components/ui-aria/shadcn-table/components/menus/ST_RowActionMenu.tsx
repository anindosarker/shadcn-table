import {
  type ComponentPropsWithRef,
  type MouseEvent,
  type ReactNode,
} from 'react';
import { Pressable } from 'react-aria-components';
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from '@/components/ui-aria/dropdown-menu';
import { cn } from '@/lib/utils';
import {
  type ST_Row,
  type ST_RowData,
} from '@/components/ui-aria/shadcn-table/types';
import { parseFromValuesOrFunc } from '@/components/ui-aria/shadcn-table/shared/utils/utils';
import { ST_ActionMenuItem } from '@/components/ui-aria/shadcn-table/components/menus/ST_ActionMenuItem';

export interface ST_RowActionMenuProps<TData extends ST_RowData>
  extends ComponentPropsWithRef<typeof DropdownMenu> {
  anchorEl: HTMLElement | null;
  handleEdit: (event: MouseEvent) => void;
  row: ST_Row<TData>;
  setAnchorEl: (anchorEl: HTMLElement | null) => void;
  staticRowIndex?: number;
}

export const ST_RowActionMenu = <TData extends ST_RowData>({
  className,
  anchorEl,
  handleEdit,
  row,
  setAnchorEl,
  staticRowIndex,
  ...rest
}: ST_RowActionMenuProps<TData>) => {
  const table = row.table;
  const {
    options: {
      editDisplayMode,
      enableEditing,
      icons: { EditIcon },
      localization,
      renderRowActionMenuItems,
    },
  } = table;

  const menuItems: ReactNode[] = [];
  const editItem = parseFromValuesOrFunc(enableEditing, row) &&
    ['modal', 'row'].includes(editDisplayMode!) && (
      <ST_ActionMenuItem
        key={'edit'}
        icon={<EditIcon />}
        label={localization.edit}
        onClick={handleEdit}
      />
    );
  if (editItem) menuItems.push(editItem);
  const rowActionMenuItems = renderRowActionMenuItems?.({
    closeMenu: () => setAnchorEl(null),
    row,
    staticRowIndex,
    table,
  });
  if (rowActionMenuItems?.length) menuItems.push(...rowActionMenuItems);

  if (!menuItems.length) return null;

  const rect = anchorEl?.getBoundingClientRect();

  return (
    <DropdownMenuTrigger
      isOpen={!!anchorEl}
      onOpenChange={(open) => {
        if (!open) setAnchorEl(null);
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
      <DropdownMenu
        placement="bottom start"
        onClick={(event) => event.stopPropagation()}
        className={cn('w-max', className)}
        {...rest}
      >
        {menuItems}
      </DropdownMenu>
    </DropdownMenuTrigger>
  );
};
