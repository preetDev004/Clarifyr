'use client';
import { Button } from '@/components/ui/button';
import { SubmitHandler, useForm } from 'react-hook-form';
import { CreateBotFormInputs } from '@/lib/types';
import { ArrowLeft } from 'lucide-react';
import FirstImpressionSection from '@/components/ui/chatbot/first-impression-section';
import KnowledgeBaseSection from '@/components/ui/chatbot/knowledge-base-section';
import PersonalitySection from '@/components/ui/chatbot/personality-section';
import AccessControlSection from '@/components/ui/chatbot/access-control-section';

const CreateBotPage = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateBotFormInputs>({
    defaultValues: {
      selectedDocs: [],
      botPersona: [],
      allowedDomains: ['', ''],
    },
  });

  const formSubmitHandler: SubmitHandler<CreateBotFormInputs> = (data) => {
    try {
      const trimmedData = {
        botName: data.botName.trim(),
        botDescription: data.botDescription.trim(),
        openingMessage: data.openingMessage.trim(),
        selectedDocs: data.selectedDocs,
        botPersona: data.botPersona,
        allowedDomains: data.allowedDomains.filter(
          (domain) => domain.trim() !== ''
        ),
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
        <FirstImpressionSection
          register={register}
          errors={errors}
          validateNotOnlyWhitespace={validateNotOnlyWhitespace}
        />

        <KnowledgeBaseSection control={control} errors={errors} />

        <PersonalitySection control={control} errors={errors} />

        <AccessControlSection control={control} errors={errors} />

        <Button className="flex w-fit items-end justify-end" type="submit">
          Save & Create
        </Button>
      </form>
    </div>
  );
};

export default CreateBotPage;
