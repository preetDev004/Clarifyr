'use client';
import { Button } from '@/components/ui/button';
import { chatApi } from '@/lib/api';
import { CreateBotFormInputs } from '@/lib/types';
import { useSession } from '@clerk/nextjs';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, Suspense, useCallback, useMemo } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import Loader from '@/components/ui/loader';
import FirstImpressionSection from '@/components/ui/chatbot/first-impression-section';
import KnowledgeBaseSection from '@/components/ui/chatbot/knowledge-base-section';
import PersonalitySection from '@/components/ui/chatbot/personality-section';
import AccessControlSection from '@/components/ui/chatbot/access-control-section';
import { EmbedScriptDialog } from '@/components/ui/chatbot/embed-script-dialog';

const CreateBotPage = () => {
  const router = useRouter();
  const { session } = useSession();
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [chatbotUrl, setChatbotUrl] = useState('');
  const queryClient = useQueryClient();

  // Memoize form default values
  const defaultValues = useMemo(() => ({
    expertise_docs: [],
    personality_traits: [],
    whitelist_domains: ['', ''],
  }), []);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateBotFormInputs>({
    defaultValues,
  });

  const { mutate: createChatbot, isPending } = useMutation({
    mutationFn: async (data: CreateBotFormInputs) => {
      if (!session?.id) {
        throw new Error('No session available');
      }
      return chatApi.createChatbot(session.id, data);
    },
    onSuccess: (data) => {
      if (data) {
        setChatbotUrl(data.chatbot_data_url);
        queryClient.invalidateQueries({ queryKey: ['chatbots'] });
        toast.success('Success', {
          description: 'Chatbot created successfully!',
        });
        setShowSuccessDialog(true);
      }
    },
    onError: (error: Error) => {
      toast.error('Error', {
        description: error.message || 'Failed to create chatbot',
      });
    },
  });

  // Memoize expensive functions
  const formSubmitHandler: SubmitHandler<CreateBotFormInputs> = useCallback((data) => {
    try {
      // Convert to API format
      const apiData: CreateBotFormInputs = {
        name: data.name.trim(),
        description: data.description.trim(),
        welcome_message: data.welcome_message.trim(),
        personality_traits: data.personality_traits,
        expertise_docs: data.expertise_docs,
        whitelist_domains: data.whitelist_domains.filter(
          (domain) => domain.trim() !== ''
        ),
      };

      createChatbot(apiData);
    } catch (error) {
      toast.error('Error Occurred', {
        description: (error as Error).message || 'Failed to process form data',
      });
    }
  }, [createChatbot]);

  const validateNotOnlyWhitespace = useCallback((value: string) => {
    return (
      value.trim().length > 0 ||
      'This field cannot be empty or contain only spaces'
    );
  }, []);

  const handleNavigateToDashboard = useCallback(() => {
    router.push('/dashboard');
  }, [router]);

  return (
    <div className="mb-6 mt-6 flex flex-col justify-center gap-6 sm:mb-12">
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
        className="flex flex-col gap-4 md:container md:gap-8"
      >
        <Suspense fallback={<Loader title="Loading form section..." description="Please wait..." />}>
          <FirstImpressionSection
            register={register}
            errors={errors}
            validateNotOnlyWhitespace={validateNotOnlyWhitespace}
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

        <Button
          className="flex w-fit items-end justify-end"
          type="submit"
          disabled={isPending}
        >
          {isPending ? 'Creating...' : 'Save & Create'}
        </Button>
      </form>

      <Suspense fallback={null}>
        <EmbedScriptDialog
          isOpen={showSuccessDialog}
          scriptUrl={chatbotUrl}
          onOpenChange={setShowSuccessDialog}
          onContinue={handleNavigateToDashboard}
        />
      </Suspense>
    </div>
  );
};

export default CreateBotPage;
