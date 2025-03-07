import { cn } from '@/lib/utils';
import React from 'react';
import { NumberTicker } from './number-ticker';
import { UsageLineChart } from './usage-line-chart';

const UsageFeature = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        'relative mx-auto h-full w-full max-w-[400px] cursor-pointer overflow-hidden rounded-2xl p-4',
        // animation styles
        'transition-all duration-200 ease-in-out hover:scale-[103%]',
        className
      )}
    >
      <div className="flex flex-row items-center justify-between space-y-0 p-2 pb-2"></div>
      <div className="p-6 pt-0 md:p-2">
        <div className="flex items-end gap-2">
          <div className="w-[95px] text-2xl font-bold">
            <NumberTicker value={2350} />+
          </div>
          <div className="text-sm font-medium tracking-tight">
            Conversations
          </div>
        </div>
        <p className="text-xs text-zinc-800 dark:text-muted-foreground">
          +20.1% from last month
        </p>
        <UsageLineChart />
      </div>
    </div>
  );
};

export default UsageFeature;
