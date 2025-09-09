import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a price value to Brazilian Real (BRL) currency format
 * @param price - The price as a number or string
 * @returns Formatted price string in BRL format
 */
export function formatPriceBRL(price: number | string): string {
  const numericPrice = typeof price === 'string' 
    ? parseFloat(price.replace(/[^\d,]/g, '').replace(',', '.'))
    : price;
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numericPrice);
}
