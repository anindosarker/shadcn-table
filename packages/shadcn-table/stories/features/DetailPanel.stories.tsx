import { ShadcnTable } from '@/components/ui/shadcn-table/ShadcnTable';
import { faker } from '@faker-js/faker';
import { type Meta, type StoryContext } from '@storybook/react-vite';
import { expect, waitFor } from 'storybook/test';

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
      },
      {
        accessorKey: 'lastName',
        header: 'Last Name',
      },
      {
        accessorKey: 'address',
        header: 'Address',
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
      },
      {
        accessorKey: 'lastName',
        header: 'Last Name',
      },
      {
        accessorKey: 'address',
        header: 'Address',
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
      },
      {
        accessorKey: 'lastName',
        header: 'Last Name',
      },
      {
        accessorKey: 'address',
        header: 'Address',
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
      },
      {
        accessorKey: 'lastName',
        header: 'Last Name',
      },
      {
        accessorKey: 'address',
        header: 'Address',
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
      },
      {
        accessorKey: 'lastName',
        header: 'Last Name',
      },
      {
        accessorKey: 'age',
        header: 'Age',
      },
      {
        accessorKey: 'address',
        header: 'Address',
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
      },
      {
        accessorKey: 'lastName',
        header: 'Last Name',
      },
      {
        accessorKey: 'age',
        header: 'Age',
      },
      {
        accessorKey: 'address',
        header: 'Address',
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
        },
        {
          accessorKey: 'lastName',
          header: 'Last Name',
        },
        {
          accessorKey: 'address',
          header: 'Address',
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
      stExpandButtonProps={({ row, table }) => ({
        onClick: () => table.setExpanded({ [row.id]: !row.getIsExpanded() }),
      })}
    />
  );
};

export const DetailPanelExpandColumnLast = () => (
  <ShadcnTable
    columns={[
      {
        accessorKey: 'firstName',
        header: 'First Name',
      },
      {
        accessorKey: 'lastName',
        header: 'Last Name',
      },
      {
        accessorKey: 'address',
        header: 'Address',
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
      },
      {
        accessorKey: 'lastName',
        header: 'Last Name',
      },
      {
        accessorKey: 'address',
        header: 'Address',
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
      },
      {
        accessorKey: 'lastName',
        header: 'Last Name',
      },
      {
        accessorKey: 'address',
        header: 'Address',
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
      },
      {
        accessorKey: 'lastName',
        header: 'Last Name',
      },
      {
        accessorKey: 'address',
        header: 'Address',
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
      },
      {
        accessorKey: 'lastName',
        header: 'Last Name',
      },
      {
        accessorKey: 'address',
        header: 'Address',
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
