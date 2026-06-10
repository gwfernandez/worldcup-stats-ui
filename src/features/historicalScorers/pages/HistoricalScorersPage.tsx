import HeroSection from '@/components/shared/HeroSection';
import { QueryStatus } from '@/components/shared';
import { HistoricalScorersTable } from '../components/HistoricalScorersTable';
import { useHistoricalScorers } from '../hooks/useHistoricalScorers';
import { Award, Trophy, Users, Volleyball } from 'lucide-react';

/**
 * Página de Goleadores Históricos.
 * Accesible desde la navbar principal a la misma altura que la Home.
 * Ruta: /scorers
 */
export default function HistoricalScorersPage() {
  const { scorers, isLoading, isError, error } = useHistoricalScorers();

  return (
    <>
      <HeroSection
        badge="Historia de los mundiales de fútbol"
        title="Tabla de"
        titleAccent="Goleadores Históricos"
        description="Los máximos anotadores en la historia de los Mundiales de Fútbol."
        stats={[
          { icon: Volleyball, value: '2700+', label: 'Goles totales' },
          { icon: Users, value: '1000+', label: 'Goleadores' },
          { icon: Trophy, value: '16', label: 'Récord de goles' },
          { icon: Award, value: 'Klose', label: 'Goleador histórico' },
        ]}
      />

      <main className="font-mono max-w-7xl mx-auto px-6 py-6">
        <QueryStatus isLoading={isLoading} isError={isError} error={error}>
          <HistoricalScorersTable scorers={scorers} />
        </QueryStatus>
      </main>
    </>
  );
}
