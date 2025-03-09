'use client';
import Image from 'next/image';
import { TESTIMONIALS } from '../../constants';
import Badge from './Badge';
import { WordRotate } from './magicui/landing/word-rotate';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Button } from './ui/Button';

export default function Hero() {
  const router = useRouter();
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }} // Start slightly lower and hidden
      animate={{ opacity: 1, y: 0 }} // Animate to full opacity at original position
      transition={{ duration: 0.5, ease: 'easeOut' }} // Smooth, quick transition
      className="container mx-auto mt-16 px-4 py-12 sm:mt-28 sm:px-6 lg:px-8 lg:py-20"
    >
      <div className="flex flex-col items-center justify-between lg:flex-row">
        <div className="relative z-10 mb-10 flex flex-col lg:mb-0 lg:w-1/2">
          <Badge border content={'🚀 Business Made Easy'} />
          <div className="mb-6 mt-8">
            <h1 className="bg-gradient-to-r from-custom-teal via-custom-darkblue to-custom-sage bg-clip-text font-display text-4xl font-bold text-transparent dark:from-white dark:to-white sm:text-5xl">
              AI-Powered
            </h1>
            <WordRotate
              className="bg-gradient-to-r from-custom-darkblue via-custom-teal to-custom-sage bg-clip-text font-display text-4xl font-bold text-transparent dark:from-white dark:to-white sm:text-5xl"
              words={['Customer Support', 'Business Growth']}
            />
          </div>
          <p className="text-md mb-8 text-muted-foreground sm:text-xl">
            Create intelligent chatbots that understand your business and
            delight your customers.
          </p>
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
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
          </div>
          <div className="mt-12 flex flex-col items-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
            <div className="flex -space-x-5">
              {TESTIMONIALS.map((item, index) => (
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
          </div>
        </div>
        <div className="relative mt-10 hidden lg:mt-0 lg:block lg:w-1/2">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-primary/20 blur-3xl filter"
          />

          {/* AI Chatbot Image with Floating Effect */}
          <motion.div
            initial={{ y: 0 }}
            animate={{ y: [0, -10, 0] }} // Floating animation
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Image
              src="/landing.png"
              alt="AI Chatbot Illustration"
              width={500}
              height={500}
              className="relative z-10 mx-auto rounded-lg shadow-lg"
            />
          </motion.div>

          {/* Average Response Time Box */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="absolute -bottom-5 -left-5 z-20 rounded-lg bg-muted p-4 shadow-lg dark:bg-custom-teal/50 sm:-bottom-10 sm:-left-10"
          >
            <p className="text-sm font-semibold">Average Response Time</p>
            <p className="text-2xl font-bold text-custom-teal dark:text-gray-100 sm:text-3xl">
              2.5s
            </p>
          </motion.div>

          {/* Customer Satisfaction Box */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.7 }}
            className="absolute -right-5 -top-5 z-20 rounded-lg bg-muted p-4 shadow-lg dark:bg-custom-teal/50 sm:-right-10 sm:-top-10"
          >
            <p className="text-sm font-semibold">Customer Satisfaction</p>
            <p className="text-2xl font-bold text-custom-teal dark:text-gray-100 sm:text-3xl">
              98%
            </p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
