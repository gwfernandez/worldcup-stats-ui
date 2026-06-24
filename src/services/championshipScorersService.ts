import { api } from '@/services/api';
import type { SupportedLanguage } from '@/store/ui.store';
import { ScorerListResponseSchema, type ScorerListResponse } from '@/types/scorer.types';

export const CHAMPIONSHIP_SCORERS_PAGE_SIZE = 10;

export interface ChampionshipScorersFilters {
  name?: string;
  teamCode?: string;
}

export const getChampionshipScorers = async (
  year: number,
  page = 1,
  filters: ChampionshipScorersFilters = {},
  language: SupportedLanguage = 'es',
): Promise<ScorerListResponse> => {
  const { data } = await api.get(`/api/championships/${year}/scorers`, {
    params: {
      page,
      size: CHAMPIONSHIP_SCORERS_PAGE_SIZE,
      ...(filters.name ? { name: filters.name } : {}),
      ...(filters.teamCode ? { teamCode: filters.teamCode } : {}),
    },
    headers: { 'Accept-Language': language },
  });

  return ScorerListResponseSchema.parse(data);
};
