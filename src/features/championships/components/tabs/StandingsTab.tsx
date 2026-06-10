import type { Standing, MatchResult } from '@/types/standing.types';
import { PERFORMANCE_STYLES } from '@/types/team.types';
import { Tooltip, FlagImage } from '@/components/shared';
import { useTranslation } from 'react-i18next';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatDiff = (diff: number): { label: string; className: string } => {
  if (diff > 0) return { label: `+${diff}`, className: 'text-wc-success' };
  if (diff < 0) return { label: `${diff}`, className: 'text-wc-danger' };
  return { label: '0', className: 'text-wc-text-muted' };
};

const calcPerformance = (points: number, played: number): number => {
  if (played === 0) return 0;
  return Math.round((points / (played * 3)) * 100);
};

// Color de la barra lateral según desempeño
const PERFORMANCE_BAR_COLOR: Record<string, string> = {
  champion: 'var(--wc-accent-gold)',
  runner_up: 'var(--wc-silver-text)',
  third: 'var(--wc-bronze-text)',
  fourth: 'var(--wc-fourth-text)',
  quarters: 'var(--wc-info-text)',
  round_of_16: 'var(--wc-info-text)',
  group_stage: 'var(--wc-surface-tertiary)',
};

// Color de la barra de rendimiento
const PERF_BAR_COLOR: Record<string, string> = {
  champion: 'var(--wc-accent-gold)',
  runner_up: 'var(--wc-info-text)',
  third: 'var(--wc-bronze-text)',
  fourth: 'var(--wc-text-muted)',
  quarters: 'var(--wc-info-text)',
  round_of_16: 'var(--wc-info-text)',
  group_stage: 'var(--wc-text-dim)',
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
      className={`text-right text-[10px] font-normal text-wc-text-muted pb-2 px-2 whitespace-nowrap cursor-default ${className}`}
    >
      <Tooltip content={tooltip} groupName="th">
        <span>{label}</span>
      </Tooltip>
    </th>
  );
}

// ─── Subcomponente: círculos de forma ─────────────────────────────────────────

const FORM_STYLES: Record<MatchResult, { bg: string; labelKey: string }> = {
  W: { bg: 'bg-wc-conf-conmebol-bar', labelKey: 'form.W' },
  D: { bg: 'bg-wc-neutral-border', labelKey: 'form.D' },
  L: { bg: 'bg-wc-danger-border', labelKey: 'form.L' },
};

function FormDots({ form }: { form: MatchResult[] }) {
  const { t } = useTranslation('common');

  return (
    <div className="flex items-center justify-center gap-[3px]">
      {form.map((result, i) => (
        <div
          key={i}
          title={t(FORM_STYLES[result].labelKey)}
          className={`w-2.5 h-2.5 rounded-full shrink-0 ${FORM_STYLES[result].bg}`}
          aria-label={t(FORM_STYLES[result].labelKey)}
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
  const { t } = useTranslation('common');
  const sorted = [...standings].sort((a, b) => a.position - b.position);

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse" style={{ minWidth: '720px' }}>
        <thead>
          <tr className="border-b border-wc-border-primary">
            <th className="text-left text-[10px] font-normal text-wc-text-muted pb-2 w-8">#</th>
            <th className="text-left text-[10px] font-normal text-wc-text-muted pb-2 pr-3">
              {t('labels.team')}
            </th>
            <Th label="PTS" tooltip={t('standingMetrics.points')} />
            <Th label="PJ" tooltip={t('standingMetrics.played')} />
            <Th label="PG" tooltip={t('standingMetrics.won')} />
            <Th label="PE" tooltip={t('standingMetrics.drawn')} />
            <Th label="PP" tooltip={t('standingMetrics.lost')} />
            <Th label="GF" tooltip={t('standingMetrics.goalsFor')} />
            <Th label="GC" tooltip={t('standingMetrics.goalsAgainst')} />
            <Th label="DIF" tooltip={t('standingMetrics.goalDiff')} />
            <Th
              label={t('standingMetrics.performanceShort')}
              tooltip={t('standingMetrics.performance')}
              className="min-w-[80px]"
            />
            <th className="text-left text-[10px] font-normal text-wc-text-muted pb-2 pl-2 min-w-[120px]">
              {t('labels.performance')}
            </th>
            <th className="text-center text-[10px] font-normal text-wc-text-muted pb-2 min-w-[90px]">
              {t('labels.form')}
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
                      countryCode={row.teamCode}
                      alt={row.teamName}
                      width={16}
                      height={11}
                      className="rounded-[1px] shrink-0"
                    />
                    <span className="text-xs text-wc-text-primary">{row.teamName}</span>
                  </div>
                </td>

                {/* PTS */}
                <td className="py-2 px-2 text-right">
                  <span className="text-xs font-medium text-wc-text-primary">{row.points}</span>
                </td>

                {/* PJ PG PE PP */}
                <td className="py-2 px-2 text-right text-xs text-wc-text-muted">{row.played}</td>
                <td className="py-2 px-2 text-right text-xs text-wc-text-muted">{row.won}</td>
                <td className="py-2 px-2 text-right text-xs text-wc-text-muted">{row.drawn}</td>
                <td className="py-2 px-2 text-right text-xs text-wc-text-muted">{row.lost}</td>

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
                      className={`text-[10px] px-2 py-0.5 rounded-full border whitespace-nowrap ${PERFORMANCE_STYLES[row.performance]}`}
                    >
                      {t(`performance.${row.performance}`)}
                    </span>
                    {row.isHost && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full border bg-wc-lavender-surface text-wc-lavender-text border-wc-lavender-border whitespace-nowrap">
                        {t('performance.host')}
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
