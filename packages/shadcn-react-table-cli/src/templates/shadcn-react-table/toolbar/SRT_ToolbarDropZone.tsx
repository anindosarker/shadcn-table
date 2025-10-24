import { type DragEvent, useEffect } from 'react';
import type { SRT_RowData, SRT_TableInstance } from 'shadcn-react-table-core';
import { cn } from '@/lib/utils';

export interface SRT_ToolbarDropZoneProps<TData extends SRT_RowData> {
  table: SRT_TableInstance<TData>;
  className?: string;
}

/**
 * Toolbar drop zone - shows a drop target for column grouping
 *
 * Barebones implementation:
 * - Shows drop zone when dragging a groupable column
 * - Highlights on hover
 * - Basic fade in/out animation
 *
 * TODO (Future enhancements):
 * - Add srtToolbarDropZoneProps to core package types
 * - Improve animation with Framer Motion or Radix UI
 * - Add backdrop blur effect
 * - Better hover state management
 * - Support for custom drop zone content
 * - Add drag preview component
 */

export const SRT_ToolbarDropZone = <TData extends SRT_RowData>({
  table,
  className,
}: SRT_ToolbarDropZoneProps<TData>) => {
  const {
    getState,
    options: {
      enableGrouping,
      localization,
      // srtToolbarDropZoneProps, // TODO: Add custom props support
    },
    setHoveredColumn,
    setShowToolbarDropZone,
  } = table;

  const { draggingColumn, grouping, hoveredColumn, showToolbarDropZone } =
    getState();

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
      className={cn(
        'absolute inset-0 z-[4] flex items-center justify-center',
        'border-2 border-dashed border-blue-500',
        'bg-blue-50/10 backdrop-blur-sm',
        'transition-all duration-200',
        hoveredColumn?.id === 'drop-zone' ? 'bg-blue-50/20' : 'bg-blue-50/10',
        'animate-in fade-in-0 duration-200',
        className,
      )}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
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

// TODO: Add these features in future iterations:
// 1. Add srtToolbarDropZoneProps to core package types
// 2. Improve animation with Framer Motion
// 3. Add custom drop zone content via render prop
// 4. Add drag preview/ghost component
// 5. Better visual feedback for drop target
// 6. Support for nested group drop zones
// 7. Add drop sound effect (optional)
