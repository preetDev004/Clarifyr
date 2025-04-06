'use client';
import { chatBot } from '@/lib/types';
import { getMostRecentDateString } from '@/lib/utils';
import {
  BadgeInfo,
  BookText,
  GlobeLock,
  MonitorCog,
  UserRoundSearch,
  ArrowRight,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

const ChatbotCard = ({ bot }: { bot: chatBot }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="min-h-[280px] max-w-[400px] cursor-pointer rounded-lg border bg-teal-400/10 p-1 shadow-md transition-all duration-150 ease-in-out hover:shadow-lg dark:bg-teal-950/70"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* inner */}
      <div className="flex h-[90%] w-full flex-col justify-between gap-2 rounded-lg bg-white/60 p-3 dark:bg-custom-darkblue/70">
        {/* top */}

        <div className="flex items-center justify-start gap-2">
          <MonitorCog className="h-9 w-9 flex-shrink-0 rounded-full bg-teal-600/20 p-2 lg:h-10 lg:w-10" />
          <p className="font-semibold">
            {bot.botName.length > 20
              ? bot.botName.slice(0, 20) + '...'
              : bot.botName}
          </p>
        </div>

        {/* bottom */}
        <div className="flex flex-col items-start justify-center gap-1">
          <p className="flex items-center gap-3 text-sm text-muted-foreground">
            <GlobeLock size={18} className="flex-shrink-0" />
            <span>
              {bot.allowedDomains[0]}{' '}
              {bot.allowedDomains.length > 1 && (
                <span className="text-xs font-medium text-custom-teal dark:text-custom-hoverdark">
                  +{bot.allowedDomains.length - 1} more
                </span>
              )}
            </span>
          </p>
          <p className="flex items-center gap-3 text-sm text-muted-foreground">
            <UserRoundSearch size={18} className="flex-shrink-0" />
            <span>
              {bot.botPersona[0]}{' '}
              {bot.botPersona.length > 1 && (
                <span className="text-xs font-medium text-custom-teal dark:text-custom-hoverdark">
                  +{bot.botPersona.length - 1} more
                </span>
              )}
            </span>
          </p>
          <p className="flex items-center gap-3 text-sm text-muted-foreground">
            <BookText size={18} className="flex-shrink-0" />
            <span>
              {bot.selectedDocs.length}
              {' expertise docs'}
            </span>
          </p>
          <p className="mt-4 flex items-center gap-3 text-sm text-muted-foreground">
            <BadgeInfo size={18} className="flex-shrink-0" />
            <span>
              {bot.botDescription.length > 70
                ? bot.botDescription.slice(0, 70) + '...'
                : bot.botDescription}
            </span>
          </p>
        </div>
      </div>

      {/* outer */}
      <div className="relative h-8 overflow-hidden py-1">
        <motion.div
          className="absolute flex w-full items-center justify-between px-3"
          initial={{ x: 0 }}
          animate={{ x: isHovered ? -200 : 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          <span className="text-sm text-muted-foreground">
            {getMostRecentDateString(bot.createdAt, bot.updatedAt)}
          </span>
        </motion.div>

        <motion.div
          className="absolute flex w-full items-center justify-end px-3"
          initial={{ x: 100 }}
          animate={{ x: isHovered ? 0 : 200 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          <span className="flex items-center gap-1 text-sm text-custom-teal dark:text-custom-hoverdark">
            Go to Bot <ArrowRight size={16} />
          </span>
        </motion.div>
      </div>
    </div>
  );
};

export default ChatbotCard;
