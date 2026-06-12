import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  MOCK_CHAMPIONSHIPS,
  MOCK_CHAMPIONSHIPS_RESPONSE,
} from '@/features/championships/mocks/championship.mock';
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
  });

  it('realiza una petición HTTP al endpoint paginado de campeonatos', async () => {
    vi.mocked(api.get).mockResolvedValue({ data: MOCK_CHAMPIONSHIPS_RESPONSE });
    const { getChampionships } = await import('./championshipService');

    const result = await getChampionships();

    expect(api.get).toHaveBeenCalledWith('/api/championships?size=50');
    expect(result).toEqual(MOCK_CHAMPIONSHIPS);
  });
});
