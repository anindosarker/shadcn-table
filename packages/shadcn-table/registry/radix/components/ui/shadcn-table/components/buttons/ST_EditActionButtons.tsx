import { Subscribe } from '@tanstack/react-table';
import { cva } from 'class-variance-authority';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';
import {
  type DivProps,
  type ST_Row,
  type ST_RowData,
  type ST_TableInstance,
} from '@/components/ui/shadcn-table/types';
import { ST_Tooltip } from '@/components/ui/shadcn-table/ST_Tooltip';

export interface ST_EditActionButtonsProps<TData extends ST_RowData>
  extends DivProps {
  row: ST_Row<TData>;
  /**
   * Transition, part 01 phase 03: ignored, the table comes from the row. Goes
   * in the integration step, once no caller passes it.
   */
  table?: unknown;
  variant?: 'icon' | 'text';
}

const editActionButtonsVariants = cva('flex gap-3');

export const ST_EditActionButtons = <TData extends ST_RowData>({
  row,
  variant = 'icon',
  ...rest
}: ST_EditActionButtonsProps<TData>) => {
  // The row carries the core table, which holds the ST options, atoms, refs
  // and setters; the ST wrapper types do not re-type it.
  const table = row.table as unknown as ST_TableInstance<TData>;
  const {
    options: {
      icons: { CancelIcon, SaveIcon },
      localization,
      onCreatingRowCancel,
      onCreatingRowSave,
      onEditingRowCancel,
      onEditingRowSave,
    },
    refs: { editInputRefs },
    setCreatingRow,
    setEditingRow,
  } = table;

  const handleCancel = () => {
    const { creatingRow, editingRow } = table.store.state;
    if (creatingRow?.id === row.id) {
      onCreatingRowCancel?.({ row, table });
      setCreatingRow(null);
    } else if (editingRow?.id === row.id) {
      onEditingRowCancel?.({ row, table });
      setEditingRow(null);
    }
    row._valuesCache = {} as ST_Row<TData>['_valuesCache']; //reset values cache
  };

  const handleSubmitRow = () => {
    const { creatingRow, editingRow } = table.store.state;
    //look for auto-filled input values
    Object.values(editInputRefs.current ?? {})
      .filter((inputRef) => row.id === inputRef?.name?.split('_')?.[0])
      ?.forEach((input) => {
        if (
          input.value !== undefined &&
          Object.hasOwn(row?._valuesCache as object, input.name)
        ) {
          (row._valuesCache as Record<string, unknown>)[input.name] =
            input.value;
        }
      });
    if (creatingRow?.id === row.id)
      onCreatingRowSave?.({
        exitCreatingMode: () => setCreatingRow(null),
        row,
        table,
        values: row._valuesCache,
      });
    else if (editingRow?.id === row.id) {
      onEditingRowSave?.({
        exitEditingMode: () => setEditingRow(null),
        row,
        table,
        values: row?._valuesCache,
      });
    }
  };

  return (
    <Subscribe
      selector={(state) => ({
        creatingRow: state.creatingRow,
        editingRow: state.editingRow,
        isSaving: state.isSaving,
      })}
      source={table.store}
    >
      {({ creatingRow, editingRow, isSaving }) => {
        const isCreating = creatingRow?.id === row.id;
        const isEditing = editingRow?.id === row.id;

        return (
          <div
            className={cn(
              editActionButtonsVariants({ className: rest.className }),
            )}
            onClick={(e) => e.stopPropagation()}
          >
            {variant === 'icon' ? (
              <>
                <ST_Tooltip title={localization.cancel}>
                  <Button
                    aria-label={localization.cancel}
                    onClick={handleCancel}
                    size="icon"
                    type="button"
                    variant="ghost"
                  >
                    <CancelIcon />
                  </Button>
                </ST_Tooltip>
                {((isCreating && onCreatingRowSave) ||
                  (isEditing && onEditingRowSave)) && (
                  <ST_Tooltip title={localization.save}>
                    <Button
                      aria-label={localization.save}
                      // color="info" // Note: no info color token on shadcn Button.
                      disabled={isSaving}
                      onClick={handleSubmitRow}
                      size="icon"
                      type="button"
                      variant="ghost"
                    >
                      {isSaving ? <Spinner /> : <SaveIcon />}
                    </Button>
                  </ST_Tooltip>
                )}
              </>
            ) : (
              <>
                <Button
                  onClick={handleCancel}
                  // sx={{ minWidth: '100px' }} // Note: sizing override dropped per ruling.
                  type="button"
                  variant="ghost"
                >
                  {localization.cancel}
                </Button>
                <Button
                  disabled={isSaving}
                  onClick={handleSubmitRow}
                  type="button"
                >
                  {isSaving && <Spinner />}
                  {localization.save}
                </Button>
              </>
            )}
          </div>
        );
      }}
    </Subscribe>
  );
};
