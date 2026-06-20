import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ZodError } from 'zod';
import { api } from '@/services/api';
import { HISTORICAL_SCORERS_RESPONSE_FIXTURE } from '@/test/fixtures/historicalScorers.fixture';
import { getHistoricalScorers, HISTORICAL_SCORERS_PAGE_SIZE } from './historicalScorersService';

vi.mock('@/services/api', () => ({
  api: {
    get: vi.fn(),
  },
}));

describe('historicalScorersService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('requests the real endpoint with pagination, filters and language', async () => {
    vi.mocked(api.get).mockResolvedValue({ data: HISTORICAL_SCORERS_RESPONSE_FIXTURE });

    const result = await getHistoricalScorers(
      2,
      {
        name: 'messi',
        teamCode: 'ARG',
        confederationCode: 'CONMEBOL',
      },
      'en',
    );

    expect(api.get).toHaveBeenCalledWith('/api/scorers', {
      params: {
        page: 2,
        size: HISTORICAL_SCORERS_PAGE_SIZE,
        name: 'messi',
        teamCode: 'ARG',
        confederationCode: 'CONMEBOL',
      },
      headers: { 'Accept-Language': 'en' },
    });
    expect(result).toEqual(HISTORICAL_SCORERS_RESPONSE_FIXTURE);
  });

  it('omits empty filters and never uses a mock fallback', async () => {
    vi.mocked(api.get).mockResolvedValue({ data: HISTORICAL_SCORERS_RESPONSE_FIXTURE });

    await getHistoricalScorers();

    expect(api.get).toHaveBeenCalledWith('/api/scorers', {
      params: {
        page: 1,
        size: HISTORICAL_SCORERS_PAGE_SIZE,
      },
      headers: { 'Accept-Language': 'es' },
    });
  });

  it('rejects invalid API responses', async () => {
    vi.mocked(api.get).mockResolvedValue({
      data: {
        ...HISTORICAL_SCORERS_RESPONSE_FIXTURE,
        pagination: {
          ...HISTORICAL_SCORERS_RESPONSE_FIXTURE.pagination,
          hasNext: 'false',
        },
      },
    });

    await expect(getHistoricalScorers()).rejects.toBeInstanceOf(ZodError);
  });
});
