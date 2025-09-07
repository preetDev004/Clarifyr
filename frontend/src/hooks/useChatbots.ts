import { useQuery } from '@tanstack/react-query';
import { useSession } from '@clerk/nextjs';
import { chatApi } from '@/lib/api';
import { toast } from 'sonner';

export const useChatbots = () => {
  const { session } = useSession();

  const { data: chatbots, isLoading, error } = useQuery({
    queryKey: ['chatbots'],
    queryFn: () => session && chatApi.getAllChatbots(session?.id),
    enabled: !!session?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });

  // Handle error with toast
  if (error) {
    toast.error('Error', {
      description: 'Failed to fetch Chatbots. Please try again later.',
    });
  }

  return {
    chatbots: chatbots || [],
    isLoading,
    error,
  };
};
