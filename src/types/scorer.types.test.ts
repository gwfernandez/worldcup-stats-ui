import { describe, expect, it } from 'vitest';
import { ZodError } from 'zod';
import {
  PlayerGoalListResponseSchema,
  PlayerGoalSchema,
  ScorerListResponseSchema,
  ScorerListSchema,
  ScorerSchema,
} from './scorer.types';

const validScorer = {
  playerId: 1,
  fullName: 'Lionel Messi',
  team: { code: 'ARG', name: 'Argentina' },
  goals: 7,
};

const validResponse = {
  data: [validScorer],
  pagination: {
    page: 1,
    size: 10,
    totalElements: 1,
    totalPages: 1,
    hasNext: false,
    hasPrevious: false,
  },
};

const validPlayerGoal = {
  year: 2022,
  hosts: [{ code: 'QAT', name: 'Catar' }],
  matchDate: '2022-12-18',
  opponentTeam: { code: 'FRA', name: 'Francia' },
  minuteRegular: 23,
  penalty: true,
  stage: 'final',
};

const validPlayerGoalsResponse = {
  data: [validPlayerGoal],
  pagination: {
    page: 1,
    size: 100,
    totalElements: 1,
    totalPages: 1,
    hasNext: false,
    hasPrevious: false,
  },
};

describe('scorer schemas', () => {
  it('parses valid scorer payloads', () => {
    expect(ScorerSchema.parse(validScorer)).toEqual(validScorer);
    expect(ScorerListSchema.parse([validScorer])).toEqual([validScorer]);
    expect(ScorerListResponseSchema.parse(validResponse)).toEqual(validResponse);
    expect(PlayerGoalSchema.parse(validPlayerGoal)).toEqual(validPlayerGoal);
    expect(PlayerGoalListResponseSchema.parse(validPlayerGoalsResponse)).toEqual(
      validPlayerGoalsResponse,
    );
  });

  it('throws when scorer payloads are invalid', () => {
    expect(() => ScorerSchema.parse({ ...validScorer, goals: '7' })).toThrow(ZodError);
    expect(() => PlayerGoalSchema.parse({ ...validPlayerGoal, matchDate: 20221218 })).toThrow(
      ZodError,
    );
    expect(() =>
      ScorerListResponseSchema.parse({
        ...validResponse,
        pagination: { ...validResponse.pagination, hasNext: 'false' },
      }),
    ).toThrow(ZodError);
  });
});
