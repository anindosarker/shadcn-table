import {
  cloneElement,
  type ComponentPropsWithRef,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
  useState,
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
} from '@/components/ui-radix/shadcn-table/types';
import { parseFromValuesOrFunc } from '@/components/ui-radix/shadcn-table/shared/utils/utils';
import { ST_ActionMenuItem } from '@/components/ui-radix/shadcn-table/components/menus/ST_ActionMenuItem';
import { useST_MenuAnchor } from '@/components/ui-radix/shadcn-table/hooks/useST_MenuAnchor';

export interface ST_RowActionMenuProps<TData extends ST_RowData>
  extends ComponentPropsWithRef<typeof DropdownMenuContent> {
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
  trigger?: ReactElement<{ disabled?: boolean }>;
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

  const { focusAnchor, onOpenChange, spanProps } = useST_MenuAnchor({
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
    return trigger ? cloneElement(trigger, { disabled: true }) : null;
  }

  return (
    <DropdownMenu
      open={isOpen}
      onOpenChange={trigger ? handleTriggerOpenChange : onOpenChange}
    >
      <DropdownMenuTrigger asChild>
        {trigger ?? <span {...spanProps} />}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        onClick={(event) => event.stopPropagation()}
        onCloseAutoFocus={
          trigger
            ? undefined
            : (event) => {
                event.preventDefault();
                focusAnchor();
              }
        }
        className={cn('w-max', className)}
        {...rest}
      >
        {menuItems}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
