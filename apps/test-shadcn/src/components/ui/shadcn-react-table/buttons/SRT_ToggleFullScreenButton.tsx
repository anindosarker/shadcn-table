import { useState } from 'react';
import {
  type ButtonProps,
  type SRT_RowData,
  type SRT_TableInstance,
} from 'shadcn-react-table-core';
import { Button } from '@/components/ui/button';
import { SRT_Tooltip } from '../SRT_Tooltip';

// Note: toggleFullScreenButtonVariants cva deleted — only carried h-9 w-9 to
// restyle the shadcn Button (matches size="icon" size-9). Icon h-4 w-4 dropped.

export interface SRT_ToggleFullScreenButtonProps<TData extends SRT_RowData>
  extends ButtonProps {
  table: SRT_TableInstance<TData>;
}

export const SRT_ToggleFullScreenButton = <TData extends SRT_RowData>({
  table,
  ...rest
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
      open={tooltipOpened}
      title={rest?.title ?? localization.toggleFullScreen}
    >
      <Button
        aria-label={localization.toggleFullScreen}
        onBlur={() => setTooltipOpened(false)}
        onClick={handleToggleFullScreen}
        onFocus={() => setTooltipOpened(true)}
        onMouseEnter={() => setTooltipOpened(true)}
        onMouseLeave={() => setTooltipOpened(false)}
        size="icon"
        variant="ghost"
        {...rest}
        className={rest?.className}
        title={undefined}
      >
        {isFullScreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
      </Button>
    </SRT_Tooltip>
  );
};
