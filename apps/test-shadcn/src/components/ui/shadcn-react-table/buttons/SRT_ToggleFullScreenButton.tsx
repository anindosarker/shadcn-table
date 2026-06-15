import { useState } from 'react';
import type { SRT_RowData, SRT_TableInstance } from 'shadcn-react-table-core';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { SRT_Tooltip } from '../SRT_Tooltip';

export interface SRT_ToggleFullScreenButtonProps<TData extends SRT_RowData> {
  table: SRT_TableInstance<TData>;
  className?: string;
}

/**
 * Toggle fullscreen button - switches table between normal and fullscreen mode.
 *
 * Ported from MRT_ToggleFullScreenButton:
 * - Toggles fullscreen state.
 * - Icon (read from the table icon registry) reflects state:
 *   FullscreenExitIcon when fullscreen, FullscreenIcon otherwise.
 * - Tooltip (localization.toggleFullScreen) via SRT_Tooltip, controlled so it
 *   closes on click / blur (matches MRT's open-state handling).
 */

export const SRT_ToggleFullScreenButton = <TData extends SRT_RowData>({
  table,
  className,
}: SRT_ToggleFullScreenButtonProps<TData>) => {
  const {
    getState,
    options: {
      icons: { FullscreenExitIcon, FullscreenIcon },
      localization,
    },
    setIsFullScreen,
  } = table;
  const { isFullScreen } = getState();

  const [tooltipOpened, setTooltipOpened] = useState(false);

  const handleToggleFullScreen = () => {
    setTooltipOpened(false);
    setIsFullScreen(!isFullScreen);
  };

  return (
    <SRT_Tooltip
      title={localization.toggleFullScreen}
      open={tooltipOpened}
      onOpenChange={setTooltipOpened}
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={handleToggleFullScreen}
        onBlur={() => setTooltipOpened(false)}
        onFocus={() => setTooltipOpened(true)}
        onMouseEnter={() => setTooltipOpened(true)}
        onMouseLeave={() => setTooltipOpened(false)}
        aria-label={localization.toggleFullScreen}
        className={cn('h-8 w-8', className)}
      >
        {isFullScreen ? (
          <FullscreenExitIcon className="h-4 w-4" />
        ) : (
          <FullscreenIcon className="h-4 w-4" />
        )}
      </Button>
    </SRT_Tooltip>
  );
};
