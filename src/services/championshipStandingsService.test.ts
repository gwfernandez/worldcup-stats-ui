import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ZodError } from 'zod';
import { api } from '@/services/api';
import { CHAMPIONSHIP_STANDINGS_RESPONSE_FIXTURE } from '@/test/fixtures/championshipStandings.fixture';
import { getChampionshipStandings } from './championshipStandingsService';

vi.mock('@/services/api', () => ({
  api: {
    get: vi.fn(),
  },
}));

describe('championshipStandingsService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('requests all standings for a championship with the maximum page size and language', async () => {
    vi.mocked(api.get).mockResolvedValue({ data: CHAMPIONSHIP_STANDINGS_RESPONSE_FIXTURE });

    const result = await getChampionshipStandings(1950, 'en');

    expect(api.get).toHaveBeenCalledWith('/api/championships/1950/standings', {
      params: { page: 1, size: 100 },
      headers: { 'Accept-Language': 'en' },
    });
    expect(result).toEqual(CHAMPIONSHIP_STANDINGS_RESPONSE_FIXTURE.data);
  });

  it('collects every page into a single list', async () => {
    const [uruguay, brazil, sweden] = CHAMPIONSHIP_STANDINGS_RESPONSE_FIXTURE.data;
    vi.mocked(api.get)
      .mockResolvedValueOnce({
        data: {
          data: [uruguay, brazil],
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
          data: [sweden],
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

    const result = await getChampionshipStandings(1950);

    expect(api.get).toHaveBeenNthCalledWith(2, '/api/championships/1950/standings', {
      params: { page: 2, size: 100 },
      headers: { 'Accept-Language': 'es' },
    });
    expect(result).toEqual([uruguay, brazil, sweden]);
  });

  it('returns an empty list when the championship has no standings', async () => {
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

    await expect(getChampionshipStandings(1942)).resolves.toEqual([]);
  });

  it('rejects invalid API responses', async () => {
    vi.mocked(api.get).mockResolvedValue({
      data: {
        ...CHAMPIONSHIP_STANDINGS_RESPONSE_FIXTURE,
        data: [
          {
            ...CHAMPIONSHIP_STANDINGS_RESPONSE_FIXTURE.data[0],
            points: '7',
          },
        ],
      },
    });

    await expect(getChampionshipStandings(1950)).rejects.toBeInstanceOf(ZodError);
  });
});
