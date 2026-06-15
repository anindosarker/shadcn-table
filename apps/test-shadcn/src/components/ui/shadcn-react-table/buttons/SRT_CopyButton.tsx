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

/**
 * Copy button - copy cell value to clipboard.
 *
 * Ported from MRT_CopyButton:
 * - Copies the cell value on click and shows "copied" feedback for 4 seconds.
 * - Tooltip (localization.clickToCopy / copiedToClipboard) via SRT_Tooltip; the
 *   user-supplied `title` from srtCopyButtonProps takes precedence (matches MRT).
 * - Resolves the table-level + columnDef-level `srtCopyButtonProps` slots
 *   (columnDef wins) and spreads them onto the button.
 * - Transparent button that inherits the surrounding text style.
 */

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

  // Resolve the table-level + columnDef-level slot props (columnDef wins on
  // conflicts; classNames compose and event handlers chain).
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
        variant="ghost"
        size="sm"
        type="button"
        onClick={(e) => handleCopy(e, cell.getValue())}
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
