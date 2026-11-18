import { useMemo, useState } from 'react';
import {
  type ST_ColumnDef,
  type ST_ExpandedState,
  type ST_Localization,
  type ST_PaginationState,
  type ST_SortingState,
  ShadcnTable,
  useShadcnTable,
} from '@/components/ui/shadcn-table';
import {
  keepPreviousData,
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query';
import { faker } from '@faker-js/faker';
import { type Meta, type StoryContext } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import {
  Building2Icon,
  CakeIcon,
  MailIcon,
  MapIcon,
  MapPinIcon,
  PhoneIcon,
  UserIcon,
} from 'lucide-react';

const meta: Meta = {
  title: 'Features/Sub Row Tree',
};

export default meta;

// Partial Hebrew localization for the RTL stories. The full locale ships as its
// own registry file under shared/locales; the stories import only the barrel.
const localizationHE: Partial<ST_Localization> = {
  language: 'he',
  actions: 'פעולות',
  collapse: 'צמצום',
  collapseAll: 'צמצום הכל',
  expand: 'הרחב',
  expandAll: 'הרחב הכל',
  goToNextPage: 'לדף הבא',
  goToPreviousPage: 'לדף הקודם',
  of: 'מתוך',
  rowsPerPage: 'שורות לעמוד',
  search: 'חיפוש',
  showHideColumns: 'הצג/הסתר עמודות',
  showHideFilters: 'הצג/הסתר סינונים',
  showHideSearch: 'הצג/הסתר חיפוש',
  toggleDensity: 'שנה צפיפות',
  toggleFullScreen: 'מסך מלא',
};

const columns: ST_ColumnDef<(typeof data)[0]>[] = [
  {
    accessorKey: 'firstName',
    header: 'First Name',
    icon: UserIcon,
  },
  {
    accessorKey: 'lastName',
    header: 'Last Name',
    icon: UserIcon,
  },
  {
    accessorKey: 'age',
    header: 'Age',
    icon: CakeIcon,
  },
  {
    accessorKey: 'address',
    header: 'Address',
    icon: MapPinIcon,
  },
  {
    accessorKey: 'phoneNumber',
    header: 'Phone Number',
    icon: PhoneIcon,
  },
];

const data = [...Array(5)].map(() => ({
  address: faker.location.streetAddress(),
  age: faker.number.int(80),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  phoneNumber: faker.phone.number(),
  subRows: [...Array(faker.number.int(4))].map(() => ({
    address: faker.location.streetAddress(),
    age: faker.number.int(80),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    phoneNumber: faker.phone.number(),
    subRows: [...Array(3)].map(() => ({
      address: faker.location.streetAddress(),
      age: faker.number.int(80),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      phoneNumber: faker.phone.number(),
      subRows: [...Array(2)].map(() => ({
        address: faker.location.streetAddress(),
        age: faker.number.int(80),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        phoneNumber: faker.phone.number(),
      })),
    })),
  })),
}));

export const SubRowTreeEnabledDefault = {
  render: () => <ShadcnTable columns={columns} data={data} enableExpanding />,
  play: async (context: StoryContext) => {
    await context.step('ExpandAllCollapseAll', () =>
      expandAllCollapseAll(context),
    );
    await context.step('ExpandShowsChildren', () =>
      expandShowsChildren(context),
    );
  },
};

export const SubRowTreeLayoutGrid = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    displayColumnDefOptions={{
      'st-row-expand': {
        // size: 100,
      },
    }}
    enableExpanding
    initialState={{ expanded: true }}
    layoutMode="grid"
  />
);

export const SubRowTreeLayoutGridNoGrow = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    displayColumnDefOptions={{
      'st-row-expand': {
        // size: 100,
      },
    }}
    enableExpanding
    initialState={{ expanded: true }}
    layoutMode="grid-no-grow"
  />
);

export const SubRowTreeEnabledPositionLast = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableExpanding
    positionExpandColumn="last"
  />
);

// Note: MUI ThemeProvider direction -> dir="rtl" on the wrapper.
export const SubRowTreeEnabledDefaultRTL = () => (
  <div dir="rtl" style={{ direction: 'rtl' }}>
    <ShadcnTable
      columns={columns}
      data={data}
      enableExpanding
      localization={localizationHE}
    />
  </div>
);

export const SubRowTreeEnabledDefaultRTLAndPositionLast = () => (
  <div dir="rtl" style={{ direction: 'rtl' }}>
    <ShadcnTable
      columns={columns}
      data={data}
      enableExpanding
      localization={localizationHE}
      positionActionsColumn="last"
    />
  </div>
);

export const SubRowTreeDisableExpandAll = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableExpandAll={false}
    enableExpanding
  />
);

export const SubRowTreeFilterFromLeafRows = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableExpanding
    enablePagination={false}
    filterFromLeafRows
    columnFilterDisplayMode="subheader"
    initialState={{ expanded: true, showColumnFilters: true }}
  />
);

export const SubRowTreeMaxLeafRowFilterDepth0 = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableExpanding
    enablePagination={false}
    columnFilterDisplayMode="subheader"
    initialState={{ expanded: true, showColumnFilters: true }}
    maxLeafRowFilterDepth={0}
  />
);

export const SubRowTreeMaxLeafRowFilterDepth1 = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableExpanding
    enablePagination={false}
    columnFilterDisplayMode="subheader"
    initialState={{ expanded: true, showColumnFilters: true }}
    maxLeafRowFilterDepth={1}
  />
);

export const SubRowTreeMaxLeafRowFilterDepthAndFilterFromLeafRows = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableExpanding
    enablePagination={false}
    filterFromLeafRows
    columnFilterDisplayMode="subheader"
    initialState={{ expanded: true, showColumnFilters: true }}
    maxLeafRowFilterDepth={0}
  />
);

export const SubRowTreeWithSelection = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableExpanding
    enablePagination={false}
    enableRowSelection
  />
);

export const SubRowTreeWithSelectionNoSubRowSelection = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableExpanding
    enablePagination={false}
    enableRowSelection
    enableSubRowSelection={false}
  />
);

export const SubRowTreeWithSingleSelection = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableExpanding
    enableMultiRowSelection={false}
    enablePagination={false}
    enableRowSelection
  />
);

type Node = { firstName: string; subRows?: Node[] };

const rowFirstNames = (canvasElement: HTMLElement) =>
  [
    ...canvasElement.querySelectorAll(
      'tbody tr td[data-flip-column="firstName"]',
    ),
  ].map((cell) => (cell.textContent ?? '').trim());

/** Expanding a parent row shows its direct children right under it. */
const expandShowsChildren = async ({ canvasElement }: StoryContext) => {
  await within(canvasElement).findAllByText(data[0].firstName);
  expect(rowFirstNames(canvasElement)).toEqual(
    data.map((person) => person.firstName),
  );
  const index = data.findIndex((person) => person.subRows.length > 0);
  const parent =
    canvasElement.querySelectorAll<HTMLElement>('tbody tr')[index]!;
  await userEvent.click(within(parent).getByRole('button', { name: 'Expand' }));
  const children = data[index]!.subRows.map((child) => child.firstName);
  await waitFor(() =>
    expect(rowFirstNames(canvasElement)).toEqual([
      ...data.slice(0, index + 1).map((person) => person.firstName),
      ...children,
      ...data.slice(index + 1).map((person) => person.firstName),
    ]),
  );
};

/** Expand all opens every level in tree order; collapse all closes them. */
const expandAllCollapseAll = async ({ canvasElement }: StoryContext) => {
  const canvas = within(canvasElement);
  await canvas.findAllByText(data[0].firstName);
  const flat = (nodes: Node[]): string[] =>
    nodes.flatMap((node) => [node.firstName, ...flat(node.subRows ?? [])]);
  await userEvent.click(canvas.getByRole('button', { name: 'Expand all' }));
  // Expanded rows paginate: the first page holds the first ten in order.
  await waitFor(() =>
    expect(rowFirstNames(canvasElement)).toEqual(flat(data).slice(0, 10)),
  );
  await userEvent.click(canvas.getByRole('button', { name: 'Expand all' }));
  await waitFor(() =>
    expect(rowFirstNames(canvasElement)).toEqual(
      data.map((person) => person.firstName),
    ),
  );
};

// The docs example expanding-tree: fixed nested rows, every row expanded.
type TreePerson = {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  subRows?: TreePerson[]; //Each person can have sub rows of more people
};

const treeData: TreePerson[] = [
  {
    firstName: 'Dylan',
    lastName: 'Murray',
    address: '261 Erdman Ford',
    city: 'East Daphne',
    state: 'Kentucky',
    subRows: [
      {
        firstName: 'Ervin',
        lastName: 'Reinger',
        address: '566 Brakus Inlet',
        city: 'South Linda',
        state: 'West Virginia',
        subRows: [
          {
            firstName: 'Jordane',
            lastName: 'Homenick',
            address: '1234 Brakus Inlet',
            city: 'South Linda',
            state: 'West Virginia',
          },
          {
            firstName: 'Jordan',
            lastName: 'Clarkson',
            address: '4882 Palm Rd',
            city: 'San Francisco',
            state: 'California',
          },
        ],
      },
      {
        firstName: 'Brittany',
        lastName: 'McCullough',
        address: '722 Emie Stream',
        city: 'Lincoln',
        state: 'Nebraska',
      },
    ],
  },
  {
    firstName: 'Raquel',
    lastName: 'Kohler',
    address: '769 Dominic Grove',
    city: 'Columbus',
    state: 'Ohio',
    subRows: [
      {
        firstName: 'Branson',
        lastName: 'Frami',
        address: '32188 Larkin Turnpike',
        city: 'Charleston',
        state: 'South Carolina',
      },
    ],
  },
];

const ExpandingTreeTable = () => {
  const columns = useMemo<ST_ColumnDef<TreePerson>[]>(
    //column definitions...
    () => [
      {
        accessorKey: 'firstName',
        icon: UserIcon,
        header: 'First Name',
      },
      {
        accessorKey: 'lastName',
        icon: UserIcon,
        header: 'Last Name',
      },

      {
        accessorKey: 'address',
        icon: MapPinIcon,
        header: 'Address',
      },
      {
        accessorKey: 'city',
        icon: Building2Icon,
        header: 'City',
      },

      {
        accessorKey: 'state',
        icon: MapIcon,
        enableColumnOrdering: false,
        header: 'State',
      },
    ],
    [],
    //end
  );

  const table = useShadcnTable({
    columns,
    data: treeData,
    enableExpandAll: false, //hide expand all double arrow in column header
    enableExpanding: true,
    filterFromLeafRows: true, //apply filtering to all rows instead of just parent rows
    getSubRows: (row) => row.subRows, //default
    initialState: { expanded: true }, //expand all rows by default
    paginateExpandedRows: false, //When rows are expanded, do not count sub-rows as number of rows on the page towards pagination
  });

  return <ShadcnTable table={table} />;
};

/** The row whose first name cell holds this name. */
const rowOf = (canvasElement: HTMLElement, firstName: string) =>
  [...canvasElement.querySelectorAll<HTMLElement>('tbody tr')].find(
    (row) =>
      row
        .querySelector('td[data-flip-column="firstName"]')
        ?.textContent?.trim() === firstName,
  )!;

export const ExpandingTree = {
  render: () => <ExpandingTreeTable />,
  play: async ({ canvasElement, step }: StoryContext) => {
    const canvas = within(canvasElement);
    await canvas.findByText('Jordane');
    expect(rowFirstNames(canvasElement)).toEqual([
      'Dylan',
      'Ervin',
      'Jordane',
      'Jordan',
      'Brittany',
      'Raquel',
      'Branson',
    ]);
    expect(canvas.queryByRole('button', { name: 'Expand all' })).toBeNull();

    await step('Collapsing a parent hides its sub-rows', async () => {
      await userEvent.click(
        within(rowOf(canvasElement, 'Dylan')).getByRole('button', {
          name: 'Expand',
        }),
      );
      await waitFor(() =>
        expect(rowFirstNames(canvasElement)).toEqual([
          'Dylan',
          'Raquel',
          'Branson',
        ]),
      );
      await userEvent.click(
        within(rowOf(canvasElement, 'Dylan')).getByRole('button', {
          name: 'Expand',
        }),
      );
      await canvas.findByText('Jordane');
    });

    await step(
      'The search keeps matching sub-rows with their parents',
      async () => {
        await userEvent.click(
          canvas.getByRole('button', { name: 'Show/Hide search' }),
        );
        await userEvent.keyboard('Jordan');
        await waitFor(() => {
          const names = rowFirstNames(canvasElement);
          expect(names).toEqual(
            expect.arrayContaining(['Dylan', 'Ervin', 'Jordane', 'Jordan']),
          );
          expect(names).not.toContain('Raquel');
        });
      },
    );
  },
};

// The docs example expanding-tree-flat-parse: flat rows parsed into a tree
// by getSubRows over managerId.
type Employee = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  state: string;
  managerId: string | null;
};

//flat data that TanStack Table's getSubRows() function will parse into a tree
const employees: Employee[] = [
  {
    id: '9s41rp',
    firstName: 'Kelvin',
    lastName: 'Langosh',
    email: 'Jerod14@hotmail.com',
    state: 'Ohio',
    managerId: '08m6rx',
  },
  {
    id: '08m6rx',
    firstName: 'Molly',
    lastName: 'Purdy',
    email: 'Hugh.Dach79@hotmail.com',
    state: 'Rhode Island',
    managerId: '5ymtrc',
  },
  {
    id: '5ymtrc',
    firstName: 'Henry',
    lastName: 'Lynch',
    email: 'Camden.Macejkovic@yahoo.com',
    state: 'California',
    managerId: null, //top of a tree
  },
  {
    id: 'ek5b97',
    firstName: 'Glenda',
    lastName: 'Douglas',
    email: 'Eric0@yahoo.com',
    state: 'Montana',
    managerId: '08m6rx',
  },
  {
    id: 'xxtydd',
    firstName: 'Leone',
    lastName: 'Williamson',
    email: 'Ericka_Mueller52@yahoo.com',
    state: 'Colorado',
    managerId: '08m6rx',
  },
  {
    id: 'wzxj9m',
    firstName: 'Mckenna',
    lastName: 'Friesen',
    email: 'Veda_Feeney@yahoo.com',
    state: 'New York',
    managerId: null, //top of a tree
  },
  {
    id: '21dwtz',
    firstName: 'Wyman',
    lastName: 'Jast',
    email: 'Melvin.Pacocha@yahoo.com',
    state: 'Montana',
    managerId: 'wzxj9m',
  },
  {
    id: 'o8oe4k',
    firstName: 'Janick',
    lastName: 'Willms',
    email: 'Delfina12@gmail.com',
    state: 'Nebraska',
    managerId: 'wzxj9m',
  },
];

const ExpandingParsedTreeTable = () => {
  const columns = useMemo<ST_ColumnDef<Employee>[]>(
    //column definitions...
    () => [
      {
        accessorKey: 'firstName',
        icon: UserIcon,
        header: 'First Name',
      },
      {
        accessorKey: 'lastName',
        icon: UserIcon,
        header: 'Last Name',
      },

      {
        accessorKey: 'email',
        icon: MailIcon,
        header: 'Email',
      },
      {
        accessorKey: 'state',
        icon: MapIcon,
        header: 'State',
      },
    ],
    [],
    //end
  );

  //only root rows with no managerId
  const rootData = useMemo(() => employees.filter((r) => !r.managerId), []);

  const table = useShadcnTable({
    columns,
    data: rootData,
    enableExpanding: true,
    //note: performance of this example should be improved with hash maps. This is currently 0(n^2)
    getSubRows: (row) => employees.filter((r) => r.managerId === row.id),
  });

  return <ShadcnTable table={table} />;
};

export const ExpandingParsedTree = {
  render: () => <ExpandingParsedTreeTable />,
  play: async ({ canvasElement, step }: StoryContext) => {
    const canvas = within(canvasElement);
    await canvas.findByText('Henry');
    expect(rowFirstNames(canvasElement)).toEqual(['Henry', 'Mckenna']);

    await step('Expanding a row shows who reports to it', async () => {
      await userEvent.click(
        within(rowOf(canvasElement, 'Henry')).getByRole('button', {
          name: 'Expand',
        }),
      );
      await waitFor(() =>
        expect(rowFirstNames(canvasElement)).toEqual([
          'Henry',
          'Molly',
          'Mckenna',
        ]),
      );
    });

    await step('Expand all opens every level', async () => {
      await userEvent.click(canvas.getByRole('button', { name: 'Expand all' }));
      await waitFor(() =>
        expect(rowFirstNames(canvasElement)).toEqual([
          'Henry',
          'Molly',
          'Kelvin',
          'Glenda',
          'Leone',
          'Mckenna',
          'Wyman',
          'Janick',
        ]),
      );
    });
  },
};

// The docs example lazy-sub-rows: each row's sub-rows load from the docs
// app's /api/treedata when it expands; getTreeData below answers in the
// story with the same rows.

//Your API response shape will probably be different. Knowing a total row count is important though.
type UserApiResponse = {
  data: Array<User>;
  meta: {
    totalRowCount: number;
  };
};

type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  state: string;
  managerId: string | null; //row's parent row id
  subordinateIds: string[]; //or some type of boolean that indicates that there are sub-rows
};

interface DataRow {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  state: string;
  managerId: string | null;
  subordinateIds: string[];
  subordinates?: DataRow[];
}

//data definitions... the rows of the docs app's /api/treedata, fresh on every request
const getTreeRows = (): DataRow[] => [
  {
    id: '5ymtrc',
    firstName: 'Henry',
    lastName: 'Lynch',
    email: 'Camden.Macejkovic@yahoo.com',
    state: 'California',
    managerId: null,
    subordinateIds: ['08m6rx'],
    subordinates: [
      {
        id: '08m6rx',
        firstName: 'Molly',
        lastName: 'Purdy',
        email: 'Hugh.Dach79@hotmail.com',
        state: 'Rhode Island',
        managerId: '5ymtrc',
        subordinateIds: ['9s41rp', 'ek5b97', 'xxtydd'],
        subordinates: [
          {
            id: '9s41rp',
            firstName: 'Kelvin',
            lastName: 'Langosh',
            email: 'Jerod14@hotmail.com',
            state: 'Ohio',
            managerId: '08m6rx',
            subordinateIds: [],
          },
          {
            id: 'ek5b97',
            firstName: 'Glenda',
            lastName: 'Douglas',
            email: 'Eric0@yahoo.com',
            state: 'Montana',
            managerId: '08m6rx',
            subordinateIds: [],
          },
          {
            id: 'xxtydd',
            firstName: 'Leone',
            lastName: 'Williamson',
            email: 'Ericka_Mueller52@yahoo.com',
            state: 'Colorado',
            managerId: '08m6rx',
            subordinateIds: [],
          },
        ],
      },
    ],
  },
  {
    id: 'wzxj9m',
    firstName: 'Mckenna',
    lastName: 'Friesen',
    email: 'Veda_Feeney@yahoo.com',
    state: 'New York',
    managerId: null,
    subordinateIds: ['21dwtz', 'o8oe4k'],
    subordinates: [
      {
        id: '21dwtz',
        firstName: 'Wyman',
        lastName: 'Jast',
        email: 'Melvin.Pacocha@yahoo.com',
        state: 'Montana',
        managerId: 'wzxj9m',
        subordinateIds: [],
      },
      {
        id: 'o8oe4k',
        firstName: 'Janick',
        lastName: 'Willms',
        email: 'Delfina12@gmail.com',
        state: 'Nebraska',
        managerId: 'wzxj9m',
        subordinateIds: [],
      },
    ],
  },
];
//end

/**
 * The docs app's GET /api/treedata (app/api/treedata/route.ts) as a
 * function: the same rows, sub-rows only under the expanded rows, sorted and
 * paged the same way, answered as JSON after a short wait.
 */
const getTreeData = async (url: URL): Promise<UserApiResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const { searchParams } = url;
  const start = searchParams.get('start') ?? '0';
  const size = searchParams.get('size') ?? '10';
  const sorting = searchParams.get('sorting') ?? '[]';
  const expandedRowIds = searchParams.get('expandedRowIds') ?? '';

  let dbData = getTreeRows();

  //recursive filter out rows that don't have a manageId that matches an expandedRowId
  const removeSubordinatesFromCollapsedRows = (rows: DataRow[]) => {
    rows.forEach((row) => {
      if (!expandedRowIds.includes(row.id)) {
        delete row.subordinates;
      }
      if (row.subordinates?.length) {
        removeSubordinatesFromCollapsedRows(row.subordinates);
      }
    });
  };

  if (expandedRowIds !== 'all') {
    removeSubordinatesFromCollapsedRows(dbData);
  }

  const parsedSorting = JSON.parse(sorting) as ST_SortingState;
  if (parsedSorting?.length) {
    const { id, desc } = parsedSorting[0];

    //recursive sort rows and row's sub-rows
    const sortRowsAndSubRows = (rows: DataRow[]) => {
      rows.sort((a, b) => {
        const av = a[id as keyof DataRow] as string | null;
        const bv = b[id as keyof DataRow] as string | null;
        if (!av || !bv) return 0;
        if (desc) {
          return av < bv ? 1 : -1;
        }
        return av > bv ? 1 : -1;
      });
      rows.forEach((row) => {
        if (row.subordinates?.length) {
          sortRowsAndSubRows(row.subordinates);
        }
      });
      return rows;
    };

    dbData = sortRowsAndSubRows(dbData);
  }

  const paginatedData = dbData.slice(
    parseInt(start),
    parseInt(start) + parseInt(size),
  );

  const flatDBData: DataRow[] = [];
  const flattenRows = (rows: DataRow[]) => {
    rows.forEach((row) => {
      flatDBData.push(row);
      if (row.subordinates?.length) {
        flattenRows(row.subordinates);
      }
    });
  };
  flattenRows(paginatedData);
  flatDBData.forEach((row) => delete row.subordinates);

  return JSON.parse(
    JSON.stringify({
      data: flatDBData,
      meta: { totalRowCount: flatDBData.length },
    }),
  ) as UserApiResponse;
};

const lazyColumns: ST_ColumnDef<User>[] = [
  //column definitions...
  {
    accessorKey: 'firstName',
    icon: UserIcon,
    header: 'First Name',
  },
  {
    accessorKey: 'lastName',
    icon: UserIcon,
    header: 'Last Name',
  },
  {
    accessorKey: 'email',
    icon: MailIcon,
    header: 'Email',
  },
  {
    accessorKey: 'state',
    icon: MapIcon,
    header: 'State',
  },
  //end
];

//fetch user hook
const useFetchUsers = ({
  pagination,
  sorting,
  expandedRowIds,
}: {
  pagination: ST_PaginationState;
  sorting: ST_SortingState;
  expandedRowIds: string[] | 'all';
}) => {
  return useQuery<UserApiResponse>({
    queryKey: [
      'users', //give a unique key for this query
      {
        pagination, //refetch when pagination changes
        sorting, //refetch when sorting changes
        expandedRowIds,
      },
    ],
    queryFn: async () => {
      const fetchURL = new URL('/api/treedata', location.origin);

      //read our state and pass it to the API as query params
      fetchURL.searchParams.set(
        'start',
        `${pagination.pageIndex * pagination.pageSize}`,
      );
      fetchURL.searchParams.set('size', `${pagination.pageSize}`);
      fetchURL.searchParams.set('sorting', JSON.stringify(sorting ?? []));
      fetchURL.searchParams.set(
        'expandedRowIds',
        expandedRowIds === 'all' ? 'all' : JSON.stringify(expandedRowIds ?? []),
      );

      //the story answers in place of the docs app's API route
      return getTreeData(fetchURL);
    },
    placeholderData: keepPreviousData, //don't go to 0 rows when refetching or paginating to next page
  });
};

const LazySubRowsTable = () => {
  const [sorting, setSorting] = useState<ST_SortingState>([]);
  const [pagination, setPagination] = useState<ST_PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [expanded, setExpanded] = useState<ST_ExpandedState>({}); //Record<string, boolean> | true

  //which rows have sub-rows expanded and need their direct sub-rows to be included in the API call
  const expandedRowIds: string[] | 'all' = useMemo(
    () =>
      expanded === true
        ? 'all'
        : Object.entries(expanded)
            .filter(([, isExpanded]) => isExpanded)
            .map(([managerId]) => managerId),
    [expanded],
  );

  const {
    data: { data = [], meta } = {},
    isError,
    isRefetching,
    isLoading,
  } = useFetchUsers({
    pagination,
    sorting,
    expandedRowIds,
  });

  //get data for root rows only (top of the tree data)
  const rootData = useMemo(() => data.filter((r) => !r.managerId), [data]);

  const table = useShadcnTable({
    columns: lazyColumns,
    data: rootData,
    enableExpanding: true, //enable expanding column
    enableFilters: false,
    //tell ST which rows have additional sub-rows that can be fetched
    getRowCanExpand: (row) => !!row.original.subordinateIds.length, //just some type of boolean
    //identify rows by the user's id
    getRowId: (row) => row.id,
    //if data is delivered in a flat array, ST can convert it to a tree structure
    //though it's usually better if the API can construct the nested structure before this point
    getSubRows: (row) => data.filter((r) => r.managerId === row.id), //parse flat array into tree structure
    // paginateExpandedRows: false, //the back-end in this example is acting as if this option is false
    manualPagination: true, //turn off built-in client-side pagination
    manualSorting: true, //turn off built-in client-side sorting
    stToolbarAlertBannerProps: isError
      ? {
          className: 'border-destructive text-destructive',
          children: 'Error loading data',
        }
      : undefined,
    onExpandedChange: setExpanded,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    rowCount: meta?.totalRowCount ?? 0,
    state: {
      expanded,
      isLoading,
      pagination,
      showAlertBanner: isError,
      showProgressBars: isRefetching,
      sorting,
    },
  });

  return <ShadcnTable table={table} />;
};

//react query setup in App.tsx; one client per mount, so each story run starts with an empty cache
const LazySubRowsApp = () => {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <LazySubRowsTable />
    </QueryClientProvider>
  );
};

export const LazySubRows = {
  name: 'Lazy Sub-Rows',
  render: () => <LazySubRowsApp />,
  play: async ({ canvasElement, step }: StoryContext) => {
    const shows = (names: string[]) =>
      waitFor(() => expect(rowFirstNames(canvasElement)).toEqual(names), {
        timeout: 5000,
      });
    await shows(['Henry', 'Mckenna']);

    await step('Expanding a row loads its sub-rows', async () => {
      await userEvent.click(
        within(rowOf(canvasElement, 'Henry')).getByRole('button', {
          name: 'Expand',
        }),
      );
      await shows(['Henry', 'Molly', 'Mckenna']);
    });

    await step('Expanding a loaded row loads its own sub-rows', async () => {
      await userEvent.click(
        within(rowOf(canvasElement, 'Molly')).getByRole('button', {
          name: 'Expand',
        }),
      );
      await shows(['Henry', 'Molly', 'Kelvin', 'Glenda', 'Leone', 'Mckenna']);
    });
  },
};

/** The select control (checkbox or radio) of each body row, in order. */
const selectControls = (canvasElement: HTMLElement) =>
  [
    ...canvasElement.querySelectorAll<HTMLElement>(
      'tbody td[data-flip-column="st-row-select"]',
    ),
  ].map(
    (cell) =>
      within(cell).queryByRole('checkbox') ?? within(cell).getByRole('radio'),
  );

/**
 * Opens the first parent row that has sub-rows and returns its index and the
 * number of its direct sub-rows, which then sit right under it.
 */
const expandFirstParent = async (canvasElement: HTMLElement) => {
  await within(canvasElement).findAllByText(data[0].firstName);
  const index = data.findIndex((person) => person.subRows.length > 0);
  const count = data[index]!.subRows.length;
  const parent =
    canvasElement.querySelectorAll<HTMLElement>('tbody tr')[index]!;
  await userEvent.click(within(parent).getByRole('button', { name: 'Expand' }));
  await waitFor(() =>
    expect(canvasElement.querySelectorAll('tbody tr')).toHaveLength(
      data.length + count,
    ),
  );
  return { count, index };
};

const isChecked = (control: HTMLElement) =>
  control.matches(':checked, [aria-checked="true"], [data-checked]');

/** The checked state of the parent and of each of its direct sub-rows. */
const parentAndSubRows = (
  canvasElement: HTMLElement,
  index: number,
  count: number,
) =>
  selectControls(canvasElement)
    .slice(index, index + count + 1)
    .map(isChecked);

// Ticking a parent ticks its sub-rows, unticking it unticks them, and ticking
// the last unticked sub-row ticks the parent (D125).
SubRowTreeWithSelection.play = async ({ canvasElement }: StoryContext) => {
  const { count, index } = await expandFirstParent(canvasElement);
  await userEvent.click(selectControls(canvasElement)[index]!);
  await waitFor(() =>
    expect(parentAndSubRows(canvasElement, index, count)).toEqual(
      Array(count + 1).fill(true),
    ),
  );
  await userEvent.click(selectControls(canvasElement)[index]!);
  await waitFor(() =>
    expect(parentAndSubRows(canvasElement, index, count)).toEqual(
      Array(count + 1).fill(false),
    ),
  );
  for (let child = 1; child <= count; child++) {
    await userEvent.click(selectControls(canvasElement)[index + child]!);
    await waitFor(() =>
      expect(parentAndSubRows(canvasElement, index, count)).toEqual([
        child === count,
        ...Array.from({ length: count }, (_, i) => i < child),
      ]),
    );
  }
};

// Without sub-row selection, ticking a parent ticks that row alone.
SubRowTreeWithSelectionNoSubRowSelection.play = async ({
  canvasElement,
}: StoryContext) => {
  const { count, index } = await expandFirstParent(canvasElement);
  await userEvent.click(selectControls(canvasElement)[index]!);
  await waitFor(() =>
    expect(parentAndSubRows(canvasElement, index, count)).toEqual([
      true,
      ...Array(count).fill(false),
    ]),
  );
};

// Single selection: one row at a time, a parent included.
SubRowTreeWithSingleSelection.play = async ({
  canvasElement,
}: StoryContext) => {
  const { count, index } = await expandFirstParent(canvasElement);
  await userEvent.click(selectControls(canvasElement)[index + 1]!);
  await waitFor(() =>
    expect(selectControls(canvasElement).map(isChecked)).toEqual(
      selectControls(canvasElement).map((_, i) => i === index + 1),
    ),
  );
  await userEvent.click(selectControls(canvasElement)[index]!);
  await waitFor(() =>
    expect(parentAndSubRows(canvasElement, index, count)).toEqual([
      true,
      ...Array(count).fill(false),
    ]),
  );
};
