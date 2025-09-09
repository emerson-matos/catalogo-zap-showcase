import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPriceBRL(price: string | number): string {
  const formatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  if (typeof price === 'number' && Number.isFinite(price)) {
    return formatter.format(price);
  }

  const raw = String(price || '').trim();
  if (!raw) return formatter.format(0);

  // Try to parse strings like "R$ 2.999,00" or "2999.00"
  const normalized = raw
    .replace(/\s/g, '')
    .replace(/^R\$?/i, '')
    .replace(/\./g, '')
    .replace(/,/g, '.');

  const numeric = Number(normalized);
  if (!Number.isNaN(numeric) && Number.isFinite(numeric)) {
    return formatter.format(numeric);
  }

  // Fallback: if already resembles BRL, keep as is; otherwise return with R$
  if (/^R\$/.test(raw)) return raw;
  return `R$ ${raw}`;
}
