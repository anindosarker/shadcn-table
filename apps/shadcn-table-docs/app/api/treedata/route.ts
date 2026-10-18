import { type NextRequest, NextResponse } from 'next/server';
import { type ST_SortingState } from '@/components/ui/shadcn-table';

//This is all fake mock code. Don't be inspired by it.
export async function GET(request: NextRequest) {
  if (process.env.NODE_ENV === 'development') {
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  const { searchParams } = request.nextUrl;
  const start = searchParams.get('start') ?? '0';
  const size = searchParams.get('size') ?? '10';
  const sorting = searchParams.get('sorting') ?? '[]';
  const expandedRowIds = searchParams.get('expandedRowIds') ?? '';

  let dbData = getData();

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
    const sort = parsedSorting[0];
    const { id, desc } = sort;

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

  const paginatedData =
    dbData.slice(parseInt(start), parseInt(start) + parseInt(size)) ?? [];

  let flatDBData: DataRow[] = [];
  const flattenRows = (rows: DataRow[]) => {
    rows.forEach((row) => {
      flatDBData.push(row);
      if (row.subordinates?.length) {
        flattenRows(row.subordinates);
      }
    });
    return flatDBData;
  };

  flatDBData = flattenRows(paginatedData);

  flatDBData.forEach((row) => (delete row.subordinates ? row : null));

  return NextResponse.json({
    data: flatDBData,
    meta: { totalRowCount: flatDBData.length },
  });
}

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

//data definitions...
const getData = (): DataRow[] => [
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
