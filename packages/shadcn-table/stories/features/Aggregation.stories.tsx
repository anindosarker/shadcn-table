import { type Meta, type StoryContext } from '@storybook/react-vite';
import { expect, waitFor, within } from 'storybook/test';
import { constructAggregationFn } from '@tanstack/react-table';
import {
  ST_AggregationFns,
  type ST_ColumnDef,
  ShadcnTable,
  useShadcnTable,
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
  title: 'Features/Aggregation',
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

// The docs example "Aggregation and Grouping"
// (examples/base/aggregation-and-grouping): its columns, options and rows.
interface ExamplePerson {
  age: number;
  firstName: string;
  gender: string;
  lastName: string;
  salary: number;
  state: string;
}

// The docs examples' rows (examples/base/<name>/makeData.ts, the same file
// for every grouping example): first name, last name, age, gender, state,
// salary.
const exampleRows: [string, string, number, string, string, number][] = [
  ['Danika', 'Rodriguez', 57, 'Male', 'Utah', 31404],
  ['Eloisa', 'Kohler', 31, 'Male', 'Alaska', 45801],
  ['Gunner', 'Rolfson', 22, 'Male', 'Arizona', 54027],
  ['Andreanne', 'Hamill', 65, 'Female', 'Hawaii', 60975],
  ['Kali', 'Jones', 56, 'Female', 'Kentucky', 27067],
  ['Felicia', 'Mitchell', 34, 'Male', 'South Carolina', 48423],
  ['Philip', 'Koepp', 32, 'Male', 'Louisiana', 36713],
  ['Aniya', 'Mante', 41, 'Female', 'Minnesota', 77658],
  ['Nelda', 'Gottlieb', 41, 'Female', 'Delaware', 57634],
  ['Marty', 'Kihn', 19, 'Male', 'Delaware', 95427],
  ['Alvis', 'Turcotte', 53, 'Female', 'Wyoming', 14272],
  ['Kavon', 'Spencer', 37, 'Female', 'Missouri', 79499],
  ['Winifred', 'Wilderman', 56, 'Female', 'Iowa', 96293],
  ['Brooklyn', 'Monahan', 35, 'Female', 'Nevada', 13219],
  ['Santino', 'Brown', 33, 'Male', 'Mississippi', 36361],
  ['Bianka', 'Yost', 28, 'Female', 'Wisconsin', 89057],
  ['Herman', 'Herzog', 63, 'Female', 'South Carolina', 28110],
  ['Earl', 'Gottlieb', 65, 'Female', 'Florida', 31400],
  ['Valentine', 'Bauch', 61, 'Female', 'North Carolina', 35130],
  ['Joanny', 'Koss', 23, 'Male', 'Colorado', 90422],
  ['Aliza', 'Wilkinson', 25, 'Female', 'Virginia', 98417],
  ['Eldred', 'Collier', 37, 'Male', 'Mississippi', 43741],
  ['Dorris', 'Koch', 37, 'Male', 'Delaware', 40979],
  ['Felix', 'Zieme', 51, 'Male', 'Ohio', 55319],
  ['Salma', 'Treutel', 32, 'Female', 'Pennsylvania', 31722],
  ['Durward', 'Kris', 36, 'Male', 'Iowa', 28486],
  ['Osborne', 'Barrows', 28, 'Male', 'West Virginia', 43996],
  ['Adelia', 'Abbott', 38, 'Male', 'Oregon', 34720],
  ['Thad', 'Wiegand', 64, 'Female', 'Alabama', 56146],
  ['Tiana', 'Tromp', 51, 'Male', 'Arkansas', 45636],
  ['Gwen', 'Bergstrom', 36, 'Female', 'Wyoming', 95145],
  ['Evalyn', 'Mitchell', 53, 'Female', 'Illinois', 86990],
  ['Edyth', 'Macejkovic', 55, 'Female', 'Kentucky', 65344],
  ['Lamar', 'Bechtelar', 58, 'Female', 'Rhode Island', 93753],
  ['Tillman', 'Jacobs', 36, 'Female', 'New Mexico', 13393],
  ['Turner', 'Haley', 56, 'Female', 'Nebraska', 93733],
  ['Omer', 'Funk', 28, 'Female', 'Iowa', 77913],
  ['Alivia', 'Ledner', 56, 'Male', 'Alabama', 12591],
  ['Dortha', 'Schmitt', 43, 'Male', 'Mississippi', 80347],
  ['Ellie', 'Schinner', 41, 'Female', 'Rhode Island', 42232],
  ['Pansy', 'Reilly', 55, 'Male', 'Louisiana', 87255],
  ['Alfonzo', 'Abernathy', 40, 'Male', 'Utah', 53374],
  ['Carmine', 'Orn', 24, 'Female', 'Georgia', 89363],
  ['Taylor', 'Herzog', 63, 'Male', 'Florida', 81429],
  ['Ray', 'Little', 27, 'Female', 'Maine', 53736],
  ['Melyssa', 'Bechtelar', 56, 'Male', 'New Mexico', 85152],
  ['Coy', 'Schoen', 32, 'Male', 'Florida', 83999],
  ['Lexi', 'Reinger', 39, 'Female', 'Virginia', 17585],
  ['Carlee', 'Turcotte', 25, 'Male', 'Missouri', 85236],
  ['Tamia', 'Stamm', 47, 'Female', 'Nevada', 65037],
  ['Leola', 'Donnelly', 30, 'Female', 'Missouri', 23897],
  ['Allison', 'Stanton', 34, 'Male', 'New Hampshire', 34389],
  ['Neoma', 'Flatley', 65, 'Female', 'Connecticut', 43669],
  ['Brad', 'Altenwerth', 18, 'Male', 'Virginia', 85599],
  ['Magdalen', 'Berge', 58, 'Female', 'Louisiana', 65571],
  ['Kathryn', 'Kirlin', 48, 'Female', 'New Hampshire', 97434],
  ['Rod', 'Sawayn', 19, 'Female', 'Nevada', 58951],
  ['Georgette', 'Beatty', 53, 'Male', 'Kentucky', 12203],
  ['Dianna', 'King', 23, 'Female', 'Vermont', 13515],
  ['Kellie', 'Parker', 43, 'Trans Male', 'Louisiana', 49457],
  ['Faustino', 'Ankunding', 43, 'Male', 'Indiana', 49943],
  ['Hilton', 'Pacocha', 58, 'Male', 'South Dakota', 34874],
  ['Shanel', 'Schneider', 33, 'Female', 'Nebraska', 50446],
  ['Wade', 'Kiehn', 23, 'Male', 'Delaware', 29522],
  ['Austyn', 'Rempel', 35, 'Female', 'Arkansas', 42997],
  ['Maggie', 'Keebler', 20, 'Female', 'California', 11588],
  ['Ruby', 'Kertzmann', 40, 'Female', 'Missouri', 45860],
  ['Lilyan', 'Pfannerstill', 37, 'Cisgender', 'Washington', 37347],
  ['Fletcher', 'Huels', 65, 'Female', 'Colorado', 11596],
  ['Danyka', 'Gleason', 36, 'Male', 'Alabama', 71238],
  ['Tressa', 'McCullough', 64, 'Female', 'Virginia', 47028],
  ['Heber', 'Bernhard', 37, 'Cisgender', 'California', 11268],
  ['Damon', 'Barrows', 20, 'Female', 'West Virginia', 22796],
  ['Willy', 'Koss', 35, 'Female', 'Colorado', 88346],
  ['Carley', 'Block', 54, 'Female', 'Michigan', 32934],
  ['Randy', 'Powlowski', 31, 'Female', 'Mississippi', 68186],
  ['Rubye', 'Weissnat', 43, 'Female', 'South Carolina', 19377],
  ['Gloria', 'Green', 54, 'Male', 'Georgia', 85559],
  ['Kian', 'Hand', 56, 'Male', 'Alaska', 81062],
  ['Adelia', 'Weber', 29, 'Male', 'Wyoming', 62704],
  ['Clemmie', 'Nienow', 64, 'Male', 'New Hampshire', 84951],
  ['Buck', 'Ankunding', 25, 'Male', 'Kentucky', 88189],
  ['Abbey', 'Kulas', 36, 'Female', 'Oklahoma', 62902],
  ['Godfrey', 'Beahan', 43, 'Female', 'Georgia', 85231],
  ['Jayde', 'Friesen', 60, 'Male', 'Minnesota', 68939],
  ['Kaela', 'Bernhard', 51, 'Female', 'Virginia', 61567],
  ['Jerome', 'Jast', 22, 'Male', 'Wisconsin', 47210],
  ['Lawrence', 'Steuber', 39, 'Male', 'Mississippi', 99291],
  ['Deon', 'Romaguera', 53, 'Female', 'Vermont', 98288],
  ['Jena', "O'Hara", 41, 'Female', 'Iowa', 40063],
  ['Ima', 'Bartell', 62, 'Female', 'Rhode Island', 72570],
  ['Antonina', 'McCullough', 59, 'Male', 'Nebraska', 95189],
  ['Steve', 'Gislason', 41, 'Male', 'Kentucky', 93162],
  ['Carmela', 'Boyle', 49, 'Male', 'Virginia', 71890],
  ['Horacio', 'Murphy', 51, 'Female', 'Vermont', 32343],
  ['Bettie', "O'Hara", 40, 'Female', 'North Dakota', 60492],
  ['Rene', 'Gottlieb', 34, 'Female', 'Florida', 90192],
  ['Turner', 'Ward', 32, 'Female', 'Tennessee', 55249],
  ['Elaina', 'Orn', 30, 'Female', 'Michigan', 72501],
  ['Nayeli', 'Littel', 44, 'Nonbinary', 'Maine', 53740],
  ['Velda', 'Kuphal', 57, 'Male', 'New York', 93481],
  ['Loyce', 'Schmidt', 29, 'Female', 'Alaska', 76295],
  ['Oswaldo', 'DuBuque', 30, 'Male', 'Ohio', 55034],
  ['Kiarra', 'Dooley', 20, 'Male', 'Nebraska', 60415],
  ['Ashleigh', 'Fahey', 56, 'Female', 'New Mexico', 28186],
  ['Jordyn', 'Weissnat', 49, 'Female', 'North Dakota', 81663],
  ['Maureen', 'Swift', 63, 'Male', 'Ohio', 53538],
  ['Cathryn', 'Spinka', 42, 'Female', 'New Hampshire', 14586],
  ['Xzavier', 'Raynor', 37, 'Male', 'California', 60776],
  ['Alexander', 'Kris', 63, 'Female', 'North Carolina', 85926],
  ['Golda', 'McLaughlin', 41, 'Cisgender', 'Kansas', 49250],
  ['Delbert', 'Jacobson', 40, 'Female', 'New Hampshire', 58482],
  ['Cordia', 'Hermann', 45, 'Female', 'Mississippi', 29543],
  ['Brennon', 'Smith', 39, 'Nonbinary', 'Missouri', 65193],
  ['Kraig', 'Moen', 59, 'Male', 'West Virginia', 52677],
  ['Lionel', 'Hartmann', 30, 'Nonbinary', 'Alabama', 58743],
  ['Terrill', 'Feest', 61, 'Female', 'West Virginia', 97637],
  ['Jaylin', 'Murazik', 56, 'Male', 'Wyoming', 68290],
  ['Tyrique', 'Emard', 55, 'Male', 'New Hampshire', 23052],
  ['Shanelle', 'Hilll', 35, 'Male', 'New Mexico', 66504],
  ['Antwan', 'Zieme', 21, 'Male', 'Utah', 56638],
  ['Kyler', 'Schmeler', 19, 'Female', 'Oklahoma', 73721],
  ['Colt', 'Wiegand', 64, 'Male', 'New York', 69024],
  ['Paul', 'Leannon', 21, 'Male', 'New York', 67575],
  ['Magnus', 'Ortiz', 53, 'Female', 'Ohio', 18489],
  ['Kathryn', 'Langworth', 39, 'Male', 'Utah', 25720],
  ['Zelma', 'Grimes', 42, 'Male', 'Texas', 94083],
  ['Eddie', 'Paucek', 40, 'Nonbinary', 'Michigan', 96538],
  ['Tressa', 'Cartwright', 26, 'Female', 'Maine', 38495],
  ['Dawn', 'Huels', 57, 'Male', 'New Jersey', 41603],
  ['Pinkie', 'Rau', 30, 'Female', 'New Jersey', 27073],
  ['Macie', 'Reynolds', 18, 'Male', 'Massachusetts', 86581],
  ['Bertrand', 'Cummings', 62, 'Female', 'Illinois', 96908],
  ['Dylan', 'Wolf', 65, 'Male', 'New York', 75557],
  ['Elsa', 'Lockman', 36, 'Female', 'Colorado', 30586],
  ['Haylee', 'Price', 57, 'Male', 'Utah', 59047],
  ['Harold', 'Stracke', 49, 'Female', 'Indiana', 99744],
  ['Kelly', 'Monahan', 20, 'Male', 'Indiana', 64408],
  ['Lee', "O'Hara", 38, 'Male', 'Washington', 23136],
  ['Trevor', 'Beier', 65, 'Female', 'New York', 19235],
  ['Theron', 'Windler', 32, 'Male', 'North Dakota', 52825],
  ['Jennings', 'Halvorson', 34, 'Male', 'New York', 24737],
  ['Charity', 'Kuvalis', 40, 'Male', 'Mississippi', 60813],
  ['Kaitlyn', 'Maggio', 23, 'Female', 'Indiana', 74616],
  ['Reymundo', 'Osinski', 45, 'Female', 'New Mexico', 50978],
  ['Glen', 'Kub', 47, 'Male', 'Vermont', 85742],
  ['Reinhold', 'Reichel', 30, 'Female', 'Alabama', 30531],
  ['Theresia', 'Wyman', 50, 'Female', 'Kentucky', 49835],
  ['Lurline', 'Koepp', 59, 'Female', 'Alabama', 10645],
  ['Elise', 'Schimmel', 42, 'Male', 'Illinois', 80267],
  ['Maeve', 'Mante', 54, 'Male', 'Massachusetts', 34713],
  ['Michale', 'Collier', 59, 'Male', 'Alaska', 75197],
  ['Adell', 'Champlin', 37, 'Female', 'Tennessee', 80245],
  ['Cyril', 'Hahn', 48, 'Male', 'Louisiana', 76679],
  ['Josiah', 'Durgan', 50, 'Female', 'North Carolina', 76309],
  ['Rene', 'Weber', 58, 'Female', 'Mississippi', 51097],
  ['Stacey', 'Pouros', 34, 'Male', 'Minnesota', 71566],
  ['Kody', 'Braun', 38, 'Female', 'Alabama', 63733],
  ['Maritza', 'Bartell', 45, 'Female', 'Idaho', 14581],
  ['Abbey', 'Fay', 30, 'Male', 'New Mexico', 21372],
  ['Duncan', 'Carroll', 50, 'Male', 'Washington', 65996],
  ['Eldridge', 'Stroman', 42, 'Male', 'Alaska', 59594],
  ['Roberta', 'Bashirian', 38, 'Male', 'Nevada', 91870],
  ['Erwin', 'Kihn', 26, 'Nonbinary', 'Louisiana', 48803],
  ['Alberta', 'Considine', 37, 'Male', 'Illinois', 84906],
  ['Lexi', "O'Hara", 29, 'Male', 'Virginia', 72684],
  ['Alvera', 'Balistreri', 25, 'Female', 'Alaska', 79844],
  ['Kayden', 'Emard', 35, 'Female', 'Alaska', 98252],
  ['Rahul', 'Greenfelder', 27, 'Female', 'Wisconsin', 63419],
  ['Caterina', 'Koss', 52, 'Male', 'Arkansas', 58259],
  ['Eriberto', 'Klein', 20, 'Male', 'Iowa', 73198],
  ['Lilla', 'Thompson', 36, 'Male', 'Washington', 53856],
  ['Jonathan', 'Brakus', 47, 'Female', 'Kansas', 45726],
  ['Darby', 'Frami', 58, 'Female', 'Texas', 68700],
  ['Damon', 'Barrows', 22, 'Female', 'Pennsylvania', 23156],
  ['Eliezer', 'Erdman', 25, 'Female', 'Missouri', 48537],
  ['Marge', 'Windler', 29, 'Female', 'Georgia', 54107],
  ['Raleigh', 'Lakin', 48, 'Male', 'Nebraska', 13802],
  ['Freida', 'Barrows', 54, 'Female', 'North Carolina', 32719],
  ['Allen', 'Gaylord', 57, 'Female', 'Virginia', 41416],
  ['Blanche', 'Luettgen', 39, 'Male', 'Missouri', 81498],
  ['Domingo', 'Bauch', 36, 'Female', 'Alaska', 35159],
  ['Elijah', 'Kiehn', 43, 'Female', 'Colorado', 11772],
  ['Mozelle', 'Kuvalis', 44, 'Female', 'Massachusetts', 25499],
  ['Adaline', 'Volkman', 19, 'Female', 'Louisiana', 74049],
  ['Edward', 'Wisozk', 22, 'Female', 'Washington', 90236],
  ['Rita', 'Gaylord', 64, 'Female', 'Georgia', 12755],
  ['Burdette', 'Fisher', 27, 'Female', 'Connecticut', 29371],
  ['Naomi', 'Ebert', 52, 'Female', 'Colorado', 48525],
  ['Sid', 'Champlin', 43, 'Female', 'Pennsylvania', 77186],
  ['Darwin', 'Luettgen', 57, 'Male', 'Illinois', 34401],
  ['Bonita', 'Klocko', 43, 'Male', 'Arkansas', 85883],
  ['Tremayne', 'Casper', 58, 'Female', 'Nebraska', 47237],
  ['Maximillian', "O'Connell", 27, 'Female', 'New Jersey', 33190],
  ['Nola', 'Bashirian', 36, 'Male', 'Nebraska', 45510],
  ['Vernon', 'Murray', 62, 'Male', 'Montana', 25464],
  ['Edwin', 'Rippin', 32, 'Male', 'Michigan', 44083],
  ['Zola', 'Goodwin', 20, 'Male', 'Idaho', 62729],
  ['Dangelo', 'Abshire', 31, 'Female', 'Connecticut', 40247],
  ['Kallie', 'Swaniawski', 45, 'Male', 'Virginia', 35294],
];

const examplePeople: ExamplePerson[] = exampleRows.map(
  ([firstName, lastName, age, gender, state, salary]) => ({
    age,
    firstName,
    gender,
    lastName,
    salary,
    state,
  }),
);

const exampleAverageSalary =
  examplePeople.reduce((acc, curr) => acc + curr.salary, 0) /
  examplePeople.length;

const exampleMaxAge = examplePeople.reduce(
  (acc, curr) => Math.max(acc, curr.age),
  0,
);

const exampleColumns: ST_ColumnDef<ExamplePerson>[] = [
  {
    header: 'First Name',
    accessorKey: 'firstName',
    icon: UserIcon,
    enableGrouping: false,
  },
  {
    header: 'Last Name',
    accessorKey: 'lastName',
    icon: UserIcon,
  },
  {
    header: 'Age',
    accessorKey: 'age',
    icon: CakeIcon,
    aggregationFn: 'max',
    AggregatedCell: ({ cell, table }) => (
      <>
        Oldest by{' '}
        {table.getColumn(cell.row.groupingColumnId ?? '').columnDef.header}:{' '}
        <span className="inline font-bold text-sky-600">
          {cell.getValue<number>()}
        </span>
      </>
    ),
    Footer: () => (
      <div className="flex flex-col">
        Max Age:
        <div className="text-yellow-600">{Math.round(exampleMaxAge)}</div>
      </div>
    ),
  },
  {
    header: 'Gender',
    accessorKey: 'gender',
    icon: VenusAndMarsIcon,
    GroupedCell: ({ cell, row }) => (
      <div className="text-primary">
        <strong>{cell.getValue<string>()}s </strong> ({row.subRows?.length})
      </div>
    ),
  },
  {
    header: 'State',
    accessorKey: 'state',
    icon: MapIcon,
  },
  {
    header: 'Salary',
    accessorKey: 'salary',
    icon: DollarSignIcon,
    aggregationFn: 'mean',
    AggregatedCell: ({ cell, table }) => (
      <>
        Average by{' '}
        {table.getColumn(cell.row.groupingColumnId ?? '').columnDef.header}:{' '}
        <div className="font-bold text-green-600">
          {cell.getValue<number>()?.toLocaleString?.('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          })}
        </div>
      </>
    ),
    Cell: ({ cell }) => (
      <>
        {cell.getValue<number>()?.toLocaleString?.('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        })}
      </>
    ),
    Footer: () => (
      <div className="flex flex-col">
        Average Salary:
        <div className="text-yellow-600">
          {exampleAverageSalary?.toLocaleString?.('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          })}
        </div>
      </div>
    ),
  },
];

const AggregationAndGroupingTable = () => {
  const table = useShadcnTable({
    columns: exampleColumns,
    data: examplePeople,
    displayColumnDefOptions: {
      'st-row-expand': {
        enableResizing: true,
      },
    },
    enableColumnResizing: true,
    enableGrouping: true,
    enableStickyHeader: true,
    enableStickyFooter: true,
    initialState: {
      density: 'compact',
      expanded: true,
      grouping: ['state'],
      pagination: { pageIndex: 0, pageSize: 20 },
      sorting: [{ id: 'state', desc: false }],
    },
    stToolbarAlertBannerChipProps: {
      className: 'bg-primary text-primary-foreground',
    },
    stTableContainerProps: { className: 'max-h-[700px]' },
  });
  return <ShadcnTable table={table} />;
};

/**
 * Grouped by State: each group row shows the oldest age and the average
 * salary, and the footer the overall max age and average salary.
 */
export const AggregationAndGrouping = {
  name: 'Aggregation and Grouping',
  render: () => <AggregationAndGroupingTable />,
  play: async ({ canvasElement }: StoryContext) => {
    const canvas = within(canvasElement);
    await canvas.findAllByText(/^Oldest by/);
    expect(canvas.getAllByText(/^Average by/).length).toBeGreaterThan(0);
    const footer = canvasElement.querySelector('tfoot')!;
    expect(footer).toHaveTextContent(`Max Age:${Math.round(exampleMaxAge)}`);
    expect(footer).toHaveTextContent(
      `Average Salary:${exampleAverageSalary.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })}`,
    );
  },
};
