'use client';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="relative flex h-[100dvh] w-full flex-col items-center justify-center gap-4 sm:gap-6">
      <Image
        src="/404.svg"
        alt="404 Illustration"
        width={400}
        height={400}
        className="h-64 w-64 md:h-80 md:w-80"
        priority
      />
      <div className="flex w-full flex-col items-center justify-center gap-4">
        <div className="flex flex-col items-center justify-center">
          <h1 className="bg-gradient-to-b from-custom-sage via-custom-teal to-custom-darkblue bg-clip-text text-center font-display text-3xl font-bold text-transparent dark:from-white dark:via-white dark:to-zinc-400 sm:text-5xl">
            Dead End!
          </h1>
          <p className="text-center text-sm text-muted-foreground sm:text-base">
            Oops! The page you're looking for seems to have wandered off. Let's
            get you back on track.
          </p>
        </div>

        <Button onClick={() => router.back()}>
          <ArrowLeft className="h-6 w-6" /> Go Back
        </Button>
      </div>
    </div>
  );
}
