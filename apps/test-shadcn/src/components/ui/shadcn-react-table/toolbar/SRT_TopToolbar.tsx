// SRT_TopToolbar.tsx
import {
  type SRT_RowData,
  type SRT_TableInstance,
  parseFromValuesOrFunc, // Import from your core library
} from 'shadcn-react-table-core';
import { cn } from '@/lib/utils';
import { SRT_LinearProgressBar } from './SRT_LinearProgressBar';
import { SRT_ToolbarAlertBanner } from './SRT_ToolbarAlertBanner';
import { SRT_ToolbarDropZone } from './SRT_ToolbarDropZone';
import { SRT_ToolbarInternalButtons } from './SRT_ToolbarInternalButtons';
import { SRT_GlobalFilterTextField } from '../inputs/SRT_GlobalFilterTextField';
import { SRT_TablePagination } from './SRT_TablePagination'; // Import SRT_TablePagination
import React, { type HTMLAttributes } from 'react'; // Import React and HTMLAttributes

export interface SRT_TopToolbarProps<TData extends SRT_RowData> {
  table: SRT_TableInstance<TData>;
}

export const SRT_TopToolbar = <TData extends SRT_RowData>({
  table,
}: SRT_TopToolbarProps<TData>) => {
  const {
    getState,
    options: {
      enableGlobalFilter,
      enableToolbarInternalActions,
      positionGlobalFilter,
      positionToolbarAlertBanner,
      positionToolbarDropZone,
      renderTopToolbarCustomActions,
      srtTopToolbarProps,
      enablePagination,
      positionPagination,
    },
    refs: { topToolbarRef },
  } = table;

  const { isFullScreen, showGlobalFilter } = getState();

  // Explicitly type toolbarProps (include ref attribute)
  const toolbarProps:
    | Partial<HTMLAttributes<HTMLDivElement> & React.RefAttributes<HTMLDivElement>>
    | undefined = parseFromValuesOrFunc(srtTopToolbarProps, { table });

  const stackAlertBanner =
    !!renderTopToolbarCustomActions || showGlobalFilter;

  // Destructure className and ref from toolbarProps to use them separately
  // This allows us to handle `ref` specifically and pass other props normally
  const { ref: toolbarRefProp, className: toolbarClassName, ...restToolbarProps } =
    toolbarProps || {};

  return (
    <div
      {...restToolbarProps} // Spread the remaining props
      ref={(ref: HTMLDivElement) => {
        topToolbarRef.current = ref;
        // Safely handle the ref from toolbarProps
        if (toolbarRefProp) {
          if (typeof toolbarRefProp === 'function') {
            toolbarRefProp(ref);
          } else if (typeof toolbarRefProp === 'object' && toolbarRefProp !== null) {
            (toolbarRefProp as React.RefObject<HTMLDivElement | null>).current = ref;
          }
        }
      }}
      className={cn(
        'relative w-full',
        isFullScreen ? 'sticky top-0 z-40 bg-background' : undefined,
        toolbarClassName, // Apply the className from toolbarProps
      )}
    >
      {/* Alert Banner */}
      {positionToolbarAlertBanner === 'top' && (
        <SRT_ToolbarAlertBanner
          stackAlertBanner={stackAlertBanner}
          table={table}
        />
      )}

      {/* Drop Zone for Column Grouping */}
      {['both', 'top'].includes(positionToolbarDropZone ?? '') && (
        <SRT_ToolbarDropZone table={table} />
      )}

      <div
        className={cn(
          'box-border flex w-full items-start justify-between gap-2 p-2',
          stackAlertBanner ? 'relative' : 'absolute right-0 top-0',
        )}
      >
        {/* Global Filter - Left Position */}
        {enableGlobalFilter && positionGlobalFilter === 'left' && (
          <SRT_GlobalFilterTextField table={table} />
        )}

        {/* Custom Actions */}
        {renderTopToolbarCustomActions?.({ table }) ?? <span />}

        {/* Internal Buttons */}
        {enableToolbarInternalActions ? (
          <div className="flex flex-wrap-reverse items-center justify-end gap-2">
            {/* Global Filter - Right Position */}
            {enableGlobalFilter && positionGlobalFilter === 'right' && (
              <SRT_GlobalFilterTextField table={table} />
            )}
            <SRT_ToolbarInternalButtons table={table} />
          </div>
        ) : (
          enableGlobalFilter &&
          positionGlobalFilter === 'right' && (
            <SRT_GlobalFilterTextField table={table} />
          )
        )}
      </div>

      {/* Pagination (top/both) */}
      {enablePagination &&
        ['both', 'top'].includes(positionPagination ?? '') && (
          <SRT_TablePagination position="top" table={table} />
        )}

      {/* Linear Progress Bar */}
      <SRT_LinearProgressBar isTopToolbar table={table} />
    </div>
  );
};