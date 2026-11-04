import { type ButtonProps } from '@/components/ui/shadcn-table/types';
import { ST_TooltipButton } from '@/components/ui/shadcn-table/components/buttons/ST_TooltipButton';
import { ST_ShowHideColumnsMenu } from '@/components/ui/shadcn-table/components/menus/ST_ShowHideColumnsMenu';
import { useSTContext } from '@/components/ui/shadcn-table/hooks/stTableHook';

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

  return (
    <ST_ShowHideColumnsMenu
      trigger={
        <ST_TooltipButton
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
        >
          <ViewColumnIcon />
        </ST_TooltipButton>
      }
    />
  );
};
