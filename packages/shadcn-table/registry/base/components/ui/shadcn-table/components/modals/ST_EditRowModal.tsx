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
  type ST_TableOptions,
} from '@/components/ui/shadcn-table/types';
import { parseFromValuesOrFunc } from '@/components/ui/shadcn-table/shared/utils/utils';
import { ST_EditActionButtons } from '@/components/ui/shadcn-table/components/buttons/ST_EditActionButtons';
import { ST_EditCellTextField } from '@/components/ui/shadcn-table/components/inputs/ST_EditCellTextField';
import { useSTContext } from '@/components/ui/shadcn-table/hooks/stTableHook';

const editRowModalVariants = cva('max-h-[calc(100%-4rem)]');

export interface ST_EditRowModalProps extends Partial<DialogProps> {
  open: boolean;
}

export const ST_EditRowModal = <TData extends ST_RowData = ST_RowData>({
  open,
  ...rest
}: ST_EditRowModalProps) => {
  const table = useSTContext<TData>();
  const {
    options: {
      localization,
      onCreatingRowCancel,
      onEditingRowCancel,
      renderCreateRowDialogContent,
      renderEditRowDialogContent,
    },
    setCreatingRow,
    setEditingRow,
  } = table;
  // table.options holds the part props tree-neutral (ST_NeutralPartPropTypes);
  // the options as written (ST_TableOptions) type them for this tree's Dialog.
  const {
    stCreateRowModalProps,
    stEditRowDialogProps,
  }: Pick<
    ST_TableOptions<TData>,
    'stCreateRowModalProps' | 'stEditRowDialogProps'
  > = table.options;

  return (
    <table.Subscribe
      selector={(state) => ({
        creatingRow: state.creatingRow,
        editingRow: state.editingRow,
      })}
    >
      {({ creatingRow, editingRow }) => {
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
          .map((cell) => <ST_EditCellTextField cell={cell} key={cell.id} />);

        return (
          <Dialog
            // Base UI passes (open, eventDetails); both are forwarded.
            onOpenChange={(nextOpen, details) => {
              if (nextOpen) return;
              const liveCreatingRow = table.atoms.creatingRow.get();
              const liveRow = (liveCreatingRow ??
                table.atoms.editingRow.get()) as ST_Row<TData>;
              if (liveCreatingRow) {
                onCreatingRowCancel?.({ row: liveRow, table });
                setCreatingRow(null);
              } else {
                onEditingRowCancel?.({ row: liveRow, table });
                setEditingRow(null);
              }
              liveRow._valuesCache = {} as ST_Row<TData>['_valuesCache']; //reset values cache
              onOpenChange?.(nextOpen, details);
            }}
            open={open}
          >
            <DialogContent
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
                    <DialogTitle>{localization.edit}</DialogTitle>
                  </DialogHeader>
                  <div className="min-h-0 overflow-y-auto">
                    <form onSubmit={(e) => e.preventDefault()}>
                      <FieldGroup>{internalEditComponents}</FieldGroup>
                    </form>
                  </div>
                  <DialogFooter>
                    <ST_EditActionButtons row={row} variant="text" />
                  </DialogFooter>
                </>
              )}
            </DialogContent>
          </Dialog>
        );
      }}
    </table.Subscribe>
  );
};
