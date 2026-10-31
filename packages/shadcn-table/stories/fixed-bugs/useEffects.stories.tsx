import { useEffect, useMemo, useState } from 'react';
import { type Meta } from '@storybook/react-vite';
import {
  type ST_ColumnDef,
  type ST_ColumnFiltersState,
  type ST_PaginationState,
  type ST_Updater,
  ShadcnTable,
} from '@/components/ui/shadcn-table';
import { faker } from '@faker-js/faker';
import { Button } from '@/components/ui/button';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';

const meta: Meta = {
  title: 'Fixed Bugs/useEffects',
};

export default meta;

interface Person {
  address: string;
  age: number;
  firstName: string;
  gender: string;
  lastName: string;
  phoneNumber: string;
  state: string;
}

const data: Person[] = [...Array(100)].map(() => ({
  address: faker.location.streetAddress(),
  age: faker.number.int(100),
  firstName: faker.person.firstName(),
  gender: Math.random() < 0.9 ? faker.person.sex() : faker.person.gender(),
  lastName: faker.person.lastName(),
  phoneNumber: faker.phone.number(),
  state: faker.location.state(),
}));

export const FilterModesRefetch = () => {
  const [columnFilters, setColumnFilters] = useState<ST_ColumnFiltersState>([]);

  useEffect(() => {
    console.log('refetch', columnFilters);
  }, [columnFilters]);

  const columns: ST_ColumnDef<Person>[] = [
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
    {
      accessorKey: 'state',
      header: 'State',
    },
    {
      accessorKey: 'phoneNumber',
      header: 'Phone Number',
    },
  ];

  return (
    <ShadcnTable
      columns={columns}
      data={data}
      enableColumnFilterModes
      initialState={{ showColumnFilters: true }}
      onColumnFiltersChange={setColumnFilters}
      state={{ columnFilters }}
    />
  );
};

export const FilterOptionsAsync = () => {
  const [stateFilterOptions, setStateFilterOptions] = useState<string[]>([]);

  useEffect(() => {
    setTimeout(() => {
      setStateFilterOptions(['CA', 'NY', 'TX']);
    }, 2000);
  }, []);

  const columns = useMemo<ST_ColumnDef<Person>[]>(
    () => [
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
      {
        accessorKey: 'state',
        filterSelectOptions: stateFilterOptions,
        filterVariant: 'select',
        header: 'State',
      },
      {
        accessorKey: 'phoneNumber',
        header: 'Phone Number',
      },
    ],
    [stateFilterOptions],
  );

  return (
    <ShadcnTable
      columns={columns}
      data={data}
      enableColumnFilterModes
      initialState={{ showColumnFilters: true }}
    />
  );
};

export const EditOptionsAsync = () => {
  const [stateEditOptions, setStateEditOptions] = useState<string[]>([]);

  useEffect(() => {
    setTimeout(() => {
      setStateEditOptions(['CA', 'NY', 'TX']);
    }, 2000);
  }, []);

  const columns = useMemo<ST_ColumnDef<Person>[]>(
    () => [
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
      {
        accessorKey: 'state',
        editSelectOptions: stateEditOptions,
        editVariant: 'select',
        header: 'State',
      },
      {
        accessorKey: 'phoneNumber',
        header: 'Phone Number',
      },
    ],
    [stateEditOptions],
  );

  return (
    <ShadcnTable
      columns={columns}
      data={data}
      editDisplayMode="row"
      enableEditing
    />
  );
};

export const RenderRowActionsAsync = () => {
  const [rowActions, setRowActions] = useState<string[]>([]);

  useEffect(() => {
    setTimeout(() => {
      setRowActions(['Edit', 'Delete']);
    }, 2000);
  }, []);

  const columns = useMemo<ST_ColumnDef<Person>[]>(
    () => [
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
      {
        accessorKey: 'state',
        header: 'State',
      },
      {
        accessorKey: 'phoneNumber',
        header: 'Phone Number',
      },
    ],
    [],
  );

  return (
    <ShadcnTable
      columns={columns}
      data={data}
      enableRowActions
      renderRowActions={() => (
        <div className="flex gap-4 whitespace-nowrap">
          {rowActions.map((action) => (
            <Button key={action} type="button">
              {action}
            </Button>
          ))}
        </div>
      )}
    />
  );
};

const RenderRowActionMenuItemsAsync = () => {
  const [rowActions, setRowActions] = useState<string[]>([]);

  useEffect(() => {
    setTimeout(() => {
      setRowActions(['Edit', 'Delete']);
    }, 2000);
  }, []);

  const columns = useMemo<ST_ColumnDef<Person>[]>(
    () => [
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
      {
        accessorKey: 'state',
        header: 'State',
      },
      {
        accessorKey: 'phoneNumber',
        header: 'Phone Number',
      },
    ],
    [],
  );

  return (
    <ShadcnTable
      columns={columns}
      data={data}
      enableRowActions
      renderRowActionMenuItems={() =>
        rowActions.map((action) => [
          <DropdownMenuItem key={action}>{action}</DropdownMenuItem>,
        ])
      }
    />
  );
};

export const renderRowActionMenuItemsAsync = () => (
  <RenderRowActionMenuItemsAsync />
);

export const DelayedFacetedValues = () => {
  const [tableData, setTableData] = useState<Person[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setTableData(data);
      setIsLoading(false);
    }, 2000);
  }, []);

  return (
    <ShadcnTable
      columns={[
        {
          accessorKey: 'firstName',
          filterFn: 'fuzzy', // default
          header: 'First Name',
        },
        {
          accessorKey: 'lastName',
          filterVariant: 'select',
          header: 'Last Name',
        },
        {
          accessorKey: 'age',
          filterVariant: 'range-slider',
          header: 'Age',
        },
        {
          accessorKey: 'gender',
          filterVariant: 'select',
          header: 'Gender',
        },
        {
          accessorKey: 'state',
          filterVariant: 'multi-select',
          header: 'State',
        },
      ]}
      data={tableData}
      enableFacetedValues
      initialState={{ showColumnFilters: true }}
      state={{
        isLoading,
      }}
    />
  );
};

export const PreventUnnecessaryPaginationChangeByOutOfBoundsCheck = () => {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });

  const columns: ST_ColumnDef<Person>[] = [
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
  ];

  const handlePaginationChange = (updater: ST_Updater<ST_PaginationState>) => {
    console.log('Pagination change should not be triggered');
    setPagination(updater);
  };

  return (
    <ShadcnTable
      columns={columns}
      data={[]}
      manualPagination={true}
      rowCount={0}
      enablePagination
      onPaginationChange={handlePaginationChange}
      state={{ pagination }}
    />
  );
};
