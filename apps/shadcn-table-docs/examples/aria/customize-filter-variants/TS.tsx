'use client';

import { useMemo } from 'react';
import {
  ShadcnTable,
  useShadcnTable,
  type ST_ColumnDef,
} from '@/components/ui/shadcn-table';
import { citiesList, data, type Person, usStateList } from './makeData';
import {
  Building2Icon,
  CakeIcon,
  CalendarIcon,
  CircleCheckIcon,
  ClockIcon,
  DollarSignIcon,
  MapIcon,
  UserIcon,
} from 'lucide-react';

const Example = () => {
  const columns = useMemo<ST_ColumnDef<Person>[]>(
    () => [
      {
        header: 'Status',
        accessorFn: (originalRow) => (originalRow.isActive ? 'true' : 'false'), //must be strings
        id: 'isActive',
        icon: CircleCheckIcon,
        filterVariant: 'checkbox',
        Cell: ({ cell }) =>
          cell.getValue() === 'true' ? 'Active' : 'Inactive',
        size: 170,
      },
      {
        accessorKey: 'name',
        icon: UserIcon,
        header: 'Name',
        filterVariant: 'text', // default
        size: 200,
      },
      {
        accessorKey: 'salary',
        icon: DollarSignIcon,
        header: 'Salary',
        Cell: ({ cell }) =>
          cell.getValue<number>().toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
          }),
        filterVariant: 'range-slider',
        filterFn: 'betweenInclusive', // default (or between)
        stFilterSliderProps: {
          max: 200_000, //custom max (as opposed to faceted max)
          min: 30_000, //custom min (as opposed to faceted min)
          step: 10_000,
        },
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
        accessorKey: 'city',
        icon: Building2Icon,
        header: 'City',
        filterVariant: 'select',
        filterSelectOptions: citiesList, //custom options list (as opposed to faceted list)
      },
      {
        accessorKey: 'state',
        icon: MapIcon,
        header: 'State',
        filterVariant: 'multi-select',
        filterSelectOptions: usStateList, //custom options list (as opposed to faceted list)
      },
      {
        accessorFn: (originalRow) => new Date(originalRow.hireDate), //convert to date for sorting and filtering
        id: 'hireDate',
        icon: CalendarIcon,
        header: 'Hire Date',
        filterVariant: 'date-range',
        Cell: ({ cell }) => cell.getValue<Date>().toLocaleDateString(), // convert back to string for display
      },
      {
        accessorFn: (originalRow) => new Date(originalRow.arrivalTime), //convert to date for sorting and filtering
        id: 'arrivalTime',
        icon: ClockIcon,
        header: 'Arrival Time',
        filterVariant: 'datetime-range',
        Cell: ({ cell }) =>
          `${cell.getValue<Date>().toLocaleDateString()} ${cell
            .getValue<Date>()
            .toLocaleTimeString()}`, // convert back to string for display
      },
      {
        accessorFn: (originalRow) => new Date(originalRow.departureTime), //convert to date for sorting and filtering
        id: 'departureTime',
        icon: ClockIcon,
        header: 'Departure Time',
        filterVariant: 'time-range',
        // 'Departure Time' needs about 110 px beside the icon and the chevron
        size: 200,
        Cell: ({ cell }) => cell.getValue<Date>().toLocaleTimeString(), // convert back to string for display
      },
    ],
    [],
  );

  const table = useShadcnTable({
    columns,
    data,
  });

  return <ShadcnTable table={table} />;
};

export default Example;
