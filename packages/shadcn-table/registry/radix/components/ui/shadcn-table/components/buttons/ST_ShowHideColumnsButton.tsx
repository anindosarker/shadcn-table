import { Button } from '@/components/ui/button';
import { type ButtonProps } from '@/components/ui/shadcn-table/types';
import { ST_Tooltip } from '@/components/ui/shadcn-table/components/buttons/ST_Tooltip';
import { ST_ShowHideColumnsMenu } from '@/components/ui/shadcn-table/components/menus/ST_ShowHideColumnsMenu';
import { useSTContext } from '@/components/ui/shadcn-table/hooks/stTableHook';

export type ST_ShowHideColumnsButtonProps = ButtonProps;

// The menu trigger merges its props into this element, so they reach the
// button inside the tooltip.
const TooltipButton = ({
  tooltip,
  ...props
}: ButtonProps & { tooltip: string }) => (
  <ST_Tooltip title={tooltip}>
    <Button {...props} />
  </ST_Tooltip>
);

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

  return (
    <ST_ShowHideColumnsMenu
      trigger={
        <TooltipButton
          aria-haspopup="menu"
          aria-label={localization.showHideColumns}
          size="icon"
          tooltip={
            typeof rest?.title === 'string'
              ? rest.title
              : localization.showHideColumns
          }
          type="button"
          variant="ghost"
          {...rest}
          title={undefined}
        >
          <ViewColumnIcon />
        </TooltipButton>
      }
    />
  );
};
