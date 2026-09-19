import {
  type DivProps,
  type SRT_Row,
  type SRT_RowData,
  type SRT_TableInstance,
} from 'shadcn-react-table-core';
import { cva } from 'class-variance-authority';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';
import { SRT_Tooltip } from '../SRT_Tooltip';

export interface SRT_EditActionButtonsProps<TData extends SRT_RowData>
  extends DivProps {
  row: SRT_Row<TData>;
  table: SRT_TableInstance<TData>;
  variant?: 'icon' | 'text';
}

const editActionButtonsVariants = cva('flex gap-3');

export const SRT_EditActionButtons = <TData extends SRT_RowData>({
  row,
  table,
  variant = 'icon',
  ...rest
}: SRT_EditActionButtonsProps<TData>) => {
  const {
    getState,
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
  const { creatingRow, editingRow, isSaving } = getState();

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
      {...rest}
      className={cn(editActionButtonsVariants({ className: rest.className }))}
      onClick={(e) => e.stopPropagation()}
    >
      {variant === 'icon' ? (
        <>
          <SRT_Tooltip title={localization.cancel}>
            <Button
              aria-label={localization.cancel}
              onClick={handleCancel}
              size="icon"
              type="button"
              variant="ghost"
            >
              <CancelIcon />
            </Button>
          </SRT_Tooltip>
          {((isCreating && onCreatingRowSave) ||
            (isEditing && onEditingRowSave)) && (
            <SRT_Tooltip title={localization.save}>
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
            </SRT_Tooltip>
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
