import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ZodError } from 'zod';
import {
  getMockChampionsResponse,
  MOCK_CHAMPIONS_RESPONSE,
} from '@/features/champions/mocks/champions.mock';
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
    vi.unstubAllEnvs();
  });

  it('returns the paginated mock response when VITE_USE_MOCK is true', async () => {
    vi.stubEnv('VITE_USE_MOCK', 'true');
    const { getChampions } = await import('./championsService');

    const result = await getChampions();

    expect(result).toEqual(MOCK_CHAMPIONS_RESPONSE);
    expect(api.get).not.toHaveBeenCalled();
  });

  it('localizes mock champion names using the selected language', async () => {
    vi.stubEnv('VITE_USE_MOCK', 'true');
    const { getChampions } = await import('./championsService');

    const result = await getChampions(1, 15, 'en');

    expect(result).toEqual(getMockChampionsResponse('en'));
    expect(result.data[0].team.name).toBe('Brazil');
    expect(result.data[1].team.name).toBe('Germany');
  });

  it('requests the first 15 champions from the API', async () => {
    vi.stubEnv('VITE_USE_MOCK', 'false');
    vi.mocked(api.get).mockResolvedValue({ data: MOCK_CHAMPIONS_RESPONSE });
    const { getChampions } = await import('./championsService');

    const result = await getChampions(1, 15, 'en');

    expect(api.get).toHaveBeenCalledWith('/api/champions', {
      params: { page: 1, size: 15 },
      headers: { 'Accept-Language': 'en' },
    });
    expect(result).toEqual(MOCK_CHAMPIONS_RESPONSE);
  });

  it('rejects an invalid API response', async () => {
    vi.stubEnv('VITE_USE_MOCK', 'false');
    vi.mocked(api.get).mockResolvedValue({
      data: {
        ...MOCK_CHAMPIONS_RESPONSE,
        data: [{ ...MOCK_CHAMPIONS_RESPONSE.data[0], wins: '5' }],
      },
    });
    const { getChampions } = await import('./championsService');

    await expect(getChampions()).rejects.toBeInstanceOf(ZodError);
  });
});
