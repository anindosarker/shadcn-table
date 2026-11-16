import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import type * as PageTree from 'fumadocs-core/page-tree';
import { source } from '@/lib/source';
import { isPreviewPage } from '@/lib/examples-entry.mjs';
import { containsUrl, separatorPages } from '@/lib/page-tree-utils';

/**
 * Heading id of a "---Label---" group, one hyphen per replaced character:
 * "Size / Width Guides" → "size---width-guides", the ids the live site links.
 */
function groupId(label: string): string {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * The overview list of a docs section (`/docs/guides`): every "---Label---"
 * group of the section's meta.json as a heading with an id, its pages as
 * numbered link rows. Read from the page tree, so meta.json is the only
 * source; the preview-only comparison pages (lib/examples-entry.mjs) are
 * left out.
 */
export function TableOfContentsList({ section }: { section: string }) {
  const folder = source
    .getPageTree()
    .children.find(
      (node): node is PageTree.Folder =>
        node.type === 'folder' && containsUrl(node, section),
    );
  if (!folder) return null;

  const groups = folder.children
    .filter((node) => node.type === 'separator')
    .map((separator) => ({
      label: String(separator.name),
      pages: separatorPages(separator, folder.children).filter(
        (page) => !isPreviewPage(page.url.split('/').pop() ?? ''),
      ),
    }))
    .filter((group) => group.pages.length > 0);

  return (
    <>
      {groups.map((group) => {
        const id = groupId(group.label);
        return (
          <div key={id}>
            <h3 id={id} className="docs-index-heading">
              <Link href={`${section}#${id}`}>{group.label}</Link>
            </h3>
            <ul className="docs-index not-prose">
              {group.pages.map((page, index) => (
                <li key={page.url}>
                  <Link href={page.url} className="docs-index-link">
                    <span className="docs-index-num">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="docs-index-label">{page.name}</span>
                    <ArrowUpRight aria-hidden className="docs-index-arrow" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </>
  );
}
