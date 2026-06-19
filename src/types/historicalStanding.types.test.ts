import { describe, expect, it } from 'vitest';
import { ZodError } from 'zod';
import {
  HistoricalStandingListResponseSchema,
  HistoricalStandingListSchema,
  HistoricalStandingSchema,
} from './historicalStanding.types';

const validHistoricalStanding = {
  team: {
    code: 'BRA',
    name: 'Brasil',
  },
  confederationCode: 'CONMEBOL',
  matchesPlayed: 114,
  wins: 79,
  draws: 14,
  losses: 21,
  goalsFor: 237,
  goalsAgainst: 108,
  goalDifference: 129,
  points: 193,
  unifiedPoints: 237,
  position: 1,
  unifiedPosition: 1,
};

const validResponse = {
  data: [validHistoricalStanding],
  pagination: {
    page: 1,
    size: 100,
    totalElements: 1,
    totalPages: 1,
    hasNext: false,
    hasPrevious: false,
  },
};

describe('historical standing schemas', () => {
  it('parses valid historical standing payloads', () => {
    expect(HistoricalStandingSchema.parse(validHistoricalStanding)).toEqual(
      validHistoricalStanding,
    );
    expect(HistoricalStandingListSchema.parse([validHistoricalStanding])).toEqual([
      validHistoricalStanding,
    ]);
    expect(HistoricalStandingListResponseSchema.parse(validResponse)).toEqual(validResponse);
  });

  it('throws when historical standing payloads are invalid', () => {
    expect(() =>
      HistoricalStandingSchema.parse({ ...validHistoricalStanding, unifiedPosition: '1' }),
    ).toThrow(ZodError);
    expect(() =>
      HistoricalStandingSchema.parse({
        ...validHistoricalStanding,
        team: { ...validHistoricalStanding.team, name: undefined },
      }),
    ).toThrow(ZodError);
    expect(() =>
      HistoricalStandingListResponseSchema.parse({
        ...validResponse,
        pagination: { ...validResponse.pagination, hasNext: 'false' },
      }),
    ).toThrow(ZodError);
  });
});
