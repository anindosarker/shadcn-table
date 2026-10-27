import { useEffect, useMemo, useState } from 'react';
import { type Meta } from '@storybook/react-vite';
import {
  type ST_Column,
  type ST_ColumnDef,
  type ST_RowData,
} from '@/components/ui/shadcn-table';
import { faker } from '@faker-js/faker';
import { ShadcnTable } from '@/components/ui/shadcn-table/ShadcnTable';

const meta: Meta = {
  title: 'Features/Column Grouping Examples',
};

export default meta;

interface Person {
  city: string;
  firstName: string;
  gender: string;
  lastName: string;
  state: string;
}

const columns = [
  {
    accessorKey: 'firstName',
    header: 'First Name',
  },
  {
    accessorKey: 'lastName',
    header: 'Last Name',
  },
  {
    accessorKey: 'gender',
    header: 'Gender',
  },
  {
    accessorKey: 'city',
    header: 'City',
  },
  {
    accessorKey: 'state',
    header: 'State',
  },
] as ST_ColumnDef<Person>[];

const data = [...Array(300)].map(() => ({
  city: faker.location.city(),
  firstName: faker.person.firstName(),
  gender: Math.random() < 0.95 ? faker.person.sex() : faker.person.gender(),
  lastName: faker.person.lastName(),
  state: faker.location.state(),
}));

export const ColumnGroupingEnabled = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableGrouping
    enableRowSelection
  />
);

export const ColumnGroupingEnabledReorder = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableGrouping
    groupedColumnMode="reorder"
    initialState={{ expanded: true, grouping: ['state', 'gender'] }}
  />
);

export const GroupingColumnModeRemove = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableGrouping
    groupedColumnMode="remove"
    initialState={{ expanded: true, grouping: ['state', 'gender'] }}
  />
);

export const GroupingColumnModeFalse = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableGrouping
    groupedColumnMode={false}
    initialState={{ expanded: true, grouping: ['state', 'gender'] }}
  />
);

export const GroupingColumnModeRemoveCustomHeader = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    displayColumnDefOptions={{
      'st-row-expand': {
        Header: 'Groups',
      },
    }}
    enableGrouping
    groupedColumnMode="remove"
    initialState={{ expanded: true, grouping: ['state', 'gender'] }}
  />
);

export const GroupingColumnModeRemovePaginatePreExpand = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableGrouping
    groupedColumnMode="remove"
    initialState={{ expanded: true, grouping: ['state', 'gender'] }}
    paginateExpandedRows={false}
  />
);

export const GroupingColumnModeRemoveCustomGroupedCell = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    displayColumnDefOptions={{
      'st-row-expand': {
        //last item in array of grouping state
        GroupedCell: ({ row, table }) => {
          const { grouping } = table.store.state;
          return row.getValue(grouping[grouping.length - 1]);
        },
      },
    }}
    enableGrouping
    groupedColumnMode="remove"
    initialState={{ expanded: true, grouping: ['state', 'gender'] }}
  />
);

export const ColumnGroupingEnabledWithSelection = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableGrouping
    enableRowSelection
    initialState={{ expanded: true, grouping: ['state'] }}
  />
);

export const ColumnGroupingEnabledWithSelectionRemove = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableGrouping
    enableRowSelection
    groupedColumnMode="remove"
    initialState={{ expanded: true, grouping: ['state'] }}
  />
);

export const ColumnGroupingNoDragHandles = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableColumnDragging={false}
    enableGrouping
  />
);

export const ColumnGroupingEnabledDropZoneBottom = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableGrouping
    positionToolbarDropZone="bottom"
  />
);

export const ColumnGroupingEnabledCustomAggregate = () => (
  <ShadcnTable
    columns={[
      {
        accessorKey: 'firstName',
        header: 'First Name',
      },
      {
        accessorKey: 'lastName',
        header: 'Last Name',
      },
      {
        AggregatedCell: ({ cell }) => (
          <div className="text-red-500">{cell.renderValue() as string}</div>
        ),
        accessorKey: 'gender',
        header: 'Gender',
      },
      {
        accessorKey: 'city',
        header: 'City',
      },
      {
        accessorKey: 'state',
        header: 'State',
      },
    ]}
    data={data}
    enableGrouping
  />
);

export const ColumnGroupingBannerOnBottom = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableGrouping
    positionToolbarAlertBanner="bottom"
  />
);

export const GroupingColumnsSetState = () => {
  const [columns, setColumns] = useState<ST_ColumnDef<ST_RowData>[]>([]);
  const [data, setData] = useState<ST_RowData[]>([]);

  useEffect(() => {
    // Do something and set columns and data

    setColumns([
      {
        accessorKey: 'name.firstName', //access nested data with dot notation
        header: 'First Name',
      },
      {
        accessorKey: 'name.lastName',
        header: 'Last Name',
      },
      {
        accessorKey: 'address', //normal accessorKey
        header: 'Address',
      },
      {
        accessorKey: 'city',
        header: 'City',
      },
      {
        accessorKey: 'state',
        header: 'State',
      },
    ]);

    setData([
      {
        address: '261 Erdman Ford',
        city: 'East Daphne',
        name: {
          firstName: 'John',
          lastName: 'Doe',
        },
        state: 'Kentucky',
      },
      {
        address: '769 Dominic Grove',
        city: 'Columbus',
        name: {
          firstName: 'Jane',
          lastName: 'Doe',
        },
        state: 'Ohio',
      },
      {
        address: '566 Brakus Inlet',
        city: 'South Linda',
        name: {
          firstName: 'Joe',
          lastName: 'Doe',
        },
        state: 'West Virginia',
      },
      {
        address: '722 Emie Stream',
        city: 'Lincoln',
        name: {
          firstName: 'Kevin',
          lastName: 'Vandy',
        },
        state: 'Nebraska',
      },
      {
        address: '32188 Larkin Turnpike',
        city: 'Charleston',
        name: {
          firstName: 'Joshua',
          lastName: 'Rolluffs',
        },
        state: 'South Carolina',
      },
    ]);
  }, []);

  return <ShadcnTable columns={columns} data={data} enableGrouping />;
};

export const ColumnGroupingDropZoneAlwaysVisible = () => {
  const [draggingColumn, setDraggingColumn] =
    useState<ST_Column<Person> | null>(null);

  return (
    <ShadcnTable
      columns={columns}
      data={data}
      enableGrouping
      localization={
        !draggingColumn
          ? { dropToGroupBy: 'Drag a column here to group by it' }
          : undefined
      }
      onDraggingColumnChange={setDraggingColumn}
      positionToolbarAlertBanner="bottom"
      stTopToolbarProps={{
        className:
          '[&>.border-dashed]:z-2! [&>.border-dashed]:border [&>.border-dashed]:border-solid [&>.border-dashed]:border-red-500',
      }}
      state={{ draggingColumn, showToolbarDropZone: true }}
    />
  );
};

export const GroupingStateManaged = () => {
  const [grouping, setGrouping] = useState<string[]>([]);
  return (
    <ShadcnTable
      columns={columns}
      data={data}
      enableGrouping
      onGroupingChange={setGrouping}
      state={{ grouping }}
    />
  );
};

export const GroupingAndDraggingWithSomeDisabledGrouping = () => {
  const _columns = useMemo<ST_ColumnDef<Person>[]>(
    () => [
      {
        accessorKey: 'firstName',
        enableGrouping: false,
        header: 'First Name',
      },
      {
        accessorKey: 'lastName',
        header: 'Last Name',
      },
    ],
    [],
  );

  return (
    <ShadcnTable
      columns={_columns}
      data={data}
      enableColumnDragging
      enableGrouping
    />
  );
};
