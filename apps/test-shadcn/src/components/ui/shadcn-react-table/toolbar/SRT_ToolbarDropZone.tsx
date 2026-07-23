import { type DragEvent, useEffect } from 'react';
import {
  type DivProps,
  type SRT_RowData,
  type SRT_TableInstance,
} from 'shadcn-react-table-core';
import { cva } from 'class-variance-authority';

export interface SRT_ToolbarDropZoneProps<TData extends SRT_RowData>
  extends DivProps {
  table: SRT_TableInstance<TData>;
}

// Note: base maps MRT's sx (position: absolute, zIndex: 4, display: flex,
// h/w 100%, box-border, items/justify center, backdrop blur(4px), 2px dashed
// border + border color info.main → primary token). The `hovered` variant
// maps alpha(info.main, 0.2/0.1) on hoveredColumn?.id === 'drop-zone'.
const toolbarDropZoneVariants = cva(
  'absolute z-[4] box-border flex h-full w-full items-center justify-center border-2 border-dashed border-primary backdrop-blur-sm',
  {
    variants: {
      hovered: {
        true: 'bg-primary/20',
        false: 'bg-primary/10',
      },
    },
  },
);

export const SRT_ToolbarDropZone = <TData extends SRT_RowData>({
  table,
  ...rest
}: SRT_ToolbarDropZoneProps<TData>) => {
  const {
    getState,
    options: { enableGrouping, localization },
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

  useEffect(() => {
    if (table.options.state?.showToolbarDropZone !== undefined) {
      setShowToolbarDropZone(
        !!enableGrouping &&
          !!draggingColumn &&
          draggingColumn.columnDef.enableGrouping !== false &&
          !grouping.includes(draggingColumn.id),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enableGrouping, draggingColumn, grouping]);

  // Note: MRT wraps the zone in MUI <Fade in={showToolbarDropZone}>; SRT
  // conditionally renders (unmount) instead — the zone only needs to exist
  // for drag events while shown (Grow/Collapse precedent).
  if (!showToolbarDropZone) return null;

  return (
    <div
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      {...rest}
      className={toolbarDropZoneVariants({
        hovered: hoveredColumn?.id === 'drop-zone',
        className: rest.className,
      })}
    >
      <p className="italic">
        {localization.dropToGroupBy.replace(
          '{column}',
          draggingColumn?.columnDef?.header ?? '',
        )}
      </p>
    </div>
  );
};
