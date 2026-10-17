'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  ShadcnReactTable,
  type SRT_ColumnDef,
  type SRT_ColumnPinningState,
} from '@/components/ui/shadcn-react-table';
import { type TableOption, tableOptions } from '@/lib/prop-tables/tableOptions';
import { useMediaQuery } from '@/lib/use-media-query';
import { InlineCode } from './inline-code';
import { PropLink } from './prop-link';

interface Props {
  onlyOptions?: Set<TableOption['tableOption']>;
}

export const TableOptionsTable = ({ onlyOptions }: Props) => {
  const isDesktop = useMediaQuery('(min-width: 1200px)');

  const columns = useMemo<SRT_ColumnDef<TableOption>[]>(
    () => [
      {
        enableClickToCopy: true,
        header: 'Prop Name',
        accessorKey: 'tableOption',
        srtCopyButtonProps: ({ cell }) => ({
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
        Cell: ({ cell }) => <InlineCode>{cell.getValue<string>()}</InlineCode>,
      },
      {
        header: 'Default Value',
        accessorKey: 'defaultValue',
        enableGlobalFilter: false,
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
        Cell: ({ cell, row }) => (
          <PropLink href={cell.getValue<string>()} source={row.original.source}>
            {row.original?.linkText}
          </PropLink>
        ),
      },
    ],
    [],
  );

  const [columnPinning, setColumnPinning] = useState<SRT_ColumnPinningState>(
    {},
  );

  useEffect(() => {
    if (isDesktop) {
      setColumnPinning({
        left: ['srt-row-expand', 'srt-row-numbers', 'tableOption'],
        right: ['link'],
      });
    } else {
      setColumnPinning({});
    }
  }, [isDesktop]);

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
      <ShadcnReactTable
        columns={columns}
        data={data}
        displayColumnDefOptions={{
          'srt-row-numbers': {
            size: 10,
          },
          'srt-row-expand': {
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
        srtSearchTextFieldProps={{
          placeholder: 'Search All Props',
          className: 'min-w-[18rem]',
        }}
        srtTableLayoutProps={{
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
