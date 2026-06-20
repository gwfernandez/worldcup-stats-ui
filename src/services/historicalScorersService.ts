import { api } from '@/services/api';
import {
  HistoricalScorerListResponseSchema,
  type HistoricalScorerListResponse,
} from '@/types/historicalScorer.types';
import type { SupportedLanguage } from '@/store/ui.store';

export const HISTORICAL_SCORERS_PAGE_SIZE = 10;

export interface HistoricalScorersFilters {
  name?: string;
  teamCode?: string;
  confederationCode?: string;
}

export const getHistoricalScorers = async (
  page = 1,
  filters: HistoricalScorersFilters = {},
  language: SupportedLanguage = 'es',
): Promise<HistoricalScorerListResponse> => {
  const { data } = await api.get('/api/scorers', {
    params: {
      page,
      size: HISTORICAL_SCORERS_PAGE_SIZE,
      ...(filters.name ? { name: filters.name } : {}),
      ...(filters.teamCode ? { teamCode: filters.teamCode } : {}),
      ...(filters.confederationCode
        ? { confederationCode: filters.confederationCode }
        : {}),
    },
    headers: { 'Accept-Language': language },
  });

  return HistoricalScorerListResponseSchema.parse(data);
};
