'use client';
import { motion, useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import Header from './ui/landing/header';
import TimelineStep, { Step } from './ui/landing/timeline-step';

const steps: Step[] = [
  {
    title: 'Train Your Assistant',
    description:
      'Upload your knowledge base documents and train your AI assistant on your specific domain. The assistant learns from your data to provide accurate responses.',
    icon: 'upload',
  },
  {
    title: 'Customize & Configure',
    description:
      "Customize the assistant's behavior, appearance and conversation flow. Set up rules, fallbacks and configure how it handles different types of queries.",
    icon: 'zap',
  },
  {
    title: 'Deploy & Monitor',
    description:
      'Deploy your assistant to production and monitor its performance. Track usage metrics, review conversations and continuously improve its capabilities.',
    icon: 'star',
  },
];

const HowItWorks = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-5% 0px' });
  const [activeStep, setActiveStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPaused) {
        setActiveStep((prev) => (prev + 1) % steps.length);
      }
    }, 4000); // Change step every 4 seconds

    return () => clearInterval(interval);
  }, [isPaused]);

  const handleStepClick = (index: number) => {
    setActiveStep(index);
    setIsPaused(true);
    // Resume auto-advance after 8 seconds of user interaction
    setTimeout(() => setIsPaused(false), 5000);
  };

  return (
    <div className="container relative mb-4 mt-8 w-full overflow-hidden p-4 lg:mt-12">
      <div className="relative z-10 mx-auto max-w-7xl" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, type: 'spring' }}
          className="mb-2 flex flex-col items-center sm:mb-4"
        >
          <Header
            badgeContent="🔍 How It Works"
            title="Wanna Try?"
            description="Follow Just 3 Easy Steps to Get Started & Serve Your Customers
              Better 24/7."
          />
        </motion.div>

        <div className="flex w-full flex-col items-center justify-center gap-2 lg:flex-row lg:justify-between">
          {/* Steps Section */}
          <motion.div className="relative w-full max-w-xl">
            {/* Mobile Layout (< 640px) */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="relative h-[200px] lg:hidden"
            >
              {steps.map((step, index) => (
                <motion.div
                  key={`mobile-${index}`}
                  className="absolute inset-0 px-4"
                  initial={{
                    x: index === 0 ? 0 : '100%',
                    opacity: index === 0 ? 1 : 0,
                  }}
                  animate={{
                    x:
                      index === activeStep
                        ? 0
                        : index < activeStep
                          ? '-100%'
                          : '100%',
                    opacity: index === activeStep ? 1 : 0,
                  }}
                  transition={{
                    duration: 0.6,
                    ease: [0.32, 0.72, 0, 1],
                  }}
                >
                  <TimelineStep
                    {...step}
                    number={index + 1}
                    isActive={index === activeStep}
                    isFuture={index > activeStep}
                    onClick={() => handleStepClick(index)}
                    className="h-full"
                  />
                </motion.div>
              ))}
            </motion.div>

            {/* Desktop Layout (≥ 640px) */}
            <div className="hidden lg:block">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5 }}
                className="flex flex-col space-y-4"
              >
                {steps.map((step, index) => (
                  <TimelineStep
                    key={`desktop-${index}`}
                    {...step}
                    number={index + 1}
                    isActive={index === activeStep}
                    isFuture={index > activeStep}
                    onClick={() => handleStepClick(index)}
                    className="relative"
                  />
                ))}
              </motion.div>
            </div>
          </motion.div>

          {/* Content Section */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            key={activeStep}
            transition={{ duration: 0.5 }}
            className="w-full md:max-w-xl lg:max-w-lg"
          >
            <div className="relative overflow-hidden rounded-2xl bg-card p-6 shadow-lg sm:p-8">
              <div key={activeStep}>
                <span className="mb-3 inline-block rounded-full bg-primary/20 px-3 py-1 text-sm text-primary dark:text-custom-hoverdark">
                  Step {activeStep + 1}
                </span>
                <h3 className="mt-2 text-2xl font-bold text-foreground sm:text-3xl">
                  {steps[activeStep].title}
                </h3>
                <p className="mt-3 text-base text-muted-foreground sm:text-lg">
                  {steps[activeStep].description}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
