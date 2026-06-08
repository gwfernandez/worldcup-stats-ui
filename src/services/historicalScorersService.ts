import { api } from '@/services/api';
import { env } from '@/config/env';
import { HistoricalScorerListSchema, type HistoricalScorerList } from '@/types/historicalScorer.types';
import { MOCK_HISTORICAL_SCORERS } from '@/features/historicalScorers/mocks/historicalScorers.mock';

// ─── Service ──────────────────────────────────────────────────────────────────

/**
 * Obtiene el listado histórico de goleadores desde la API.
 * Usa mock data si VITE_USE_MOCK=true.
 */
export const getHistoricalScorers = async (): Promise<HistoricalScorerList> => {
  if (env.useMock) {
    return HistoricalScorerListSchema.parse(MOCK_HISTORICAL_SCORERS);
  }

  const { data } = await api.get('/historical/scorers');
  return HistoricalScorerListSchema.parse(data);
};
