import { describe, expect, it } from 'vitest';
import { ZodError } from 'zod';
import {
  ChampionshipStadiumListResponseSchema,
  ChampionshipStadiumListSchema,
  ChampionshipStadiumSchema,
} from './stadium.types';

const validStadium = {
  id: 1,
  name: 'Lusail Stadium',
  cityName: 'Lusail',
  country: { code: 'QAT', name: 'Qatar' },
  capacity: 88966,
  matchesPlayed: 10,
};

describe('stadium schemas', () => {
  it('parses valid stadium payloads', () => {
    expect(ChampionshipStadiumSchema.parse(validStadium)).toEqual(validStadium);
    expect(ChampionshipStadiumSchema.parse({ ...validStadium, country: null }).country).toBeNull();
    expect(ChampionshipStadiumListSchema.parse([validStadium])).toEqual([validStadium]);
    expect(
      ChampionshipStadiumListResponseSchema.parse({
        data: [validStadium],
        pagination: {
          page: 1,
          size: 100,
          totalElements: 1,
          totalPages: 1,
          hasNext: false,
          hasPrevious: false,
        },
      }).data,
    ).toEqual([validStadium]);
  });

  it('throws when stadium payloads are invalid', () => {
    expect(() => ChampionshipStadiumSchema.parse({ ...validStadium, cityName: null })).toThrow(
      ZodError,
    );
    expect(() =>
      ChampionshipStadiumListResponseSchema.parse({
        data: [{ ...validStadium, matchesPlayed: '10' }],
        pagination: {
          page: 1,
          size: 100,
          totalElements: 1,
          totalPages: 1,
          hasNext: false,
          hasPrevious: false,
        },
      }),
    ).toThrow(ZodError);
  });
});
