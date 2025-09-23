// Configuration constants for the application

export const APP_CONFIG = {
  // Supabase configuration
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL,
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
  },

  // Storage configuration
  storage: {
    bucketName: 'serenacosmeticoscatalogoimagem',
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  },

  // Feature flags
  features: {
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
