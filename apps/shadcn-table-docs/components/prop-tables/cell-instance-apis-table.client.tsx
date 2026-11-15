'use client';

import { useMemo } from 'react';
import {
  ShadcnTable,
  type ST_ColumnDef,
} from '@/components/ui-radix/shadcn-table';
import {
  type CellInstanceAPI,
  cellInstanceAPIs,
} from '@/lib/prop-tables/cellInstanceAPIs';
import { InlineCode } from './inline-code';
import { PropLink } from './prop-link';
import { useDesktopColumnPinning } from './use-desktop-column-pinning';

interface Props {
  onlyOptions?: Set<CellInstanceAPI['cellInstanceAPI']>;
}

export const CellInstanceAPIsTable = ({ onlyOptions }: Props) => {
  const columns = useMemo<ST_ColumnDef<CellInstanceAPI>[]>(
    () => [
      {
        accessorKey: 'cellInstanceAPI',
        enableClickToCopy: true,
        header: 'State Option',
        stCopyButtonProps: ({ cell }) => ({
          className: 'cell-instance-api',
          id: `${cell.getValue<string>()}-cell-instance-api`,
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
    useDesktopColumnPinning('cellInstanceAPI');

  const data = useMemo(() => {
    if (onlyOptions) {
      return cellInstanceAPIs.filter(({ cellInstanceAPI }) =>
        onlyOptions.has(cellInstanceAPI),
      );
    }
    return cellInstanceAPIs;
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
          sorting: [{ id: 'cellInstanceAPI', desc: false }],
        }}
        stSearchTextFieldProps={{
          placeholder: 'Search Cell APIs',
          className: 'min-w-[18rem]',
        }}
        stTableLayoutProps={{
          className: 'mb-6',
          id: onlyOptions
            ? 'relevant-cell-instance-apis-table'
            : 'cell-instance-apis-table',
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

export default CellInstanceAPIsTable;
