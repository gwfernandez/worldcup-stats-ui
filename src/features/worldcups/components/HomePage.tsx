import { useState } from 'react';
import { Trophy, Globe, Users, Swords } from 'lucide-react';
import { WorldCupCard } from './WorldCupCard';
import {
  MOCK_WORLD_CUPS,
  MOCK_CONTINENT_BY_COUNTRY_CODE,
  type FilterType,
} from '../mocks/worldcup.mock';

// ─── Datos de ejemplo ─────────────────────────────────────────────────────────
// TODO: reemplazar por useWorldCups() cuando el hook esté conectado a la API
const WORLD_CUPS = MOCK_WORLD_CUPS;

// ─── Tipos locales ────────────────────────────────────────────────────────────
const CONTINENT_BY_COUNTRY_CODE: Record<string, FilterType> = MOCK_CONTINENT_BY_COUNTRY_CODE;

// ─── Componente principal ─────────────────────────────────────────────────────

export default function HomePage() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('Todos');

  const filters: FilterType[] = ['Todos', 'América', 'Europa', 'Asia/África'];

  const filtered =
    activeFilter === 'Todos'
      ? WORLD_CUPS
      : WORLD_CUPS.filter((wc) => CONTINENT_BY_COUNTRY_CODE[wc.countryCode] === activeFilter);

  return (
    <div className="min-h-screen bg-[#0f1117] text-[#e8eaf0]">
      {/* ── Navbar ───────────────────────────────────────────────────── */}
      <nav className="flex items-center justify-between px-6 py-3.5 border-b border-[#2a2d3a] bg-[#0f1117] sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <Trophy size={18} className="text-[#e8c84a]" aria-hidden="true" />
          <span className="text-sm font-medium tracking-wide">World Cups</span>
        </div>
        <div className="flex gap-6">
          {[
            { label: 'Mundiales', href: '/', active: true },
            { label: 'Campeones', href: '/champions', active: false },
            { label: 'Posiciones', href: '/standings', active: false },
            { label: 'Goleadores', href: '/scorers', active: false },
          ].map(({ label, href, active }) => (
            <a
              key={label}
              href={href}
              className={`text-xs transition-colors duration-150 ${
                active ? 'text-[#e8c84a]' : 'text-[#8a8fa8] hover:text-[#e8eaf0]'
              }`}
            >
              {label}
            </a>
          ))}
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="bg-[#161925] border-b border-[#2a2d3a] px-6 py-10 flex items-center gap-8">
        <div className="flex-1">
          <span className="inline-block bg-[#1e2a14] text-[#8fc44a] text-xs px-3 py-1 rounded-full border border-[#3a5a1a] mb-3">
            Historia del fútbol mundial
          </span>
          <h1 className="text-2xl font-medium text-white leading-snug mb-2">
            Todos los <span className="text-[#e8c84a]">Mundiales de Fútbol</span>
          </h1>
          <p className="text-sm text-[#8a8fa8] leading-relaxed mb-6 max-w-sm">
            Estadísticas, fixtures, planteles y goleadores
            <br />
            desde Uruguay 1930 hasta hoy.
          </p>

          {/* Stats */}
          <div className="flex gap-6">
            {[
              { icon: Trophy, val: '22', lbl: 'Ediciones' },
              { icon: Globe, val: '80+', lbl: 'Selecciones' },
              { icon: Swords, val: '2800+', lbl: 'Partidos' },
              { icon: Users, val: '1000+', lbl: 'Jugadores' },
            ].map(({ icon: Icon, val, lbl }) => (
              <div key={lbl} className="text-center">
                <Icon size={14} className="text-[#8a8fa8] mx-auto mb-1" aria-hidden="true" />
                <p className="text-lg font-medium text-[#e8c84a] leading-none">{val}</p>
                <p className="text-xs text-[#8a8fa8] mt-0.5">{lbl}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Placeholder para imagen estática del hero */}
        <div
          className="w-48 h-36 shrink-0 bg-[#1e2233] border border-[#2a2d3a] rounded-xl flex flex-col items-center justify-center gap-2"
          aria-label="Imagen del mundial — reemplazar con asset real"
        >
          <Trophy size={40} className="text-[#e8c84a] opacity-40" aria-hidden="true" />
          <span className="text-xs text-[#8a8fa8]">hero image</span>
        </div>
      </section>

      {/* ── Grilla de mundiales ───────────────────────────────────────── */}
      <main className="px-6 py-6">
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
            <WorldCupCard key={wc.year} worldCup={wc} />
          ))}
        </div>
      </main>
    </div>
  );
}
