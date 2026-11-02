// Writes `tsconfig.<PORT>.json` (`{ "extends": "./tsconfig.json" }`, git
// ignored) before `next dev` on a port other than 5320 (NEXT_DEV=1, set by the
// dev script; never for `next start`). next.config.mjs points
// `typescript.tsconfigPath` at it, so any `.next-<PORT>/types` edit Next makes
// to the tsconfig it reads lands in the copy and the committed `tsconfig.json`
// stays as it is.
import { existsSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const port = process.env.PORT;

if (process.env.NEXT_DEV && port && port !== '5320') {
  const file = join(
    dirname(fileURLToPath(import.meta.url)),
    '..',
    `tsconfig.${port}.json`,
  );
  if (!existsSync(file)) {
    writeFileSync(file, `${JSON.stringify({ extends: './tsconfig.json' })}\n`);
  }
}
