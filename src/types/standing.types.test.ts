import { describe, expect, it } from 'vitest';
import { ZodError } from 'zod';
import { StandingListResponseSchema, StandingListSchema, StandingSchema } from './standing.types';

const validStanding = {
  team: { code: 'ARG', name: 'Argentina' },
  groupCode: 'C',
  matchesPlayed: 7,
  wins: 4,
  draws: 2,
  losses: 1,
  goalsFor: 15,
  goalsAgainst: 8,
  goalDifference: 7,
  points: 14,
  unifiedPoints: 14,
  position: 1,
  performance: 'champion',
};

const validResponse = {
  data: [validStanding],
  pagination: {
    page: 1,
    size: 100,
    totalElements: 1,
    totalPages: 1,
    hasNext: false,
    hasPrevious: false,
  },
};

describe('standing schemas', () => {
  it('parses valid standing payloads', () => {
    expect(StandingSchema.parse(validStanding)).toEqual(validStanding);
    expect(StandingListSchema.parse([validStanding])).toEqual([validStanding]);
    expect(StandingListResponseSchema.parse(validResponse)).toEqual(validResponse);
  });

  it('parses backend performance values', () => {
    expect(StandingSchema.parse({ ...validStanding, performance: 'third_place' }).performance).toBe(
      'third_place',
    );
    expect(
      StandingSchema.parse({ ...validStanding, performance: 'fourth_place' }).performance,
    ).toBe('fourth_place');
    expect(
      StandingSchema.parse({ ...validStanding, performance: 'quarterfinal' }).performance,
    ).toBe('quarterfinal');
  });

  it('throws when standing payloads are invalid', () => {
    expect(() => StandingSchema.parse({ ...validStanding, team: null })).toThrow(ZodError);
    expect(() => StandingSchema.parse({ ...validStanding, matchesPlayed: '7' })).toThrow(ZodError);
    expect(() =>
      StandingListResponseSchema.parse({
        ...validResponse,
        pagination: { ...validResponse.pagination, hasNext: 'false' },
      }),
    ).toThrow(ZodError);
  });
});
