import { generateOGImage } from 'fumadocs-ui/og';
import { appName, siteName } from '@/lib/shared';

export const revalidate = false;

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = siteName;

/** The home page description, repeated from `app/(home)/page.tsx` metadata. */
const homeDescription =
  'A production-ready table library built with TanStack Table and shadcn/ui. Sorting, filtering, grouping, pinning, virtualization, and more, all built in.';

/** The home page social card, rendered like the docs cards in `app/og/docs`. */
export default function Image() {
  return generateOGImage({
    title: siteName,
    description: homeDescription,
    site: appName,
  });
}
