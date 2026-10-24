import { type MouseEvent, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  type ButtonProps,
  type ST_RowData,
  type ST_TableInstance,
} from '@/components/ui/shadcn-table/types';
import { ST_Tooltip } from '@/components/ui/shadcn-table/ST_Tooltip';
import { ST_ShowHideColumnsMenu } from '@/components/ui/shadcn-table/menus/ST_ShowHideColumnsMenu';

export interface ST_ShowHideColumnsButtonProps<TData extends ST_RowData>
  extends ButtonProps {
  table: ST_TableInstance<TData>;
}

export const ST_ShowHideColumnsButton = <TData extends ST_RowData>({
  table,
  ...rest
}: ST_ShowHideColumnsButtonProps<TData>) => {
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
        <ST_ShowHideColumnsMenu
          anchorEl={anchorEl}
          setAnchorEl={setAnchorEl}
          table={table}
        />
      )}
    </>
  );
};
