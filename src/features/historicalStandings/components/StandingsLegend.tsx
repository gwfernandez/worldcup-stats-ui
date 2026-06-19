import { Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// ─── Datos de abreviaciones ───────────────────────────────────────────────────

const ABBREVIATIONS = [
  { metric: 'points', descKey: 'legend.points' },
  { metric: 'played', descKey: 'legend.played' },
  { metric: 'won', descKey: 'legend.won' },
  { metric: 'drawn', descKey: 'legend.drawn' },
  { metric: 'lost', descKey: 'legend.lost' },
  { metric: 'goalsFor', descKey: 'legend.goalsFor' },
  { metric: 'goalsAgainst', descKey: 'legend.goalsAgainst' },
  { metric: 'goalDiff', descKey: 'legend.goalDiff' },
];

// ─── Componente ───────────────────────────────────────────────────────────────

/**
 * Leyenda de la tabla de posiciones históricas.
 * Muestra abreviaciones y sistema de puntuación histórico.
 */
export function StandingsLegend() {
  const { t } = useTranslation(['historicalStandings', 'common']);

  return (
    <div className="mt-6">
      <p className="text-xs font-medium text-wc-text-primary mb-3 flex items-center gap-1.5">
        <Info size={13} stroke="var(--wc-accent-gold)" aria-hidden="true" />
        {t('legend.title')}
      </p>

      <div className="grid grid-cols-2 gap-3">
        {/* Abreviaciones */}
        <div className="bg-wc-surface-primary border border-wc-border-primary rounded-xl overflow-hidden">
          <table className="w-full border-collapse text-[11px]">
            <thead>
              <tr className="border-b border-wc-border-primary">
                <th className="text-left font-normal text-wc-text-muted px-3 py-2 w-12">
                  {t('legend.abbreviation')}
                </th>
                <th className="text-left font-normal text-wc-text-muted px-3 py-2">
                  {t('legend.meaning')}
                </th>
              </tr>
            </thead>
            <tbody>
              {ABBREVIATIONS.map((item) => (
                <tr key={item.metric} className="border-t border-wc-surface-secondary">
                  <td className="px-3 py-1.5 font-medium text-wc-accent-gold">
                    {t(`common:standingMetrics.abbreviations.${item.metric}`)}
                  </td>
                  <td className="px-3 py-1.5 text-wc-text-muted">{t(item.descKey)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Sistema de puntuación */}
        <div className="bg-wc-surface-primary border border-wc-border-primary rounded-xl p-3">
          <p className="text-[11px] font-medium text-wc-text-primary mb-2.5 pb-2 border-b border-wc-border-primary">
            {t('legend.pointsSystem')}
          </p>

          {[
            {
              pts: 3,
              ptsColor: 'text-wc-accent-gold',
              label: t('legend.win'),
              badge: t('legend.since1998'),
              badgeColor: 'text-wc-success',
            },
            {
              pts: 2,
              ptsColor: 'text-wc-info-text',
              label: t('legend.win'),
              badge: t('legend.until1994'),
              badgeColor: 'text-wc-danger',
            },
            {
              pts: 1,
              ptsColor: 'text-wc-text-muted',
              label: t('legend.draw'),
              badge: t('legend.always'),
              badgeColor: 'text-wc-text-muted',
            },
            {
              pts: 0,
              ptsColor: 'text-wc-danger',
              label: t('legend.loss'),
              badge: t('legend.always'),
              badgeColor: 'text-wc-text-muted',
            },
          ].map(({ pts, ptsColor, label, badge, badgeColor }) => (
            <div
              key={`${pts}-${label}`}
              className="flex items-center justify-between py-1.5 border-t border-wc-surface-secondary first:border-t-0 text-[11px]"
            >
              <div className="flex items-center gap-2">
                <span className={`text-[13px] font-medium min-w-[16px] ${ptsColor}`}>{pts}</span>
                <span className="text-wc-text-primary">{label}</span>
              </div>
              <span className={`text-[10px] ${badgeColor}`}>{badge}</span>
            </div>
          ))}

          {/* Nota de criterio unificado */}
          <div className="mt-3 px-2.5 py-2 bg-wc-surface-secondary border border-wc-border-primary rounded-lg">
            <p className="text-[10px] text-wc-text-muted leading-relaxed">
              {t('legend.notePrefix')}{' '}
              <span className="text-wc-text-primary font-medium">{t('legend.noteHighlight')}</span>{' '}
              {t('legend.noteSuffix')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
