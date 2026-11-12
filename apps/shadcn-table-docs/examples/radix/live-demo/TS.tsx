'use client';

import { useMemo } from 'react';
import {
  ShadcnTable,
  useShadcnTable,
  type ST_ColumnDef,
} from '@/components/ui/shadcn-table';
import {
  CakeIcon,
  CalendarIcon,
  CircleCheckIcon,
  MapIcon,
  UserIcon,
} from 'lucide-react';
import { data, type Member, statusList, usStateList } from './makeData';

//dates are stored as YYYY-MM-DD and shown in UTC, so server and client agree
const formatDate = (date: Date) =>
  date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    timeZone: 'UTC',
    year: 'numeric',
  });

const Example = () => {
  const columns = useMemo<ST_ColumnDef<Member>[]>(
    () => [
      {
        accessorKey: 'firstName',
        icon: UserIcon,
        header: 'First Name',
        size: 150,
      },
      {
        accessorKey: 'lastName',
        icon: UserIcon,
        header: 'Last Name',
        size: 150,
      },
      {
        accessorKey: 'state',
        icon: MapIcon,
        header: 'State',
        filterVariant: 'select',
        filterSelectOptions: usStateList,
        size: 150,
      },
      {
        accessorKey: 'age',
        icon: CakeIcon,
        header: 'Age',
        filterVariant: 'range',
        filterFn: 'between',
        size: 110,
      },
      {
        accessorFn: (row) => new Date(row.joined), //convert to Date for sorting and filtering
        id: 'joined',
        icon: CalendarIcon,
        header: 'Joined',
        filterVariant: 'date',
        filterFn: 'greaterThan',
        sortingFn: 'datetime',
        Cell: ({ cell }) => formatDate(cell.getValue<Date>()), //render the Date as a string
        size: 150,
      },
      {
        accessorKey: 'status',
        icon: CircleCheckIcon,
        header: 'Status',
        filterVariant: 'multi-select',
        filterSelectOptions: statusList,
        size: 140,
      },
    ],
    [],
  );

  const table = useShadcnTable({
    columns,
    data, //data must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
  });

  return <ShadcnTable table={table} />;
};

export default Example;
