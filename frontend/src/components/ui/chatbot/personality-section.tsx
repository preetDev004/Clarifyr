'use client';
import BotCardHeader from './bot-card-header';
import CustomSwitch from './persona-trait';
import { UsersRound } from 'lucide-react';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import { CreateBotFormInputs } from '@/lib/types';
import { PERSONA_TRAITS } from '../../../../constants';

interface PersonalitySectionProps {
  control: Control<CreateBotFormInputs>;
  errors: FieldErrors<CreateBotFormInputs>;
}

const PersonalitySection = ({ control, errors }: PersonalitySectionProps) => {
  return (
    <div className="border-1 flex flex-col gap-4 rounded-md border bg-white/20 bg-opacity-75 p-4 shadow-md dark:bg-teal-900/10 sm:p-6 md:flex-row md:items-start md:justify-between">
      <BotCardHeader
        icon={UsersRound}
        title={'Personality Traits'}
        description={
          'Define the tone and style of your Bot that will shape its communication, making it unique & engaging.'
        }
      />
      <div className="flex w-full flex-col gap-4 md:max-w-md lg:max-w-lg xl:max-w-xl">
        <Controller
          name="botPersona"
          control={control}
          rules={{
            validate: {
              required: (value) =>
                value.length > 0 || 'Please select at least one persona',
            },
          }}
          render={({ field: { value, onChange } }) => (
            <>
              {PERSONA_TRAITS &&
                PERSONA_TRAITS.map((trait, index) => (
                  <CustomSwitch
                    key={index}
                    title={trait.title}
                    description={trait.description}
                    isSelected={value.includes(trait.title)}
                    onToggle={(isSelected) => {
                      const newValue = isSelected
                        ? [...value, trait.title]
                        : value.filter((t) => t !== trait.title);
                      onChange(newValue);
                    }}
                  />
                ))}
              {errors.botPersona && (
                <p className="bottom-0 text-xs text-red-500">
                  {errors.botPersona.message}
                </p>
              )}
            </>
          )}
        />
      </div>
    </div>
  );
};

export default PersonalitySection;
