import { Trophy, Globe, Users, Swords } from 'lucide-react';
import { ChampionshipCard } from '../components/ChampionshipCard';
import { ChampionshipCardSkeleton } from '../components/ChampionshipCardSkeleton';
import { useChampionships } from '../hooks/useChampionships';
import HeroSection from '@/components/shared/HeroSection';
import { QueryStatus, SEO } from '@/components/shared';
import { useTranslation } from 'react-i18next';
import { useUIStore } from '@/store/ui.store';

const SKELETON_COUNT = 22;
const ALL_CONFEDERATIONS_FILTER = '';

export default function ChampionshipsPage() {
  const { t } = useTranslation(['championships', 'common']);
  const { championships, isLoading, isError, error } = useChampionships();
  const activeFilter =
    useUIStore((state) => state.filters.championships?.confederation) ??
    ALL_CONFEDERATIONS_FILTER;
  const setFilter = useUIStore((state) => state.setFilter);

  const filters = [
    ALL_CONFEDERATIONS_FILTER,
    ...new Set(championships.flatMap((championship) => championship.confederationCodes)),
  ];

  const filtered =
    activeFilter === ALL_CONFEDERATIONS_FILTER
      ? championships
      : championships.filter((wc) => wc.confederationCodes.includes(activeFilter));

  const cardsSkeleton = (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
      {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
        <ChampionshipCardSkeleton key={i} />
      ))}
    </div>
  );

  return (
    <>
      <SEO
        title={t('championships:seo.listTitle')}
        description={t('championships:seo.listDescription')}
      />

      <HeroSection
        badge={t('championships:hero.badge')}
        title={t('championships:hero.title')}
        titleAccent={t('championships:hero.titleAccent')}
        description={t('championships:hero.description')}
        stats={[
          { icon: Trophy, value: '22', label: t('championships:stats.editions') },
          { icon: Globe, value: '80+', label: t('championships:stats.teams') },
          { icon: Swords, value: '2800+', label: t('championships:stats.matches') },
          { icon: Users, value: '1000+', label: t('championships:stats.players') },
        ]}
      />

      <main className="font-mono max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-medium text-wc-text-primary flex items-center gap-2">
            <Trophy size={14} className="text-wc-text-muted" aria-hidden="true" />
            {t('championships:list.title')}
            <span className="text-xs text-wc-text-muted font-normal ml-1">({filtered.length})</span>
          </h2>

          <div
            className="flex gap-2"
            role="group"
            aria-label={t('common:labels.confederation')}
          >
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter('championships', 'confederation', f)}
                className={`text-xs px-3 py-1 rounded-full border transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-wc-accent-gold focus:ring-offset-1 focus:ring-offset-wc-bg-primary ${
                  activeFilter === f
                    ? 'bg-wc-success-surface text-wc-success border-wc-success-border'
                    : 'bg-transparent text-wc-text-muted border-wc-border-primary hover:border-wc-border-muted hover:text-wc-text-primary'
                }`}
              >
                {f === ALL_CONFEDERATIONS_FILTER ? t('common:filters.all') : f}
              </button>
            ))}
          </div>
        </div>

        <QueryStatus isLoading={isLoading} isError={isError} error={error} skeleton={cardsSkeleton}>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {filtered.map((wc) => (
              <ChampionshipCard key={wc.year} championship={wc} />
            ))}
          </div>
        </QueryStatus>
      </main>
    </>
  );
}
