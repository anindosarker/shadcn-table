import { type MouseEvent, useState } from 'react';
import { Button } from '@/components/ui/button';
import { type ButtonProps } from '@/components/ui/shadcn-table/types';
import { ST_Tooltip } from '@/components/ui/shadcn-table/components/buttons/ST_Tooltip';
import { ST_ShowHideColumnsMenu } from '@/components/ui/shadcn-table/components/menus/ST_ShowHideColumnsMenu';
import { useSTContext } from '@/components/ui/shadcn-table/hooks/stTableHook';
import { useST_MenuAnchor } from '@/components/ui/shadcn-table/hooks/useST_MenuAnchor';

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
  const { openerProps, toggle } = useST_MenuAnchor({
    anchorEl,
    setAnchorEl,
  });

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    toggle(event.currentTarget);
  };

  return (
    <>
      <ST_Tooltip title={rest?.title ?? localization.showHideColumns}>
        <Button
          aria-label={localization.showHideColumns}
          {...openerProps}
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
