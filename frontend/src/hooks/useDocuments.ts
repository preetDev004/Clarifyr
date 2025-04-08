import { chatApi } from '@/lib/api';
import { useDocumentStore } from '@/store/useDocumentStore';
import { useSession } from '@clerk/nextjs';
import { useQuery } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo } from 'react';
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
  const { documents, setDocuments, hasLoaded, setHasLoaded } =
    useDocumentStore();

  // OPTIMIZED FETCHING STRATEGY:
  // 1. On first load (!hasLoaded) to populate the store initially
  // 2. On documents page (source of truth) to ensure latest data
  // 3. When search query changes (only in enabled components)
  const isDocumentsPage = pathname === '/documents';
  const shouldFetch =
    !!session?.id &&
    (!hasLoaded || isDocumentsPage || (!!searchQuery && forceEnable));

  // Make this a reactive value that updates correctly when the documents state changes
  const hasProcessingDocuments = useMemo(() => {
    return documents?.some((doc) => doc.status === 'Processing') || false;
  }, [documents]);

  const refetchInterval = useMemo(() => {
    return hasProcessingDocuments ? 5000 : false;
  }, [hasProcessingDocuments]);

  // Either fetch for normal reasons OR keep polling for processing docs
  const queryEnabled = shouldFetch || (!!session?.id && hasProcessingDocuments);

  // Fixed query implementation
  const { data, isLoading, error } = useQuery({
    queryKey: ['documents', searchQuery || 'all'],
    queryFn: () => session && chatApi.getAllDocuments(session?.id, searchQuery),
    enabled: queryEnabled,
    staleTime: searchQuery ? 60 * 1000 : 5 * 60 * 1000,
    refetchOnReconnect: true,
    refetchInterval,
  });

  // Move state updates outside of select function
  useEffect(() => {
    if (data) {
      const sortedData = [...data].reverse();
      setDocuments(sortedData);
      if (!hasLoaded) {
        setHasLoaded(true);
      }
    }
  }, [data, setDocuments, hasLoaded, setHasLoaded]);

  // Handle error separately
  useEffect(() => {
    if (error) {
      toast.error('Error', {
        description: 'Failed to fetch documents. Please try again later.',
      });
    }
  }, [error]);

  return {
    documents,
    isLoading,
    error,
    hasLoaded,
  };
}
