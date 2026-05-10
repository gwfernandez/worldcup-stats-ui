import { useState } from 'react';
import { Trophy, Globe, Users, Swords, ChevronRight, Star } from 'lucide-react';

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface WorldCup {
  year: number;
  country: string;
  flag: string;
  champion: string;
  championFlag: string;
  continent: 'América' | 'Europa' | 'Asia/África';
  accentColor: string;
}

// ─── Datos de ejemplo ─────────────────────────────────────────────────────────

const WORLD_CUPS: WorldCup[] = [
  {
    year: 1930,
    country: 'Uruguay',
    flag: '🇺🇾',
    champion: 'Uruguay',
    championFlag: '🇺🇾',
    continent: 'América',
    accentColor: '#4a9fd4',
  },
  {
    year: 1934,
    country: 'Italia',
    flag: '🇮🇹',
    champion: 'Italia',
    championFlag: '🇮🇹',
    continent: 'Europa',
    accentColor: '#d44a4a',
  },
  {
    year: 1938,
    country: 'Francia',
    flag: '🇫🇷',
    champion: 'Italia',
    championFlag: '🇮🇹',
    continent: 'Europa',
    accentColor: '#d44a4a',
  },
  {
    year: 1950,
    country: 'Brasil',
    flag: '🇧🇷',
    champion: 'Uruguay',
    championFlag: '🇺🇾',
    continent: 'América',
    accentColor: '#4ad45a',
  },
  {
    year: 1954,
    country: 'Suiza',
    flag: '🇨🇭',
    champion: 'Alemania',
    championFlag: '🇩🇪',
    continent: 'Europa',
    accentColor: '#e8c84a',
  },
  {
    year: 1958,
    country: 'Suecia',
    flag: '🇸🇪',
    champion: 'Brasil',
    championFlag: '🇧🇷',
    continent: 'Europa',
    accentColor: '#4ad45a',
  },
  {
    year: 1962,
    country: 'Chile',
    flag: '🇨🇱',
    champion: 'Brasil',
    championFlag: '🇧🇷',
    continent: 'América',
    accentColor: '#4ad45a',
  },
  {
    year: 1966,
    country: 'Inglaterra',
    flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    champion: 'Inglaterra',
    championFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    continent: 'Europa',
    accentColor: '#d44a7a',
  },
  {
    year: 1970,
    country: 'México',
    flag: '🇲🇽',
    champion: 'Brasil',
    championFlag: '🇧🇷',
    continent: 'América',
    accentColor: '#4ad45a',
  },
  {
    year: 1974,
    country: 'Alemania',
    flag: '🇩🇪',
    champion: 'Alemania',
    championFlag: '🇩🇪',
    continent: 'Europa',
    accentColor: '#e8c84a',
  },
  {
    year: 1978,
    country: 'Argentina',
    flag: '🇦🇷',
    champion: 'Argentina',
    championFlag: '🇦🇷',
    continent: 'América',
    accentColor: '#78b4e8',
  },
  {
    year: 1982,
    country: 'España',
    flag: '🇪🇸',
    champion: 'Italia',
    championFlag: '🇮🇹',
    continent: 'Europa',
    accentColor: '#d44a4a',
  },
  {
    year: 1986,
    country: 'México',
    flag: '🇲🇽',
    champion: 'Argentina',
    championFlag: '🇦🇷',
    continent: 'América',
    accentColor: '#78b4e8',
  },
  {
    year: 1990,
    country: 'Italia',
    flag: '🇮🇹',
    champion: 'Alemania',
    championFlag: '🇩🇪',
    continent: 'Europa',
    accentColor: '#e8c84a',
  },
  {
    year: 1994,
    country: 'EE.UU.',
    flag: '🇺🇸',
    champion: 'Brasil',
    championFlag: '🇧🇷',
    continent: 'América',
    accentColor: '#4ad45a',
  },
  {
    year: 1998,
    country: 'Francia',
    flag: '🇫🇷',
    champion: 'Francia',
    championFlag: '🇫🇷',
    continent: 'Europa',
    accentColor: '#4a78d4',
  },
  {
    year: 2002,
    country: 'Corea/Japón',
    flag: '🇯🇵',
    champion: 'Brasil',
    championFlag: '🇧🇷',
    continent: 'Asia/África',
    accentColor: '#4ad45a',
  },
  {
    year: 2006,
    country: 'Alemania',
    flag: '🇩🇪',
    champion: 'Italia',
    championFlag: '🇮🇹',
    continent: 'Europa',
    accentColor: '#d44a4a',
  },
  {
    year: 2010,
    country: 'Sudáfrica',
    flag: '🇿🇦',
    champion: 'España',
    championFlag: '🇪🇸',
    continent: 'Asia/África',
    accentColor: '#d4874a',
  },
  {
    year: 2014,
    country: 'Brasil',
    flag: '🇧🇷',
    champion: 'Alemania',
    championFlag: '🇩🇪',
    continent: 'América',
    accentColor: '#e8c84a',
  },
  {
    year: 2018,
    country: 'Rusia',
    flag: '🇷🇺',
    champion: 'Francia',
    championFlag: '🇫🇷',
    continent: 'Europa',
    accentColor: '#4a78d4',
  },
  {
    year: 2022,
    country: 'Qatar',
    flag: '🇶🇦',
    champion: 'Argentina',
    championFlag: '🇦🇷',
    continent: 'Asia/África',
    accentColor: '#78b4e8',
  },
];

type FilterType = 'Todos' | 'América' | 'Europa' | 'Asia/África';

// ─── Componente WorldCupCard ───────────────────────────────────────────────────

interface WorldCupCardProps {
  wc: WorldCup;
  onClick: (year: number) => void;
}

function WorldCupCard({ wc, onClick }: WorldCupCardProps) {
  return (
    <button
      onClick={() => onClick(wc.year)}
      className="group relative w-full text-left bg-[#161925] border border-[#2a2d3a] rounded-xl p-4 cursor-pointer transition-all duration-200 hover:border-[#e8c84a] hover:bg-[#1a1e2e] focus:outline-none focus:ring-2 focus:ring-[#e8c84a] focus:ring-offset-2 focus:ring-offset-[#0f1117]"
    >
      {/* Barra lateral de color del campeón */}
      <div
        className="absolute top-0 left-0 w-[3px] h-full rounded-l-xl transition-opacity duration-200 opacity-60 group-hover:opacity-100"
        style={{ backgroundColor: wc.accentColor }}
        aria-hidden="true"
      />

      <div className="pl-1">
        <p className="text-xl font-medium text-[#e8c84a] leading-none mb-1">{wc.year}</p>
        <p className="text-sm text-[#e8eaf0] flex items-center gap-1.5 mb-3">
          <span className="text-base leading-none">{wc.flag}</span>
          {wc.country}
        </p>

        <div className="h-px bg-[#2a2d3a] mb-3" />

        <p className="text-xs text-[#8a8fa8] flex items-center gap-1">
          <Star size={11} className="text-[#e8c84a] shrink-0" aria-hidden="true" />
          <span className="text-[#e8eaf0]">
            {wc.championFlag} {wc.champion}
          </span>
        </p>
      </div>

      {/* Flecha en hover */}
      <ChevronRight
        size={14}
        className="absolute bottom-3 right-3 text-[#8a8fa8] opacity-0 group-hover:opacity-100 transition-opacity duration-150"
        aria-hidden="true"
      />
    </button>
  );
}

// ─── Componente Principal ─────────────────────────────────────────────────────

export default function HomePage() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('Todos');

  const filters: FilterType[] = ['Todos', 'América', 'Europa', 'Asia/África'];

  const filtered =
    activeFilter === 'Todos'
      ? WORLD_CUPS
      : WORLD_CUPS.filter((wc) => wc.continent === activeFilter);

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

        {/* Placeholder para imagen estática */}
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
        {/* Header de sección + filtros */}
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
            <WorldCupCard key={wc.year} wc={wc} onClick={handleCardClick} />
          ))}
        </div>
      </main>
    </div>
  );
}
