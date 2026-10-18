'use client';

import { useMemo } from 'react';
import { ShadcnTable, type ST_ColumnDef } from '@/components/ui/shadcn-table';
import {
  type ColumnOption,
  columnOptions,
} from '@/lib/prop-tables/columnOptions';
import { InlineCode } from './inline-code';
import { PropLink } from './prop-link';
import { useDesktopColumnPinning } from './use-desktop-column-pinning';

interface Props {
  onlyOptions?: Set<ColumnOption['columnOption']>;
}

export const ColumnOptionsTable = ({ onlyOptions }: Props) => {
  const columns = useMemo<ST_ColumnDef<ColumnOption>[]>(
    () => [
      {
        accessorKey: 'columnOption',
        enableClickToCopy: true,
        header: 'Column Option',
        stCopyButtonProps: ({ cell }) => ({
          className: 'column-option',
          id: `${cell.getValue<string>()}-column-option`,
        }),
        Cell: ({ renderedCellValue, row }) =>
          row.original?.required ? (
            <strong className="text-primary">{renderedCellValue}*</strong>
          ) : (
            renderedCellValue
          ),
      },
      {
        accessorKey: 'type',
        header: 'Type',
        enableGlobalFilter: false,
        size: 150,
        Cell: ({ cell }) => <InlineCode>{cell.getValue<string>()}</InlineCode>,
      },
      {
        accessorKey: 'defaultValue',
        enableGlobalFilter: false,
        header: 'Default Value',
        size: 130,
        Cell: ({ cell }) => <InlineCode>{cell.getValue<string>()}</InlineCode>,
      },
      {
        accessorKey: 'description',
        enableGlobalFilter: false,
        header: 'Description',
      },
      {
        accessorKey: 'link',
        enableColumnFilter: false,
        enableGlobalFilter: false,
        header: 'More Info Links',
        size: 150,
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
    useDesktopColumnPinning('columnOption');

  const data = useMemo(() => {
    if (onlyOptions) {
      return columnOptions.filter(({ columnOption }) =>
        onlyOptions.has(columnOption),
      );
    }
    return columnOptions;
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
          sorting: [{ id: 'columnOption', desc: false }],
        }}
        stSearchTextFieldProps={{
          placeholder: 'Search Column Options',
          className: 'min-w-[18rem]',
        }}
        stTableLayoutProps={{
          className: 'mb-6',
          id: onlyOptions
            ? 'relevant-column-options-table'
            : 'column-options-table',
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

export default ColumnOptionsTable;
