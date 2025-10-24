import type { SRT_RowData, SRT_TableInstance } from 'shadcn-react-table-core';
import { Button } from '@/components/ui/button';
import { Maximize2Icon, Minimize2Icon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SRT_ToggleFullScreenButtonProps<TData extends SRT_RowData> {
  table: SRT_TableInstance<TData>;
  className?: string;
}

/**
 * Toggle fullscreen button - switches table between normal and fullscreen mode
 *
 * Barebones implementation:
 * - Toggles fullscreen state
 * - Shows appropriate icon (Maximize/Minimize)
 * - Basic hover tooltip via title attribute
 *
 * TODO (Future enhancements):
 * - Add Tooltip component from shadcn
 * - Add custom icon support via table.options.icons
 * - Add srtToggleFullScreenButtonProps to core package types
 * - Add keyboard shortcut (e.g., F11 or Escape)
 * - Add animation on state change
 */

export const SRT_ToggleFullScreenButton = <TData extends SRT_RowData>({
  table,
  className,
}: SRT_ToggleFullScreenButtonProps<TData>) => {
  const {
    getState,
    options: {
      localization,
      // icons, // TODO: Add custom icon support
    },
    setIsFullScreen,
  } = table;
  const { isFullScreen } = getState();

  const handleToggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggleFullScreen}
      aria-label={localization.toggleFullScreen}
      title={localization.toggleFullScreen}
      className={cn('h-8 w-8', className)}
    >
      {isFullScreen ? (
        <Minimize2Icon className="h-4 w-4" />
      ) : (
        <Maximize2Icon className="h-4 w-4" />
      )}
    </Button>
  );
};

// TODO: Add these features in future iterations:
// 1. Shadcn Tooltip component for better UX
// 2. Custom icons via table.options.icons
// 3. Keyboard shortcut support
// 4. Animation on toggle
// 5. Support for srtToggleFullScreenButtonProps
