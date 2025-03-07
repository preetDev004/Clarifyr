import { motion, useInView, HTMLMotionProps } from 'framer-motion';
import { ArrowRightIcon } from '@radix-ui/react-icons';
import { ComponentPropsWithoutRef, ReactNode, useRef } from 'react';
import { Button } from '@/components/ui/magicButton';
import { cn } from '@/lib/utils';

// Define BentoGridProps without conflicting with Framer Motion
interface BentoGridProps extends ComponentPropsWithoutRef<'div'> {
  children: ReactNode;
  className?: string;
}

// Define BentoCardProps to extend Framer Motion's HTMLMotionProps
interface BentoCardProps extends HTMLMotionProps<'div'> {
  name: string;
  className: string;
  background: ReactNode;
  Icon: React.ElementType;
  description: string;
  href: string;
  cta: string;
}

const BentoGrid = ({ children, className, ...props }: BentoGridProps) => {
  return (
    <div
      className={cn(
        'grid w-full auto-rows-[22rem] grid-cols-3 gap-4',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

const BentoCard = ({
  name,
  className,
  background,
  Icon,
  description,
  href,
  cta,
  ...props
}: BentoCardProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-5% 0px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, type: 'tween' }}
      className={cn(
        'group relative col-span-3 flex flex-col justify-between overflow-hidden rounded-xl',
        'bg-background [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]',
        'transform-gpu border dark:border-custom-teal dark:bg-background dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]',
        className
      )}
      {...props} // Spread Framer Motion props here
    >
      <div>{background}</div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        className="pointer-events-none z-10 flex transform-gpu flex-col gap-1 p-6 transition-all duration-300 group-hover:-translate-y-10"
      >
        <Icon className="h-12 w-12 origin-left transform-gpu text-neutral-700 transition-all duration-300 ease-in-out group-hover:scale-75" />
        <motion.h3
          initial={{ x: -20 }}
          animate={isInView ? { x: 0 } : {}}
          className="text-xl font-semibold text-neutral-700 dark:text-neutral-300"
        >
          {name}
        </motion.h3>
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2 }}
          className="max-w-lg text-neutral-400"
        >
          {description}
        </motion.p>
      </motion.div>

      <div
        className={cn(
          'pointer-events-none absolute bottom-0 flex w-full translate-y-10 transform-gpu flex-row items-center justify-end p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 sm:justify-start'
        )}
      >
        <Button asChild size="sm" className="btn-secondary pointer-events-auto">
          <a href={href}>
            {cta}
            <ArrowRightIcon className="ms-2 h-4 w-4 rtl:rotate-180" />
          </a>
        </Button>
      </div>

      <div className="pointer-events-none absolute inset-0 transform-gpu transition-all duration-300 group-hover:bg-black/[.03] group-hover:dark:bg-neutral-800/10" />
    </motion.div>
  );
};

export { BentoCard, BentoGrid };
