import { useMemo, useState } from 'react';
import { faker } from '@faker-js/faker';
import {
  type ST_ColumnDef,
  type ST_ColumnFiltersState,
  type ST_PaginationState,
  type ST_Row,
  type ST_SortingState,
  ShadcnTable,
  useShadcnTable,
} from '@/components/ui/shadcn-table';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { Spinner } from '@/components/ui/spinner';
import {
  QueryClient,
  QueryClientProvider,
  keepPreviousData,
  useQuery,
} from '@tanstack/react-query';
import { type Meta, type StoryContext } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  CakeIcon,
  HashIcon,
  MapIcon,
  MapPinIcon,
  Minus as MinusIcon,
  PhoneIcon,
  Plus as AddIcon,
  UserIcon,
} from 'lucide-react';

const meta: Meta = {
  title: 'Features/Detail Panel',
};

export default meta;

export const DetailPanelEnabledSemantic = () => (
  <ShadcnTable
    columns={[
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
    ]}
    data={[...Array(5)].map(() => ({
      address: faker.location.streetAddress(),
      city: faker.location.city(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      phone: faker.phone.number(),
      state: faker.location.state(),
      zipCode: faker.location.zipCode(),
    }))}
    renderDetailPanel={({ row }) => (
      <div style={{ display: 'grid' }}>
        <span>City: {row.original.city}</span>
        <span>State: {row.original.state}</span>
        <span>Zip: {row.original.zipCode}</span>
        <span>Phone: {row.original.phone}</span>
      </div>
    )}
  />
);

// Detail-panel rows have no sub rows; the expand buttons must still open them.
DetailPanelEnabledSemantic.play = async ({
  canvas,
  userEvent,
}: StoryContext) => {
  await expect(canvas.queryAllByText(/^City:/)).toHaveLength(0);
  const [firstRowExpand] = await canvas.findAllByRole('button', {
    name: 'Expand',
  });
  await userEvent.click(firstRowExpand);
  await waitFor(() => expect(canvas.getAllByText(/^City:/)).toHaveLength(1));
  await userEvent.click(canvas.getByRole('button', { name: 'Expand all' }));
  await waitFor(() => expect(canvas.getAllByText(/^City:/)).toHaveLength(5));
};

export const DetailPanelEnabledGrid = () => (
  <ShadcnTable
    columns={[
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
    ]}
    data={[...Array(5)].map(() => ({
      address: faker.location.streetAddress(),
      city: faker.location.city(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      phone: faker.phone.number(),
      state: faker.location.state(),
      zipCode: faker.location.zipCode(),
    }))}
    layoutMode="grid"
    renderDetailPanel={({ row }) => (
      <div style={{ display: 'grid' }}>
        <span>City: {row.original.city}</span>
        <span>State: {row.original.state}</span>
        <span>Zip: {row.original.zipCode}</span>
        <span>Phone: {row.original.phone}</span>
      </div>
    )}
  />
);

export const DetailPanelEnabledGridNoGrow = () => (
  <ShadcnTable
    columns={[
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
    ]}
    data={[...Array(5)].map(() => ({
      address: faker.location.streetAddress(),
      city: faker.location.city(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      phone: faker.phone.number(),
      state: faker.location.state(),
      zipCode: faker.location.zipCode(),
    }))}
    layoutMode="grid-no-grow"
    renderDetailPanel={({ row }) => (
      <div style={{ display: 'grid' }}>
        <span>City: {row.original.city}</span>
        <span>State: {row.original.state}</span>
        <span>Zip: {row.original.zipCode}</span>
        <span>Phone: {row.original.phone}</span>
      </div>
    )}
  />
);

export const CustomExpandRotation = () => (
  <ShadcnTable
    columns={[
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
    ]}
    data={[...Array(5)].map(() => ({
      address: faker.location.streetAddress(),
      city: faker.location.city(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      phone: faker.phone.number(),
      state: faker.location.state(),
      zipCode: faker.location.zipCode(),
    }))}
    enableExpandAll={false}
    renderDetailPanel={({ row }) => (
      <div style={{ display: 'grid' }}>
        <span>City: {row.original.city}</span>
        <span>State: {row.original.state}</span>
        <span>Zip: {row.original.zipCode}</span>
        <span>Phone: {row.original.phone}</span>
      </div>
    )}
    stExpandButtonProps={({ row }) => ({
      style: {
        transform: row.getIsExpanded() ? 'rotate(180deg)' : 'rotate(-90deg)',
        transition: 'transform 0.2s',
      },
    })}
  />
);

export const DetailPanelEnabledConditional = () => (
  <ShadcnTable
    columns={[
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
    ]}
    data={[...Array(10)].map(() => ({
      address: faker.location.streetAddress(),
      age: faker.number.int(100) + 5,
      city: faker.location.city(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      phone: faker.phone.number(),
      state: faker.location.state(),
      zipCode: faker.location.zipCode(),
    }))}
    renderDetailPanel={({ row }) =>
      row.original.age > 50 ? (
        <div style={{ display: 'grid' }}>
          <span>City: {row.original.city}</span>
          <span>State: {row.original.state}</span>
          <span>Zip: {row.original.zipCode}</span>
          <span>Phone: {row.original.phone}</span>
        </div>
      ) : undefined
    }
  />
);

export const DetailPanelEnabledConditionalHide = () => (
  <ShadcnTable
    columns={[
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
    ]}
    data={[...Array(10)].map(() => ({
      address: faker.location.streetAddress(),
      age: faker.number.int(100) + 5,
      city: faker.location.city(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      phone: faker.phone.number(),
      state: faker.location.state(),
      zipCode: faker.location.zipCode(),
    }))}
    renderDetailPanel={({ row }) =>
      row.original.age > 50 ? (
        <div style={{ display: 'grid' }}>
          <span>City: {row.original.city}</span>
          <span>State: {row.original.state}</span>
          <span>Zip: {row.original.zipCode}</span>
          <span>Phone: {row.original.phone}</span>
        </div>
      ) : (
        'No details available'
      )
    }
    stExpandButtonProps={({ row }) => ({
      style: {
        display: row.original.age > 50 ? 'flex' : 'none',
      },
    })}
  />
);

export const DetailPanelSingleExpand = () => {
  return (
    <ShadcnTable
      columns={[
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
      ]}
      data={[...Array(5)].map(() => ({
        address: faker.location.streetAddress(),
        city: faker.location.city(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        phone: faker.phone.number(),
        state: faker.location.state(),
        zipCode: faker.location.zipCode(),
      }))}
      renderDetailPanel={({ row }) => (
        <div style={{ display: 'grid' }}>
          <span>City: {row.original.city}</span>
          <span>State: {row.original.state}</span>
          <span>Zip: {row.original.zipCode}</span>
          <span>Phone: {row.original.phone}</span>
        </div>
      )}
      // ST_ExpandButton toggles the row through row.toggleExpanded() before it
      // calls this onClick; the handler only collapses the other rows.
      stExpandButtonProps={({ row, table }) => ({
        onClick: () =>
          table.setExpanded((expanded) =>
            expanded !== true && expanded[row.id] ? { [row.id]: true } : {},
          ),
      })}
    />
  );
};

// One panel open at a time: opening a second row closes the first, and the
// same button closes its own panel.
DetailPanelSingleExpand.play = async ({ canvas, userEvent }: StoryContext) => {
  await expect(canvas.queryAllByText(/^City:/)).toHaveLength(0);
  const expandButtons = await canvas.findAllByRole('button', {
    name: 'Expand',
  });
  await userEvent.click(expandButtons[0]);
  await waitFor(() => expect(canvas.getAllByText(/^City:/)).toHaveLength(1));
  await userEvent.click(expandButtons[1]);
  await waitFor(() => expect(canvas.getAllByText(/^City:/)).toHaveLength(1));
  await waitFor(() =>
    expect(
      canvas.getAllByRole('button', { name: 'Expand' })[1].closest('tr')
        ?.nextElementSibling,
    ).toHaveTextContent(/City:/),
  );
  await userEvent.click(canvas.getAllByRole('button', { name: 'Expand' })[1]);
  await waitFor(() => expect(canvas.queryAllByText(/^City:/)).toHaveLength(0));
};

export const DetailPanelExpandColumnLast = () => (
  <ShadcnTable
    columns={[
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
    ]}
    data={[...Array(5)].map(() => ({
      address: faker.location.streetAddress(),
      city: faker.location.city(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      phone: faker.phone.number(),
      state: faker.location.state(),
      zipCode: faker.location.zipCode(),
    }))}
    displayColumnDefOptions={{
      'st-row-expand': {
        stTableBodyCellProps: {
          align: 'right',
        },
        stTableHeadCellProps: {
          align: 'right',
        },
      },
    }}
    positionExpandColumn="last"
    renderDetailPanel={({ row }) => (
      <div style={{ display: 'grid' }}>
        <span>City: {row.original.city}</span>
        <span>State: {row.original.state}</span>
        <span>Zip: {row.original.zipCode}</span>
        <span>Phone: {row.original.phone}</span>
      </div>
    )}
  />
);

export const DetailPanelExpandedByDefault = () => (
  <ShadcnTable
    columns={[
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
    ]}
    data={[...Array(5)].map(() => ({
      address: faker.location.streetAddress(),
      city: faker.location.city(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      phone: faker.phone.number(),
      state: faker.location.state(),
      zipCode: faker.location.zipCode(),
    }))}
    initialState={{ expanded: true }}
    renderDetailPanel={({ row }) => (
      <div style={{ display: 'grid' }}>
        <span>City: {row.original.city}</span>
        <span>State: {row.original.state}</span>
        <span>Zip: {row.original.zipCode}</span>
        <span>Phone: {row.original.phone}</span>
      </div>
    )}
  />
);

export const DetailPanelExpandAllDisabled = () => (
  <ShadcnTable
    columns={[
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
    ]}
    data={[...Array(5)].map(() => ({
      address: faker.location.streetAddress(),
      city: faker.location.city(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      phone: faker.phone.number(),
      state: faker.location.state(),
      zipCode: faker.location.zipCode(),
    }))}
    enableExpandAll={false}
    renderDetailPanel={({ row }) => (
      <div style={{ display: 'grid' }}>
        <span>City: {row.original.city}</span>
        <span>State: {row.original.state}</span>
        <span>Zip: {row.original.zipCode}</span>
        <span>Phone: {row.original.phone}</span>
      </div>
    )}
  />
);

export const DetailPanelExpandAllDisabledGrid = () => (
  <ShadcnTable
    columns={[
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
    ]}
    data={[...Array(5)].map(() => ({
      address: faker.location.streetAddress(),
      city: faker.location.city(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      phone: faker.phone.number(),
      state: faker.location.state(),
      zipCode: faker.location.zipCode(),
    }))}
    enableExpandAll={false}
    layoutMode="grid"
    renderDetailPanel={({ row }) => (
      <div style={{ display: 'grid' }}>
        <span>City: {row.original.city}</span>
        <span>State: {row.original.state}</span>
        <span>Zip: {row.original.zipCode}</span>
        <span>Phone: {row.original.phone}</span>
      </div>
    )}
  />
);

export const DetailPanelExpandAllDisabledGridNoGrow = () => (
  <ShadcnTable
    columns={[
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
    ]}
    data={[...Array(5)].map(() => ({
      address: faker.location.streetAddress(),
      city: faker.location.city(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      phone: faker.phone.number(),
      state: faker.location.state(),
      zipCode: faker.location.zipCode(),
    }))}
    enableExpandAll={false}
    layoutMode="grid-no-grow"
    renderDetailPanel={({ row }) => (
      <div style={{ display: 'grid' }}>
        <span>City: {row.original.city}</span>
        <span>State: {row.original.state}</span>
        <span>Zip: {row.original.zipCode}</span>
        <span>Phone: {row.original.phone}</span>
      </div>
    )}
  />
);

type Member = {
  address: string;
  city: string;
  firstName: string;
  id: string;
  lastName: string;
};

const members: Member[] = [
  {
    address: '261 Erdman Ford',
    city: 'East Daphne',
    firstName: 'Dylan',
    id: '1',
    lastName: 'Murray',
  },
  {
    address: '769 Dominic Grove',
    city: 'Vancouver',
    firstName: 'Raquel',
    id: '2',
    lastName: 'Kohler',
  },
];

// The detail panel docs example under the grid layout.
const PanelTable = ({ virtual }: { virtual?: boolean }) => (
  <ShadcnTable
    columns={[
      { accessorKey: 'id', header: 'ID', icon: HashIcon, size: 50 },
      { accessorKey: 'firstName', header: 'First Name', icon: UserIcon },
      { accessorKey: 'lastName', header: 'Last Name', icon: UserIcon },
    ]}
    data={members}
    enableRowVirtualization={virtual}
    layoutMode="grid"
    renderDetailPanel={({ row }) => (
      <div className="m-auto grid w-full grid-cols-2">
        <p>Address: {row.original.address}</p>
        <p>City: {row.original.city}</p>
      </div>
    )}
  />
);

// An expanded row shows its panel with height and visible content (F24).
const expectPanelRenders = async ({ canvas, userEvent }: StoryContext) => {
  const [firstRowExpand] = await canvas.findAllByRole('button', {
    name: 'Expand',
  });
  await userEvent.click(firstRowExpand);
  await waitFor(() => {
    const text = canvas.getByText('Address: 261 Erdman Ford');
    const detailRow = text.closest('tr')!;
    expect(detailRow.getBoundingClientRect().height).toBeGreaterThan(0);
    const box = text.getBoundingClientRect();
    expect(box.height).toBeGreaterThan(0);
    expect(box.width).toBeGreaterThan(0);
    expect(text).toBeVisible();
    // Nothing clips the text: the cell and the panel wrapper hold it.
    const cell = text.closest('td')!.getBoundingClientRect();
    expect(box.bottom).toBeLessThanOrEqual(cell.bottom + 0.5);
  });
};

export const PanelRenders = {
  render: () => <PanelTable />,
  play: expectPanelRenders,
};

export const PanelRendersVirtualized = {
  render: () => <PanelTable virtual />,
  play: expectPanelRenders,
};

// The conditional detail panel docs example: a row whose panel is null has a
// disabled expand button, and every other row expands to a panel with height
// (F24).
const conditionalMembers: Member[] = [
  ...members,
  {
    address: '',
    city: 'Lake Edwin',
    firstName: 'Ervin',
    id: '3',
    lastName: 'Reinger',
  },
];

export const ConditionalPanelDisablesEmptyRow = {
  render: () => (
    <ShadcnTable
      columns={[
        { accessorKey: 'id', header: 'ID', icon: HashIcon, size: 50 },
        { accessorKey: 'firstName', header: 'First Name', icon: UserIcon },
        { accessorKey: 'lastName', header: 'Last Name', icon: UserIcon },
      ]}
      data={conditionalMembers}
      layoutMode="grid"
      renderDetailPanel={({ row }) =>
        row.original.address ? (
          <div className="m-auto grid w-full grid-cols-2">
            <p>Address: {row.original.address}</p>
            <p>City: {row.original.city}</p>
          </div>
        ) : null
      }
    />
  ),
  play: async ({ canvas, userEvent }: StoryContext) => {
    const expandButtons = await canvas.findAllByRole('button', {
      name: 'Expand',
    });
    await expect(expandButtons).toHaveLength(3);
    await expect(expandButtons[2]).toBeDisabled();
    for (const [index, member] of members.entries()) {
      await expect(expandButtons[index]).toBeEnabled();
      await userEvent.click(expandButtons[index]);
      await waitFor(() => {
        const text = canvas.getByText(`Address: ${member.address}`);
        expect(
          text.closest('tr')!.getBoundingClientRect().height,
        ).toBeGreaterThan(0);
        expect(text.getBoundingClientRect().height).toBeGreaterThan(0);
      });
    }
    // Expand all opens only the rows that have a panel.
    await userEvent.click(canvas.getByRole('button', { name: 'Expand all' }));
    await expect(canvas.getAllByText(/^Address:/)).toHaveLength(2);
    await expect(
      canvas.getAllByRole('button', { name: 'Expand' })[2],
    ).toBeDisabled();
  },
};

// The exact stories of the docs examples detail-panel, chart-detail-panel and
// lazy-detail-panel: the same columns, options and data.

type PanelPerson = {
  id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
};

const panelPeople: PanelPerson[] = [
  {
    id: '1',
    firstName: 'Dylan',
    middleName: 'Sprouse',
    lastName: 'Murray',
    address: '261 Erdman Ford',
    city: 'East Daphne',
    state: 'Kentucky',
    country: 'United States',
  },
  {
    id: '2',
    firstName: 'Raquel',
    middleName: 'Hakeem',
    lastName: 'Kohler',
    address: '769 Dominic Grove',
    city: 'Vancouver',
    state: 'British Columbia',
    country: 'Canada',
  },
  {
    id: '3',
    firstName: 'Ervin',
    middleName: 'Kris',
    lastName: 'Reinger',
  },
  {
    id: '4',
    firstName: 'Brittany',
    middleName: 'Kathryn',
    lastName: 'McCullough',
    address: '722 Emie Stream',
    city: 'Lincoln',
    state: 'Nebraska',
    country: 'United States',
  },
  {
    id: '5',
    firstName: 'Branson',
    middleName: 'John',
    lastName: 'Frami',
  },
];

const panelPeopleColumns: ST_ColumnDef<PanelPerson>[] = [
  {
    accessorKey: 'id',
    icon: HashIcon,
    header: 'ID',
    size: 110,
  },
  {
    accessorKey: 'firstName',
    icon: UserIcon,
    header: 'First Name',
  },
  {
    accessorKey: 'middleName',
    icon: UserIcon,
    header: 'Middle Name',
  },
  {
    accessorKey: 'lastName',
    icon: UserIcon,
    header: 'Last Name',
  },
];

/** The expand button of the row whose ID cell reads `id`. */
const expandButtonOf = (canvasElement: HTMLElement, id: string) =>
  within(
    [...canvasElement.querySelectorAll<HTMLElement>('tbody tr')].find(
      (tr) =>
        tr.querySelector('td[data-flip-column="id"]')?.textContent?.trim() ===
        id,
    )!,
  ).getByRole('button', { name: 'Expand' });

/** The docs example detail-panel: one panel open at a time, some rows none. */
export const DetailPanel = {
  render: function DetailPanelStory() {
    const table = useShadcnTable({
      columns: panelPeopleColumns,
      data: panelPeople,
      enableExpandAll: false, //disable expand all button
      stDetailPanelProps: () => ({
        className: 'bg-black/10 dark:bg-[rgba(255,210,244,0.1)]',
      }),
      //custom expand button rotation
      stExpandButtonProps: ({ row, table }) => {
        const isExpanded = row.getIsExpanded(); //read at render: the button toggles the row before this onClick runs
        return {
          onClick: () => table.setExpanded({ [row.id]: !isExpanded }), //only 1 detail panel open at a time
          style: {
            transform: isExpanded ? 'rotate(180deg)' : 'rotate(-90deg)',
            transition: 'transform 0.2s',
          },
        };
      },
      //conditionally render detail panel
      renderDetailPanel: ({ row }) =>
        row.original.address ? (
          <div className="m-auto grid w-full grid-cols-2">
            <p>Address: {row.original.address}</p>
            <p>City: {row.original.city}</p>
            <p>State: {row.original.state}</p>
            <p>Country: {row.original.country}</p>
          </div>
        ) : null,
    });

    return <ShadcnTable table={table} />;
  },
  play: async ({ canvasElement }: StoryContext) => {
    const canvas = within(canvasElement);
    await canvas.findByText('Dylan');
    expect(canvas.queryByRole('button', { name: 'Expand all' })).toBeNull();
    await userEvent.click(expandButtonOf(canvasElement, '1'));
    await canvas.findByText('Address: 261 Erdman Ford');
    // Opening row 2 closes row 1's panel.
    await userEvent.click(expandButtonOf(canvasElement, '2'));
    await canvas.findByText('Address: 769 Dominic Grove');
    await waitFor(() =>
      expect(canvas.queryByText('Address: 261 Erdman Ford')).toBeNull(),
    );
    await userEvent.click(expandButtonOf(canvasElement, '2'));
    await waitFor(() =>
      expect(canvas.queryByText('Address: 769 Dominic Grove')).toBeNull(),
    );
    // Rows 3 and 5 have no address, so no panel.
    expect(expandButtonOf(canvasElement, '3')).toBeDisabled();
    expect(expandButtonOf(canvasElement, '5')).toBeDisabled();
  },
};

type ChartPerson = {
  id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  points: number[];
  assists: number[];
  turnovers: number[];
  gamesPlayed: number[];
};

//seeded so that server and client render the same numbers
const createRandom = (seed: number) => {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const random = createRandom(4201);

const randomNumbers = (num: number, multiplier: number = 1) => {
  const points: number[] = [];
  for (let i = 0; i < num; i++) {
    points.push(Math.floor(random() * 30 * multiplier + i * multiplier));
  }
  return points;
};

const chartPeople: ChartPerson[] = [
  {
    id: '1',
    firstName: 'Dylan',
    middleName: 'Sprouse',
    lastName: 'Murray',
    points: randomNumbers(10),
    assists: randomNumbers(10, 0.6),
    turnovers: randomNumbers(10, 0.2),
    gamesPlayed: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  },
  {
    id: '2',
    firstName: 'Raquel',
    middleName: 'Hakeem',
    lastName: 'Kohler',
    points: randomNumbers(6),
    assists: randomNumbers(6, 0.4),
    turnovers: randomNumbers(6, 0.2),
    gamesPlayed: [1, 2, 3, 4, 5, 9],
  },
  {
    id: '3',
    firstName: 'Ervin',
    middleName: 'Kris',
    lastName: 'Reinger',
    points: randomNumbers(13),
    assists: randomNumbers(13, 0.2),
    turnovers: randomNumbers(13, 0.1),
    gamesPlayed: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 13, 14],
  },
  {
    id: '4',
    firstName: 'Brittany',
    middleName: 'Kathryn',
    lastName: 'McCullough',
    points: randomNumbers(10),
    assists: randomNumbers(10, 0.5),
    turnovers: randomNumbers(10, 0.3),
    gamesPlayed: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  },
  {
    id: '5',
    firstName: 'Branson',
    middleName: 'John',
    lastName: 'Frami',
    points: randomNumbers(3),
    assists: randomNumbers(3, 1.2),
    turnovers: randomNumbers(3, 0.5),
    gamesPlayed: [4, 8, 9],
  },
];

const chartPeopleColumns: ST_ColumnDef<ChartPerson>[] = [
  {
    accessorKey: 'id',
    icon: HashIcon,
    header: 'ID',
    size: 110,
  },
  {
    accessorKey: 'firstName',
    icon: UserIcon,
    header: 'First Name',
  },
  {
    accessorKey: 'middleName',
    icon: UserIcon,
    header: 'Middle Name',
  },
  {
    accessorKey: 'lastName',
    icon: UserIcon,
    header: 'Last Name',
  },
];

/** The docs example chart-detail-panel: a chart of each player's games. */
export const ChartDetailPanel = {
  render: function ChartDetailPanelStory() {
    const table = useShadcnTable({
      columns: chartPeopleColumns,
      data: chartPeople,
      initialState: { expanded: { 0: true } },
      stTableBodyRowProps: ({ isDetailPanel }) => ({
        className: isDetailPanel ? 'bg-gray-100 dark:bg-gray-900' : undefined,
      }),
      renderDetailPanel: ({ row }) => (
        <ResponsiveContainer width="100%" height={250}>
          <LineChart
            data={row.original.gamesPlayed.map((game, index) => ({
              game,
              Points: row.original.points[index],
              Assists: row.original.assists[index],
              Turnovers: row.original.turnovers[index],
            }))}
          >
            <XAxis
              dataKey="game"
              label={{ value: 'Games Played', position: 'insideBottom' }}
              tickFormatter={(value) => `#${value}`}
            />
            <YAxis domain={[0, 60]} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="Points"
              stroke="var(--primary)"
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="Assists"
              stroke="var(--secondary-foreground)"
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="Turnovers"
              stroke="var(--destructive)"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      ),
    });

    return <ShadcnTable table={table} />;
  },
  play: async ({ canvasElement }: StoryContext) => {
    // Row 1 starts expanded: its panel draws the recharts chart, one line per
    // stat. Expanding row 2 draws a second chart.
    const surfaces = () =>
      canvasElement.querySelectorAll('tbody svg.recharts-surface');
    await waitFor(() => expect(surfaces()).toHaveLength(1));
    await waitFor(() =>
      expect(
        surfaces()[0]!.querySelectorAll('.recharts-line-curve'),
      ).toHaveLength(3),
    );
    await userEvent.click(expandButtonOf(canvasElement, '2'));
    await waitFor(() => expect(surfaces()).toHaveLength(2));
  },
};

//Your API response shape will probably be different. Knowing a total row count is important though.
type UserApiResponse = {
  data: Array<ServerUser>;
  meta: {
    totalRowCount: number;
  };
};

type ServerUser = {
  firstName: string;
  lastName: string;
  address: string;
  state: string;
  phoneNumber: string;
  lastLogin: Date;
};

type FullUserInfo = ServerUser & {
  favoriteMusic: string;
  favoriteSong: string;
  quote: string;
};

/**
 * The rows the docs app's `/api/data` and `/api/moredata` serve: first name,
 * last name, address, state, phone number, last login, favourite music,
 * favourite song, quote, joined by `|` on one line per user. The story
 * answers from them as those routes do.
 */
const serverUserRows: string[] = [
  'Hermann|Gusikowski|6099 Douglas Creek|Georgia|421.698.9405|2023-08-16T03:21:08.244Z|Blues|Tom Dooley|If we transmit the application, we can get to the PNG driver through the auxiliary SMS port!',
  'Milford|Torp|410 Vicenta Radial|Alabama|805-728-7771 x75361|2023-05-15T02:45:50.684Z|Funk|Another Brick in the Wall (part 2)|The AGP hard drive is down, generate the online port so we can generate the TCP program!',
  "Alda|Koss|1604 Bernardo Flats|Louisiana|860.628.3618|2022-02-26T03:23:25.877Z|Metal|Doo Wop (That Thing)|overriding the bandwidth won't do anything, we need to input the back-end JBOD system!",
  "Eulah|Lockman|7072 D'Amore Shoal|Tennessee|1-394-293-7730 x512|2019-03-31T17:53:49.187Z|Country|Over There|Use the bluetooth SQL sensor, then you can program the mobile interface!",
  'Justen|Hilpert|386 Murray Walks|North Carolina|507.430.8224 x561|2023-10-02T19:50:58.197Z|Classical|Maniac|Use the auxiliary PNG matrix, then you can calculate the neural transmitter!',
  "Vergie|Beatty|6864 Mann Haven|Maryland|1-538-794-7917|2023-06-14T00:27:49.332Z|Country|You Sexy Thing|bypassing the card won't do anything, we need to hack the 1080p ASCII panel!",
  "Hosea|Herzog|95688 Ada Walk|Alabama|1-330-864-0222 x01172|2022-08-31T20:33:28.574Z|Soul|Dance to the Music|I'll synthesize the cross-platform ADP card, that should sensor the USB firewall!",
  "Dillan|Effertz|94317 Hahn Causeway|New York|660-433-6667|2020-12-02T02:03:50.082Z|Funk|Lookin' Out My Back Door|indexing the microchip won't do anything, we need to copy the digital GB driver!",
  "Ambrose|Considine|365 Fatima Cape|Washington|(628) 694-0650|2022-11-29T11:26:09.395Z|Soul|I Love Rock 'n' Roll|You can't navigate the card without indexing the haptic HEX array!",
  'Domenick|Runte|07821 Boyle Mountain|New York|444-660-8840|2021-06-23T02:44:17.754Z|Reggae|The Letter|The UDP program is down, navigate the open-source pixel so we can calculate the SMTP panel!',
  'Izaiah|Renner|286 Kuphal Circles|Wyoming|(350) 379-3779 x15509|2020-08-23T00:06:00.466Z|Non Music|Like a Rolling Stone|Try to reboot the DNS circuit, maybe it will back up the cross-platform pixel!',
  "Ricardo|Ziemann|66351 Ethan Light|Minnesota|(939) 926-9074|2021-08-01T09:45:40.069Z|Latin|Papa's Got a Brand New Bag|If we connect the application, we can get to the USB array through the digital HTTP microchip!",
  'Clement|Cronin|60065 Chris Knoll|Nebraska|(981) 319-5150 x92726|2022-04-05T21:20:30.512Z|Rap|Need You Tonight|If we bypass the bus, we can get to the UTF8 driver through the open-source GB bus!',
  'Bobby|Schuster|555 Mann Trace|Arizona|432-605-5021|2020-07-23T16:01:04.026Z|Rock|Frenesi|Use the bluetooth HEX driver, then you can hack the redundant array!',
  "Alfreda|Sporer|068 Nader Mountain|New Hampshire|940-724-6142|2021-02-03T14:18:32.112Z|Metal|Need You Now|bypassing the protocol won't do anything, we need to copy the virtual IB port!",
  "Gussie|Walter|58461 Pat Grove|Alabama|520-922-7671|2022-02-28T16:51:11.235Z|Reggae|Pistol Packin' Mama|The SDD alarm is down, bypass the digital interface so we can copy the JSON card!",
  "Javier|Douglas|162 Pacocha Ranch|New York|(370) 993-8299|2021-07-24T02:38:50.640Z|World|What Goes Around Comes Around|You can't generate the system without bypassing the primary XSS firewall!",
  'Sydney|Armstrong|725 Stracke Landing|Mississippi|910.942.8141|2019-09-18T01:17:49.184Z|Country|Weak|If we index the sensor, we can get to the AGP capacitor through the online VGA capacitor!',
  'Justine|Langworth|772 Casimer Shoal|South Dakota|(350) 810-1145|2020-08-03T16:43:41.496Z|Rock|Mood Indigo|Try to calculate the TCP monitor, maybe it will transmit the auxiliary card!',
  "Anabel|Leannon|51230 Dewayne Camp|Kansas|1-888-752-3953|2020-06-11T11:33:12.595Z|Country|We Are Family|I'll quantify the online DRAM protocol, that should panel the GB capacitor!",
  'Ally|Goodwin|707 Howe Mountains|West Virginia|1-786-215-5832 x4409|2020-09-03T17:43:12.049Z|Metal|You Make Me Feel Brand New|Try to quantify the CSS interface, maybe it will synthesize the wireless capacitor!',
  'Tianna|Lang|200 Labadie Vista|Montana|697-639-3479 x6460|2020-05-22T10:32:45.323Z|Rock|Sweet Georgia Brown|Use the digital SQL port, then you can transmit the virtual microchip!',
  "Noemi|Marquardt|8239 Paucek Prairie|North Carolina|1-677-610-6588|2021-01-24T03:05:56.525Z|Pop|You're So Vain|We need to synthesize the open-source FTP circuit!",
  "Leonardo|Sawayn|12643 Howell Locks|Missouri|283-273-3920 x41098|2024-01-07T23:27:43.979Z|Rock|Layla|overriding the bandwidth won't do anything, we need to back up the bluetooth HTTP pixel!",
  "Melany|Corkery|333 Upton Manor|Arkansas|(826) 688-1496 x638|2019-12-25T23:24:07.344Z|Jazz|Papa's Got a Brand New Bag|You can't reboot the array without quantifying the redundant AI feed!",
  "Terence|McLaughlin|3742 Araceli Estate|Arkansas|(212) 956-0631|2022-02-02T00:15:28.863Z|Reggae|Keep On Loving You|compressing the hard drive won't do anything, we need to navigate the primary HTTP card!",
  "Jaime|Block|4862 Estelle Hill|Georgia|897-843-3047 x0425|2019-08-26T10:44:40.364Z|Soul|Jessie's Girl|We need to copy the online COM pixel!",
  'Bernita|Hagenes|53797 Hirthe Hills|Pennsylvania|814.285.1779 x462|2021-05-10T03:42:34.504Z|Latin|Give Me Everything|If we hack the hard drive, we can get to the RSS array through the back-end CSS alarm!',
  "Friedrich|Bergstrom|90573 Kihn Parkway|Louisiana|1-869-704-2983|2020-01-07T12:18:19.912Z|Pop|If (They Made Me a King)|programming the port won't do anything, we need to calculate the open-source ASCII card!",
  'Sarina|Gislason|00854 Doyle Road|Idaho|(683) 305-5712|2022-08-23T10:17:52.549Z|Jazz|Paperback Writer|Try to quantify the GB capacitor, maybe it will calculate the 1080p matrix!',
  'Florian|Marks|46979 Padberg Divide|Mississippi|(463) 238-4575 x226|2020-11-25T16:12:32.048Z|Rock|Paper Planes|The ASCII matrix is down, connect the multi-byte array so we can parse the XML pixel!',
  'Clare|Carter|979 Berge Isle|New Mexico|895-659-5983|2019-04-25T19:26:45.034Z|Blues|Hungry Heart|Use the mobile SAS panel, then you can calculate the 1080p circuit!',
  "Mariam|Fritsch|246 Tara Mews|Arkansas|1-851-297-9371 x2937|2021-01-26T23:59:59.607Z|Funk|I've Heard That Song Before|You can't parse the monitor without copying the 1080p SMS system!",
  "Jamel|Balistreri|1702 Reinhold Crossroad|New York|382.405.3098|2020-11-15T05:12:40.001Z|Non Music|Don't Be Cruel|Use the wireless SSL bandwidth, then you can copy the solid state bandwidth!",
  'Alexie|Blanda|899 Mayer Forge|Ohio|1-213-660-5875 x311|2023-12-17T18:45:13.644Z|Latin|Stairway to Heaven|If we reboot the capacitor, we can get to the HTTP transmitter through the primary RSS system!',
  "Cecilia|Kirlin|887 Legros Forest|Texas|(463) 229-3940 x7543|2019-12-18T20:31:16.179Z|Soul|I Still Haven't Found What I'm Looking For|compressing the matrix won't do anything, we need to quantify the cross-platform HEX pixel!",
  'Retta|Gaylord|22556 Johathan Inlet|Nebraska|1-618-666-7937|2019-12-16T15:12:19.121Z|Reggae|Pony Time|Try to compress the CLI pixel, maybe it will input the haptic feed!',
  'Damon|Conroy|5891 Darius Ways|Kentucky|723.651.0869 x86999|2023-12-13T09:31:21.951Z|Folk|Coming Up|Use the auxiliary JBOD alarm, then you can generate the auxiliary pixel!',
  'Jerrod|Roberts|97199 Narciso Mountain|Wyoming|1-662-481-8607|2023-08-07T15:45:36.979Z|Reggae|Boulevard of Broken Dreams|We need to reboot the neural IB card!',
  "Otilia|Schamberger|02131 Juvenal Squares|West Virginia|1-900-962-9499|2019-09-24T11:47:38.258Z|Stage And Screen|Hey Paula|You can't transmit the driver without generating the bluetooth RSS alarm!",
  "Madilyn|Ratke|2287 Howell Ways|West Virginia|1-241-356-6434|2021-12-18T02:54:18.617Z|Classical|Puttin' on the Ritz|indexing the interface won't do anything, we need to input the optical SMS matrix!",
  'Merritt|Tillman|6906 Ahmed Vista|Wyoming|(830) 387-9321|2021-04-12T19:29:16.634Z|World|(Let Me Be Your) Teddy Bear|The GB card is down, navigate the virtual panel so we can hack the AI sensor!',
  "Lenna|Kilback|7565 Dicki Mountains|Montana|(437) 317-0476 x9463|2021-08-20T03:12:29.217Z|Metal|Viva La Vida|copying the feed won't do anything, we need to calculate the auxiliary PNG sensor!",
  'Justice|Wisozk|632 Ahmed Camp|Pennsylvania|1-594-770-7724 x090|2020-07-29T06:29:11.647Z|Stage And Screen|Save the Last Dance For Me|We need to compress the open-source IP application!',
  "Laurianne|Ledner|76981 Spencer Walks|Oklahoma|(685) 701-3169|2023-03-22T17:41:44.981Z|Pop|Don't Let the Stars Get in Your Eyes|I'll hack the digital VGA transmitter, that should bus the RSS capacitor!",
  "Mossie|Prosacco|9713 Mante Isle|Delaware|(231) 851-7102|2020-04-04T18:48:32.147Z|Stage And Screen|Walk Don't Run|Use the optical SSL microchip, then you can generate the open-source card!",
  "Faye|Bashirian|01586 Stamm Harbors|Alaska|769-497-8752|2020-04-26T03:43:26.581Z|Funk|Makin' Whoopee|Use the open-source THX program, then you can reboot the primary panel!",
  "Myra|Jenkins|201 Schowalter Plaza|Maryland|(569) 376-4319 x92789|2022-08-10T15:03:00.847Z|Classical|American Woman|backing up the bandwidth won't do anything, we need to reboot the digital ASCII monitor!",
  'Wyatt|Macejkovic|6808 Miracle Isle|Nebraska|328.615.4206|2021-08-26T11:32:17.150Z|Classical|When You Wish Upon a Star|Try to override the AI program, maybe it will calculate the bluetooth panel!',
  'Kamren|Blanda|1674 Mueller Pass|Idaho|1-907-688-9197|2023-03-27T01:40:33.020Z|Pop|Every Breath You Take|Use the optical ADP hard drive, then you can bypass the open-source capacitor!',
  'Earl|Fadel|692 Erdman Lock|Missouri|(738) 457-8668|2019-11-24T21:49:57.663Z|Hip Hop|Feel Like Making Love|We need to compress the auxiliary PCI alarm!',
  'Floyd|Quitzon|4501 Bernhard Trafficway|Wyoming|345-252-3993 x137|2020-04-28T04:01:49.595Z|Stage And Screen|Your Song|If we program the protocol, we can get to the ADP alarm through the virtual PCI circuit!',
  'Verlie|Blick|448 Mandy Stream|Iowa|851.213.1056 x05869|2021-08-19T22:36:17.240Z|Stage And Screen|Fast Car|Try to reboot the JSON hard drive, maybe it will reboot the online protocol!',
  'Boyd|Lehner|1745 Patricia Trail|Georgia|1-823-463-7983|2021-05-20T10:03:37.877Z|Jazz|Whatcha Say|Use the online HDD port, then you can compress the redundant circuit!',
  'Vaughn|Altenwerth|86164 Stamm Trail|Rhode Island|387.658.0455|2020-03-27T20:24:35.946Z|Blues|I Got You (I Feel Good)|The SAS capacitor is down, synthesize the mobile monitor so we can parse the SDD sensor!',
  "Dion|Dicki|906 Hoeger Circles|Tennessee|(620) 402-0926 x2534|2019-12-31T16:23:51.835Z|Folk|Don't You (Forget About Me)|Try to parse the VGA sensor, maybe it will synthesize the haptic application!",
  "Maxwell|Turcotte|14101 Emard Terrace|Oklahoma|1-982-446-5308 x464|2021-12-25T15:41:17.325Z|World|Dilemma|backing up the alarm won't do anything, we need to input the back-end PCI microchip!",
  "Clarabelle|Johnston|5691 Rogahn Junctions|New York|1-355-926-0460|2021-03-09T19:47:09.723Z|Stage And Screen|So Much in Love|generating the array won't do anything, we need to override the redundant DRAM bus!",
  "Jace|Yost|826 Martin Flats|Delaware|(506) 572-8522 x174|2019-06-05T00:26:57.560Z|Funk|Physical|indexing the pixel won't do anything, we need to calculate the primary ADP monitor!",
  'Justice|Bartoletti|13767 Nicole Trace|Rhode Island|958-391-0473 x05450|2022-11-23T22:18:26.108Z|Reggae|Hanging by a Moment|Use the 1080p GB system, then you can hack the back-end bandwidth!',
  'Rodrigo|Kozey|48814 Kilback Overpass|Alaska|1-256-284-6866|2021-11-08T10:59:59.332Z|Latin|Runaway|If we program the hard drive, we can get to the THX card through the open-source THX hard drive!',
  'Jaida|Barrows|52318 Fay Knoll|Maryland|975.822.1015|2019-06-28T05:06:13.564Z|Stage And Screen|Harbour Lights|We need to transmit the digital SDD firewall!',
  "Kayleigh|O'Connell|178 Fermin Fall|New Mexico|1-602-265-9742 x208|2021-01-05T16:53:36.245Z|Rock|Stars & Stripes Forever|Try to hack the GB monitor, maybe it will copy the open-source sensor!",
  'Sibyl|Beahan|841 Nat Mills|Maine|1-998-680-4926|2019-06-08T13:39:38.657Z|Blues|Poker Face|If we input the hard drive, we can get to the SMS bandwidth through the digital HDD system!',
  'Amir|Kreiger|811 Geovanni Green|Maryland|948-816-0748|2023-08-29T10:43:52.528Z|Rock|Smoke Gets in Your Eyes|The JBOD feed is down, bypass the wireless port so we can index the USB bandwidth!',
  'Freddie|Pouros|69596 Ritchie Highway|Texas|685.639.8084|2021-10-10T09:51:56.099Z|Reggae|Just Dance|We need to generate the bluetooth SAS protocol!',
  'Luther|Weissnat|21870 Doyle Plains|Oklahoma|906.646.5001 x5485|2019-08-14T03:03:57.645Z|Latin|She Loves You|Use the multi-byte ASCII matrix, then you can index the auxiliary circuit!',
  'Jazlyn|Tromp|02223 Gerhold Lodge|Texas|620.609.8021|2023-05-17T21:46:29.440Z|Classical|Kiss|The SAS hard drive is down, hack the solid state sensor so we can reboot the API alarm!',
  "Monroe|Gulgowski|6507 Steuber Pass|Pennsylvania|(566) 588-6599 x811|2020-10-09T00:23:59.023Z|Latin|I Will Always Love You|backing up the capacitor won't do anything, we need to copy the 1080p ADP alarm!",
  'Braeden|Okuneva|89598 Kshlerin Road|New Jersey|291-598-8359|2019-01-05T00:28:30.113Z|Rap|Battle of New Orleans|The SSD sensor is down, hack the redundant monitor so we can input the TCP driver!',
  "Teagan|Gerhold|205 Buster Plaza|Iowa|1-871-232-7926|2022-12-20T01:35:10.978Z|Jazz|Roll Over Beethoven|copying the panel won't do anything, we need to parse the cross-platform RSS circuit!",
  "Helga|Franey|56005 Kulas Harbor|Vermont|453-807-6073|2022-08-13T04:20:28.462Z|Rock|Brand New Key|I'll synthesize the redundant HEX matrix, that should panel the PCI feed!",
  'Roma|Klein|65176 Nola Vista|New Mexico|767-945-8529 x8275|2021-06-11T14:12:40.224Z|Latin|Love Letters in the Sand|Try to navigate the TLS transmitter, maybe it will calculate the multi-byte matrix!',
  'Marquise|Cummerata|398 Theresia View|Louisiana|1-525-342-0154 x170|2023-09-26T08:53:24.365Z|World|On the Atchison|Use the wireless TCP transmitter, then you can navigate the multi-byte interface!',
  'Jed|Hayes|63640 Donnelly Rue|Hawaii|(280) 208-8411 x15197|2021-04-12T05:18:09.607Z|World|Come Together|We need to hack the primary RSS card!',
  'Caleb|Mante|845 Franecki Terrace|Rhode Island|1-807-393-4906|2020-07-11T17:54:22.591Z|Country|Daydream Believer|Use the solid state XML matrix, then you can synthesize the primary feed!',
  'Cameron|Brakus|203 Cormier Hill|Tennessee|580-437-1892|2022-08-21T13:44:53.414Z|Hip Hop|Stand By Me|The SAS interface is down, connect the mobile array so we can index the TCP bus!',
  'Allie|Feeney|293 Larson Rest|New York|936-527-7160|2023-10-16T00:11:07.240Z|Non Music|Wannabe|If we program the monitor, we can get to the ASCII hard drive through the open-source THX panel!',
  "Shanon|Oberbrunner|03724 Ocie Avenue|Mississippi|915-519-4900 x055|2021-03-06T06:20:32.593Z|Electronic|People|I'll back up the online HEX driver, that should monitor the CLI application!",
  'Lauriane|Connelly|258 Torp Loaf|New York|752.333.1992|2020-08-08T23:06:09.102Z|Metal|Hound Dog|If we calculate the alarm, we can get to the CSS bandwidth through the solid state OCR card!',
  "Jolie|Pacocha|574 Lueilwitz Forge|Georgia|1-255-312-1232|2021-05-12T22:06:07.014Z|Jazz|You Belong to Me|You can't transmit the panel without quantifying the multi-byte XML interface!",
  'Darwin|Schinner|6641 Jerde Divide|Pennsylvania|(449) 752-5371|2020-12-06T15:03:06.356Z|Latin|Hey There Delilah|Use the open-source JBOD transmitter, then you can transmit the optical protocol!',
  "Estefania|Quigley|0226 Ali Expressway|Oregon|518-499-6231|2022-09-21T11:06:57.598Z|World|You're Beautiful|synthesizing the capacitor won't do anything, we need to reboot the digital HEX port!",
  "Raymundo|Treutel|228 Kuhlman Freeway|Tennessee|974.936.1957 x70558|2022-11-16T23:36:51.178Z|Reggae|Wild Wild West|You can't connect the protocol without bypassing the auxiliary SAS firewall!",
  'Deangelo|Blick|029 Violette Station|Missouri|(741) 405-3853|2019-08-04T11:02:15.375Z|Electronic|Over the Rainbow|Try to override the PNG feed, maybe it will parse the optical pixel!',
  "Sarah|Labadie|503 Leopoldo Cove|Colorado|204.745.5814 x54620|2020-08-12T14:44:21.596Z|Rap|The Girl From Ipanema|connecting the transmitter won't do anything, we need to program the bluetooth SQL circuit!",
  "Cordell|Dicki|849 Malvina Mount|Oklahoma|424-610-2775 x56165|2021-07-18T17:33:23.297Z|Electronic|Me & Mrs Jones|I'll quantify the 1080p SSD port, that should transmitter the GB monitor!",
  'Ibrahim|Torphy|566 Aleen Ramp|New Mexico|1-500-693-0802 x4695|2019-12-12T14:01:04.034Z|World|Mr Tambourine Man|We need to index the neural OCR bus!',
  'Nella|Gerlach|2281 Leffler Village|Kentucky|659-865-3149 x82226|2020-03-08T00:31:00.960Z|Rap|Louie Louie|Try to synthesize the DNS firewall, maybe it will connect the back-end panel!',
  'Madalyn|Wintheiser|575 Wintheiser Common|West Virginia|349.669.3708 x7744|2023-06-03T12:51:49.671Z|Rap|Crying|Try to index the USB alarm, maybe it will transmit the multi-byte firewall!',
  'Heidi|Krajcik|38559 Hailie Grove|Washington|1-559-717-2720 x558|2019-11-18T16:20:03.743Z|Classical|The Tracks of My Tears|Try to transmit the TLS capacitor, maybe it will bypass the solid state feed!',
  'Veronica|Flatley|08269 Rowe Hill|Utah|1-941-655-9866 x6133|2023-08-09T19:27:31.695Z|Latin|Ballad of the Green Berets|The HEX matrix is down, index the optical circuit so we can override the PCI driver!',
  "Kimberly|O'Connell|14894 Ashlynn Lock|Rhode Island|1-484-949-4663|2020-08-30T02:13:55.811Z|Country|Yellow Rose of Texas|Try to input the PCI microchip, maybe it will calculate the multi-byte alarm!",
  'Jannie|Douglas|74809 Mraz Trail|Oregon|461.287.3248 x66090|2022-03-11T12:54:17.939Z|Non Music|That Old Black Magic|Try to override the ASCII circuit, maybe it will hack the online card!',
  "Zoila|Connelly|3840 Abel Manor|Wisconsin|(720) 486-1238 x539|2022-08-16T08:11:12.571Z|Jazz|Don't Speak|Try to parse the UTF8 interface, maybe it will index the redundant monitor!",
  'Dino|Nader|96105 Clarissa Spring|Texas|1-690-682-5517 x506|2019-05-20T00:39:18.123Z|Rock|Some of These Days|Use the multi-byte SSL capacitor, then you can parse the online microchip!',
  'Jarrell|Klein|28102 Vada Forks|Rhode Island|818.967.4980|2023-12-06T06:23:48.908Z|Funk|Tennessee Waltz|Try to transmit the TCP bus, maybe it will back up the multi-byte bandwidth!',
  'Curt|Stamm|4438 Lina Rest|New Jersey|506-312-7423 x470|2019-09-22T07:07:13.980Z|Rock|Funkytown|We need to connect the back-end VGA system!',
  "Lela|Goodwin|84052 Gusikowski Canyon|Iowa|1-995-348-0625|2023-04-19T00:05:14.671Z|Latin|Lady Marmalade (Voulez-Vous Coucher Aver Moi Ce Soir?)|copying the microchip won't do anything, we need to parse the wireless API bandwidth!",
  "Elyse|Wuckert|47743 Lamar Alley|Illinois|986-502-6816|2022-12-23T11:31:23.092Z|World|Cathy's Clown|If we navigate the transmitter, we can get to the SSD transmitter through the back-end TCP pixel!",
  "Marlen|Franey|518 Kovacek Trail|Alabama|(466) 519-5017|2021-08-20T19:52:39.622Z|Latin|A Tree in the Meadow|You can't generate the interface without synthesizing the digital JSON system!",
  "Laury|Corkery|77904 Victoria Pine|Texas|874.428.1541|2022-12-14T10:28:38.718Z|Blues|Drop it Like It's Hot|If we generate the port, we can get to the SCSI capacitor through the optical SSL port!",
  "Lincoln|Weissnat|5898 Rolfson Cliff|Washington|1-452-236-9645|2023-02-13T19:13:37.166Z|Latin|Boom Boom Pow|bypassing the monitor won't do anything, we need to reboot the wireless RAM feed!",
  'Nadia|Bernier|78167 Windler Oval|Arkansas|517-783-7505|2019-09-07T11:35:07.447Z|Folk|Stuck On You|Try to reboot the UTF8 monitor, maybe it will connect the online alarm!',
  'Malcolm|Dach|98782 Carroll Flats|Pennsylvania|610-374-0184 x8266|2022-08-21T22:52:11.519Z|Soul|Hold On|The XSS pixel is down, copy the open-source alarm so we can program the DRAM panel!',
  "Maiya|Feeney|7803 Ortiz Shore|Nebraska|1-459-985-0817 x152|2022-02-26T12:59:05.481Z|Blues|Roll With It|You can't copy the port without connecting the optical SMS matrix!",
  'Hal|Cronin|914 Hellen Coves|Massachusetts|276.609.6039|2022-12-05T16:57:41.905Z|Reggae|Bohemian Rhapsody|Use the auxiliary SSD firewall, then you can quantify the digital port!',
  'Buster|Jacobs|3974 Kassandra Prairie|Montana|(678) 685-1364 x02125|2019-02-10T09:02:18.513Z|Latin|Promiscuous|Try to index the TLS card, maybe it will back up the digital sensor!',
  "Garland|Okuneva|7066 Catalina Prairie|Rhode Island|336-881-0669 x031|2020-03-13T23:40:23.980Z|Blues|Because You Loved Me|You can't override the matrix without copying the multi-byte TLS interface!",
  "Damon|Ullrich|534 O'Conner Falls|Louisiana|1-377-497-8909|2023-04-21T17:29:35.793Z|Funk|Light My Fire|Use the haptic IB feed, then you can program the neural capacitor!",
  'Jordon|Steuber|3997 Olson Lights|West Virginia|(834) 340-5699|2023-08-04T00:00:21.723Z|Folk|Wind Beneath My Wings|Try to copy the UTF8 capacitor, maybe it will navigate the solid state matrix!',
  "Amparo|Volkman|434 Shaun Mill|Michigan|1-389-763-1458|2019-10-08T06:38:17.524Z|Country|Hello Dolly|I'll navigate the digital SSL driver, that should interface the CSS application!",
  "Brooklyn|Zemlak|715 Schamberger Plain|California|827.857.7624 x2547|2021-08-26T12:45:44.561Z|Hip Hop|Tie a Yellow Ribbon 'round the Old Oak Tree|We need to index the online HDD firewall!",
  "Carlos|Turner|8309 Verlie Mount|Connecticut|479.618.0627 x01411|2019-10-27T16:08:51.478Z|Latin|Georgy Girl|generating the protocol won't do anything, we need to synthesize the back-end AGP bus!",
  "Jay|Gaylord|19697 Stewart Unions|Michigan|814.990.2558 x9948|2021-02-05T09:38:15.983Z|Classical|Help!|I'll index the solid state SSD array, that should interface the SAS monitor!",
  'Jazmyne|Gibson|3442 Everette Tunnel|Utah|542.209.3639|2022-12-01T16:58:17.890Z|Jazz|Band On the Run|If we back up the circuit, we can get to the SQL array through the back-end HEX feed!',
  'Chad|Bartell|997 Alexander Village|Wyoming|1-512-366-1968|2022-03-18T16:42:38.173Z|Classical|Never Gonna Give You Up|If we reboot the microchip, we can get to the RAM matrix through the primary XSS monitor!',
  "Peter|Kessler|43711 Nolan Fort|Kentucky|408.278.2672|2019-03-29T11:42:59.259Z|Hip Hop|Surfin' USA|calculating the sensor won't do anything, we need to generate the online DNS feed!",
  'Joey|Koelpin|10542 Cleveland Mills|Nebraska|649.447.7594 x978|2020-08-12T14:53:01.164Z|Classical|Love Shack|Use the mobile AI protocol, then you can bypass the open-source feed!',
  'Tod|Sanford|7653 Juwan Radial|Wisconsin|781-209-6459|2021-03-01T19:01:04.202Z|Electronic|Burn|The HTTP microchip is down, bypass the online microchip so we can bypass the FTP hard drive!',
  "Nakia|Moen|75115 Donnie Way|Arkansas|845-690-1809 x274|2021-08-28T07:11:15.930Z|Funk|You Always Hurt the One You Love|indexing the port won't do anything, we need to reboot the neural VGA alarm!",
  'Lavonne|Cronin|3545 Bulah Circles|Alaska|(381) 522-1962 x15573|2022-02-15T14:12:30.051Z|Hip Hop|Rich Girl|The TCP feed is down, back up the back-end feed so we can override the GB alarm!',
  'Alfredo|Treutel|90919 Jenkins Stravenue|Mississippi|262.483.1238 x2432|2022-06-17T08:02:07.374Z|Funk|Time of the Season|Try to transmit the RSS interface, maybe it will bypass the wireless bus!',
  "Savanah|Graham|55171 Johnston Wall|Washington|1-502-827-8410|2019-07-15T02:35:54.206Z|Hip Hop|I'm Looking Over a Four Leaf Clover|We need to copy the multi-byte RSS capacitor!",
  'Esteban|Rosenbaum|642 Raquel Common|New York|782-792-6555 x6278|2022-01-27T18:17:31.455Z|Metal|Sugar Sugar|Try to navigate the RAM bandwidth, maybe it will override the auxiliary application!',
  "Ted|Schmeler|83783 Alek Summit|Iowa|415.509.0261|2023-09-14T02:05:27.338Z|Blues|A Tree in the Meadow|I'll connect the open-source TCP sensor, that should application the UDP firewall!",
  'Roselyn|Doyle|0928 Bradly Ridges|Georgia|1-726-794-4130 x43166|2022-02-28T03:53:54.795Z|Non Music|Rapture|The PNG card is down, input the redundant microchip so we can navigate the JSON bandwidth!',
  "Idell|Kirlin|8527 Hoeger Plains|New Jersey|1-261-430-1323|2023-04-05T19:49:35.054Z|Latin|Let Me Love You|programming the hard drive won't do anything, we need to connect the virtual COM firewall!",
  'Oswaldo|Koepp|000 Camden Land|Massachusetts|(485) 381-8750|2019-10-21T01:13:04.342Z|Folk|Tangerine|Use the multi-byte CSS protocol, then you can bypass the virtual firewall!',
  'Raleigh|Dicki|84142 Wiza Bridge|Nebraska|(478) 658-7018 x6805|2020-11-02T21:57:02.432Z|Electronic|She Loves You|The RAM monitor is down, override the redundant program so we can index the FTP pixel!',
  "Norma|Heller|755 Jaskolski Square|Connecticut|(295) 876-3062|2022-02-02T19:32:15.280Z|Folk|Won't Get Fooled Again|The SSD program is down, calculate the solid state transmitter so we can quantify the RAM card!",
  "Kayla|Herzog|4739 Parisian Corners|Idaho|504-458-4377 x34542|2019-12-04T01:59:04.874Z|Non Music|You Don't Have to Be a Star (To Be in My Show)|Try to navigate the UDP microchip, maybe it will input the mobile transmitter!",
  "Adriana|Graham|2765 Hettinger Mission|Nevada|691-938-4227|2023-04-03T18:04:02.329Z|Jazz|Tha Crossroads|You can't program the driver without navigating the back-end PCI microchip!",
  'Cassie|Zemlak|10136 Brown Well|Mississippi|1-886-407-5724|2023-05-25T08:24:56.376Z|Rap|Superstition|The XML circuit is down, copy the neural system so we can input the SSD transmitter!',
  'Lyric|Botsford|9858 Bridgette Ways|New York|921-941-9707 x97387|2020-06-18T22:49:54.879Z|Reggae|Always On My Mind|If we generate the system, we can get to the AGP hard drive through the optical API hard drive!',
  "Jalon|Auer|1337 Spencer Shoals|Arizona|626.664.1307 x7251|2022-09-06T01:58:58.283Z|Reggae|U Can't Touch This|Try to compress the UTF8 protocol, maybe it will quantify the online sensor!",
  'Ludwig|Olson|969 Smith Isle|Utah|460.363.0230 x433|2020-07-27T19:51:05.091Z|Metal|Big Bad John|The FTP port is down, override the open-source hard drive so we can bypass the HEX circuit!',
  'Bridie|Brown|40022 Herman Fall|Colorado|(488) 464-2590 x006|2020-08-21T00:19:41.480Z|World|The Power of Love|We need to quantify the neural TLS matrix!',
  "Catalina|Rippin|43734 Nitzsche Groves|Colorado|705-543-3151 x793|2021-08-09T12:26:22.963Z|Hip Hop|I Can't Stop Loving You|We need to connect the solid state OCR port!",
  'Carolanne|Turcotte|7259 Lockman Flats|Oregon|1-682-446-8574|2022-06-08T09:12:20.741Z|Blues|Total Eclipse of the Heart|If we back up the firewall, we can get to the UDP capacitor through the back-end SQL hard drive!',
  "Scotty|Williamson|61776 Rebeka Summit|Colorado|829-632-3726 x9232|2020-03-06T09:18:52.685Z|Non Music|All I Wanna Do|transmitting the firewall won't do anything, we need to navigate the neural TLS pixel!",
  'Forest|Rau|84797 Prohaska Route|Oklahoma|1-506-693-4479 x7363|2022-02-13T03:51:02.882Z|Metal|My Girl|If we transmit the bandwidth, we can get to the JSON array through the redundant DNS interface!',
  'Mustafa|Glover|8784 Gilda Ferry|Texas|(221) 701-4090 x6545|2020-03-28T22:08:14.861Z|Rock|Grease|If we program the circuit, we can get to the API transmitter through the mobile CSS alarm!',
  'Alexa|Schaden|216 Bashirian Common|Arizona|(794) 997-1491|2023-10-19T00:48:46.789Z|Rock|50 Ways to Leave Your Lover|Use the wireless IB port, then you can compress the bluetooth card!',
  'Valentine|Weimann|813 Augustus Spur|Utah|206.690.2919|2020-09-30T07:09:57.228Z|Rap|Because of You|We need to parse the auxiliary TLS capacitor!',
  "Isabell|Senger|37201 Corkery Ranch|Iowa|1-531-713-5087|2020-06-29T19:23:55.807Z|Stage And Screen|E.T.|I'll index the solid state XML microchip, that should transmitter the OCR alarm!",
  'Jakob|Jacobs|336 Itzel Viaduct|Hawaii|(652) 827-4708 x04803|2019-09-17T21:17:28.501Z|Metal|Red Red Wine|Try to calculate the EXE sensor, maybe it will input the optical feed!',
  "Adell|Bergstrom|3844 Cormier Island|Georgia|647-786-3685 x498|2022-03-23T20:07:07.730Z|Funk|Escape (The Pina Colada Song)|I'll parse the mobile JBOD array, that should interface the ADP array!",
  'Enid|Turner|9124 Bella Parkway|California|898.625.2245|2023-10-02T21:37:37.848Z|Country|Tik-Toc|The PNG alarm is down, transmit the mobile feed so we can program the JSON array!',
  'Jazmyn|Bayer|994 Vandervort Freeway|Michigan|1-525-851-3729|2020-08-07T08:51:58.175Z|Metal|The Love You Save|Use the wireless AGP driver, then you can input the primary hard drive!',
  'Wallace|Schultz|991 Cynthia Islands|South Dakota|276.486.9138 x19749|2021-12-15T20:21:59.615Z|Folk|The Sign|The IB transmitter is down, input the redundant array so we can compress the UTF8 bus!',
  "Ronaldo|Bergnaum|793 Harvey Cliffs|Minnesota|(763) 924-8113 x909|2019-09-10T04:59:43.612Z|Funk|Cheek to Cheek|You can't calculate the driver without bypassing the open-source PNG application!",
  "Jamarcus|Dickens|458 Raoul Crossing|Minnesota|1-977-491-1174 x12903|2022-01-08T12:50:58.859Z|Stage And Screen|One|connecting the capacitor won't do anything, we need to navigate the back-end ASCII matrix!",
  'Ozella|Walsh|28623 Imani Mission|Iowa|1-803-233-1722 x94688|2020-07-20T09:55:33.884Z|Rap|Wipe Out|The UTF8 bus is down, hack the haptic application so we can transmit the DNS panel!',
  'Vergie|Stokes|57283 Dahlia Ranch|New York|1-974-656-0663 x201|2023-01-11T05:24:46.164Z|Latin|This Ole House|Use the open-source IB panel, then you can quantify the cross-platform feed!',
  "Juvenal|Rogahn|016 Wiegand Plains|Florida|(569) 709-7816|2020-06-15T14:11:40.649Z|Rock|Swinging On a Star|navigating the bandwidth won't do anything, we need to input the online SQL driver!",
  "Marisa|O'Connell|9075 Schowalter Crossing|Indiana|(368) 695-6801 x6567|2022-01-22T20:34:36.727Z|Blues|Body & Soul|I'll compress the neural HDD matrix, that should firewall the HEX application!",
  "Renee|MacGyver|28801 Melody Locks|South Carolina|217-885-0010 x51327|2019-08-17T15:24:13.220Z|World|Can't Help Falling in Love|Try to synthesize the DNS bus, maybe it will synthesize the primary alarm!",
  'Luz|Labadie|7427 Marvin Lock|Iowa|1-475-395-9892|2023-05-04T11:46:27.845Z|Pop|Eve of Destruction|We need to program the neural RSS alarm!',
  'Thurman|Quitzon|1451 Houston Center|California|(606) 818-4644 x897|2023-04-24T20:08:03.415Z|Non Music|This Used to Be My Playground|Try to bypass the USB interface, maybe it will parse the optical alarm!',
  'Jerrold|Grant|26488 Leonel Place|Massachusetts|1-949-823-5546 x320|2022-09-06T01:08:43.228Z|World|Chattanooga Choo Choo|If we reboot the system, we can get to the HTTP port through the bluetooth JBOD panel!',
  "Charlene|Kautzer|026 Koch Squares|Delaware|1-819-452-4832|2021-11-12T16:22:52.339Z|Stage And Screen|Kung Fu Fighting|I'll back up the solid state XSS application, that should panel the OCR driver!",
  'Bennie|White|8838 Ruthe Lodge|Oregon|1-326-766-9776 x5871|2019-10-02T03:49:08.476Z|Folk|I Wanna Dance With Somebody (Who Loves Me)|We need to index the auxiliary AGP alarm!',
  'Serena|Howell|50451 Stephanie Lane|North Dakota|494.371.8192 x3198|2023-05-26T12:48:02.295Z|Hip Hop|Crazy Little Thing Called Love|We need to navigate the haptic SSL firewall!',
  "Christian|Zulauf|0536 Marcelino Stravenue|South Dakota|311.287.5546 x634|2022-02-21T16:31:57.849Z|Funk|Yeah!|I'll calculate the 1080p JBOD firewall, that should sensor the DRAM circuit!",
  "Trenton|Gutmann|1794 Friedrich Drives|North Dakota|587.472.6191 x90105|2021-05-14T15:23:38.984Z|Folk|Take On Me|I'll index the multi-byte DRAM program, that should sensor the DNS monitor!",
  "Julianne|Reichert|39854 Herman Overpass|Missouri|1-921-342-5327 x91377|2020-10-13T21:46:43.921Z|Metal|Won't Get Fooled Again|The ASCII sensor is down, copy the virtual monitor so we can hack the OCR array!",
  'Arne|Jerde|73182 Camryn Mills|Ohio|1-886-609-1117 x1213|2021-07-15T07:55:57.969Z|Rap|Build Me Up Buttercup|If we copy the application, we can get to the SSL array through the online GB card!',
  "Russel|Prosacco|733 Fausto Harbors|Alaska|(768) 434-0549 x046|2022-01-04T12:36:15.613Z|Blues|Man in the Mirror|You can't program the application without indexing the bluetooth RSS port!",
  'Sylvan|Pacocha|1666 Kayden Knolls|Virginia|890.970.7412 x99529|2023-01-13T11:38:20.489Z|Funk|Tammy|We need to program the optical UTF8 microchip!',
  'Avis|Kemmer|067 Dicki Spring|Minnesota|1-470-276-6628 x7318|2020-08-03T09:30:51.310Z|Country|We Will Rock You|If we index the bandwidth, we can get to the SSL matrix through the mobile RSS card!',
  'Vinnie|Erdman|266 West Parks|Ohio|295.883.0344 x9687|2021-08-31T10:41:31.145Z|Pop|Dancing Queen|We need to program the auxiliary ADP port!',
  'Retha|Shanahan|92874 Burnice Rest|West Virginia|1-989-842-2804|2021-11-01T14:04:37.080Z|Funk|Leader of the Pack|If we generate the system, we can get to the JSON capacitor through the auxiliary JSON circuit!',
  "Sophia|Durgan|33093 Kris Highway|West Virginia|257-311-0156 x02940|2023-04-16T22:04:32.445Z|Reggae|Take a Bow|programming the protocol won't do anything, we need to connect the redundant OCR application!",
  'Geovany|Tromp|04085 Vesta Corners|Oregon|366.420.6148 x9787|2020-04-08T05:16:09.002Z|Rock|Here in My Heart|Try to copy the ASCII feed, maybe it will index the wireless protocol!',
  "Abdullah|Williamson|2785 Karlie Run|Florida|(689) 794-2642 x8431|2020-08-16T20:37:23.466Z|Classical|Bye|You can't index the capacitor without backing up the open-source USB sensor!",
  'Bo|Hettinger|11099 Dare Isle|Florida|(359) 794-0686 x05810|2022-06-25T21:03:05.811Z|Jazz|Rush Rush|Use the primary SMTP program, then you can calculate the 1080p microchip!',
  'Lois|Reichel|41309 Abernathy Valley|Rhode Island|(444) 941-5900 x2001|2021-12-03T16:26:57.343Z|Metal|Rapture|If we back up the alarm, we can get to the SQL sensor through the bluetooth COM bandwidth!',
  'Elmer|Cummerata|184 Katrine Shore|Iowa|372.603.3205 x712|2021-04-19T11:13:07.667Z|World|You Are the Sunshine of My Life|If we reboot the sensor, we can get to the VGA port through the mobile SSL alarm!',
  "Nella|Von|1350 Stoltenberg Brooks|Texas|1-925-845-7429 x0536|2020-03-10T03:40:50.476Z|Jazz|Theme From 'Greatest American Hero' (Believe It Or Not)|You can't input the driver without calculating the online GB bandwidth!",
  'Tyler|Orn|33097 VonRueden Camp|Iowa|(930) 397-6101|2022-12-31T20:27:01.650Z|Electronic|Secret Love|The SMS panel is down, calculate the digital interface so we can calculate the IB program!',
  'Joy|Lockman|3235 Isabell Terrace|Louisiana|(988) 273-5397 x17397|2021-11-30T23:25:34.134Z|Latin|I Got You Babe|Use the redundant TCP transmitter, then you can parse the bluetooth matrix!',
  'Jarret|Kulas|364 Gorczany Bypass|Georgia|1-909-780-0982 x92779|2019-05-27T18:28:31.309Z|Rock|Disturbia|Use the virtual COM port, then you can index the digital driver!',
  "Pedro|Friesen|20032 Waylon Hollow|Indiana|(268) 387-1965|2022-08-18T16:55:19.848Z|World|Up Up & Away|You can't calculate the bus without backing up the digital DRAM driver!",
  'Dedric|Senger|818 Borer Dam|Alaska|1-462-853-3223|2019-12-06T14:14:47.556Z|Funk|Smoke Gets in Your Eyes|The GB sensor is down, synthesize the auxiliary feed so we can input the COM sensor!',
  'Jess|Powlowski|169 Marion Ridges|South Carolina|445-623-4865 x41525|2020-02-24T19:40:43.679Z|Jazz|Let Me Call You Sweetheart|Use the cross-platform DNS bandwidth, then you can transmit the mobile sensor!',
  "Herta|Schultz|46393 Roberta Landing|Minnesota|798.446.4800|2020-08-19T08:26:34.307Z|Funk|Hurt So Good|I'll connect the cross-platform HDD alarm, that should hard drive the SDD bus!",
  "Maurine|Boyle|243 Wade Point|Arkansas|1-932-491-9223|2021-11-07T17:38:08.763Z|Stage And Screen|Hips don't lie|We need to connect the redundant ADP system!",
  'Marjory|McClure|350 Cheyanne Camp|West Virginia|1-413-868-6859 x24987|2023-03-14T18:07:48.268Z|Rap|Kiss|We need to navigate the haptic TLS panel!',
  "Darion|Wisozk|232 Berge Junctions|Arizona|1-887-450-7810|2023-08-27T12:45:14.167Z|Latin|I Get Around|transmitting the microchip won't do anything, we need to navigate the cross-platform ADP application!",
  'Freda|Boyer|4092 Lakin Passage|Arizona|868-901-8673 x19014|2019-01-20T21:51:55.513Z|Non Music|Wishing Well|We need to transmit the back-end RSS capacitor!',
  "Daija|Cole|998 Feil Causeway|Colorado|591.689.7935|2020-03-29T16:59:21.046Z|World|(It's No) Sin|We need to synthesize the redundant SMTP hard drive!",
  'Isidro|Barton|692 Hannah Harbors|Louisiana|1-521-632-7204|2022-11-02T18:58:59.587Z|Folk|Brother|We need to parse the auxiliary HEX bandwidth!',
  'Ada|McLaughlin|841 Chanelle Canyon|Arkansas|206.847.6733|2021-03-27T19:56:02.116Z|Electronic|Groove is in the Heart|We need to reboot the open-source SDD application!',
  "Sarah|Kuhlman|473 Ahmed Knoll|North Carolina|483-459-2066 x0169|2022-05-27T08:10:57.211Z|Classical|I Just Called to Say I Love You|compressing the bandwidth won't do anything, we need to bypass the virtual THX capacitor!",
  "Branson|Boyer|0789 Jo Circle|New Mexico|230.651.5955|2022-08-16T22:49:14.914Z|Stage And Screen|Feel Like Making Love|I'll copy the virtual PCI application, that should alarm the FTP hard drive!",
  'Humberto|Beahan|16065 Herman Freeway|Washington|555-464-7388|2020-01-18T15:42:51.572Z|Funk|Imagine|The PCI hard drive is down, reboot the back-end bandwidth so we can quantify the HEX hard drive!',
  'Domenic|Bernier|83684 Hagenes Crest|New Mexico|207.846.6268 x29983|2021-06-22T05:33:50.459Z|Latin|Philadelphia Freedom|The GB monitor is down, program the bluetooth array so we can parse the TLS driver!',
  'Alayna|Hand|51016 Wisozk Grove|New York|317-783-7334 x538|2023-05-15T18:10:16.387Z|Jazz|Yakety Yak|We need to calculate the multi-byte SCSI circuit!',
  'Henri|Gottlieb|6075 Doyle Tunnel|Colorado|(691) 295-0631 x8778|2020-11-21T05:57:22.135Z|Electronic|Always On My Mind|Use the back-end JSON transmitter, then you can parse the virtual sensor!',
];

const serverUsers: FullUserInfo[] = serverUserRows.map((line) => {
  const [
    firstName,
    lastName,
    address,
    state,
    phoneNumber,
    lastLogin,
    favoriteMusic,
    favoriteSong,
    quote,
  ] = line.split('|') as [
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
  ];
  return {
    firstName,
    lastName,
    address,
    state,
    phoneNumber,
    lastLogin: new Date(lastLogin),
    favoriteMusic,
    favoriteSong,
    quote,
  };
});

const serverDelay = () => new Promise((resolve) => setTimeout(resolve, 500));

/** What `/api/data` answers: text filters, a global filter, sorting, a page. */
const fetchServerUsers = async ({
  columnFilters,
  globalFilter,
  pagination,
  sorting,
}: {
  columnFilters: ST_ColumnFiltersState;
  globalFilter: string;
  pagination: ST_PaginationState;
  sorting: ST_SortingState;
}): Promise<UserApiResponse> => {
  await serverDelay();
  const text = (row: ServerUser, id: string) =>
    String(row[id as keyof ServerUser] ?? '').toLowerCase();
  let rows: ServerUser[] = serverUsers.map((user) => ({
    firstName: user.firstName,
    lastName: user.lastName,
    address: user.address,
    state: user.state,
    phoneNumber: user.phoneNumber,
    lastLogin: user.lastLogin,
  }));
  for (const { id, value } of columnFilters)
    rows = rows.filter((row) =>
      text(row, id).includes(String(value).toLowerCase()),
    );
  if (globalFilter)
    rows = rows.filter((row) =>
      Object.keys(row).some((id) =>
        text(row, id).includes(globalFilter.toLowerCase()),
      ),
    );
  const [sort] = sorting;
  if (sort) {
    const value = (row: ServerUser) => row[sort.id as keyof ServerUser];
    rows.sort((a, b) => {
      const less = (p: ServerUser, q: ServerUser) => value(p) < value(q);
      return sort.desc ? (less(a, b) ? 1 : -1) : less(b, a) ? 1 : -1;
    });
  }
  const start = pagination.pageIndex * pagination.pageSize;
  return {
    data: rows.slice(start, start + pagination.pageSize),
    meta: { totalRowCount: rows.length },
  };
};

/** What `/api/moredata/<phone number>` answers: one user's full info. */
const fetchServerUserInfo = async (phoneNumber: string) => {
  await serverDelay();
  return serverUsers.find((user) => user.phoneNumber === phoneNumber) ?? null;
};

//fetch user hook
const useFetchUsers = ({
  columnFilters,
  globalFilter,
  pagination,
  sorting,
}: {
  columnFilters: ST_ColumnFiltersState;
  globalFilter: string;
  pagination: ST_PaginationState;
  sorting: ST_SortingState;
}) => {
  return useQuery<UserApiResponse>({
    queryKey: [
      'users', //give a unique key for this query
      columnFilters, //refetch when columnFilters changes
      globalFilter, //refetch when globalFilter changes
      pagination.pageIndex, //refetch when pagination.pageIndex changes
      pagination.pageSize, //refetch when pagination.pageSize changes
      sorting, //refetch when sorting changes
    ],
    queryFn: () =>
      fetchServerUsers({ columnFilters, globalFilter, pagination, sorting }),
    placeholderData: keepPreviousData, //don't go to 0 rows when refetching or paginating to next page
  });
};

//fetch more user info hook
const useFetchUserInfo = (
  params: { phoneNumber: string },
  options: { enabled: boolean },
) => {
  return useQuery<FullUserInfo | null>({
    enabled: options.enabled, //only fetch when the detail panel is opened
    staleTime: 60 * 1000, //don't refetch for 60 seconds
    queryKey: ['user', params.phoneNumber], //give a unique key for this query for each user fetch
    queryFn: () => fetchServerUserInfo(params.phoneNumber),
  });
};

const LazyDetailPanelContent = ({ row }: { row: ST_Row<ServerUser> }) => {
  const {
    data: userInfo,
    isLoading,
    isError,
  } = useFetchUserInfo(
    {
      phoneNumber: row.id, //the row id is set to the user's phone number
    },
    {
      enabled: row.getIsExpanded(),
    },
  );
  if (isLoading) return <Spinner />;
  if (isError)
    return (
      <Alert variant="destructive">
        <AlertTitle>Error Loading User Info</AlertTitle>
      </Alert>
    );

  const { favoriteMusic, favoriteSong, quote } = userInfo ?? {};

  return (
    <div className="flex flex-col gap-2">
      <div>
        <b>Favorite Music:</b> {favoriteMusic}
      </div>
      <div>
        <b>Favorite Song:</b> {favoriteSong}
      </div>
      <div>
        <b>Quote:</b> {quote}
      </div>
    </div>
  );
};

const LazyDetailPanelTable = () => {
  //manage our own state for stuff we want to pass to the API
  const [columnFilters, setColumnFilters] = useState<ST_ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState<ST_SortingState>([]);
  const [pagination, setPagination] = useState<ST_PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });

  const {
    data: { data = [], meta } = {},
    isError,
    isRefetching,
    isLoading,
  } = useFetchUsers({
    columnFilters,
    globalFilter,
    pagination,
    sorting,
  });

  const columns = useMemo<ST_ColumnDef<ServerUser>[]>(
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
        accessorKey: 'state',
        icon: MapIcon,
        header: 'State',
      },
      {
        accessorKey: 'phoneNumber',
        icon: PhoneIcon,
        header: 'Phone Number',
      },
    ],
    [],
    //end
  );

  const table = useShadcnTable({
    columns,
    data,
    getRowId: (row) => row.phoneNumber,
    manualFiltering: true, //turn off built-in client-side filtering
    manualPagination: true, //turn off built-in client-side pagination
    manualSorting: true, //turn off built-in client-side sorting
    stExpandButtonProps: ({ row }) => ({
      children: row.getIsExpanded() ? <MinusIcon /> : <AddIcon />,
    }),
    stToolbarAlertBannerProps: isError
      ? {
          className: 'border-destructive text-destructive',
          children: 'Error loading data',
        }
      : undefined,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    renderDetailPanel: ({ row }) => <LazyDetailPanelContent row={row} />,
    rowCount: meta?.totalRowCount ?? 0,
    state: {
      columnFilters,
      globalFilter,
      isLoading,
      pagination,
      showAlertBanner: isError,
      showProgressBars: isRefetching,
      sorting,
    },
  });

  return <ShadcnTable table={table} />;
};

/** The docs example lazy-detail-panel: a row's details load on expand. */
export const LazyDetailPanel = {
  render: function LazyDetailPanelStory() {
    //one QueryClient per story, so no other story shares its cache
    const [queryClient] = useState(() => new QueryClient());
    return (
      <QueryClientProvider client={queryClient}>
        <LazyDetailPanelTable />
      </QueryClientProvider>
    );
  },
  play: async ({ canvasElement }: StoryContext) => {
    const canvas = within(canvasElement);
    await canvas.findByText('Hermann', {}, { timeout: 5000 });
    // The first page of five rows; the 200 rows stay on the fake server.
    const expandButtons = canvas.getAllByRole('button', { name: 'Expand' });
    expect(expandButtons).toHaveLength(5);
    const [firstRowExpand] = expandButtons;
    await userEvent.click(firstRowExpand!);
    await canvas.findByText('Blues', {}, { timeout: 5000 });
    expect(canvas.getByText('Tom Dooley')).toBeInTheDocument();

    // Closed and opened again, the cached details show at once.
    await userEvent.click(firstRowExpand!);
    await waitFor(() => expect(canvas.queryByText('Blues')).toBeNull());
    await userEvent.click(firstRowExpand!);
    // The fake server answers after 500 ms; the cache answers before that.
    await canvas.findByText('Blues', {}, { timeout: 200 });
  },
};
