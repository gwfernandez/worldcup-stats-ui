import HeroSection from '@/components/shared/HeroSection';
import WorldCupsNavbar from '@/components/shared/WorldCupsNavbar';
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
    <div className="min-h-screen bg-[#0f1117] text-[#e8eaf0]">
      <WorldCupsNavbar
        links={[
          { label: 'Mundiales', href: '/', active: false },
          { label: 'Campeones', href: '/champions', active: false },
          { label: 'Posiciones', href: '/standings', active: false },
          { label: 'Goleadores', href: '/scorers', active: true },
        ]}
      />

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
    </div>
  );
}
