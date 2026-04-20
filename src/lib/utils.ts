import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
/**
 * Merges Tailwind CSS classes intelligently, removing conflicts
 * Combines clsx for conditional classes with tailwind-merge for conflict resolution
 * @param inputs - Any combination of Tailwind classes or objects
 * @returns Merged and deduplicated class string
 * @example cn("px-4", { "bg-red-500": error }, "px-8") // Returns "px-8 bg-red-500"
 */

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
