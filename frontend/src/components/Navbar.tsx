'use client';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import Image from 'next/image';
import Link from 'next/link';
import { SignedIn, SignedOut } from '@clerk/nextjs';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed left-0 top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? 'bg-white py-3 shadow-sm backdrop-blur-lg dark:bg-custom-darkblue'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <a href="" className="flex items-center gap-2">
            <Image
              src="/logo.svg"
              alt="Pragyai"
              className="h-8 w-8 sm:h-[45px] sm:w-[45px]"
              width={45}
              height={45}
            />
            <span className="bg-gradient-to-r from-custom-darkblue to-custom-teal bg-clip-text font-display text-xl font-bold text-transparent dark:from-white dark:to-white sm:text-2xl">
              PragyAI
            </span>
          </a>

          {/* Desktop Menu */}
          <div className="hidden items-center gap-4 md:flex lg:gap-8">
            <a
              href="#features"
              className="font-semibold text-foreground transition-colors hover:text-custom-teal hover:underline hover:underline-offset-8 dark:hover:text-custom-hoverdark"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="font-semibold text-foreground transition-colors hover:text-custom-teal hover:underline hover:underline-offset-8 dark:hover:text-custom-hoverdark"
            >
              How It Works
            </a>
            <a
              href="#pricing"
              className="font-semibold text-foreground transition-colors hover:text-custom-teal hover:underline hover:underline-offset-8 dark:hover:text-custom-hoverdark"
            >
              Pricing
            </a>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <div className="hidden gap-4 md:flex">
              <NavLinks />
            </div>

            {/* Mobile menu button */}
            <div className="flex md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="rounded-lg p-2 text-foreground transition-colors hover:bg-muted"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`absolute left-0 top-full w-full bg-white/90 shadow-lg backdrop-blur-lg transition-all duration-300 ease-in-out dark:bg-custom-darkblue/90 md:hidden ${
          isOpen ? 'max-h-[400px] opacity-100' : 'invisible max-h-0 opacity-0'
        } overflow-hidden`}
      >
        <div className="container mx-auto flex flex-col gap-4 px-4 py-4">
          <a
            href="#features"
            className="rounded-lg px-4 py-3 transition-colors hover:bg-muted"
            onClick={() => setIsOpen(false)}
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="rounded-lg px-4 py-3 transition-colors hover:bg-muted"
            onClick={() => setIsOpen(false)}
          >
            How It Works
          </a>
          <a
            href="#pricing"
            className="rounded-lg px-4 py-3 transition-colors hover:bg-muted"
            onClick={() => setIsOpen(false)}
          >
            Pricing
          </a>
          <div className="flex flex-col gap-2 border-t border-border pt-2">
            <NavLinks />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

const NavLinks = () => {
  return (
    <>
      <SignedOut>
        <Link href="/sign-in" className="btn-secondary text-center">
          Login
        </Link>
        <Link href="/sign-up" className="btn-primary text-center">
          Get Started
        </Link>
      </SignedOut>
      <SignedIn>
        <Link href="/dashboard" className="btn-primary text-center">
          Dashboard
        </Link>
      </SignedIn>
    </>
  );
};
