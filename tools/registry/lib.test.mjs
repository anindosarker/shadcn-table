// Usage (repo root): node --test tools/registry/lib.test.mjs
// The import scan behind every core item's registryDependencies: a fixture
// library file importing the date picker gives that base's picker item at
// DATE_PICKER_TAG, in the plain build and under `--dev` (spec 81). The fixture
// lives in a temporary folder, never in a tree.
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { after, test } from 'node:test';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { BASES, DATE_PICKER_TAG, importDependencies } from './lib.mjs';

const LIB = pathToFileURL(
  path.join(path.dirname(fileURLToPath(import.meta.url)), 'lib.mjs'),
).href;
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'st-lib-test-'));
after(() => fs.rmSync(dir, { recursive: true, force: true }));

const fixture = (name, source) => {
  const file = path.join(dir, name);
  fs.writeFileSync(file, source);
  return file;
};
const withPicker = fixture(
  'ST_FilterDate.tsx',
  `import { DatePicker } from '@/components/date-picker/date-picker';
import { Button } from '@/components/ui/button';
import { ST_Localization_EN } from '@/components/ui/shadcn-table';
export const X = [DatePicker, Button, ST_Localization_EN];
`,
);
const withoutPicker = fixture(
  'ST_Plain.tsx',
  `import { Popover } from "@/components/ui/popover";
export const Y = Popover;
`,
);

const address = (base) =>
  `anindosarker/shadcn-date-picker/date-picker-${base}#${DATE_PICKER_TAG}`;

for (const base of BASES) {
  test(`${base}: the picker import adds the picker item (plain build)`, () => {
    assert.deepEqual(importDependencies([withPicker, withoutPicker], base), [
      'button',
      'popover',
      address(base),
    ]);
  });

  test(`${base}: the picker import adds the picker item (--dev)`, () => {
    const out = execFileSync(
      process.execPath,
      [
        '--input-type=module',
        '-e',
        `const { importDependencies } = await import(${JSON.stringify(LIB)});
console.log(JSON.stringify(importDependencies(${JSON.stringify([withPicker])}, ${JSON.stringify(base)})));`,
        '--',
        '--dev',
      ],
      { encoding: 'utf8' },
    );
    assert.deepEqual(JSON.parse(out), ['button', address(base)]);
  });

  test(`${base}: no picker import, no picker item`, () => {
    assert.deepEqual(importDependencies([withoutPicker], base), ['popover']);
  });
}
