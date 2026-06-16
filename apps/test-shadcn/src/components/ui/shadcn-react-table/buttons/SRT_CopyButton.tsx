import { type MouseEvent, type ReactNode, useState } from 'react';
import {
  type SRT_Cell,
  type SRT_CellHTMLPropsContext,
  type SRT_RowData,
  type SRT_TableInstance,
  mergeSRT_HtmlProps,
  parseSRT_HtmlProps,
} from 'shadcn-react-table-core';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { SRT_Tooltip } from '../SRT_Tooltip';

export interface SRT_CopyButtonProps<TData extends SRT_RowData> {
  cell: SRT_Cell<TData>;
  children?: ReactNode;
  table: SRT_TableInstance<TData>;
  className?: string;
}

export const SRT_CopyButton = <TData extends SRT_RowData>({
  cell,
  children,
  table,
  className,
}: SRT_CopyButtonProps<TData>) => {
  const {
    options: { localization, srtCopyButtonProps },
  } = table;
  const { column, row } = cell;
  const { columnDef } = column;

  const [copied, setCopied] = useState(false);

  const handleCopy = (event: MouseEvent, text: unknown) => {
    event.stopPropagation();
    navigator.clipboard.writeText(text as string);
    setCopied(true);
    setTimeout(() => setCopied(false), 4000);
  };

  const htmlPropsContext: SRT_CellHTMLPropsContext<TData> = {
    cell,
    column,
    row,
    table,
  };
  const buttonProps = mergeSRT_HtmlProps(
    parseSRT_HtmlProps(srtCopyButtonProps, htmlPropsContext),
    parseSRT_HtmlProps(columnDef.srtCopyButtonProps, htmlPropsContext),
  );

  const tooltipTitle =
    buttonProps?.title ??
    (copied ? localization.copiedToClipboard : localization.clickToCopy);

  return (
    <SRT_Tooltip title={tooltipTitle}>
      <Button
        onClick={(e) => handleCopy(e, cell.getValue())}
        size="sm"
        type="button"
        variant="ghost"
        {...buttonProps}
        className={cn(
          'h-auto cursor-copy border-0 bg-transparent p-0 font-inherit text-inherit hover:bg-transparent',
          className,
          buttonProps?.className,
        )}
      >
        {children ?? (cell.getValue() as string)}
      </Button>
    </SRT_Tooltip>
  );
};
