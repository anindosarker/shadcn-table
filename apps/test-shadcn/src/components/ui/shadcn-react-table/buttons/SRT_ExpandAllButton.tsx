import {
  type SRT_RowData,
  type SRT_TableHTMLPropsContext,
  type SRT_TableInstance,
  parseSRT_HtmlProps,
} from 'shadcn-react-table-core';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { SRT_Tooltip } from '../SRT_Tooltip';

export interface SRT_ExpandAllButtonProps<TData extends SRT_RowData> {
  table: SRT_TableInstance<TData>;
  className?: string;
}

/**
 * Expand all button - toggle expansion of all rows.
 *
 * Ported from MRT_ExpandAllButton:
 * - Double-chevron icon (KeyboardDoubleArrowDownIcon from the table icon
 *   registry) that rotates with state: 0deg collapsed, -90deg some expanded,
 *   -180deg all expanded.
 * - Disabled while loading or when no rows can expand (and there is no detail
 *   panel).
 * - Tooltip (localization.expandAll / collapseAll) via SRT_Tooltip; the
 *   user-supplied `title` from srtExpandAllButtonProps takes precedence, and the
 *   tooltip is suppressed while disabled (matches MRT).
 * - Resolves the table-level `srtExpandAllButtonProps` slot and spreads it.
 */

export const SRT_ExpandAllButton = <TData extends SRT_RowData>({
  table,
  className,
}: SRT_ExpandAllButtonProps<TData>) => {
  const {
    getCanSomeRowsExpand,
    getIsAllRowsExpanded,
    getIsSomeRowsExpanded,
    getState,
    options: {
      icons: { KeyboardDoubleArrowDownIcon },
      localization,
      renderDetailPanel,
      srtExpandAllButtonProps,
    },
    toggleAllRowsExpanded,
  } = table;
  const { density, isLoading } = getState();

  const isAllRowsExpanded = getIsAllRowsExpanded();
  const isSomeRowsExpanded = getIsSomeRowsExpanded();

  const isDisabled =
    isLoading || (!renderDetailPanel && !getCanSomeRowsExpand());

  // Rotation: 0deg = collapsed, -90deg = some expanded, -180deg = all expanded
  const rotation = isAllRowsExpanded ? -180 : isSomeRowsExpanded ? -90 : 0;

  const htmlPropsContext: SRT_TableHTMLPropsContext<TData> = { table };
  const buttonProps = parseSRT_HtmlProps(
    srtExpandAllButtonProps,
    htmlPropsContext,
  );

  const tooltipTitle =
    buttonProps?.title ??
    (isAllRowsExpanded ? localization.collapseAll : localization.expandAll);

  return (
    <SRT_Tooltip title={tooltipTitle} disabled={isDisabled}>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => toggleAllRowsExpanded(!isAllRowsExpanded)}
        disabled={isDisabled}
        aria-label={localization.expandAll}
        {...buttonProps}
        className={cn(
          'transition-all',
          density === 'compact' ? 'h-7 w-7' : 'h-9 w-9',
          density !== 'compact' && '-mt-1',
          className,
          buttonProps?.className,
        )}
      >
        <KeyboardDoubleArrowDownIcon
          className="h-4 w-4 transition-transform duration-150"
          style={{ transform: `rotate(${rotation}deg)` }}
        />
      </Button>
    </SRT_Tooltip>
  );
};
