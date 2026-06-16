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

  const isRtl =
    typeof document !== 'undefined' &&
    document.documentElement.getAttribute('dir') === 'rtl';
  const indentOnRight = isRtl || positionExpandColumn === 'last';

  const rotation =
    !canExpand && !renderDetailPanel
      ? indentOnRight
        ? 90
        : -90
      : isExpanded
        ? -180
        : 0;

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
        aria-label={localization.expand}
        disabled={isDisabled}
        onClick={handleToggleExpand}
        size="icon"
        variant="ghost"
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
