import {
  type ST_ColumnDef,
  ST_TablePagination,
  ShadcnTable,
} from '@/components/ui/shadcn-table';
import { expect, waitFor, within } from 'storybook/test';
import { type Meta, type StoryContext } from '@storybook/react-vite';

// A `ShadcnTable` inside another table's `renderDetailPanel` (decisions item
// 4): context readers and custom renderers of each table read their own
// table. Fixed data so every assertion is deterministic.

const meta: Meta = {
  title: 'Features/Nested Table',
};

export default meta;

type Person = { firstName: string };

const outerRows: Person[] = [
  { firstName: 'Mason' },
  { firstName: 'Lily' },
  { firstName: 'Jackson' },
];

const innerRows: Person[] = [
  { firstName: 'Inner1' },
  { firstName: 'Inner2' },
  { firstName: 'Inner3' },
  { firstName: 'Inner4' },
  { firstName: 'Inner5' },
];

// A reader inside each table's toolbar: the row summary tells which table the
// context served (`1-3 of 3` outer, `1-5 of 5` inner).
const PaginationReader = ({ label }: { label: string }) => (
  <div data-testid={label}>
    <ST_TablePagination showRowsPerPage={false} />
  </div>
);

const innerColumns: ST_ColumnDef<Person>[] = [
  {
    accessorKey: 'firstName',
    header: 'Inner',
    Cell: ({ renderedCellValue, table }) => (
      <span data-testid="inner-cell">
        {renderedCellValue} ({table.options.data.length})
      </span>
    ),
  },
];

const outerColumns: ST_ColumnDef<Person>[] = [
  {
    accessorKey: 'firstName',
    header: 'First Name',
    Cell: ({ renderedCellValue, table }) => (
      <span data-testid="outer-cell">
        {renderedCellValue} ({table.options.data.length})
      </span>
    ),
    Header: ({ table }) => (
      <span data-testid="outer-header">
        First Name ({table.options.data.length})
      </span>
    ),
    Footer: ({ table }) => (
      <span data-testid="outer-footer">
        Footer ({table.options.data.length})
      </span>
    ),
  },
];

// Custom renderers print `table.options.data.length`: the outer renderers
// see 3, the inner ones 5, and each one proves `table` arrived.
export const NestedDetailPanelTable = {
  render: () => (
    <ShadcnTable
      columns={outerColumns}
      data={outerRows}
      enableRowActions
      initialState={{ expanded: true }}
      renderDetailPanel={({ row, table }) => (
        <div data-testid={`detail-${row.id}`}>
          <span data-testid="outer-detail">
            Detail ({table.options.data.length})
          </span>
          <ShadcnTable
            columns={innerColumns}
            data={innerRows}
            enableBottomToolbar={false}
            renderTopToolbarCustomActions={() => (
              <PaginationReader label="inner-reader" />
            )}
          />
        </div>
      )}
      renderRowActions={({ table }) => (
        <span data-testid="outer-row-actions">
          Actions ({table.options.data.length})
        </span>
      )}
      renderTopToolbarCustomActions={() => (
        <PaginationReader label="outer-reader" />
      )}
    />
  ),
  play: async ({ canvasElement }: StoryContext) => {
    const canvas = within(canvasElement);
    await waitFor(() =>
      expect(canvas.getByTestId('outer-reader')).toHaveTextContent('1-3 of 3'),
    );
    // every inner reader shows the inner table, never the outer one
    for (const reader of canvas.getAllByTestId('inner-reader')) {
      expect(reader).toHaveTextContent('1-5 of 5');
    }
    expect(canvas.getAllByTestId('inner-reader').length).toBe(3);
    expect(canvas.getAllByTestId('outer-cell')[0]).toHaveTextContent('(3)');
    expect(canvas.getByTestId('outer-header')).toHaveTextContent('(3)');
    expect(canvas.getByTestId('outer-footer')).toHaveTextContent('(3)');
    expect(canvas.getAllByTestId('outer-row-actions')[0]).toHaveTextContent(
      '(3)',
    );
    expect(canvas.getAllByTestId('outer-detail')[0]).toHaveTextContent('(3)');
    expect(canvas.getAllByTestId('inner-cell')[0]).toHaveTextContent('(5)');
    // inner tables: 3 panels of 5 rows each, beside the 3 outer rows
    expect(canvas.getAllByTestId('inner-cell').length).toBe(15);
  },
};
