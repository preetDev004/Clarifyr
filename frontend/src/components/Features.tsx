'use client';
import {
  BrainCircuit,
  ChartAreaIcon,
  FileLock2,
  MessageSquareDot,
} from 'lucide-react';

import { BentoCard, BentoGrid } from '@/components/magicui/landing/bento-grid';
import { Marquee } from '@/components/magicui/landing/marquee';
import { cn } from '@/lib/utils';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import UsageFeature from './magicui/landing/usage-stats';
import { AnimatedBeamMultipleOutput } from './ui/landing/AnimatedBeamMultipleOutput';
import { AnimatedPop } from './ui/landing/AnimatedPop';
import Header from './ui/landing/header';

const files = [
  {
    name: 'FAQ.pdf',
    body: "This PDF contains our company's comprehensive profile including our mission statement, core values, organizational structure, and strategic objectives.",
  },
  {
    name: 'Finance.xlsx',
    body: 'This Excel workbook contains our five-year financial projections with multiple scenarios (conservative, expected, and optimistic). ',
  },
  {
    name: 'Feedback.txt',
    body: 'This text file compiles verbatim customer feedback collected from our support tickets, satisfaction surveys, and social media mentions. ',
  },
  {
    name: 'Contract.docx',
    body: 'This Word document contains our standard service agreement template used by the legal and sales teams. ',
  },
  {
    name: 'Onboarding.md',
    body: 'This Markdown file serves as our comprehensive employee onboarding guide. It walks new team members through their first 30 days.',
  },
];

const features = [
  {
    Icon: FileLock2,
    name: 'Multi-Format Support',
    description: 'Analyzes diverse business documents formats',
    href: '#',
    cta: 'Learn more',
    className: 'col-span-3 lg:col-span-1 dark:text-white',
    background: (
      <Marquee
        pauseOnHover
        className="absolute top-10 [--duration:20s] [mask-image:linear-gradient(to_top,transparent_40%,#000_100%)]"
      >
        {files.map((f, idx) => (
          <figure
            key={idx}
            className={cn(
              'relative w-32 cursor-pointer overflow-hidden rounded-xl border p-4',
              'border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]',
              'dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]',
              'transform-gpu blur-[1px] transition-all duration-300 ease-out hover:blur-none'
            )}
          >
            <div className="flex flex-row items-center gap-2">
              <div className="flex flex-col">
                <figcaption className="text-sm font-medium dark:text-white">
                  {f.name}
                </figcaption>
              </div>
            </div>
            <blockquote className="mt-2 text-xs">{f.body}</blockquote>
          </figure>
        ))}
      </Marquee>
    ),
  },
  {
    Icon: MessageSquareDot,
    name: 'Always-On Assistant',
    description: 'Provide instant answers and solutions, anytime',
    href: '#',
    cta: 'Learn more',
    className: 'col-span-3 lg:col-span-2',
    background: (
      <AnimatedPop className="absolute right-2 top-4 h-[300px] w-full scale-75 border-none transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)] group-hover:scale-90" />
    ),
  },
  {
    Icon: BrainCircuit,
    name: 'Supercharged AI',
    description: 'Feed your knowledge base directly into the AI',
    href: '#',
    cta: 'Learn more',
    className: 'col-span-3 lg:col-span-2',
    background: (
      <AnimatedBeamMultipleOutput className="absolute right-2 top-4 h-[300px] border-none transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)] group-hover:scale-105" />
    ),
  },
  {
    Icon: ChartAreaIcon,
    name: 'Analytics',
    description: 'See How Your Assistant is Performing',
    className: 'col-span-3 lg:col-span-1',
    href: '#',
    cta: 'Learn more',
    background: (
      <UsageFeature className="absolute right-2 top-4 h-[300px] border-none transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)] group-hover:scale-105" />
    ),
  },
];

export function Features() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-5% 0px' });
  return (
    <section className="container relative mb-4 mt-4 lg:mt-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.8, ease: 'easeOut' }}
        className="absolute -left-6 top-44 hidden h-72 w-72 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-primary/20 blur-3xl filter sm:block"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="absolute -right-6 bottom-4 hidden h-72 w-72 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-primary/20 blur-3xl filter sm:block"
      />
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, type: 'spring' }}
        className="flex flex-col items-center"
      >
        <Header
          badgeContent="🌟 Features"
          title="Your Productivity Boosters"
          description="Unlock a World of Possibilities for Your Business & Revolutionize
            Customer Experience With Us."
        />
        <BentoGrid>
          {features.map((feature, idx) => (
            <BentoCard
              key={idx}
              {...feature}
              Icon={() => (
                <feature.Icon className="h-8 w-8 text-black transition-all duration-300 group-hover:h-7 group-hover:w-7 dark:text-white sm:h-10 sm:w-10" />
              )}
            />
          ))}
        </BentoGrid>
      </motion.div>
    </section>
  );
}
