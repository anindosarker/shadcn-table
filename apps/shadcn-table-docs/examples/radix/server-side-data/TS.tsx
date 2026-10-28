'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; //note: this is TanStack React Query V5
import { UsersTable } from './components/UsersTable';

//react query setup in App.tsx
const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <UsersTable />
    </QueryClientProvider>
  );
}
