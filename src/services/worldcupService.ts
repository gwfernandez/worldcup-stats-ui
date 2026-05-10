import { api } from './api';
import { WorldCupListSchema, type WorldCupList } from '../types/worldcup.types';

// ─── Mock ─────────────────────────────────────────────────────────────────────
// TODO: eliminar este bloque cuando el endpoint GET /api/v1/worldcups esté disponible

const MOCK_WORLD_CUPS: WorldCupList = [
  {
    id: 1,
    year: 1930,
    country: 'Uruguay',
    countryCode: 'UY',
    champion: 'Uruguay',
    championCode: 'UY',
  },
  {
    id: 2,
    year: 1934,
    country: 'Italia',
    countryCode: 'IT',
    champion: 'Italia',
    championCode: 'IT',
  },
  {
    id: 3,
    year: 1938,
    country: 'Francia',
    countryCode: 'FR',
    champion: 'Italia',
    championCode: 'IT',
  },
  {
    id: 4,
    year: 1950,
    country: 'Brasil',
    countryCode: 'BR',
    champion: 'Uruguay',
    championCode: 'UY',
  },
  {
    id: 5,
    year: 1954,
    country: 'Suiza',
    countryCode: 'CH',
    champion: 'Alemania',
    championCode: 'DE',
  },
  {
    id: 6,
    year: 1958,
    country: 'Suecia',
    countryCode: 'SE',
    champion: 'Brasil',
    championCode: 'BR',
  },
  {
    id: 7,
    year: 1962,
    country: 'Chile',
    countryCode: 'CL',
    champion: 'Brasil',
    championCode: 'BR',
  },
  {
    id: 8,
    year: 1966,
    country: 'Inglaterra',
    countryCode: 'GB',
    champion: 'Inglaterra',
    championCode: 'GB',
  },
  {
    id: 9,
    year: 1970,
    country: 'México',
    countryCode: 'MX',
    champion: 'Brasil',
    championCode: 'BR',
  },
  {
    id: 10,
    year: 1974,
    country: 'Alemania',
    countryCode: 'DE',
    champion: 'Alemania',
    championCode: 'DE',
  },
  {
    id: 11,
    year: 1978,
    country: 'Argentina',
    countryCode: 'AR',
    champion: 'Argentina',
    championCode: 'AR',
  },
  {
    id: 12,
    year: 1982,
    country: 'España',
    countryCode: 'ES',
    champion: 'Italia',
    championCode: 'IT',
  },
  {
    id: 13,
    year: 1986,
    country: 'México',
    countryCode: 'MX',
    champion: 'Argentina',
    championCode: 'AR',
  },
  {
    id: 14,
    year: 1990,
    country: 'Italia',
    countryCode: 'IT',
    champion: 'Alemania',
    championCode: 'DE',
  },
  {
    id: 15,
    year: 1994,
    country: 'EE.UU.',
    countryCode: 'US',
    champion: 'Brasil',
    championCode: 'BR',
  },
  {
    id: 16,
    year: 1998,
    country: 'Francia',
    countryCode: 'FR',
    champion: 'Francia',
    championCode: 'FR',
  },
  {
    id: 17,
    year: 2002,
    country: 'Corea/Japón',
    countryCode: 'JP',
    champion: 'Brasil',
    championCode: 'BR',
  },
  {
    id: 18,
    year: 2006,
    country: 'Alemania',
    countryCode: 'DE',
    champion: 'Italia',
    championCode: 'IT',
  },
  {
    id: 19,
    year: 2010,
    country: 'Sudáfrica',
    countryCode: 'ZA',
    champion: 'España',
    championCode: 'ES',
  },
  {
    id: 20,
    year: 2014,
    country: 'Brasil',
    countryCode: 'BR',
    champion: 'Alemania',
    championCode: 'DE',
  },
  {
    id: 21,
    year: 2018,
    country: 'Rusia',
    countryCode: 'RU',
    champion: 'Francia',
    championCode: 'FR',
  },
  {
    id: 22,
    year: 2022,
    country: 'Qatar',
    countryCode: 'QA',
    champion: 'Argentina',
    championCode: 'AR',
  },
];

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
