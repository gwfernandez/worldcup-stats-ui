export interface AppEnv {
  apiBaseUrl: string;
  useMock: boolean;
}

const getApiBaseUrl = (): string => {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  if (apiBaseUrl === 'same-origin') {
    return '';
  }

  return apiBaseUrl || 'http://localhost:8080';
};

export const env: AppEnv = {
  apiBaseUrl: getApiBaseUrl(),
  useMock: import.meta.env.VITE_USE_MOCK === 'true',
};
