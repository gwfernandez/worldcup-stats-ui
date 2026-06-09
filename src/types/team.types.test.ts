import { describe, expect, it } from 'vitest';
import { ZodError } from 'zod';
import {
  PlayerPositionSchema,
  PlayerSchema,
  TeamListSchema,
  TeamPerformanceSchema,
  TeamSchema,
} from './team.types';

const validPlayer = {
  id: 10,
  number: 10,
  firstName: 'Lionel',
  lastName: 'Messi',
  position: 'forward',
};

const validTeam = {
  id: 1,
  name: 'Argentina',
  teamCode: 'AR',
  confederation: 'CONMEBOL',
  group: 'C',
  coach: 'Lionel Scaloni',
  performance: 'champion',
  players: [validPlayer],
};

describe('team schemas', () => {
  it('parses valid enum values', () => {
    expect(PlayerPositionSchema.parse('goalkeeper')).toBe('goalkeeper');
    expect(TeamPerformanceSchema.parse('round_of_16')).toBe('round_of_16');
  });

  it('throws when enum values are invalid', () => {
    expect(() => PlayerPositionSchema.parse('winger')).toThrow(ZodError);
    expect(() => TeamPerformanceSchema.parse('semifinal')).toThrow(ZodError);
  });

  it('parses valid player and team payloads', () => {
    expect(PlayerSchema.parse(validPlayer)).toEqual(validPlayer);
    expect(TeamSchema.parse(validTeam)).toEqual(validTeam);
    expect(TeamListSchema.parse([validTeam])).toEqual([validTeam]);
  });

  it('throws when player and team payloads are invalid', () => {
    expect(() => PlayerSchema.parse({ ...validPlayer, number: '10' })).toThrow(ZodError);
    expect(() => TeamSchema.parse({ ...validTeam, players: [{ ...validPlayer, position: 'winger' }] })).toThrow(
      ZodError,
    );
  });
});
