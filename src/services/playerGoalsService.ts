import { api } from '@/services/api';
import type { SupportedLanguage } from '@/store/ui.store';
import {
  PlayerGoalListResponseSchema,
  type PlayerGoalListResponse,
} from '@/types/scorer.types';

export const PLAYER_GOALS_PAGE_SIZE = 100;

const getPlayerGoalsPage = async (
  playerId: number,
  year: number,
  page: number,
  language: SupportedLanguage,
): Promise<PlayerGoalListResponse> => {
  const { data } = await api.get(`/api/players/${playerId}/goals`, {
    params: { year, page, size: PLAYER_GOALS_PAGE_SIZE },
    headers: { 'Accept-Language': language },
  });

  return PlayerGoalListResponseSchema.parse(data);
};

export const getPlayerGoals = async (
  playerId: number,
  year: number,
  language: SupportedLanguage = 'es',
): Promise<PlayerGoalListResponse> => {
  const firstPage = await getPlayerGoalsPage(playerId, year, 1, language);
  const goals = [...firstPage.data];

  for (let page = 2; page <= firstPage.pagination.totalPages; page += 1) {
    const response = await getPlayerGoalsPage(playerId, year, page, language);
    goals.push(...response.data);
  }

  return {
    data: goals,
    pagination: {
      ...firstPage.pagination,
      page: 1,
      size: PLAYER_GOALS_PAGE_SIZE,
      totalElements: goals.length,
      totalPages: goals.length > 0 ? 1 : 0,
      hasNext: false,
      hasPrevious: false,
    },
  };
};
