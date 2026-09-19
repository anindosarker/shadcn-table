import { type MouseEvent, useState } from 'react';
import {
  type ButtonProps,
  type SRT_RowData,
  type SRT_TableInstance,
} from 'shadcn-react-table-core';
import { Button } from '@/components/ui/button';
import { SRT_Tooltip } from '../SRT_Tooltip';
import { SRT_ShowHideColumnsMenu } from '../menus/SRT_ShowHideColumnsMenu';

export interface SRT_ShowHideColumnsButtonProps<TData extends SRT_RowData>
  extends ButtonProps {
  table: SRT_TableInstance<TData>;
}

export const SRT_ShowHideColumnsButton = <TData extends SRT_RowData>({
  table,
  ...rest
}: SRT_ShowHideColumnsButtonProps<TData>) => {
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
      <SRT_Tooltip title={rest?.title ?? localization.showHideColumns}>
        <Button
          aria-label={localization.showHideColumns}
          onClick={handleClick}
          size="icon"
          variant="ghost"
          {...rest}
          title={undefined}
        >
          <ViewColumnIcon />
        </Button>
      </SRT_Tooltip>
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
