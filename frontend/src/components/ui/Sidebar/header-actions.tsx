'use client';

import { ThemeToggle } from '../../ThemeToggle';

export function HeaderActions() {
  return (
    <div className="fixed right-4 top-4 z-50">
      <ThemeToggle />
    </div>
  );
}
