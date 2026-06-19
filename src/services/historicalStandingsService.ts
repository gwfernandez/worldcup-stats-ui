import { api } from '@/services/api';
import {
  HistoricalStandingListResponseSchema,
  type HistoricalStandingList,
  type HistoricalStandingListResponse,
} from '@/types/historicalStanding.types';
import type { SupportedLanguage } from '@/store/ui.store';

export const HISTORICAL_STANDINGS_PAGE_SIZE = 100;

export interface HistoricalStandingsFilters {
  name?: string;
  confederationCode?: string;
}

/**
 * Obtiene la tabla de posiciones histórica desde la API.
 * Recorre todas las páginas para que la UI pueda mostrar el listado completo.
 */
export const getHistoricalStandings = async (
  filters: HistoricalStandingsFilters = {},
  language: SupportedLanguage = 'es',
): Promise<HistoricalStandingList> => {
  const params = {
    page: 1,
    size: HISTORICAL_STANDINGS_PAGE_SIZE,
    ...(filters.name ? { name: filters.name } : {}),
    ...(filters.confederationCode ? { confederationCode: filters.confederationCode } : {}),
  };

  const { data } = await api.get('/api/standings', {
    params,
    headers: { 'Accept-Language': language },
  });
  const firstPage = HistoricalStandingListResponseSchema.parse(data);

  if (firstPage.pagination.totalPages <= 1) {
    return firstPage.data;
  }

  const remainingRequests = Array.from(
    { length: firstPage.pagination.totalPages - 1 },
    (_, index) =>
      api.get('/api/standings', {
        params: { ...params, page: index + 2 },
        headers: { 'Accept-Language': language },
      }),
  );
  const remainingResponses = await Promise.all(remainingRequests);
  const remainingPages: HistoricalStandingListResponse[] = remainingResponses.map((response) =>
    HistoricalStandingListResponseSchema.parse(response.data),
  );

  return [firstPage, ...remainingPages].flatMap((page) => page.data);
};
