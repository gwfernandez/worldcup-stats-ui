import { describe, expect, it } from 'vitest';
import { ZodError } from 'zod';
import { MatchResultSchema, StandingListSchema, StandingSchema } from './standing.types';

const validStanding = {
  position: 1,
  teamName: 'Argentina',
  teamCode: 'AR',
  isHost: false,
  performance: 'champion',
  played: 7,
  won: 4,
  drawn: 2,
  lost: 1,
  goalsFor: 15,
  goalsAgainst: 8,
  goalDiff: 7,
  points: 14,
  form: ['W', 'W', 'D'],
};

describe('standing schemas', () => {
  it('parses valid standing payloads', () => {
    expect(MatchResultSchema.parse('W')).toBe('W');
    expect(StandingSchema.parse(validStanding)).toEqual(validStanding);
    expect(StandingListSchema.parse([validStanding])).toEqual([validStanding]);
  });

  it('throws when standing payloads are invalid', () => {
    expect(() => MatchResultSchema.parse('P')).toThrow(ZodError);
    expect(() => StandingSchema.parse({ ...validStanding, isHost: 'false' })).toThrow(ZodError);
    expect(() => StandingSchema.parse({ ...validStanding, form: ['W', 'P'] })).toThrow(ZodError);
  });
});
