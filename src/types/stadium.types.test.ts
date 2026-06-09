import { describe, expect, it } from 'vitest';
import { ZodError } from 'zod';
import { StadiumListSchema, StadiumSchema } from './stadium.types';

const validMatch = {
  id: 1,
  date: '2022-12-18',
  homeTeam: 'Argentina',
  homeTeamCode: 'AR',
  awayTeam: 'France',
  awayTeamCode: 'FR',
  homeScore: 3,
  awayScore: 3,
  stadium: 'Lusail Stadium',
  attendance: 88966,
  phase: 'Final',
  goals: [],
};

const validStadium = {
  id: 1,
  name: 'Lusail Stadium',
  city: 'Lusail',
  capacity: 88966,
  mapsUrl: 'https://maps.example.com/lusail',
  matches: [validMatch],
};

describe('stadium schemas', () => {
  it('parses valid stadium payloads', () => {
    expect(StadiumSchema.parse(validStadium)).toEqual(validStadium);
    expect(StadiumSchema.parse({ ...validStadium, capacity: null, mapsUrl: null }).mapsUrl).toBeNull();
    expect(StadiumListSchema.parse([validStadium])).toEqual([validStadium]);
  });

  it('throws when stadium payloads are invalid', () => {
    expect(() => StadiumSchema.parse({ ...validStadium, mapsUrl: 'not-a-url' })).toThrow(ZodError);
    expect(() => StadiumSchema.parse({ ...validStadium, matches: [{ ...validMatch, homeScore: '3' }] })).toThrow(
      ZodError,
    );
  });
});
