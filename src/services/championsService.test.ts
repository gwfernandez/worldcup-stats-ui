import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ZodError } from 'zod';
import { CHAMPIONS_RESPONSE_FIXTURE } from '@/test/fixtures/champions.fixture';
import { CHAMPION_FINALS_RESPONSE_FIXTURE } from '@/test/fixtures/championFinals.fixture';
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

  it('requests champions from the API even when VITE_USE_MOCK is true', async () => {
    vi.stubEnv('VITE_USE_MOCK', 'true');
    vi.mocked(api.get).mockResolvedValue({ data: CHAMPIONS_RESPONSE_FIXTURE });
    const { getChampions } = await import('./championsService');

    const result = await getChampions(1, 15, 'es');

    expect(api.get).toHaveBeenCalledWith('/api/champions', {
      params: { page: 1, size: 15 },
      headers: { 'Accept-Language': 'es' },
    });
    expect(result).toEqual(CHAMPIONS_RESPONSE_FIXTURE);
  });

  it('requests the first 15 champions from the API', async () => {
    vi.stubEnv('VITE_USE_MOCK', 'false');
    vi.mocked(api.get).mockResolvedValue({ data: CHAMPIONS_RESPONSE_FIXTURE });
    const { getChampions } = await import('./championsService');

    const result = await getChampions(1, 15, 'en');

    expect(api.get).toHaveBeenCalledWith('/api/champions', {
      params: { page: 1, size: 15 },
      headers: { 'Accept-Language': 'en' },
    });
    expect(result).toEqual(CHAMPIONS_RESPONSE_FIXTURE);
  });

  it('rejects an invalid API response', async () => {
    vi.stubEnv('VITE_USE_MOCK', 'false');
    vi.mocked(api.get).mockResolvedValue({
      data: {
        ...CHAMPIONS_RESPONSE_FIXTURE,
        data: [{ ...CHAMPIONS_RESPONSE_FIXTURE.data[0], wins: '5' }],
      },
    });
    const { getChampions } = await import('./championsService');

    await expect(getChampions()).rejects.toBeInstanceOf(ZodError);
  });

  it('requests champion finals without pagination parameters', async () => {
    vi.mocked(api.get).mockResolvedValue({ data: CHAMPION_FINALS_RESPONSE_FIXTURE });
    const { getChampionFinals } = await import('./championsService');

    const result = await getChampionFinals('ARG', 'en');

    expect(api.get).toHaveBeenCalledWith('/api/champions/ARG', {
      headers: { 'Accept-Language': 'en' },
    });
    expect(result).toEqual(CHAMPION_FINALS_RESPONSE_FIXTURE);
  });

  it('rejects an invalid champion finals response', async () => {
    vi.mocked(api.get).mockResolvedValue({
      data: {
        ...CHAMPION_FINALS_RESPONSE_FIXTURE,
        data: [{ ...CHAMPION_FINALS_RESPONSE_FIXTURE.data[0], hostCodes: null }],
      },
    });
    const { getChampionFinals } = await import('./championsService');

    await expect(getChampionFinals('ARG')).rejects.toBeInstanceOf(ZodError);
  });
});
