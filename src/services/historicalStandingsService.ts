import { api } from '@/services/api';
import { HistoricalStandingListSchema, type HistoricalStandingList } from '@/types/historicalStanding.types';
import { MOCK_HISTORICAL_STANDINGS } from '@/features/historicalStandings/mocks/historicalStandings.mock';

// ─── Mock ─────────────────────────────────────────────────────────────────────
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

// ─── Service ──────────────────────────────────────────────────────────────────

/**
 * Obtiene la tabla de posiciones histórica desde la API.
 * Usa mock data si VITE_USE_MOCK=true.
 */
export const getHistoricalStandings = async (): Promise<HistoricalStandingList> => {
  if (USE_MOCK) {
    return HistoricalStandingListSchema.parse(MOCK_HISTORICAL_STANDINGS);
  }

  const { data } = await api.get('/historical/standings');
  return HistoricalStandingListSchema.parse(data);
};
