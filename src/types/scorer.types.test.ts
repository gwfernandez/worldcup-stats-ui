import { describe, expect, it } from 'vitest';
import { ZodError } from 'zod';
import { ScorerGoalDetailSchema, ScorerListSchema, ScorerSchema } from './scorer.types';

const validGoalDetail = {
  id: 1,
  date: '2022-12-18',
  minute: 23,
  rivalTeam: 'France',
  rivalTeamCode: 'FR',
  phase: 'Final',
};

const validScorer = {
  id: 1,
  playerName: 'Lionel Messi',
  teamName: 'Argentina',
  teamCode: 'AR',
  totalGoals: 7,
  matchesPlayed: 7,
  average: 1,
  goals: [validGoalDetail],
};

describe('scorer schemas', () => {
  it('parses valid scorer payloads', () => {
    expect(ScorerGoalDetailSchema.parse(validGoalDetail)).toEqual(validGoalDetail);
    expect(ScorerSchema.parse(validScorer)).toEqual(validScorer);
    expect(ScorerListSchema.parse([validScorer])).toEqual([validScorer]);
  });

  it('throws when scorer payloads are invalid', () => {
    expect(() => ScorerGoalDetailSchema.parse({ ...validGoalDetail, minute: '23' })).toThrow(ZodError);
    expect(() => ScorerSchema.parse({ ...validScorer, totalGoals: '7' })).toThrow(ZodError);
  });
});
