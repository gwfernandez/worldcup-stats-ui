import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ZodError } from 'zod';
import { api } from '@/services/api';
import { CHAMPIONSHIP_STADIUM_MATCHES_RESPONSE_FIXTURE } from '@/test/fixtures/championshipStadiumMatches.fixture';
import { getChampionshipStadiumMatches } from './championshipStadiumMatchesService';

vi.mock('@/services/api', () => ({
  api: {
    get: vi.fn(),
  },
}));

describe('championshipStadiumMatchesService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('requests stadium matches for a championship stadium with the maximum page size', async () => {
    vi.mocked(api.get).mockResolvedValue({
      data: CHAMPIONSHIP_STADIUM_MATCHES_RESPONSE_FIXTURE,
    });

    const result = await getChampionshipStadiumMatches(1930, 1, 'en');

    expect(api.get).toHaveBeenCalledWith('/api/championships/1930/stadiums/1', {
      params: { page: 1, size: 100 },
      headers: { 'Accept-Language': 'en' },
    });
    expect(result).toEqual(CHAMPIONSHIP_STADIUM_MATCHES_RESPONSE_FIXTURE.data);
  });

  it('collects every page into a single match list', async () => {
    const [opener, finalMatch, pendingMatch] = CHAMPIONSHIP_STADIUM_MATCHES_RESPONSE_FIXTURE.data;
    vi.mocked(api.get)
      .mockResolvedValueOnce({
        data: {
          data: [opener, finalMatch],
          pagination: {
            page: 1,
            size: 100,
            totalElements: 3,
            totalPages: 2,
            hasNext: true,
            hasPrevious: false,
          },
        },
      })
      .mockResolvedValueOnce({
        data: {
          data: [pendingMatch],
          pagination: {
            page: 2,
            size: 100,
            totalElements: 3,
            totalPages: 2,
            hasNext: false,
            hasPrevious: true,
          },
        },
      });

    const result = await getChampionshipStadiumMatches(1930, 1);

    expect(api.get).toHaveBeenNthCalledWith(2, '/api/championships/1930/stadiums/1', {
      params: { page: 2, size: 100 },
      headers: { 'Accept-Language': 'es' },
    });
    expect(result).toEqual([opener, finalMatch, pendingMatch]);
  });

  it('returns an empty list when the stadium has no matches', async () => {
    vi.mocked(api.get).mockResolvedValue({
      data: {
        data: [],
        pagination: {
          page: 1,
          size: 100,
          totalElements: 0,
          totalPages: 0,
          hasNext: false,
          hasPrevious: false,
        },
      },
    });

    await expect(getChampionshipStadiumMatches(1930, 99)).resolves.toEqual([]);
  });

  it('rejects invalid API responses', async () => {
    vi.mocked(api.get).mockResolvedValue({
      data: {
        ...CHAMPIONSHIP_STADIUM_MATCHES_RESPONSE_FIXTURE,
        data: [
          {
            ...CHAMPIONSHIP_STADIUM_MATCHES_RESPONSE_FIXTURE.data[0],
            homeTeamScore: '4',
          },
        ],
      },
    });

    await expect(getChampionshipStadiumMatches(1930, 1)).rejects.toBeInstanceOf(ZodError);
  });
});
