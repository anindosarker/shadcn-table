import { type ST_ColumnDef, ShadcnTable } from '@/components/ui/shadcn-table';
import { expect, waitFor } from 'storybook/test';
import { type Meta, type StoryContext } from '@storybook/react-vite';

// Fixed bugs (findings, v9 row model gaps): `enablePagination: false` with
// `manualPagination: false` paginated to 10 rows, and `columnFilters` in state
// still filtered rows with every filter flag off. v8 showed all rows in both.

const meta: Meta = {
  title: 'Fixed Bugs/Pagination Disabled',
};

export default meta;

type Person = { firstName: string; lastName: string };

const columns: ST_ColumnDef<Person>[] = [
  { accessorKey: 'firstName', header: 'First Name' },
  { accessorKey: 'lastName', header: 'Last Name' },
];

const twentyFive: Person[] = [...Array(25)].map((_, index) => ({
  firstName: `First ${index + 1}`,
  lastName: `Last ${index + 1}`,
}));

// All 25 rows, not a first page of 10.
export const PaginationDisabledTwentyFiveRows = () => (
  <ShadcnTable
    columns={columns}
    data={twentyFive}
    enablePagination={false}
    manualPagination={false}
  />
);

PaginationDisabledTwentyFiveRows.play = async ({
  canvasElement,
}: StoryContext) => {
  await waitFor(() =>
    expect(canvasElement.querySelectorAll('tbody tr').length).toBe(25),
  );
};

const people: Person[] = [
  { firstName: 'Mason', lastName: 'Lee' },
  { firstName: 'Anderson', lastName: 'Kim' },
  { firstName: 'Lily', lastName: 'Brown' },
  { firstName: 'Tom', lastName: 'Garcia' },
  { firstName: 'Brooke', lastName: 'Diaz' },
  { firstName: 'Jackson', lastName: 'Reed' },
  { firstName: 'Nora', lastName: 'Hill' },
  { firstName: 'Owen', lastName: 'Shaw' },
];

const firstNames = (root: ParentNode) =>
  Array.from(root.querySelectorAll('tbody tr'))
    .map(
      (row) =>
        people.find(({ firstName }) => row.textContent?.includes(firstName))
          ?.firstName ?? '',
    )
    .sort();

// A `columnFilters` value in state with every filter flag off filters
// nothing: all eight rows stay.
export const ColumnFiltersWithEveryFilterFlagOff = () => (
  <ShadcnTable
    columns={columns}
    data={people}
    enableColumnFilters={false}
    enableFilters={false}
    enableGlobalFilter={false}
    enablePagination={false}
    state={{ columnFilters: [{ id: 'firstName', value: 'Mason' }] }}
  />
);

ColumnFiltersWithEveryFilterFlagOff.play = async ({
  canvasElement,
}: StoryContext) => {
  await waitFor(() =>
    expect(firstNames(canvasElement)).toEqual(
      people.map(({ firstName }) => firstName).sort(),
    ),
  );
};
