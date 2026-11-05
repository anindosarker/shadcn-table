import { faker } from '@faker-js/faker';
import { ShadcnTable } from '@/components/ui/shadcn-table';
import { type Meta, type StoryContext } from '@storybook/react-vite';
import { expect, waitFor } from 'storybook/test';
import { CakeIcon, HashIcon, MapPinIcon, UserIcon } from 'lucide-react';

const meta: Meta = {
  title: 'Features/Detail Panel Examples',
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
