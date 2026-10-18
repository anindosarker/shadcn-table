import Link from 'next/link';
import { StarIcon } from 'lucide-react';
import { GITHUB_URL, GithubGlyph, Mark } from '@/components/dev-home/v5/chrome';

const NAV_LINKS = [
  { label: 'API', href: '/docs/api' },
  { label: 'Examples', href: '/docs/examples' },
  { label: 'Guides', href: '/docs/guides' },
] as const;

/** v5's nav bar pointed at /dev/11. Styles come from v5.css. */
export function ReplayNav() {
  return (
    <header className="v5-nav">
      <nav aria-label="Main" className="v5-nav-row v11-wide">
        <Link
          href="/dev/11"
          className="v5-logo"
          aria-label="shadcn-react-table home"
        >
          <Mark className="size-5 text-(--dh-accent)" />
          <span className="whitespace-nowrap">shadcn-react-table</span>
        </Link>
        <ul className="v5-nav-links v5-nav-links--center">
          {NAV_LINKS.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="v5-nav-link">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex shrink-0 items-center gap-2">
          <a href={GITHUB_URL} className="v5-gh">
            <GithubGlyph className="size-4" />
            <span className="v5-gh-label">Star on GitHub</span>
            <StarIcon aria-hidden="true" className="v5-gh-star size-3.5" />
          </a>
          <Link href="/docs/getting-started/install" className="v5-cta-white">
            Get Started
          </Link>
        </div>
      </nav>
      <ul
        className="v5-nav-links v5-nav-links--below v11-wide"
        aria-label="Sections"
      >
        {NAV_LINKS.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="v5-nav-link">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </header>
  );
}
