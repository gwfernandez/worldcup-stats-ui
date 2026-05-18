import { StandingsLegend } from '@/features/historicalStandings/components/StandingsLegend';
import { MOCK_HISTORICAL_STANDINGS } from '@/features/historicalStandings/mocks/historicalStandings.mock';
import { HistoricalStandingsTable } from '@/features/historicalStandings/components/HistoricalStandingsTable';
import WorldCupsNavbar from '@/components/shared/WorldCupsNavbar';
import HeroSection from '@/components/shared/HeroSection';
import { Globe, Swords, Trophy } from 'lucide-react';

// ─── Componente ───────────────────────────────────────────────────────────────

/**
 * Página de Tabla de Posiciones Históricas.
 * Accesible desde la navbar principal a la misma altura que la Home.
 * Ruta: /standings
 */
export default function HistoricalStandingsPage() {
  return (
    <div className="min-h-screen bg-[#0f1117] text-[#e8eaf0]">
      <WorldCupsNavbar
        links={[
          { label: 'Mundiales', href: '/', active: false },
          { label: 'Campeones', href: '/champions', active: false },
          { label: 'Posiciones', href: '/standings', active: true },
          { label: 'Goleadores', href: '/scorers', active: false },
        ]}
      />

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

      {/* ── Contenido ─────────────────────────────────────────────── */}
      <main className="px-6 py-6 max-w-5xl mx-auto">
        <HistoricalStandingsTable standings={MOCK_HISTORICAL_STANDINGS} />
        <StandingsLegend />
      </main>
    </div>
  );
}
