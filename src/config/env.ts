export interface AppEnv {
  apiBaseUrl: string;
  useMock: boolean;
}

export const env: AppEnv = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  useMock: import.meta.env.VITE_USE_MOCK === 'true',
};
