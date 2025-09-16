'use client';

import { Plus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import ChatbotCard from '@/components/ui/chatbot/chatbot-card';
import { useChatbots } from '@/hooks/useChatbots';
import Loader from '@/components/ui/loader';
import { Chatbot } from '@/lib/types';

export default function ChatbotsClient() {
  const { chatbots, isLoading, error } = useChatbots();

  return (
    <div className="mt-6 flex flex-col justify-center gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Chat Bots</h1>
          <p className="text-xs sm:text-sm">
            Create & Mange your AI Bots for your business.
          </p>
        </div>
        <Link
          href={'/dashboard/create'}
          className="sm:text-md btn-primary flex items-center gap-1.5 text-sm"
        >
          <Plus strokeWidth={2} className="h-5 w-5" />
          New
        </Link>
      </div>

      {isLoading ? (
        <div className="flex h-[50vh] items-center justify-center">
          <Loader
            title="Loading Chatbots"
            description="Please wait... it may take a few seconds"
          />
        </div>
      ) : error ? (
        <div className="flex items-center justify-center py-10">
          <p className="text-red-500">{error.message}</p>
        </div>
      ) : chatbots.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {chatbots.map((bot: Chatbot) => (
            <ChatbotCard key={bot.id} bot={bot} />
          ))}
        </div>
      ) : (
        <div className="mt-12 flex w-full flex-col items-center justify-center sm:mt-24">
          <Image
            src={'/NoChatBot.svg'}
            width={300}
            height={300}
            alt={'No Chat Bots'}
            className="w-25 h-25 sm:w-50 sm:h-50"
          />
          <p className="text-center text-base text-muted-foreground">
            You don't have any chat bots yet, Create one now!
          </p>
        </div>
      )}
    </div>
  );
}
