import { useState } from 'react';
import { Trophy, Globe, Users, Swords } from 'lucide-react';
import { ChampionshipCard } from '../components/ChampionshipCard';
import { ChampionshipCardSkeleton } from '../components/ChampionshipCardSkeleton';
import { useChampionships } from '../hooks/useChampionships';
import { CONTINENT_BY_COUNTRY_CODE, type FilterType } from '../utils/championshipFilter.utils';
import HeroSection from '@/components/shared/HeroSection';
import { QueryStatus } from '@/components/shared';

const SKELETON_COUNT = 22;

export default function ChampionshipsPage() {
  const { championships, isLoading, isError, error } = useChampionships();
  const [activeFilter, setActiveFilter] = useState<FilterType>('Todos');

  const filters: FilterType[] = ['Todos', 'América', 'Europa', 'Asia', 'África'];

  const filtered =
    activeFilter === 'Todos'
      ? championships
      : championships.filter((wc) => CONTINENT_BY_COUNTRY_CODE[wc.countryCode] === activeFilter);

  const cardsSkeleton = (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
      {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
        <ChampionshipCardSkeleton key={i} />
      ))}
    </div>
  );

  return (
    <>
      <HeroSection
        badge="Historia de los mundiales de fútbol"
        title="Todos los"
        titleAccent="Mundiales de Fútbol"
        description="Fixtures, campeones, planteles y goleadores desde Uruguay 1930."
        stats={[
          { icon: Trophy, value: '22', label: 'Ediciones' },
          { icon: Globe, value: '80+', label: 'Selecciones' },
          { icon: Swords, value: '2800+', label: 'Partidos' },
          { icon: Users, value: '1000+', label: 'Jugadores' },
        ]}
      />

      <main className="font-mono max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-medium text-wc-text-primary flex items-center gap-2">
            <Trophy size={14} className="text-wc-text-muted" aria-hidden="true" />
            Ediciones
            <span className="text-xs text-wc-text-muted font-normal ml-1">({filtered.length})</span>
          </h2>

          <div className="flex gap-2" role="group" aria-label="Filtrar por continente">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`text-xs px-3 py-1 rounded-full border transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-wc-accent-gold focus:ring-offset-1 focus:ring-offset-wc-bg-primary ${
                  activeFilter === f
                    ? 'bg-wc-success-surface text-wc-success border-wc-success-border'
                    : 'bg-transparent text-wc-text-muted border-wc-border-primary hover:border-wc-border-muted hover:text-wc-text-primary'
                }`}
              >
                {f}
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
