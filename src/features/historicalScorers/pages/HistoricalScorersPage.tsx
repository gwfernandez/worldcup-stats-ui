import HeroSection from '@/components/shared/HeroSection';
import { HistoricalScorersTable } from '@/features/historicalScorers/components/HistoricalScorersTable';
import { MOCK_HISTORICAL_SCORERS } from '@/features/historicalScorers/mocks/historicalScorers.mock';
import { Award, Trophy, Users, Volleyball } from 'lucide-react';

// ─── Componente ───────────────────────────────────────────────────────────────

/**
 * Página de Goleadores Históricos.
 * Accesible desde la navbar principal a la misma altura que la Home.
 * Ruta: /scorers
 */
export default function HistoricalScorersPage() {
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

      {/* ── Contenido ─────────────────────────────────────────────── */}
      <main className="font-mono max-w-7xl mx-auto px-6 py-6">
        <HistoricalScorersTable scorers={MOCK_HISTORICAL_SCORERS} />
      </main>
    </>
  );
}
