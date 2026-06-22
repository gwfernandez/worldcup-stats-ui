import { api } from '@/services/api';
import type { SupportedLanguage } from '@/store/ui.store';
import {
  ChampionshipTeamListResponseSchema,
  type ChampionshipTeamList,
  type ChampionshipTeamListResponse,
} from '@/types/team.types';

export const CHAMPIONSHIP_TEAMS_PAGE_SIZE = 100;

const getChampionshipTeamsPage = async (
  year: number,
  page: number,
  language: SupportedLanguage,
): Promise<ChampionshipTeamListResponse> => {
  const { data } = await api.get(`/api/championships/${year}/teams`, {
    params: { page, size: CHAMPIONSHIP_TEAMS_PAGE_SIZE },
    headers: { 'Accept-Language': language },
  });

  return ChampionshipTeamListResponseSchema.parse(data);
};

export const getChampionshipTeams = async (
  year: number,
  language: SupportedLanguage = 'es',
): Promise<ChampionshipTeamList> => {
  const firstPage = await getChampionshipTeamsPage(year, 1, language);
  const teams = [...firstPage.data];

  for (let page = 2; page <= firstPage.pagination.totalPages; page += 1) {
    const response = await getChampionshipTeamsPage(year, page, language);
    teams.push(...response.data);
  }

  return teams;
};
