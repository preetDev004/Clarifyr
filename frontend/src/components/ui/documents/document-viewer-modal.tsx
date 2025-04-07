'use client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { chatApi } from '@/lib/api';
import { useSession } from '@clerk/nextjs';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

interface DocumentViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentId: string;
  documentType: string;
  documentName: string;
}

export function DocumentViewerModal({
  isOpen,
  onClose,
  documentId,
  documentType,
  documentName,
}: DocumentViewerModalProps) {
  const { session } = useSession();
  const [content, setContent] = useState<string>('');

  const { isLoading, error } = useQuery({
    queryKey: ['documentContent', documentId],
    queryFn: async () => {
      const response =
        session && (await chatApi.getDocumentContent(session?.id, documentId));
      setContent(response ?? '');
      return response;
    },
    enabled: isOpen && !!documentId,
    refetchOnMount: false,
  });

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex h-96 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-lg">Loading document content...</span>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex h-96 flex-col items-center justify-center text-destructive">
          <p className="mb-4 text-lg">Error loading document content</p>
          <p>{(error as Error).message}</p>
        </div>
      );
    }

    if (!content) return null;

    switch (documentType.toLowerCase()) {
      case 'application/pdf':
        return (
          <div className="h-[70vh] overflow-auto bg-muted p-4">
            <pre className="whitespace-pre-wrap font-mono text-xs">
              {content}
            </pre>
            <p className="my-4 text-sm text-muted-foreground">
              Note: This is showing raw PDF content. For better viewing
              experience, consider using a PDF viewer component.
            </p>
          </div>
        );
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      case 'application/msword':
        return (
          <div className="h-[70vh] overflow-auto bg-muted p-4">
            <pre className="whitespace-pre-wrap font-mono text-xs">
              {content}
            </pre>
            <p className="my-4 text-sm text-muted-foreground">
              Note: This is showing raw DOCX content. For better viewing
              experience, consider using a DOCX viewer component.
            </p>
          </div>
        );
      case 'text/plain':
        return (
          <div className="h-[70vh] overflow-auto bg-muted p-4">
            <pre className="whitespace-pre-wrap font-mono">{content}</pre>
          </div>
        );
      default:
        return (
          <div className="h-[70vh] overflow-auto bg-muted p-4">
            <pre className="whitespace-pre-wrap font-mono text-xs">
              {content}
            </pre>
          </div>
        );
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{documentName}</DialogTitle>
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground" />
        </DialogHeader>
        {renderContent()}
        <div className="mt-6 flex justify-end">
          <Button onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
