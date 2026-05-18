import { api } from '@/services/api';
import { ChampionshipListSchema, type ChampionshipList } from '@/types/championship.types';
import { MOCK_CHAMPIONSHIPS } from '@/features/championships/mocks/championship.mock';

// ─── Mock ─────────────────────────────────────────────────────────────────────
// TODO: eliminar este bloque cuando el endpoint GET /api/v1/worldcups esté disponible
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

// ─── Service ──────────────────────────────────────────────────────────────────

/**
 * Obtiene la lista completa de mundiales desde la API.
 * Usa mock data si VITE_USE_MOCK=true o si el endpoint aún no existe.
 */
export const getChampionships = async (): Promise<ChampionshipList> => {
  if (USE_MOCK) {
    return ChampionshipListSchema.parse(MOCK_CHAMPIONSHIPS);
  }

  const { data } = await api.get('/worldcups');
  return ChampionshipListSchema.parse(data);
};
