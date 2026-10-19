'use client';

import { useMemo } from 'react';

//ST Imports
import {
  ShadcnTable,
  useShadcnTable,
  type ST_ColumnDef,
  ST_GlobalFilterTextField,
  ST_ToggleFiltersButton,
} from '@/components/ui/shadcn-table';

//shadcn Imports
import { Button } from '@/components/ui/button';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';

//Icons Imports
import { CircleUserIcon, SendIcon } from 'lucide-react';

//Mock Data
import { data, type Employee } from './makeData';

const Example = () => {
  const columns = useMemo<ST_ColumnDef<Employee>[]>(
    () => [
      {
        id: 'employee', //id used to define `group` column
        header: 'Employee',
        columns: [
          {
            accessorFn: (row) => `${row.firstName} ${row.lastName}`, //accessorFn used to join multiple data into a single cell
            id: 'name', //id is still required when using accessorFn instead of accessorKey
            header: 'Name',
            size: 250,
            Cell: ({ renderedCellValue, row }) => (
              <div className="flex items-center gap-4">
                <img
                  alt="avatar"
                  className="size-[30px] shrink-0 rounded-full"
                  height={30}
                  width={30}
                  src={row.original.avatar}
                  loading="lazy"
                />
                {/* using renderedCellValue instead of cell.getValue() preserves filter match highlighting */}
                <span>{renderedCellValue}</span>
              </div>
            ),
          },
          {
            accessorKey: 'email', //accessorKey used to define `data` column. `id` gets set to accessorKey automatically
            enableClickToCopy: true,
            filterVariant: 'autocomplete',
            header: 'Email',
            size: 300,
          },
        ],
      },
      {
        id: 'id',
        header: 'Job Info',
        columns: [
          {
            accessorKey: 'salary',
            // filterVariant: 'range', //if not using filter modes feature, use this instead of filterFn
            filterFn: 'between',
            header: 'Salary',
            size: 200,
            //custom conditional format and styling
            Cell: ({ cell }) => (
              <span
                className={`max-w-[9ch] rounded p-1 text-white ${
                  cell.getValue<number>() < 50_000
                    ? 'bg-red-700'
                    : cell.getValue<number>() >= 50_000 &&
                        cell.getValue<number>() < 75_000
                      ? 'bg-yellow-700'
                      : 'bg-green-700'
                }`}
              >
                {cell.getValue<number>()?.toLocaleString?.('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
              </span>
            ),
          },
          {
            accessorKey: 'jobTitle', //hey a simple column for once
            header: 'Job Title',
            size: 350,
          },
          {
            accessorFn: (row) => new Date(row.startDate), //convert to Date for sorting and filtering
            id: 'startDate',
            header: 'Start Date',
            filterVariant: 'date',
            filterFn: 'lessThan',
            sortFn: 'datetime',
            Cell: ({ cell }) => cell.getValue<Date>()?.toLocaleDateString(), //render Date as a string
            Header: ({ column }) => <em>{column.columnDef.header}</em>, //custom header markup
            stFilterTextFieldProps: {
              className: 'min-w-[250px]',
            },
          },
        ],
      },
    ],
    [],
  );

  const table = useShadcnTable({
    columns,
    data, //data must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
    enableColumnFilterModes: true,
    enableColumnOrdering: true,
    enableGrouping: true,
    enableColumnPinning: true,
    enableFacetedValues: true,
    enableRowActions: true,
    enableRowSelection: true,
    initialState: {
      showColumnFilters: true,
      showGlobalFilter: true,
      columnPinning: {
        start: ['st-row-expand', 'st-row-select'],
        end: ['st-row-actions'],
      },
    },
    paginationDisplayMode: 'pages',
    positionToolbarAlertBanner: 'bottom',
    stPaginationProps: {
      rowsPerPageOptions: [10, 20, 30],
    },
    renderDetailPanel: ({ row }) => (
      <div className="sticky left-[30px] flex w-full max-w-[1000px] items-center justify-around">
        <img
          alt="avatar"
          className="size-[200px] shrink-0 rounded-full"
          height={200}
          width={200}
          src={row.original.avatar}
          loading="lazy"
        />
        <div className="text-center">
          <h4>Signature Catch Phrase:</h4>
          <h1>&quot;{row.original.signatureCatchPhrase}&quot;</h1>
        </div>
      </div>
    ),
    renderRowActionMenuItems: ({ closeMenu }) => [
      <DropdownMenuItem
        key={0}
        onClick={() => {
          // View profile logic...
          closeMenu();
        }}
        className="m-0"
      >
        <CircleUserIcon />
        View Profile
      </DropdownMenuItem>,
      <DropdownMenuItem
        key={1}
        onClick={() => {
          // Send email logic...
          closeMenu();
        }}
        className="m-0"
      >
        <SendIcon />
        Send Email
      </DropdownMenuItem>,
    ],
    renderTopToolbar: ({ table }) => {
      const handleDeactivate = () => {
        table.getSelectedRowModel().flatRows.map((row) => {
          alert('deactivating ' + row.getValue('name'));
        });
      };

      const handleActivate = () => {
        table.getSelectedRowModel().flatRows.map((row) => {
          alert('activating ' + row.getValue('name'));
        });
      };

      const handleContact = () => {
        table.getSelectedRowModel().flatRows.map((row) => {
          alert('contact ' + row.getValue('name'));
        });
      };

      return (
        <div className="flex justify-between gap-2 p-2">
          <div className="flex items-center gap-2">
            {/* import ST sub-components */}
            <ST_GlobalFilterTextField table={table} />
            <ST_ToggleFiltersButton table={table} />
          </div>
          <div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="text-destructive"
                disabled={!table.getIsSomeRowsSelected()}
                onClick={handleDeactivate}
              >
                Deactivate
              </Button>
              <Button
                size="sm"
                variant="default"
                disabled={!table.getIsSomeRowsSelected()}
                onClick={handleActivate}
              >
                Activate
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={!table.getIsSomeRowsSelected()}
                onClick={handleContact}
              >
                Contact
              </Button>
            </div>
          </div>
        </div>
      );
    },
  });

  return <ShadcnTable table={table} />;
};

export default Example;
