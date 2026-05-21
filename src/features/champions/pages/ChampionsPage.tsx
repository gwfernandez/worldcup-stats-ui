import HeroSection from '@/components/shared/HeroSection';
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

      {/* ── Contenido ─────────────────────────────────────────────── */}
      <main className="font-mono max-w-7xl mx-auto px-6 py-6">
        <ChampionsTable champions={MOCK_CHAMPIONS} />
      </main>
    </>
  );
}
