import { Plus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const MainDashboardPage = () => {
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
    </div>
  );
};

export default MainDashboardPage;
