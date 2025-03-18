import { cn } from '@/lib/utils';
import { Upload, Zap, Star } from 'lucide-react';

export interface Step {
  title: string;
  description: string;
  icon: 'upload' | 'zap' | 'star';
}

const iconMap = {
  upload: Upload,
  zap: Zap,
  star: Star,
};

interface TimelineStepProps extends Step {
  isActive: boolean;
  isFuture: boolean;
  onClick: () => void;
  className?: string;
  number: number;
}

const TimelineStep: React.FC<TimelineStepProps> = ({
  number,
  title,
  description,
  icon,
  isActive,
  onClick,
  className,
}) => {
  const Icon = iconMap[icon];

  return (
    <div
      className={cn(
        'group flex cursor-pointer flex-col items-center gap-4 transition-all sm:flex-row sm:items-start sm:py-8',
        isActive ? 'opacity-100' : 'opacity-65 hover:opacity-85',
        className
      )}
      onClick={onClick}
    >
      <div className="flex-shrink-0">
        <div
          className={cn(
            'relative z-10 flex h-12 w-12 items-center justify-center rounded-full transition-all duration-300',
            isActive
              ? 'bg-primary shadow-[0_0_25px_rgba(45,212,191,0.30)]'
              : 'bg-primary/40 shadow-[0_0_15px_rgba(45,212,191,0.15)]'
          )}
        >
          <Icon
            strokeWidth={1.5}
            className={cn(
              'h-5 w-5 transition-all duration-500 md:h-6 md:w-6',
              isActive
                ? 'scale-110 text-primary-foreground'
                : 'scale-100 text-primary-foreground/80'
            )}
          />
        </div>
      </div>

      <div
        className={cn(
          'flex flex-col transition-all duration-300',
          isActive ? 'translate-x-2' : ''
        )}
      >
        <h3
          className={cn(
            'text-lg font-semibold transition-colors duration-300 sm:text-xl',
            isActive ? 'text-foreground' : 'text-foreground/80'
          )}
        >
          {number}. {title}
        </h3>
        <p
          className={cn(
            'mt-2 max-w-md text-sm transition-colors duration-300 sm:text-base',
            isActive ? 'text-foreground/90' : 'text-foreground/70'
          )}
        >
          {description}
        </p>
      </div>
    </div>
  );
};

export default TimelineStep;
