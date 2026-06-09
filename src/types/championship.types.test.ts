import { describe, expect, it } from 'vitest';
import { ZodError } from 'zod';
import {
  ChampionshipListSchema,
  ChampionshipSchema,
  EliminationPhaseListSchema,
  EliminationPhaseSchema,
  GoalSchema,
  GroupListSchema,
  GroupSchema,
  GroupStandingSchema,
  MatchSchema,
} from './championship.types';

const validChampionship = {
  id: 1,
  year: 2022,
  country: 'Qatar',
  countryCode: 'QA',
  champion: 'Argentina',
  championCode: 'AR',
  runnerUp: 'France',
  topScorer: 'Kylian Mbappe',
  topScorerGoals: 8,
  totalTeams: 32,
  totalMatches: 64,
  startDate: '2022-11-20',
  endDate: '2022-12-18',
};

const validGoal = {
  id: 1,
  minute: 23,
  playerName: 'Lionel Messi',
  teamCode: 'AR',
  type: 'penalty',
};

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
  goals: [validGoal],
};

const validGroupStanding = {
  position: 1,
  teamName: 'Argentina',
  teamCode: 'AR',
  qualified: true,
  played: 3,
  won: 2,
  drawn: 0,
  lost: 1,
  goalsFor: 5,
  goalsAgainst: 2,
  goalDiff: 3,
  points: 6,
};

const validGroup = {
  id: 1,
  name: 'Group C',
  standings: [validGroupStanding],
  matches: [validMatch],
};

const validEliminationPhase = {
  id: 1,
  name: 'Final',
  order: 7,
  isFinal: true,
  matches: [validMatch],
};

describe('championship schemas', () => {
  it('parses valid championship payloads', () => {
    expect(ChampionshipSchema.parse(validChampionship)).toEqual(validChampionship);
    expect(ChampionshipListSchema.parse([validChampionship])).toEqual([validChampionship]);
  });

  it('throws when a championship payload has invalid fields', () => {
    expect(() => ChampionshipSchema.parse({ ...validChampionship, year: '2022' })).toThrow(ZodError);
    expect(() => ChampionshipSchema.parse({ ...validChampionship, country: undefined })).toThrow(ZodError);
  });

  it('parses valid match and goal payloads', () => {
    expect(GoalSchema.parse(validGoal)).toEqual(validGoal);
    expect(MatchSchema.parse(validMatch)).toEqual(validMatch);
  });

  it('throws when match and goal payloads are invalid', () => {
    expect(() => GoalSchema.parse({ ...validGoal, type: 'free_kick' })).toThrow(ZodError);
    expect(() => MatchSchema.parse({ ...validMatch, goals: [{ ...validGoal, minute: '23' }] })).toThrow(
      ZodError,
    );
  });

  it('parses valid group payloads', () => {
    expect(GroupStandingSchema.parse(validGroupStanding)).toEqual(validGroupStanding);
    expect(GroupSchema.parse(validGroup)).toEqual(validGroup);
    expect(GroupListSchema.parse([validGroup])).toEqual([validGroup]);
  });

  it('throws when group payloads are invalid', () => {
    expect(() => GroupStandingSchema.parse({ ...validGroupStanding, qualified: 'yes' })).toThrow(ZodError);
    expect(() => GroupSchema.parse({ ...validGroup, matches: [{ ...validMatch, id: '1' }] })).toThrow(
      ZodError,
    );
  });

  it('parses valid elimination phase payloads', () => {
    expect(EliminationPhaseSchema.parse(validEliminationPhase)).toEqual(validEliminationPhase);
    expect(EliminationPhaseListSchema.parse([validEliminationPhase])).toEqual([validEliminationPhase]);
  });

  it('throws when an elimination phase payload is invalid', () => {
    expect(() => EliminationPhaseSchema.parse({ ...validEliminationPhase, isFinal: 'true' })).toThrow(
      ZodError,
    );
  });
});
