import { LoaderCircleIcon } from 'lucide-react';
import {
  type SRT_Row,
  type SRT_RowData,
  type SRT_TableInstance,
} from 'shadcn-react-table-core';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { SRT_Tooltip } from '../SRT_Tooltip';

export interface SRT_EditActionButtonsProps<TData extends SRT_RowData> {
  row: SRT_Row<TData>;
  table: SRT_TableInstance<TData>;
  variant?: 'icon' | 'text';
  className?: string;
}

/**
 * Edit action buttons - save/cancel buttons for editing mode
 *
 * Barebones implementation:
 * - Cancel button (X icon or text)
 * - Save button (check icon or text)
 * - Loading spinner when saving
 * - Supports both icon and text variants
 *
 * TODO (Future enhancements):
 * - Add tooltip
 * - Add keyboard shortcuts (Escape/Enter)
 * - Add confirmation dialog for cancel
 * - Add validation state
 * - Add custom button props support
 */

export const SRT_EditActionButtons = <TData extends SRT_RowData>({
  row,
  table,
  variant = 'icon',
  className,
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
    row._valuesCache = {} as any; // reset values cache
  };

  const handleSubmitRow = () => {
    // Look for auto-filled input values
    Object.values(editInputRefs.current ?? {})
      .filter((inputRef) => row.id === inputRef?.name?.split('_')?.[0])
      ?.forEach((input) => {
        if (
          input.value !== undefined &&
          Object.hasOwn(row?._valuesCache as object, input.name)
        ) {
          // @ts-expect-error - dynamic property access
          row._valuesCache[input.name] = input.value;
        }
      });

    if (isCreating) {
      onCreatingRowSave?.({
        exitCreatingMode: () => setCreatingRow(null),
        row,
        table,
        values: row._valuesCache,
      });
    } else if (isEditing) {
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
      onClick={(e) => e.stopPropagation()}
      className={cn('flex gap-3', className)}
    >
      {variant === 'icon' ? (
        <>
          <SRT_Tooltip title={localization.cancel}>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCancel}
              aria-label={localization.cancel}
              className="h-9 w-9"
            >
              <CancelIcon className="h-4 w-4" />
            </Button>
          </SRT_Tooltip>
          {((isCreating && onCreatingRowSave) ||
            (isEditing && onEditingRowSave)) && (
            <SRT_Tooltip title={localization.save}>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSubmitRow}
                disabled={isSaving}
                aria-label={localization.save}
                className="h-9 w-9 text-blue-500 hover:text-blue-600"
              >
                {isSaving ? (
                  <LoaderCircleIcon className="h-4 w-4 animate-spin" />
                ) : (
                  <SaveIcon className="h-4 w-4" />
                )}
              </Button>
            </SRT_Tooltip>
          )}
        </>
      ) : (
        <>
          <Button
            variant="outline"
            onClick={handleCancel}
            className="min-w-[100px]"
          >
            {localization.cancel}
          </Button>
          <Button
            variant="default"
            onClick={handleSubmitRow}
            disabled={isSaving}
            className="min-w-[100px]"
          >
            {isSaving && (
              <LoaderCircleIcon className="mr-2 h-4 w-4 animate-spin" />
            )}
            {localization.save}
          </Button>
        </>
      )}
    </div>
  );
};
