'use client';

import { useSession } from '@clerk/clerk-react';

export default function Page() {
  const { session } = useSession();

  console.log('Session', session?.id);

  return <div>Hi, Welcome to the Dashboard Page!</div>;
}
