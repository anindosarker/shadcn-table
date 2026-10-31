import { type MouseEvent, useState } from 'react';
import { Button } from '@/components/ui-radix/button';
import { type ButtonProps } from '@/components/ui-radix/shadcn-table/types';
import { ST_Tooltip } from '@/components/ui-radix/shadcn-table/components/buttons/ST_Tooltip';
import { ST_ShowHideColumnsMenu } from '@/components/ui-radix/shadcn-table/components/menus/ST_ShowHideColumnsMenu';
import { useSTContext } from '@/components/ui-radix/shadcn-table/hooks/stTableHook';

export type ST_ShowHideColumnsButtonProps = ButtonProps;

export const ST_ShowHideColumnsButton = ({
  ...rest
}: ST_ShowHideColumnsButtonProps) => {
  const table = useSTContext();
  const {
    options: {
      icons: { ViewColumnIcon },
      localization,
    },
  } = table;

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <>
      <ST_Tooltip title={rest?.title ?? localization.showHideColumns}>
        <Button
          aria-label={localization.showHideColumns}
          onClick={handleClick}
          size="icon"
          type="button"
          variant="ghost"
          {...rest}
          title={undefined}
        >
          <ViewColumnIcon />
        </Button>
      </ST_Tooltip>
      {anchorEl && (
        <ST_ShowHideColumnsMenu anchorEl={anchorEl} setAnchorEl={setAnchorEl} />
      )}
    </>
  );
};
