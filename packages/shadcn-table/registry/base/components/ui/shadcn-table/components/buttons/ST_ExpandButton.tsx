import { type MouseEvent } from 'react';
import { Subscribe } from '@tanstack/react-table';
import { cva } from 'class-variance-authority';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  type ButtonProps,
  type ST_Row,
  type ST_RowData,
} from '@/components/ui/shadcn-table/types';
import { parseFromValuesOrFunc } from '@/components/ui/shadcn-table/shared/utils/utils';
import { ST_Tooltip } from '@/components/ui/shadcn-table/ST_Tooltip';

const expandButtonVariants = cva('', {
  variants: {
    density: {
      comfortable: '',
      compact: 'size-7',
      spacious: '',
    },
  },
  defaultVariants: {
    density: 'comfortable',
  },
});

export interface ST_ExpandButtonProps<TData extends ST_RowData>
  extends ButtonProps {
  row: ST_Row<TData>;
  staticRowIndex?: number;
}

export const ST_ExpandButton = <TData extends ST_RowData>({
  row,
  staticRowIndex,
}: ST_ExpandButtonProps<TData>) => {
  // The row carries the core table, which holds the ST options, atoms, refs
  // and setters; the ST wrapper types do not re-type it.
  const table = row.table;
  // Note: MRT's useTheme dropped; ST has no theme.direction (rtl).
  const {
    options: {
      icons: { ExpandMoreIcon },
      localization,
      positionExpandColumn,
      renderDetailPanel,
      stExpandButtonProps,
    },
  } = table;

  const iconButtonProps = parseFromValuesOrFunc(stExpandButtonProps, {
    row,
    staticRowIndex,
    table,
  });

  const canExpand = row.getCanExpand();

  const handleToggleExpand = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    row.toggleExpanded();
    iconButtonProps?.onClick?.(event);
  };

  const detailPanel = !!renderDetailPanel?.({ row, table });

  return (
    <Subscribe
      selector={(state) => ({
        density: state.density,
        expanded: state.expanded,
      })}
      source={table.store}
    >
      {({ density }) => {
        const isExpanded = row.getIsExpanded();

        return (
          <ST_Tooltip
            disableHoverListener={!canExpand && !detailPanel}
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
                type="button"
                variant="ghost"
                {...iconButtonProps}
                className={cn(
                  expandButtonVariants({ density }),
                  iconButtonProps?.className,
                )}
                onClick={handleToggleExpand}
                style={{
                  // Note: rtl 'mr'/'ml' switch dropped, positionExpandColumn only.
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
                          ? // Note: rtl 90deg branch dropped, no theme.direction in ST.
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
          </ST_Tooltip>
        );
      }}
    </Subscribe>
  );
};
