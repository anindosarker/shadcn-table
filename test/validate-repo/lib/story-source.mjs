// story-source, a check of `pnpm test validate-repo` (spec 66, 1.6.6, D142):
// every story has a code text (tools/story-source/extract.mjs, the text the
// Storybook Code tab and the docs story pages show) that stands alone and
// holds no test. Per story: the text exists, parses as TSX, every name it
// uses is declared in it, imported in it or a global (the TypeScript checker
// over all texts at once, the "Cannot find name" errors only), it renders the
// table (`<ShadcnTable`, or a library part that renders it; NO_TABLE names the
// stories that render none), and it holds none
// of `play`, `expect(`, `storybook/test`, `userEvent`. It prints one line and
// returns the problems; it never edits a file.
import fs from 'node:fs';
import path from 'node:path';
import {
  readStories,
  STORIES_DIR,
} from '../../../apps/shadcn-table-docs/lib/story-pages.mjs';
import {
  storyCode,
  TEST_WORDS,
  ts,
} from '../../../tools/story-source/extract.mjs';
/** The table: the component, the hook, or a library part (`ST_...`). */
const TABLE = /<ShadcnTable\b|\buseShadcnTable\(|<ST_\w+/;
/**
 * Stories that render no table at all, so their text has none either: the
 * view settings icon grid (every icon set's icons side by side).
 */
const NO_TABLE = new Set(['features-view-settings--edition-icons-render']);
/** "Cannot find name", "Cannot find namespace", shorthand without a value. */
const NOT_FOUND = new Set([2304, 2552, 2503, 2580, 2581, 2582, 2583, 18004]);

/**
 * Every story's code text, keyed by story id, with the stories as
 * readStories gives them. A story whose text cannot be made has `error`.
 */
export async function storyTexts() {
  const stories = await readStories();
  const files = new Map();
  return stories.map((story) => {
    const file = path.join(STORIES_DIR, story.file);
    if (!files.has(file)) files.set(file, fs.readFileSync(file, 'utf8'));
    try {
      const text = storyCode({
        fileText: files.get(file),
        exportName: story.exportName,
        file,
      });
      return { ...story, text };
    } catch (error) {
      return { ...story, error: error.message };
    }
  });
}

/** The names each text uses and does not declare, import or find as a global. */
export function missingNames(texts) {
  const files = new Map(
    texts.map(({ id, text }) => [`/story-source/${id}.tsx`, text]),
  );
  const options = {
    jsx: ts.JsxEmit.Preserve,
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    lib: ['lib.es2023.d.ts', 'lib.dom.d.ts', 'lib.dom.iterable.d.ts'],
    noResolve: true,
    noEmit: true,
    skipLibCheck: true,
    types: [],
  };
  const host = ts.createCompilerHost(options);
  const getSourceFile = host.getSourceFile.bind(host);
  host.getSourceFile = (name, version) =>
    files.has(name)
      ? ts.createSourceFile(
          name,
          files.get(name),
          version,
          true,
          ts.ScriptKind.TSX,
        )
      : getSourceFile(name, version);
  host.fileExists = (name) => files.has(name) || ts.sys.fileExists(name);
  host.readFile = (name) => files.get(name) ?? ts.sys.readFile(name);
  const program = ts.createProgram([...files.keys()], options, host);
  const result = new Map();
  for (const name of files.keys()) {
    const sf = program.getSourceFile(name);
    const syntax = program.getSyntacticDiagnostics(sf);
    const missing = syntax.length
      ? [
          `does not parse: ${ts.flattenDiagnosticMessageText(syntax[0].messageText, ' ')}`,
        ]
      : program
          .getSemanticDiagnostics(sf)
          .filter((d) => NOT_FOUND.has(d.code))
          .map((d) => ts.flattenDiagnosticMessageText(d.messageText, ' '));
    result.set(name.slice('/story-source/'.length, -'.tsx'.length), [
      ...new Set(missing),
    ]);
  }
  return result;
}

/** @param {(line: string) => void} log */
export const check = async (log) => {
  const problems = [];
  const texts = await storyTexts();
  const made = texts.filter((story) => story.text !== undefined);
  for (const story of texts) {
    const where = `story "${story.id}" (${story.file}, ${story.exportName})`;
    if (story.error) {
      problems.push(`${where} has no code text: ${story.error}`);
      continue;
    }
    if (!NO_TABLE.has(story.id) && !TABLE.test(story.text))
      problems.push(`${where}: its code text renders no table`);
    const word = TEST_WORDS.exec(story.text);
    if (word)
      problems.push(`${where}: its code text holds a test ("${word[0]}")`);
  }
  const missing = missingNames(made);
  for (const story of made) {
    const names = missing.get(story.id) ?? [];
    if (names.length)
      problems.push(
        `story "${story.id}" (${story.file}): its code text does not stand alone: ${names.join('; ')}`,
      );
  }
  log(
    `story-source: ${texts.length} stories, ${made.length} with a code text, ${problems.length} problems`,
  );
  return problems;
};
