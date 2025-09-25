'use client';

import { chatApi } from '@/lib/api';
import { useSession } from '@clerk/nextjs';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

export function useDocumentContent(
  documentId?: string,
  enabledOverride?: boolean
) {
  const { session } = useSession();

  const enabled = !!session?.id && !!documentId && (enabledOverride ?? true);

  const {
    data: content,
    isLoading,
    isFetching,
    error,
  } = useQuery<string>({
    queryKey: ['document-text', documentId],
    queryFn: async () => {
      if (!session?.id || !documentId) throw new Error('Missing session or id');
      return chatApi.getDocumentText(session.id, documentId);
    },
    enabled,
    staleTime: Infinity, // never becomes stale: once fetched, no refetches
    gcTime: 30 * 60 * 1000, // keep in cache for 30 minutes
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
  });

  const state = useMemo(
    () => ({
      isLoading: isLoading || (enabled && isFetching && !content),
      isRefetching: isFetching && !!content,
      error,
      content: content ?? '',
    }),
    [content, enabled, error, isFetching, isLoading]
  );

  return state;
}
