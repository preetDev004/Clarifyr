'use client';
import { Button } from '@/components/ui/button';
import { UploadModal } from '@/components/ui/documents/upload-modal';
import { Upload } from 'lucide-react';
import { useState } from 'react';

const Page = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const [documents, setDocuments] = useState < Array<unknown>([]);

  // const handleUpload = (file: File) => {
  //   const newDoc = {
  //     name: file.name,
  //     size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
  //     type: file.type.split('/')[1].toUpperCase(),
  //     uploadedAt: new Date().toLocaleDateString(),
  //   };
  //   setDocuments([...documents, newDoc]);
  // };
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
          // onUpload={handleUpload}
          onUpload={() => console.log('upload')}
        />
      </div>

      {/* display documents */}
      <div className=""> Display</div>
    </div>
  );
};

export default Page;
