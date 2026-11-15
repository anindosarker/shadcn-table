import type { Thing, WithContext } from 'schema-dts';

/**
 * One Schema.org object as a `<script type="application/ld+json">`. `<` is
 * escaped so a string holding `</script>` cannot close the tag early.
 */
export function JsonLd<T extends Thing>({ data }: { data: WithContext<T> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, '\\u003c'),
      }}
    />
  );
}
