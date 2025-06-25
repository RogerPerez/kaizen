interface EnvConfig {
  apiBaseUrl: string;
  appName: string;
  appVersion: string;
  enableDevtools: boolean;
  logLevel: string;
  enableNotifications: boolean;
  enableAnalytics: boolean;
  theme: string;
  defaultSort: string;
  isDevelopment: boolean;
  isProduction: boolean;
}

const getEnvVar = (key: string, defaultValue: string = ''): string => {
  return import.meta.env[key] || defaultValue;
};

const getBooleanEnvVar = (key: string, defaultValue: boolean = false): boolean => {
  const value = import.meta.env[key];
  if (value === undefined) return defaultValue;
  return value === 'true' || value === '1';
};

export const env: EnvConfig = {
  apiBaseUrl: getEnvVar('VITE_API_BASE_URL', 'https://jsonplaceholder.typicode.com'),
  appName: getEnvVar('VITE_APP_NAME', 'Kaizen Task Manager'),
  appVersion: getEnvVar('VITE_APP_VERSION', '1.0.0'),
  
  enableDevtools: getBooleanEnvVar('VITE_ENABLE_DEVTOOLS', true),
  logLevel: getEnvVar('VITE_LOG_LEVEL', 'info'),
  
  enableNotifications: getBooleanEnvVar('VITE_ENABLE_NOTIFICATIONS', true),
  enableAnalytics: getBooleanEnvVar('VITE_ENABLE_ANALYTICS', false),
  
  theme: getEnvVar('VITE_THEME', 'default'),
  defaultSort: getEnvVar('VITE_DEFAULT_SORT', 'smart'),
  
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
};

if (!env.apiBaseUrl) {
  throw new Error('VITE_API_BASE_URL is required');
}

export const {
  apiBaseUrl,
  appName,
  appVersion,
  enableDevtools,
  logLevel,
  enableNotifications,
  enableAnalytics,
  theme,
  defaultSort,
  isDevelopment,
  isProduction,
} = env;