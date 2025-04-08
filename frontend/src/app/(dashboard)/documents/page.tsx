'use client';
import { Button } from '@/components/ui/button';
import { UploadModal } from '@/components/ui/documents/upload-modal';
import Loader from '@/components/ui/loader';
import { useDocuments } from '@/hooks/useDocuments';
import { UserDocument } from '@/lib/types';
import { Upload } from 'lucide-react';
import { useState } from 'react';
import { columns } from './columns';
import { DataTable } from './data-table';

const DocumentsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { documents, isLoading } = useDocuments({});

  if (isLoading)
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader
          title="Loading Documents"
          description="Please wait... it may take a few seconds"
        />
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
      <DataTable columns={columns} data={(documents as UserDocument[]) || []} />
    </div>
  );
};

export default DocumentsPage;
