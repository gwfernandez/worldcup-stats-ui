import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ZodError } from 'zod';
import { api } from '@/services/api';
import { CHAMPIONSHIP_SCORERS_RESPONSE_FIXTURE } from '@/test/fixtures/championshipScorers.fixture';
import { getChampionshipScorers } from './championshipScorersService';

vi.mock('@/services/api', () => ({
  api: {
    get: vi.fn(),
  },
}));

describe('championshipScorersService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('requests championship scorers with pagination, filters and language', async () => {
    vi.mocked(api.get).mockResolvedValue({ data: CHAMPIONSHIP_SCORERS_RESPONSE_FIXTURE });

    const result = await getChampionshipScorers(
      1950,
      2,
      { name: 'ademir', teamCode: 'BRA' },
      'en',
    );

    expect(api.get).toHaveBeenCalledWith('/api/championships/1950/scorers', {
      params: {
        page: 2,
        size: 10,
        name: 'ademir',
        teamCode: 'BRA',
      },
      headers: { 'Accept-Language': 'en' },
    });
    expect(result).toEqual(CHAMPIONSHIP_SCORERS_RESPONSE_FIXTURE);
  });

  it('omits empty filters', async () => {
    vi.mocked(api.get).mockResolvedValue({ data: CHAMPIONSHIP_SCORERS_RESPONSE_FIXTURE });

    await getChampionshipScorers(1934);

    expect(api.get).toHaveBeenCalledWith('/api/championships/1934/scorers', {
      params: {
        page: 1,
        size: 10,
      },
      headers: { 'Accept-Language': 'es' },
    });
  });

  it('rejects invalid API responses', async () => {
    vi.mocked(api.get).mockResolvedValue({
      data: {
        ...CHAMPIONSHIP_SCORERS_RESPONSE_FIXTURE,
        data: [{ ...CHAMPIONSHIP_SCORERS_RESPONSE_FIXTURE.data[0], goals: '8' }],
      },
    });

    await expect(getChampionshipScorers(1950)).rejects.toBeInstanceOf(ZodError);
  });
});
