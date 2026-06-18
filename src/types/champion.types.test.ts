import { describe, expect, it } from 'vitest';
import { ZodError } from 'zod';
import {
  ChampionFinalListResponseSchema,
  ChampionFinalSchema,
  ChampionListResponseSchema,
  ChampionSchema,
} from './champion.types';
import { CHAMPION_FINALS_RESPONSE_FIXTURE } from '@/test/fixtures/championFinals.fixture';

const validChampion = {
  team: { code: 'BRA', name: 'Brasil' },
  wins: 5,
  years: [1958, 1962, 1970, 1994, 2002],
  confederationCode: 'CONMEBOL',
};

const validResponse = {
  data: [validChampion],
  pagination: {
    page: 1,
    size: 15,
    totalElements: 8,
    totalPages: 1,
    hasNext: false,
    hasPrevious: false,
  },
};

describe('champion schemas', () => {
  it('parses the paginated champions API contract', () => {
    expect(ChampionSchema.parse(validChampion)).toEqual(validChampion);
    expect(ChampionListResponseSchema.parse(validResponse)).toEqual(validResponse);
  });

  it('throws when champion data is invalid', () => {
    expect(() =>
      ChampionSchema.parse({
        ...validChampion,
        team: { code: 'BRA', name: 10 },
      }),
    ).toThrow(ZodError);
  });

  it('throws when pagination metadata is invalid', () => {
    expect(() =>
      ChampionListResponseSchema.parse({
        ...validResponse,
        pagination: { ...validResponse.pagination, hasNext: 'false' },
      }),
    ).toThrow(ZodError);
  });

  it('parses finals with multiple hosts and nullable match fields', () => {
    expect(ChampionFinalListResponseSchema.parse(CHAMPION_FINALS_RESPONSE_FIXTURE)).toEqual(
      CHAMPION_FINALS_RESPONSE_FIXTURE,
    );

    const finalWithMissingData = {
      ...CHAMPION_FINALS_RESPONSE_FIXTURE.data[0],
      hostCodes: [],
      matchDate: null,
      matchTime: null,
      homeTeamScore: null,
      awayTeamScore: null,
    };

    expect(ChampionFinalSchema.parse(finalWithMissingData)).toEqual(finalWithMissingData);
  });

  it('throws when a champion final has an invalid nullable field', () => {
    expect(() =>
      ChampionFinalSchema.parse({
        ...CHAMPION_FINALS_RESPONSE_FIXTURE.data[0],
        homeTeamScore: '3',
      }),
    ).toThrow(ZodError);
  });
});
