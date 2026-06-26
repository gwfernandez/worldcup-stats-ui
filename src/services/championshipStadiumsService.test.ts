import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ZodError } from 'zod';
import { api } from '@/services/api';
import { CHAMPIONSHIP_STADIUMS_RESPONSE_FIXTURE } from '@/test/fixtures/championshipStadiums.fixture';
import { getChampionshipStadiums } from './championshipStadiumsService';

vi.mock('@/services/api', () => ({
  api: {
    get: vi.fn(),
  },
}));

describe('championshipStadiumsService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('requests all stadiums for a championship with the maximum page size', async () => {
    vi.mocked(api.get).mockResolvedValue({ data: CHAMPIONSHIP_STADIUMS_RESPONSE_FIXTURE });

    const result = await getChampionshipStadiums(1930);

    expect(api.get).toHaveBeenCalledWith('/api/championships/1930/stadiums', {
      params: { page: 1, size: 100 },
    });
    expect(result).toEqual(CHAMPIONSHIP_STADIUMS_RESPONSE_FIXTURE.data);
  });

  it('collects every page into a single list', async () => {
    const [centenario, maracana, withoutCountry] = CHAMPIONSHIP_STADIUMS_RESPONSE_FIXTURE.data;
    vi.mocked(api.get)
      .mockResolvedValueOnce({
        data: {
          data: [centenario, maracana],
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
          data: [withoutCountry],
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

    const result = await getChampionshipStadiums(1950);

    expect(api.get).toHaveBeenNthCalledWith(2, '/api/championships/1950/stadiums', {
      params: { page: 2, size: 100 },
    });
    expect(result).toEqual([centenario, maracana, withoutCountry]);
  });

  it('returns an empty list when the championship has no associated stadiums', async () => {
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

    await expect(getChampionshipStadiums(1942)).resolves.toEqual([]);
  });

  it('rejects invalid API responses', async () => {
    vi.mocked(api.get).mockResolvedValue({
      data: {
        ...CHAMPIONSHIP_STADIUMS_RESPONSE_FIXTURE,
        data: [
          {
            ...CHAMPIONSHIP_STADIUMS_RESPONSE_FIXTURE.data[0],
            matchesPlayed: null,
          },
        ],
      },
    });

    await expect(getChampionshipStadiums(1930)).rejects.toBeInstanceOf(ZodError);
  });
});
