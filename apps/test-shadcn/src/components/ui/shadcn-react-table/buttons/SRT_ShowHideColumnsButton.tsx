import { type MouseEvent, useState } from 'react';
import { ColumnsIcon } from 'lucide-react';
import {
  type SRT_RowData,
  type SRT_TableInstance,
} from 'shadcn-react-table-core';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { SRT_ShowHideColumnsMenu } from '../menus/SRT_ShowHideColumnsMenu';

export interface SRT_ShowHideColumnsButtonProps<TData extends SRT_RowData> {
  table: SRT_TableInstance<TData>;
  className?: string;
}

/**
 * Show/Hide columns button - opens menu to toggle column visibility.
 *
 * Ported from MRT_ShowHideColumnsButton:
 * - Columns icon button with tooltip (localization.showHideColumns).
 * - Click captures the anchor element and opens SRT_ShowHideColumnsMenu.
 */

export const SRT_ShowHideColumnsButton = <TData extends SRT_RowData>({
  table,
  className,
}: SRT_ShowHideColumnsButtonProps<TData>) => {
  const {
    options: { localization },
  } = table;

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleClick}
        title={localization.showHideColumns}
        aria-label={localization.showHideColumns}
        className={cn('h-9 w-9', className)}
      >
        <ColumnsIcon className="h-4 w-4" />
      </Button>
      {anchorEl && (
        <SRT_ShowHideColumnsMenu
          anchorEl={anchorEl}
          setAnchorEl={setAnchorEl}
          table={table}
        />
      )}
    </>
  );
};
