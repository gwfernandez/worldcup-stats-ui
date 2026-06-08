import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MOCK_HISTORICAL_SCORERS } from '@/features/historicalScorers/mocks/historicalScorers.mock';
import { api } from '@/services/api';

vi.mock('@/services/api', () => ({
  api: {
    get: vi.fn(),
  },
}));

describe('historicalScorersService', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  it('debería retornar datos mockeados cuando VITE_USE_MOCK es true', async () => {
    vi.stubEnv('VITE_USE_MOCK', 'true');
    const { getHistoricalScorers } = await import('./historicalScorersService');

    const result = await getHistoricalScorers();
    expect(result).toEqual(MOCK_HISTORICAL_SCORERS);
    expect(api.get).not.toHaveBeenCalled();
  });

  it('debería realizar una petición HTTP cuando VITE_USE_MOCK es false o no está definido', async () => {
    vi.stubEnv('VITE_USE_MOCK', 'false');
    vi.mocked(api.get).mockResolvedValue({ data: MOCK_HISTORICAL_SCORERS });
    const { getHistoricalScorers } = await import('./historicalScorersService');

    const result = await getHistoricalScorers();
    expect(api.get).toHaveBeenCalledWith('/historical/scorers');
    expect(result).toEqual(MOCK_HISTORICAL_SCORERS);
  });
});
