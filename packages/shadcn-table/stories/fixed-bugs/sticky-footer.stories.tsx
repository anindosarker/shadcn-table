import { type Meta, type StoryContext } from '@storybook/react-vite';
import { expect, waitFor, within } from 'storybook/test';
import { type ST_ColumnDef, ShadcnTable } from '@/components/ui/shadcn-table';
import { DollarSignIcon, HashIcon, UserIcon } from 'lucide-react';

const meta: Meta = {
  title: 'Fixed Bugs/sticky-footer',
};

export default meta;

const mockData = [
  {
    firstName: 'Michael',
    lastName: 'Jordan',
    middleName: 'Jeffrey',
    name: 'Michael Jeffrey Jordan',
    no: 23,
    salary: 1030000,
    total: 86760000,
  },
  {
    firstName: 'Kobe',
    lastName: 'Bryant',
    middleName: 'Bean',
    name: 'Kobe Bean Bryant',
    no: 24,
    salary: 25000000,
    total: 328237108,
  },
  {
    firstName: 'LeBron',
    lastName: 'James',
    middleName: 'Raymone',
    name: 'LeBron Raymone James',
    no: 6,
    salary: 44474988,
    total: 431859107,
  },
  {
    firstName: 'Michael',
    lastName: 'Jordan',
    middleName: 'Jeffrey',
    name: 'Michael Jeffrey Jordan',
    no: 23,
    salary: 1030000,
    total: 86760000,
  },
  {
    firstName: 'Kobe',
    lastName: 'Bryant',
    middleName: 'Bean',
    name: 'Kobe Bean Bryant',
    no: 24,
    salary: 25000000,
    total: 328237108,
  },
  {
    firstName: 'LeBron',
    lastName: 'James',
    middleName: 'Raymone',
    name: 'LeBron Raymone James',
    no: 6,
    salary: 44474988,
    total: 431859107,
  },
  {
    firstName: 'Michael',
    lastName: 'Jordan',
    middleName: 'Jeffrey',
    name: 'Michael Jeffrey Jordan',
    no: 23,
    salary: 1030000,
    total: 86760000,
  },
  {
    firstName: 'Kobe',
    lastName: 'Bryant',
    middleName: 'Bean',
    name: 'Kobe Bean Bryant',
    no: 24,
    salary: 25000000,
    total: 328237108,
  },
  {
    firstName: 'LeBron',
    lastName: 'James',
    middleName: 'Raymone',
    name: 'LeBron Raymone James',
    no: 6,
    salary: 44474988,
    total: 431859107,
  },
];

const mockColumns: ST_ColumnDef<(typeof mockData)[0]>[] = [
  {
    accessorKey: 'no',
    filterVariant: 'multi-select',
    footer: 'SUM',
    header: 'No. ',
    icon: HashIcon,
    size: 80,
  },
  {
    accessorKey: 'name',
    header: 'NAME',
    icon: UserIcon,
    size: 190,
  },
  {
    accessorKey: 'firstName',
    header: 'FIRST NAME',
    icon: UserIcon,
  },
  {
    accessorKey: 'middleName',
    header: 'MIDDLE NAME',
    icon: UserIcon,
    size: 150,
  },
  {
    accessorKey: 'lastName',
    header: 'LAST NAME',
    icon: UserIcon,
  },
  {
    accessorKey: 'salary',
    footer: '211514964',
    header: 'SALARY',
    icon: DollarSignIcon,
  },
  {
    accessorKey: 'total',
    footer: '2540568645',
    header: 'TOTAL',
    icon: DollarSignIcon,
  },
];

export const PinnedColumnsWithStickyFooter = () => {
  return (
    <ShadcnTable
      columns={mockColumns}
      data={mockData}
      enableColumnPinning
      enableStickyFooter
      enableStickyHeader
      initialState={{
        columnPinning: { start: ['no', 'name', 'firstName'], end: [] },
      }}
      stTableBodyCellProps={{
        align: 'center',
        className: 'border-l border-black',
      }}
      stTableContainerProps={{
        style: { maxHeight: 300 },
      }}
      stTableHeadCellProps={{
        align: 'center',
        className: 'border-l border-black',
      }}
    />
  );
};

// The footer sticks to the bottom of the scrolling table and its pinned
// cells stay sticky at their start offsets.
PinnedColumnsWithStickyFooter.play = async ({
  canvasElement,
}: StoryContext) => {
  await within(canvasElement).findAllByText('SUM');
  const tfoot = canvasElement.querySelector<HTMLElement>('tfoot')!;
  expect(getComputedStyle(tfoot).position).toBe('sticky');
  expect(getComputedStyle(tfoot).bottom).toBe('0px');
  const box = tfoot.parentElement!;
  let scroller: HTMLElement | null = box;
  while (scroller && getComputedStyle(scroller).overflowY !== 'auto') {
    scroller = scroller.parentElement;
  }
  // The footer sits at the scroll box's bottom edge while rows scroll under.
  await waitFor(() =>
    expect(
      Math.abs(
        tfoot.getBoundingClientRect().bottom -
          (scroller!.getBoundingClientRect().top + scroller!.clientHeight),
      ),
    ).toBeLessThanOrEqual(1),
  );
  const first = tfoot.querySelector<HTMLElement>('td, th')!;
  expect(getComputedStyle(first).position).toBe('sticky');
  expect(getComputedStyle(first).left).toBe('0px');
};
