import { api } from '@/services/api';
import { env } from '@/config/env';
import { HistoricalStandingListSchema, type HistoricalStandingList } from '@/types/historicalStanding.types';
import { MOCK_HISTORICAL_STANDINGS } from '@/features/historicalStandings/mocks/historicalStandings.mock';

// ─── Service ──────────────────────────────────────────────────────────────────

/**
 * Obtiene la tabla de posiciones histórica desde la API.
 * Usa mock data si VITE_USE_MOCK=true.
 */
export const getHistoricalStandings = async (): Promise<HistoricalStandingList> => {
  if (env.useMock) {
    return HistoricalStandingListSchema.parse(MOCK_HISTORICAL_STANDINGS);
  }

  const { data } = await api.get('/historical/standings');
  return HistoricalStandingListSchema.parse(data);
};
