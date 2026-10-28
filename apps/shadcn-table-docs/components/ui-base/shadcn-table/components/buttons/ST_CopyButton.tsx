import { type MouseEvent, useState } from 'react';
import { cva } from 'class-variance-authority';
import { Button } from '@/components/ui-base/button';
import { cn } from '@/lib/utils';
import {
  type ButtonProps,
  type ST_Cell,
  type ST_RowData,
} from '@/components/ui-base/shadcn-table/types';
import { parseFromValuesOrFunc } from '@/components/ui-base/shadcn-table/shared/utils/utils';
import { ST_Tooltip } from '@/components/ui-base/shadcn-table/ST_Tooltip';

const copyButtonVariants = cva(
  'm-[-0.25rem] h-auto min-w-0 cursor-copy border-none bg-transparent py-0 font-[inherit] [font-size:inherit] tracking-[inherit] text-inherit [text-align:inherit] [text-transform:inherit]',
);

export interface ST_CopyButtonProps<TData extends ST_RowData>
  extends ButtonProps {
  cell: ST_Cell<TData>;
}

export const ST_CopyButton = <TData extends ST_RowData>({
  cell,
  ...rest
}: ST_CopyButtonProps<TData>) => {
  const table = cell.table;
  const {
    options: { localization, stCopyButtonProps },
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
    ...parseFromValuesOrFunc(stCopyButtonProps, {
      cell,
      column,
      row,
      table,
    }),
    ...parseFromValuesOrFunc(columnDef.stCopyButtonProps, {
      cell,
      column,
      row,
      table,
    }),
    ...rest,
  };

  return (
    <ST_Tooltip
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
    </ST_Tooltip>
  );
};
