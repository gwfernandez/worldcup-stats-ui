import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ZodError } from 'zod';
import { api } from '@/services/api';
import { CHAMPIONSHIP_SQUAD_RESPONSE_FIXTURE } from '@/test/fixtures/championshipSquad.fixture';
import { getChampionshipSquad } from './championshipSquadService';

vi.mock('@/services/api', () => ({
  api: {
    get: vi.fn(),
  },
}));

describe('championshipSquadService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('requests the squad for a selected championship team with the maximum page size', async () => {
    vi.mocked(api.get).mockResolvedValue({
      data: {
        ...CHAMPIONSHIP_SQUAD_RESPONSE_FIXTURE,
        data: [
          {
            ...CHAMPIONSHIP_SQUAD_RESPONSE_FIXTURE.data[0],
            position: 'FW',
          },
        ],
      },
    });

    const result = await getChampionshipSquad(1950, 'URY', 'en');

    expect(api.get).toHaveBeenCalledWith('/api/championships/1950/squads/URY', {
      params: { page: 1, size: 100 },
      headers: { 'Accept-Language': 'en' },
    });
    expect(result).toEqual([
      {
        ...CHAMPIONSHIP_SQUAD_RESPONSE_FIXTURE.data[0],
        position: 'forward',
      },
    ]);
  });

  it('collects every page into a single player list', async () => {
    const [maspoli, ghiggia, varela] = CHAMPIONSHIP_SQUAD_RESPONSE_FIXTURE.data;
    vi.mocked(api.get)
      .mockResolvedValueOnce({
        data: {
          data: [maspoli, ghiggia],
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
          data: [varela],
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

    const result = await getChampionshipSquad(1950, 'URY');

    expect(api.get).toHaveBeenNthCalledWith(2, '/api/championships/1950/squads/URY', {
      params: { page: 2, size: 100 },
      headers: { 'Accept-Language': 'es' },
    });
    expect(result).toEqual([maspoli, ghiggia, varela]);
  });

  it('returns an empty list when the selected team has no players', async () => {
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

    await expect(getChampionshipSquad(1930, 'BOL')).resolves.toEqual([]);
  });

  it('rejects invalid API responses', async () => {
    vi.mocked(api.get).mockResolvedValue({
      data: {
        ...CHAMPIONSHIP_SQUAD_RESPONSE_FIXTURE,
        data: [
          {
            ...CHAMPIONSHIP_SQUAD_RESPONSE_FIXTURE.data[0],
            position: 'coach',
          },
        ],
      },
    });

    await expect(getChampionshipSquad(1950, 'URY')).rejects.toBeInstanceOf(ZodError);
  });
});
