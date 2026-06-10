import type { GroupStanding } from '@/types/championship.types';
import { FlagImage } from '@/components/shared';
import { useTranslation } from 'react-i18next';

const formatDiff = (diff: number): string => (diff > 0 ? `+${diff}` : `${diff}`);

// ─── Props ────────────────────────────────────────────────────────────────────

export interface GroupStandingsTableProps {
  standings: GroupStanding[];
}

// ─── Columnas ─────────────────────────────────────────────────────────────────

const COLS = [
  { key: 'points', label: 'Pts', titleKey: 'standingMetrics.points' },
  { key: 'played', label: 'J', titleKey: 'standingMetrics.played' },
  { key: 'won', label: 'G', titleKey: 'standingMetrics.won' },
  { key: 'drawn', label: 'E', titleKey: 'standingMetrics.drawn' },
  { key: 'lost', label: 'P', titleKey: 'standingMetrics.lost' },
  { key: 'goalsFor', label: 'GF', titleKey: 'standingMetrics.goalsFor' },
  { key: 'goalsAgainst', label: 'GC', titleKey: 'standingMetrics.goalsAgainst' },
  { key: 'goalDiff', label: 'Dif', titleKey: 'standingMetrics.goalDiff' },
] as const;

// ─── Componente ───────────────────────────────────────────────────────────────

/**
 * Tabla de posiciones de un grupo con columnas Pts, J, G, E, P, GF, GC, Dif.
 * Los equipos clasificados se resaltan en verde.
 */
export function GroupStandingsTable({ standings }: GroupStandingsTableProps) {
  const { t } = useTranslation('common');

  return (
    <table className="w-full border-collapse text-[11px]" style={{ tableLayout: 'fixed' }}>
      <colgroup>
        <col style={{ width: '38%' }} />
        {COLS.map((c) => (
          <col key={c.key} style={{ width: `${62 / COLS.length}%` }} />
        ))}
      </colgroup>

      <thead>
        <tr className="border-b border-wc-border-primary">
          <th className="text-left text-[10px] text-wc-text-muted font-normal py-[5px] pl-[10px] pr-1">
            {t('labels.team')}
          </th>
          {COLS.map((c) => (
            <th
              key={c.key}
              title={t(c.titleKey)}
              className="text-right text-[10px] text-wc-text-muted font-normal py-[5px] px-1"
            >
              {c.label}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {standings.map((row) => {
          const textColor = row.qualified ? 'text-wc-success' : 'text-wc-text-primary';
          return (
            <tr key={row.teamCode} className="border-t border-wc-surface-secondary">
              <td className={`py-[5px] pl-[10px] pr-1 ${textColor}`}>
                <div className="flex items-center gap-1.5 overflow-hidden">
                  <span className="text-[10px] text-wc-text-muted shrink-0 w-3">
                    {row.position}
                  </span>
                  <FlagImage
                    countryCode={row.teamCode}
                    alt={row.teamName}
                    width={14}
                    height={10}
                    className="rounded-[1px] shrink-0"
                  />
                  <span className="truncate">{row.teamName}</span>
                </div>
              </td>
              <td className={`text-right py-[5px] px-1 font-medium ${textColor}`}>{row.points}</td>
              <td className={`text-right py-[5px] px-1 ${textColor}`}>{row.played}</td>
              <td className={`text-right py-[5px] px-1 ${textColor}`}>{row.won}</td>
              <td className={`text-right py-[5px] px-1 ${textColor}`}>{row.drawn}</td>
              <td className={`text-right py-[5px] px-1 ${textColor}`}>{row.lost}</td>
              <td className={`text-right py-[5px] px-1 ${textColor}`}>{row.goalsFor}</td>
              <td className={`text-right py-[5px] px-1 ${textColor}`}>{row.goalsAgainst}</td>
              <td className={`text-right py-[5px] px-1 ${textColor}`}>
                {formatDiff(row.goalDiff)}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
