// Usage (repo root): node --test tools/story-source/extract.test.mjs
// One fixture per story shape no story of packages/shadcn-table/stories
// reaches today (spec 66): args without a render, a relative import from
// another story file, render written as a method.
import assert from 'node:assert/strict';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { storyCode, TEST_WORDS } from './extract.mjs';

const STORIES_DIR = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../../packages/shadcn-table/stories',
);

const META_AND_DATA = `import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { ShadcnTable, type ST_ColumnDef } from '@/components/ui/shadcn-table';

type Person = { name: string };

const data: Person[] = [{ name: 'Ada' }];

const columns: ST_ColumnDef<Person>[] = [{ accessorKey: 'name', header: 'Name' }];

const unused = 1;

const meta = {
  title: 'Fixture',
  component: ShadcnTable,
  args: { columns, data, enableSorting: false },
} satisfies Meta<typeof ShadcnTable>;

export default meta;
`;

test('args without render: the meta component with the args as props', () => {
  const fileText = `${META_AND_DATA}
export const Plain: StoryObj<typeof meta> = {
  args: { enableRowNumbers: true, layoutMode: 'grid' },
  play: async ({ canvasElement }) => {
    await within(canvasElement).findByText('Ada');
    expect(1).toBe(1);
  },
};
`;
  const text = storyCode({ fileText, exportName: 'Plain' });
  assert.match(
    text,
    /const Plain = \(\) => \(\n {2}<ShadcnTable\n {4}columns=\{columns\}\n {4}data=\{data\}\n {4}enableSorting=\{false\}\n {4}enableRowNumbers\n {4}layoutMode="grid"\n {2}\/>\n\);\n\nexport default Plain;\n$/,
  );
  assert.match(
    text,
    /^import \{ ShadcnTable, type ST_ColumnDef \} from '@\/components\/ui\/shadcn-table';\n/,
  );
  assert.ok(text.includes('const data: Person[]'));
  assert.ok(text.includes('const columns: ST_ColumnDef<Person>[]'));
  assert.ok(text.includes('type Person'));
  assert.ok(!text.includes('unused'), 'a declaration the table does not use');
  assert.ok(!text.includes('meta'), 'the meta is left out');
  assert.ok(!text.includes('storybook'), 'no Storybook import');
  assert.ok(!TEST_WORDS.test(text), 'no test');
});

test('relative import from another story file: its declarations, one import line per module', () => {
  // the story imports from stories/Basic.stories.tsx, which imports the
  // library module too
  const fileText = `import type { StoryObj } from '@storybook/react-vite';
import { ShadcnTable } from '@/components/ui/shadcn-table';
import { addressColumns } from '../Basic.stories';

export default { title: 'Fixture' };

export const Imported: StoryObj = {
  render: () => <ShadcnTable columns={addressColumns} data={[]} />,
};
`;
  const text = storyCode({
    fileText,
    exportName: 'Imported',
    file: path.join(STORIES_DIR, 'features', 'Fixture.stories.tsx'),
  });
  const libraryLines = text
    .split('\n')
    .filter((line) => line.includes("'@/components/ui/shadcn-table'"));
  assert.equal(libraryLines.length, 1, text);
  assert.match(text, /import \{\s*ShadcnTable,\s*type ST_ColumnDef\s*\}/);
  assert.ok(text.includes('const addressColumns'), 'the imported declaration');
  assert.ok(text.includes('type Address'), 'the type it uses');
  assert.ok(!text.includes('../Basic.stories'), 'no relative import line');
  assert.ok(
    text.indexOf('const addressColumns') < text.indexOf('const Imported'),
    'declarations before the component',
  );
  assert.ok(!TEST_WORDS.test(text), 'no test');
});

test('render written as a method throws', () => {
  const fileText = `${META_AND_DATA}
export const Method: StoryObj<typeof meta> = {
  render() {
    return <ShadcnTable columns={columns} data={data} />;
  },
};
`;
  assert.throws(
    () => storyCode({ fileText, exportName: 'Method' }),
    /a story writes render as a method/,
  );
});
