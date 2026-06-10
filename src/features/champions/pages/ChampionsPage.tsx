import HeroSection from '@/components/shared/HeroSection';
import { QueryStatus } from '@/components/shared';
import { ChampionsTable } from '../components/ChampionsTable';
import { useChampions } from '../hooks/useChampions';
import { Globe, Trophy } from 'lucide-react';
import { useTranslation } from 'react-i18next';

/**
 * Página de Tabla de Campeones.
 * Accesible desde la navbar principal a la misma altura que la Home.
 * Ruta: /champions
 */
export default function ChampionsPage() {
  const { t } = useTranslation(['champions', 'championships']);
  const { champions, isLoading, isError, error } = useChampions();

  return (
    <>
      <HeroSection
        badge={t('championships:hero.badge')}
        title={t('champions:hero.title')}
        titleAccent={t('champions:hero.titleAccent')}
        description={t('champions:hero.description')}
        stats={[
          { icon: Trophy, value: '8', label: t('champions:hero.champions') },
          { icon: Globe, value: '22', label: t('championships:stats.editions') },
          { icon: Trophy, value: 'Brasil', label: t('champions:hero.mostTitles') },
        ]}
      />

      <main className="font-mono max-w-7xl mx-auto px-6 py-6">
        <QueryStatus isLoading={isLoading} isError={isError} error={error}>
          <ChampionsTable champions={champions} />
        </QueryStatus>
      </main>
    </>
  );
}
