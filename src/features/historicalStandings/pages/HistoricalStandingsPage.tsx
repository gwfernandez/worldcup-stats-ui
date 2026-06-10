import { HistoricalStandingsTable } from '../components/HistoricalStandingsTable';
import { StandingsLegend } from '../components/StandingsLegend';
import { useHistoricalStandings } from '../hooks/useHistoricalStandings';
import HeroSection from '@/components/shared/HeroSection';
import { QueryStatus } from '@/components/shared';
import { Globe, Swords, Trophy } from 'lucide-react';
import { useTranslation } from 'react-i18next';

/**
 * Página de Tabla de Posiciones Históricas.
 * Accesible desde la navbar principal a la misma altura que la Home.
 * Ruta: /standings
 */
export default function HistoricalStandingsPage() {
  const { t } = useTranslation(['historicalStandings', 'championships']);
  const { standings, isLoading, isError, error } = useHistoricalStandings();

  return (
    <>
      <HeroSection
        badge={t('championships:hero.badge')}
        title={t('historicalStandings:hero.title')}
        titleAccent={t('historicalStandings:hero.titleAccent')}
        description={t('historicalStandings:hero.description')}
        stats={[
          { icon: Trophy, value: '22', label: t('championships:stats.editions') },
          { icon: Globe, value: '80+', label: t('historicalStandings:hero.teams') },
          { icon: Swords, value: '2800+', label: t('historicalStandings:hero.matches') },
          { icon: Trophy, value: '1930', label: t('historicalStandings:hero.firstWorldCup') },
        ]}
      />

      <main className="font-mono max-w-7xl mx-auto px-6 py-6">
        <QueryStatus isLoading={isLoading} isError={isError} error={error}>
          <HistoricalStandingsTable standings={standings} />
          <StandingsLegend />
        </QueryStatus>
      </main>
    </>
  );
}
