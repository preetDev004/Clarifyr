'use client';
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
import { useRouter } from 'next/navigation';
import { Chatbot } from '@/lib/types';

const ChatbotCard = ({ bot }: { bot: Chatbot }) => {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();

  return (
    <div
      className="min-h-[280px] max-w-[400px] cursor-pointer rounded-lg border bg-teal-400/10 p-1 shadow-md transition-all duration-150 ease-in-out hover:shadow-lg dark:bg-teal-950/70"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => router.push(`/dashboard/${bot.id}/edit`)}
    >
      {/* inner */}
      <div className="relative flex h-[90%] w-full flex-col justify-between gap-2 rounded-lg bg-white/60 p-3 dark:bg-custom-darkblue/70">
        <div className="h-xs absolute inset-x-14 top-0 z-30 rounded-b-full bg-custom-teal p-0.5 shadow-md dark:bg-custom-hoverdark" />
        {/* top */}

        <div className="flex items-center justify-start gap-2">
          <MonitorCog className="h-9 w-9 flex-shrink-0 rounded-full bg-teal-600/20 p-2 lg:h-10 lg:w-10" />
          <p className="font-semibold">
            {bot.name.length > 20 ? bot.name.slice(0, 20) + '...' : bot.name}
          </p>
        </div>

        {/* bottom */}
        <div className="flex flex-col items-start justify-center gap-1">
          <p className="flex items-center gap-3 text-sm text-muted-foreground">
            <GlobeLock size={18} className="flex-shrink-0" />
            <span>
              {bot.whitelist_domains[0]}{' '}
              {bot.whitelist_domains.length > 1 && (
                <span className="text-xs font-medium text-custom-teal dark:text-custom-hoverdark">
                  +{bot.whitelist_domains.length - 1} more
                </span>
              )}
            </span>
          </p>
          {bot.personality_traits && (
            <p className="flex items-center gap-3 text-sm text-muted-foreground">
              <UserRoundSearch size={18} className="flex-shrink-0" />
              <span>
                {bot.personality_traits[0]}{' '}
                {bot.personality_traits.length > 1 && (
                  <span className="text-xs font-medium text-custom-teal dark:text-custom-hoverdark">
                    +{bot.personality_traits.length - 1} more
                  </span>
                )}
              </span>
            </p>
          )}
          <p className="flex items-center gap-3 text-sm text-muted-foreground">
            <BookText size={18} className="flex-shrink-0" />
            <span>
              {bot.expertise_docs.length}
              {' expertise docs'}
            </span>
          </p>
          {bot.description && (
            <p className="mt-4 flex items-center gap-3 text-sm text-muted-foreground">
              <BadgeInfo size={18} className="flex-shrink-0" />
              <span>
                {bot.description.length > 70
                  ? bot.description.slice(0, 70) + '...'
                  : bot.description}
              </span>
            </p>
          )}
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
            {getMostRecentDateString(bot.created_at, bot.updated_at)}
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
