import { useState, useMemo } from 'react';
import type { HistoricalStanding } from '@/types/historicalStanding.types';
import { CONFEDERATION_STYLES, CONFEDERATION_TOOLTIP } from '@/types/historicalStanding.types';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const FLAG_URL = (code: string) => `https://flagcdn.com/24x18/${code.toLowerCase()}.png`;

const formatDiff = (diff: number): { label: string; className: string } => {
  if (diff > 0) return { label: `+${diff}`, className: 'text-[#8fc44a]' };
  if (diff < 0) return { label: `${diff}`, className: 'text-[#d46060]' };
  return { label: '0', className: 'text-[#8a8fa8]' };
};

const calcPerformance = (points: number, played: number): number => {
  if (played === 0) return 0;
  return Math.round((points / (played * 3)) * 100);
};

// ─── Subcomponente: Th con tooltip ────────────────────────────────────────────

function Th({
  label,
  tooltip,
  className = '',
}: {
  label: string;
  tooltip: string;
  className?: string;
}) {
  return (
    <th
      className={`text-right text-[10px] font-normal text-[#8a8fa8] pb-2 px-2 whitespace-nowrap cursor-default relative group/th ${className}`}
    >
      {label}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-1 bg-[#1e2233] border border-[#2a2d3a] rounded-md text-[10px] text-[#e8eaf0] whitespace-nowrap opacity-0 group-hover/th:opacity-100 transition-opacity duration-150 pointer-events-none z-10">
        {tooltip}
        <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#2a2d3a]" />
      </div>
    </th>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────

export interface HistoricalStandingsTableProps {
  standings: HistoricalStanding[];
}

// ─── Componente ───────────────────────────────────────────────────────────────

/**
 * Tabla de posiciones históricas con filtros por nombre y confederación.
 * Incluye borde lateral por confederación, rendimiento y pill de confederación con tooltip.
 */
export function HistoricalStandingsTable({ standings }: HistoricalStandingsTableProps) {
  const [searchName, setSearchName] = useState('');
  const [filterConf, setFilterConf] = useState('');

  const confOptions = useMemo(
    () => [...new Set(standings.map((s) => s.confederation))].sort(),
    [standings],
  );

  const filtered = useMemo(
    () =>
      standings.filter((s) => {
        const matchesName = s.teamName.toLowerCase().includes(searchName.toLowerCase());
        const matchesConf = filterConf === '' || s.confederation === filterConf;
        return matchesName && matchesConf;
      }),
    [standings, searchName, filterConf],
  );

  return (
    <div>
      {/* ── Filtros ──────────────────────────────────────────── */}
      <div className="flex gap-2.5 mb-4">
        {/* Búsqueda */}
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

        {/* Confederación */}
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

      {/* ── Tabla ─────────────────────────────────────────────── */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse" style={{ minWidth: '700px' }}>
          <thead>
            <tr className="border-b border-[#2a2d3a]">
              <th className="text-left text-[10px] font-normal text-[#8a8fa8] pb-2 w-9">#</th>
              <th className="text-left text-[10px] font-normal text-[#8a8fa8] pb-2 pr-3">
                Selección
              </th>
              <Th label="PTS" tooltip="Puntos" />
              <Th label="PJ" tooltip="Partidos Jugados" />
              <Th label="PG" tooltip="Partidos Ganados" />
              <Th label="PE" tooltip="Partidos Empatados" />
              <Th label="PP" tooltip="Partidos Perdidos" />
              <Th label="GF" tooltip="Goles a Favor" />
              <Th label="GC" tooltip="Goles en Contra" />
              <Th label="DIF" tooltip="Diferencia de Goles" />
              <Th label="Rend." tooltip="Rendimiento (%)" className="min-w-[80px]" />
              <th className="text-center text-[10px] font-normal text-[#8a8fa8] pb-2 min-w-[90px]">
                Conf.
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={12} className="py-8 text-center text-sm text-[#8a8fa8]">
                  No se encontraron selecciones con esos filtros
                </td>
              </tr>
            )}
            {filtered.map((row) => {
              const diff = formatDiff(row.goalDiff);
              const perfPct = calcPerformance(row.points, row.played);
              const confStyle = CONFEDERATION_STYLES[row.confederation];
              const confTooltip = CONFEDERATION_TOOLTIP[row.confederation];

              return (
                <tr
                  key={row.teamCode}
                  className="border-t border-[#1e2233] hover:bg-[#161925] transition-colors duration-150"
                >
                  {/* Posición con borde lateral */}
                  <td className="py-2 relative pl-3.5 pr-2">
                    <div
                      className="absolute left-0 top-0 bottom-0 w-[3px]"
                      style={{ backgroundColor: confStyle?.bar ?? '#3a3d4a' }}
                      aria-hidden="true"
                    />
                    <span className="text-[11px] text-[#8a8fa8]">{row.position}</span>
                  </td>

                  {/* Selección */}
                  <td className="py-2 pr-3">
                    <div className="flex items-center gap-2">
                      <img
                        src={FLAG_URL(row.teamCode)}
                        alt={row.teamName}
                        width={16}
                        height={11}
                        className="rounded-[1px] shrink-0"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                      <span className="text-xs text-[#e8eaf0]">{row.teamName}</span>
                    </div>
                  </td>

                  {/* PTS */}
                  <td className="py-2 px-2 text-right">
                    <span className="text-xs font-medium text-[#e8eaf0]">{row.points}</span>
                  </td>

                  {/* PJ PG PE PP */}
                  <td className="py-2 px-2 text-right text-xs text-[#8a8fa8]">{row.played}</td>
                  <td className="py-2 px-2 text-right text-xs text-[#8a8fa8]">{row.won}</td>
                  <td className="py-2 px-2 text-right text-xs text-[#8a8fa8]">{row.drawn}</td>
                  <td className="py-2 px-2 text-right text-xs text-[#8a8fa8]">{row.lost}</td>

                  {/* GF GC */}
                  <td className="py-2 px-2 text-right text-xs text-[#8a8fa8]">{row.goalsFor}</td>
                  <td className="py-2 px-2 text-right text-xs text-[#8a8fa8]">
                    {row.goalsAgainst}
                  </td>

                  {/* DIF */}
                  <td className={`py-2 px-2 text-right text-xs ${diff.className}`}>{diff.label}</td>

                  {/* Rendimiento */}
                  <td className="py-2 px-2">
                    <div className="flex items-center justify-end gap-1.5">
                      <div className="w-9 h-[3px] bg-[#2a2d3a] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${perfPct}%`,
                            backgroundColor: confStyle?.perfBar ?? '#4a78d4',
                          }}
                        />
                      </div>
                      <span className="text-[11px] text-[#8a8fa8] min-w-[30px] text-right">
                        {perfPct}%
                      </span>
                    </div>
                  </td>

                  {/* Confederación */}
                  <td className="py-2 text-center">
                    <div className="relative inline-flex group/conf cursor-default">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full border ${confStyle?.pill ?? 'bg-[#1e2233] text-[#8a8fa8] border-[#2a2d3a]'}`}
                      >
                        {row.confederation}
                      </span>
                      {confTooltip && (
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-1 bg-[#1e2233] border border-[#2a2d3a] rounded-md text-[10px] text-[#e8eaf0] whitespace-nowrap opacity-0 group-hover/conf:opacity-100 transition-opacity duration-150 pointer-events-none z-10">
                          {confTooltip}
                          <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#2a2d3a]" />
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
