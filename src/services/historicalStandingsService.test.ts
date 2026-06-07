import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MOCK_HISTORICAL_STANDINGS } from '@/features/historicalStandings/mocks/historicalStandings.mock';
import { api } from '@/services/api';

vi.mock('@/services/api', () => ({
  api: {
    get: vi.fn(),
  },
}));

describe('historicalStandingsService', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.restoreAllMocks();
  });

  it('debería retornar datos mockeados cuando VITE_USE_MOCK es true', async () => {
    vi.stubEnv('VITE_USE_MOCK', 'true');
    const { getHistoricalStandings } = await import('./historicalStandingsService');
    
    const result = await getHistoricalStandings();
    expect(result).toEqual(MOCK_HISTORICAL_STANDINGS);
    expect(api.get).not.toHaveBeenCalled();
  });

  it('debería realizar una petición HTTP cuando VITE_USE_MOCK es false o no está definido', async () => {
    vi.stubEnv('VITE_USE_MOCK', 'false');
    vi.mocked(api.get).mockResolvedValue({ data: MOCK_HISTORICAL_STANDINGS });
    const { getHistoricalStandings } = await import('./historicalStandingsService');

    const result = await getHistoricalStandings();
    expect(api.get).toHaveBeenCalledWith('/historical/standings');
    expect(result).toEqual(MOCK_HISTORICAL_STANDINGS);
  });
});
