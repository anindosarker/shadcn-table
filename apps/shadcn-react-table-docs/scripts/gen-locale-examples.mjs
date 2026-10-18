#!/usr/bin/env node
/**
 * Generates examples/localization-i18n-<code>/ for every MRT locale example
 * from the hand-written examples/localization-i18n-de/ port.
 *
 * For each ../material-react-table-docs/examples/localization-i18n-<code>/
 * the generator takes the de TS.tsx as the template and swaps in that
 * locale's import path, export name and column headers (read from MRT's
 * sandbox/src/TS.tsx); rtl locales (MRT adds columnResizeDirection="rtl")
 * get MRT's extra resizing props and the rtl wrapper. makeData.ts is MRT's
 * file verbatim (the names are localized per locale). index.tsx follows
 * examples/remote/index.tsx.
 *
 * Existing folders are left alone (de is the source, fa belongs to another
 * page) unless --force is passed.
 *
 * Usage: node scripts/gen-locale-examples.mjs [--force]
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const APP_DIR = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
);
const MRT_EXAMPLES = path.resolve(
  APP_DIR,
  '..',
  'material-react-table-docs',
  'examples',
);
const OUT = path.join(APP_DIR, 'examples');
const SOURCE = 'localization-i18n-de';
const force = process.argv.includes('--force');

const pascal = (s) =>
  s
    .split(/[^A-Za-z0-9]+/)
    .filter(Boolean)
    .map((p) => p[0].toUpperCase() + p.slice(1))
    .join('');

async function exists(p) {
  return fs
    .access(p)
    .then(() => true)
    .catch(() => false);
}

/** Locale import path, export name, headers and rtl flag from MRT's TS.tsx. */
function parseMrt(src) {
  const imp = src.match(
    /import \{ (MRT_Localization_[A-Z_]+) \} from 'material-react-table\/(?:src\/)?locales\/([^']+)'/,
  );
  if (!imp) throw new Error('locale import not found');
  // header: 'Vorname' or header: "Ім'я" (uk); keep the quoted literal as is
  const headers = [...src.matchAll(/header: ('[^']*'|"[^"]*")/g)].map(
    (m) => m[1],
  );
  if (headers.length !== 3)
    throw new Error(`expected 3 headers, got ${headers.length}`);
  return {
    exportName: imp[1].replace(/^MRT_/, 'SRT_'),
    localePath: imp[2],
    headers,
    rtl: /columnResizeDirection="rtl"/.test(src),
  };
}

const RTL_PROPS = `      defaultColumn={{ size: 250 }}
      columnResizeDirection="rtl"
`;
const RTL_RESIZING = `      enableColumnResizing
`;
const RTL_WRAPPER = `
//App.tsx or similar
const ExampleWithThemeProvider = () => {
  return (
    //Setting the document direction to rtl as best practice to result in better accessibility
    <div style={{ direction: 'rtl' }}>
      <Example />
    </div>
  );
};

export default ExampleWithThemeProvider;
`;

function render(template, de, locale) {
  let out = template
    .replace(de.exportName, locale.exportName)
    .replace(`locales/${de.localePath}'`, `locales/${locale.localePath}'`)
    .replace(
      `localization={${de.exportName}}`,
      `localization={${locale.exportName}}`,
    );
  de.headers.forEach((h, i) => {
    out = out.replace(`header: ${h}`, `header: ${locale.headers[i]}`);
  });
  if (locale.rtl) {
    out = out
      .replace('      data={data}\n', `      data={data}\n${RTL_PROPS}`)
      .replace(
        '      enableColumnOrdering\n',
        `      enableColumnOrdering\n${RTL_RESIZING}`,
      )
      .replace(/\nexport default Example;\n$/, `\n${RTL_WRAPPER}`);
  }
  return out;
}

async function main() {
  const template = await fs.readFile(path.join(OUT, SOURCE, 'TS.tsx'), 'utf8');
  const de = parseMrt(
    await fs.readFile(
      path.join(MRT_EXAMPLES, SOURCE, 'sandbox', 'src', 'TS.tsx'),
      'utf8',
    ),
  );
  const folders = (await fs.readdir(MRT_EXAMPLES))
    .filter((f) => f.startsWith('localization-i18n-') && f !== SOURCE)
    .sort();
  let written = 0;
  for (const folder of folders) {
    const dest = path.join(OUT, folder);
    if (!force && (await exists(dest))) {
      console.log(`skip  ${folder} (exists)`);
      continue;
    }
    const srcDir = path.join(MRT_EXAMPLES, folder, 'sandbox', 'src');
    const locale = parseMrt(
      await fs.readFile(path.join(srcDir, 'TS.tsx'), 'utf8'),
    );
    await fs.mkdir(dest, { recursive: true });
    await fs.writeFile(path.join(dest, 'TS.tsx'), render(template, de, locale));
    await fs.copyFile(
      path.join(srcDir, 'makeData.ts'),
      path.join(dest, 'makeData.ts'),
    );
    const name = `${pascal(folder)}Example`;
    await fs.writeFile(
      path.join(dest, 'index.tsx'),
      [
        "import { ExampleSnippet } from '@/components/mdx/example-snippet';",
        "import Example from './TS';",
        '',
        `const ${name} = () => (`,
        `  <ExampleSnippet name="${folder}">`,
        '    <Example />',
        '  </ExampleSnippet>',
        ');',
        '',
        `export default ${name};`,
        '',
      ].join('\n'),
    );
    written++;
    console.log(`wrote ${folder}${locale.rtl ? ' (rtl)' : ''}`);
  }
  console.log(`${written} locale examples written`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
