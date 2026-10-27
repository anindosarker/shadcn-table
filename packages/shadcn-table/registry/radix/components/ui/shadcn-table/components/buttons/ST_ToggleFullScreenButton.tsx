import { useState } from 'react';
import { Subscribe } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { type ButtonProps } from '@/components/ui/shadcn-table/types';
import { ST_Tooltip } from '@/components/ui/shadcn-table/ST_Tooltip';
import { useSTContext } from '@/components/ui/shadcn-table/hooks/stTableHook';

export interface ST_ToggleFullScreenButtonProps extends ButtonProps {
  /**
   * Transition, part 01 phase 03: ignored, the table comes from the context.
   * Goes in the integration step, once no caller passes it.
   */
  table?: unknown;
}

export const ST_ToggleFullScreenButton = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- transition: kept off the DOM until the callers drop it
  table: _table,
  ...rest
}: ST_ToggleFullScreenButtonProps) => {
  const table = useSTContext();
  const {
    options: {
      icons: { FullscreenExitIcon, FullscreenIcon },
      localization,
    },
    setIsFullScreen,
  } = table;

  const [tooltipOpened, setTooltipOpened] = useState(false);

  const handleToggleFullScreen = () => {
    setTooltipOpened(false);
    setIsFullScreen(!table.atoms.isFullScreen.get());
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
        <Subscribe source={table.atoms.isFullScreen}>
          {(isFullScreen) =>
            isFullScreen ? <FullscreenExitIcon /> : <FullscreenIcon />
          }
        </Subscribe>
      </Button>
    </ST_Tooltip>
  );
};
