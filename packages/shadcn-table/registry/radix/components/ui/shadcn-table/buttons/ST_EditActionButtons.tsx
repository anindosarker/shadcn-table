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
  table: ST_TableInstance<TData>;
  variant?: 'icon' | 'text';
}

const editActionButtonsVariants = cva('flex gap-3');

export const ST_EditActionButtons = <TData extends ST_RowData>({
  row,
  table,
  variant = 'icon',
  ...rest
}: ST_EditActionButtonsProps<TData>) => {
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
  const { creatingRow, editingRow, isSaving } = table.state;

  const isCreating = creatingRow?.id === row.id;
  const isEditing = editingRow?.id === row.id;

  const handleCancel = () => {
    if (isCreating) {
      onCreatingRowCancel?.({ row, table });
      setCreatingRow(null);
    } else if (isEditing) {
      onEditingRowCancel?.({ row, table });
      setEditingRow(null);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    row._valuesCache = {} as any; //reset values cache
  };

  const handleSubmitRow = () => {
    //look for auto-filled input values
    Object.values(editInputRefs.current ?? {})
      .filter((inputRef) => row.id === inputRef?.name?.split('_')?.[0])
      ?.forEach((input) => {
        if (
          input.value !== undefined &&
          Object.hasOwn(row?._valuesCache as object, input.name)
        ) {
          // @ts-expect-error dynamic string index into _valuesCache
          row._valuesCache[input.name] = input.value;
        }
      });
    if (isCreating)
      onCreatingRowSave?.({
        exitCreatingMode: () => setCreatingRow(null),
        row,
        table,
        values: row._valuesCache,
      });
    else if (isEditing) {
      onEditingRowSave?.({
        exitEditingMode: () => setEditingRow(null),
        row,
        table,
        values: row?._valuesCache,
      });
    }
  };

  return (
    <div
      className={cn(editActionButtonsVariants({ className: rest.className }))}
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
          <Button disabled={isSaving} onClick={handleSubmitRow} type="button">
            {isSaving && <Spinner />}
            {localization.save}
          </Button>
        </>
      )}
    </div>
  );
};
