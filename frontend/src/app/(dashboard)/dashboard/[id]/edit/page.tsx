'use client';

import { Button } from '@/components/ui/button';
import Loader from '@/components/ui/loader';
import FirstImpressionSection from '@/components/ui/chatbot/first-impression-section';
import KnowledgeBaseSection from '@/components/ui/chatbot/knowledge-base-section';
import PersonalitySection from '@/components/ui/chatbot/personality-section';
import AccessControlSection from '@/components/ui/chatbot/access-control-section';
import { chatApi } from '@/lib/api';
import { CreateBotFormInputs } from '@/lib/types';
import { useChatbot } from '@/hooks/useChatbots';
import { useSession } from '@clerk/nextjs';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';

const EditBotPage = () => {
  const params = useParams();
  const router = useRouter();
  const { session } = useSession();
  const queryClient = useQueryClient();
  const chatbotId = (params?.id as string) || undefined;
  const [mutationError, setMutationError] = useState<string | null>(null);

  const { chatbot, isLoading, error } = useChatbot(chatbotId);

  const defaultValues = useMemo<CreateBotFormInputs>(
    () => ({
      name: '',
      description: '',
      welcome_message: '',
      personality_traits: [],
      expertise_docs: [],
      whitelist_domains: ['', ''],
    }),
    []
  );

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<CreateBotFormInputs>({
    defaultValues,
  });

  // Keep a normalized snapshot of the initial values to compare on submit
  const initialNormalizedRef = useRef<Partial<CreateBotFormInputs> | null>(null);

  useEffect(() => {
    if (chatbot) {
      const expertiseDocIds: string[] = Array.isArray(chatbot.expertise_docs)
        ? chatbot.expertise_docs
            .map((d: string | { id: string }) =>
              typeof d === 'string' ? d : d.id
            )
            .filter((x: unknown): x is string => typeof x === 'string' && x.length > 0)
        : [];

      reset({
        name: chatbot.name || '',
        description: chatbot.description || '',
        welcome_message: chatbot.welcome_message || '',
        personality_traits: chatbot.personality_traits || [],
        expertise_docs: expertiseDocIds,
        whitelist_domains: chatbot.whitelist_domains?.length
          ? chatbot.whitelist_domains
          : ['', ''],
      });

      // Store normalized initial values for later comparison
      const normalizedInitial: Partial<CreateBotFormInputs> = {
        description: (chatbot.description || '').trim(),
        welcome_message: (chatbot.welcome_message || '').trim(),
        personality_traits: Array.isArray(chatbot.personality_traits)
          ? [...chatbot.personality_traits]
          : [],
        expertise_docs: expertiseDocIds,
        whitelist_domains: Array.isArray(chatbot.whitelist_domains)
          ? chatbot.whitelist_domains.filter((d: string) => d.trim() !== '')
          : [],
      };
      initialNormalizedRef.current = normalizedInitial;
    }
  }, [chatbot, reset]);

  const { mutate: updateChatbot, isPending } = useMutation({
    mutationFn: async (data: Partial<CreateBotFormInputs>) => {
      if (!session?.id || !chatbotId) {
        throw new Error('Missing session or chatbot id');
      }
      return chatApi.updateChatbot(session.id, chatbotId, data);
    },
    onMutate: () => {
      setMutationError(null);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chatbots'] });
      if (chatbotId) {
        queryClient.invalidateQueries({ queryKey: ['chatbot', chatbotId] });
      }
      router.push('/dashboard');
      setMutationError(null);
      toast.success('Saved', { description: 'Chatbot updated successfully!' });
    },
    onError: (err: Error) => {
      const message = err.message || 'Failed to update chatbot';
      setMutationError(message);
      toast.error('Error', { description: message });
    },
  });

  const arraysShallowEqual = useCallback((a: unknown[], b: unknown[]) => {
    if (a === b) return true;
    if (!Array.isArray(a) || !Array.isArray(b)) return false;
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }, []);

  const areUpdatesEqual = useCallback(
    (a: Partial<CreateBotFormInputs>, b: Partial<CreateBotFormInputs>) => {
      return (
        (a.description || '') === (b.description || '') &&
        (a.welcome_message || '') === (b.welcome_message || '') &&
        arraysShallowEqual((a.personality_traits as unknown[]) || [], (b.personality_traits as unknown[]) || []) &&
        arraysShallowEqual((a.expertise_docs as unknown[]) || [], (b.expertise_docs as unknown[]) || []) &&
        arraysShallowEqual((a.whitelist_domains as unknown[]) || [], (b.whitelist_domains as unknown[]) || [])
      );
    },
    [arraysShallowEqual]
  );

  const formSubmitHandler: SubmitHandler<CreateBotFormInputs> = useCallback(
    (data) => {
      if (!chatbotId) return;

      const normalizedCurrent: Partial<CreateBotFormInputs> = {
        description: data.description.trim(),
        welcome_message: data.welcome_message.trim(),
        personality_traits: data.personality_traits,
        expertise_docs: data.expertise_docs,
        whitelist_domains: data.whitelist_domains.filter((d) => d.trim() !== ''),
      };

      const normalizedInitial = initialNormalizedRef.current;
      if (normalizedInitial && areUpdatesEqual(normalizedInitial, normalizedCurrent)) {
        router.push('/dashboard');
        toast.success('Saved', { description: 'No changes detected.' });
        return;
      }

      updateChatbot(normalizedCurrent);
    },
    [updateChatbot, chatbotId, areUpdatesEqual, router]
  );

  const validateNotOnlyWhitespace = useCallback((value: string) => {
    return value.trim().length > 0 || 'This field cannot be empty or contain only spaces';
  }, []);

  if (!chatbotId) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <p className="text-red-500">Invalid chatbot URL. Missing chatbot ID.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader title="Loading chatbot" description="Please wait..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <p className="text-red-500">Failed to load chatbot.</p>
      </div>
    );
  }

  return (
    <div className="mb-6 mt-6 flex flex-col justify-center gap-6 sm:mb-12">
      <div className="flex items-center gap-2">
        <ArrowLeft
          className="h-9 w-9 cursor-pointer rounded-full p-2 hover:bg-custom-sage/20"
          onClick={() => window.history.back()}
        />
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Edit BOT</h1>
        </div>
      </div>

      {mutationError && (
        <div className="rounded-md border border-red-500/40 bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950/30">
          {mutationError}
        </div>
      )}
      <form onSubmit={handleSubmit(formSubmitHandler)} className="flex flex-col gap-4 md:container md:gap-8">
        <Suspense fallback={<Loader title="Loading form section..." description="Please wait..." />}> 
          <FirstImpressionSection
            register={register}
            errors={errors}
            validateNotOnlyWhitespace={validateNotOnlyWhitespace}
            mode="edit"
            initialName={chatbot?.name}
          />
        </Suspense>

        <Suspense fallback={<Loader title="Loading knowledge base..." description="Please wait..." />}> 
          <KnowledgeBaseSection control={control} errors={errors} />
        </Suspense>

        <Suspense fallback={<Loader title="Loading personality settings..." description="Please wait..." />}> 
          <PersonalitySection control={control} errors={errors} />
        </Suspense>

        <Suspense fallback={<Loader title="Loading access control..." description="Please wait..." />}> 
          <AccessControlSection control={control} errors={errors} />
        </Suspense>

        <Button className="flex w-fit items-end justify-end" type="submit" disabled={isPending}>
          {isPending ? 'Saving...' : 'Save Changes'}
        </Button>
      </form>
    </div>
  );
};

export default EditBotPage;


