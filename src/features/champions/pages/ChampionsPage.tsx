import HeroSection from '@/components/shared/HeroSection';
import { QueryStatus } from '@/components/shared';
import { ChampionsTable } from '@/features/champions/components/ChampionsTable';
import { useChampions } from '@/features/champions/hooks/useChampions';
import { Globe, Trophy } from 'lucide-react';

/**
 * Página de Tabla de Campeones.
 * Accesible desde la navbar principal a la misma altura que la Home.
 * Ruta: /champions
 */
export default function ChampionsPage() {
  const { champions, isLoading, isError, error } = useChampions();

  return (
    <>
      <HeroSection
        badge="Historia de los mundiales de fútbol"
        title="Tabla de"
        titleAccent="Campeones"
        description="Las selecciones con más títulos en la historia de los Mundiales de Fútbol."
        stats={[
          { icon: Trophy, value: '8', label: 'Campeones' },
          { icon: Globe, value: '22', label: 'Ediciones' },
          { icon: Trophy, value: 'Brasil', label: 'Más títulos (5)' },
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
