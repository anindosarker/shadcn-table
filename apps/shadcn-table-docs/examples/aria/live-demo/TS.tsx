'use client';

import { useMemo } from 'react';
import {
  ShadcnTable,
  useShadcnTable,
  type ST_ColumnDef,
} from '@/components/ui/shadcn-table';
import {
  BanknoteIcon,
  BriefcaseIcon,
  Building2Icon,
  CakeIcon,
  CalendarIcon,
  CircleCheckIcon,
  MailIcon,
  MapIcon,
  UserIcon,
} from 'lucide-react';
import {
  data,
  departmentList,
  type Member,
  statusList,
  usStateList,
} from './makeData';

//dates are stored as YYYY-MM-DD and shown in UTC, so server and client agree
const formatDate = (date: string) =>
  new Date(date).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    timeZone: 'UTC',
    year: 'numeric',
  });

const formatSalary = (salary: number) =>
  salary.toLocaleString('en-US', {
    currency: 'USD',
    maximumFractionDigits: 0,
    style: 'currency',
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
        accessorKey: 'email',
        icon: MailIcon,
        header: 'Email',
        size: 240,
      },
      {
        accessorKey: 'city',
        icon: Building2Icon,
        header: 'City',
        size: 160,
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
        accessorKey: 'department',
        icon: BriefcaseIcon,
        header: 'Department',
        filterVariant: 'select',
        filterSelectOptions: departmentList,
        size: 170,
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
        accessorKey: 'salary',
        icon: BanknoteIcon,
        header: 'Salary',
        filterVariant: 'range',
        filterFn: 'between',
        Cell: ({ cell }) => formatSalary(cell.getValue<number>()),
        size: 140,
      },
      {
        accessorKey: 'joined', //YYYY-MM-DD strings sort and filter in date order
        icon: CalendarIcon,
        header: 'Joined',
        filterVariant: 'date',
        filterFn: 'greaterThan',
        Cell: ({ cell }) => formatDate(cell.getValue<string>()),
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
