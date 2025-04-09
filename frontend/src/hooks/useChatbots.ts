import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useSession } from '@clerk/nextjs';
import { useChatbotStore } from '@/store/useChatbotStore';
import { chatApi } from '@/lib/api';
import { toast } from 'sonner';

export const useChatbots = () => {
  const { session } = useSession();
  const {
    chatbots,
    setChatbots,
    isLoading: storeLoading,
    setLoading,
    hasLoaded,
  } = useChatbotStore();

  const { data, isLoading, error } = useQuery({
    queryKey: ['chatbots'],
    queryFn: () => session && chatApi.getAllChatbots(session?.id),
    enabled: !!session?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });

  useEffect(() => {
    if (data) {
      console.log('Fetched chatbots:', data);
      setChatbots(data);
    }

    if (error) {
      toast.error('Error', {
        description: 'Failed to fetch Chatbots. Please try again later.',
      });
    }

    setLoading(isLoading);
  }, [data, isLoading, error, setChatbots, setLoading]);

  return {
    chatbots,
    isLoading: isLoading || storeLoading,
    hasLoaded,
    error,
  };
};
