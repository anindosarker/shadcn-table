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
  type ST_Row,
  type ST_RowData,
  type ST_TableInstance,
} from '@/components/ui/shadcn-table/types';
import { parseFromValuesOrFunc } from '@/components/ui/shadcn-table/utils/utils';
import { ST_EditActionButtons } from '@/components/ui/shadcn-table/buttons/ST_EditActionButtons';
import { ST_EditCellTextField } from '@/components/ui/shadcn-table/inputs/ST_EditCellTextField';

const editRowModalVariants = cva('max-h-[calc(100%-4rem)]');

export interface ST_EditRowModalProps<TData extends ST_RowData>
  extends Partial<DialogProps> {
  open: boolean;
  table: ST_TableInstance<TData>;
}

export const ST_EditRowModal = <TData extends ST_RowData>({
  open,
  table,
  ...rest
}: ST_EditRowModalProps<TData>) => {
  const {
    options: {
      localization,
      stCreateRowModalProps,
      stEditRowDialogProps,
      onCreatingRowCancel,
      onEditingRowCancel,
      renderCreateRowDialogContent,
      renderEditRowDialogContent,
    },
    setCreatingRow,
    setEditingRow,
  } = table;
  const { creatingRow, editingRow } = table.state;
  const row = (creatingRow ?? editingRow) as ST_Row<TData>;

  const dialogProps = {
    ...parseFromValuesOrFunc(stEditRowDialogProps, { row, table }),
    ...(creatingRow &&
      parseFromValuesOrFunc(stCreateRowModalProps, { row, table })),
    ...rest,
  };
  const { onOpenChange, ...contentProps } = dialogProps;

  const internalEditComponents = row
    .getAllCells()
    .filter((cell) => cell.column.columnDef.columnDefType === 'data')
    .map((cell) => (
      <ST_EditCellTextField
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        cell={cell as any}
        key={cell.id}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        table={table as any}
      />
    ));

  return (
    <Dialog
      // Base UI passes (open, eventDetails); both are forwarded.
      onOpenChange={(nextOpen, details) => {
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
        onOpenChange?.(nextOpen, details);
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
              <ST_EditActionButtons row={row} table={table} variant="text" />
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
