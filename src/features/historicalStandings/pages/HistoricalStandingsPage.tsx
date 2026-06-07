import { StandingsLegend } from '@/features/historicalStandings/components/StandingsLegend';
import { HistoricalStandingsTable } from '@/features/historicalStandings/components/HistoricalStandingsTable';
import { useHistoricalStandings } from '@/features/historicalStandings/hooks/useHistoricalStandings';
import HeroSection from '@/components/shared/HeroSection';
import { QueryStatus } from '@/components/shared';
import { Globe, Swords, Trophy } from 'lucide-react';

/**
 * Página de Tabla de Posiciones Históricas.
 * Accesible desde la navbar principal a la misma altura que la Home.
 * Ruta: /standings
 */
export default function HistoricalStandingsPage() {
  const { standings, isLoading, isError, error } = useHistoricalStandings();

  return (
    <>
      <HeroSection
        badge="Historia de los mundiales de fútbol"
        title="Tabla de"
        titleAccent="Posiciones Históricas"
        description="Ranking acumulado de todas las selecciones en la historia de los Mundiales de Fútbol."
        stats={[
          { icon: Trophy, value: '22', label: 'Ediciones' },
          { icon: Globe, value: '80+', label: 'Selecciones' },
          { icon: Swords, value: '2800+', label: 'Partidos' },
          { icon: Trophy, value: '1930', label: '1er Mundial' },
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
