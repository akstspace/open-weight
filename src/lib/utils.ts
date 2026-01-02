import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Normalize class values into a single string and resolve Tailwind CSS class conflicts.
 *
 * @param inputs - One or more class values accepted by `clsx` (strings, arrays, objects, etc.)
 * @returns A single class string with Tailwind classes merged and conflicts resolved
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}