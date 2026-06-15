import { type MouseEvent } from 'react';
import {
  type SRT_Row,
  type SRT_RowData,
  type SRT_RowHTMLPropsContext,
  type SRT_TableInstance,
  parseSRT_HtmlProps,
} from 'shadcn-react-table-core';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { SRT_Tooltip } from '../SRT_Tooltip';

export interface SRT_ExpandButtonProps<TData extends SRT_RowData> {
  row: SRT_Row<TData>;
  staticRowIndex?: number;
  table: SRT_TableInstance<TData>;
  className?: string;
}

/**
 * Expand button - toggle row expansion.
 *
 * Ported from MRT_ExpandButton:
 * - Chevron icon (ExpandMoreIcon from the table icon registry) that rotates with
 *   expand state.
 * - Indents based on row depth. The indent side follows the layout direction:
 *   `marginRight` in RTL or when positionExpandColumn === 'last', otherwise
 *   `marginLeft` (mirrors MRT's `theme.direction === 'rtl' || last ? mr : ml`).
 * - Disabled when the row can't expand and has no detail panel.
 * - Tooltip (localization.expand / collapse) via SRT_Tooltip; suppressed while
 *   disabled (matches MRT hiding the tooltip on disabled buttons).
 * - Resolves the table-level `srtExpandButtonProps` slot and spreads it.
 */

export const SRT_ExpandButton = <TData extends SRT_RowData>({
  row,
  staticRowIndex,
  table,
  className,
}: SRT_ExpandButtonProps<TData>) => {
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

  const canExpand = row.getCanExpand();
  const isExpanded = row.getIsExpanded();
  const detailPanel = !!renderDetailPanel?.({ row, table });

  const handleToggleExpand = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    row.toggleExpanded();
  };

  const isDisabled = !canExpand && !detailPanel;

  // RTL is driven by the document `dir` attribute (no MUI theme to read from).
  const isRtl =
    typeof document !== 'undefined' &&
    document.documentElement.getAttribute('dir') === 'rtl';
  const indentOnRight = isRtl || positionExpandColumn === 'last';

  // Rotation mirrors MRT: when the row can't expand and has no detail panel, the
  // chevron points sideways (+90 on the right edge / RTL, -90 otherwise);
  // otherwise it points down (0) or up (-180 when expanded).
  const rotation =
    !canExpand && !renderDetailPanel
      ? indentOnRight
        ? 90
        : -90
      : isExpanded
        ? -180
        : 0;

  // Indent based on row depth, on the leading edge per layout direction.
  const indentPixels = row.depth * 16;
  const indentStyle = indentOnRight
    ? { marginRight: `${indentPixels}px` }
    : { marginLeft: `${indentPixels}px` };

  const htmlPropsContext: SRT_RowHTMLPropsContext<TData> = {
    row,
    staticRowIndex,
    table,
  };
  const buttonProps = parseSRT_HtmlProps(
    srtExpandButtonProps,
    htmlPropsContext,
  );

  return (
    <SRT_Tooltip
      title={isExpanded ? localization.collapse : localization.expand}
      disabled={isDisabled}
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={handleToggleExpand}
        disabled={isDisabled}
        aria-label={localization.expand}
        {...buttonProps}
        style={{ ...indentStyle, ...buttonProps?.style }}
        className={cn(
          'transition-all duration-150',
          density === 'compact' ? 'h-7 w-7' : 'h-9 w-9',
          isDisabled && 'opacity-30',
          className,
          buttonProps?.className,
        )}
      >
        <ExpandMoreIcon
          className="h-4 w-4 transition-transform duration-150"
          style={{ transform: `rotate(${rotation}deg)` }}
        />
      </Button>
    </SRT_Tooltip>
  );
};
