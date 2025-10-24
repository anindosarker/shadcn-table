import { type MouseEvent, useState } from 'react';
import {
  type SRT_Cell,
  type SRT_RowData,
  type SRT_TableInstance,
} from 'shadcn-react-table-core';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface SRT_CopyButtonProps<TData extends SRT_RowData> {
  cell: SRT_Cell<TData>;
  table: SRT_TableInstance<TData>;
  className?: string;
}

/**
 * Copy button - copy cell value to clipboard
 *
 * Barebones implementation:
 * - Copy cell value on click
 * - Show "copied" feedback for 4 seconds
 * - Transparent button that inherits text style
 *
 * TODO (Future enhancements):
 * - Add tooltip
 * - Add copy icon
 * - Add srtCopyButtonProps support
 * - Add custom format function
 * - Add animation on copy
 */

export const SRT_CopyButton = <TData extends SRT_RowData>({
  cell,
  table,
  className,
}: SRT_CopyButtonProps<TData>) => {
  const {
    options: { localization },
  } = table;

  const [copied, setCopied] = useState(false);

  const handleCopy = (event: MouseEvent, text: unknown) => {
    event.stopPropagation();
    navigator.clipboard.writeText(text as string);
    setCopied(true);
    setTimeout(() => setCopied(false), 4000);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      type="button"
      onClick={(e) => handleCopy(e, cell.getValue())}
      title={copied ? localization.copiedToClipboard : localization.clickToCopy}
      className={cn(
        'h-auto cursor-copy border-0 bg-transparent p-0 font-inherit text-inherit hover:bg-transparent',
        className,
      )}
    >
      {cell.getValue() as string}
    </Button>
  );
};
