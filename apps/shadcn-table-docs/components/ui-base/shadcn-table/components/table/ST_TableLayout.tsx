import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { type DivProps } from '@/components/ui-base/shadcn-table/types';
import { parseFromValuesOrFunc } from '@/components/ui-base/shadcn-table/shared/utils/utils';
import { ST_BottomToolbar } from '@/components/ui-base/shadcn-table/components/toolbar/ST_BottomToolbar';
import { ST_TopToolbar } from '@/components/ui-base/shadcn-table/components/toolbar/ST_TopToolbar';
import { ST_TableContainer } from '@/components/ui-base/shadcn-table/components/table/ST_TableContainer';
import { useSTContext } from '@/components/ui-base/shadcn-table/hooks/stTableHook';
import { useST_ComposedRef } from '@/components/ui-base/shadcn-table/hooks/useST_ComposedRef';
import { useST_FullScreenContainer } from '@/components/ui-base/shadcn-table/hooks/useST_FullScreenContainer';

export type ST_TableLayoutProps = DivProps;

const tableLayoutClassName =
  'relative overflow-hidden rounded-md border bg-background shadow transition-all duration-100 p-2';

const ST_TableLayoutContainer = ({
  children,
  layoutDivProps,
}: {
  children: ReactNode;
  layoutDivProps: ST_TableLayoutProps;
}) => {
  const table = useSTContext();
  const { containerProps } = useST_FullScreenContainer(table);
  const attachRef = useST_ComposedRef(
    table.refs.tableLayoutRef,
    layoutDivProps.ref,
  );

  return (
    <div
      onKeyDown={containerProps.onKeyDown}
      tabIndex={containerProps.tabIndex}
      {...layoutDivProps}
      ref={attachRef}
      className={cn(
        tableLayoutClassName,
        containerProps.className,
        layoutDivProps.className,
      )}
    >
      {children}
    </div>
  );
};

export const ST_TableLayout = ({ ...rest }: ST_TableLayoutProps) => {
  const table = useSTContext();
  const {
    options: {
      enableBottomToolbar,
      enableTopToolbar,
      stTableLayoutProps,
      renderBottomToolbar,
      renderTopToolbar,
    },
  } = table;

  const layoutDivProps = {
    ...parseFromValuesOrFunc(stTableLayoutProps, { table }),
    ...rest,
  };

  // Created outside the full-screen container, so toggling full screen
  // re-renders only that element.
  const topToolbar =
    enableTopToolbar &&
    (parseFromValuesOrFunc(renderTopToolbar, { table }) ?? <ST_TopToolbar />);
  const tableContainer = <ST_TableContainer />;
  const bottomToolbar =
    enableBottomToolbar &&
    (parseFromValuesOrFunc(renderBottomToolbar, { table }) ?? (
      <ST_BottomToolbar />
    ));

  return (
    <ST_TableLayoutContainer layoutDivProps={layoutDivProps}>
      {topToolbar}
      {tableContainer}
      {bottomToolbar}
    </ST_TableLayoutContainer>
  );
};
