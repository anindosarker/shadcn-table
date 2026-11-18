/**
 * The code text of one Storybook story (spec 66, 1.6.3, D142): the table the
 * story renders, as one component, with every import and every declaration of
 * the story file it needs, and nothing of its test. The Storybook Code tab
 * (packages/shadcn-table/.storybook/story-source-plugin.ts) and the docs story
 * pages show this text; `pnpm test validate-repo` (story-source) proves that
 * it stands alone for every story.
 *
 * The text, top to bottom:
 *   - the package imports the text uses, only the names used; `storybook/test`
 *     and the Storybook packages are left out, `@story-support/<part>` (the
 *     story-only parts of a base) is written as `@/components/ui/<part>`, as
 *     the docs copies map it (apps/shadcn-table-docs/lib/story-variants.mjs);
 *   - `ST_BASE` of `.storybook/themes`, when used, as a constant;
 *   - the declarations of a file imported from a relative path inside
 *     stories/, then those of the story file, each in file order: every
 *     top-level declaration the component uses, followed through the names it
 *     uses in turn (columns, data, types, helpers, the wrapped component);
 *   - the component, `export default function <StoryExport>()`: an arrow or
 *     function story's body, an object story's `render`, the render of the
 *     object a story factory returns (`pinStory({...})`), or the meta's
 *     `render` or `component`. The story's args (the meta's, then the
 *     story's) are written out: `{...args}` as props, `args.x` as its value,
 *     any other use as a `const` of the args object.
 * Left out: `play`, `parameters`, `tags`, `argTypes`, `beforeEach`, the meta,
 * the default export and every declaration only those use.
 *
 * TypeScript compiler API, no text matching. Usage:
 *   storyCode({ fileText, exportName, file }) -> string
 *   await storySources() -> { [story id]: string }, every story
 * `file` (the story file's path) is needed only when the file imports from a
 * relative path inside stories/. Throws when the story has a shape it cannot
 * read.
 */
import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';

const require = createRequire(
  new URL('../../packages/shadcn-table/package.json', import.meta.url),
);
/** @type {typeof import('typescript')} */
const ts = require('typescript');

/** Imports the text never carries: the test and the Storybook types. */
const DROPPED_MODULE = /^(storybook($|\/)|@storybook\/)/;
/** The story-only parts of a base, written as the docs copies map them. */
const STORY_SUPPORT = '@story-support/';
/** `.storybook/themes`: the names a story reads from it, as constants. */
const THEMES_MODULE = /(^|\/)\.storybook\/themes$/;
const THEMES_NAMES = {
  ST_BASE: [
    "// The base this example renders on: 'base', 'radix' or 'aria'.",
    "const ST_BASE: 'base' | 'radix' | 'aria' = 'base';",
  ].join('\n'),
};
const STORIES_DIR = path.resolve(
  path.dirname(new URL(import.meta.url).pathname),
  '../../packages/shadcn-table/stories',
);
const LINE_WIDTH = 80;

const parse = (text, fileName) =>
  ts.createSourceFile(
    fileName,
    text,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );

/** Strips parentheses, `as`, `satisfies` and `!` around an expression. */
function unwrap(node) {
  let current = node;
  while (
    current &&
    (ts.isParenthesizedExpression(current) ||
      ts.isAsExpression(current) ||
      ts.isSatisfiesExpression(current) ||
      ts.isNonNullExpression(current) ||
      ts.isTypeAssertionExpression(current))
  )
    current = current.expression;
  return current;
}

const hasModifier = (node, kind) =>
  !!node.modifiers?.some((modifier) => modifier.kind === kind);

/** Adds the names a binding (identifier or pattern) declares to `out`. */
function bindingNames(name, out) {
  if (ts.isIdentifier(name)) out.add(name.text);
  else
    for (const element of name.elements)
      if (!ts.isOmittedExpression(element)) bindingNames(element.name, out);
}

/** True when `node` is an identifier in a place that names a value or type. */
function isReference(node) {
  const parent = node.parent;
  if (!parent) return true;
  if (ts.isPropertyAccessExpression(parent) && parent.name === node)
    return false;
  if (ts.isQualifiedName(parent) && parent.right === node) return false;
  if (
    (ts.isPropertyAssignment(parent) ||
      ts.isMethodDeclaration(parent) ||
      ts.isPropertyDeclaration(parent) ||
      ts.isPropertySignature(parent) ||
      ts.isMethodSignature(parent) ||
      ts.isGetAccessor(parent) ||
      ts.isSetAccessor(parent) ||
      ts.isEnumMember(parent)) &&
    parent.name === node
  )
    return false;
  if (ts.isJsxAttribute(parent) && parent.name === node) return false;
  if (ts.isBindingElement(parent) && parent.propertyName === node) return false;
  if (
    (ts.isImportSpecifier(parent) || ts.isExportSpecifier(parent)) &&
    parent.propertyName === node
  )
    return false;
  if (ts.isLabeledStatement(parent) || ts.isBreakOrContinueStatement(parent))
    return false;
  if (
    (ts.isJsxOpeningElement(parent) ||
      ts.isJsxSelfClosingElement(parent) ||
      ts.isJsxClosingElement(parent)) &&
    parent.tagName === node &&
    /^[a-z]/.test(node.text)
  )
    return false;
  if (ts.isTypePredicateNode(parent) && parent.parameterName === node)
    return false;
  if (ts.isNamedTupleMember(parent) && parent.name === node) return false;
  return true;
}

/** True when `node` is the name an identifier declares. */
function isDeclarationName(node) {
  const parent = node.parent;
  return (
    !!parent &&
    (ts.isVariableDeclaration(parent) ||
      ts.isParameter(parent) ||
      ts.isBindingElement(parent) ||
      ts.isFunctionDeclaration(parent) ||
      ts.isFunctionExpression(parent) ||
      ts.isClassDeclaration(parent) ||
      ts.isClassExpression(parent) ||
      ts.isInterfaceDeclaration(parent) ||
      ts.isTypeAliasDeclaration(parent) ||
      ts.isTypeParameterDeclaration(parent) ||
      ts.isEnumDeclaration(parent) ||
      ts.isImportSpecifier(parent) ||
      ts.isImportClause(parent) ||
      ts.isNamespaceImport(parent)) &&
    parent.name === node
  );
}

/**
 * The names `node` uses that it does not declare itself: values and types.
 * Scopes are not tracked: a name declared anywhere inside `node` counts as
 * declared, which can only leave a top-level declaration out, and the
 * validate-repo check finds that.
 */
export function usedNames(node) {
  const declared = new Set();
  const used = new Set();
  const visit = (current) => {
    if (ts.isIdentifier(current)) {
      if (isDeclarationName(current)) declared.add(current.text);
      else if (isReference(current)) used.add(current.text);
    } else if (
      ts.isShorthandPropertyAssignment(current) &&
      current.name.parent === current
    ) {
      used.add(current.name.text);
    }
    ts.forEachChild(current, visit);
  };
  visit(node);
  for (const name of declared) used.delete(name);
  return used;
}

/**
 * A source file's top level: its imports by local name, its declarations by
 * name (several statements for an overloaded function), the meta object.
 */
function readModule(text, fileName) {
  const sf = parse(text, fileName);
  /** @type {Map<string, {statement: import('typescript').ImportDeclaration, specifier: string}>} */
  const imports = new Map();
  /** @type {Map<string, import('typescript').Statement[]>} */
  const declarations = new Map();
  let metaName;
  let metaObject;
  const add = (name, statement) => {
    const list = declarations.get(name) ?? [];
    if (!list.includes(statement)) list.push(statement);
    declarations.set(name, list);
  };
  for (const statement of sf.statements) {
    if (ts.isImportDeclaration(statement)) {
      const specifier = statement.moduleSpecifier.text;
      const clause = statement.importClause;
      if (clause?.name) imports.set(clause.name.text, { statement, specifier });
      const bindings = clause?.namedBindings;
      if (bindings && ts.isNamespaceImport(bindings))
        imports.set(bindings.name.text, { statement, specifier });
      if (bindings && ts.isNamedImports(bindings))
        for (const element of bindings.elements)
          imports.set(element.name.text, { statement, specifier });
    } else if (ts.isVariableStatement(statement)) {
      for (const declaration of statement.declarationList.declarations) {
        const names = new Set();
        bindingNames(declaration.name, names);
        for (const name of names) add(name, statement);
      }
    } else if (
      (ts.isFunctionDeclaration(statement) ||
        ts.isClassDeclaration(statement) ||
        ts.isInterfaceDeclaration(statement) ||
        ts.isTypeAliasDeclaration(statement) ||
        ts.isEnumDeclaration(statement)) &&
      statement.name
    ) {
      add(statement.name.text, statement);
    } else if (ts.isExportAssignment(statement) && !statement.isExportEquals) {
      const value = unwrap(statement.expression);
      if (ts.isIdentifier(value)) metaName = value.text;
      else if (ts.isObjectLiteralExpression(value)) metaObject = value;
    }
  }
  if (metaName) {
    const declaration = variableDeclaration(declarations, metaName);
    const value = declaration && unwrap(declaration.initializer);
    if (value && ts.isObjectLiteralExpression(value)) metaObject = value;
  }
  return { sf, text, fileName, imports, declarations, metaName, metaObject };
}

/** The variable declaration of `name` in a module's declarations. */
function variableDeclaration(declarations, name) {
  for (const statement of declarations.get(name) ?? []) {
    if (!ts.isVariableStatement(statement)) continue;
    for (const declaration of statement.declarationList.declarations)
      if (ts.isIdentifier(declaration.name) && declaration.name.text === name)
        return declaration;
  }
  return undefined;
}

/**
 * A value as the story reads it: a node with the bindings its names have
 * (a story factory's parameters bound to the call's arguments).
 * @typedef {{ node: import('typescript').Node, env: Map<string, Bound> }} Bound
 */

/** Follows an identifier bound in `env`, or to a top-level `const`. */
function resolveValue(mod, bound) {
  let { node, env } = bound;
  for (let depth = 0; depth < 20; depth += 1) {
    node = unwrap(node);
    if (ts.isIdentifier(node)) {
      if (env.has(node.text)) {
        ({ node, env } = env.get(node.text));
        continue;
      }
      const declaration = variableDeclaration(mod.declarations, node.text);
      if (declaration?.initializer) {
        node = declaration.initializer;
        env = new Map();
        continue;
      }
      return { node, env };
    }
    if (ts.isPropertyAccessExpression(node)) {
      const owner = resolveObject(mod, { node: node.expression, env });
      const property = owner?.properties.get(node.name.text);
      if (property) {
        ({ node, env } = property);
        continue;
      }
    }
    return { node, env };
  }
  throw new Error('a value refers to itself');
}

/**
 * An object as the story reads it: its properties by name (spreads of other
 * objects merged in order), each with its bindings; or a story factory's
 * call, read as the object the factory returns.
 * @returns {{ properties: Map<string, Bound> } | undefined}
 */
function resolveObject(mod, bound) {
  const { node, env } = resolveValue(mod, bound);
  if (ts.isCallExpression(node)) {
    const factory = resolveValue(mod, { node: node.expression, env });
    const fn = factory.node;
    if (!ts.isArrowFunction(fn) && !ts.isFunctionExpression(fn))
      return undefined;
    const callEnv = new Map(factory.env);
    fn.parameters.forEach((parameter, i) => {
      const arg = node.arguments[i];
      if (!arg) return;
      bindParameter(parameter.name, { node: arg, env }, callEnv, mod);
    });
    const returned = returnedExpression(fn);
    return returned
      ? resolveObject(mod, { node: returned, env: callEnv })
      : undefined;
  }
  if (!ts.isObjectLiteralExpression(node)) return undefined;
  /** @type {Map<string, Bound>} */
  const properties = new Map();
  for (const property of node.properties) {
    if (ts.isSpreadAssignment(property)) {
      const spread = resolveObject(mod, { node: property.expression, env });
      if (!spread) throw new Error('a story spreads a value it cannot read');
      for (const [key, value] of spread.properties) properties.set(key, value);
    } else if (ts.isPropertyAssignment(property)) {
      properties.set(propertyName(property.name), {
        node: property.initializer,
        env,
      });
    } else if (ts.isShorthandPropertyAssignment(property)) {
      properties.set(property.name.text, { node: property.name, env });
    } else if (ts.isMethodDeclaration(property)) {
      properties.set(propertyName(property.name), { node: property, env });
    }
  }
  return { properties };
}

const propertyName = (name) =>
  ts.isIdentifier(name) || ts.isStringLiteral(name) || ts.isNumericLiteral(name)
    ? name.text
    : name.getText();

/** Binds a factory parameter (a name, or an array pattern over an array literal). */
function bindParameter(name, bound, env, mod) {
  if (ts.isIdentifier(name)) {
    env.set(name.text, bound);
    return;
  }
  if (ts.isArrayBindingPattern(name)) {
    const value = resolveValue(mod, bound);
    if (!ts.isArrayLiteralExpression(value.node)) return;
    name.elements.forEach((element, i) => {
      const item = value.node.elements[i];
      if (item && !ts.isOmittedExpression(element))
        bindParameter(element.name, { node: item, env: value.env }, env, mod);
    });
  }
}

/** The expression a function returns: its expression body, or a block's single `return`. */
function returnedExpression(fn) {
  if (!ts.isBlock(fn.body)) return fn.body;
  const returns = fn.body.statements.filter(ts.isReturnStatement);
  return returns.length === 1 && fn.body.statements.at(-1) === returns[0]
    ? returns[0].expression
    : undefined;
}

/**
 * The args a story renders with: the meta's, then the story's, as
 * name and value pairs.
 * @returns {Array<[string, Bound]>}
 */
function readArgs(mod, sources) {
  /** @type {Map<string, Bound>} */
  const args = new Map();
  for (const source of sources) {
    if (!source) continue;
    const object = resolveObject(mod, source);
    if (!object) throw new Error('a story has args it cannot read');
    for (const [key, value] of object.properties) args.set(key, value);
  }
  return [...args];
}

/** The text of a node as written. */
const textOf = (node) => node.getText(node.getSourceFile());

/** The leading spaces of the line `pos` sits on. */
function lineIndent(sf, pos) {
  const { line } = sf.getLineAndCharacterOfPosition(pos);
  const start = sf.getLineStarts()[line];
  return /^ */.exec(sf.text.slice(start))[0].length;
}

/** Moves every line after the first from `from` spaces of indent to `to`. */
function reindent(text, from, to) {
  return text
    .split('\n')
    .map((line, i) => {
      if (i === 0 || !line.trim()) return i === 0 ? line : '';
      const own = /^ */.exec(line)[0].length;
      return ' '.repeat(Math.max(0, own - from) + to) + line.trimStart();
    })
    .join('\n');
}

/** A value's text, with any name bound by a factory written in its place. */
function boundText(mod, bound) {
  const node = bound.node;
  if (ts.isIdentifier(node) && bound.env.has(node.text))
    return boundText(mod, bound.env.get(node.text));
  return textOf(node);
}

/** One JSX attribute for an arg: `name="text"`, `name` for true, else `name={value}`. */
function jsxAttribute(name, valueText, valueNode) {
  const node = valueNode && unwrap(valueNode);
  if (node && node.kind === ts.SyntaxKind.TrueKeyword) return name;
  if (
    node &&
    (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) &&
    !/["\\\n{}]/.test(node.text)
  )
    return `${name}="${node.text}"`;
  return `${name}={${valueText}}`;
}

/** The args as an object literal. */
function argsObject(mod, args) {
  if (!args.length) return '{}';
  const parts = args.map(([key, value]) => {
    const text = boundText(mod, value);
    return text === key ? key : `${key}: ${text}`;
  });
  const one = `{ ${parts.join(', ')} }`;
  return one.length <= 60
    ? one
    : `{\n${parts.map((p) => `  ${p},`).join('\n')}\n}`;
}

/**
 * The component of the story: `fn` (an arrow, function expression or method)
 * called with `args`; names `fn` uses from a factory's parameters are written
 * as constants first.
 */
function componentFromFunction(mod, { fn, env, args, name }) {
  const sf = fn.getSourceFile();
  const indent = lineIndent(sf, fn.getStart(sf));
  const body = fn.body;
  if (!body) throw new Error('a story render has no body');
  const bodyStart = body.getStart(sf);
  /** @type {Array<{start: number, end: number, text: string}>} */
  const edits = [];
  const prefix = [];
  // the factory's parameters the body uses
  const used = usedNames(body);
  for (const [key, value] of env) {
    if (used.has(key)) prefix.push(`const ${key} = ${boundText(mod, value)};`);
  }
  const [first, second] = fn.parameters;
  if (second && usedNames(body).has(textOf(second.name)))
    throw new Error('a story render reads its context');
  if (first) {
    const param = first.name;
    if (ts.isIdentifier(param)) {
      const argName = param.text;
      let other = false;
      const visit = (node) => {
        if (
          ts.isJsxSpreadAttribute(node) &&
          ts.isIdentifier(unwrap(node.expression)) &&
          unwrap(node.expression).text === argName
        ) {
          edits.push(spreadEdit(mod, { node, args, body }));
          return;
        }
        if (
          ts.isPropertyAccessExpression(node) &&
          ts.isIdentifier(node.expression) &&
          node.expression.text === argName
        ) {
          const entry = args.find(([key]) => key === node.name.text);
          const text = entry ? boundText(mod, entry[1]) : 'undefined';
          const simple = entry && /^[\w.]+$|^'[^']*'$/.test(text);
          // `prop={args.x}` with a plain string becomes `prop="x"`
          const holder = node.parent;
          const literal = entry && unwrap(entry[1].node);
          if (
            ts.isJsxExpression(holder) &&
            ts.isJsxAttribute(holder.parent) &&
            literal &&
            ts.isStringLiteral(literal) &&
            !/["\\\n{}]/.test(literal.text)
          ) {
            edits.push({
              start: holder.getStart(sf),
              end: holder.getEnd(),
              text: `"${literal.text}"`,
            });
            return;
          }
          edits.push({
            start: node.getStart(sf),
            end: node.getEnd(),
            text: simple ? text : `(${text})`,
          });
          return;
        }
        if (
          ts.isIdentifier(node) &&
          node.text === argName &&
          isReference(node) &&
          !isDeclarationName(node)
        )
          other = true;
        ts.forEachChild(node, visit);
      };
      visit(body);
      if (other) {
        const type = first.type ? `: ${textOf(first.type)}` : '';
        prefix.push(`const ${argName}${type} = ${argsObject(mod, args)};`);
      }
    } else if (usedNamesOfBinding(param).size) {
      const type = first.type ? `: ${textOf(first.type)}` : '';
      prefix.push(`const ${textOf(param)}${type} = ${argsObject(mod, args)};`);
    }
  }
  let bodyText = sf.text.slice(bodyStart, body.getEnd());
  for (const edit of edits.sort((a, b) => b.start - a.start)) {
    bodyText =
      bodyText.slice(0, edit.start - bodyStart) +
      edit.text +
      bodyText.slice(edit.end - bodyStart);
  }
  const head = `const ${name} = () => `;
  const tail = `;\n\nexport default ${name};\n`;
  if (ts.isBlock(body)) {
    const inner = reindent(bodyText, indent, 0);
    if (!prefix.length) return `${head}${inner}${tail}`;
    // `{`, the prefix, then the block's own lines
    const open = inner.indexOf('{') + 1;
    const prefixText = prefix
      .map((line) => `  ${reindent(line, 0, 2)}\n`)
      .join('');
    return `${head}{\n${prefixText}${inner.slice(open).replace(/^\n/, '')}${tail}`;
  }
  if (!prefix.length) {
    const expression = reindent(bodyText, indent, 0);
    const wrap =
      !expression.includes('\n') &&
      head.length + expression.length + 1 > LINE_WIDTH;
    return wrap
      ? `${head}(\n  ${expression}\n)${tail}`
      : `${head}${expression}${tail}`;
  }
  const prefixText = prefix
    .map((line) => `  ${reindent(line, 0, 2)}\n`)
    .join('');
  const expression = reindent(bodyText, indent, 2);
  return `${head}{\n${prefixText}  return ${expression};\n}${tail}`;
}

/**
 * The edit for `{...args}` in a JSX element: the args as attributes, the
 * element written over several lines when one line would pass the line
 * width; nothing (and the space before it) when there are no args.
 */
function spreadEdit(mod, { node, args, body }) {
  const sf = node.getSourceFile();
  const attributes = args.map(([key, value]) =>
    jsxAttribute(key, boundText(mod, value), value.node),
  );
  if (!attributes.length) {
    let start = node.getStart(sf);
    while (start > 0 && /\s/.test(sf.text[start - 1])) start -= 1;
    return { start, end: node.getEnd(), text: '' };
  }
  const element = node.parent.parent;
  const elementText = textOf(element);
  const lineStart =
    sf.getLineStarts()[
      sf.getLineAndCharacterOfPosition(element.getStart(sf)).line
    ];
  const lineEnd = sf.text.indexOf('\n', element.getEnd());
  const lineLength =
    (lineEnd === -1 ? sf.text.length : lineEnd) -
    lineStart -
    textOf(node).length +
    attributes.join(' ').length;
  if (
    !ts.isJsxSelfClosingElement(element) ||
    elementText.includes('\n') ||
    lineLength <= LINE_WIDTH
  )
    return {
      start: node.getStart(sf),
      end: node.getEnd(),
      text: attributes.join(' '),
    };
  // one attribute per line, the element in parentheses when it is the body
  const indent = lineIndent(sf, element.getStart(sf));
  const isBody = unwrap(body) === element;
  const at = isBody ? indent + 2 : indent;
  const own = element.attributes.properties.map((attribute) =>
    attribute === node ? attributes : [textOf(attribute)],
  );
  const lines = [
    `<${textOf(element.tagName)}`,
    ...own.flat().map((a) => `${' '.repeat(at + 2)}${a}`),
    `${' '.repeat(at)}/>`,
  ].join('\n');
  return {
    start: element.getStart(sf),
    end: element.getEnd(),
    text: isBody
      ? `(\n${' '.repeat(at)}${lines}\n${' '.repeat(indent)})`
      : lines,
  };
}

function usedNamesOfBinding(pattern) {
  const names = new Set();
  bindingNames(pattern, names);
  return names;
}

/** The component of a story that has args and no render: the meta's component with them. */
function componentFromMetaComponent(mod, { component, args, name }) {
  const tag = textOf(component);
  const attributes = args.map(([key, value]) =>
    jsxAttribute(key, boundText(mod, value), value.node),
  );
  const one = `<${tag}${attributes.map((a) => ` ${a}`).join('')} />`;
  const jsx =
    one.length + name.length + 12 <= LINE_WIDTH
      ? one
      : `(\n  <${tag}\n${attributes.map((a) => `    ${a}`).join('\n')}\n  />\n)`;
  return `const ${name} = () => ${jsx};\n\nexport default ${name};\n`;
}

/** The story's component text and the module it reads names from. */
function storyComponent(mod, exportName) {
  const declaration = variableDeclaration(mod.declarations, exportName);
  if (!declaration?.initializer)
    throw new Error(`no story export "${exportName}"`);
  const empty = new Map();
  const metaProps = mod.metaObject
    ? resolveObject(mod, { node: mod.metaObject, env: empty }).properties
    : new Map();
  const init = unwrap(declaration.initializer);
  if (ts.isArrowFunction(init) || ts.isFunctionExpression(init)) {
    const args = readArgs(mod, [metaProps.get('args')]);
    return componentFromFunction(mod, {
      fn: init,
      env: empty,
      args,
      name: exportName,
    });
  }
  const story = resolveObject(mod, { node: init, env: empty });
  if (!story) throw new Error(`story "${exportName}" has a shape not read`);
  const args = readArgs(mod, [
    metaProps.get('args'),
    story.properties.get('args'),
  ]);
  const render = story.properties.get('render') ?? metaProps.get('render');
  if (render) {
    const value = resolveValue(mod, render);
    const fn = value.node;
    if (
      ts.isArrowFunction(fn) ||
      ts.isFunctionExpression(fn) ||
      ts.isMethodDeclaration(fn)
    )
      return componentFromFunction(mod, {
        fn,
        env: value.env,
        args,
        name: exportName,
      });
    throw new Error(`story "${exportName}" has a render not read`);
  }
  const component = metaProps.get('component');
  if (component)
    return componentFromMetaComponent(mod, {
      component: component.node,
      args,
      name: exportName,
    });
  throw new Error(`story "${exportName}" has no render and no component`);
}

/** A declaration's text as written, without `export` and, for a story, without its Storybook type. */
function declarationText(statement) {
  const sf = statement.getSourceFile();
  const start = statement.getStart(sf);
  /** @type {Array<[number, number]>} */
  const cuts = [];
  for (const modifier of statement.modifiers ?? []) {
    if (
      modifier.kind === ts.SyntaxKind.ExportKeyword ||
      modifier.kind === ts.SyntaxKind.DefaultKeyword
    ) {
      let end = modifier.getEnd();
      while (/\s/.test(sf.text[end])) end += 1;
      cuts.push([modifier.getStart(sf), end]);
    }
  }
  if (ts.isVariableStatement(statement))
    for (const declaration of statement.declarationList.declarations)
      if (
        declaration.type &&
        /^(Story|StoryObj|StoryFn|Meta)\b/.test(textOf(declaration.type))
      )
        cuts.push([declaration.name.getEnd(), declaration.type.getEnd()]);
  let text = sf.text.slice(start, statement.getEnd());
  for (const [from, to] of cuts.sort((x, y) => y[0] - x[0]))
    text = text.slice(0, from - start) + text.slice(to - start);
  return text;
}

/** One import line with only `names`, the module as the text writes it. */
function importText(statement, names, specifier) {
  const clause = statement.importClause;
  if (!clause) return `import '${specifier}';`;
  const typeOnly = clause.isTypeOnly ? 'type ' : '';
  const parts = [];
  if (clause.name && names.has(clause.name.text)) parts.push(clause.name.text);
  const bindings = clause.namedBindings;
  if (bindings && ts.isNamespaceImport(bindings)) {
    if (names.has(bindings.name.text)) parts.push(`* as ${bindings.name.text}`);
  } else if (bindings) {
    const named = bindings.elements
      .filter((element) => names.has(element.name.text))
      .map((element) => textOf(element));
    if (named.length) {
      const one = `{ ${named.join(', ')} }`;
      const line = `import ${typeOnly}${[...parts, one].join(', ')} from '${specifier}';`;
      parts.push(
        line.length <= LINE_WIDTH
          ? one
          : `{\n${named.map((n) => `  ${n},`).join('\n')}\n}`,
      );
    }
  }
  if (!parts.length) return undefined;
  return `import ${typeOnly}${parts.join(', ')} from '${specifier}';`;
}

const moduleCache = new Map();
/** A relative module inside stories/, read once. */
function readRelative(fromFile, specifier) {
  const base = path.resolve(path.dirname(fromFile), specifier);
  const file = ['', '.tsx', '.ts', '/index.tsx', '/index.ts']
    .map((ext) => base + ext)
    .find(
      (candidate) =>
        fs.existsSync(candidate) && fs.statSync(candidate).isFile(),
    );
  if (!file) throw new Error(`cannot read the relative import "${specifier}"`);
  if (!file.startsWith(STORIES_DIR + path.sep))
    throw new Error(`relative import "${specifier}" is outside stories/`);
  if (!moduleCache.has(file))
    moduleCache.set(file, readModule(fs.readFileSync(file, 'utf8'), file));
  return moduleCache.get(file);
}

/**
 * The story's code text.
 * @param {{ fileText: string, exportName: string, file?: string }} story
 * @returns {string}
 */
export function storyCode({ fileText, exportName, file = 'story.tsx' }) {
  const mod = readModule(fileText, file);
  const component = storyComponent(mod, exportName);
  // names followed per module; package imports collected across modules
  /** @type {Map<object, Set<import('typescript').Statement>>} */
  const included = new Map();
  /** @type {Map<string, {statement: import('typescript').ImportDeclaration, names: Set<string>, specifier: string}>} */
  const packageImports = new Map();
  const themes = new Set();
  const modules = [];
  const follow = (current, names) => {
    if (!included.has(current)) {
      included.set(current, new Set());
      modules.push(current);
    }
    const queue = [...names];
    const seen = new Set();
    while (queue.length) {
      const name = queue.shift();
      if (seen.has(name)) continue;
      seen.add(name);
      const imported = current.imports.get(name);
      if (imported) {
        const { statement, specifier } = imported;
        if (DROPPED_MODULE.test(specifier)) continue;
        if (specifier.startsWith('.')) {
          if (THEMES_MODULE.test(specifier.replace(/\.[jt]sx?$/, ''))) {
            if (!THEMES_NAMES[name])
              throw new Error(`"${name}" of .storybook/themes has no text`);
            themes.add(name);
            continue;
          }
          const target = readRelative(current.fileName, specifier);
          const element = statement.importClause?.namedBindings;
          const original =
            element && ts.isNamedImports(element)
              ? element.elements.find((e) => e.name.text === name)
              : undefined;
          follow(target, [original?.propertyName?.text ?? name]);
          continue;
        }
        const key = `${specifier}\0${statement.importClause?.isTypeOnly ? 'type' : ''}\0${statement.pos}\0${current.fileName}`;
        const entry = packageImports.get(key) ?? {
          statement,
          names: new Set(),
          specifier: specifier.startsWith(STORY_SUPPORT)
            ? `@/components/ui/${specifier.slice(STORY_SUPPORT.length)}`
            : specifier,
        };
        entry.names.add(name);
        packageImports.set(key, entry);
        continue;
      }
      for (const statement of current.declarations.get(name) ?? []) {
        const set = included.get(current);
        if (set.has(statement)) continue;
        set.add(statement);
        queue.push(...usedNames(statement));
      }
    }
  };
  follow(mod, usedNames(parse(component, 'component.tsx')));
  const imports = [...packageImports.values()]
    .map(({ statement, names, specifier }) =>
      importText(statement, names, specifier),
    )
    .filter(Boolean);
  const blocks = [];
  if (imports.length) blocks.push(imports.join('\n'));
  for (const name of themes) blocks.push(THEMES_NAMES[name]);
  // relative modules first (the story file was added first, so reverse)
  for (const current of [...modules.slice(1).reverse(), modules[0]]) {
    const statements = [...included.get(current)].sort(
      (a, b) => a.getStart() - b.getStart(),
    );
    for (const statement of statements) blocks.push(declarationText(statement));
  }
  blocks.push(component.trimEnd());
  return `${blocks.join('\n\n')}\n`;
}

/** The TypeScript compiler API this module uses, for the validate-repo check. */
export { ts };

/**
 * Every story's code text, keyed by story id (the ids of `readStories`,
 * apps/shadcn-table-docs/lib/story-pages.mjs). A story whose text cannot be
 * made gets a one-line comment naming why; `pnpm test validate-repo` fails on
 * it.
 * @returns {Promise<Record<string, string>>}
 */
export async function storySources() {
  const { readStories, STORIES_DIR: dir } = await import(
    '../../apps/shadcn-table-docs/lib/story-pages.mjs'
  );
  const files = new Map();
  /** @type {Record<string, string>} */
  const sources = {};
  for (const story of await readStories()) {
    const file = path.join(dir, story.file);
    if (!files.has(file)) files.set(file, fs.readFileSync(file, 'utf8'));
    try {
      sources[story.id] = storyCode({
        fileText: files.get(file),
        exportName: story.exportName,
        file,
      });
    } catch (error) {
      sources[story.id] = `// No code text for this story: ${error.message}\n`;
    }
  }
  return sources;
}
