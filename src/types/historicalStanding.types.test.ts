import { describe, expect, it } from 'vitest';
import { ZodError } from 'zod';
import { HistoricalStandingListSchema, HistoricalStandingSchema } from './historicalStanding.types';

const validHistoricalStanding = {
  position: 1,
  teamName: 'Brazil',
  teamCode: 'BR',
  confederation: 'CONMEBOL',
  points: 247,
  played: 114,
  won: 76,
  drawn: 19,
  lost: 19,
  goalsFor: 237,
  goalsAgainst: 108,
  goalDiff: 129,
};

describe('historical standing schemas', () => {
  it('parses valid historical standing payloads', () => {
    expect(HistoricalStandingSchema.parse(validHistoricalStanding)).toEqual(validHistoricalStanding);
    expect(HistoricalStandingListSchema.parse([validHistoricalStanding])).toEqual([validHistoricalStanding]);
  });

  it('throws when historical standing payloads are invalid', () => {
    expect(() => HistoricalStandingSchema.parse({ ...validHistoricalStanding, position: '1' })).toThrow(ZodError);
    expect(() => HistoricalStandingSchema.parse({ ...validHistoricalStanding, teamName: undefined })).toThrow(
      ZodError,
    );
  });
});
