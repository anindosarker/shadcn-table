import { type ST_ColumnDef, ShadcnTable } from '@/components/ui/shadcn-table';
import { faker } from '@faker-js/faker';
import { type Meta, type StoryContext } from '@storybook/react-vite';
import { expect, waitFor, within } from 'storybook/test';
import { MapIcon, MapPinIcon, PhoneIcon, UserIcon } from 'lucide-react';

const meta: Meta = {
  title: 'Features/Loading Examples',
};

export default meta;

interface Person {
  address: null | string;
  firstName: null | string;
  lastName: null | string;
  phoneNumber: null | string;
  state: null | string;
}

const columns: ST_ColumnDef<Person>[] = [
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
    accessorKey: 'address',
    header: 'Address',
    icon: MapPinIcon,
  },
  {
    accessorKey: 'state',
    header: 'State',
    icon: MapIcon,
  },
  {
    accessorKey: 'phoneNumber',
    header: 'Phone Number',
    icon: PhoneIcon,
  },
];

const data = [...Array(100)].map(() => ({
  address: faker.location.streetAddress(),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  phoneNumber: faker.phone.number(),
  state: faker.location.state(),
}));

const blankData = [...Array(100)].map(() => ({
  address: null,
  firstName: null,
  lastName: null,
  phoneNumber: null,
  state: null,
}));

export const Loading = () => (
  <ShadcnTable columns={columns} data={[]} state={{ isLoading: true }} />
);

export const Loading5 = () => (
  <ShadcnTable
    columns={columns}
    data={[]}
    state={{ isLoading: true, pagination: { pageIndex: 0, pageSize: 5 } }}
  />
);

export const LoadingWithProgressBars = () => (
  <ShadcnTable
    columns={columns}
    data={[]}
    state={{ isLoading: true, showProgressBars: true }}
  />
);

export const LoadingWithProgressBarsNoOverlay = () => (
  <ShadcnTable
    columns={columns}
    data={[]}
    state={{
      isLoading: true,
      showLoadingOverlay: false,
      showProgressBars: true,
    }}
  />
);

export const LoadingWithSomeData = () => (
  <ShadcnTable
    columns={columns}
    data={[...data.slice(0, 5), ...blankData]}
    state={{ isLoading: true }}
  />
);

export const LoadingWithSelection = () => (
  <ShadcnTable
    columns={columns}
    data={[]}
    enableRowSelection
    state={{ isLoading: true }}
  />
);

export const LoadingWithDetailPanelExample = () => (
  <ShadcnTable
    columns={columns}
    data={[]}
    renderDetailPanel={({ row }) => (
      <div style={{ display: 'grid' }}>
        <span>City: {row.original.firstName?.toString()}</span>
        <span>State: {row.original.state}</span>
        <span>Address: {row.original.address}</span>
        <span>Phone: {row.original.phoneNumber}</span>
      </div>
    )}
    state={{ isLoading: true }}
  />
);

export const SkeletonDisplayColumns = () => (
  <ShadcnTable
    columns={columns}
    data={[]}
    enableExpanding
    enableRowActions
    enableRowNumbers
    enableRowSelection
    state={{ showSkeletons: true }}
  />
);

export const ReloadingExample = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    state={{ showProgressBars: true }}
  />
);

export const OnlyTopProgressBar = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    stLinearProgressProps={({ isTopToolbar }) => ({
      progressComponentProps: {
        style: { display: isTopToolbar ? 'block' : 'none' },
      },
    })}
    state={{ showProgressBars: true }}
  />
);

/** While loading with no data, every body cell is a skeleton, ten rows. */
export const SkeletonsWhileLoading = {
  render: () => <Loading />,
  play: async ({ canvasElement }: StoryContext) => {
    await within(canvasElement).findAllByRole('columnheader');
    await waitFor(() =>
      expect(canvasElement.querySelectorAll('tbody tr')).toHaveLength(10),
    );
    const cells = canvasElement.querySelectorAll('tbody td');
    expect(cells).toHaveLength(10 * columns.length);
    for (const cell of cells) {
      expect(cell.querySelector('[data-slot="skeleton"]')).not.toBeNull();
      expect(cell).toHaveTextContent(/^$/);
    }
  },
};

/**
 * `showProgressBars` draws the progress bars in both toolbars while the
 * rows stay visible.
 */
export const ProgressBarShown = {
  render: () => <ReloadingExample />,
  play: async ({ canvasElement }: StoryContext) => {
    const canvas = within(canvasElement);
    await canvas.findAllByText(data[0].firstName);
    await waitFor(() => {
      const bars = canvas.getAllByRole('progressbar');
      expect(bars).toHaveLength(2);
      for (const bar of bars) {
        const box = bar.getBoundingClientRect();
        expect(box.width).toBeGreaterThan(0);
        expect(box.height).toBeGreaterThan(0);
      }
    });
    expect(canvasElement.querySelector('[data-slot="skeleton"]')).toBeNull();
  },
};
