import { type Meta, type StoryContext } from '@storybook/react-vite';
import { expect, waitFor, within } from 'storybook/test';
import { constructAggregationFn } from '@tanstack/react-table';
import {
  ST_AggregationFns,
  type ST_ColumnDef,
  ShadcnTable,
} from '@/components/ui/shadcn-table';
import { faker } from '@faker-js/faker';
import {
  CakeIcon,
  DollarSignIcon,
  MapIcon,
  UserIcon,
  VenusAndMarsIcon,
} from 'lucide-react';

const meta: Meta = {
  title: 'Features/Aggregation Examples',
};

export default meta;

const data = [...Array(2000)].map(() => ({
  age: faker.number.int({ max: 65, min: 18 }),
  firstName: faker.person.firstName(),
  gender: Math.random() < 0.95 ? faker.person.sex() : faker.person.gender(),
  lastName: faker.person.lastName(),
  salary: Number(faker.finance.amount({ dec: 0, max: 100000, min: 10000 })),
  state: faker.location.state(),
}));

const averageSalary =
  data.reduce((acc, curr) => acc + curr.salary, 0) / data.length;

const averageAge = data.reduce((acc, curr) => acc + curr.age, 0) / data.length;

const columns = [
  {
    AggregatedCell: () => '-',
    accessorKey: 'firstName',
    enableGrouping: false,
    header: 'First Name',
    icon: UserIcon,
  },
  {
    AggregatedCell: () => '-',
    accessorKey: 'lastName',
    enableGrouping: false,
    header: 'Last Name',
    icon: UserIcon,
  },
  {
    AggregatedCell: ({ cell, table }) => (
      <>
        Max by{' '}
        {table.getColumn(cell.row.groupingColumnId ?? '').columnDef.header}:{' '}
        <span className="font-bold text-green-600">
          {cell.getValue<number>()}
        </span>
      </>
    ),
    Footer: () => (
      <div className="flex flex-col">
        Average Age:
        <span className="text-amber-600">{Math.round(averageAge)}</span>
      </div>
    ),
    accessorKey: 'age',
    aggregationFn: 'max',
    header: 'Age',
    icon: CakeIcon,
  },
  {
    GroupedCell: ({ cell }) => (
      <span className="text-primary">{cell.getValue<string>()}</span>
    ),
    accessorKey: 'gender',
    header: 'Gender',
    icon: VenusAndMarsIcon,
  },
  {
    accessorKey: 'state',
    header: 'State',
    icon: MapIcon,
  },
  {
    AggregatedCell: ({ cell, table }) => (
      <>
        Average by{' '}
        {table.getColumn(cell.row.groupingColumnId ?? '').columnDef.header}:{' '}
        <span className="font-bold text-green-600">
          {cell.getValue<number>()?.toLocaleString?.('en-US', {
            currency: 'USD',
            maximumFractionDigits: 0,
            minimumFractionDigits: 0,
            style: 'currency',
          })}
        </span>
      </>
    ),
    Cell: ({ cell }) => (
      <>
        {cell.getValue<number>()?.toLocaleString?.('en-US', {
          currency: 'USD',
          maximumFractionDigits: 0,
          minimumFractionDigits: 0,
          style: 'currency',
        })}
      </>
    ),
    Footer: () => (
      <div className="flex flex-col">
        Average Salary:
        <span className="text-amber-600">
          {averageSalary?.toLocaleString?.('en-US', {
            currency: 'USD',
            maximumFractionDigits: 0,
            minimumFractionDigits: 0,
            style: 'currency',
          })}
        </span>
      </div>
    ),
    accessorKey: 'salary',
    aggregationFn: 'mean',
    enableGrouping: false,
    header: 'Salary',
    icon: DollarSignIcon,
  },
] as ST_ColumnDef<(typeof data)[0]>[];

export const Aggregation = () => (
  <ShadcnTable columns={columns} data={data} enableGrouping />
);

export const AggregationWithSelection = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableGrouping
    enableRowSelection
  />
);

export const AggregationExpandedDefault = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableGrouping
    initialState={{ expanded: true }}
  />
);

export const AggregationRemoveMode = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableGrouping
    groupedColumnMode="remove"
    initialState={{ expanded: true, grouping: ['state', 'gender'] }}
  />
);

export const AggregationFalseMode = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableGrouping
    groupedColumnMode={false}
    initialState={{ expanded: true, grouping: ['state', 'gender'] }}
  />
);

export const AggregationRemoveModeCustomGroupedCell = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    displayColumnDefOptions={{
      'st-row-expand': {
        //last item in array of grouping state
        GroupedCell: ({ row, table }) => {
          const grouping = table.atoms.grouping.get();
          return row.getValue(grouping[grouping.length - 1]);
        },
      },
    }}
    enableGrouping
    groupedColumnMode="remove"
    initialState={{ expanded: true, grouping: ['state', 'gender'] }}
  />
);

export const AggregationGroupedAndExpandedDefault = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableGrouping
    initialState={{
      expanded: true,
      grouping: ['state', 'gender'],
      isFullScreen: true,
      pagination: { pageIndex: 0, pageSize: 20 },
    }}
  />
);

export const MultiAggregationPerColumn = () => (
  <ShadcnTable
    columns={[
      {
        accessorKey: 'firstName',
        enableGrouping: false,
        header: 'First Name',
        icon: UserIcon,
      },
      {
        accessorKey: 'lastName',
        enableGrouping: false,
        header: 'Last Name',
        icon: UserIcon,
      },
      {
        AggregatedCell: ({ cell, table }) => (
          <>
            Min by{' '}
            {table.getColumn(cell.row.groupingColumnId ?? '').columnDef.header}:{' '}
            <span className="font-bold text-green-600">
              {cell.getValue<[number, number]>()[0]}
            </span>
            <br />
            Max by{' '}
            {
              table.getColumn(cell.row.groupingColumnId ?? '').columnDef.header
            }:{' '}
            <span className="font-bold text-green-600">
              {cell.getValue<[number, number]>()[1]}
            </span>
          </>
        ),
        Footer: () => (
          <div className="flex flex-col">
            Average Age:
            <span className="text-amber-600">{Math.round(averageAge)}</span>
          </div>
        ),
        accessorKey: 'age',
        //manually set multiple aggregation functions
        aggregationFn: constructAggregationFn({
          aggregate: (context) => [
            ST_AggregationFns.min.aggregate(context),
            ST_AggregationFns.max.aggregate(context),
          ],
        }),
        header: 'Age',
        icon: CakeIcon,
      },
      {
        GroupedCell: ({ cell }) => (
          <span className="text-primary">{cell.getValue<string>()}</span>
        ),
        accessorKey: 'gender',
        header: 'Gender',
        icon: VenusAndMarsIcon,
      },
      {
        accessorKey: 'state',
        header: 'State',
        icon: MapIcon,
      },
      {
        AggregatedCell: ({ cell, table }) => (
          <>
            Count:{' '}
            <span className="font-bold text-green-600">
              {cell.getValue<[number, number]>()?.[0]}
            </span>
            <br />
            Average by{' '}
            {
              table.getColumn(cell.row.groupingColumnId ?? '').columnDef.header
            }:{' '}
            <span className="font-bold text-green-600">
              {cell
                .getValue<[number, number]>()?.[1]
                ?.toLocaleString?.('en-US', {
                  currency: 'USD',
                  maximumFractionDigits: 0,
                  minimumFractionDigits: 0,
                  style: 'currency',
                })}
            </span>
          </>
        ),
        Cell: ({ cell }) => (
          <>
            {cell.getValue<number>()?.toLocaleString?.('en-US', {
              currency: 'USD',
              maximumFractionDigits: 0,
              minimumFractionDigits: 0,
              style: 'currency',
            })}
          </>
        ),
        Footer: () => (
          <div className="flex flex-col">
            Average Salary:
            <span className="text-amber-600">
              {averageSalary?.toLocaleString?.('en-US', {
                currency: 'USD',
                maximumFractionDigits: 0,
                minimumFractionDigits: 0,
                style: 'currency',
              })}
            </span>
          </div>
        ),
        accessorKey: 'salary',
        aggregationFn: ['count', 'mean'], //multiple aggregation functions
        enableGrouping: false,
        header: 'Salary',
        icon: DollarSignIcon,
      },
    ]}
    data={data}
    enableGrouping
    initialState={{
      expanded: true,
      grouping: ['state', 'gender'],
      isFullScreen: true,
      pagination: { pageIndex: 0, pageSize: 20 },
    }}
  />
);

/**
 * A grouped row shows its group's aggregates: the max age and the mean
 * salary of exactly the rows in that group.
 */
export const GroupedRowShowsAggregate = {
  render: () => (
    <ShadcnTable
      columns={columns}
      data={data}
      enableGrouping
      initialState={{ grouping: ['state'] }}
    />
  ),
  play: async ({ canvasElement }: StoryContext) => {
    await within(canvasElement).findAllByText(/^Max by State:/);
    const row = canvasElement.querySelector<HTMLElement>('tbody tr')!;
    const cell = (id: string) =>
      row.querySelector<HTMLElement>(`td[data-flip-column="${id}"]`)!;
    const stateText = (cell('state').textContent ?? '').trim();
    const state = [...new Set(data.map((person) => person.state))]
      .filter((name) => stateText.startsWith(name))
      .sort((a, b) => b.length - a.length)[0]!;
    const group = data.filter((person) => person.state === state);
    expect(stateText).toContain(`(${group.length})`);
    const maxAge = Math.max(...group.map((person) => person.age));
    const meanSalary = (
      group.reduce((sum, person) => sum + person.salary, 0) / group.length
    ).toLocaleString('en-US', {
      currency: 'USD',
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
      style: 'currency',
    });
    await waitFor(() => {
      expect(cell('age')).toHaveTextContent(`Max by State: ${maxAge}`);
      expect(cell('salary')).toHaveTextContent(
        `Average by State: ${meanSalary}`,
      );
    });
  },
};
