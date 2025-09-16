import { auth } from '@clerk/nextjs/server';
import { QueryClient, dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { chatApi } from '@/lib/api';
import DocumentsClient from './DocumentsClient';

export default async function DocumentsPage() {
  const { sessionId } = await auth();
  const queryClient = new QueryClient();

  if (sessionId) {
    await queryClient.prefetchQuery({
      queryKey: ['documents', 'all'],
      queryFn: () => chatApi.getAllDocuments(sessionId),
      staleTime: 5 * 60 * 1000,
    });
  }

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <DocumentsClient />
    </HydrationBoundary>
  );
}
