import { Subscribe } from '@tanstack/react-table';
import { cva } from 'class-variance-authority';
import { Button } from '@/components/ui-radix/button';
import { cn } from '@/lib/utils';
import { type ButtonProps } from '@/components/ui-radix/shadcn-table/types';
import { parseFromValuesOrFunc } from '@/components/ui-radix/shadcn-table/shared/utils/utils';
import { ST_Tooltip } from '@/components/ui-radix/shadcn-table/ST_Tooltip';
import { useSTContext } from '@/components/ui-radix/shadcn-table/hooks/stTableHook';

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

export type ST_ExpandAllButtonProps = ButtonProps;

export const ST_ExpandAllButton = ({ ...rest }: ST_ExpandAllButtonProps) => {
  const table = useSTContext();
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

  const iconButtonProps = {
    ...parseFromValuesOrFunc(stExpandAllButtonProps, {
      table,
    }),
    ...rest,
  };

  // The expand getters walk the row model, so the selector lists every slice
  // that feeds it besides the expanded state.
  return (
    <Subscribe
      selector={(state) => ({
        columnFilterFns: state.columnFilterFns,
        columnFilters: state.columnFilters,
        density: state.density,
        expanded: state.expanded,
        globalFilter: state.globalFilter,
        globalFilterFn: state.globalFilterFn,
        grouping: state.grouping,
        isLoading: state.isLoading,
        pagination: state.pagination,
        sorting: state.sorting,
      })}
      source={table.store}
    >
      {({ density, isLoading }) => {
        const isAllRowsExpanded = getIsAllRowsExpanded();

        return (
          <ST_Tooltip
            title={
              iconButtonProps?.title ??
              (isAllRowsExpanded
                ? localization.collapseAll
                : localization.expandAll)
            }
          >
            <span>
              <Button
                aria-label={localization.expandAll}
                disabled={
                  isLoading || (!renderDetailPanel && !getCanSomeRowsExpand())
                }
                onClick={() => toggleAllRowsExpanded(!getIsAllRowsExpanded())}
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
      }}
    </Subscribe>
  );
};
