'use client';

import dynamic from 'next/dynamic';
import React, { Suspense } from 'react';

const DynamicSidebar = dynamic(
  () => import('@/components/Sidebar').then((mod) => mod.Sidebar),
  {
    ssr: false,
    loading: () => <div>Loading Sidebar...</div>, // Or a more elaborate skeleton
  }
);

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen flex-row">
      <Suspense fallback={<div>Loading...</div>}>
        <DynamicSidebar />
      </Suspense>
      {children}
    </div>
  );
};

export default DashboardLayout;
