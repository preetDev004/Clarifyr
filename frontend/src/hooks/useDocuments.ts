import { chatApi } from '@/lib/api';
import { useSession } from '@clerk/nextjs';
import { useQuery } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import { toast } from 'sonner';

// Function to fetch documents from your API with optimized data fetching
export function useDocuments(
  options: {
    forceEnable?: boolean;
    searchQuery?: string;
  } = {}
) {
  const { forceEnable = false, searchQuery = undefined } = options;
  const pathname = usePathname();
  const { session } = useSession();

  // OPTIMIZED FETCHING STRATEGY:
  // 1. On documents page (source of truth) to ensure latest data
  // 2. When search query changes (only in enabled components)
  const isDocumentsPage = pathname === '/documents';
  // Fetch when:
  // - On documents page (source of truth)
  // - forceEnable is true (e.g., consumers that need docs outside documents page)
  // - a search query is provided (typeahead scenarios)
  const shouldFetch =
    !!session?.id && (isDocumentsPage || (!!searchQuery && forceEnable));

  // Check if there are processing documents for polling
  const {
    data: documents,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['documents', searchQuery || 'all'],
    queryFn: () => session && chatApi.getAllDocuments(session?.id, searchQuery),
    enabled: shouldFetch,
    staleTime: searchQuery ? 60 * 1000 : 5 * 60 * 1000,
    refetchOnReconnect: true,
  });

  // Check for processing documents and set up polling
  const hasProcessingDocuments = useMemo(() => {
    return documents?.some((doc) => doc.status === 'Processing') || false;
  }, [documents]);

  const refetchInterval = useMemo(() => {
    return hasProcessingDocuments ? 5000 : false;
  }, [hasProcessingDocuments]);

  // Separate query for polling when documents are processing
  const { data: polledDocuments, isLoading: isPolling } = useQuery({
    queryKey: ['documents-polling', searchQuery || 'all'],
    queryFn: () => session && chatApi.getAllDocuments(session?.id, searchQuery),
    enabled: !!session?.id && hasProcessingDocuments,
    refetchInterval,
    staleTime: 0, // Always consider stale for polling
  });

  // Use polled data if available, otherwise use regular data
  const finalDocuments = polledDocuments || documents;
  const finalIsLoading = isLoading || isPolling;

  // Handle error with toast
  if (error) {
    toast.error('Error', {
      description: 'Failed to fetch documents. Please try again later.',
    });
  }

  return {
    documents: finalDocuments ? [...finalDocuments].reverse() : [],
    isLoading: finalIsLoading,
    error,
  };
}
