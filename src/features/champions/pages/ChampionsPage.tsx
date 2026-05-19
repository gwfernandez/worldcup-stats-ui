import HeroSection from '@/components/shared/HeroSection';
import WorldCupsNavbar from '@/components/shared/WorldCupsNavbar';
import { ChampionsTable } from '@/features/champions/components/ChampionsTable';
import { MOCK_CHAMPIONS } from '@/features/champions/mocks/champions.mock';
import { Globe, Trophy } from 'lucide-react';

// ─── Componente ───────────────────────────────────────────────────────────────

/**
 * Página de Tabla de Campeones.
 * Accesible desde la navbar principal a la misma altura que la Home.
 * Ruta: /champions
 */
export default function ChampionsPage() {
  return (
    <div className="min-h-screen bg-[#0f1117] text-[#e8eaf0]">
      <WorldCupsNavbar
        links={[
          { label: 'Mundiales', href: '/', active: false },
          { label: 'Campeones', href: '/champions', active: true },
          { label: 'Posiciones', href: '/standings', active: false },
          { label: 'Goleadores', href: '/scorers', active: false },
        ]}
      />

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

      {/* ── Contenido ─────────────────────────────────────────────── */}
      <main className="font-mono max-w-7xl mx-auto px-6 py-6">
        <ChampionsTable champions={MOCK_CHAMPIONS} />
      </main>
    </div>
  );
}
