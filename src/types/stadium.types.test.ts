import { describe, expect, it } from 'vitest';
import { ZodError } from 'zod';
import {
  ChampionshipStadiumMatchListResponseSchema,
  ChampionshipStadiumMatchListSchema,
  ChampionshipStadiumMatchSchema,
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

const validStadiumMatch = {
  year: 1930,
  hosts: [{ code: 'URY', name: 'Uruguay' }],
  stage: 'final',
  groupCode: null,
  matchDate: '1930-07-30',
  matchTime: '15:30:00',
  homeTeam: { code: 'URY', name: 'Uruguay' },
  homeTeamScore: 4,
  homeTeamScorePenalties: null,
  awayTeam: { code: 'ARG', name: 'Argentina' },
  awayTeamScore: 2,
  awayTeamScorePenalties: null,
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

  it('parses valid stadium match payloads with nullable API fields', () => {
    expect(ChampionshipStadiumMatchSchema.parse(validStadiumMatch)).toEqual(validStadiumMatch);
    expect(
      ChampionshipStadiumMatchSchema.parse({
        ...validStadiumMatch,
        stage: null,
        matchDate: null,
        matchTime: null,
        homeTeamScore: null,
        awayTeamScore: null,
      }).matchDate,
    ).toBeNull();
    expect(ChampionshipStadiumMatchListSchema.parse([validStadiumMatch])).toEqual([
      validStadiumMatch,
    ]);
    expect(
      ChampionshipStadiumMatchListResponseSchema.parse({
        data: [validStadiumMatch],
        pagination: {
          page: 1,
          size: 100,
          totalElements: 1,
          totalPages: 1,
          hasNext: false,
          hasPrevious: false,
        },
      }).data,
    ).toEqual([validStadiumMatch]);
  });

  it('throws when stadium match payloads are invalid', () => {
    expect(() =>
      ChampionshipStadiumMatchSchema.parse({
        ...validStadiumMatch,
        homeTeam: { code: 'URY' },
      }),
    ).toThrow(ZodError);
    expect(() =>
      ChampionshipStadiumMatchListResponseSchema.parse({
        data: [{ ...validStadiumMatch, homeTeamScorePenalties: '4' }],
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
