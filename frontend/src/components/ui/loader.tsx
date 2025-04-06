import { Loader2 } from 'lucide-react';
import React from 'react';

interface LoaderProps {
  title: string;
  description?: string;
}

const Loader = ({ title, description }: LoaderProps) => {
  return (
    <div className="mt-24 w-full">
      <div className="flex flex-col items-center justify-center gap-3">
        <Loader2
          className={`h-8 w-8 animate-spin-fast text-custom-teal dark:text-custom-hoverdark lg:h-12 lg:w-12`}
        />
        <div>
          <h3 className="text-center text-base font-semibold sm:text-lg">
            {title}
          </h3>
          <p className="text-center text-sm text-muted-foreground">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Loader;
