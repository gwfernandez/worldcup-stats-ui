import { api } from '@/services/api';
import { env } from '@/config/env';
import { ChampionTeamListSchema, type ChampionTeamList } from '@/types/champion.types';
import { MOCK_CHAMPIONS } from '@/features/champions/mocks/champions.mock';

// ─── Service ──────────────────────────────────────────────────────────────────

/**
 * Obtiene el listado histórico de campeones desde la API.
 * Usa mock data si VITE_USE_MOCK=true.
 */
export const getChampions = async (): Promise<ChampionTeamList> => {
  if (env.useMock) {
    return ChampionTeamListSchema.parse(MOCK_CHAMPIONS);
  }

  const { data } = await api.get('/champions');
  return ChampionTeamListSchema.parse(data);
};
