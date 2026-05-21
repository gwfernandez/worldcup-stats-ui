import { useState } from 'react';
import { Trophy, Globe, Users, Swords } from 'lucide-react';
import { ChampionshipCard } from '@/features/championships/components/ChampionshipCard';
import {
  MOCK_CHAMPIONSHIPS,
  MOCK_CONTINENT_BY_COUNTRY_CODE,
  type FilterType,
} from '@/features/championships/mocks/championship.mock';
import HeroSection from '@/components/shared/HeroSection';

// ─── Datos de ejemplo ─────────────────────────────────────────────────────────
// TODO: reemplazar por useChampionships() cuando el hook esté conectado a la API
const CHAMPIONSHIPS = MOCK_CHAMPIONSHIPS;

// ─── Tipos locales ────────────────────────────────────────────────────────────
const CONTINENT_BY_COUNTRY_CODE: Record<string, FilterType> = MOCK_CONTINENT_BY_COUNTRY_CODE;

// ─── Componente principal ─────────────────────────────────────────────────────

export default function ChampionshipsPage() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('Todos');

  const filters: FilterType[] = ['Todos', 'América', 'Europa', 'Asia', 'África'];

  const filtered =
    activeFilter === 'Todos'
      ? CHAMPIONSHIPS
      : CHAMPIONSHIPS.filter((wc) => CONTINENT_BY_COUNTRY_CODE[wc.countryCode] === activeFilter);

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

      {/* ── Grilla de mundiales ───────────────────────────────────────── */}
      <main className="font-mono max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-medium text-[#e8eaf0] flex items-center gap-2">
            <Trophy size={14} className="text-[#8a8fa8]" aria-hidden="true" />
            Ediciones
            <span className="text-xs text-[#8a8fa8] font-normal ml-1">({filtered.length})</span>
          </h2>

          <div className="flex gap-2" role="group" aria-label="Filtrar por continente">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`text-xs px-3 py-1 rounded-full border transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#e8c84a] focus:ring-offset-1 focus:ring-offset-[#0f1117] ${
                  activeFilter === f
                    ? 'bg-[#1e2a14] text-[#8fc44a] border-[#3a5a1a]'
                    : 'bg-transparent text-[#8a8fa8] border-[#2a2d3a] hover:border-[#4a4d5a] hover:text-[#e8eaf0]'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {filtered.map((wc) => (
            <ChampionshipCard key={wc.year} championship={wc} />
          ))}
        </div>
      </main>
    </>
  );
}
