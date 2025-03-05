'use client';
import { useClerk, UserButton, useUser } from '@clerk/nextjs';
import {
  Bot,
  Folder,
  Home,
  LogOut,
  Menu,
  Plus,
  Settings,
  Upload,
  X,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { ThemeToggle } from './ThemeToggle';

export function Sidebar() {
  const { signOut } = useClerk();
  const { user } = useUser();
  const [expanded, setExpanded] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Handle expand/collapse based on mouse position
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (sidebarRef.current && window.innerWidth >= 768) {
        // Only on md and up screens
        const { left } = sidebarRef.current.getBoundingClientRect();
        // Expand when mouse is within 60px of the sidebar
        if (e.clientX <= left + 60) {
          setExpanded(true);
        } else if (e.clientX > left + 200) {
          // Collapse when mouse is far from the sidebar
          setExpanded(false);
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Close mobile sidebar when resizing to larger screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  useEffect(() => console.log(user), [user]);
  return (
    <>
      {/* Mobile menu button - only visible on small screens */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed right-4 top-4 z-50 rounded-md bg-muted p-2 shadow md:hidden"
        aria-label="Toggle menu"
      >
        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <div
        ref={sidebarRef}
        className={`fixed inset-y-0 left-0 z-40 flex h-[100dvh] flex-col border-r bg-muted shadow-xl transition-all duration-300 ease-in-out dark:bg-custom-darkblue md:relative ${expanded ? 'md:w-56' : 'md:w-16'} ${mobileOpen ? 'w-56' : 'w-0 md:w-16'}`}
      >
        <div
          className={`flex h-full flex-col overflow-y-auto ${mobileOpen || window.innerWidth >= 768 ? 'visible' : 'invisible'}`}
        >
          {/* Logo */}
          <div className="flex items-center justify-center border-b p-4 dark:border-gray-700">
            <Image src="/logo.svg" alt="Pragyai" width={30} height={30} />
            <span
              className={`ml-2 whitespace-nowrap bg-gradient-to-r from-custom-darkblue to-custom-teal bg-clip-text font-display text-lg font-bold text-transparent transition-opacity duration-300 dark:from-white dark:to-white sm:text-xl ${
                expanded || mobileOpen ? 'opacity-100' : 'opacity-0 md:hidden'
              }`}
            >
              PragyAI
            </span>
          </div>

          {/* Main navigation */}
          <div className="flex flex-1 flex-col overflow-hidden">
            <div className="px-3 py-4">
              <h2
                className={`mb-3 text-xs font-semibold text-custom-darkblue transition-opacity duration-300 dark:text-white ${
                  expanded || mobileOpen
                    ? 'opacity-100'
                    : 'h-0 opacity-0 md:mb-0 md:mt-0 md:h-auto'
                }`}
              >
                Dashboard
              </h2>

              <nav className="space-y-1">
                <NavItem
                  icon={<Home size={20} />}
                  label="Overview"
                  expanded={expanded || mobileOpen}
                />
                <NavItem
                  icon={<Plus size={20} />}
                  label="New Projects"
                  expanded={expanded || mobileOpen}
                />
              </nav>

              <h2
                className={`mb-3 mt-6 text-xs font-semibold text-custom-darkblue transition-opacity duration-300 dark:text-white ${
                  expanded || mobileOpen
                    ? 'opacity-100'
                    : 'h-0 opacity-0 md:mb-0 md:mt-4 md:h-auto'
                }`}
              >
                Others
              </h2>

              <nav className="space-y-1">
                <NavItem
                  icon={<Bot size={20} />}
                  label="Magic build"
                  expanded={expanded || mobileOpen}
                />
                <NavItem
                  icon={<Folder size={20} />}
                  label="All Projects"
                  expanded={expanded || mobileOpen}
                />
                <NavItem
                  icon={<Upload size={20} />}
                  label="Upload new"
                  expanded={expanded || mobileOpen}
                />
                <NavItem
                  icon={<Settings size={20} />}
                  label="Setting"
                  expanded={expanded || mobileOpen}
                />
              </nav>
            </div>
          </div>

          {/* User and theme toggle */}
          <div className="mt-auto border-t p-3 dark:border-gray-700">
            {/* Theme toggle */}
            <div
              className={`flex ${expanded || mobileOpen ? 'justify-start' : 'justify-center'}`}
            >
              <ThemeToggle />
            </div>

            <div
              className={`flex items-center py-2 ${expanded || mobileOpen ? 'gap-2' : 'justify-center'}`}
            >
              <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full text-black">
                <UserButton />
              </div>
              <div
                className={`transition-opacity duration-300 ${
                  expanded || mobileOpen ? 'opacity-100' : 'hidden opacity-0'
                }`}
              >
                {user?.fullName && (
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    {user.fullName.length < 18 ? user.fullName : user.firstName}
                  </p>
                )}
                {user?.primaryEmailAddress?.emailAddress && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {user.primaryEmailAddress.emailAddress.length < 24
                      ? user.primaryEmailAddress.emailAddress
                      : user.primaryEmailAddress.emailAddress.slice(0, 24) +
                        '...'}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-2 space-y-2">
              {/* Logout button */}
              <button
                className={`btn-secondary flex w-full items-center justify-center rounded-md px-2 py-2 text-custom-sage transition-colors dark:text-teal-400`}
                onClick={() => signOut({ redirectUrl: '/' })}
              >
                <LogOut className="flex-shrink-0" width={20} height={20} />
                <span
                  className={`ml-2 transition-opacity duration-300 ${
                    expanded || mobileOpen ? 'opacity-100' : 'hidden opacity-0'
                  }`}
                >
                  Log Out
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Navigation item component
function NavItem({
  icon,
  label,
  expanded,
  active = false,
}: {
  icon: React.ReactNode;
  label: string;
  expanded: boolean;
  active?: boolean;
}) {
  return (
    <Link
      href="#"
      className={`flex items-center rounded-md px-2 py-2 font-medium transition-colors ${
        active
          ? 'bg-custom-navy text-gray-700 dark:text-gray-200'
          : 'text-gray-700 hover:bg-custom-teal hover:text-white dark:text-gray-200 dark:hover:bg-custom-hoverdark/80 dark:hover:text-black'
      } ${expanded ? 'justify-start' : 'justify-center'}`}
    >
      <div className="flex-shrink-0">{icon}</div>
      <span
        className={`ml-3 whitespace-nowrap text-sm transition-opacity duration-300 ${
          expanded ? 'opacity-100' : 'hidden opacity-0'
        }`}
      >
        {label}
      </span>
    </Link>
  );
}
