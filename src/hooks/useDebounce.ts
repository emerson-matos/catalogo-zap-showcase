import { useState, useEffect } from 'react';
import { SEARCH_DEBOUNCE_DELAY } from '@/constants/app';

/**
 * Custom hook for debouncing values to improve performance
 * @param value - The value to debounce
 * @param delay - Delay in milliseconds (defaults to SEARCH_DEBOUNCE_DELAY)
 * @returns Debounced value
 */
export function useDebounce<T>(value: T, delay: number = SEARCH_DEBOUNCE_DELAY): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}