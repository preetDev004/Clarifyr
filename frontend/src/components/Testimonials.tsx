'use client';
import React, { useRef } from 'react';
import Header from './ui/landing/header';

import { cn } from '@/lib/utils';
import { Marquee } from './magicui/landing/marquee';
import { TESTIMONIALS } from '../../constants';
import Image from 'next/image';
import { StarFilledIcon } from '@radix-ui/react-icons';
import { motion, useInView } from 'framer-motion';

// const firstRow = reviews.slice(0, reviews.length / 2);
// const secondRow = reviews.slice(reviews.length / 2);

const ReviewCard = ({
  img,
  name,
  designation,
  body,
  rating,
}: {
  img: string;
  name: string;
  designation: string;
  body: string;
  rating: number;
}) => {
  return (
    <figure
      className={cn(
        'relative h-full w-full cursor-pointer overflow-hidden rounded-xl border p-4',
        // light styles
        'border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]',
        // dark styles
        'dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]'
      )}
    >
      <blockquote className="mb-1 text-sm">{body}</blockquote>
      {/* Star Rating Display */}
      <div className="mb-4 flex items-center gap-1 text-yellow-500">
        {Array.from({ length: rating }, (_, i) => (
          <StarFilledIcon key={i} />
        ))}
      </div>

      <div className="flex flex-row items-center gap-2">
        <Image
          className="aspect-square rounded-full object-cover"
          width="32"
          height="32"
          alt=""
          src={img}
        />
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium dark:text-white">
            {name}
          </figcaption>
          <p className="text-xs font-medium text-black/50 dark:text-white/50">
            {designation}
          </p>
        </div>
      </div>
    </figure>
  );
};

// Duplicate testimonials for smooth looping
const firstColumn = [...TESTIMONIALS.slice(0, 4)];
const secondColumn = [...TESTIMONIALS.slice(9, 12)];
const thirdColumn = [...TESTIMONIALS.slice(5, 8)];

export default function Testimonials() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '25% 0px' });
  return (
    <div className="container relative mb-4 mt-8 lg:mt-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <Header
          badgeContent="📣 Testimonials"
          title="Stories from Our Clients"
          description="Discover how our solution has helped businesses achieve remarkable transformation."
        />

        <div
          className="relative flex h-[400px] w-full flex-row items-center justify-center overflow-hidden md:h-[600px]"
          ref={ref}
        >
          <Marquee
            reverse
            pauseOnHover
            vertical
            className="hidden [--duration:32s] md:flex"
          >
            {secondColumn.map((review, index) => (
              <ReviewCard
                key={index}
                name={review.name}
                body={review.quote}
                img={review.src}
                designation={review.designation}
                rating={review.rating}
              />
            ))}
          </Marquee>
          <Marquee pauseOnHover vertical className="[--duration:20s]">
            {firstColumn.map((review, index) => (
              <ReviewCard
                key={index}
                name={review.name}
                body={review.quote}
                img={review.src}
                designation={review.designation}
                rating={review.rating}
              />
            ))}
          </Marquee>
          <Marquee
            pauseOnHover
            vertical
            reverse
            className="hidden [--duration:26s] lg:flex"
          >
            {thirdColumn.map((review, index) => (
              <ReviewCard
                key={index}
                name={review.name}
                body={review.quote}
                img={review.src}
                designation={review.designation}
                rating={review.rating}
              />
            ))}
          </Marquee>

          <div className="pointer-events-none absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-background"></div>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-background"></div>
          <div className="pointer-events-none absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-background"></div>
        </div>
      </motion.div>
    </div>
  );
}
