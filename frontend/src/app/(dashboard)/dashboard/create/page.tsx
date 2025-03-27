'use client';
import { Button } from '@/components/ui/button';
import BotCardHeader from '@/components/ui/chatbot/bot-card-header';
import { DialogHeader } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from '@radix-ui/react-dialog';
import { ArrowLeft, Check, Plus, Search, X } from 'lucide-react';
import { useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { docs } from '../../documents/page';

type Inputs = {
  botName: string;
  botDescription: string;
  openingMessage: string;
  selectedDocs: string[];
};

const CreateBotPage = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      selectedDocs: [],
    },
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);

  const formSubmitHandler: SubmitHandler<Inputs> = (data) => {
    try {
      const trimmedData = {
        botName: data.botName.trim(),
        botDescription: data.botDescription.trim(),
        openingMessage: data.openingMessage.trim(),
        selectedDocs: data.selectedDocs,
      };

      console.log(trimmedData);
    } catch (error) {
      console.error('Submission error:', error);
    }
  };

  const validateNotOnlyWhitespace = (value: string) => {
    return (
      value.trim().length > 0 ||
      'This field cannot be empty or contain only spaces'
    );
  };

  const filteredDocuments = docs.filter((doc) =>
    doc.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mt-6 flex flex-col justify-center gap-6">
      <div className="flex items-center gap-2">
        <ArrowLeft
          className="h-9 w-9 cursor-pointer rounded-full p-2 hover:bg-custom-sage/20"
          onClick={() => window.history.back()}
        />
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">BOT Details</h1>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(formSubmitHandler)}
        className="flex flex-col gap-4 sm:container md:gap-8"
      >
        {/* Name & Opening */}
        <div className="border-1 flex flex-col gap-4 rounded-md border bg-white/20 bg-opacity-75 p-4 shadow-md dark:bg-teal-900/10 sm:flex-row sm:items-start sm:justify-between sm:p-6">
          <BotCardHeader
            title={'First Impression'}
            description={
              "Shape your users' first interaction with a captivating bot name and a warm welcome message."
            }
          />
          <div className="flex w-full flex-col gap-4 sm:max-w-md lg:max-w-lg xl:max-w-xl">
            <div className="grid w-full gap-1.5">
              <label htmlFor="bot-name" className="text-sm sm:text-base">
                Bot Name
              </label>
              <div className="relative">
                <Input
                  {...register('botName', {
                    required: 'Bot name is required',
                    validate: {
                      notEmpty: validateNotOnlyWhitespace,
                      minLength: (value) =>
                        value.trim().length >= 3 ||
                        'Bot name must be at least 3 characters long',
                      maxLength: (value) =>
                        value.trim().length <= 50 ||
                        'Bot name cannot exceed 50 characters',
                    },
                  })}
                  placeholder="e.g. Chatty Charlie"
                  className={`w-full ${
                    errors.botName
                      ? 'border border-red-500 focus:border-red-500'
                      : 'border border-input'
                  } `}
                  id="bot-name"
                />
                {errors.botName && (
                  <div className="absolute h-0 w-full">
                    <p className="absolute mt-1 text-xs text-red-500">
                      {errors.botName.message}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-2 grid w-full gap-1.5">
              <label htmlFor="bot-description" className="text-sm sm:text-base">
                Bot Description
              </label>
              <div className="relative">
                <Textarea
                  {...register('botDescription', {
                    required: 'Bot description is required',
                    validate: {
                      notEmpty: validateNotOnlyWhitespace,
                      minLength: (value) =>
                        value.trim().length >= 10 ||
                        'Description must be at least 10 characters long',
                      maxLength: (value) =>
                        value.trim().length <= 200 ||
                        'Description cannot exceed 200 characters',
                    },
                  })}
                  rows={3}
                  className={`w-full ${
                    errors.botDescription
                      ? 'border border-red-500 focus:border-red-500'
                      : 'border border-input'
                  } `}
                  placeholder="e.g. A bot that helps users discover new things and get answers to their questions."
                  id="bot-description"
                />
                {errors.botDescription && (
                  <div className="absolute h-0 w-full">
                    <p className="absolute mt-1 text-xs text-red-500">
                      {errors.botDescription.message}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-2 grid w-full gap-1.5">
              <label htmlFor="opening-message" className="text-sm sm:text-base">
                Opening Message
              </label>
              <div className="relative">
                <Textarea
                  {...register('openingMessage', {
                    required: 'Opening message is required',
                    validate: {
                      notEmpty: validateNotOnlyWhitespace,
                      minLength: (value) =>
                        value.trim().length >= 10 ||
                        'Opening message must be at least 10 characters long',
                      maxLength: (value) =>
                        value.trim().length <= 200 ||
                        'Opening message cannot exceed 200 characters',
                    },
                  })}
                  rows={3}
                  className={`w-full ${
                    errors.openingMessage
                      ? 'border border-red-500 focus:border-red-500'
                      : 'border border-input'
                  } `}
                  placeholder="e.g. Hey there! I'm Chatty Charlie. What can I help you discover today?"
                  id="opening-message"
                />
                {errors.openingMessage && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.openingMessage.message}
                  </p>
                )}
                {!errors.openingMessage && (
                  <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                    This is your bot's chance to make a stellar first
                    impression. Make it count!
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Knowledge Base */}
        <div className="border-1 flex flex-col gap-4 rounded-md border bg-white/20 bg-opacity-75 p-4 shadow-md dark:bg-teal-900/10 sm:flex-row sm:items-start sm:justify-between sm:p-6">
          <BotCardHeader
            title={'Knowledge Base'}
            description={
              'Choose Documents you want to add to your knowledge base of your AI Assistant.'
            }
          />
          <div className="flex w-full flex-col gap-4 sm:max-w-md lg:max-w-lg xl:max-w-xl">
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
                                placeholder="Search documents..."
                                className="pl-10"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                              />
                            </div>
                            <div className="scrollbar-hide max-h-[300px] space-y-2 overflow-y-auto scroll-smooth">
                              {filteredDocuments.map((doc) => (
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
                                    <p className="font-medium">{doc.name}</p>
                                    <p className="text-sm text-muted-foreground/80">
                                      {doc.type} • {doc.size} MB
                                    </p>
                                  </div>
                                  {value.includes(doc.id) ? (
                                    <Check className="h-5 w-5 text-primary dark:text-custom-hoverdark" />
                                  ) : (
                                    <Plus className="h-5 w-5 text-muted-foreground/80" />
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="mt-4 flex justify-end">
                            <Button
                              onClick={() => setIsDocumentModalOpen(false)}
                            >
                              Done
                            </Button>
                          </div>
                        </DialogContent>
                      </DialogPortal>
                    </Dialog>
                  </div>
                  <div
                    className={`rounded-lg ${value.length === 0 ? 'border border-dashed bg-gray-100 p-6 text-center dark:bg-teal-900/20' : ''} ${errors.selectedDocs ? 'border-red-600' : ''}`}
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
                                  {doc.name}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {doc.type} • {doc.size} MB
                                </p>
                              </div>

                              <X
                                className="trasition-all h-7 w-7 cursor-pointer rounded-sm p-1.5 duration-150 hover:bg-red-400/10 hover:text-red-500"
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
                        No documents selected. Browse and select up to 4
                        documents.
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

        <Button className="flex w-fit items-end justify-end" type="submit">
          Save & Create
        </Button>
      </form>
    </div>
  );
};

export default CreateBotPage;
