import '@testing-library/jest-dom';
import { afterAll, afterEach, beforeAll, vi } from 'vitest';
import { server } from '@/mocks/server';
import i18n from '@/i18n/config';

vi.stubEnv('VITE_USE_MOCK', 'false');

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => {
  server.resetHandlers();
  void i18n.changeLanguage('es');
});
afterAll(() => server.close());
