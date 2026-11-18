import { useSelector } from '@tanstack/react-store';
import { cva } from 'class-variance-authority';
import { type DragEvent, useEffect } from 'react';
import {
  type DivProps,
  type ST_RowData,
} from '@/components/ui-aria/shadcn-table/types';
import { isST_TouchDragEvent } from '@/components/ui-aria/shadcn-table/shared/utils/drag.utils';
import { useSTContext } from '@/components/ui-aria/shadcn-table/context/ST_TableContext';

export type ST_ToolbarDropZoneProps = DivProps;

const toolbarDropZoneVariants = cva(
  'absolute z-4 box-border flex h-full w-full items-center justify-center border-2 border-dashed border-primary backdrop-blur-sm',
  {
    variants: {
      hovered: {
        true: 'bg-primary/20',
        false: 'bg-primary/10',
      },
    },
  },
);

export const ST_ToolbarDropZone = <TData extends ST_RowData>({
  ...rest
}: ST_ToolbarDropZoneProps) => {
  const table = useSTContext<TData>();
  const {
    options: { enableGrouping, localization },
    setHoveredColumn,
    setShowToolbarDropZone,
  } = table;

  const draggingColumn = useSelector(table.atoms.draggingColumn);
  const grouping = useSelector(table.atoms.grouping);

  const handleDragEnter = () => {
    setHoveredColumn({ id: 'drop-zone' });
  };

  // A touch drag that leaves the zone or is cancelled over it clears the
  // zone's hover.
  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    if (!isST_TouchDragEvent(e.nativeEvent)) return;
    if (e.currentTarget.contains(e.relatedTarget as Node | null)) return;
    if (table.atoms.hoveredColumn.get()?.id === 'drop-zone') {
      setHoveredColumn(null);
    }
  };

  // The drop is accepted and, for a touch drag, the zone takes the hover back
  // from the column auto-scroll.
  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    if (
      isST_TouchDragEvent(e.nativeEvent) &&
      table.atoms.hoveredColumn.get()?.id !== 'drop-zone'
    ) {
      setHoveredColumn({ id: 'drop-zone' });
    }
    if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
  };

  useEffect(() => {
    setShowToolbarDropZone(
      !!enableGrouping &&
        !!draggingColumn &&
        draggingColumn.columnDef.enableGrouping !== false &&
        !grouping.includes(draggingColumn.id),
    );
  }, [enableGrouping, draggingColumn, grouping, setShowToolbarDropZone]);

  return (
    <table.Subscribe
      selector={(state) => ({
        hoveredColumn: state.hoveredColumn,
        showToolbarDropZone: state.showToolbarDropZone,
      })}
    >
      {({ hoveredColumn, showToolbarDropZone }) =>
        showToolbarDropZone ? (
          <div
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
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
        ) : null
      }
    </table.Subscribe>
  );
};
