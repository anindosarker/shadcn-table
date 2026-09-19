import * as React from 'react';
import {
  parseFromValuesOrFunc,
  type SRT_Row,
  type SRT_RowData,
  type SRT_TableInstance,
} from 'shadcn-react-table-core';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { SRT_EditActionButtons } from '../buttons/SRT_EditActionButtons';
import { SRT_EditCellTextField } from '../inputs/SRT_EditCellTextField';

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

  const internalEditComponents = row
    .getAllCells()
    .filter((cell) => cell.column.columnDef.columnDefType === 'data')
    .map((cell) => (
      <Field key={cell.id}>
        <FieldLabel className="w-full flex-col items-start">
          {cell.column.columnDef.header}
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <SRT_EditCellTextField cell={cell as any} table={table as any} />
        </FieldLabel>
      </Field>
    ));

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
    // Note: DivProps has no onClose/onOpenChange surface — close interception not exposed.
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) handleClose();
      }}
    >
      <DialogContent
        // fullWidth
        // maxWidth="xs"
        // Note: MUI sizing props dropped — shadcn default sizing wins.
        className="max-h-[calc(100%-4rem)]"
        showCloseButton={false}
        aria-describedby={undefined}
        {...dialogProps}
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
              {/* <DialogTitle sx={{ textAlign: 'center' }}> */}
              {/* Note: text-align = typography — shadcn DialogHeader default wins. */}
              <DialogTitle>{localization.edit}</DialogTitle>
            </DialogHeader>
            <div className="min-h-0 overflow-y-auto">
              <form onSubmit={(e) => e.preventDefault()}>
                {/* <Stack sx={{ gap: '32px', paddingTop: '16px', width: '100%' }}> */}
                {/* Note: MUI Stack → ui/FieldGroup; its gap-7/no-top-pad default wins. */}
                <FieldGroup>{internalEditComponents}</FieldGroup>
              </form>
            </div>
            {/* <DialogActions sx={{ p: '1.25rem' }}> */}
            {/* Note: padding override dropped — shadcn DialogFooter default wins. */}
            <DialogFooter>
              <SRT_EditActionButtons row={row} table={table} variant="text" />
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
