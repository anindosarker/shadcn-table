import { type DragEvent, useEffect } from 'react';
import {
  parseSRT_HtmlProps,
  type SRT_RowData,
  type SRT_TableInstance,
} from 'shadcn-react-table-core';
import { cn } from '@/lib/utils';

export interface SRT_ToolbarDropZoneProps<TData extends SRT_RowData> {
  table: SRT_TableInstance<TData>;
  className?: string;
}

export const SRT_ToolbarDropZone = <TData extends SRT_RowData>({
  table,
  className,
}: SRT_ToolbarDropZoneProps<TData>) => {
  const {
    getState,
    options: { enableGrouping, localization, srtToolbarDropZoneProps },
    setHoveredColumn,
    setShowToolbarDropZone,
  } = table;

  const { draggingColumn, grouping, hoveredColumn, showToolbarDropZone } =
    getState();

  const dropZoneProps = parseSRT_HtmlProps(srtToolbarDropZoneProps, { table });

  const handleDragEnter = () => {
    setHoveredColumn({ id: 'drop-zone' });
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
  };

  const handleDragLeave = () => {
    setHoveredColumn(null);
  };

  useEffect(() => {
    if (table.options.state?.showToolbarDropZone !== undefined) {
      setShowToolbarDropZone(
        !!enableGrouping &&
          !!draggingColumn &&
          draggingColumn.columnDef.enableGrouping !== false &&
          !grouping.includes(draggingColumn.id),
      );
    }
  }, [
    enableGrouping,
    draggingColumn,
    grouping,
    setShowToolbarDropZone,
    table.options.state?.showToolbarDropZone,
  ]);

  if (!showToolbarDropZone) return null;

  return (
    <div
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      {...dropZoneProps}
      className={cn(
        'absolute inset-0 z-[4] flex items-center justify-center',
        'border-2 border-dashed border-blue-500',
        'bg-blue-50/10 backdrop-blur-sm',
        'transition-all duration-200',
        hoveredColumn?.id === 'drop-zone' ? 'bg-blue-50/20' : 'bg-blue-50/10',
        'animate-in fade-in-0 duration-200',
        className,
        dropZoneProps?.className,
      )}
    >
      <p className="text-sm italic text-blue-600 dark:text-blue-400">
        {localization.dropToGroupBy.replace(
          '{column}',
          draggingColumn?.columnDef?.header ?? '',
        )}
      </p>
    </div>
  );
};
