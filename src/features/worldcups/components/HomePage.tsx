import { useState } from 'react';
import { Trophy, Globe, Users, Swords } from 'lucide-react';
import { WorldCupCard } from './WorldCupCard';
import type { WorldCup } from '../../../types/worldcup.types';

// ─── Datos de ejemplo ─────────────────────────────────────────────────────────
// TODO: reemplazar por useWorldCups() cuando el hook esté conectado a la API

const WORLD_CUPS: WorldCup[] = [
  {
    id: 1,
    year: 1930,
    country: 'Uruguay',
    countryCode: 'UY',
    champion: 'Uruguay',
    championCode: 'UY',
  },
  {
    id: 2,
    year: 1934,
    country: 'Italia',
    countryCode: 'IT',
    champion: 'Italia',
    championCode: 'IT',
  },
  {
    id: 3,
    year: 1938,
    country: 'Francia',
    countryCode: 'FR',
    champion: 'Italia',
    championCode: 'IT',
  },
  {
    id: 4,
    year: 1950,
    country: 'Brasil',
    countryCode: 'BR',
    champion: 'Uruguay',
    championCode: 'UY',
  },
  {
    id: 5,
    year: 1954,
    country: 'Suiza',
    countryCode: 'CH',
    champion: 'Alemania',
    championCode: 'DE',
  },
  {
    id: 6,
    year: 1958,
    country: 'Suecia',
    countryCode: 'SE',
    champion: 'Brasil',
    championCode: 'BR',
  },
  {
    id: 7,
    year: 1962,
    country: 'Chile',
    countryCode: 'CL',
    champion: 'Brasil',
    championCode: 'BR',
  },
  {
    id: 8,
    year: 1966,
    country: 'Inglaterra',
    countryCode: 'GB',
    champion: 'Inglaterra',
    championCode: 'GB',
  },
  {
    id: 9,
    year: 1970,
    country: 'México',
    countryCode: 'MX',
    champion: 'Brasil',
    championCode: 'BR',
  },
  {
    id: 10,
    year: 1974,
    country: 'Alemania',
    countryCode: 'DE',
    champion: 'Alemania',
    championCode: 'DE',
  },
  {
    id: 11,
    year: 1978,
    country: 'Argentina',
    countryCode: 'AR',
    champion: 'Argentina',
    championCode: 'AR',
  },
  {
    id: 12,
    year: 1982,
    country: 'España',
    countryCode: 'ES',
    champion: 'Italia',
    championCode: 'IT',
  },
  {
    id: 13,
    year: 1986,
    country: 'México',
    countryCode: 'MX',
    champion: 'Argentina',
    championCode: 'AR',
  },
  {
    id: 14,
    year: 1990,
    country: 'Italia',
    countryCode: 'IT',
    champion: 'Alemania',
    championCode: 'DE',
  },
  {
    id: 15,
    year: 1994,
    country: 'EE.UU.',
    countryCode: 'US',
    champion: 'Brasil',
    championCode: 'BR',
  },
  {
    id: 16,
    year: 1998,
    country: 'Francia',
    countryCode: 'FR',
    champion: 'Francia',
    championCode: 'FR',
  },
  {
    id: 17,
    year: 2002,
    country: 'Corea/Japón',
    countryCode: 'JP',
    champion: 'Brasil',
    championCode: 'BR',
  },
  {
    id: 18,
    year: 2006,
    country: 'Alemania',
    countryCode: 'DE',
    champion: 'Italia',
    championCode: 'IT',
  },
  {
    id: 19,
    year: 2010,
    country: 'Sudáfrica',
    countryCode: 'ZA',
    champion: 'España',
    championCode: 'ES',
  },
  {
    id: 20,
    year: 2014,
    country: 'Brasil',
    countryCode: 'BR',
    champion: 'Alemania',
    championCode: 'DE',
  },
  {
    id: 21,
    year: 2018,
    country: 'Rusia',
    countryCode: 'RU',
    champion: 'Francia',
    championCode: 'FR',
  },
  {
    id: 22,
    year: 2022,
    country: 'Qatar',
    countryCode: 'QA',
    champion: 'Argentina',
    championCode: 'AR',
  },
];

// ─── Tipos locales ────────────────────────────────────────────────────────────

type FilterType = 'Todos' | 'América' | 'Europa' | 'Asia/África';

const CONTINENT_BY_COUNTRY_CODE: Record<string, FilterType> = {
  UY: 'América',
  AR: 'América',
  BR: 'América',
  CL: 'América',
  MX: 'América',
  US: 'América',
  IT: 'Europa',
  FR: 'Europa',
  DE: 'Europa',
  GB: 'Europa',
  SE: 'Europa',
  CH: 'Europa',
  ES: 'Europa',
  RU: 'Europa',
  JP: 'Asia/África',
  ZA: 'Asia/África',
  QA: 'Asia/África',
};

// ─── Componente principal ─────────────────────────────────────────────────────

export default function HomePage() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('Todos');

  const filters: FilterType[] = ['Todos', 'América', 'Europa', 'Asia/África'];

  const filtered =
    activeFilter === 'Todos'
      ? WORLD_CUPS
      : WORLD_CUPS.filter((wc) => CONTINENT_BY_COUNTRY_CODE[wc.countryCode] === activeFilter);

  const handleCardClick = (year: number) => {
    // TODO: navegar a /worldcup/:year con React Router
    console.log('Navegar a:', year);
  };

  return (
    <div className="min-h-screen bg-[#0f1117] text-[#e8eaf0]">
      {/* ── Navbar ───────────────────────────────────────────────────── */}
      <nav className="flex items-center justify-between px-6 py-3.5 border-b border-[#2a2d3a] bg-[#0f1117] sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <Trophy size={18} className="text-[#e8c84a]" aria-hidden="true" />
          <span className="text-sm font-medium tracking-wide">World Cups</span>
        </div>
        <div className="flex gap-6">
          {['Mundiales', 'Selecciones', 'Goleadores'].map((link, i) => (
            <a
              key={link}
              href="#"
              className={`text-xs transition-colors duration-150 ${
                i === 0 ? 'text-[#e8c84a]' : 'text-[#8a8fa8] hover:text-[#e8eaf0]'
              }`}
            >
              {link}
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
            <WorldCupCard key={wc.year} worldCup={wc} onClick={handleCardClick} />
          ))}
        </div>
      </main>
    </div>
  );
}
