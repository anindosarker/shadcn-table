'use client';

import { useMemo } from 'react';
import {
  ShadcnTable,
  type ST_ColumnDef,
} from '@/components/ui-radix/shadcn-table';
import {
  type TableInstanceAPI,
  tableInstanceAPIs,
} from '@/lib/prop-tables/tableInstanceAPIs';
import { InlineCode } from './inline-code';
import { PropLink } from './prop-link';
import { useDesktopColumnPinning } from './use-desktop-column-pinning';

interface Props {
  onlyOptions?: Set<TableInstanceAPI['tableInstanceAPI']>;
}

export const TableInstanceAPIsTable = ({ onlyOptions }: Props) => {
  const columns = useMemo<ST_ColumnDef<TableInstanceAPI>[]>(
    () => [
      {
        accessorKey: 'tableInstanceAPI',
        enableClickToCopy: true,
        header: 'State Option',
        stCopyButtonProps: ({ cell }) => ({
          className: 'table-instance-api',
          id: `${cell.getValue<string>()}-table-instance-api`,
        }),
      },
      {
        accessorKey: 'type',
        header: 'Type',
        enableGlobalFilter: false,
        Cell: ({ cell }) => <InlineCode>{cell.getValue<string>()}</InlineCode>,
      },
      {
        accessorKey: 'link',
        enableColumnFilter: false,
        enableGlobalFilter: false,
        header: 'More Info Links',
        size: 180,
        Cell: ({ cell, row }) => (
          <PropLink href={cell.getValue<string>()}>
            {row.original?.linkText}
          </PropLink>
        ),
      },
    ],
    [],
  );

  const [columnPinning, setColumnPinning] =
    useDesktopColumnPinning('tableInstanceAPI');

  const data = useMemo(() => {
    if (onlyOptions) {
      return tableInstanceAPIs.filter(({ tableInstanceAPI }) =>
        onlyOptions.has(tableInstanceAPI),
      );
    }
    return tableInstanceAPIs;
  }, [onlyOptions]);

  return (
    <div className="not-prose">
      <ShadcnTable
        columns={columns}
        data={data}
        displayColumnDefOptions={{
          'st-row-numbers': {
            size: 10,
          },
          'st-row-expand': {
            size: 10,
          },
        }}
        enableColumnActions={!onlyOptions}
        enableColumnFilterModes
        enablePagination={false}
        enableColumnPinning
        enableRowNumbers
        enableBottomToolbar={false}
        enableTopToolbar={!onlyOptions}
        initialState={{
          columnVisibility: { description: false },
          density: 'compact',
          showGlobalFilter: true,
          sorting: [{ id: 'tableInstanceAPI', desc: false }],
        }}
        stSearchTextFieldProps={{
          placeholder: 'Search Table APIs',
          className: 'min-w-[18rem]',
        }}
        stTableLayoutProps={{
          className: 'mb-6',
          id: onlyOptions
            ? 'relevant-table-instance-apis-table'
            : 'table-instance-apis-table',
        }}
        positionGlobalFilter="left"
        renderDetailPanel={({ row }) => (
          <p
            className={
              row.original.description
                ? 'text-foreground'
                : 'text-muted-foreground'
            }
          >
            {row.original.description || 'No Description Provided... Yet...'}
          </p>
        )}
        rowNumberDisplayMode="static"
        onColumnPinningChange={setColumnPinning}
        state={{ columnPinning }}
      />
    </div>
  );
};

export default TableInstanceAPIsTable;
