// Environment configuration for Shades frontend
// This file allows easy switching between development and production environments

interface EnvironmentConfig {
  API_BASE_URL: string;
  ENVIRONMENT: 'development' | 'staging' | 'production';
  DEBUG: boolean;
}

// Determine environment based on Vite environment variables or current URL
const getEnvironment = (): 'development' | 'staging' | 'production' => {
  if (import.meta.env.VITE_ENVIRONMENT) {
    return import.meta.env.VITE_ENVIRONMENT as 'development' | 'staging' | 'production';
  }
  if (import.meta.env.DEV) return 'development';
  if (window.location.hostname.includes('staging')) return 'staging';
  return 'production';
};

// Configuration based on environment
const configs: Record<string, EnvironmentConfig> = {
  development: {
    API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001',
    ENVIRONMENT: 'development',
    DEBUG: true
  },
  staging: {
    API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://shades-backend-staging.drhomelab.in',
    ENVIRONMENT: 'staging',
    DEBUG: true
  },
  production: {
    API_BASE_URL: 'https://shades-backend.drhomelab.in',
    ENVIRONMENT: 'production',
    DEBUG: false
  }
};

// Get current configuration
const currentEnv = getEnvironment();
export const config: EnvironmentConfig = configs[currentEnv];

// Export individual values for convenience
export const API_BASE_URL = config.API_BASE_URL;
export const ENVIRONMENT = config.ENVIRONMENT;
export const DEBUG = config.DEBUG;

// Log configuration in development
if (DEBUG) {
  console.log('🔧 Environment Configuration:', {
    environment: ENVIRONMENT,
    apiBaseUrl: API_BASE_URL,
    debug: DEBUG
  });
} 