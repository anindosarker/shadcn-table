import * as React from 'react';
import {
  parseFromValuesOrFunc,
  type SRT_Row,
  type SRT_RowData,
  type SRT_TableInstance,
} from 'shadcn-react-table-core';
import { cva } from 'class-variance-authority';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { FieldGroup } from '@/components/ui/field';
import { cn } from '@/lib/utils';
import { SRT_EditActionButtons } from '../buttons/SRT_EditActionButtons';
import { SRT_EditCellTextField } from '../inputs/SRT_EditCellTextField';

// Note: MUI `fullWidth maxWidth="xs"` → `sm:max-w-[444px]` (MUI xs breakpoint 444px).
// `fullWidth` is already covered by DialogContent's base `w-full`.
const editRowModalVariants = cva('sm:max-w-[444px]');

export interface SRT_EditRowModalProps<TData extends SRT_RowData>
  extends Partial<React.ComponentPropsWithRef<typeof DialogContent>> {
  open: boolean;
  table: SRT_TableInstance<TData>;
}

export const SRT_EditRowModal = <TData extends SRT_RowData>({
  open,
  table,
  ...rest
}: SRT_EditRowModalProps<TData>) => {
  const {
    getState,
    options: {
      localization,
      srtCreateRowModalProps,
      srtEditRowDialogProps,
      onCreatingRowCancel,
      onEditingRowCancel,
      renderCreateRowDialogContent,
      renderEditRowDialogContent,
    },
    setCreatingRow,
    setEditingRow,
  } = table;
  const { creatingRow, editingRow } = getState();
  const row = (creatingRow ?? editingRow) as SRT_Row<TData>;

  const dialogProps = {
    ...parseFromValuesOrFunc(srtEditRowDialogProps, { row, table }),
    ...(creatingRow &&
      parseFromValuesOrFunc(srtCreateRowModalProps, { row, table })),
    ...rest,
  };

  /* eslint-disable @typescript-eslint/no-explicit-any -- MRT-parity: getAllCells() widening */
  const internalEditComponents = row
    .getAllCells()
    .filter((cell) => cell.column.columnDef.columnDefType === 'data')
    .map((cell) => (
      <SRT_EditCellTextField
        cell={cell as any}
        key={cell.id}
        table={table as any}
      />
    ));
  /* eslint-enable @typescript-eslint/no-explicit-any */

  const handleClose = () => {
    if (creatingRow) {
      onCreatingRowCancel?.({ row, table });
      setCreatingRow(null);
    } else {
      onEditingRowCancel?.({ row, table });
      setEditingRow(null);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    row._valuesCache = {} as any; //reset values cache
    // dialogProps.onClose?.(event, reason);
    // Note: MUI onClose(event, reason) → radix onOpenChange. The DivProps slot has
    // no onClose/onOpenChange surface, so close interception is not exposed to users.
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) handleClose();
      }}
    >
      <DialogContent
        // Note: MUI Dialog has no built-in close button — hide shadcn's top-right X for parity.
        showCloseButton={false}
        // Note: no MRT DialogDescription equivalent; silence radix "Missing Description" warning.
        aria-describedby={undefined}
        {...dialogProps}
        className={cn(editRowModalVariants(), dialogProps.className)}
      >
        {((creatingRow &&
          renderCreateRowDialogContent?.({
            internalEditComponents,
            row,
            table,
          })) ||
          renderEditRowDialogContent?.({
            internalEditComponents,
            row,
            table,
          })) ?? (
          <>
            <DialogHeader>
              <DialogTitle className="text-center">
                {localization.edit}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={(e) => e.preventDefault()}>
              {/* Note: MUI Stack gap:32px/pt:16px → ui/FieldGroup (flex-col stack);
                  its gap-7 default and no top padding win over the MRT gap-8/pt-4. */}
              <FieldGroup>{internalEditComponents}</FieldGroup>
            </form>
            {/* Note: MUI DialogActions sx p:1.25rem → p-5 dropped (padding
                override; shadcn DialogFooter default padding wins). */}
            <DialogFooter>
              <SRT_EditActionButtons row={row} table={table} variant="text" />
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
