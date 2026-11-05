import { useState } from 'react';
import { type ST_ColumnDef, ShadcnTable } from '@/components/ui/shadcn-table';
import { faker } from '@faker-js/faker';
import { type Meta, type StoryContext } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import {
  BriefcaseIcon,
  CalendarIcon,
  DollarSignIcon,
  MailIcon,
  UserIcon,
} from 'lucide-react';

const meta: Meta = {
  title: 'Features/Full Screen Examples',
};

export default meta;

const columns: ST_ColumnDef<(typeof data)[0]>[] = [
  {
    columns: [
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
        accessorKey: 'email',
        header: 'Email',
        icon: MailIcon,
      },
    ],
    header: 'Employee',
    id: 'employee',
  },
  {
    columns: [
      {
        accessorKey: 'jobTitle',
        header: 'Job Title',
        icon: BriefcaseIcon,
      },
      {
        accessorKey: 'salary',
        header: 'Salary',
        icon: DollarSignIcon,
      },
      {
        accessorKey: 'startDate',
        header: 'Start Date',
        icon: CalendarIcon,
      },
    ],
    header: 'Job Info',
    id: 'jobInfo',
  },
];

const data = [...Array(128)].map(() => ({
  avatar: faker.image.avatar(),
  email: faker.internet.email(),
  firstName: faker.person.firstName(),
  jobTitle: faker.person.jobTitle(),
  lastName: faker.person.lastName(),
  salary: +faker.finance.amount({ dec: 0, max: 150000, min: 20000 }),
  signatureCatchPhrase: faker.company.catchPhrase(),
  startDate: faker.date.past({ years: 8 }).toLocaleDateString(),
}));

export const FullScreenToggleEnabledDefault = () => (
  <ShadcnTable columns={columns} data={data} />
);

export const DisableFullScreenToggle = () => (
  <ShadcnTable columns={columns} data={data} enableFullScreenToggle={false} />
);

export const DefaultFullScreenOn = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    initialState={{ isFullScreen: true }}
  />
);

export const ControlledFullScreen = () => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  return (
    <ShadcnTable
      columns={columns}
      data={data}
      onIsFullScreenChange={setIsFullScreen}
      stTableBodyCellProps={({ cell }) => ({
        title: cell.getValue<string>(),
      })}
      state={{ isFullScreen }}
    />
  );
};

/**
 * The toggle puts the table root in full screen (fixed, covering the
 * viewport); Escape leaves it.
 */
export const ToggleFullScreen = {
  render: () => <FullScreenToggleEnabledDefault />,
  play: async ({ canvasElement }: StoryContext) => {
    const canvas = within(canvasElement);
    await canvas.findAllByText(data[0].firstName);
    const root = canvasElement.querySelector<HTMLElement>(
      '[data-st-full-screen]',
    )!;
    expect(getComputedStyle(root).position).not.toBe('fixed');
    await userEvent.click(
      canvas.getByRole('button', { name: 'Toggle full screen' }),
    );
    await waitFor(() => {
      expect(getComputedStyle(root).position).toBe('fixed');
      const box = root.getBoundingClientRect();
      expect(box.width).toBe(window.innerWidth);
      expect(box.height).toBe(window.innerHeight);
    });
    root.focus();
    await userEvent.keyboard('{Escape}');
    await waitFor(() =>
      expect(getComputedStyle(root).position).not.toBe('fixed'),
    );
  },
};
