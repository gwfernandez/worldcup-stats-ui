import { useState, useMemo } from 'react';
import type { Stadium } from '../../../../types/stadium.types';
import type { Match } from '../../../../types/worldcup.types';
import { StadiumMatchesModal } from '../shared/StadiumMatchesModal';
import { MatchModal } from '../shared/MatchModal';

// ─── Props ────────────────────────────────────────────────────────────────────

export interface StadiumsTabProps {
  stadiums: Stadium[];
}

// ─── Componente ───────────────────────────────────────────────────────────────

/**
 * Solapa de estadios.
 * Filtro por nombre, tabla con capacidad y conteo de partidos,
 * acciones de mapa (link externo) y partidos (modal).
 * Al hacer click en un partido del modal se abre el MatchModal de detalle.
 */
export function StadiumsTab({ stadiums }: StadiumsTabProps) {
  const [searchName, setSearchName] = useState('');
  const [selectedStadium, setSelectedStadium] = useState<Stadium | null>(null);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);

  const filtered = useMemo(
    () => stadiums.filter((s) => s.name.toLowerCase().includes(searchName.toLowerCase())),
    [stadiums, searchName],
  );

  const handleMatchSelect = (match: Match) => {
    setSelectedStadium(null); // cierra modal de estadio
    setSelectedMatch(match); // abre modal de partido
  };

  return (
    <>
      <div className="max-w-4xl mx-auto">
        {/* ── Filtro ───────────────────────────────────────────────── */}
        <div className="flex gap-2.5 mb-4">
          <div className="flex-[2] relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8a8fa8] pointer-events-none"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Buscar estadio..."
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="w-full bg-[#161925] border border-[#2a2d3a] rounded-lg pl-8 pr-3 py-[7px] text-xs text-[#e8eaf0] placeholder:text-[#8a8fa8] outline-none focus:border-[#e8c84a] transition-colors"
            />
          </div>
        </div>

        {/* ── Tabla ────────────────────────────────────────────────── */}
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[#2a2d3a]">
              <th className="text-left text-[11px] font-normal text-[#8a8fa8] pb-2">Estadio</th>
              <th className="text-left text-[11px] font-normal text-[#8a8fa8] pb-2">Ciudad</th>
              <th className="text-left text-[11px] font-normal text-[#8a8fa8] pb-2">Capacidad</th>
              <th className="text-left text-[11px] font-normal text-[#8a8fa8] pb-2">Partidos</th>
              <th className="text-center text-[11px] font-normal text-[#8a8fa8] pb-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="py-8 text-center text-sm text-[#8a8fa8]">
                  No se encontraron estadios
                </td>
              </tr>
            )}
            {filtered.map((stadium) => (
              <tr
                key={stadium.id}
                className="border-t border-[#1e2233] hover:bg-[#161925] transition-colors duration-150"
              >
                {/* Nombre */}
                <td className="py-2.5 pr-3">
                  <span className="text-xs text-[#e8eaf0]">{stadium.name}</span>
                </td>

                {/* Ciudad */}
                <td className="py-2.5 pr-3">
                  <div className="flex items-center gap-1.5 text-xs text-[#8a8fa8]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="11"
                      height="11"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    {stadium.city}
                  </div>
                </td>

                {/* Capacidad */}
                <td className="py-2.5 pr-3">
                  <span className="text-xs text-[#8a8fa8]">
                    {stadium.capacity ? stadium.capacity.toLocaleString() : '—'}
                  </span>
                </td>

                {/* Conteo de partidos */}
                <td className="py-2.5 pr-3">
                  <div className="flex items-center gap-1.5 text-xs text-[#8a8fa8]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="11"
                      height="11"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 8v4l3 3" />
                    </svg>
                    {stadium.matches.length}
                  </div>
                </td>

                {/* Acciones */}
                <td className="py-2.5 text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    {/* Botón mapa */}
                    <div className="relative group/map">
                      <a
                        href={stadium.mapsUrl ?? '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-7 h-7 border border-[#2a2d3a] rounded-md text-[#8a8fa8] hover:border-[#4a78d4] hover:text-[#4a78d4] transition-colors focus:outline-none"
                        aria-label={`Ver ${stadium.name} en el mapa`}
                        onClick={(e) => {
                          if (!stadium.mapsUrl) e.preventDefault();
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="13"
                          height="13"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
                          <line x1="9" y1="3" x2="9" y2="18" />
                          <line x1="15" y1="6" x2="15" y2="21" />
                        </svg>
                      </a>
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-1 bg-[#1e2233] border border-[#2a2d3a] rounded-md text-[10px] text-[#e8eaf0] whitespace-nowrap opacity-0 group-hover/map:opacity-100 transition-opacity duration-150 pointer-events-none z-10">
                        Ver en mapa
                        <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#2a2d3a]" />
                      </div>
                    </div>

                    {/* Botón partidos */}
                    <div className="relative group/matches">
                      <button
                        onClick={() => setSelectedStadium(stadium)}
                        className="flex items-center justify-center w-7 h-7 border border-[#2a2d3a] rounded-md text-[#8a8fa8] hover:border-[#e8c84a] hover:text-[#e8c84a] transition-colors focus:outline-none"
                        aria-label={`Ver partidos en ${stadium.name}`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="13"
                          height="13"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <path d="M12 8v4l3 3" />
                        </svg>
                      </button>
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-1 bg-[#1e2233] border border-[#2a2d3a] rounded-md text-[10px] text-[#e8eaf0] whitespace-nowrap opacity-0 group-hover/matches:opacity-100 transition-opacity duration-150 pointer-events-none z-10">
                        Partidos
                        <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#2a2d3a]" />
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal partidos del estadio */}
      <StadiumMatchesModal
        stadium={selectedStadium}
        onClose={() => setSelectedStadium(null)}
        onMatchSelect={handleMatchSelect}
      />

      {/* Modal detalle de partido */}
      <MatchModal match={selectedMatch} onClose={() => setSelectedMatch(null)} />
    </>
  );
}
