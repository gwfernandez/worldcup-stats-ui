import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MOCK_CHAMPIONS } from '@/features/champions/mocks/champions.mock';
import { api } from '@/services/api';

vi.mock('@/services/api', () => ({
  api: {
    get: vi.fn(),
  },
}));

describe('championsService', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.restoreAllMocks();
  });

  it('debería retornar datos mockeados cuando VITE_USE_MOCK es true', async () => {
    vi.stubEnv('VITE_USE_MOCK', 'true');
    const { getChampions } = await import('./championsService');
    
    const result = await getChampions();
    expect(result).toEqual(MOCK_CHAMPIONS);
    expect(api.get).not.toHaveBeenCalled();
  });

  it('debería realizar una petición HTTP cuando VITE_USE_MOCK es false o no está definido', async () => {
    vi.stubEnv('VITE_USE_MOCK', 'false');
    vi.mocked(api.get).mockResolvedValue({ data: MOCK_CHAMPIONS });
    const { getChampions } = await import('./championsService');

    const result = await getChampions();
    expect(api.get).toHaveBeenCalledWith('/champions');
    expect(result).toEqual(MOCK_CHAMPIONS);
  });
});
