import { FullSearchTrigger } from 'fumadocs-ui/layouts/shared/slots/search-trigger';
import { IntentLink } from '@/components/dev-home/shared/intent-link';
import { archivo } from '@/components/dev-home/v4/font';
import { Footer } from '@/components/dev-home/v12/footer';
import { Nav } from '@/components/dev-home/v12/nav';
import { NAV_LINKS } from '@/lib/layout.shared';
import '@/components/dev-home/v4/v4.css';
import '@/components/dev-home/v5/v5.css';
import '@/components/dev-home/v7/v7.css';
import '@/components/dev-home/v12/v12.css';

/**
 * The site's own 404 page (D121), framed like the home page: its top bar
 * (with the base select, as in the docs bar) and footer. In the docs' mono
 * dashed look: the line "404" with "This page does not exist", the docs
 * search box (the root provider's search dialog) and the four sections in
 * the order of D101. Rendered by app/not-found.tsx for every missing address,
 * under /docs too.
 */
export function NotFoundPage() {
  return (
    <div data-variant="12" className={`v4-root v12 ${archivo.variable}`}>
      <Nav baseSwitch />
      <main className="flex flex-1 flex-col">
        <div className="v4-shell flex flex-1 items-center justify-center py-20">
          <section
            aria-labelledby="not-found-title"
            className="flex w-full max-w-xl flex-col items-center gap-6 border border-dashed border-(--docs-dash) px-6 py-12 text-center"
          >
            <p className="v4-display text-7xl">404</p>
            <h1
              id="not-found-title"
              className="font-mono text-sm tracking-[0.12em] text-fd-muted-foreground uppercase"
            >
              This page does not exist
            </h1>
            <FullSearchTrigger className="w-full max-w-sm rounded-none border-dashed border-(--docs-dash) bg-transparent shadow-none" />
            <nav aria-label="Sections">
              <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 font-mono text-xs tracking-[0.16em] uppercase">
                {NAV_LINKS.map((link) => (
                  <li key={link.url}>
                    <IntentLink
                      href={link.url}
                      className="text-fd-muted-foreground transition-colors hover:text-fd-foreground"
                    >
                      {link.text}
                    </IntentLink>
                  </li>
                ))}
              </ul>
            </nav>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
