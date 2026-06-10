import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import commonEn from './locales/en/common.json';
import championshipsEn from './locales/en/championships.json';
import championsEn from './locales/en/champions.json';
import historicalScorersEn from './locales/en/historicalScorers.json';
import historicalStandingsEn from './locales/en/historicalStandings.json';
import commonEs from './locales/es/common.json';
import championshipsEs from './locales/es/championships.json';
import championsEs from './locales/es/champions.json';
import historicalScorersEs from './locales/es/historicalScorers.json';
import historicalStandingsEs from './locales/es/historicalStandings.json';

export const defaultNS = 'common';
export const resources = {
  es: {
    common: commonEs,
    championships: championshipsEs,
    champions: championsEs,
    historicalScorers: historicalScorersEs,
    historicalStandings: historicalStandingsEs,
  },
  en: {
    common: commonEn,
    championships: championshipsEn,
    champions: championsEn,
    historicalScorers: historicalScorersEn,
    historicalStandings: historicalStandingsEn,
  },
} as const;

void i18n.use(initReactI18next).init({
  resources,
  lng: 'es',
  fallbackLng: 'es',
  defaultNS,
  ns: ['common', 'championships', 'champions', 'historicalScorers', 'historicalStandings'],
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
});

export default i18n;
