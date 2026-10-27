import {
  type ComponentPropsWithRef,
  type MouseEvent,
  type ReactNode,
  useRef,
} from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui-radix/dropdown-menu';
import { cn } from '@/lib/utils';
import {
  type ST_Row,
  type ST_RowData,
  type ST_TableInstance,
} from '@/components/ui-radix/shadcn-table/types';
import { parseFromValuesOrFunc } from '@/components/ui-radix/shadcn-table/shared/utils/utils';
import { ST_ActionMenuItem } from '@/components/ui-radix/shadcn-table/components/menus/ST_ActionMenuItem';

export interface ST_RowActionMenuProps<TData extends ST_RowData>
  extends ComponentPropsWithRef<typeof DropdownMenuContent> {
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
  // The row carries the core table; the ST wrapper types re-type its options
  // and getters, so TypeScript cannot relate the two without the cast.
  const table = row.table as unknown as ST_TableInstance<TData>;
  const {
    options: {
      editDisplayMode,
      enableEditing,
      icons: { EditIcon },
      localization,
      // Note: mrtTheme.menuBackgroundColor dropped project-wide: DropdownMenuContent's bg-popover themes via shadcn CSS vars
      renderRowActionMenuItems,
    },
  } = table;

  const anchorRef = useRef<HTMLElement | null>(null);
  if (anchorEl) anchorRef.current = anchorEl;

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
      {/* Note: MRT disableScrollLock dropped: Radix DropdownMenu owns scroll-lock behavior */}
      <DropdownMenuContent
        align="start"
        onClick={(event) => event.stopPropagation()}
        onCloseAutoFocus={(event) => {
          event.preventDefault();
          anchorRef.current?.focus();
        }}
        className={cn('w-max', className)}
        {...rest}
      >
        {menuItems}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
