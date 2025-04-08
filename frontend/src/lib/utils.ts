import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { formatDistanceToNow, parseISO, isAfter } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getMostRecentDateString(createdAt: string, updatedAt: string) {
  const createdDate = parseISO(createdAt);
  const updatedDate = parseISO(updatedAt);

  if (isAfter(updatedDate, createdDate)) {
    return `updated ${formatDistanceToNow(updatedDate, { addSuffix: true })}`;
  } else {
    return `created ${formatDistanceToNow(createdDate, { addSuffix: true })}`;
  }
}
