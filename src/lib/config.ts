// Environment configuration for the frontend
const getApiBaseUrl = (): string => {
  console.log('🔍 Debug Environment Variables:');
  console.log('- VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL);
  console.log('- MODE:', import.meta.env.MODE);
  console.log('- PROD:', import.meta.env.PROD);
  console.log('- DEV:', import.meta.env.DEV);
  
  // TEMPORARY OVERRIDE: Force HTTPS in production
  if (import.meta.env.PROD || import.meta.env.MODE === 'production') {
    console.log('🔒 FORCING HTTPS for production');
    return 'https://backend.jusfinn.com';
  }
  
  // Check if we have an environment variable set
  if (import.meta.env.VITE_API_BASE_URL) {
    console.log('✅ Using VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL);
    return import.meta.env.VITE_API_BASE_URL;
  }
  
  // Auto-detect based on current environment
  if (import.meta.env.PROD) {
    console.log('🏭 Production mode detected');
    // Production environment - use HTTPS backend
    // Check if we're in browser environment
    if (typeof window !== 'undefined' && window.location) {
      console.log('🌐 Browser hostname:', window.location.hostname);
      if (window.location.hostname === 'jusfinn.com') {
        console.log('✅ Using production HTTPS URL for jusfinn.com');
        return 'https://backend.jusfinn.com';
      }
    }
    // Fallback for production (build time or other domains)
    console.log('✅ Using fallback production HTTPS URL');
    return 'https://backend.jusfinn.com';
  }
  
  // Development environment
  console.log('🛠️ Development mode - using localhost');
  return 'http://localhost:8000';
};

export const config = {
  // API Configuration
  API_BASE_URL: getApiBaseUrl(),
  
  // Environment
  NODE_ENV: import.meta.env.MODE || 'development',
  IS_DEVELOPMENT: import.meta.env.MODE === 'development',
  IS_PRODUCTION: import.meta.env.MODE === 'production',
  
  // App Configuration
  APP_NAME: 'JusFinn',
  APP_VERSION: '1.0.0',
} as const;

console.log('🎯 Final API_BASE_URL:', config.API_BASE_URL);

// Helper function to get full API URL
export const getApiUrl = (endpoint: string): string => {
  return `${config.API_BASE_URL}${endpoint}`;
}; 