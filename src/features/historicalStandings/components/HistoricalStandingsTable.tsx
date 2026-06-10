import { useState, useMemo } from 'react';
import type { HistoricalStanding } from '@/types/historicalStanding.types';
import { CONFEDERATION_STYLES } from '@/types/historicalStanding.types';
import { CONFEDERATION_TOOLTIP } from '@/types/team.types';
import { SearchInput, FilterSelect, Tooltip, FlagImage } from '@/components/shared';
import { useTranslation } from 'react-i18next';

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

// ─── Componente ───────────────────────────────────────────────────────────────

/**
 * Tabla de posiciones históricas con filtros por nombre y confederación.
 * Incluye borde lateral por confederación, rendimiento y pill de confederación con tooltip.
 */
export function HistoricalStandingsTable({ standings }: HistoricalStandingsTableProps) {
  const { t } = useTranslation('common');
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
          placeholder={t('search.team')}
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />
        <FilterSelect
          className="flex-1"
          value={filterConf}
          onChange={(e) => setFilterConf(e.target.value)}
          placeholderOption={t('filters.allConfederations')}
          options={confOptions.map((c) => ({ value: c, label: c }))}
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
              <Th label="PTS" tooltip={t('standingMetrics.points')} />
              <Th label="PJ" tooltip={t('standingMetrics.played')} />
              <Th label="PG" tooltip={t('standingMetrics.won')} />
              <Th label="PE" tooltip={t('standingMetrics.drawn')} />
              <Th label="PP" tooltip={t('standingMetrics.lost')} />
              <Th label="GF" tooltip={t('standingMetrics.goalsFor')} />
              <Th label="GC" tooltip={t('standingMetrics.goalsAgainst')} />
              <Th label="DIF" tooltip={t('standingMetrics.goalDiff')} />
              <Th label={t('standingMetrics.performanceShort')} tooltip={t('standingMetrics.performance')} className="min-w-[80px]" />
              <th className="text-center text-[10px] font-normal text-wc-text-muted pb-2 min-w-[90px]">
                Conf.
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={12} className="py-8 text-center text-sm text-wc-text-muted">
                  {t('empty.teams')}
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
                  className="border-t border-wc-surface-secondary hover:bg-wc-surface-primary transition-colors duration-150"
                >
                  {/* Posición con borde lateral */}
                  <td className="py-2 relative pl-3.5 pr-2">
                    <div
                      className="absolute left-0 top-0 bottom-0 w-[3px]"
                      style={{ backgroundColor: confStyle?.bar ?? 'var(--wc-surface-tertiary)' }}
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
                    <div className="flex items-center justify-end gap-1.5">
                      <div className="w-9 h-[3px] bg-wc-border-primary rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${perfPct}%`,
                            backgroundColor: confStyle?.perfBar ?? 'var(--wc-conf-uefa-bar)',
                          }}
                        />
                      </div>
                      <span className="text-[11px] text-wc-text-muted min-w-[30px] text-right">
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
