import { api } from '@/services/api';
import { ChampionTeamListSchema, type ChampionTeamList } from '@/types/champion.types';
import { MOCK_CHAMPIONS } from '@/features/champions/mocks/champions.mock';

// ─── Mock ─────────────────────────────────────────────────────────────────────
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

// ─── Service ──────────────────────────────────────────────────────────────────

/**
 * Obtiene el listado histórico de campeones desde la API.
 * Usa mock data si VITE_USE_MOCK=true.
 */
export const getChampions = async (): Promise<ChampionTeamList> => {
  if (USE_MOCK) {
    return ChampionTeamListSchema.parse(MOCK_CHAMPIONS);
  }

  const { data } = await api.get('/champions');
  return ChampionTeamListSchema.parse(data);
};
