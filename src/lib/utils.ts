import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a number or numeric string to Brazilian Real currency.
 * Accepts inputs like 100, "100", "100.5", "100,50" or "1.234,56".
 */
export function formatCurrencyBRL(amount: number | string): string {
  const formatter = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  let numericValue: number

  if (typeof amount === "number") {
    numericValue = amount
  } else {
    const raw = amount
      .toString()
      .trim()
      // keep digits, dot, comma and minus (strip currency symbols/spaces)
      .replace(/[^0-9,.-]/g, "")

    if (raw.includes(",") && raw.includes(".")) {
      // Typical BR format: 1.234,56 -> remove thousands and convert comma to dot
      numericValue = parseFloat(raw.replace(/\./g, "").replace(",", "."))
    } else if (raw.includes(",")) {
      // Only comma present: treat as decimal separator
      numericValue = parseFloat(raw.replace(",", "."))
    } else {
      numericValue = parseFloat(raw)
    }

    if (Number.isNaN(numericValue)) {
      numericValue = 0
    }
  }

  return formatter.format(numericValue)
}
