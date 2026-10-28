'use client';

import { useMemo } from 'react';
import {
  ShadcnTable,
  useShadcnTable,
  type ST_ColumnDef,
} from '@/components/ui/shadcn-table';

export type Person = {
  id: number;
  firstName: string;
  lastName: string;
  gender: string;
  age: number;
};

const Example = () => {
  const columns = useMemo<ST_ColumnDef<Person>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        stFilterTextFieldProps: { placeholder: 'ID' },
      },
      {
        accessorKey: 'firstName',
        header: 'First Name',
      },
      {
        accessorKey: 'lastName',
        header: 'Last Name',
      },
      {
        accessorKey: 'gender',
        header: 'Gender',
        filterFn: 'equals',
        filterSelectOptions: [
          { label: 'Male', value: 'Male' },
          { label: 'Female', value: 'Female' },
          { label: 'Other', value: 'Other' },
        ],
        filterVariant: 'select',
      },
      {
        accessorKey: 'age',
        header: 'Age',
        filterVariant: 'range',
      },
    ],
    [],
  );

  const data = useMemo<Person[]>(
    //data definitions...
    () => [
      {
        id: 1,
        firstName: 'Hugh',
        lastName: 'Mungus',
        gender: 'Male',
        age: 42,
      },
      {
        id: 2,
        firstName: 'Leroy',
        lastName: 'Jenkins',
        gender: 'Male',
        age: 51,
      },
      {
        id: 3,
        firstName: 'Candice',
        lastName: 'Nutella',
        gender: 'Female',
        age: 27,
      },
      {
        id: 4,
        firstName: 'Micah',
        lastName: 'Johnson',
        gender: 'Other',
        age: 32,
      },
    ],
    [],
    //end
  );

  const table = useShadcnTable({
    columns,
    data,
    initialState: { showColumnFilters: true },
    stFilterTextFieldProps: {
      className: 'my-2 w-full',
    },
  });

  return <ShadcnTable table={table} />;
};

export default Example;
