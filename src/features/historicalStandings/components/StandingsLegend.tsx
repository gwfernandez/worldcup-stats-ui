import { Info } from 'lucide-react';

// ─── Datos de abreviaciones ───────────────────────────────────────────────────

const ABBREVIATIONS = [
  { abbr: 'PTS', desc: 'Puntos acumulados' },
  { abbr: 'PJ', desc: 'Partidos Jugados' },
  { abbr: 'PG', desc: 'Partidos Ganados' },
  { abbr: 'PE', desc: 'Partidos Empatados' },
  { abbr: 'PP', desc: 'Partidos Perdidos' },
  { abbr: 'GF', desc: 'Goles a Favor' },
  { abbr: 'GC', desc: 'Goles en Contra' },
  { abbr: 'DIF', desc: 'Diferencia de Goles (GF − GC)' },
];

// ─── Componente ───────────────────────────────────────────────────────────────

/**
 * Leyenda de la tabla de posiciones históricas.
 * Muestra abreviaciones y sistema de puntuación histórico.
 */
export function StandingsLegend() {
  return (
    <div className="mt-6">
      <p className="text-xs font-medium text-wc-text-primary mb-3 flex items-center gap-1.5">
        <Info size={13} stroke="var(--wc-accent-gold)" aria-hidden="true" />
        Leyenda
      </p>

      <div className="grid grid-cols-2 gap-3">
        {/* Abreviaciones */}
        <div className="bg-wc-surface-primary border border-wc-border-primary rounded-xl overflow-hidden">
          <table className="w-full border-collapse text-[11px]">
            <thead>
              <tr className="border-b border-wc-border-primary">
                <th className="text-left font-normal text-wc-text-muted px-3 py-2 w-12">Abrev.</th>
                <th className="text-left font-normal text-wc-text-muted px-3 py-2">Significado</th>
              </tr>
            </thead>
            <tbody>
              {ABBREVIATIONS.map((item) => (
                <tr key={item.abbr} className="border-t border-wc-surface-secondary">
                  <td className="px-3 py-1.5 font-medium text-wc-accent-gold">{item.abbr}</td>
                  <td className="px-3 py-1.5 text-wc-text-muted">{item.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Sistema de puntuación */}
        <div className="bg-wc-surface-primary border border-wc-border-primary rounded-xl p-3">
          <p className="text-[11px] font-medium text-wc-text-primary mb-2.5 pb-2 border-b border-wc-border-primary">
            Sistema de puntuación
          </p>

          {[
            {
              pts: 3,
              ptsColor: 'text-wc-accent-gold',
              label: 'Partido Ganado',
              badge: '▲ Desde Francia 1998',
              badgeColor: 'text-wc-success',
            },
            {
              pts: 2,
              ptsColor: 'text-wc-info-text',
              label: 'Partido Ganado',
              badge: '▼ Hasta EE.UU. 1994',
              badgeColor: 'text-wc-danger',
            },
            {
              pts: 1,
              ptsColor: 'text-wc-text-muted',
              label: 'Partido Empatado',
              badge: 'Siempre',
              badgeColor: 'text-wc-text-muted',
            },
            {
              pts: 0,
              ptsColor: 'text-wc-danger',
              label: 'Partido Perdido',
              badge: 'Siempre',
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
              ⚠️ Los puntos históricos se calculan usando el sistema actual de{' '}
              <span className="text-wc-text-primary font-medium">3 puntos por victoria</span> para
              mayor consistencia entre ediciones.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
