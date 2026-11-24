import { faker } from '@faker-js/faker';
import { ShadcnTable } from '@/components/ui/shadcn-table';
import { type Meta, type StoryContext } from '@storybook/react-vite';
import { expect, fireEvent, waitFor, within } from 'storybook/test';
import { CalendarClockIcon, CalendarIcon, ClockIcon } from 'lucide-react';

const meta: Meta = {
  title: 'Miscellaneous/Mobile Date Pickers',
};

export default meta;

// API GAP: the original MRT story relied on MUI X `<DatePicker>` /
// `<MobileDateTimePicker>` for the date/time filter UI. ST has no MUI date
// picker dependency; the `date`, `date-range`, `datetime`, `datetime-range`,
// `time`, and `time-range` filter variants render the shadcn date picker
// instead. This port keeps the same column/filterVariant config so every
// variant is exercised.
const data = [...Array(120)].map(() => ({
  arrivalTime: faker.date.recent(),
  birthDate: faker.date.birthdate({ max: 2020, min: 1980, mode: 'age' }),
  deliverySlot: faker.date.recent(),
  departureTime: faker.date.recent(),
  hireDate: faker.date.birthdate({ max: 2024, min: 2011, mode: 'age' }),
  startTime: faker.date.recent(),
}));

export const MobileDateTimePickers = () => (
  <ShadcnTable
    columns={[
      {
        Cell: ({ cell }) => cell.getValue<Date>().toLocaleDateString(), //transform data to readable format for cell render
        accessorFn: (row) => new Date(row.birthDate), //transform data before processing so sorting works
        filterFn: 'lessThan',
        filterVariant: 'date',
        header: 'Birth Date',
        icon: CalendarIcon,
        id: 'birthDate',
      },
      {
        Cell: ({ cell }) => cell.getValue<Date>().toLocaleDateString(), //transform data to readable format for cell render
        accessorFn: (row) => new Date(row.hireDate), //transform data before processing so sorting works
        filterVariant: 'date-range',
        header: 'Hire Date',
        icon: CalendarIcon,
        id: 'hireDate',
      },
      {
        Cell: ({ cell }) => cell.getValue<Date>().toLocaleString(), //transform data to readable format for cell render
        accessorFn: (row) => new Date(row.departureTime), //transform data before processing so sorting works
        filterVariant: 'datetime',
        header: 'Departure',
        icon: ClockIcon,
        id: 'departureTime',
      },
      {
        Cell: ({ cell }) => cell.getValue<Date>().toLocaleString(), //transform data to readable format for cell render
        accessorFn: (row) => new Date(row.arrivalTime), //transform data before processing so sorting works
        filterVariant: 'datetime-range',
        header: 'Arrival time',
        icon: ClockIcon,
        id: 'arrivalTime',
      },
      {
        Cell: ({ cell }) => cell.getValue<Date>().toLocaleString(), //transform data to readable format for cell render
        accessorFn: (row) => new Date(row.startTime), //transform data before processing so sorting works
        filterVariant: 'time',
        header: 'Start Time',
        icon: ClockIcon,
        id: 'startTime',
      },
      {
        Cell: ({ cell }) => cell.getValue<Date>().toLocaleString(), //transform data to readable format for cell render
        accessorFn: (row) => new Date(row.deliverySlot), //transform data before processing so sorting works
        filterVariant: 'time-range',
        header: 'Delivery Slot',
        icon: CalendarClockIcon,
        id: 'deliverySlot',
      },
    ]}
    data={data}
    columnFilterDisplayMode="subheader"
    initialState={{ showColumnFilters: true }}
  />
);

// Each date picker holds a box of the right type (a date and a date and time
// range keep their end boxes in the popup, D183), and a date filter narrows
// the rows.
MobileDateTimePickers.play = async ({ canvasElement }: StoryContext) => {
  await within(canvasElement).findAllByRole('columnheader');
  const inputs = (type: string) =>
    canvasElement.querySelectorAll<HTMLInputElement>(
      `thead input[type="${type}"]`,
    );
  await waitFor(() => expect(inputs('date')).toHaveLength(1));
  expect(inputs('datetime-local')).toHaveLength(1);
  expect(inputs('time')).toHaveLength(3);
  for (const [column, type] of [
    ['Hire Date', 'date'],
    ['Arrival time', 'datetime-local'],
  ] as const) {
    const name = `Filter by ${column}`;
    fireEvent.click(
      within(canvasElement).getByRole('button', { name, hidden: true }),
    );
    const popup = await waitFor(() => {
      const dialog = document.querySelector<HTMLElement>(
        `[role="dialog"][aria-label="${name}"]`,
      );
      expect(dialog).not.toBeNull();
      return dialog!;
    });
    expect(popup.querySelectorAll(`input[type="${type}"]`)).toHaveLength(2);
    fireEvent.keyDown(popup, { key: 'Escape' });
    await waitFor(() =>
      expect(
        document.querySelector(`[role="dialog"][aria-label="${name}"]`),
      ).toBeNull(),
    );
  }
  const before = canvasElement.querySelectorAll('tbody tr').length;
  expect(before).toBe(10);
  // A Birth Date before every row's leaves no row.
  fireEvent.change(inputs('date')[0]!, { target: { value: '0001-01-02' } });
  await waitFor(() =>
    expect(canvasElement.querySelectorAll('tbody tr')).toHaveLength(1),
  );
  expect(canvasElement.querySelector('tbody tr')).toHaveTextContent(
    /^No (records to display|results found)/,
  );
};
