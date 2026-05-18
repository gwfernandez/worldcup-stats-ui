import WorldCupsNavbar from '@/components/shared/WorldCupsNavbar';
import { ChampionsTable } from '@/features/champions/components/ChampionsTable';
import { MOCK_CHAMPIONS } from '@/features/champions/mocks/champions.mock';

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

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="bg-[#161925] border-b border-[#2a2d3a] px-6 py-7 flex items-center justify-between gap-6">
        <div>
          <span className="inline-block bg-[#1e2a14] text-[#8fc44a] text-xs px-3 py-1 rounded-full border border-[#3a5a1a] mb-3">
            Historia del fútbol mundial
          </span>
          <h1 className="text-xl font-medium text-white mb-1.5">
            Tabla de <span className="text-[#e8c84a]">Campeones</span>
          </h1>
          <p className="text-xs text-[#8a8fa8] leading-relaxed mb-4">
            Las selecciones con más títulos en la historia
            <br />
            de los Mundiales de Fútbol desde 1930.
          </p>
          <div className="flex gap-6">
            {[
              { val: '8', lbl: 'Países campeones' },
              { val: '22', lbl: 'Ediciones' },
              { val: 'Brasil', lbl: 'Más títulos (5)' },
            ].map(({ val, lbl }) => (
              <div key={lbl} className="text-center">
                <p className="text-lg font-medium text-[#e8c84a] leading-none">{val}</p>
                <p className="text-[10px] text-[#8a8fa8] mt-0.5">{lbl}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Placeholder imagen */}
        <div
          className="w-40 h-28 shrink-0 bg-[#1e2233] border border-[#2a2d3a] rounded-xl flex flex-col items-center justify-center gap-2"
          aria-label="Imagen decorativa — reemplazar con asset real"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#e8c84a"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="opacity-30"
            aria-hidden="true"
          >
            <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
            <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
            <path d="M4 22h16" />
            <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
            <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
            <path d="M18 2H6v7a6 6 0 0 0 12 0V2z" />
          </svg>
          <span className="text-[10px] text-[#8a8fa8]">imagen acá</span>
        </div>
      </section>

      {/* ── Contenido ─────────────────────────────────────────────── */}
      <main className="px-6 py-6 max-w-3xl mx-auto">
        <ChampionsTable champions={MOCK_CHAMPIONS} />
      </main>
    </div>
  );
}
