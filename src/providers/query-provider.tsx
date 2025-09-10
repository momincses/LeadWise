// providers/query-provider.tsx
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export const QueryProvider = ({ children }: { children: React.ReactNode }) => {
  // Create a new QueryClient instance for each session to avoid sharing data between users
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};