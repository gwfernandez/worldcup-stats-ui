import { api } from '@/services/api';
import {
  NationalTeamListResponseSchema,
  type NationalTeamList,
  type NationalTeamListResponse,
} from '@/types/team.types';
import type { SupportedLanguage } from '@/store/ui.store';

export const TEAMS_PAGE_SIZE = 100;

export const getTeams = async (
  language: SupportedLanguage = 'es',
): Promise<NationalTeamList> => {
  const requestPage = async (page: number): Promise<NationalTeamListResponse> => {
    const { data } = await api.get('/api/teams', {
      params: {
        page,
        size: TEAMS_PAGE_SIZE,
        includeDissolved: true,
      },
      headers: { 'Accept-Language': language },
    });

    return NationalTeamListResponseSchema.parse(data);
  };

  const firstPage = await requestPage(1);

  if (firstPage.pagination.totalPages <= 1) {
    return firstPage.data;
  }

  const remainingPages = await Promise.all(
    Array.from({ length: firstPage.pagination.totalPages - 1 }, (_, index) =>
      requestPage(index + 2),
    ),
  );

  return [firstPage, ...remainingPages].flatMap((page) => page.data);
};
