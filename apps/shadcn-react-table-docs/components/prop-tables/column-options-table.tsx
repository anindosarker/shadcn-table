'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  ShadcnReactTable,
  type SRT_ColumnDef,
  type SRT_ColumnPinningState,
} from '@/components/ui/shadcn-react-table';
import {
  type ColumnOption,
  columnOptions,
} from '@/lib/prop-tables/columnOptions';
import { useMediaQuery } from '@/lib/use-media-query';
import { InlineCode } from './inline-code';
import { PropLink } from './prop-link';

interface Props {
  onlyOptions?: Set<ColumnOption['columnOption']>;
}

export const ColumnOptionsTable = ({ onlyOptions }: Props) => {
  const isDesktop = useMediaQuery('(min-width: 1200px)');

  const columns = useMemo<SRT_ColumnDef<ColumnOption>[]>(
    () => [
      {
        accessorKey: 'columnOption',
        enableClickToCopy: true,
        header: 'Column Option',
        srtCopyButtonProps: ({ cell }) => ({
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
        size: 180,
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

  const [columnPinning, setColumnPinning] = useState<SRT_ColumnPinningState>(
    {},
  );

  useEffect(() => {
    if (isDesktop) {
      setColumnPinning({
        left: ['srt-row-expand', 'srt-row-numbers', 'columnOption'],
        right: ['link'],
      });
    } else {
      setColumnPinning({});
    }
  }, [isDesktop]);

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
          sorting: [{ id: 'columnOption', desc: false }],
        }}
        srtSearchTextFieldProps={{
          placeholder: 'Search Column Options',
          className: 'min-w-[18rem]',
        }}
        srtTableLayoutProps={{
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
