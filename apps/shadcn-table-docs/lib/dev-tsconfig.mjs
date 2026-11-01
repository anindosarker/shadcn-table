// Writes `tsconfig.<PORT>.json` (`{ "extends": "./tsconfig.json" }`, git
// ignored) before `next dev` on a port other than 5320. next.config.mjs points
// `typescript.tsconfigPath` at it, so Next appends `.next-<PORT>/types` to the
// copy and the committed `tsconfig.json` stays as it is.
import { existsSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const port = process.env.PORT;

if (port && port !== '5320') {
  const file = join(
    dirname(fileURLToPath(import.meta.url)),
    '..',
    `tsconfig.${port}.json`,
  );
  if (!existsSync(file)) {
    writeFileSync(file, `${JSON.stringify({ extends: './tsconfig.json' })}\n`);
  }
}
