import { InstallCommand } from '@/components/dev-home/shared/install-command';

/** Two tones: keywords in accent, strings in ink. */
const TOKEN = /('[^']*'|\b(?:import|from|const|return)\b)/g;

function Code({ code }: { code: string }) {
  return (
    <pre className="v7-code">
      <code>
        {code.split(TOKEN).map((part, i) =>
          i % 2 === 0 ? (
            part
          ) : (
            <span key={i} className={part.startsWith("'") ? 's' : 'k'}>
              {part}
            </span>
          ),
        )}
      </code>
    </pre>
  );
}

/* Snippets follow content/docs/getting-started/usage.mdx. */
const COLUMNS_SNIPPET = `const columns = useMemo<SRT_ColumnDef<Person>[]>(
  () => [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'age', header: 'Age' },
  ],
  [],
);`;

const RENDER_SNIPPET = `import {
  ShadcnReactTable,
  useShadcnReactTable,
} from '@/components/ui/shadcn-react-table';

const table = useShadcnReactTable({ columns, data });

return <ShadcnReactTable table={table} />;`;

/** Install, define columns, render: three cells in one hairline strip. */
export function CodeStrip() {
  return (
    <ol className="v7-strip">
      <li className="v7-step">
        <p className="v7-step-n">Step 1</p>
        <h3 className="v7-step-title">Run the CLI</h3>
        <p className="v7-step-body">
          In a shadcn/ui project, this adds the table files to
          components/ui/shadcn-react-table.
        </p>
        <InstallCommand variant="bare" className="v7-install-cmd" />
      </li>
      <li className="v7-step">
        <p className="v7-step-n">Step 2</p>
        <h3 className="v7-step-title">Define columns</h3>
        <p className="v7-step-body">
          Columns are TanStack Table column definitions, typed as SRT_ColumnDef.
          Wrap them in useMemo so they stay stable between renders.
        </p>
        <Code code={COLUMNS_SNIPPET} />
      </li>
      <li className="v7-step">
        <p className="v7-step-n">Step 3</p>
        <h3 className="v7-step-title">Render</h3>
        <p className="v7-step-body">
          Pass columns, data and any table options to useShadcnReactTable, then
          render ShadcnReactTable with the result.
        </p>
        <Code code={RENDER_SNIPPET} />
      </li>
    </ol>
  );
}
