import { InstallCommand } from '@/components/dev-home/shared/install-command';

/** Two tones: keywords in accent, strings in ink. */
const TOKEN = /('[^']*'|\b(?:import|from|const|return)\b)/g;

function Code({ code }: { code: string }) {
  return (
    <pre className="v10-code">
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

const RENDER_SNIPPET = `const table = useShadcnTable({
  columns,
  data,
  enableColumnPinning: true,
});

return <ShadcnTable table={table} />;`;

/** Install, define columns, render: three glass panels in a row. */
export function CodeStrip() {
  return (
    <ol className="v10-strip">
      <li className="v10-step">
        <p className="v10-eyebrow">
          <span>01</span> Install
        </p>
        <h3 className="v10-step-title">Add the source</h3>
        <p className="v10-step-body">
          The shadcn CLI writes the table into your project, next to your other
          shadcn/ui components.
        </p>
        <InstallCommand variant="bare" className="v10-install-cmd" />
      </li>
      <li className="v10-step">
        <p className="v10-eyebrow">
          <span>02</span> Define columns
        </p>
        <h3 className="v10-step-title">Describe the data</h3>
        <p className="v10-step-body">
          Columns are TanStack Table column defs, typed with ST_ColumnDef. Keep
          them memoized.
        </p>
        <Code code={COLUMNS_SNIPPET} />
      </li>
      <li className="v10-step">
        <p className="v10-eyebrow">
          <span>03</span> Render
        </p>
        <h3 className="v10-step-title">Turn features on</h3>
        <p className="v10-step-body">
          useShadcnTable takes columns, data and any feature props. The
          component renders the result.
        </p>
        <Code code={RENDER_SNIPPET} />
      </li>
    </ol>
  );
}
