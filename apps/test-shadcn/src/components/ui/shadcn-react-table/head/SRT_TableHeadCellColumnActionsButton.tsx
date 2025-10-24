import { type MouseEvent } from 'react';
import { MoreVerticalIcon } from 'lucide-react';
import {
  type SRT_Header,
  type SRT_RowData,
  type SRT_TableInstance,
} from 'shadcn-react-table-core';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
// import { SRT_ColumnActionMenu } from '../menus/SRT_ColumnActionMenu';

export interface SRT_TableHeadCellColumnActionsButtonProps<
  TData extends SRT_RowData,
> {
  header: SRT_Header<TData>;
  table: SRT_TableInstance<TData>;
  className?: string;
}

/**
 * Column actions button - opens menu for column-level actions
 *
 * Barebones implementation:
 * - Vertical more icon button
 * - Opens column action menu
 * - Hover opacity effect
 *
 * TODO (Future enhancements):
 * - Add SRT_ColumnActionMenu component
 * - Add tooltip
 * - Add keyboard shortcuts
 * - Add custom button props support
 */

export const SRT_TableHeadCellColumnActionsButton = <
  TData extends SRT_RowData,
>({
  table,
  className,
}: SRT_TableHeadCellColumnActionsButtonProps<TData>) => {
  const {
    options: { localization },
  } = table;

  // const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    event.preventDefault();
    // setAnchorEl(event.currentTarget);
    // TODO: Implement menu when SRT_ColumnActionMenu is ready
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleClick}
        title={localization.columnActions}
        aria-label={localization.columnActions}
        className={cn(
          'h-8 w-8 opacity-30 transition-opacity hover:opacity-100',
          className,
        )}
      >
        <MoreVerticalIcon className="h-3.5 w-3.5" />
      </Button>
      {/* TODO: Implement SRT_ColumnActionMenu */}
      {/* {anchorEl && (
        <SRT_ColumnActionMenu
          anchorEl={anchorEl}
          header={header}
          setAnchorEl={setAnchorEl}
          table={table}
        />
      )} */}
    </>
  );
};
