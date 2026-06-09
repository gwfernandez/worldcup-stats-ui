import { describe, expect, it } from 'vitest';
import { ZodError } from 'zod';
import {
  HistoricalScorerListSchema,
  HistoricalScorerSchema,
  ScorerWorldCupDetailSchema,
} from './historicalScorer.types';

const validWorldCupDetail = {
  year: 2022,
  host: 'Qatar',
  hostCode: 'QA',
  goals: 7,
  matches: 7,
  average: 1,
  medal: 'gold',
  performance: 'Campeon',
};

const validHistoricalScorer = {
  id: 1,
  playerName: 'Lionel Messi',
  teamName: 'Argentina',
  teamCode: 'AR',
  confederation: 'CONMEBOL',
  totalGoals: 13,
  totalMatches: 26,
  average: 0.5,
  worldCups: [validWorldCupDetail],
};

describe('historical scorer schemas', () => {
  it('parses valid historical scorer payloads', () => {
    expect(ScorerWorldCupDetailSchema.parse(validWorldCupDetail)).toEqual(validWorldCupDetail);
    expect(ScorerWorldCupDetailSchema.parse({ ...validWorldCupDetail, medal: null }).medal).toBeNull();
    expect(HistoricalScorerSchema.parse(validHistoricalScorer)).toEqual(validHistoricalScorer);
    expect(HistoricalScorerListSchema.parse([validHistoricalScorer])).toEqual([validHistoricalScorer]);
  });

  it('throws when historical scorer payloads are invalid', () => {
    expect(() => ScorerWorldCupDetailSchema.parse({ ...validWorldCupDetail, medal: 'platinum' })).toThrow(ZodError);
    expect(() => HistoricalScorerSchema.parse({ ...validHistoricalScorer, totalMatches: '26' })).toThrow(ZodError);
  });
});
