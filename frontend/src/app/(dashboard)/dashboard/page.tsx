import { auth } from '@clerk/nextjs/server';
import { QueryClient, dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { chatApi } from '@/lib/api';
import ChatbotsClient from './ChatbotsClient';

export default async function MainDashboardPage() {
  const { sessionId } = await auth();
  const queryClient = new QueryClient();

  if (sessionId) {
    await queryClient.prefetchQuery({
      queryKey: ['chatbots'],
      queryFn: () => chatApi.getAllChatbots(sessionId),
      staleTime: 5 * 60 * 1000,
    });
  }

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <ChatbotsClient />
    </HydrationBoundary>
  );
}
