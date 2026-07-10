import { type MouseEvent } from 'react';
import { cva } from 'class-variance-authority';
import {
  type ButtonProps,
  type SRT_Row,
  type SRT_RowData,
  type SRT_TableInstance,
  parseFromValuesOrFunc,
} from 'shadcn-react-table-core';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { SRT_Tooltip } from '../SRT_Tooltip';

const expandButtonVariants = cva('', {
  variants: {
    density: {
      compact: 'h-7 w-7',
      default: 'h-9 w-9',
    },
    expandable: {
      true: 'opacity-100',
      false: 'opacity-30',
    },
  },
  defaultVariants: {
    density: 'default',
    expandable: true,
  },
});

export interface SRT_ExpandButtonProps<TData extends SRT_RowData>
  extends ButtonProps {
  row: SRT_Row<TData>;
  staticRowIndex?: number;
  table: SRT_TableInstance<TData>;
}

export const SRT_ExpandButton = <TData extends SRT_RowData>({
  row,
  staticRowIndex,
  table,
}: SRT_ExpandButtonProps<TData>) => {
  // Note: MRT's useTheme dropped — SRT has no theme.direction (rtl).
  const {
    getState,
    options: {
      icons: { ExpandMoreIcon },
      localization,
      positionExpandColumn,
      renderDetailPanel,
      srtExpandButtonProps,
    },
  } = table;
  const { density } = getState();

  const iconButtonProps = parseFromValuesOrFunc(srtExpandButtonProps, {
    row,
    staticRowIndex,
    table,
  });

  const canExpand = row.getCanExpand();
  const isExpanded = row.getIsExpanded();

  const handleToggleExpand = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    row.toggleExpanded();
    iconButtonProps?.onClick?.(event);
  };

  const detailPanel = !!renderDetailPanel?.({ row, table });

  return (
    <SRT_Tooltip
      disabled={!canExpand && !detailPanel}
      title={
        iconButtonProps?.title ??
        (isExpanded ? localization.collapse : localization.expand)
      }
    >
      <span>
        <Button
          aria-label={localization.expand}
          disabled={!canExpand && !detailPanel}
          size="icon"
          variant="ghost"
          {...iconButtonProps}
          onClick={handleToggleExpand}
          className={cn(
            expandButtonVariants({
              density: density === 'compact' ? 'compact' : 'default',
              expandable: canExpand || detailPanel,
            }),
            iconButtonProps?.className,
          )}
          style={{
            // Note: rtl 'mr'/'ml' switch dropped — positionExpandColumn only.
            ...(positionExpandColumn === 'last'
              ? { marginRight: `${row.depth * 16}px` }
              : { marginLeft: `${row.depth * 16}px` }),
            ...iconButtonProps?.style,
          }}
          title={undefined}
        >
          {iconButtonProps?.children ?? (
            <ExpandMoreIcon
              style={{
                transform: `rotate(${
                  !canExpand && !renderDetailPanel
                    ? // Note: rtl 90deg branch dropped — no theme.direction in SRT.
                      positionExpandColumn === 'last'
                      ? 90
                      : -90
                    : isExpanded
                      ? -180
                      : 0
                }deg)`,
                transition: 'transform 150ms',
              }}
            />
          )}
        </Button>
      </span>
    </SRT_Tooltip>
  );
};
