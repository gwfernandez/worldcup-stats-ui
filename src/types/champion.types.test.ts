import { describe, expect, it } from 'vitest';
import { ZodError } from 'zod';
import { ChampionListResponseSchema, ChampionSchema } from './champion.types';

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
});
