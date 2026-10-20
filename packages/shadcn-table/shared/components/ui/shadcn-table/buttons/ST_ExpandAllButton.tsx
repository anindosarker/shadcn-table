import { cva } from 'class-variance-authority';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  type ButtonProps,
  type ST_RowData,
  type ST_TableInstance,
} from '@/components/ui/shadcn-table/types';
import { parseFromValuesOrFunc } from '@/components/ui/shadcn-table/utils/utils';
import { ST_Tooltip } from '@/components/ui/shadcn-table/ST_Tooltip';

const expandAllButtonVariants = cva('', {
  variants: {
    density: {
      comfortable: '-mt-1',
      compact: 'size-7',
      spacious: '-mt-1',
    },
  },
  defaultVariants: {
    density: 'comfortable',
  },
});

export interface ST_ExpandAllButtonProps<TData extends ST_RowData>
  extends ButtonProps {
  table: ST_TableInstance<TData>;
}

export const ST_ExpandAllButton = <TData extends ST_RowData>({
  table,
  ...rest
}: ST_ExpandAllButtonProps<TData>) => {
  const {
    getCanSomeRowsExpand,
    getIsAllRowsExpanded,
    getIsSomeRowsExpanded,
    options: {
      icons: { KeyboardDoubleArrowDownIcon },
      localization,
      stExpandAllButtonProps,
      renderDetailPanel,
    },
    toggleAllRowsExpanded,
  } = table;
  const { density, isLoading } = table.state;

  const iconButtonProps = {
    ...parseFromValuesOrFunc(stExpandAllButtonProps, {
      table,
    }),
    ...rest,
  };

  const isAllRowsExpanded = getIsAllRowsExpanded();

  return (
    <ST_Tooltip
      title={
        iconButtonProps?.title ??
        (isAllRowsExpanded ? localization.collapseAll : localization.expandAll)
      }
    >
      <span>
        <Button
          aria-label={localization.expandAll}
          disabled={
            isLoading || (!renderDetailPanel && !getCanSomeRowsExpand())
          }
          onClick={() => toggleAllRowsExpanded(!isAllRowsExpanded)}
          size="icon"
          type="button"
          variant="ghost"
          {...iconButtonProps}
          title={undefined}
          className={cn(
            expandAllButtonVariants({ density }),
            iconButtonProps?.className,
          )}
        >
          {iconButtonProps?.children ?? (
            <KeyboardDoubleArrowDownIcon
              className={cn(
                'transition-transform duration-150',
                isAllRowsExpanded
                  ? '-rotate-180'
                  : getIsSomeRowsExpanded()
                    ? '-rotate-90'
                    : 'rotate-0',
              )}
            />
          )}
        </Button>
      </span>
    </ST_Tooltip>
  );
};
