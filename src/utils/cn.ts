/**
 * Utility function to merge class names
 * A simple alternative to clsx/tailwind-merge for combining Tailwind classes
 */

type ClassValue = string | undefined | null | boolean | 0;

/**
 * Combines multiple class names into a single string
 * Filters out falsy values (undefined, null, false, 0, '')
 * 
 * @example
 * cn('base-class', isActive && 'active', className)
 * // Returns: 'base-class active custom-class'
 */
export function cn(...classes: ClassValue[]): string {
  return classes
    .filter((c): c is string => typeof c === "string" && c.length > 0)
    .join(" ");
}

export default cn;
