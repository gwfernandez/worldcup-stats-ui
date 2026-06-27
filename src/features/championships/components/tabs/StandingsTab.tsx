import type { ChampionshipTeamStageReached } from '@/types/team.types';
import { Tooltip, FlagImage, TableSkeleton, StandingsLegend } from '@/components/shared';
import { useChampionshipStandings } from '../../hooks/useChampionshipStandings';
import { calcPerformance } from './standingsTab.utils';
import { useTranslation } from 'react-i18next';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatDiff = (diff: number): { label: string; className: string } => {
  if (diff > 0) return { label: `+${diff}`, className: 'text-wc-success' };
  if (diff < 0) return { label: `${diff}`, className: 'text-wc-danger' };
  return { label: '0', className: 'text-wc-text-muted' };
};

// Color de la barra lateral según desempeño
const PERFORMANCE_BAR_COLOR: Partial<Record<ChampionshipTeamStageReached, string>> = {
  champion: 'var(--wc-accent-gold)',
  runner_up: 'var(--wc-silver-text)',
  third_place: 'var(--wc-bronze-text)',
  fourth_place: 'var(--wc-fourth-text)',
  quarterfinal: 'var(--wc-info-text)',
  quarter_finals: 'var(--wc-info-text)',
  semi_finals: 'var(--wc-info-text)',
  final: 'var(--wc-info-text)',
  round_of_16: 'var(--wc-info-text)',
  second_group_stage: 'var(--wc-surface-tertiary)',
  group_stage: 'var(--wc-surface-tertiary)',
};

// Color de la barra de rendimiento
const PERF_BAR_COLOR: Partial<Record<ChampionshipTeamStageReached, string>> = {
  champion: 'var(--wc-accent-gold)',
  runner_up: 'var(--wc-info-text)',
  third_place: 'var(--wc-bronze-text)',
  fourth_place: 'var(--wc-text-muted)',
  quarterfinal: 'var(--wc-info-text)',
  quarter_finals: 'var(--wc-info-text)',
  semi_finals: 'var(--wc-info-text)',
  final: 'var(--wc-info-text)',
  round_of_16: 'var(--wc-info-text)',
  second_group_stage: 'var(--wc-text-dim)',
  group_stage: 'var(--wc-text-dim)',
};

const PERFORMANCE_STYLES: Partial<Record<ChampionshipTeamStageReached, string>> = {
  champion: 'bg-wc-success-surface text-wc-accent-gold border-wc-success-border',
  runner_up: 'bg-wc-surface-secondary text-wc-silver-text border-wc-silver-border',
  third_place: 'bg-wc-position-midfielder-surface text-wc-bronze-text border-wc-bronze-border',
  fourth_place: 'bg-wc-position-midfielder-surface text-wc-fourth-text border-wc-fourth-border',
  quarterfinal: 'bg-wc-info-surface text-wc-info-text border-wc-info-border',
  quarter_finals: 'bg-wc-info-surface text-wc-info-text border-wc-info-border',
  semi_finals: 'bg-wc-info-surface text-wc-info-text border-wc-info-border',
  final: 'bg-wc-info-surface text-wc-info-text border-wc-info-border',
  round_of_16: 'bg-wc-info-surface text-wc-info-text border-wc-info-border',
  second_group_stage: 'bg-wc-surface-primary text-wc-text-muted border-wc-border-primary',
  group_stage: 'bg-wc-surface-primary text-wc-text-muted border-wc-border-primary',
};

const DEFAULT_PERFORMANCE_STYLE =
  'bg-wc-surface-primary text-wc-text-muted border-wc-border-primary';
const DEFAULT_PERFORMANCE_BAR_COLOR = 'var(--wc-surface-tertiary)';
const DEFAULT_PERF_BAR_COLOR = 'var(--wc-text-dim)';

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
      className={`text-right text-[10px] font-normal text-wc-text-muted pb-2 px-2 whitespace-nowrap cursor-default ${className}`}
    >
      <Tooltip content={tooltip} groupName="th">
        <span>{label}</span>
      </Tooltip>
    </th>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────

export interface StandingsTabProps {
  year: number;
  hostCodes: string[];
}

// ─── Componente ───────────────────────────────────────────────────────────────

/**
 * Solapa de posiciones del mundial.
 * Tabla completa sin paginado con todas las selecciones participantes.
 * Incluye borde lateral por desempeño, barra de rendimiento y pills.
 */
export function StandingsTab({ year, hostCodes }: StandingsTabProps) {
  const { t } = useTranslation(['common', 'championships']);
  const { standings, isLoading, isError } = useChampionshipStandings(year);
  const sorted = [...standings].sort((a, b) => a.position - b.position);
  const hostCodeSet = new Set(hostCodes.map((code) => code.toUpperCase()));

  if (isLoading) {
    return <TableSkeleton cols={11} rows={8} showPagination={false} />;
  }

  if (isError) {
    return (
      <p className="py-8 text-center text-sm text-wc-danger-text">
        {t('championships:standings.loadError')}
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse" style={{ minWidth: '660px' }}>
        <thead>
          <tr className="border-b border-wc-border-primary">
            <th className="text-left text-[10px] font-normal text-wc-text-muted pb-2 w-8">#</th>
            <th className="text-left text-[10px] font-normal text-wc-text-muted pb-2 pr-3">
              {t('labels.team')}
            </th>
            <Th
              label={t('standingMetrics.abbreviations.points')}
              tooltip={t('standingMetrics.points')}
            />
            <Th
              label={t('standingMetrics.abbreviations.played')}
              tooltip={t('standingMetrics.played')}
            />
            <Th label={t('standingMetrics.abbreviations.won')} tooltip={t('standingMetrics.won')} />
            <Th
              label={t('standingMetrics.abbreviations.drawn')}
              tooltip={t('standingMetrics.drawn')}
            />
            <Th
              label={t('standingMetrics.abbreviations.lost')}
              tooltip={t('standingMetrics.lost')}
            />
            <Th
              label={t('standingMetrics.abbreviations.goalsFor')}
              tooltip={t('standingMetrics.goalsFor')}
            />
            <Th
              label={t('standingMetrics.abbreviations.goalsAgainst')}
              tooltip={t('standingMetrics.goalsAgainst')}
            />
            <Th
              label={t('standingMetrics.abbreviations.goalDiff')}
              tooltip={t('standingMetrics.goalDiff')}
            />
            <Th
              label={t('standingMetrics.performanceShort')}
              tooltip={t('standingMetrics.performance')}
              className="min-w-[80px]"
            />
            <th className="text-left text-[10px] font-normal text-wc-text-muted pb-2 pl-2 min-w-[120px]">
              {t('labels.performance')}
            </th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((row) => {
            const diff = formatDiff(row.goalDifference);
            const perfPct = calcPerformance(row.points, row.matchesPlayed, year);
            const barColor = PERF_BAR_COLOR[row.performance] ?? DEFAULT_PERF_BAR_COLOR;
            const accentColor =
              PERFORMANCE_BAR_COLOR[row.performance] ?? DEFAULT_PERFORMANCE_BAR_COLOR;
            const isHost = hostCodeSet.has(row.team.code.toUpperCase());
            const performanceStyle =
              PERFORMANCE_STYLES[row.performance] ?? DEFAULT_PERFORMANCE_STYLE;
            const performanceLabel =
              row.performance === '' ? '—' : t(`common:performance.${row.performance}`);

            return (
              <tr
                key={row.team.code}
                className="border-t border-wc-surface-secondary hover:bg-wc-surface-primary transition-colors duration-150"
              >
                {/* Posición con borde lateral */}
                <td className="py-2 relative pl-3.5 pr-2">
                  <div
                    className="absolute left-0 top-0 bottom-0 w-[3px]"
                    style={{ backgroundColor: accentColor }}
                    aria-hidden="true"
                  />
                  <span className="text-[11px] text-wc-text-muted">{row.position}</span>
                </td>

                {/* Selección */}
                <td className="py-2 pr-3">
                  <div className="flex items-center gap-2">
                    <FlagImage
                      countryCode={row.team.code}
                      alt={row.team.name}
                      width={16}
                      height={11}
                      className="rounded-[1px] shrink-0"
                    />
                    <span className="text-xs text-wc-text-primary">{row.team.name}</span>
                  </div>
                </td>

                {/* PTS */}
                <td className="py-2 px-2 text-right">
                  <span className="text-xs font-medium text-wc-text-primary">{row.points}</span>
                </td>

                {/* PJ PG PE PP */}
                <td className="py-2 px-2 text-right text-xs text-wc-text-muted">
                  {row.matchesPlayed}
                </td>
                <td className="py-2 px-2 text-right text-xs text-wc-text-muted">{row.wins}</td>
                <td className="py-2 px-2 text-right text-xs text-wc-text-muted">{row.draws}</td>
                <td className="py-2 px-2 text-right text-xs text-wc-text-muted">{row.losses}</td>

                {/* GF GC */}
                <td className="py-2 px-2 text-right text-xs text-wc-text-muted">{row.goalsFor}</td>
                <td className="py-2 px-2 text-right text-xs text-wc-text-muted">
                  {row.goalsAgainst}
                </td>

                {/* DIF */}
                <td className={`py-2 px-2 text-right text-xs ${diff.className}`}>{diff.label}</td>

                {/* Rendimiento */}
                <td className="py-2 px-2">
                  <div className="flex items-center justify-end gap-1.5">
                    <div className="w-9 h-[3px] bg-wc-border-primary rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${perfPct}%`, backgroundColor: barColor }}
                      />
                    </div>
                    <span className="text-[11px] text-wc-text-muted min-w-[28px] text-right">
                      {perfPct}%
                    </span>
                  </div>
                </td>

                {/* Desempeño */}
                <td className="py-2 pl-2 pr-3">
                  <div className="flex items-center gap-1 flex-wrap">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full border whitespace-nowrap ${performanceStyle}`}
                    >
                      {performanceLabel}
                    </span>
                    {isHost && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full border bg-wc-lavender-surface text-wc-lavender-text border-wc-lavender-border whitespace-nowrap">
                        {t('performance.host')}
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <StandingsLegend mode="year" year={year} />
    </div>
  );
}
