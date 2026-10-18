import type { ReactNode } from 'react';

/** Type / default value cell: inline code without the prose styling. String
 * children get light syntax colours (srt-tok-* in app/global.css). */
export const InlineCode = ({ children }: { children: ReactNode }) =>
  children ? (
    <code className="rounded-md border bg-muted px-1.5 py-0.5 font-mono text-[0.8rem] wrap-anywhere whitespace-pre-wrap">
      {typeof children === 'string' ? tokenize(children) : children}
    </code>
  ) : null;

const KEYWORDS = new Set([
  'boolean',
  'string',
  'number',
  'bigint',
  'symbol',
  'any',
  'unknown',
  'void',
  'never',
  'null',
  'undefined',
  'true',
  'false',
  'object',
]);

// string literal | punctuation/operator | identifier | anything else
const TOKEN =
  /('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*`)|(=>|[|&:;,?{}()[\]<>=.])|([A-Za-z_$][\w$]*)|([^'"`|&:;,?{}()[\]<>=.A-Za-z_$]+|.)/g;

function tokenize(source: string): ReactNode[] {
  const out: ReactNode[] = [];
  for (const [i, m] of [...source.matchAll(TOKEN)].entries()) {
    const [text, str, punc, ident] = m;
    const cls = str
      ? 'srt-tok-str'
      : punc
        ? 'srt-tok-punc'
        : ident && KEYWORDS.has(ident)
          ? 'srt-tok-kw'
          : ident && /^[A-Z]/.test(ident)
            ? 'srt-tok-type'
            : null;
    out.push(
      cls ? (
        <span key={i} className={cls}>
          {text}
        </span>
      ) : (
        text
      ),
    );
  }
  return out;
}
