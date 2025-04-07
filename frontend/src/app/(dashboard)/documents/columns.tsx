// Columns.tsx
'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { UserDocument } from '@/lib/types';
import { ColumnDef } from '@tanstack/react-table';
import { Eye, MoreVertical, Trash } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { DocumentViewerModal } from '@/components/ui/documents/document-viewer-modal';

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<UserDocument>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <div className="flex w-8 items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex w-8 items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
    size: 40, // Fixed width for the checkbox column
  },
  {
    accessorKey: 'name',
    header: () => (
      <p className="my-2.5 font-semibold text-teal-700 dark:text-teal-300">
        Doc Name
      </p>
    ),
    cell: ({ row }) => {
      const name = row.getValue('name') as string;
      return (
        <>
          <span className="block lg:hidden">
            {name.length > 30
              ? `${name.substring(0, 20)}...` + `${name.slice(-6)}`
              : name}
          </span>
          <span className="hidden lg:block">
            {name.length > 170
              ? `${name.substring(0, 170)}...` + `${name.slice(-6)}`
              : name}
          </span>
        </>
      );
    },
  },
  {
    accessorKey: 'type',
    header: () => (
      <p className="my-2.5 hidden font-semibold text-teal-700 dark:text-teal-300 sm:block">
        Type
      </p>
    ),
    cell: ({ row }) => {
      const type = (row.getValue('type') as string).split('/')[1] || '';
      return (
        <p className="hidden sm:block">
          {(type.length > 5 ? 'DOCX' : type).toUpperCase()}
        </p>
      );
    },
  },
  {
    accessorKey: 'status',
    header: () => (
      <p className="my-2.5 font-semibold text-teal-700 dark:text-teal-300">
        Status
      </p>
    ),
    cell: ({ row }) => {
      const status = row.getValue('status') as string;

      // Define color based on status
      let statusColor = '';
      switch (status.toLowerCase()) {
        case 'processing':
          statusColor = 'bg-amber-400 animate-pulse'; // yellowish for processing
          break;
        case 'success':
          statusColor = 'bg-emerald-500'; // emerald for success
          break;
        default:
          statusColor = 'bg-red-500'; // redish for failed
          break;
      }

      return (
        <div className="flex items-center gap-2">
          <div className={`h-2.5 w-2.5 rounded-full ${statusColor}`} />
          <p>{status}</p>
        </div>
      );
    },
  },
  {
    id: 'actions',
    header: () => {
      return (
        <p className="my-2.5 flex justify-center font-semibold text-teal-700 dark:text-teal-300">
          Actions
        </p>
      );
    },
    cell: ({ row }) => {
      const document = row.original;

      return <DocumentActions document={document} />;
    },
  },
];

const DocumentActions = ({ document }: { document: UserDocument }) => {
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  return (
    <div className="flex justify-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size={'icon'} className="p-0">
            <MoreVertical className="h-4 w-4 cursor-pointer" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {document.saved && (
            <DropdownMenuItem onClick={() => setIsViewerOpen(true)}>
              <Eye className="mr-2 h-4 w-4" /> View Content
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            className="text-red-600"
            onClick={() => console.log('Delete document', document.id)}
          >
            <Trash className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {document.saved && (
        <DocumentViewerModal
          isOpen={isViewerOpen}
          onClose={() => setIsViewerOpen(false)}
          documentId={document.id}
          documentType={document.type}
          documentName={document.name}
        />
      )}
    </div>
  );
};
