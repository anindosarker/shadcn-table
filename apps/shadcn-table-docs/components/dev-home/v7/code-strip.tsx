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
        <p className="v7-step-n">01 / Install</p>
        <h3 className="v7-step-title">Add the source</h3>
        <p className="v7-step-body">
          The shadcn CLI writes the table into components/ui/shadcn-table, next
          to your other shadcn/ui components.
        </p>
        <InstallCommand variant="bare" className="v7-install-cmd" />
      </li>
      <li className="v7-step">
        <p className="v7-step-n">02 / Define columns</p>
        <h3 className="v7-step-title">Describe the data</h3>
        <p className="v7-step-body">
          Columns are TanStack Table column defs, typed with ST_ColumnDef. Keep
          them memoized.
        </p>
        <Code code={COLUMNS_SNIPPET} />
      </li>
      <li className="v7-step">
        <p className="v7-step-n">03 / Render</p>
        <h3 className="v7-step-title">Hand it to the hook</h3>
        <p className="v7-step-body">
          useShadcnTable takes columns, data and any feature props. The
          component renders the result.
        </p>
        <Code code={RENDER_SNIPPET} />
      </li>
    </ol>
  );
}
