/**
 * Application-wide constants for better maintainability and consistency
 */

/** Number of days to consider a product as "new" */
export const NEW_PRODUCT_DAYS_THRESHOLD = 7;

/** Search debounce delay in milliseconds */
export const SEARCH_DEBOUNCE_DELAY = 300;

/** Default image placeholder path */
export const DEFAULT_PLACEHOLDER_IMAGE = "/placeholder.svg";

/** Animation durations in milliseconds */
export const ANIMATION_DURATIONS = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
} as const;

/** Component display names for better debugging */
export const COMPONENT_DISPLAY_NAMES = {
  PRODUCT_CARD: "ProductCard",
  HEADER: "Header",
  ABOUT: "About",
} as const;