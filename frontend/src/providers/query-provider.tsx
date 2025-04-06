'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

// Create a singleton QueryClient instance
export const getQueryClient = (() => {
  let queryClient: QueryClient | null = null;

  return () => {
    if (!queryClient) {
      queryClient = new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
          },
        },
      });
    }
    return queryClient;
  };
})();

export default function QueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Use the singleton QueryClient
  const [queryClient] = useState(() => getQueryClient());

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
