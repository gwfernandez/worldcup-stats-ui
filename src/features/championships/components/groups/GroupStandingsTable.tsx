import type { GroupStanding } from '@/types/championship.types';
import { FlagImage } from '@/components/shared';

const formatDiff = (diff: number): string => (diff > 0 ? `+${diff}` : `${diff}`);

// ─── Props ────────────────────────────────────────────────────────────────────

export interface GroupStandingsTableProps {
  standings: GroupStanding[];
}

// ─── Columnas ─────────────────────────────────────────────────────────────────

const COLS = [
  { key: 'points', label: 'Pts', title: 'Puntos' },
  { key: 'played', label: 'J', title: 'Partidos jugados' },
  { key: 'won', label: 'G', title: 'Ganados' },
  { key: 'drawn', label: 'E', title: 'Empatados' },
  { key: 'lost', label: 'P', title: 'Perdidos' },
  { key: 'goalsFor', label: 'GF', title: 'Goles a favor' },
  { key: 'goalsAgainst', label: 'GC', title: 'Goles en contra' },
  { key: 'goalDiff', label: 'Dif', title: 'Diferencia de goles' },
] as const;

// ─── Componente ───────────────────────────────────────────────────────────────

/**
 * Tabla de posiciones de un grupo con columnas Pts, J, G, E, P, GF, GC, Dif.
 * Los equipos clasificados se resaltan en verde.
 */
export function GroupStandingsTable({ standings }: GroupStandingsTableProps) {
  return (
    <table className="w-full border-collapse text-[11px]" style={{ tableLayout: 'fixed' }}>
      <colgroup>
        <col style={{ width: '38%' }} />
        {COLS.map((c) => (
          <col key={c.key} style={{ width: `${62 / COLS.length}%` }} />
        ))}
      </colgroup>

      <thead>
        <tr className="border-b border-[#2a2d3a]">
          <th className="text-left text-[10px] text-[#8a8fa8] font-normal py-[5px] pl-[10px] pr-1">
            Equipo
          </th>
          {COLS.map((c) => (
            <th
              key={c.key}
              title={c.title}
              className="text-right text-[10px] text-[#8a8fa8] font-normal py-[5px] px-1"
            >
              {c.label}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {standings.map((row) => {
          const textColor = row.qualified ? 'text-[#8fc44a]' : 'text-[#e8eaf0]';
          return (
            <tr key={row.teamCode} className="border-t border-[#1e2233]">
              <td className={`py-[5px] pl-[10px] pr-1 ${textColor}`}>
                <div className="flex items-center gap-1.5 overflow-hidden">
                  <span className="text-[10px] text-[#8a8fa8] shrink-0 w-3">{row.position}</span>
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
