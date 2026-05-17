import { api } from '@/services/api';
import { WorldCupListSchema, type WorldCupList } from '@/types/worldcup.types';
import { MOCK_WORLD_CUPS } from '@/features/worldCups/mocks/worldcup.mock';

// ─── Mock ─────────────────────────────────────────────────────────────────────
// TODO: eliminar este bloque cuando el endpoint GET /api/v1/worldcups esté disponible
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

// ─── Service ──────────────────────────────────────────────────────────────────

/**
 * Obtiene la lista completa de mundiales desde la API.
 * Usa mock data si VITE_USE_MOCK=true o si el endpoint aún no existe.
 */
export const getWorldCups = async (): Promise<WorldCupList> => {
  if (USE_MOCK) {
    return WorldCupListSchema.parse(MOCK_WORLD_CUPS);
  }

  const { data } = await api.get('/worldcups');
  return WorldCupListSchema.parse(data);
};
