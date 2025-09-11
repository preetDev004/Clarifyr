import { chatApi } from '@/lib/api';
import { useSession } from '@clerk/nextjs';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export function useDocumentDownload() {
  const { session } = useSession();
  const queryClient = useQueryClient();

  const downloadMutation = useMutation({
    mutationFn: async ({
      documentId,
      documentName,
      documentType,
    }: {
      documentId: string;
      documentName: string;
      documentType: string;
    }) => {
      if (!session) throw new Error('No active session');

      // Check if we already have the data in cache
      const cachedData = queryClient.getQueryData([
        'documentDownload',
        documentId,
      ]);
      if (cachedData) {
        return { content: cachedData, name: documentName, type: documentType };
      }
      // If not cached, fetch it
      const content = await chatApi.getDocumentContent(session.id, documentId);
      // Store in cache
      queryClient.setQueryData(['documentDownload', documentId], content);
      return { content, name: documentName, type: documentType };
    },
    onSuccess: ({ content, name, type }) => {
      // Get the file extension based on the MIME type
      const extension = getFileExtension(type);
      const fileName = name.includes(extension) ? name : `${name}.${extension}`;

      // Create blob with the appropriate content
      let blob;

      if (content instanceof ArrayBuffer) {
        // For binary content from ArrayBuffer
        blob = new Blob([content], { type });
      } else if (typeof content === 'string') {
        // For text content
        blob = new Blob([content], { type });
      } else {
        // For JSON or other object content, stringify it
        blob = new Blob([JSON.stringify(content)], { type });
      }

      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();

      // Clean up
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success(`Downloaded ${fileName} successfully`);
    },
    onError: (error) => {
      toast.error('Error Occurred', {
        description: (error as Error).message || 'Please try again later.',
      });
    },
  });

  const downloadDocument = (
    documentId: string,
    documentName: string,
    documentType: string
  ) => {
    toast.info(`Preparing ${documentName} for download...`);
    downloadMutation.mutate({ documentId, documentName, documentType });
  };

  return {
    downloadDocument,
    isDownloading: downloadMutation.isPending,
  };
}

// Helper function to get file extension from MIME type
function getFileExtension(mimeType: string): string {
  switch (mimeType.toLowerCase()) {
    case 'application/pdf':
      return 'pdf';
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      return 'docx';
    case 'application/msword':
      return 'doc';
    case 'text/plain':
      return 'txt';
    default:
      return mimeType.split('/').pop() || 'bin';
  }
}
