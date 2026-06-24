import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ZodError } from 'zod';
import { api } from '@/services/api';
import { PLAYER_GOALS_RESPONSE_FIXTURE } from '@/test/fixtures/playerGoals.fixture';
import { getPlayerGoals, PLAYER_GOALS_PAGE_SIZE } from './playerGoalsService';

vi.mock('@/services/api', () => ({
  api: {
    get: vi.fn(),
  },
}));

describe('playerGoalsService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('requests player goals for a championship year with max page size and language', async () => {
    vi.mocked(api.get).mockResolvedValue({ data: PLAYER_GOALS_RESPONSE_FIXTURE });

    const result = await getPlayerGoals(101, 1950, 'en');

    expect(api.get).toHaveBeenCalledWith('/api/players/101/goals', {
      params: {
        year: 1950,
        page: 1,
        size: PLAYER_GOALS_PAGE_SIZE,
      },
      headers: { 'Accept-Language': 'en' },
    });
    expect(result.data).toEqual(PLAYER_GOALS_RESPONSE_FIXTURE.data);
    expect(result.pagination.totalElements).toBe(PLAYER_GOALS_RESPONSE_FIXTURE.data.length);
  });

  it('collects every page into a single response', async () => {
    const [firstGoal, secondGoal, thirdGoal] = PLAYER_GOALS_RESPONSE_FIXTURE.data;
    vi.mocked(api.get)
      .mockResolvedValueOnce({
        data: {
          data: [firstGoal, secondGoal],
          pagination: {
            page: 1,
            size: PLAYER_GOALS_PAGE_SIZE,
            totalElements: 3,
            totalPages: 2,
            hasNext: true,
            hasPrevious: false,
          },
        },
      })
      .mockResolvedValueOnce({
        data: {
          data: [thirdGoal],
          pagination: {
            page: 2,
            size: PLAYER_GOALS_PAGE_SIZE,
            totalElements: 3,
            totalPages: 2,
            hasNext: false,
            hasPrevious: true,
          },
        },
      });

    const result = await getPlayerGoals(101, 1950);

    expect(api.get).toHaveBeenNthCalledWith(2, '/api/players/101/goals', {
      params: {
        year: 1950,
        page: 2,
        size: PLAYER_GOALS_PAGE_SIZE,
      },
      headers: { 'Accept-Language': 'es' },
    });
    expect(result.data).toEqual([firstGoal, secondGoal, thirdGoal]);
    expect(result.pagination).toMatchObject({
      page: 1,
      size: PLAYER_GOALS_PAGE_SIZE,
      totalElements: 3,
      totalPages: 1,
      hasNext: false,
      hasPrevious: false,
    });
  });

  it('returns an empty list when the player has no goals in the championship', async () => {
    vi.mocked(api.get).mockResolvedValue({
      data: {
        data: [],
        pagination: {
          page: 1,
          size: PLAYER_GOALS_PAGE_SIZE,
          totalElements: 0,
          totalPages: 0,
          hasNext: false,
          hasPrevious: false,
        },
      },
    });

    await expect(getPlayerGoals(101, 1950)).resolves.toMatchObject({
      data: [],
      pagination: {
        totalElements: 0,
        totalPages: 0,
      },
    });
  });

  it('rejects invalid API responses', async () => {
    vi.mocked(api.get).mockResolvedValue({
      data: {
        ...PLAYER_GOALS_RESPONSE_FIXTURE,
        data: [{ ...PLAYER_GOALS_RESPONSE_FIXTURE.data[0], minuteRegular: '30' }],
      },
    });

    await expect(getPlayerGoals(101, 1950)).rejects.toBeInstanceOf(ZodError);
  });
});
