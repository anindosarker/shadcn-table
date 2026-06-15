import { type MouseEvent, useState } from 'react';
import { MoreVerticalIcon } from 'lucide-react';
import {
  type SRT_Header,
  type SRT_RowData,
  type SRT_TableInstance,
} from 'shadcn-react-table-core';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { SRT_ColumnActionMenu } from '../menus/SRT_ColumnActionMenu';

export interface SRT_TableHeadCellColumnActionsButtonProps<
  TData extends SRT_RowData,
> {
  header: SRT_Header<TData>;
  table: SRT_TableInstance<TData>;
  className?: string;
}

/**
 * Column actions button - opens the column action menu.
 *
 * Ported 1:1 from MRT_TableHeadCellColumnActionsButton:
 * - More icon button with a tooltip (localization.columnActions).
 * - Hover raises opacity from 0.3 to 1.
 * - Click captures the anchor element and opens SRT_ColumnActionMenu.
 */

export const SRT_TableHeadCellColumnActionsButton = <
  TData extends SRT_RowData,
>({
  header,
  table,
  className,
}: SRT_TableHeadCellColumnActionsButtonProps<TData>) => {
  const {
    options: { localization },
  } = table;

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    event.preventDefault();
    setAnchorEl(event.currentTarget);
  };

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            aria-label={localization.columnActions}
            onClick={handleClick}
            className={cn(
              'h-8 w-8 opacity-30 transition-opacity hover:opacity-100 group-hover:opacity-100',
              className,
            )}
          >
            <MoreVerticalIcon className="h-3.5 w-3.5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top">{localization.columnActions}</TooltipContent>
      </Tooltip>
      {anchorEl && (
        <SRT_ColumnActionMenu
          anchorEl={anchorEl}
          header={header}
          setAnchorEl={setAnchorEl}
          table={table}
        />
      )}
    </>
  );
};
