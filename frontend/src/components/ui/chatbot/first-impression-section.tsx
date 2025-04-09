'use client';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import BotCardHeader from './bot-card-header';
import { Laugh } from 'lucide-react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { CreateBotFormInputs } from '@/lib/types';

interface FirstImpressionSectionProps {
  register: UseFormRegister<CreateBotFormInputs>;
  errors: FieldErrors<CreateBotFormInputs>;
  validateNotOnlyWhitespace: (value: string) => boolean | string;
}

const FirstImpressionSection = ({
  register,
  errors,
  validateNotOnlyWhitespace,
}: FirstImpressionSectionProps) => {
  return (
    <div className="border-1 flex flex-col gap-4 rounded-md border bg-white/20 bg-opacity-75 p-4 shadow-md dark:bg-teal-900/10 sm:p-6 md:flex-row md:items-start md:justify-between">
      <BotCardHeader
        icon={Laugh}
        title={'First Impression'}
        description={
          "Shape your users' first interaction with a captivating bot name and a warm welcome message."
        }
      />
      <div className="flex w-full flex-col gap-4 md:max-w-md lg:max-w-lg xl:max-w-xl">
        <div className="grid w-full gap-1.5">
          <label htmlFor="bot-name" className="text-sm sm:text-base">
            Bot Name
          </label>
          <div className="relative">
            <Input
              {...register('name', {
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
                errors.name
                  ? 'border border-red-500 focus:border-red-500'
                  : 'border border-input'
              } `}
              id="bot-name"
            />
            {errors.name && (
              <div className="absolute h-0 w-full">
                <p className="absolute mt-1 text-xs text-red-500">
                  {errors.name.message}
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
              {...register('description', {
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
                errors.description
                  ? 'border border-red-500 focus:border-red-500'
                  : 'border border-input'
              } `}
              placeholder="e.g. A bot that helps users discover new things and get answers to their questions."
              id="bot-description"
            />
            {errors.description && (
              <div className="absolute h-0 w-full">
                <p className="absolute mt-1 text-xs text-red-500">
                  {errors.description.message}
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
              {...register('welcome_message', {
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
                errors.welcome_message
                  ? 'border border-red-500 focus:border-red-500'
                  : 'border border-input'
              } `}
              placeholder="e.g. Hey there! I'm Chatty Charlie. What can I help you discover today?"
              id="opening-message"
            />
            {errors.welcome_message && (
              <p className="mt-1 text-xs text-red-500">
                {errors.welcome_message.message}
              </p>
            )}
            {!errors.welcome_message && (
              <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                This is your bot's chance to make a stellar first impression.
                Make it count!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FirstImpressionSection;
