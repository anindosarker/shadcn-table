// The end of every run: the JSON record under test/.out/ and the summary
// line, `<name> (<base>): <summary>` or `<name> (<base>): FAIL <summary>`,
// the last line a run prints. Under --ci the errors become `::error::`
// annotations and the summary a `::notice::`.
import fs from 'node:fs';
import path from 'node:path';

/** `typecheck-radix`, `installation-e2e-fresh` or `lint`. */
export const recordName = ({ name, base, scenario }) =>
  [name, base ?? scenario].filter(Boolean).join('-');

/** `typecheck (radix)` or `lint`. */
export const label = ({ name, base, scenario }) =>
  base || scenario ? `${name} (${base ?? scenario})` : name;

export const summaryLine = (record) =>
  `${label(record)}: ${record.status === 'pass' ? '' : 'FAIL '}${record.summary}`;

/** Writes test/.out/<record name>.json and returns its path. */
export const writeRecord = (out, record) => {
  fs.mkdirSync(out, { recursive: true });
  const file = path.join(out, `${recordName(record)}.json`);
  fs.writeFileSync(file, JSON.stringify(record, null, 2) + '\n');
  return file;
};

const escape = (text) =>
  String(text).replace(/%/g, '%25').replace(/\r/g, '%0D').replace(/\n/g, '%0A');

/** Prints the annotations (under --ci) and the summary line. */
export const report = (record, { ci }) => {
  if (ci) {
    for (const error of record.errors ?? []) {
      console.log(`::error title=${label(record)}::${escape(error)}`);
    }
    if (record.status === 'pass') {
      console.log(`::notice title=${label(record)}::${escape(record.summary)}`);
    } else if (!record.errors?.includes(record.summary)) {
      console.log(`::error title=${label(record)}::${escape(record.summary)}`);
    }
  } else if (record.errors?.length) {
    console.log('');
    for (const error of record.errors) console.log(`  ${error}`);
  }
  console.log(summaryLine(record));
};
