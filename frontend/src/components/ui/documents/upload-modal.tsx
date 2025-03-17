'use client';
import React, { useRef, useState } from 'react';
import { Upload as UploadIcon, FileText, FileIcon } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File) => Promise<void> | void;
}

export function UploadModal({ isOpen, onClose, onUpload }: UploadModalProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const validateFile = (file: File): boolean => {
    const validTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
    ];
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes

    if (!validTypes.includes(file.type)) {
      setError(
        'Invalid file type. Please upload PDF, DOCX, or TXT files only.'
      );
      return false;
    }

    if (file.size > maxSize) {
      setError('File size exceeds 5MB limit.');
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

  const handleConfirmUpload = async () => {
    if (selectedFile && !isUploading) {
      try {
        setIsUploading(true);
        await onUpload(selectedFile);
        onClose();
        setSelectedFile(null);
      } catch (err: unknown) {
        console.error(err);
        setError('Failed to upload file. Please try again.');
      } finally {
        setIsUploading(false);
      }
    }
  };

  const resetSelection = () => {
    setSelectedFile(null);
    setError('');
    setIsUploading(false);
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
      <DialogContent className="sm:max-w-md">
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
              <Button
                variant="link"
                className="h-auto p-0"
                onClick={() => inputRef.current?.click()}
              >
                browse
              </Button>
            </p>
            <p className="text-sm text-muted-foreground">
              Supported formats: PDF, DOCX, TXT (Max 5MB)
            </p>
            {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-lg bg-muted p-4">
              <div className="flex items-center">
                {selectedFile.type === 'application/pdf' ? (
                  <FileText className="mr-3 h-8 w-8 text-destructive" />
                ) : selectedFile.type === 'text/plain' ? (
                  <FileText className="mr-3 h-8 w-8 text-primary" />
                ) : (
                  <FileIcon className="mr-3 h-8 w-8 text-primary" />
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

            <div className="flex gap-3">
              <Button
                onClick={handleConfirmUpload}
                className="flex-1"
                disabled={isUploading}
              >
                <UploadIcon className="h-5 w-5" />
                {isUploading ? 'Uploading...' : 'Confirm Upload'}
              </Button>
              <Button
                onClick={resetSelection}
                className="btn-secondary flex-1"
                disabled={isUploading}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
