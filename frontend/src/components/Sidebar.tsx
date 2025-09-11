'use client';

import { BookOpen, Bot, PieChart, Settings2 } from 'lucide-react';
import * as React from 'react';

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/Sidebar/app-sidebar';
import Image from 'next/image';

import { NavMain } from '@/components/ui/Sidebar/nav-main';
import { NavUser } from '@/components/ui/Sidebar/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from '@/components/ui/Sidebar/app-sidebar';

// This is sample data.
const data = {
  navMain: [
    {
      title: 'Chatbots',
      url: '/dashboard',
      icon: Bot,
    },
    {
      title: 'Documents',
      url: '/documents',
      icon: BookOpen,
    },
    {
      title: 'Analytics',
      url: '/analytics',
      icon: PieChart,
    },
    {
      title: 'Settings',
      url: '/settings',
      icon: Settings2,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="data-[state=open]:text-sidebar-accent-foreground">
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:text-sidebar-accent-foreground"
            >
              <Image src="/logo.svg" alt="Pragyai" width={40} height={40} />

              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="bg-gradient-to-r from-custom-darkblue to-custom-teal bg-clip-text font-display text-lg font-bold text-transparent transition-opacity duration-300 dark:from-white dark:to-white sm:text-xl">
                  Clarifyr
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
