/** Mono snippet with two tones: keywords in accent, strings in ink. */
const TOKEN = /('[^']*'|\b(?:const|return|true)\b)/g;

export function CodeBlock({
  code,
  className,
}: {
  code: string;
  className?: string;
}) {
  return (
    <pre className={['v3-code', className].filter(Boolean).join(' ')}>
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
