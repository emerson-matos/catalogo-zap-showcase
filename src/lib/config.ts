// Configuration constants for the application

export const APP_CONFIG = {
  // Supabase configuration
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL,
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
  },

  // Google Sheets configuration (for migration)
  googleSheets: {
    id: import.meta.env.VITE_GOOGLE_SHEETS_ID,
    gid: import.meta.env.VITE_GOOGLE_SHEETS_GID,
    sheet: import.meta.env.VITE_GOOGLE_SHEETS_SHEET,
    csvUrl: import.meta.env.VITE_GOOGLE_SHEETS_CSV_URL,
  },

  // App settings
  app: {
    name: "Serena Cosméticos",
    version: "2.0.0",
    adminPath: "/admin",
  },

  // Feature flags
  features: {
    enableMigration: !!import.meta.env.VITE_GOOGLE_SHEETS_ID,
    enableAdminPanel: true,
    enablePublicAccess: true,
  },
} as const;

// Validation
if (!APP_CONFIG.supabase.url || !APP_CONFIG.supabase.anonKey) {
  console.warn(
    "Supabase configuration is missing. Please check your environment variables.",
  );
}

export default APP_CONFIG;

