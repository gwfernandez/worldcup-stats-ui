import { useState, useMemo } from 'react';
import type { ChampionTeam } from '@/types/champion.types';
import { CONFEDERATION_STYLES, CONFEDERATION_TOOLTIP } from '@/types/historicalStanding.types';
import { ChampionshipsModal } from '@/features/champions/components/ChampionshipsModal';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const FLAG_URL = (code: string) => `https://flagcdn.com/24x18/${code.toLowerCase()}.png`;

// ─── Props ────────────────────────────────────────────────────────────────────

export interface ChampionsTableProps {
  champions: ChampionTeam[];
}

// ─── Componente ───────────────────────────────────────────────────────────────

/**
 * Tabla de campeones históricos sin paginado.
 * Filtros por nombre y confederación.
 * Borde lateral por confederación, trofeos visuales y modal de detalle.
 */
export function ChampionsTable({ champions }: ChampionsTableProps) {
  const [selectedTeam, setSelectedTeam] = useState<ChampionTeam | null>(null);
  const [searchName, setSearchName] = useState('');
  const [filterConf, setFilterConf] = useState('');

  const confOptions = useMemo(
    () => [...new Set(champions.map((c) => c.confederation))].sort(),
    [champions],
  );

  const filtered = useMemo(
    () =>
      champions.filter((c) => {
        const matchesName = c.teamName.toLowerCase().includes(searchName.toLowerCase());
        const matchesConf = filterConf === '' || c.confederation === filterConf;
        return matchesName && matchesConf;
      }),
    [champions, searchName, filterConf],
  );

  return (
    <>
      {/* ── Filtros ───────────────────────────────────────────── */}
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
            placeholder="Buscar selección..."
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="w-full bg-[#161925] border border-[#2a2d3a] rounded-lg pl-8 pr-3 py-[7px] text-xs text-[#e8eaf0] placeholder:text-[#8a8fa8] outline-none focus:border-[#e8c84a] transition-colors"
          />
        </div>

        <div className="flex-1 relative">
          <select
            value={filterConf}
            onChange={(e) => setFilterConf(e.target.value)}
            className="w-full appearance-none bg-[#161925] border border-[#2a2d3a] rounded-lg px-3 py-[7px] pr-7 text-xs text-[#e8eaf0] outline-none focus:border-[#e8c84a] transition-colors cursor-pointer"
          >
            <option value="">Todas las confederaciones</option>
            {confOptions.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
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
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8a8fa8] pointer-events-none"
            aria-hidden="true"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>

      {/* ── Tabla ──────────────────────────────────────────────── */}
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-[#2a2d3a]">
            <th className="text-left text-[11px] font-normal text-[#8a8fa8] pb-2 w-9">#</th>
            <th className="text-left text-[11px] font-normal text-[#8a8fa8] pb-2">Selección</th>
            <th className="text-left text-[11px] font-normal text-[#8a8fa8] pb-2">Títulos 🏆</th>
            <th className="text-left text-[11px] font-normal text-[#8a8fa8] pb-2">Confederación</th>
            <th className="text-center text-[11px] font-normal text-[#8a8fa8] pb-2">Detalle</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 && (
            <tr>
              <td colSpan={5} className="py-8 text-center text-sm text-[#8a8fa8]">
                No se encontraron selecciones con esos filtros
              </td>
            </tr>
          )}
          {filtered.map((team) => {
            const confStyle = CONFEDERATION_STYLES[team.confederation];
            const confTooltip = CONFEDERATION_TOOLTIP[team.confederation];
            const isTop3 = team.position <= 3;

            return (
              <tr
                key={team.teamCode}
                className="border-t border-[#1e2233] hover:bg-[#161925] transition-colors duration-150"
              >
                {/* Posición con borde lateral */}
                <td className="py-2.5 relative pl-3.5 pr-2">
                  <div
                    className="absolute left-0 top-0 bottom-0 w-[3px]"
                    style={{ backgroundColor: confStyle?.bar ?? '#3a3d4a' }}
                    aria-hidden="true"
                  />
                  <span
                    className={`text-[11px] ${isTop3 ? 'text-[#e8c84a] font-medium' : 'text-[#8a8fa8]'}`}
                  >
                    {team.position}
                  </span>
                </td>

                {/* Selección */}
                <td className="py-2.5 pr-3">
                  <div className="flex items-center gap-2">
                    <img
                      src={FLAG_URL(team.teamCode)}
                      alt={team.teamName}
                      width={18}
                      height={13}
                      className="rounded-[2px] shrink-0"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    <span className="text-xs text-[#e8eaf0]">{team.teamName}</span>
                  </div>
                </td>

                {/* Títulos con trofeos */}
                <td className="py-2.5 pr-3">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-0.5 flex-wrap">
                      {Array.from({ length: team.titles }).map((_, i) => (
                        <span key={i} className="text-sm leading-none" aria-hidden="true">
                          🏆
                        </span>
                      ))}
                    </div>
                    <span className="text-lg font-medium text-[#e8c84a]">{team.titles}</span>
                  </div>
                </td>

                {/* Confederación */}
                <td className="py-2.5 pr-3">
                  <div className="relative inline-flex group/conf cursor-default">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full border ${confStyle?.pill ?? 'bg-[#1e2233] text-[#8a8fa8] border-[#2a2d3a]'}`}
                    >
                      {team.confederation}
                    </span>
                    {confTooltip && (
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-1 bg-[#1e2233] border border-[#2a2d3a] rounded-md text-[10px] text-[#e8eaf0] whitespace-nowrap opacity-0 group-hover/conf:opacity-100 transition-opacity duration-150 pointer-events-none z-10">
                        {confTooltip}
                        <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#2a2d3a]" />
                      </div>
                    )}
                  </div>
                </td>

                {/* Acción */}
                <td className="py-2.5 text-center">
                  <div className="relative inline-flex group/action">
                    <button
                      onClick={() => setSelectedTeam(team)}
                      className="flex items-center justify-center w-7 h-7 border border-[#2a2d3a] rounded-md text-[#8a8fa8] hover:border-[#e8c84a] hover:text-[#e8c84a] transition-colors focus:outline-none"
                      aria-label={`Ver títulos de ${team.teamName}`}
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
                        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                        <path d="M4 22h16" />
                        <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
                        <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
                        <path d="M18 2H6v7a6 6 0 0 0 12 0V2z" />
                      </svg>
                    </button>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-1 bg-[#1e2233] border border-[#2a2d3a] rounded-md text-[10px] text-[#e8eaf0] whitespace-nowrap opacity-0 group-hover/action:opacity-100 transition-opacity duration-150 pointer-events-none z-10">
                      Ver títulos
                      <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#2a2d3a]" />
                    </div>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Modal */}
      <ChampionshipsModal team={selectedTeam} onClose={() => setSelectedTeam(null)} />
    </>
  );
}
