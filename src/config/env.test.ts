import { describe, expect, it, vi, beforeEach } from 'vitest';

describe('env', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.unstubAllEnvs();
  });

  it('usa valores por defecto cuando no hay variables configuradas', async () => {
    const { env } = await import('./env');

    expect(env.apiBaseUrl).toBe('http://localhost:8080/api');
    expect(env.useMock).toBe(false);
  });

  it('lee la URL base y habilita mocks desde variables Vite', async () => {
    vi.stubEnv('VITE_API_BASE_URL', 'http://localhost:8080/custom-api');
    vi.stubEnv('VITE_USE_MOCK', 'true');

    const { env } = await import('./env');

    expect(env.apiBaseUrl).toBe('http://localhost:8080/custom-api');
    expect(env.useMock).toBe(true);
  });
});
