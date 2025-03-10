'use client';
import { motion, useInView } from 'framer-motion';
import React, { useRef } from 'react';
import Badge from './Badge';

const HowTo = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-5% 0px' });
  return (
    <div className="container relative mb-12 mt-4 lg:mt-20">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, type: 'spring' }}
        className="flex flex-col items-center"
      >
        <div className="mb-4 flex flex-col items-center">
          <Badge content={'🔍 How it Works'} />
          <h1 className="mb-2 mt-4 bg-gradient-to-b from-custom-sage via-custom-teal to-custom-darkblue bg-clip-text text-center font-display text-3xl font-bold text-transparent dark:from-white dark:via-white dark:to-zinc-400 sm:text-5xl">
            Wanna Try?
          </h1>
          <p className="mb-4 text-center text-sm text-muted-foreground sm:text-lg">
            Follow Just 3 Easy Steps to Get Started & Serve Your Customers
            Better 24/7.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default HowTo;
