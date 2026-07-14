import { type MouseEvent, useState } from 'react';
import { cva } from 'class-variance-authority';
import {
  type ButtonProps,
  type SRT_Cell,
  type SRT_RowData,
  type SRT_TableInstance,
  parseFromValuesOrFunc,
} from 'shadcn-react-table-core';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { SRT_Tooltip } from '../SRT_Tooltip';

// Note: user-authorized exception (2026-07-11) to the no-className ruling —
// click-to-copy cells must render as cell text, not a button box. The MUI sx
// treatment (backgroundColor/border/color/font*/letterSpacing/textAlign/
// textTransform inherit, minWidth unset, h-auto, py-0) is restored so the copy
// control inherits the cell's typography; m-[-0.25rem] + cursor-copy stay.
const copyButtonVariants = cva(
  'm-[-0.25rem] h-auto min-w-0 cursor-copy border-none bg-transparent py-0 font-[inherit] text-[inherit] tracking-[inherit] text-inherit [text-align:inherit] [text-transform:inherit]',
);

export interface SRT_CopyButtonProps<TData extends SRT_RowData>
  extends ButtonProps {
  cell: SRT_Cell<TData>;
  table: SRT_TableInstance<TData>;
}

export const SRT_CopyButton = <TData extends SRT_RowData>({
  cell,
  table,
  ...rest
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

  const buttonProps = {
    ...parseFromValuesOrFunc(srtCopyButtonProps, {
      cell,
      column,
      row,
      table,
    }),
    ...parseFromValuesOrFunc(columnDef.srtCopyButtonProps, {
      cell,
      column,
      row,
      table,
    }),
    ...rest,
  };

  return (
    <SRT_Tooltip
      side="top"
      title={
        buttonProps?.title ??
        (copied ? localization.copiedToClipboard : localization.clickToCopy)
      }
    >
      <Button
        onClick={(e) => handleCopy(e, cell.getValue())}
        size="sm"
        type="button"
        variant="ghost"
        {...buttonProps}
        className={cn(copyButtonVariants(), buttonProps?.className)}
        title={undefined}
      />
    </SRT_Tooltip>
  );
};
