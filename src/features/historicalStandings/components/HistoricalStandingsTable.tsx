import { useState, useMemo } from 'react';
import type { HistoricalStanding } from '@/types/historicalStanding.types';
import { CONFEDERATION_STYLES, CONFEDERATION_TOOLTIP } from '@/types/historicalStanding.types';
import { SearchInput, FilterSelect, Tooltip, FlagImage } from '@/components/shared';

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
      className={`text-right text-[10px] font-normal text-[#8a8fa8] pb-2 px-2 whitespace-nowrap cursor-default ${className}`}
    >
      <Tooltip content={tooltip} groupName="th">
        <span>{label}</span>
      </Tooltip>
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
        <SearchInput
          className="flex-[2]"
          placeholder="Buscar selección..."
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />
        <FilterSelect
          className="flex-1"
          value={filterConf}
          onChange={(e) => setFilterConf(e.target.value)}
          placeholderOption="Todas las confederaciones"
          options={confOptions.map((c) => ({ value: c, label: c }))}
        />
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
              const confTooltip = CONFEDERATION_TOOLTIP[row.confederation] ?? '';

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
                      <FlagImage
                        countryCode={row.teamCode}
                        alt={row.teamName}
                        width={16}
                        height={11}
                        className="rounded-[1px] shrink-0"
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
                    <Tooltip content={confTooltip} groupName="conf" hideWhenEmpty>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full border ${confStyle?.pill ?? 'bg-[#1e2233] text-[#8a8fa8] border-[#2a2d3a]'}`}
                      >
                        {row.confederation}
                      </span>
                    </Tooltip>
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
