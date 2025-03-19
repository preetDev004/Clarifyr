'use client';
import { Button } from '@/components/ui/button';
import { UploadModal } from '@/components/ui/documents/upload-modal';
import { Upload } from 'lucide-react';
import { useState } from 'react';

const Page = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="mt-6 flex flex-col justify-center gap-6 sm:gap-8">
      {/* upload documents */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Documents</h1>
          <p className="text-sm">Upload and manage your documents.</p>
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
      <div className=""> Display User Docs</div>
    </div>
  );
};

export default Page;
