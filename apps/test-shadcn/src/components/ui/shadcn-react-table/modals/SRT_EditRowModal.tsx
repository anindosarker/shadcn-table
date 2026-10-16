import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { FieldGroup } from '@/components/ui/field';
import {
  type DialogProps,
  type SRT_Row,
  type SRT_RowData,
  type SRT_TableInstance,
} from '../types';
import { parseFromValuesOrFunc } from '../utils/utils';
import { SRT_EditActionButtons } from '../buttons/SRT_EditActionButtons';
import { SRT_EditCellTextField } from '../inputs/SRT_EditCellTextField';

const editRowModalVariants = cva('max-h-[calc(100%-4rem)]');

export interface SRT_EditRowModalProps<TData extends SRT_RowData>
  extends Partial<DialogProps> {
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
  const { onOpenChange, ...contentProps } = dialogProps;

  const internalEditComponents = row
    .getAllCells()
    .filter((cell) => cell.column.columnDef.columnDefType === 'data')
    .map((cell) => (
      <SRT_EditCellTextField
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        cell={cell as any}
        key={cell.id}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        table={table as any}
      />
    ));

  return (
    <Dialog
      onOpenChange={(nextOpen) => {
        if (nextOpen) return;
        if (creatingRow) {
          onCreatingRowCancel?.({ row, table });
          setCreatingRow(null);
        } else {
          onEditingRowCancel?.({ row, table });
          setEditingRow(null);
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        row._valuesCache = {} as any; //reset values cache
        onOpenChange?.(nextOpen);
      }}
      open={open}
    >
      <DialogContent
        // fullWidth
        // maxWidth="xs"
        // Note: MUI sizing props dropped — shadcn default sizing wins.
        showCloseButton={false}
        aria-describedby={undefined}
        {...contentProps}
        className={cn(
          editRowModalVariants({ className: contentProps.className }),
        )}
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
