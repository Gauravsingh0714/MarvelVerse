import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Global Tailwind Class Merging Utility
 * MarvelVerse Design System - Stage 1.3
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
