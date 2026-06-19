import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ZodError } from 'zod';
import { api } from '@/services/api';
import {
  HISTORICAL_STANDINGS_FIXTURE,
  HISTORICAL_STANDINGS_RESPONSE_FIXTURE,
} from '@/test/fixtures/historicalStandings.fixture';
import {
  getHistoricalStandings,
  HISTORICAL_STANDINGS_PAGE_SIZE,
} from './historicalStandingsService';

vi.mock('@/services/api', () => ({
  api: {
    get: vi.fn(),
  },
}));

describe('historicalStandingsService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('requests all standings from the real endpoint with filters and language', async () => {
    vi.mocked(api.get).mockResolvedValue({ data: HISTORICAL_STANDINGS_RESPONSE_FIXTURE });

    const result = await getHistoricalStandings(
      { name: 'argen', confederationCode: 'CONMEBOL' },
      'en',
    );

    expect(api.get).toHaveBeenCalledWith('/api/standings', {
      params: {
        page: 1,
        size: HISTORICAL_STANDINGS_PAGE_SIZE,
        name: 'argen',
        confederationCode: 'CONMEBOL',
      },
      headers: { 'Accept-Language': 'en' },
    });
    expect(result).toEqual(HISTORICAL_STANDINGS_FIXTURE);
  });

  it('omits empty optional filters', async () => {
    vi.mocked(api.get).mockResolvedValue({ data: HISTORICAL_STANDINGS_RESPONSE_FIXTURE });

    await getHistoricalStandings({}, 'es');

    expect(api.get).toHaveBeenCalledWith('/api/standings', {
      params: {
        page: 1,
        size: HISTORICAL_STANDINGS_PAGE_SIZE,
      },
      headers: { 'Accept-Language': 'es' },
    });
  });

  it('loads and combines every page reported by the API', async () => {
    const [brazil, germany] = HISTORICAL_STANDINGS_FIXTURE;
    const thirdStanding = {
      ...germany,
      team: { code: 'ARG', name: 'Argentina' },
      confederationCode: 'CONMEBOL',
      unifiedPosition: 3,
    };

    vi.mocked(api.get)
      .mockResolvedValueOnce({
        data: {
          data: [brazil],
          pagination: {
            page: 1,
            size: 1,
            totalElements: 3,
            totalPages: 3,
            hasNext: true,
            hasPrevious: false,
          },
        },
      })
      .mockResolvedValueOnce({
        data: {
          data: [germany],
          pagination: {
            page: 2,
            size: 1,
            totalElements: 3,
            totalPages: 3,
            hasNext: true,
            hasPrevious: true,
          },
        },
      })
      .mockResolvedValueOnce({
        data: {
          data: [thirdStanding],
          pagination: {
            page: 3,
            size: 1,
            totalElements: 3,
            totalPages: 3,
            hasNext: false,
            hasPrevious: true,
          },
        },
      });

    const result = await getHistoricalStandings();

    expect(api.get).toHaveBeenNthCalledWith(2, '/api/standings', {
      params: { page: 2, size: HISTORICAL_STANDINGS_PAGE_SIZE },
      headers: { 'Accept-Language': 'es' },
    });
    expect(api.get).toHaveBeenNthCalledWith(3, '/api/standings', {
      params: { page: 3, size: HISTORICAL_STANDINGS_PAGE_SIZE },
      headers: { 'Accept-Language': 'es' },
    });
    expect(result).toEqual([brazil, germany, thirdStanding]);
  });

  it('rejects an invalid API response', async () => {
    vi.mocked(api.get).mockResolvedValue({
      data: {
        ...HISTORICAL_STANDINGS_RESPONSE_FIXTURE,
        data: [{ ...HISTORICAL_STANDINGS_FIXTURE[0], unifiedPoints: '237' }],
      },
    });

    await expect(getHistoricalStandings()).rejects.toBeInstanceOf(ZodError);
  });
});
