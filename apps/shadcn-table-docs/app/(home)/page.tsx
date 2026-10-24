import type { Metadata } from 'next';
import { HomePage } from '@/components/dev-home/v12/home-page';

export const metadata: Metadata = {
  title: { absolute: 'shadcn-table' },
  description:
    'A production-ready table library built with TanStack Table and shadcn/ui. Sorting, filtering, grouping, pinning, virtualization, and more, all built in.',
};

export default function Page() {
  return <HomePage />;
}
