import type { SRT_RowData, SRT_TableInstance } from 'shadcn-react-table-core';
import { Button } from '@/components/ui/button';
import { AlignJustifyIcon, AlignCenterIcon, MinusIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SRT_ToggleDensePaddingButtonProps<TData extends SRT_RowData> {
  table: SRT_TableInstance<TData>;
  className?: string;
}

/**
 * Toggle density button - cycles through table density options
 *
 * Barebones implementation:
 * - Cycles: comfortable -> compact -> spacious -> comfortable
 * - Shows appropriate icon based on current density
 * - Basic hover tooltip via title attribute
 *
 * TODO (Future enhancements):
 * - Add Tooltip component from shadcn
 * - Add custom icon support via table.options.icons
 * - Add srtToggleDensePaddingButtonProps to core package types
 * - Add dropdown menu to select density directly
 * - Add visual preview of density options
 */

export const SRT_ToggleDensePaddingButton = <TData extends SRT_RowData>({
  table,
  className,
}: SRT_ToggleDensePaddingButtonProps<TData>) => {
  const {
    getState,
    options: {
      localization,
      // icons, // TODO: Add custom icon support
    },
    setDensity,
  } = table;
  const { density } = getState();

  const handleToggleDensePadding = () => {
    const nextDensity =
      density === 'comfortable'
        ? 'compact'
        : density === 'compact'
          ? 'spacious'
          : 'comfortable';
    setDensity(nextDensity);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggleDensePadding}
      aria-label={localization.toggleDensity}
      title={localization.toggleDensity}
      className={cn('h-8 w-8', className)}
    >
      {density === 'compact' ? (
        <MinusIcon className="h-4 w-4" />
      ) : density === 'comfortable' ? (
        <AlignCenterIcon className="h-4 w-4" />
      ) : (
        <AlignJustifyIcon className="h-4 w-4" />
      )}
    </Button>
  );
};

// TODO: Add these features in future iterations:
// 1. Shadcn Tooltip component for better UX
// 2. Custom icons via table.options.icons
// 3. Dropdown menu for direct density selection
// 4. Visual preview of density options in menu
// 5. Support for srtToggleDensePaddingButtonProps
