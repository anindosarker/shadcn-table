import { Subscribe } from '@tanstack/react-table';
import { useSelector } from '@tanstack/react-store';
import { cva } from 'class-variance-authority';
import { type DragEvent, useEffect } from 'react';
import {
  type DivProps,
  type ST_RowData,
} from '@/components/ui-base/shadcn-table/types';
import { useSTContext } from '@/components/ui-base/shadcn-table/hooks/stTableHook';

export type ST_ToolbarDropZoneProps = DivProps;

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

export const ST_ToolbarDropZone = <TData extends ST_RowData>({
  ...rest
}: ST_ToolbarDropZoneProps) => {
  const table = useSTContext<TData>();
  const {
    options: { enableGrouping, localization },
    setHoveredColumn,
    setShowToolbarDropZone,
  } = table;

  // These feed the drop zone effect, so they are hook subscriptions.
  const draggingColumn = useSelector(table.atoms.draggingColumn);
  const grouping = useSelector(table.atoms.grouping);

  const handleDragEnter = () => {
    setHoveredColumn({ id: 'drop-zone' });
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
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
    <Subscribe
      selector={(state) => ({
        hoveredColumn: state.hoveredColumn,
        showToolbarDropZone: state.showToolbarDropZone,
      })}
      source={table.store}
    >
      {({ hoveredColumn, showToolbarDropZone }) =>
        showToolbarDropZone ? (
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
        ) : null
      }
    </Subscribe>
  );
};
