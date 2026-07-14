import { cva } from 'class-variance-authority';
import {
  type ButtonProps,
  type SRT_RowData,
  type SRT_TableInstance,
  parseFromValuesOrFunc,
} from 'shadcn-react-table-core';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { SRT_Tooltip } from '../SRT_Tooltip';

// Note: MUI sized the button 2.25rem (comfortable/spacious) / 1.75rem (compact);
// both size overrides drop for shadcn size="icon" (size-9) — compact no longer
// shrinks. Only the -mt-1 nudge (layout, MUI mt:-0.25rem when not compact) stays.
const expandAllButtonVariants = cva('', {
  variants: {
    density: {
      comfortable: '-mt-1',
      compact: '',
      spacious: '-mt-1',
    },
  },
  defaultVariants: {
    density: 'comfortable',
  },
});

export interface SRT_ExpandAllButtonProps<TData extends SRT_RowData>
  extends ButtonProps {
  table: SRT_TableInstance<TData>;
}

export const SRT_ExpandAllButton = <TData extends SRT_RowData>({
  table,
  ...rest
}: SRT_ExpandAllButtonProps<TData>) => {
  const {
    getCanSomeRowsExpand,
    getIsAllRowsExpanded,
    getIsSomeRowsExpanded,
    getState,
    options: {
      icons: { KeyboardDoubleArrowDownIcon },
      localization,
      srtExpandAllButtonProps,
      renderDetailPanel,
    },
    toggleAllRowsExpanded,
  } = table;
  const { density, isLoading } = getState();

  const iconButtonProps = {
    ...parseFromValuesOrFunc(srtExpandAllButtonProps, {
      table,
    }),
    ...rest,
  };

  const isAllRowsExpanded = getIsAllRowsExpanded();

  return (
    <SRT_Tooltip
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
    </SRT_Tooltip>
  );
};
