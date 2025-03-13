'use client';

import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <button
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      className="rounded-full bg-secondary/10 p-2 text-secondary transition-colors hover:bg-secondary/20 dark:text-secondary-foreground"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <Moon className="text-black" size={20} />
      ) : (
        <Sun className="text-white" size={20} />
      )}
    </button>
  );
}
