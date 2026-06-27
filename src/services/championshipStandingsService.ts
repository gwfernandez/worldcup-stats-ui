import { api } from '@/services/api';
import type { SupportedLanguage } from '@/store/ui.store';
import {
  StandingListResponseSchema,
  type StandingList,
  type StandingListResponse,
} from '@/types/standing.types';

export const CHAMPIONSHIP_STANDINGS_PAGE_SIZE = 100;

const getChampionshipStandingsPage = async (
  year: number,
  page: number,
  language: SupportedLanguage,
): Promise<StandingListResponse> => {
  const { data } = await api.get(`/api/championships/${year}/standings`, {
    params: { page, size: CHAMPIONSHIP_STANDINGS_PAGE_SIZE },
    headers: { 'Accept-Language': language },
  });

  return StandingListResponseSchema.parse(data);
};

export const getChampionshipStandings = async (
  year: number,
  language: SupportedLanguage = 'es',
): Promise<StandingList> => {
  const firstPage = await getChampionshipStandingsPage(year, 1, language);
  const standings = [...firstPage.data];

  for (let page = 2; page <= firstPage.pagination.totalPages; page += 1) {
    const response = await getChampionshipStandingsPage(year, page, language);
    standings.push(...response.data);
  }

  return standings;
};
