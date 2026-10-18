import { promises as fs } from 'node:fs';
import path from 'node:path';
import { highlight } from 'fumadocs-core/highlight';
import { CodeBlock, Pre } from 'fumadocs-ui/components/codeblock';
import { SourceToggle } from '@/components/prop-tables/source-toggle';

interface Props {
  /** File name under components/prop-tables, shown as the code block title. */
  file: string;
  /** Anchor prefix, same as MRT's `tableId` for the page. */
  tableId: string;
}

/**
 * MRT's `<X>Source` components: "Wanna see the source code for this table?"
 * plus the prop table component's own source behind a Code toggle. Server
 * side: reads components/prop-tables/<file> and highlights it with shiki.
 */
export const PropTableSource = async ({ file, tableId }: Props) => {
  const source = await fs.readFile(
    path.join(process.cwd(), 'components', 'prop-tables', file),
    'utf8',
  );
  const rendered = await highlight(
    source.replace(/^'use client';\r?\n\r?\n/, ''),
    {
      lang: 'tsx',
      components: { pre: Pre },
    },
  );

  return (
    <div className="mt-20">
      <p>Wanna see the source code for this table? Check it out down below!</p>
      <SourceToggle
        code={<CodeBlock title={file}>{rendered}</CodeBlock>}
        tableId={tableId}
      />
    </div>
  );
};

export const TableOptionsSource = () => (
  <PropTableSource file="table-options-table.tsx" tableId="root-props" />
);

export const ColumnOptionsSource = () => (
  <PropTableSource file="column-options-table.tsx" tableId="column-options" />
);

export const StateOptionsSource = () => (
  <PropTableSource file="state-options-table.tsx" tableId="state-options" />
);

export const TableInstanceAPIsSource = () => (
  <PropTableSource
    file="table-instance-apis-table.tsx"
    tableId="table-instance-apis"
  />
);

export const ColumnInstanceAPIsSource = () => (
  <PropTableSource
    file="column-instance-apis-table.tsx"
    tableId="column-instance-apis"
  />
);

export const RowInstanceAPIsSource = () => (
  <PropTableSource
    file="row-instance-apis-table.tsx"
    tableId="row-instance-apis"
  />
);

export const CellInstanceAPIsSource = () => (
  <PropTableSource
    file="cell-instance-apis-table.tsx"
    tableId="cell-instance-apis"
  />
);
