'use client';
import BotCardHeader from './bot-card-header';
import DomainSecurity from './domain-security';
import { ShieldCheck } from 'lucide-react';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import { CreateBotFormInputs } from '@/lib/types';

interface AccessControlSectionProps {
  control: Control<CreateBotFormInputs>;
  errors: FieldErrors<CreateBotFormInputs>;
}

const AccessControlSection = ({
  control,
  errors,
}: AccessControlSectionProps) => {
  return (
    <div className="border-1 flex flex-col gap-4 rounded-md border bg-white/20 bg-opacity-75 p-4 shadow-md dark:bg-teal-900/10 sm:p-6 md:flex-row md:items-start md:justify-between">
      <BotCardHeader
        icon={ShieldCheck}
        title={'Access Control'}
        description={
          'Manage who can interact with your AI Assistant. Define domains where it can be accessed.'
        }
      />
      <div className="flex w-full flex-col gap-4 md:max-w-md lg:max-w-lg xl:max-w-xl">
        <Controller
          name="allowedDomains"
          control={control}
          rules={{
            validate: {
              validDomains: (value) => {
                if (!value || !Array.isArray(value))
                  return 'Domain list is required';

                // Filter out empty domains first
                const nonEmptyDomains = value.filter(
                  (domain) => domain.trim() !== ''
                );

                if (nonEmptyDomains.length === 0)
                  return 'At least one valid domain is required';

                if (value.length > 5) return 'Maximum 5 domains allowed';

                // Domain validation regex pattern
                const domainPattern =
                  /^(?!-)[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*(\.[A-Za-z]{2,})$/;

                // Check each non-empty domain
                for (const domain of nonEmptyDomains) {
                  if (!domainPattern.test(domain)) {
                    return `"${domain}" is not a valid domain format`;
                  }
                }
                return true;
              },
            },
          }}
          render={({ field: { value, onChange } }) => (
            <>
              <DomainSecurity
                allowedDomains={value}
                setAllowedDomains={onChange}
              />
              {errors.allowedDomains && (
                <p className="text-xs text-red-500">
                  {errors.allowedDomains.message}
                </p>
              )}
            </>
          )}
        />
      </div>
    </div>
  );
};

export default AccessControlSection;
