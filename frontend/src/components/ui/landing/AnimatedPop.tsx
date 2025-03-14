'use client';

import { cn } from '@/lib/utils';
import { AnimatedList } from '@/components/magicui/landing/animated-list';

interface Item {
  sender: string;
  message: string;
  icon: string;
  color: string;
  time: string;
}

const chatConversation = [
  {
    // AI Initial Message
    sender: 'AI',
    message: 'Hi! How can I help?',
    time: '5m ago',
    icon: '🤖',
    color: '#1E86FF',
  },
  {
    // User First Query
    sender: 'User',
    message: 'How to add chat to my site?',
    time: '4m ago',
    icon: '💬',
    color: '#FF3D71',
  },
  {
    // AI Response
    sender: 'AI',
    message: "Here's the code snippet..",
    time: '3m ago',
    icon: '📋',
    color: '#00C9A7',
  },
  {
    // User New Question
    sender: 'User',
    message: 'Can I change colors?',
    time: '50s ago',
    icon: '🎨',
    color: '#FFB800',
  },
  {
    // AI Response
    sender: 'AI',
    message: 'Yes! Our PRO plan has...',
    time: '30s ago',
    icon: '🖌️',
    color: '#1E86FF',
  },
  {
    // User Positive Feedback
    sender: 'User',
    message: 'Perfect, thanks!',
    time: '15s ago',
    icon: '👍',
    color: '#00C9A7',
  },
  {
    // AI Closing
    sender: 'AI',
    message: 'Happy to help! 😊',
    time: 'Just now',
    icon: '✨',
    color: '#936DFF',
  },
];

const NotificationAI = ({ sender, message, icon, color, time }: Item) => {
  return (
    <figure
      className={cn(
        'relative mx-auto min-h-fit w-full max-w-[400px] cursor-pointer overflow-hidden rounded-2xl p-4',
        // animation styles
        'transition-all duration-200 ease-in-out hover:scale-[103%]',
        // light styles
        'bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]',
        // dark styles
        'transform-gpu dark:bg-transparent dark:backdrop-blur-md dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]'
      )}
    >
      <div className="flex flex-row items-center gap-3">
        <div
          className="flex size-10 items-center justify-center rounded-2xl"
          style={{
            backgroundColor: color,
          }}
        >
          <span className="text-lg">{icon}</span>
        </div>
        <div className="flex flex-col overflow-hidden">
          <figcaption className="flex flex-row items-center whitespace-pre text-lg font-medium dark:text-white">
            <span className="text-sm sm:text-lg">{message}</span>
            <span className="mx-1">·</span>
            <span className="text-xs text-gray-500">{time}</span>
          </figcaption>
          <p className="text-sm font-normal dark:text-white/60">{sender}</p>
        </div>
      </div>
    </figure>
  );
};

export function AnimatedPop({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'scrollbar-hide relative flex h-[500px] w-full flex-col overflow-y-auto p-2',
        className
      )}
    >
      <AnimatedList>
        {chatConversation.map((item, idx) => (
          <NotificationAI {...item} key={idx} />
        ))}
      </AnimatedList>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-background"></div>
    </div>
  );
}
