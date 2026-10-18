'use client';

import { useMemo } from 'react';
import { ShadcnTable, type ST_ColumnDef } from '@/components/ui/shadcn-table';
import { type TableOption, tableOptions } from '@/lib/prop-tables/tableOptions';
import { InlineCode } from './inline-code';
import { PropLink } from './prop-link';
import { useDesktopColumnPinning } from './use-desktop-column-pinning';

interface Props {
  onlyOptions?: Set<TableOption['tableOption']>;
}

export const TableOptionsTable = ({ onlyOptions }: Props) => {
  const columns = useMemo<ST_ColumnDef<TableOption>[]>(
    () => [
      {
        enableClickToCopy: true,
        header: 'Prop Name',
        accessorKey: 'tableOption',
        stCopyButtonProps: ({ cell }) => ({
          className: 'prop',
          id: `${cell.getValue<string>()}-prop`,
        }),
        Cell: ({ renderedCellValue, row }) =>
          row.original?.required ? (
            <strong className="text-primary">{renderedCellValue}*</strong>
          ) : (
            renderedCellValue
          ),
      },
      {
        header: 'Type',
        accessorKey: 'type',
        enableGlobalFilter: false,
        size: 180,
        Cell: ({ cell }) => <InlineCode>{cell.getValue<string>()}</InlineCode>,
      },
      {
        header: 'Default Value',
        accessorKey: 'defaultValue',
        enableGlobalFilter: false,
        size: 130,
        Cell: ({ cell }) => <InlineCode>{cell.getValue<string>()}</InlineCode>,
      },
      {
        header: 'Description',
        accessorKey: 'description',
        enableGlobalFilter: false,
      },
      {
        header: 'More Info Links',
        accessorKey: 'link',
        enableColumnFilter: false,
        enableGlobalFilter: false,
        size: 180,
        Cell: ({ cell, row }) => (
          <PropLink href={cell.getValue<string>()} source={row.original.source}>
            {row.original?.linkText}
          </PropLink>
        ),
      },
    ],
    [],
  );

  const [columnPinning, setColumnPinning] =
    useDesktopColumnPinning('tableOption');

  const data = useMemo(() => {
    if (onlyOptions) {
      return tableOptions.filter(({ tableOption }) =>
        onlyOptions.has(tableOption),
      );
    }
    return tableOptions;
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
          sorting: [{ id: 'tableOption', desc: false }],
        }}
        stSearchTextFieldProps={{
          placeholder: 'Search All Props',
          className: 'min-w-[18rem]',
        }}
        stTableLayoutProps={{
          className: 'mb-6',
          id: onlyOptions ? 'relevant-props-table' : 'props-table',
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

export default TableOptionsTable;
