import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import {
  type DivProps,
  type ST_RowData,
} from '@/components/ui-aria/shadcn-table/types';
import { parseFromValuesOrFunc } from '@/components/ui-aria/shadcn-table/shared/utils/utils';
import { ST_LinearProgressBar } from '@/components/ui-aria/shadcn-table/components/toolbar/ST_LinearProgressBar';
import { ST_TablePagination } from '@/components/ui-aria/shadcn-table/components/toolbar/ST_TablePagination';
import { ST_ToolbarAlertBanner } from '@/components/ui-aria/shadcn-table/components/toolbar/ST_ToolbarAlertBanner';
import { ST_ToolbarDropZone } from '@/components/ui-aria/shadcn-table/components/toolbar/ST_ToolbarDropZone';
import { useST_MediaQuery } from '@/components/ui-aria/shadcn-table/hooks/useST_MediaQuery';
import { useSTContext } from '@/components/ui-aria/shadcn-table/hooks/stTableHook';
import { useST_ComposedRef } from '@/components/ui-aria/shadcn-table/hooks/useST_ComposedRef';

export type ST_BottomToolbarProps = DivProps;

// The frame holds the toolbar in full screen too; its top edge is the same
// hairline as the lines between rows.
const bottomToolbarVariants = cva(
  'relative z-1 grid min-h-12 items-start overflow-hidden border-t bg-background flex-wrap-reverse transition-all duration-150 ease-in-out',
);

export const ST_BottomToolbar = <TData extends ST_RowData>({
  ...rest
}: ST_BottomToolbarProps) => {
  const table = useSTContext<TData>();
  const {
    options: {
      enablePagination,
      stBottomToolbarProps,
      positionPagination,
      positionToolbarAlertBanner,
      positionToolbarDropZone,
      renderBottomToolbarCustomActions,
    },
    refs: { bottomToolbarRef },
  } = table;

  const isMobile = useST_MediaQuery('(max-width:720px)');

  const toolbarProps = {
    ...parseFromValuesOrFunc(stBottomToolbarProps, { table }),
    ...rest,
  };

  const attachRef = useST_ComposedRef(bottomToolbarRef, toolbarProps.ref);

  const stackAlertBanner = isMobile || !!renderBottomToolbarCustomActions;

  const toolbarContent = (
    <>
      <ST_LinearProgressBar isTopToolbar={false} />
      {positionToolbarAlertBanner === 'bottom' && (
        <ST_ToolbarAlertBanner stackAlertBanner={stackAlertBanner} />
      )}
      {['both', 'bottom'].includes(positionToolbarDropZone ?? '') && (
        <ST_ToolbarDropZone />
      )}
      <div className="flex w-full box-border items-center justify-between p-2">
        {renderBottomToolbarCustomActions ? (
          // The actions read the table, most often the selected rows, so they
          // re-render on the state they commonly read; the toolbar does not.
          <table.Subscribe
            selector={(state) => ({
              columnFilters: state.columnFilters,
              globalFilter: state.globalFilter,
              rowSelection: state.rowSelection,
              sorting: state.sorting,
            })}
          >
            {() => renderBottomToolbarCustomActions({ table })}
          </table.Subscribe>
        ) : (
          <span />
        )}
        <div
          className={cn(
            'flex justify-end inset-e-0 top-0',
            stackAlertBanner ? 'relative' : 'absolute',
          )}
        >
          {enablePagination &&
            ['both', 'bottom'].includes(positionPagination ?? '') && (
              <ST_TablePagination position="bottom" />
            )}
        </div>
      </div>
    </>
  );

  return (
    <div
      {...toolbarProps}
      ref={attachRef}
      className={cn(
        bottomToolbarVariants({ className: toolbarProps.className }),
      )}
    >
      {toolbarContent}
    </div>
  );
};
