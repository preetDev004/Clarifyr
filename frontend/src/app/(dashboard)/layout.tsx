import { Sidebar } from '@/components/Sidebar';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: "PragyAI | Dashboard",
  description: "Take your Business to another level with PragyAI's AI powered customized Chat Bot!",
};

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen flex-row">
      <Sidebar />
      {children}
    </div>
  );
};

export default DashboardLayout;
