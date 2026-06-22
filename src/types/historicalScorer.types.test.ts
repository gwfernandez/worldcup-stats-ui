import { describe, expect, it } from 'vitest';
import { ZodError } from 'zod';
import {
  HistoricalScorerDetailSchema,
  HistoricalScorerListResponseSchema,
  HistoricalScorerSchema,
} from './historicalScorer.types';
import { HISTORICAL_SCORERS_RESPONSE_FIXTURE } from '@/test/fixtures/historicalScorers.fixture';
import { HISTORICAL_SCORER_DETAIL_FIXTURE } from '@/test/fixtures/historicalScorerDetail.fixture';

describe('historical scorer schemas', () => {
  it('parses paginated scorer responses', () => {
    expect(HistoricalScorerListResponseSchema.parse(HISTORICAL_SCORERS_RESPONSE_FIXTURE)).toEqual(
      HISTORICAL_SCORERS_RESPONSE_FIXTURE,
    );
  });

  it('parses an empty response', () => {
    const response = {
      data: [],
      pagination: {
        page: 1,
        size: 10,
        totalElements: 0,
        totalPages: 0,
        hasNext: false,
        hasPrevious: false,
      },
    };

    expect(HistoricalScorerListResponseSchema.parse(response)).toEqual(response);
  });

  it('parses scorer details with nullable goal fields and multiple teams', () => {
    expect(HistoricalScorerDetailSchema.parse(HISTORICAL_SCORER_DETAIL_FIXTURE)).toEqual(
      HISTORICAL_SCORER_DETAIL_FIXTURE,
    );
  });

  it('throws when scorer payloads are invalid', () => {
    expect(() =>
      HistoricalScorerSchema.parse({
        ...HISTORICAL_SCORERS_RESPONSE_FIXTURE.data[0],
        goals: '16',
      }),
    ).toThrow(ZodError);
    expect(() =>
      HistoricalScorerListResponseSchema.parse({
        ...HISTORICAL_SCORERS_RESPONSE_FIXTURE,
        pagination: { ...HISTORICAL_SCORERS_RESPONSE_FIXTURE.pagination, hasNext: 'false' },
      }),
    ).toThrow(ZodError);
    expect(() =>
      HistoricalScorerDetailSchema.parse({
        ...HISTORICAL_SCORER_DETAIL_FIXTURE,
        championships: ['2022'],
      }),
    ).toThrow(ZodError);
  });
});
