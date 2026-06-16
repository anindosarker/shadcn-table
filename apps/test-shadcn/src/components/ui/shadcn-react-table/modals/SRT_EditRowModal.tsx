import {
  mergeSRT_HtmlProps,
  parseSRT_HtmlProps,
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
import { cn } from '@/lib/utils';
import { SRT_EditActionButtons } from '../buttons/SRT_EditActionButtons';
import { SRT_EditCellTextField } from '../inputs/SRT_EditCellTextField';

export interface SRT_EditRowModalProps<TData extends SRT_RowData> {
  className?: string;
  open: boolean;
  table: SRT_TableInstance<TData>;
}

export const SRT_EditRowModal = <TData extends SRT_RowData>({
  className,
  open,
  table,
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

  const dialogProps = mergeSRT_HtmlProps(
    parseSRT_HtmlProps(srtEditRowDialogProps, { row, table }),
    creatingRow
      ? parseSRT_HtmlProps(srtCreateRowModalProps, { row, table })
      : undefined,
  );

  const handleClose = () => {
    if (creatingRow) {
      onCreatingRowCancel?.({ row, table });
      setCreatingRow(null);
    } else {
      onEditingRowCancel?.({ row, table });
      setEditingRow(null);
    }
    row._valuesCache = {} as any; //reset values cache
  };

  const internalEditComponents = row
    ? row
        .getAllCells()
        .filter((cell) => cell.column.columnDef.columnDefType === 'data')
        .map((cell) => (
          <SRT_EditCellTextField cell={cell} key={cell.id} table={table} />
        ))
    : [];

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) handleClose();
      }}
    >
      <DialogContent
        {...dialogProps}
        className={cn('sm:max-w-xs', dialogProps?.className, className)}
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
              <div className="flex w-full flex-col gap-8 pt-4">
                {internalEditComponents}
              </div>
            </form>
            <DialogFooter className="p-5">
              <SRT_EditActionButtons row={row} table={table} variant="text" />
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
