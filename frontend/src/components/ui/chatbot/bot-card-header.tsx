import { LucideIcon } from 'lucide-react';
import React from 'react';

const BotCardHeader = ({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description: string;
  icon: LucideIcon;
}) => {
  return (
    <div className="flex items-start gap-2">
      <div className="flex h-12 w-12 items-center justify-center rounded-md bg-teal-600/20 p-3">
        <Icon className="h-5 w-5 xl:h-6 xl:w-6" />
      </div>
      <div className="flex flex-col items-start">
        <h2 className="text-lg font-medium sm:text-xl">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
};

export default BotCardHeader;
