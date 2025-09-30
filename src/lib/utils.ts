import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines class names using clsx and tailwind-merge for better CSS class management
 * @param inputs - Class names to combine
 * @returns Combined class string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const formatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
/**
 * Formats a price value to Brazilian Real (BRL) currency format
 * @param price - The price as a number or string
 * @returns Formatted price string in BRL format
 */
export function formatPriceBRL(price: number | string): string {
  if (typeof price === "number" && Number.isFinite(price)) {
    return formatter.format(price);
  }
  const raw = String(price || "").trim();
  if (!raw) return formatter.format(0);

  // Try to parse strings like "R$ 2.999,00" or "2999.00"
  const normalized = raw.replace(/\s/g, "").replace(/^R\$?/i, "");

  const numeric = Number(normalized);
  if (!Number.isNaN(numeric) && Number.isFinite(numeric)) {
    return formatter.format(numeric);
  }

  // Fallback: if already resembles BRL, keep as is; otherwise return with R$
  if (/^R\$/.test(raw)) return raw;
  return `R$ ${raw}`;
}
