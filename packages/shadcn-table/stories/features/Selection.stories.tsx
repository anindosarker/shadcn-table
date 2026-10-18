import { useCallback, useEffect, useState } from 'react';
import { Minus, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  type ST_ColumnDef,
  ST_SelectCheckbox,
  getST_RowSelectionHandler,
  useShadcnTable,
} from '@/components/ui/shadcn-table';
import { ShadcnTable } from '@/components/ui/shadcn-table/ShadcnTable';
import { faker } from '@faker-js/faker';
import { type Meta } from '@storybook/react-vite';

const meta: Meta = {
  title: 'Features/Selection Examples',
};

export default meta;

const columns: ST_ColumnDef<(typeof data)[0]>[] = [
  {
    accessorKey: 'firstName',
    header: 'First Name',
  },
  {
    accessorKey: 'lastName',
    header: 'Last Name',
  },
  {
    accessorKey: 'age',
    header: 'Age',
  },
  {
    accessorKey: 'address',
    header: 'Address',
  },
];

const data = [...Array(15)].map(() => ({
  address: faker.location.streetAddress(),
  age: faker.number.int(80),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
}));

export const SelectionEnabled = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableRowNumbers
    enableRowSelection
  />
);

export const DisableSelectAll = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableSelectAll={false}
    enableRowSelection
  />
);

export const SelectionEnabledGrid = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableRowNumbers
    enableRowSelection
    layoutMode="grid"
  />
);

export const SelectionEnabledGridNoGrow = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableRowNumbers
    enableRowSelection
    layoutMode="grid-no-grow"
  />
);

export const BatchSelectionDisabled = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableBatchRowSelection={false}
    enableRowNumbers
    enableRowSelection
  />
);

export const SelectionEnabledConditionally = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableRowSelection={(row) => row.original.age >= 21}
  />
);

export const SelectionEnabledConditionallyWithInitial = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableRowSelection={(row) => row.original.age >= 21}
    initialState={{
      rowSelection: {
        1: true,
        2: true,
        3: true,
        4: true,
        5: true,
        6: true,
      },
    }}
  />
);

export const SelectionEnabledWithRowClick = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableRowSelection
    stTableBodyRowProps={({ row, staticRowIndex, table }) => ({
      onClick: (event) =>
        getST_RowSelectionHandler({ row, staticRowIndex, table })(event),
      style: {
        cursor: 'pointer',
        userSelect: 'none',
      },
    })}
  />
);

export const ManualSelection = () => {
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});

  console.info(rowSelection);

  return (
    <ShadcnTable
      columns={columns}
      data={data}
      stTableBodyRowProps={({ row }) => ({
        className: 'cursor-pointer',
        'data-selected': rowSelection[row.id] || undefined,
        onClick: () =>
          setRowSelection((prev) => ({
            ...prev,
            [row.id]: !prev[row.id],
          })),
      })}
      state={{ rowSelection }}
    />
  );
};

export const SelectAllModeAll = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableRowSelection
    selectAllMode="all"
  />
);

export const SelectAllModeAllConditionally = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableRowSelection={(row) => row.original.age >= 21}
    selectAllMode="all"
  />
);

export const SelectAllModePage = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableRowSelection
    selectAllMode="page"
  />
);

export const SelectAllDisabledCustomHeader = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    displayColumnDefOptions={{
      'st-row-select': { header: 'Your Custom Header' },
    }}
    enableRowSelection
    enableSelectAll={false}
  />
);

export const SingleSelectionRadio = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableMultiRowSelection={false}
    enableRowSelection
  />
);

export const SingleSelectionRadioWithRowClick = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableMultiRowSelection={false}
    enableRowSelection
    stTableBodyRowProps={({ row }) => ({
      className: 'cursor-pointer',
      onClick: row.getToggleSelectedHandler(),
    })}
  />
);

export const SelectCheckboxSecondaryColor = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableRowSelection
    stSelectCheckboxProps={{
      className:
        'data-[state=checked]:border-secondary data-[state=checked]:bg-secondary data-[state=checked]:text-secondary-foreground',
    }}
  />
);

export const AlertBannerBottom = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableRowSelection
    positionToolbarAlertBanner="bottom"
  />
);

export const AlertBannerHeadOverlay = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableRowSelection
    positionToolbarAlertBanner="head-overlay"
  />
);

export const CustomAlertBannerHeadOverlay = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableRowSelection
    stToolbarAlertBannerProps={{
      className: 'bg-sky-100 text-sky-900 dark:bg-sky-950 dark:text-sky-100',
    }}
    positionToolbarAlertBanner="head-overlay"
    renderToolbarAlertBannerContent={({ selectedAlert, table }) => (
      <div className="flex w-full justify-between">
        <div className="flex w-full items-center gap-1.5 px-3 py-1">
          <ST_SelectCheckbox table={table} /> {selectedAlert}{' '}
        </div>
        <div className="flex gap-1.5">
          <Button className="bg-green-600 text-white hover:bg-green-700">
            <Send /> Email
          </Button>
          <Button variant="destructive">
            <Minus /> Remove
          </Button>
        </div>
      </div>
    )}
  />
);

export const MultiSelectRowWithHoldShift = () => {
  const [prevSelectedStaticRowIndex, setPrevSelectedStaticRowIndex] =
    useState<number>();

  //--------------------------------------------------
  const table = useShadcnTable({
    columns,
    data,
    enablePagination: false,
    enableRowSelection: (row) => row.original.age > 10,
    enableRowVirtualization: true,
    getRowId: (row) => row.firstName,
    stSelectAllCheckboxProps: {
      onClick: () => setPrevSelectedStaticRowIndex(undefined),
    },
    stSelectCheckboxProps: ({ row, staticRowIndex }) => ({
      onClick: (e) => {
        if (e.shiftKey) {
          if (!row.getCanSelect() || staticRowIndex === undefined) {
            return;
          }
          handleMultiRowSelectionWithShiftKey({
            rowId: row.id,
            rowIndex: staticRowIndex,
          });
          return;
        }
        setPrevSelectedStaticRowIndex(staticRowIndex);
      },
    }),
    stTableBodyCellProps: { style: { userSelect: 'none' } },
    stTableBodyRowProps: ({ row, staticRowIndex }) => ({
      onClick: (e) => {
        if (!e.shiftKey || !row.getCanSelect()) {
          return;
        }
        handleMultiRowSelectionWithShiftKey({
          rowId: row.id,
          rowIndex: staticRowIndex,
        });
      },
      className: 'cursor-pointer',
    }),
    stTableContainerProps: { className: 'h-[600px]' },
  });

  //--------------------------------------------------
  const handleMultiRowSelectionWithShiftKey = useCallback(
    (opts: { rowId: string; rowIndex: number }) => {
      const { rowId, rowIndex } = opts;
      if (prevSelectedStaticRowIndex === undefined) {
        table.setRowSelection((updater) => {
          return { ...updater, [rowId]: true };
        });
      } else {
        const start = Math.min(prevSelectedStaticRowIndex, rowIndex);
        const end = Math.max(prevSelectedStaticRowIndex, rowIndex);
        handleMultiRowSelection({ end, start });
      }
      setPrevSelectedStaticRowIndex(rowIndex);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [prevSelectedStaticRowIndex],
  );

  //--------------------------------------------------
  const handleMultiRowSelection = useCallback(
    (opts: { end: number; start: number }) => {
      const { end, start } = opts;
      const rows = table.getRowModel().rows;
      const res: Record<string, boolean> = {};
      for (let i = end; i >= start; i--) {
        if (!rows[i]?.getCanSelect()) {
          continue;
        }
        res[rows[i]['id']] = true;
      }
      table.setRowSelection((updater) => {
        return { ...updater, ...res };
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  // TODO: Reset prevSelectedStaticRowIndex when sorting changes
  useEffect(() => {
    setPrevSelectedStaticRowIndex(undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table.getState().sorting]);

  return <ShadcnTable table={table} />;
};
