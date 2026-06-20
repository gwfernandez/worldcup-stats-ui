import HeroSection from '@/components/shared/HeroSection';
import { QueryStatus, SEO } from '@/components/shared';
import { HistoricalScorersTable } from '../components/HistoricalScorersTable';
import { useHistoricalScorers } from '../hooks/useHistoricalScorers';
import { useTeams } from '../hooks/useTeams';
import { Award, Trophy, Users, Volleyball } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

/**
 * Página de Goleadores Históricos.
 * Accesible desde la navbar principal a la misma altura que la Home.
 * Ruta: /scorers
 */
export default function HistoricalScorersPage() {
  const { t } = useTranslation(['historicalScorers', 'championships']);
  const [currentPage, setCurrentPage] = useState(1);
  const {
    scorers,
    pagination,
    isLoading: areScorersLoading,
    isError: isScorersError,
    error: scorersError,
  } = useHistoricalScorers(currentPage);
  const {
    teams,
    isLoading: areTeamsLoading,
    isError: isTeamsError,
    error: teamsError,
  } = useTeams();
  const isLoading = areScorersLoading || areTeamsLoading;
  const isError = isScorersError || isTeamsError;
  const error = scorersError ?? teamsError;

  return (
    <>
      <SEO
        title={t('historicalScorers:seo.title')}
        description={t('historicalScorers:seo.description')}
      />

      <HeroSection
        badge={t('championships:hero.badge')}
        title={t('historicalScorers:hero.title')}
        titleAccent={t('historicalScorers:hero.titleAccent')}
        description={t('historicalScorers:hero.description')}
        stats={[
          { icon: Volleyball, value: '2700+', label: t('historicalScorers:hero.totalGoals') },
          { icon: Users, value: '1000+', label: t('historicalScorers:hero.scorers') },
          { icon: Trophy, value: '16', label: t('historicalScorers:hero.recordGoals') },
          { icon: Award, value: 'Klose', label: t('historicalScorers:hero.historicalScorer') },
        ]}
      />

      <main className="font-mono max-w-7xl mx-auto px-6 py-6">
        <QueryStatus isLoading={isLoading} isError={isError} error={error}>
          <HistoricalScorersTable
            scorers={scorers}
            pagination={pagination}
            teams={teams}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </QueryStatus>
      </main>
    </>
  );
}
