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
const COLUMNS_SNIPPET = `const columns = useMemo<ST_ColumnDef<Person>[]>(
  () => [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'age', header: 'Age' },
  ],
  [],
);`;

const RENDER_SNIPPET = `import {
  ShadcnTable,
  useShadcnTable,
} from '@/components/ui/shadcn-table';

const table = useShadcnTable({ columns, data });

return <ShadcnTable table={table} />;`;

/** Install, define columns, render: three cells in one hairline strip. */
export function CodeStrip() {
  return (
    <ol className="v7-strip">
      <li className="v7-step">
        <p className="v7-step-n">Step 01</p>
        <h3 className="v7-step-title">Install</h3>
        <p className="v7-step-body">
          Run a single command to add the table components directly to your
          project.
        </p>
        <InstallCommand variant="bare" className="v7-install-cmd" />
      </li>
      <li className="v7-step">
        <p className="v7-step-n">Step 02</p>
        <h3 className="v7-step-title">Define columns</h3>
        <p className="v7-step-body">
          Describe how your data should be displayed using TanStack Table column
          definitions.
        </p>
        <Code code={COLUMNS_SNIPPET} />
      </li>
      <li className="v7-step">
        <p className="v7-step-n">Step 03</p>
        <h3 className="v7-step-title">Render</h3>
        <p className="v7-step-body">
          Pass in your columns and data. Your table is ready to use.
        </p>
        <Code code={RENDER_SNIPPET} />
      </li>
    </ol>
  );
}
