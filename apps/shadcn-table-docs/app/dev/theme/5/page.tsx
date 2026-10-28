import { archivo } from '@/components/dev-home/v4/font';
import { Nav } from '@/components/dev-home/v12/nav';
import { Matches } from '@/components/theme-demo/variants/matches';
import '@/components/dev-home/v4/v4.css';
import '@/components/dev-home/v12/v12.css';

/** Variant 5 (matches): a rotating persona word drives the app below it. */
export default function Page() {
  return (
    <div data-variant="12" className={`v4-root v12 ${archivo.variable}`}>
      <Nav />
      <main className="v4-shell flex w-full flex-col py-12 sm:py-20">
        <Matches />
      </main>
    </div>
  );
}
