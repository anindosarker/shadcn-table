import {
  cloneElement,
  type ComponentPropsWithRef,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
  useState,
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
import { useST_MenuAnchor } from '@/components/ui-aria/shadcn-table/hooks/useST_MenuAnchor';

export interface ST_RowActionMenuProps<TData extends ST_RowData>
  extends ComponentPropsWithRef<typeof DropdownMenu> {
  /** The element the menu opens from when no `trigger` is given; `null` while closed. */
  anchorEl?: HTMLElement | null;
  handleEdit: (event: MouseEvent) => void;
  /** Controlled open state with a `trigger`. */
  onOpenChange?: (open: boolean) => void;
  /** Controlled open state with a `trigger`. */
  open?: boolean;
  row: ST_Row<TData>;
  setAnchorEl?: (anchorEl: HTMLElement | null) => void;
  staticRowIndex?: number;
  /** The element that opens and closes the menu; rendered disabled while the menu has no items. */
  trigger?: ReactElement<{ isDisabled?: boolean }>;
}

const noAnchor = () => {};

export const ST_RowActionMenu = <TData extends ST_RowData>({
  className,
  anchorEl = null,
  handleEdit,
  onOpenChange: onOpenChangeProp,
  open: openProp,
  row,
  setAnchorEl = noAnchor,
  staticRowIndex,
  trigger,
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

  const { onOpenChange, spanProps } = useST_MenuAnchor({
    anchorEl,
    setAnchorEl,
  });
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const isOpen = trigger ? (openProp ?? uncontrolledOpen) : !!anchorEl;
  const handleTriggerOpenChange = (next: boolean) => {
    setUncontrolledOpen(next);
    onOpenChangeProp?.(next);
  };
  const closeMenu = () =>
    trigger ? handleTriggerOpenChange(false) : setAnchorEl(null);

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
    closeMenu,
    row,
    staticRowIndex,
    table,
  });
  if (rowActionMenuItems?.length) menuItems.push(...rowActionMenuItems);

  if (!menuItems.length) {
    return trigger ? cloneElement(trigger, { isDisabled: true }) : null;
  }

  return (
    <DropdownMenuTrigger
      isOpen={isOpen}
      onOpenChange={trigger ? handleTriggerOpenChange : onOpenChange}
    >
      {trigger ?? (
        // An anchor without href passes Pressable's role check with no role (D26); isDisabled skips the focusable check on the inert anchor.
        <Pressable isDisabled>
          <a {...spanProps} />
        </Pressable>
      )}
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
