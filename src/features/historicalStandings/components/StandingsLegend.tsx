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
      <p className="text-xs font-medium text-[#e8eaf0] mb-3 flex items-center gap-1.5">
        <Info size={13} stroke="#e8c84a" aria-hidden="true" />
        Leyenda
      </p>

      <div className="grid grid-cols-2 gap-3">
        {/* Abreviaciones */}
        <div className="bg-[#161925] border border-[#2a2d3a] rounded-xl overflow-hidden">
          <table className="w-full border-collapse text-[11px]">
            <thead>
              <tr className="border-b border-[#2a2d3a]">
                <th className="text-left font-normal text-[#8a8fa8] px-3 py-2 w-12">Abrev.</th>
                <th className="text-left font-normal text-[#8a8fa8] px-3 py-2">Significado</th>
              </tr>
            </thead>
            <tbody>
              {ABBREVIATIONS.map((item) => (
                <tr key={item.abbr} className="border-t border-[#1e2233]">
                  <td className="px-3 py-1.5 font-medium text-[#e8c84a]">{item.abbr}</td>
                  <td className="px-3 py-1.5 text-[#8a8fa8]">{item.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Sistema de puntuación */}
        <div className="bg-[#161925] border border-[#2a2d3a] rounded-xl p-3">
          <p className="text-[11px] font-medium text-[#e8eaf0] mb-2.5 pb-2 border-b border-[#2a2d3a]">
            Sistema de puntuación
          </p>

          {[
            {
              pts: 3,
              ptsColor: 'text-[#e8c84a]',
              label: 'Partido Ganado',
              badge: '▲ Desde Francia 1998',
              badgeColor: 'text-[#8fc44a]',
            },
            {
              pts: 2,
              ptsColor: 'text-[#8a9fc0]',
              label: 'Partido Ganado',
              badge: '▼ Hasta EE.UU. 1994',
              badgeColor: 'text-[#d46060]',
            },
            {
              pts: 1,
              ptsColor: 'text-[#8a8fa8]',
              label: 'Partido Empatado',
              badge: 'Siempre',
              badgeColor: 'text-[#8a8fa8]',
            },
            {
              pts: 0,
              ptsColor: 'text-[#d46060]',
              label: 'Partido Perdido',
              badge: 'Siempre',
              badgeColor: 'text-[#8a8fa8]',
            },
          ].map(({ pts, ptsColor, label, badge, badgeColor }) => (
            <div
              key={`${pts}-${label}`}
              className="flex items-center justify-between py-1.5 border-t border-[#1e2233] first:border-t-0 text-[11px]"
            >
              <div className="flex items-center gap-2">
                <span className={`text-[13px] font-medium min-w-[16px] ${ptsColor}`}>{pts}</span>
                <span className="text-[#e8eaf0]">{label}</span>
              </div>
              <span className={`text-[10px] ${badgeColor}`}>{badge}</span>
            </div>
          ))}

          {/* Nota de criterio unificado */}
          <div className="mt-3 px-2.5 py-2 bg-[#1e2233] border border-[#2a2d3a] rounded-lg">
            <p className="text-[10px] text-[#8a8fa8] leading-relaxed">
              ⚠️ Los puntos históricos se calculan usando el sistema actual de{' '}
              <span className="text-[#e8eaf0] font-medium">3 puntos por victoria</span> para mayor
              consistencia entre ediciones.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
