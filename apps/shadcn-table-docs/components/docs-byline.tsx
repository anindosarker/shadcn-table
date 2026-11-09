import { siteAuthor } from '@/lib/shared';

/**
 * "By <maintainer> · Updated <date>" under a docs page's description. The
 * text around the link is one string each, so the HTML carries no React
 * text separators inside "Updated <date>".
 */
export function DocsByline({ date }: { date: string }) {
  return (
    <p className="docs-byline text-sm text-fd-muted-foreground">
      {'By '}
      <a href={siteAuthor.url} className="underline-offset-4 hover:underline">
        {siteAuthor.name}
      </a>
      {` · Updated ${date}`}
    </p>
  );
}
