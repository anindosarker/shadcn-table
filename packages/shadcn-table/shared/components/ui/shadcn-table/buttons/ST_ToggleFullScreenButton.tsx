import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  type ButtonProps,
  type ST_RowData,
  type ST_TableInstance,
} from '@/components/ui/shadcn-table/types';
import { ST_Tooltip } from '@/components/ui/shadcn-table/ST_Tooltip';

export interface ST_ToggleFullScreenButtonProps<TData extends ST_RowData>
  extends ButtonProps {
  table: ST_TableInstance<TData>;
}

export const ST_ToggleFullScreenButton = <TData extends ST_RowData>({
  table,
  ...rest
}: ST_ToggleFullScreenButtonProps<TData>) => {
  const {
    options: {
      icons: { FullscreenExitIcon, FullscreenIcon },
      localization,
    },
    setIsFullScreen,
  } = table;
  const { isFullScreen } = table.state;

  const [tooltipOpened, setTooltipOpened] = useState(false);

  const handleToggleFullScreen = () => {
    setTooltipOpened(false);
    setIsFullScreen(!isFullScreen);
  };

  return (
    <ST_Tooltip
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
        type="button"
        variant="ghost"
        {...rest}
        title={undefined}
      >
        {isFullScreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
      </Button>
    </ST_Tooltip>
  );
};
