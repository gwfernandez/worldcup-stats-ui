import type { Standing, MatchResult } from '@/types/standing.types';
import { PERFORMANCE_LABEL, PERFORMANCE_STYLES } from '@/types/team.types';

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

// Color de la barra lateral según desempeño
const PERFORMANCE_BAR_COLOR: Record<string, string> = {
  champion: '#e8c84a',
  runner_up: '#c0c8e0',
  third: '#c8a050',
  fourth: '#a09070',
  quarters: '#8a9fc0',
  round_of_16: '#8a9fc0',
  group_stage: '#3a3d4a',
};

// Color de la barra de rendimiento
const PERF_BAR_COLOR: Record<string, string> = {
  champion: '#e8c84a',
  runner_up: '#8a9fc0',
  third: '#c8a050',
  fourth: '#8a8fa8',
  quarters: '#8a9fc0',
  round_of_16: '#8a9fc0',
  group_stage: '#6a6d7a',
};

// ─── Subcomponente: tooltip en th ─────────────────────────────────────────────

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
      className={`text-right text-[10px] font-normal text-[#8a8fa8] pb-2 px-2 relative group/th whitespace-nowrap cursor-default ${className}`}
    >
      {label}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-1 bg-[#1e2233] border border-[#2a2d3a] rounded-md text-[10px] text-[#e8eaf0] whitespace-nowrap opacity-0 group-hover/th:opacity-100 transition-opacity duration-150 pointer-events-none z-10">
        {tooltip}
        <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#2a2d3a]" />
      </div>
    </th>
  );
}

// ─── Subcomponente: círculos de forma ─────────────────────────────────────────

const FORM_STYLES: Record<MatchResult, { bg: string; label: string }> = {
  W: { bg: 'bg-[#4a9a4a]', label: 'Victoria' },
  D: { bg: 'bg-[#4a4a5a]', label: 'Empate' },
  L: { bg: 'bg-[#9a3a3a]', label: 'Derrota' },
};

function FormDots({ form }: { form: MatchResult[] }) {
  return (
    <div className="flex items-center justify-center gap-[3px]">
      {form.map((result, i) => (
        <div
          key={i}
          title={FORM_STYLES[result].label}
          className={`w-2.5 h-2.5 rounded-full shrink-0 ${FORM_STYLES[result].bg}`}
          aria-label={FORM_STYLES[result].label}
        />
      ))}
    </div>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────

export interface StandingsTabProps {
  standings: Standing[];
}

// ─── Componente ───────────────────────────────────────────────────────────────

/**
 * Solapa de posiciones del mundial.
 * Tabla completa sin paginado con todas las selecciones participantes.
 * Incluye borde lateral por desempeño, barra de rendimiento, forma y pills.
 */
export function StandingsTab({ standings }: StandingsTabProps) {
  const sorted = [...standings].sort((a, b) => a.position - b.position);

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse" style={{ minWidth: '720px' }}>
        <thead>
          <tr className="border-b border-[#2a2d3a]">
            <th className="text-left text-[10px] font-normal text-[#8a8fa8] pb-2 w-8">#</th>
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
            <th className="text-left text-[10px] font-normal text-[#8a8fa8] pb-2 pl-2 min-w-[120px]">
              Desempeño
            </th>
            <th className="text-center text-[10px] font-normal text-[#8a8fa8] pb-2 min-w-[90px]">
              Forma
            </th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((row) => {
            const diff = formatDiff(row.goalDiff);
            const perfPct = calcPerformance(row.points, row.played);
            const barColor = PERF_BAR_COLOR[row.performance];
            const accentColor = PERFORMANCE_BAR_COLOR[row.performance];

            return (
              <tr
                key={row.teamCode}
                className="border-t border-[#1e2233] hover:bg-[#161925] transition-colors duration-150"
              >
                {/* Posición con borde lateral */}
                <td className="py-2 relative pl-3.5 pr-2">
                  <div
                    className="absolute left-0 top-0 bottom-0 w-[3px]"
                    style={{ backgroundColor: accentColor }}
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
                <td className="py-2 px-2 text-right text-xs text-[#8a8fa8]">{row.goalsAgainst}</td>

                {/* DIF */}
                <td className={`py-2 px-2 text-right text-xs ${diff.className}`}>{diff.label}</td>

                {/* Rendimiento */}
                <td className="py-2 px-2">
                  <div className="flex items-center justify-end gap-1.5">
                    <div className="w-9 h-[3px] bg-[#2a2d3a] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${perfPct}%`, backgroundColor: barColor }}
                      />
                    </div>
                    <span className="text-[11px] text-[#8a8fa8] min-w-[28px] text-right">
                      {perfPct}%
                    </span>
                  </div>
                </td>

                {/* Desempeño */}
                <td className="py-2 pl-2 pr-3">
                  <div className="flex items-center gap-1 flex-wrap">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full border whitespace-nowrap ${PERFORMANCE_STYLES[row.performance]}`}
                    >
                      {PERFORMANCE_LABEL[row.performance]}
                    </span>
                    {row.isHost && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full border bg-[#1e1e2e] text-[#9090d0] border-[#3a3a60] whitespace-nowrap">
                        🏠 Anfitrión
                      </span>
                    )}
                  </div>
                </td>

                {/* Forma */}
                <td className="py-2 text-center">
                  <FormDots form={row.form} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
