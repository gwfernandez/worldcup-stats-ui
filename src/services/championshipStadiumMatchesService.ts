import { api } from '@/services/api';
import type { SupportedLanguage } from '@/store/ui.store';
import {
  ChampionshipStadiumMatchListResponseSchema,
  type ChampionshipStadiumMatchList,
  type ChampionshipStadiumMatchListResponse,
} from '@/types/stadium.types';

export const CHAMPIONSHIP_STADIUM_MATCHES_PAGE_SIZE = 100;

const getChampionshipStadiumMatchesPage = async (
  year: number,
  stadiumId: number,
  page: number,
  language: SupportedLanguage,
): Promise<ChampionshipStadiumMatchListResponse> => {
  const { data } = await api.get(`/api/championships/${year}/stadiums/${stadiumId}`, {
    params: { page, size: CHAMPIONSHIP_STADIUM_MATCHES_PAGE_SIZE },
    headers: { 'Accept-Language': language },
  });

  return ChampionshipStadiumMatchListResponseSchema.parse(data);
};

export const getChampionshipStadiumMatches = async (
  year: number,
  stadiumId: number,
  language: SupportedLanguage = 'es',
): Promise<ChampionshipStadiumMatchList> => {
  const firstPage = await getChampionshipStadiumMatchesPage(year, stadiumId, 1, language);
  const matches = [...firstPage.data];

  for (let page = 2; page <= firstPage.pagination.totalPages; page += 1) {
    const response = await getChampionshipStadiumMatchesPage(year, stadiumId, page, language);
    matches.push(...response.data);
  }

  return matches;
};
