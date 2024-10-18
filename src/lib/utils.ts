import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const convertElapsedTime = (seconds: number) => {
  seconds = Math.trunc(seconds);
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(secs).padStart(2, '0');
  return `${formattedMinutes}:${formattedSeconds}`;
};
