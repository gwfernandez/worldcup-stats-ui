import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MOCK_CHAMPIONSHIPS } from '@/features/championships/mocks/championship.mock';
import { api } from '@/services/api';

vi.mock('@/services/api', () => ({
  api: {
    get: vi.fn(),
  },
}));

describe('championshipService', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  it('retorna datos mockeados cuando VITE_USE_MOCK es true', async () => {
    vi.stubEnv('VITE_USE_MOCK', 'true');
    const { getChampionships } = await import('./championshipService');

    const result = await getChampionships();

    expect(result).toEqual(MOCK_CHAMPIONSHIPS);
    expect(api.get).not.toHaveBeenCalled();
  });

  it('realiza una petición HTTP cuando VITE_USE_MOCK es false', async () => {
    vi.stubEnv('VITE_USE_MOCK', 'false');
    vi.mocked(api.get).mockResolvedValue({ data: MOCK_CHAMPIONSHIPS });
    const { getChampionships } = await import('./championshipService');

    const result = await getChampionships();

    expect(api.get).toHaveBeenCalledWith('/worldcups');
    expect(result).toEqual(MOCK_CHAMPIONSHIPS);
  });
});
