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
        aria-label={localization.expandAll}
        disabled={isDisabled}
        onClick={() => toggleAllRowsExpanded(!isAllRowsExpanded)}
        size="icon"
        variant="ghost"
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
