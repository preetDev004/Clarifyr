'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { TESTIMONIALS } from '../../constants';
import Badge from './ui/landing/badge';
import { WordRotate } from './magicui/landing/word-rotate';
import { Button } from './ui/button';

export default function Hero() {
  const router = useRouter();
  return (
    <section className="container mx-auto mt-16 flex items-center justify-center px-4 py-12 sm:mt-28 sm:px-6 lg:px-8 lg:py-20">
      <div className="relative z-10 mb-10 flex w-full flex-col items-center justify-center lg:mb-0 lg:w-1/2">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <Badge border content={'🚀 Business Made Easy'} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5, ease: 'easeOut' }}
          className="mb-6 mt-8 flex flex-col items-center"
        >
          <h1 className="bg-gradient-to-b from-custom-sage via-custom-teal to-custom-darkblue bg-clip-text font-display text-4xl font-bold text-transparent dark:from-white dark:via-white dark:to-zinc-400 sm:text-5xl xl:text-6xl">
            AI-Powered
          </h1>
          <WordRotate
            className="bg-gradient-to-b from-custom-sage via-custom-teal to-custom-darkblue bg-clip-text font-display text-4xl font-bold text-transparent dark:from-white dark:via-white dark:to-zinc-400 sm:text-5xl xl:text-6xl"
            words={['Customer Support', 'Business Growth']}
          />
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5, ease: 'easeOut' }}
          className="mb-8 text-center text-sm text-muted-foreground sm:text-lg"
        >
          Create intelligent chatbots that seamlessly understand your business
          and delight your customers.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5, ease: 'easeOut' }}
          className="flex w-full flex-col justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0"
        >
          <Button
            onClick={() => router.push('/sign-up')}
            size="lg"
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 sm:w-auto"
          >
            Get Started
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="btn-secondary w-full sm:w-auto"
          >
            Watch Demo
          </Button>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5, ease: 'easeOut' }}
          className="mt-12 flex flex-col items-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0"
        >
          <div className="flex -space-x-5">
            {TESTIMONIALS.slice(0, 5).map((item, index) => (
              <Image
                key={index}
                src={item.src}
                alt={`User ${index + 1}`}
                width={50}
                height={50}
                className="aspect-square rounded-full border-2 border-background object-cover"
              />
            ))}
          </div>
          <p className="text-sm text-muted-foreground">
            <span className="font-bold text-custom-teal dark:text-white">
              1,000+
            </span>{' '}
            businesses trust Pragyai
          </p>
        </motion.div>
      </div>
    </section>
  );
}
