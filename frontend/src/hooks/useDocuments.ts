import { chatApi } from '@/lib/api';
import { useDocumentStore } from '@/store/useDocumentStore';
import { useSession } from '@clerk/nextjs';
import { useQuery } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';

// Function to fetch documents from your API
export function useDocuments(forceEnable = false) {
  const pathname = usePathname();
  const { session } = useSession();
  const { documents, setDocuments, hasLoaded, setHasLoaded } =
    useDocumentStore();

  // Check if we're on a relevant route or if force-enabled
  const isRelevantRoute =
    forceEnable ||
    pathname === '/documents' ||
    pathname.startsWith('/dashboard/documents/');

  const { data, isLoading, error } = useQuery({
    queryKey: ['documents'],
    queryFn: () => session && chatApi.getAllDocuments(session?.id),
    enabled: !!session?.id && isRelevantRoute,
    refetchInterval: 10000,
    // Keep data fresh in cache for 5 minutes even when component unmounts
    staleTime: 5 * 60 * 1000,
    // Keep the data in cache to avoid refetching when navigating
    gcTime: 10 * 60 * 1000,
  });

  useEffect(() => {
    if (error) {
      toast.error('Error', {
        description: 'Failed to fetch documents. Please try again later.',
      });
    }
    if (!error && data) {
      // Update the Zustand store with the fetched documents
      setDocuments(data);
      // Set the hasLoaded flag to true
      if (!hasLoaded) {
        setHasLoaded(true);
      }
    }
  }, [data, error, hasLoaded, setDocuments, setHasLoaded]);

  return {
    documents,
    isLoading,
    error,
    hasLoaded,
  };
}
