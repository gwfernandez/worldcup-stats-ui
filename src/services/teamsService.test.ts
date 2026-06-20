import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ZodError } from 'zod';
import { api } from '@/services/api';
import { TEAMS_RESPONSE_FIXTURE } from '@/test/fixtures/teams.fixture';
import { getTeams, TEAMS_PAGE_SIZE } from './teamsService';

vi.mock('@/services/api', () => ({
  api: {
    get: vi.fn(),
  },
}));

describe('teamsService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('requests all team pages including dissolved teams', async () => {
    const firstPage = {
      ...TEAMS_RESPONSE_FIXTURE,
      data: [TEAMS_RESPONSE_FIXTURE.data[0]],
      pagination: {
        ...TEAMS_RESPONSE_FIXTURE.pagination,
        totalElements: 2,
        totalPages: 2,
        hasNext: true,
      },
    };
    const secondPage = {
      ...TEAMS_RESPONSE_FIXTURE,
      data: [TEAMS_RESPONSE_FIXTURE.data[1]],
      pagination: {
        ...TEAMS_RESPONSE_FIXTURE.pagination,
        page: 2,
        totalElements: 2,
        totalPages: 2,
        hasPrevious: true,
      },
    };
    vi.mocked(api.get).mockResolvedValueOnce({ data: firstPage }).mockResolvedValueOnce({
      data: secondPage,
    });

    const result = await getTeams('en');

    expect(api.get).toHaveBeenNthCalledWith(1, '/api/teams', {
      params: { page: 1, size: TEAMS_PAGE_SIZE, includeDissolved: true },
      headers: { 'Accept-Language': 'en' },
    });
    expect(api.get).toHaveBeenNthCalledWith(2, '/api/teams', {
      params: { page: 2, size: TEAMS_PAGE_SIZE, includeDissolved: true },
      headers: { 'Accept-Language': 'en' },
    });
    expect(result).toEqual(TEAMS_RESPONSE_FIXTURE.data);
  });

  it('rejects invalid API responses', async () => {
    vi.mocked(api.get).mockResolvedValue({
      data: {
        ...TEAMS_RESPONSE_FIXTURE,
        data: [{ ...TEAMS_RESPONSE_FIXTURE.data[0], isDissolved: 'false' }],
      },
    });

    await expect(getTeams()).rejects.toBeInstanceOf(ZodError);
  });
});
