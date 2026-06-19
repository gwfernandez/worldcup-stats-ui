import type { HistoricalStanding } from '@/types/historicalStanding.types';
import { CONFEDERATION_STYLES } from '@/types/historicalStanding.types';
import { CONFEDERATION_TOOLTIP } from '@/types/team.types';
import { SearchInput, FilterSelect, Tooltip, FlagImage } from '@/components/shared';
import { useTranslation } from 'react-i18next';
import { useUIStore } from '@/store/ui.store';

const formatDiff = (diff: number): { label: string; className: string } => {
  if (diff > 0) return { label: `+${diff}`, className: 'text-wc-success' };
  if (diff < 0) return { label: `${diff}`, className: 'text-wc-danger' };
  return { label: '0', className: 'text-wc-text-muted' };
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
      className={`text-right text-[10px] font-normal text-wc-text-muted pb-2 px-2 whitespace-nowrap cursor-default ${className}`}
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

const CONFEDERATION_OPTIONS = ['AFC', 'CAF', 'CONCACAF', 'CONMEBOL', 'OFC', 'UEFA'];

// ─── Componente ───────────────────────────────────────────────────────────────

/**
 * Tabla de posiciones históricas con filtros por nombre y confederación.
 * Incluye borde lateral por confederación, rendimiento y pill de confederación con tooltip.
 */
export function HistoricalStandingsTable({ standings }: HistoricalStandingsTableProps) {
  const { t } = useTranslation('common');
  const filters = useUIStore((state) => state.filters.historicalStandings);
  const setFilter = useUIStore((state) => state.setFilter);
  const searchName = filters?.name ?? '';
  const filterConf = filters?.confederation ?? '';

  return (
    <div>
      {/* ── Filtros ──────────────────────────────────────────── */}
      <div className="flex gap-2.5 mb-4">
        <SearchInput
          className="flex-[2]"
          placeholder={t('search.team')}
          value={searchName}
          onChange={(e) => setFilter('historicalStandings', 'name', e.target.value)}
        />
        <FilterSelect
          className="flex-1"
          value={filterConf}
          onChange={(e) => setFilter('historicalStandings', 'confederation', e.target.value)}
          placeholderOption={t('filters.allConfederations')}
          options={CONFEDERATION_OPTIONS.map((code) => ({ value: code, label: code }))}
        />
      </div>

      {/* ── Tabla ─────────────────────────────────────────────── */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse" style={{ minWidth: '700px' }}>
          <thead>
            <tr className="border-b border-wc-border-primary">
              <th className="text-left text-[10px] font-normal text-wc-text-muted pb-2 w-9">#</th>
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
              <Th
                label={t('standingMetrics.abbreviations.won')}
                tooltip={t('standingMetrics.won')}
              />
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
              <th className="text-center text-[10px] font-normal text-wc-text-muted pb-2 px-2 whitespace-nowrap cursor-default min-w-[110px]">
                <Tooltip content={t('standingMetrics.performanceTooltip')} groupName="th">
                  <span>{t('standingMetrics.performance')}</span>
                </Tooltip>
              </th>
              <th className="text-center text-[10px] font-normal text-wc-text-muted pb-2 min-w-[90px]">
                {t('labels.confederation')}
              </th>
            </tr>
          </thead>
          <tbody>
            {standings.length === 0 && (
              <tr>
                <td colSpan={12} className="py-8 text-center text-sm text-wc-text-muted">
                  {t('empty.teams')}
                </td>
              </tr>
            )}
            {standings.map((row) => {
              const diff = formatDiff(row.goalDifference);
              const perfPct = calcPerformance(row.unifiedPoints, row.matchesPlayed);
              const confStyle = CONFEDERATION_STYLES[row.confederationCode];
              const confTooltip = CONFEDERATION_TOOLTIP[row.confederationCode] ?? '';

              return (
                <tr
                  key={row.team.code}
                  className="border-t border-wc-surface-secondary hover:bg-wc-surface-primary transition-colors duration-150"
                >
                  {/* Posición con borde lateral */}
                  <td className="py-2 relative pl-3.5 pr-2">
                    <div
                      className="absolute left-0 top-0 bottom-0 w-[3px]"
                      style={{ backgroundColor: confStyle?.bar ?? 'var(--wc-surface-tertiary)' }}
                      aria-hidden="true"
                    />
                    <span className="text-[11px] text-wc-text-muted">{row.unifiedPosition}</span>
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
                    <span className="text-xs font-medium text-wc-text-primary">
                      {row.unifiedPoints}
                    </span>
                  </td>

                  {/* PJ PG PE PP */}
                  <td className="py-2 px-2 text-right text-xs text-wc-text-muted">
                    {row.matchesPlayed}
                  </td>
                  <td className="py-2 px-2 text-right text-xs text-wc-text-muted">{row.wins}</td>
                  <td className="py-2 px-2 text-right text-xs text-wc-text-muted">{row.draws}</td>
                  <td className="py-2 px-2 text-right text-xs text-wc-text-muted">{row.losses}</td>

                  {/* GF GC */}
                  <td className="py-2 px-2 text-right text-xs text-wc-text-muted">
                    {row.goalsFor}
                  </td>
                  <td className="py-2 px-2 text-right text-xs text-wc-text-muted">
                    {row.goalsAgainst}
                  </td>

                  {/* DIF */}
                  <td className={`py-2 px-2 text-right text-xs ${diff.className}`}>{diff.label}</td>

                  {/* Rendimiento */}
                  <td className="py-2 px-2">
                    <div className="flex items-center justify-center gap-1.5">
                      <div className="w-9 h-[3px] bg-wc-border-primary rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-wc-accent-gold"
                          style={{ width: `${perfPct}%` }}
                          data-testid="performance-bar"
                        />
                      </div>
                      <span className="text-[11px] text-wc-text-muted min-w-[30px] text-center">
                        {perfPct}%
                      </span>
                    </div>
                  </td>

                  {/* Confederación */}
                  <td className="py-2 text-center">
                    <Tooltip content={confTooltip} groupName="conf" hideWhenEmpty>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full border ${confStyle?.pill ?? 'bg-wc-surface-secondary text-wc-text-muted border-wc-border-primary'}`}
                      >
                        {row.confederationCode}
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
