'use client';
import { Button } from '@/components/ui/button';
import { UploadModal } from '@/components/ui/documents/upload-modal';
import { Upload } from 'lucide-react';
import { useEffect, useState } from 'react';
import { DataTable } from './data-table';
import { columns } from './columns';
import { useQuery } from '@tanstack/react-query';
import { chatApi } from '@/lib/api';
import { useSession } from '@clerk/nextjs';
import Loader from '@/components/ui/loader';

const DocumentsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { session } = useSession();
  const {
    data: documents,
    isLoading,
    // error,
  } = useQuery({
    queryKey: ['documents', { sessionId: session?.id }],
    queryFn: () => {
      return session && chatApi.getAllDocuments(session?.id);
    },
    enabled: !!session?.id, // Only run query when session.id exists
    refetchInterval: 10000, // Refetch every 10 seconds
  });
  useEffect(() => {
    console.log('Documents:', documents);
  }, [documents])
  
  if (isLoading) return (
    <div className="flex items-center justify-center h-[50vh]">
      <Loader title="Loading Documents" description="Please wait... it may take a few seconds" />
    </div>
  );

  return (
    <div className="mt-6 flex flex-col justify-center gap-6 sm:gap-8">
      {/* upload documents */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Documents</h1>
          <p className="text-xs sm:text-sm">
            Upload and manage your documents.
          </p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="sm:p-5 sm:text-base"
        >
          <Upload /> Upload
        </Button>
        <UploadModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>

      {/* display documents */}
      <DataTable columns={columns} data={documents || []} />
    </div>
  );
};

export default DocumentsPage;
