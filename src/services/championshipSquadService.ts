import { api } from '@/services/api';
import type { SupportedLanguage } from '@/store/ui.store';
import {
  ChampionshipSquadResponseSchema,
  type ChampionshipSquadPlayerList,
  type ChampionshipSquadResponse,
} from '@/types/team.types';

export const CHAMPIONSHIP_SQUAD_PAGE_SIZE = 100;

const getChampionshipSquadPage = async (
  year: number,
  teamCode: string,
  page: number,
  language: SupportedLanguage,
): Promise<ChampionshipSquadResponse> => {
  const { data } = await api.get(`/api/championships/${year}/squads/${teamCode}`, {
    params: { page, size: CHAMPIONSHIP_SQUAD_PAGE_SIZE },
    headers: { 'Accept-Language': language },
  });

  return ChampionshipSquadResponseSchema.parse(data);
};

export const getChampionshipSquad = async (
  year: number,
  teamCode: string,
  language: SupportedLanguage = 'es',
): Promise<ChampionshipSquadPlayerList> => {
  const firstPage = await getChampionshipSquadPage(year, teamCode, 1, language);
  const players = [...firstPage.data];

  for (let page = 2; page <= firstPage.pagination.totalPages; page += 1) {
    const response = await getChampionshipSquadPage(year, teamCode, page, language);
    players.push(...response.data);
  }

  return players;
};
