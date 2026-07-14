import { type MouseEvent } from 'react';
import {
  type ButtonProps,
  type SRT_Row,
  type SRT_RowData,
  type SRT_TableInstance,
  parseFromValuesOrFunc,
} from 'shadcn-react-table-core';
import { Button } from '@/components/ui/button';
import { SRT_Tooltip } from '../SRT_Tooltip';

// Note: expandButtonVariants cva deleted — it existed solely to restyle the
// shadcn Button: density h-7/h-9 sizes drop for size="icon" (size-9; compact no
// longer shrinks), and the expandable opacity-100/opacity-30 dim drops — the
// button's `disabled` state already applies shadcn's disabled:opacity-50.

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
  // Note: getState()/density dropped — the removed size cva was its only consumer.
  const {
    options: {
      icons: { ExpandMoreIcon },
      localization,
      positionExpandColumn,
      renderDetailPanel,
      srtExpandButtonProps,
    },
  } = table;

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
          className={iconButtonProps?.className}
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
