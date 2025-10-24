import { GripVerticalIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { SRT_RowData, SRT_TableInstance } from 'shadcn-react-table-core';
import type { DragEvent } from 'react';

export interface SRT_GrabHandleButtonProps<TData extends SRT_RowData> {
  location?: 'row' | 'column';
  onDragEnd?: (event: DragEvent<HTMLButtonElement>) => void;
  onDragStart?: (event: DragEvent<HTMLButtonElement>) => void;
  table: SRT_TableInstance<TData>;
  className?: string;
}

/**
 * Grab handle button for drag and drop functionality
 *
 * Barebones implementation:
 * - Draggable grip icon button
 * - Supports row and column drag/drop
 * - Basic drag event handling
 *
 * TODO (Future enhancements):
 * - Add drag ghost image customization
 * - Add drag preview
 * - Add drop indicators
 * - Add touch support for mobile
 * - Add keyboard accessibility
 * - Add custom icon support
 */

export const SRT_GrabHandleButton = <TData extends SRT_RowData>({
  location = 'row',
  onDragEnd,
  onDragStart,
  table,
  className,
}: SRT_GrabHandleButtonProps<TData>) => {
  const {
    options: { localization },
  } = table;

  return (
    <Button
      variant="ghost"
      size="icon"
      draggable
      onDragEnd={onDragEnd}
      onDragStart={onDragStart}
      title={location === 'row' ? localization.move : localization.move}
      className={cn(
        'h-8 w-8 cursor-grab active:cursor-grabbing',
        'hover:bg-accent hover:text-accent-foreground',
        className,
      )}
    >
      <GripVerticalIcon className="h-4 w-4" />
    </Button>
  );
};
