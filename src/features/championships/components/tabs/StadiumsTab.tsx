import { useState, useMemo } from 'react';
import { MapPin, Clock, Map } from 'lucide-react';
import type { Stadium } from '@/types/stadium.types';
import type { Match } from '@/types/championship.types';
import { MatchModal } from '../shared/MatchModal';
import { StadiumMatchesModal } from '../shared/StadiumMatchesModal';
import { SearchInput } from '@/components/shared';

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
      {/* ── Filtro ───────────────────────────────────────────────── */}
      <div className="flex gap-2.5 mb-4">
        <SearchInput
          className="flex-[2]"
          placeholder="Buscar estadio..."
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />
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
                  <MapPin size={11} aria-hidden="true" />
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
                  <Clock size={11} aria-hidden="true" />
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
                      <Map size={13} aria-hidden="true" />
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
                      <Clock size={13} aria-hidden="true" />
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
