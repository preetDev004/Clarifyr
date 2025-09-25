'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useDocumentContent } from '@/hooks/useDocumentContent';
import { useEffect } from 'react';
import { toast } from 'sonner';
import Loader from '@/components/ui/loader';

export function ViewContentModal({
  open,
  onOpenChange,
  documentId,
  title,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  documentId?: string;
  title?: string;
}) {
  const { content, isLoading, error } = useDocumentContent(documentId, open);

  // prevent background scroll when open (smoother UX on mobile)
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  // On error, show toast and close modal
  useEffect(() => {
    if (open && error) {
      toast.error('Failed to load content', {
        description: 'Please try again later.',
      });
      onOpenChange(false);
    }
  }, [open, error, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{title || 'Document Content'}</DialogTitle>
        </DialogHeader>
        <div className="scrollbar-thin mt-2 max-h-[70vh] min-h-[40vh] overflow-y-scroll rounded-md border bg-muted/30 p-4">
          {isLoading && (
            <div className="mt-10 flex items-center justify-center">
              <Loader title="Loading content..." description="Please wait." />
            </div>
          )}
          {!isLoading && error && null}
          {!isLoading && !error && (
            <pre className="whitespace-pre-wrap break-words text-sm leading-6">
              {content}
            </pre>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
