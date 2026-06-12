import { api } from '@/services/api';
import { ChampionshipListResponseSchema, type ChampionshipList } from '@/types/championship.types';

// ─── Service ──────────────────────────────────────────────────────────────────

/**
 * Obtiene la lista completa de mundiales desde la API.
 */
export const getChampionships = async (): Promise<ChampionshipList> => {
  const { data } = await api.get('/api/championships?size=50');
  return ChampionshipListResponseSchema.parse(data).data;
};
