import { describe, expect, it } from 'vitest';
import { ZodError } from 'zod';
import { ChampionTeamListSchema, ChampionTeamSchema, ChampionWinnerSchema } from './champion.types';

const validWinner = {
  year: 2022,
  host: 'Qatar',
  hostCode: 'QA',
  finalScore: '3-3 (pen)',
  finalOpponent: 'France',
  finalOpponentCode: 'FR',
};

const validChampionTeam = {
  position: 1,
  teamName: 'Brazil',
  teamCode: 'BR',
  confederation: 'CONMEBOL',
  titles: 5,
  championships: [validWinner],
};

describe('champion schemas', () => {
  it('parses valid champion payloads', () => {
    expect(ChampionWinnerSchema.parse(validWinner)).toEqual(validWinner);
    expect(ChampionTeamSchema.parse(validChampionTeam)).toEqual(validChampionTeam);
    expect(ChampionTeamListSchema.parse([validChampionTeam])).toEqual([validChampionTeam]);
  });

  it('throws when champion payloads are invalid', () => {
    expect(() => ChampionWinnerSchema.parse({ ...validWinner, year: '2022' })).toThrow(ZodError);
    expect(() => ChampionTeamSchema.parse({ ...validChampionTeam, championships: [{ ...validWinner, hostCode: 1 }] }))
      .toThrow(ZodError);
  });
});
