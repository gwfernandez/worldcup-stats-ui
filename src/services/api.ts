import axios, { AxiosHeaders } from 'axios';
import { env } from '@/config/env';
import { useUIStore } from '@/store/ui.store';

export const api = axios.create({
  baseURL: env.apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const { language } = useUIStore.getState();

  config.headers = AxiosHeaders.from(config.headers);
  config.headers.set('Accept-Language', language);

  return config;
});
