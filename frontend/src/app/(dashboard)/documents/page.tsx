'use client';
import { Button } from '@/components/ui/button';
import { UploadModal } from '@/components/ui/documents/upload-modal';
import { Upload } from 'lucide-react';
import { useState } from 'react';
import { DataTable } from './data-table';
import { columns } from './columns';
import { Document } from '@/lib/types';

export const docs: Document[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440000',
    name: 'Project Proposal',
    type: 'pdf',
    size: 1024,
    status: 'Success',
    createdAt: '2025-03-19T10:00:00Z',
    updatedAt: '2025-03-19T12:00:00Z',
  },
  {
    id: 'd1e2f3a4-b5c6-7890-abcd-ef0123456789',
    name: 'Project Proposal',
    type: 'pdf',
    size: 1024,
    status: 'Failed',
    createdAt: '2025-03-19T10:00:00Z',
    updatedAt: '2025-03-19T12:00:00Z',
  },
  {
    id: '6a1b2c3d-4e5f-6789-abcd-ef0123456789',
    name: 'Design Mockup',
    type: 'png',
    size: 2048,
    status: 'Processing',
    createdAt: '2025-03-18T09:30:00Z',
    updatedAt: '2025-03-19T11:45:00Z',
  },
  {
    id: '7b8c9d0e-1f2a-3456-bcde-789012345678',
    name: 'Design Mockup',
    type: 'png',
    size: 2048,
    status: 'Success',
    createdAt: '2025-03-18T09:30:00Z',
    updatedAt: '2025-03-19T11:45:00Z',
  },
  {
    id: '78901234-5678-90ab-cdef-1234567890ab',
    name: 'Meeting Notes',
    type: 'docx',
    size: 512,
    status: 'Success',
    createdAt: '2025-03-17T14:15:00Z',
    updatedAt: '2025-03-18T08:20:00Z',
  },
  {
    id: '89abcdef-0123-4567-89ab-cdef01234567',
    name: 'Budget Report',
    type: 'xlsx',
    size: 3072,
    status: 'Success',
    createdAt: '2025-03-16T16:45:00Z',
    updatedAt: '2025-03-17T10:30:00Z',
  },
  {
    id: '9abcde01-2345-6789-abcd-ef0123456789',
    name: 'Budget Report',
    type: 'xlsx',
    size: 3072,
    status: 'Failed',
    createdAt: '2025-03-16T16:45:00Z',
    updatedAt: '2025-03-17T10:30:00Z',
  },
  {
    id: 'abcdef01-2345-6789-abcd-ef0123456789',
    name: 'User Guide',
    type: 'pdf',
    size: 4096,
    status: 'Processing',
    createdAt: '2025-03-15T11:10:00Z',
    updatedAt: '2025-03-16T13:00:00Z',
  },
  {
    id: 'bcdef012-3456-789a-bcde-f01234567890',
    name: 'User Guide',
    type: 'pdf',
    size: 4096,
    status: 'Success',
    createdAt: '2025-03-15T11:10:00Z',
    updatedAt: '2025-03-16T13:00:00Z',
  },
];

const DocumentsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      <DataTable columns={columns} data={docs} />
    </div>
  );
};

export default DocumentsPage;
