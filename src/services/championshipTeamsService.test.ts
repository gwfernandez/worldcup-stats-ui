import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ZodError } from 'zod';
import { api } from '@/services/api';
import { CHAMPIONSHIP_TEAMS_RESPONSE_FIXTURE } from '@/test/fixtures/championshipTeams.fixture';
import { getChampionshipTeams } from './championshipTeamsService';

vi.mock('@/services/api', () => ({
  api: {
    get: vi.fn(),
  },
}));

describe('championshipTeamsService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('requests all teams for a championship with the maximum page size', async () => {
    vi.mocked(api.get).mockResolvedValue({ data: CHAMPIONSHIP_TEAMS_RESPONSE_FIXTURE });

    const result = await getChampionshipTeams(1950, 'en');

    expect(api.get).toHaveBeenCalledWith('/api/championships/1950/teams', {
      params: { page: 1, size: 100 },
      headers: { 'Accept-Language': 'en' },
    });
    expect(result).toEqual(CHAMPIONSHIP_TEAMS_RESPONSE_FIXTURE.data);
  });

  it('collects every page into a single list', async () => {
    const [uruguay, brazil, england] = CHAMPIONSHIP_TEAMS_RESPONSE_FIXTURE.data;
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
          data: [england],
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

    const result = await getChampionshipTeams(1950);

    expect(api.get).toHaveBeenNthCalledWith(2, '/api/championships/1950/teams', {
      params: { page: 2, size: 100 },
      headers: { 'Accept-Language': 'es' },
    });
    expect(result).toEqual([uruguay, brazil, england]);
  });

  it('returns an empty list when the championship has no associated teams', async () => {
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

    await expect(getChampionshipTeams(1942)).resolves.toEqual([]);
  });

  it('rejects invalid API responses', async () => {
    vi.mocked(api.get).mockResolvedValue({
      data: {
        ...CHAMPIONSHIP_TEAMS_RESPONSE_FIXTURE,
        data: [
          {
            ...CHAMPIONSHIP_TEAMS_RESPONSE_FIXTURE.data[0],
            confederationCode: null,
          },
        ],
      },
    });

    await expect(getChampionshipTeams(1950)).rejects.toBeInstanceOf(ZodError);
  });
});
