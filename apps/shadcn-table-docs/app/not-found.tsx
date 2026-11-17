import type { Metadata } from 'next';
import { NotFoundPage } from '@/components/not-found-page';

export const metadata: Metadata = {
  title: 'Page not found',
};

/** Every missing address, /docs included (no not-found file below app/): D121. */
export default function NotFound() {
  return <NotFoundPage />;
}
