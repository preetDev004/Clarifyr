'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import BotCardHeader from './bot-card-header';
import { ArrowRight, BrainCircuit, Check, Plus, Search, X } from 'lucide-react';
import { useState } from 'react';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import { CreateBotFormInputs } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from '@radix-ui/react-dialog';
import { DialogHeader } from '../dialog';
import { useDocuments } from '@/hooks/useDocuments';
import Loader from '../loader';
import Link from 'next/link';
import { useDebounce } from '@/hooks/useDebounce';

interface KnowledgeBaseSectionProps {
  control: Control<CreateBotFormInputs>;
  errors: FieldErrors<CreateBotFormInputs>;
}

const KnowledgeBaseSection = ({
  control,
  errors,
}: KnowledgeBaseSectionProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);

  // Debounce the search term to avoid excessive API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Pass the debounced search term to the useDocuments hook
  const { documents: docs, isLoading } = useDocuments({
    forceEnable: isDocumentModalOpen,
    searchQuery: debouncedSearchTerm,
  });

  // No need for client-side filtering anymore since the API handles it
  // The filteredDocuments variable can be removed, use docs directly

  // Update the search input handler
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="border-1 flex flex-col gap-4 rounded-md border bg-white/20 bg-opacity-75 p-4 shadow-md dark:bg-teal-900/10 sm:p-6 md:flex-row md:items-start md:justify-between">
      <BotCardHeader
        icon={BrainCircuit}
        title={'Knowledge Base'}
        description={
          'Choose Documents you want to add to your knowledge base of your AI Assistant.'
        }
      />
      <div className="flex w-full flex-col gap-4 md:max-w-md lg:max-w-lg xl:max-w-xl">
        <Controller
          name="selectedDocs"
          control={control}
          rules={{
            validate: {
              required: (value) =>
                value.length > 0 || 'Please select at least one document',
              maxLength: (value) =>
                value.length <= 4 || 'You can select up to 4 documents',
            },
          }}
          render={({ field: { value, onChange } }) => (
            <div className="flex w-full flex-col gap-4 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm md:text-base">
                  Selected Documents ({value.length}/4)
                </label>
                <Dialog
                  open={isDocumentModalOpen}
                  onOpenChange={setIsDocumentModalOpen}
                >
                  <DialogTrigger asChild>
                    <Button className="btn-secondary flex items-center gap-2">
                      <Search className="h-4 w-4" />
                      Files
                    </Button>
                  </DialogTrigger>
                  <DialogPortal>
                    <DialogOverlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />
                    <DialogContent className="fixed left-1/2 top-1/2 z-50 w-full max-w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-xl focus:outline-none dark:bg-custom-darkblue">
                      <DialogHeader className="mb-4">
                        <DialogTitle className="text-xl font-semibold">
                          Select Documents (Max 4)
                        </DialogTitle>
                      </DialogHeader>
                      <div className="py-2">
                        <div className="relative mb-4">
                          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            placeholder="Search documents...(Name or Content)"
                            className="pl-10"
                            value={searchTerm}
                            onChange={handleSearchChange}
                          />
                        </div>
                        <div className="scrollbar-hide max-h-[300px] space-y-2 overflow-y-auto scroll-smooth">
                          {isLoading ? (
                            <div className="-mt-14">
                              <Loader
                                title="Searching Documents"
                                description="Please wait... retrieving your documents"
                              />
                            </div>
                          ) : docs.length > 0 ? (
                            docs.map((doc) => {
                              if (doc.status !== 'Success') return null;
                              return (
                                <div
                                  key={doc.id}
                                  className={`flex cursor-pointer items-center justify-between rounded-lg border p-3 transition-colors hover:bg-gray-50 hover:dark:bg-custom-hoverdark/20 ${
                                    value.includes(doc.id)
                                      ? 'border-primary bg-primary/5 dark:border-teal-400 dark:bg-primary/10'
                                      : 'border-teal-900'
                                  }`}
                                  onClick={() => {
                                    const newValue = value.includes(doc.id)
                                      ? value.filter((id) => id !== doc.id)
                                      : value.length < 4
                                        ? [...value, doc.id]
                                        : value;
                                    onChange(newValue);
                                  }}
                                >
                                  <div>
                                    <p className="font-medium">
                                      {doc.name.length > 50
                                        ? `${doc.name.substring(0, 50)}...`
                                        : doc.name}
                                    </p>
                                    <p className="text-sm text-muted-foreground/80">
                                      {doc.type.split('/').pop()?.toUpperCase()}
                                    </p>
                                  </div>
                                  {value.includes(doc.id) ? (
                                    <Check className="h-5 w-5 flex-shrink-0 text-primary dark:text-custom-hoverdark" />
                                  ) : (
                                    <Plus className="h-5 w-5 flex-shrink-0 text-muted-foreground/80" />
                                  )}
                                </div>
                              );
                            })
                          ) : (
                            <div className="flex flex-col items-center justify-center gap-2 p-4">
                              <p className="text-muted-foreground">
                                {searchTerm
                                  ? 'No Matching Documents Found.'
                                  : 'No Documents Found.'}
                              </p>
                              <Link
                                href={'/documents'}
                                className="flex items-center justify-center gap-1 text-sm text-primary hover:underline hover:underline-offset-4"
                              >
                                Go to Documents{' '}
                                <ArrowRight className="h-4 w-4" />{' '}
                              </Link>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end">
                        <Button onClick={() => setIsDocumentModalOpen(false)}>
                          Done
                        </Button>
                      </div>
                    </DialogContent>
                  </DialogPortal>
                </Dialog>
              </div>
              <div
                className={`rounded-lg ${
                  value.length === 0
                    ? 'border border-dashed bg-gray-100 p-6 text-center dark:bg-teal-900/20'
                    : ''
                } ${errors.selectedDocs ? 'border-red-600' : ''}`}
              >
                {value.length > 0 ? (
                  <div className="grid w-full grid-cols-1 gap-3 xl:grid-cols-2">
                    {value.map((docId) => {
                      const doc = docs.find((d) => d.id === docId);
                      return doc ? (
                        <div
                          key={docId}
                          className="flex w-full items-center justify-between rounded-lg border border-teal-900/50 bg-custom-teal/5 p-3 shadow-md"
                        >
                          <div>
                            <p className="truncate font-medium">
                              {doc.name.length > 30
                                ? `${doc.name.substring(0, 25)}...`
                                : doc.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {doc.type.split('/').pop()?.toUpperCase()}
                            </p>
                          </div>

                          <X
                            className="trasition-all h-7 w-7 flex-shrink-0 cursor-pointer rounded-sm p-1.5 duration-150 hover:bg-red-400/10 hover:text-red-500"
                            onClick={() => {
                              const newValue = value.filter(
                                (id) => id !== docId
                              );
                              onChange(newValue);
                            }}
                          />
                        </div>
                      ) : null;
                    })}
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    No documents selected. Browse and select up to 4 documents.
                  </p>
                )}
                {errors.selectedDocs && (
                  <p className="bottom-0 text-xs text-red-500">
                    {errors.selectedDocs.message}
                  </p>
                )}
              </div>
            </div>
          )}
        />
      </div>
    </div>
  );
};

export default KnowledgeBaseSection;
