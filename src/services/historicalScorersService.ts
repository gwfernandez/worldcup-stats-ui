import { api } from '@/services/api';
import {
  HistoricalScorerDetailSchema,
  HistoricalScorerListResponseSchema,
  type HistoricalScorerDetail,
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
      ...(filters.confederationCode ? { confederationCode: filters.confederationCode } : {}),
    },
    headers: { 'Accept-Language': language },
  });

  return HistoricalScorerListResponseSchema.parse(data);
};

export const getHistoricalScorerDetail = async (
  playerId: number,
  language: SupportedLanguage = 'es',
): Promise<HistoricalScorerDetail> => {
  const { data } = await api.get(`/api/scorers/${playerId}`, {
    headers: { 'Accept-Language': language },
  });

  return HistoricalScorerDetailSchema.parse(data);
};
