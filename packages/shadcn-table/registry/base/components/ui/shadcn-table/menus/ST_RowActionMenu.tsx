import {
  type ComponentPropsWithRef,
  type MouseEvent,
  type ReactNode,
  useMemo,
  useRef,
} from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import {
  type ST_Row,
  type ST_RowData,
  type ST_TableInstance,
} from '@/components/ui/shadcn-table/types';
import { parseFromValuesOrFunc } from '@/components/ui/shadcn-table/utils/utils';
import { ST_ActionMenuItem } from '@/components/ui/shadcn-table/menus/ST_ActionMenuItem';

export interface ST_RowActionMenuProps<TData extends ST_RowData>
  extends ComponentPropsWithRef<typeof DropdownMenuContent> {
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
      // Note: mrtTheme.menuBackgroundColor dropped project-wide — DropdownMenuContent's bg-popover themes via shadcn CSS vars
      renderRowActionMenuItems,
    },
  } = table;

  // Base UI reads the popup's finalFocus when the menu closes, after this
  // component re-rendered with anchorEl cleared; the ref keeps the element
  // from the last open render.
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
    <DropdownMenu
      open={!!anchorEl}
      onOpenChange={(open) => {
        if (!open) setAnchorEl(null);
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
      <DropdownMenuContent
        align="start"
        onClick={(event) => event.stopPropagation()}
        // Focus goes back to the real anchor; returning false keeps Base UI
        // off the invisible trigger.
        finalFocus={() => {
          anchorRef.current?.focus();
          return false;
        }}
        className={cn('w-max', className)}
        {...rest}
      >
        {menuItems}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
