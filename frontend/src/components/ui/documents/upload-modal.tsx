'use client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { chatApi } from '@/lib/api'; // adjust the import to your actual API location
import { useSession } from '@clerk/nextjs';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Upload as UploadIcon } from 'lucide-react';
import Image from 'next/image';
import React, { useRef, useState } from 'react';
import { toast } from 'sonner';
import { VALID_FILE_TYPES } from '../../../../constants';
import CustomSwitch from '../chatbot/persona-trait';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UploadModal({ isOpen, onClose }: UploadModalProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [saveFile, setSaveFile] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);
  const { session } = useSession();
  const queryClient = useQueryClient();

  const validateFile = (file: File): boolean => {
    const maxSize = 25 * 1024 * 1024; // 25MB

    if (!VALID_FILE_TYPES.includes(file.type)) {
      setError(
        'Invalid file type. Please upload PDF, DOCX, or TXT files only.'
      );
      return false;
    }

    if (file.size > maxSize) {
      setError('File size exceeds 25MB limit.');
      return false;
    }

    setError('');
    return true;
  };

  const handleFileSelect = (file: File) => {
    if (validateFile(file)) {
      setSelectedFile(file);
    }
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files?.[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  // React Query mutation for uploading a file
  const mutation = useMutation({
    mutationKey: ['uploadDocument'],
    mutationFn: ({
      file,
      sessionId,
      save = false,
    }: {
      file: File;
      sessionId: string;
      save?: boolean;
    }) => chatApi.uploadDocument(file, sessionId, save),
    onSuccess: () => {
      // invalidate queries to refetch documents
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      toast.success('Uploaded!', {
        description: 'File uploaded successfully',
      });
      setSelectedFile(null);
      onClose();
    },
    onError: () => {
      toast.error('Error', {
        description: 'Failed to upload file. Please try again.',
      });
      setError('Failed to upload file. Please try again.');
    },
  });

  const handleConfirmUpload = () => {
    if (selectedFile && !mutation.isPending && session) {
      mutation.mutate({
        file: selectedFile,
        sessionId: session.id,
        save: saveFile,
      });
    }
  };

  const resetSelection = () => {
    setSelectedFile(null);
    setError('');
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
          resetSelection();
        }
      }}
    >
      <DialogContent className="sm:max-w-md lg:max-w-lg">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground" />
        </DialogHeader>

        {!selectedFile ? (
          <div
            onClick={() => inputRef.current?.click()}
            className={`cursor-pointer rounded-lg border-2 border-dashed p-8 text-center hover:border-primary hover:bg-primary/5 ${
              dragActive ? 'border-primary bg-primary/5' : 'border-border'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={inputRef}
              type="file"
              className="hidden"
              accept=".pdf,.docx,.txt"
              onChange={handleChange}
            />

            <p className="mb-2 text-muted-foreground">
              Drag and drop your file here, or{' '}
              <Button variant="link" className="h-auto p-0">
                browse
              </Button>
            </p>
            <p className="text-sm text-muted-foreground">
              Supported formats: PDF, DOCX, TXT (Max 25MB)
            </p>
            {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-lg bg-muted p-4">
              <div className="flex items-center">
                {selectedFile.type === 'application/pdf' ? (
                  <Image
                    src="/pdf.svg"
                    alt="PDF Icon"
                    width={32}
                    height={32}
                    className="mr-3 h-12 w-12"
                  />
                ) : selectedFile.type === 'text/plain' ? (
                  <Image
                    src="/txt.svg"
                    alt="TXT Icon"
                    width={32}
                    height={32}
                    className="mr-3 h-12 w-12"
                  />
                ) : (
                  <Image
                    src="/doc.svg"
                    alt="DOCX Icon"
                    width={32}
                    height={32}
                    className="mr-3 h-12 w-12"
                  />
                )}
                <div>
                  <h3 className="font-medium">
                    {selectedFile.name.length > 20
                      ? `${selectedFile.name.slice(0, 20)}...${selectedFile.name.slice(-8)}`
                      : selectedFile.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="w-full">
                <CustomSwitch
                  title="Save Document (Optional)"
                  description="This will save the document's content on your profile?"
                  isSelected={saveFile}
                  onToggle={(newValue) => {
                    setSaveFile(newValue);
                  }}
                />
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={handleConfirmUpload}
                  className="flex-1"
                  disabled={mutation.isPending}
                >
                  <UploadIcon className="h-5 w-5" />
                  {mutation.isPending ? 'Uploading...' : 'Confirm Upload'}
                </Button>
                <Button
                  onClick={resetSelection}
                  className="btn-secondary flex-1"
                  disabled={mutation.isPending}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
