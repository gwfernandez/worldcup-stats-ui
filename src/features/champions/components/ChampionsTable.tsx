import { useState, useMemo } from 'react';
import { Trophy } from 'lucide-react';
import type { ChampionTeam } from '@/types/champion.types';
import { CONFEDERATION_STYLES } from '@/types/historicalStanding.types';
import { CONFEDERATION_TOOLTIP } from '@/types/team.types';
import { ChampionshipsModal } from '@/features/champions/components/ChampionshipsModal';
import { SearchInput, FilterSelect, Tooltip, FlagImage } from '@/components/shared';

// ─── Props ────────────────────────────────────────────────────────────────────

export interface ChampionsTableProps {
  champions: ChampionTeam[];
}

// ─── Componente ───────────────────────────────────────────────────────────────

/**
 * Tabla de campeones históricos sin paginado.
 * Filtros por nombre y confederación.
 * Borde lateral por confederación, trofeos visuales y modal de detalle.
 */
export function ChampionsTable({ champions }: ChampionsTableProps) {
  const [selectedTeam, setSelectedTeam] = useState<ChampionTeam | null>(null);
  const [searchName, setSearchName] = useState('');
  const [filterConf, setFilterConf] = useState('');

  const confOptions = useMemo(
    () => [...new Set(champions.map((c) => c.confederation))].sort(),
    [champions],
  );

  const filtered = useMemo(
    () =>
      champions.filter((c) => {
        const matchesName = c.teamName.toLowerCase().includes(searchName.toLowerCase());
        const matchesConf = filterConf === '' || c.confederation === filterConf;
        return matchesName && matchesConf;
      }),
    [champions, searchName, filterConf],
  );

  return (
    <>
      {/* ── Filtros ───────────────────────────────────────────── */}
      <div className="flex gap-2.5 mb-4">
        <SearchInput
          className="flex-[2]"
          placeholder="Buscar selección..."
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />
        <FilterSelect
          className="flex-1"
          value={filterConf}
          onChange={(e) => setFilterConf(e.target.value)}
          placeholderOption="Todas las confederaciones"
          options={confOptions.map((c) => ({ value: c, label: c }))}
        />
      </div>

      {/* ── Tabla ──────────────────────────────────────────────── */}
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-[#2a2d3a]">
            <th className="text-left text-[11px] font-normal text-[#8a8fa8] pb-2 w-9">#</th>
            <th className="text-left text-[11px] font-normal text-[#8a8fa8] pb-2">Selección</th>
            <th className="text-left text-[11px] font-normal text-[#8a8fa8] pb-2">Títulos 🏆</th>
            <th className="text-left text-[11px] font-normal text-[#8a8fa8] pb-2">Confederación</th>
            <th className="text-center text-[11px] font-normal text-[#8a8fa8] pb-2">Detalle</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 && (
            <tr>
              <td colSpan={5} className="py-8 text-center text-sm text-[#8a8fa8]">
                No se encontraron selecciones con esos filtros
              </td>
            </tr>
          )}
          {filtered.map((team) => {
            const confStyle = CONFEDERATION_STYLES[team.confederation];
            const confTooltip = CONFEDERATION_TOOLTIP[team.confederation] ?? '';
            const isTop3 = team.position <= 3;

            return (
              <tr
                key={team.teamCode}
                className="border-t border-[#1e2233] hover:bg-[#161925] transition-colors duration-150"
              >
                {/* Posición con borde lateral */}
                <td className="py-2.5 relative pl-3.5 pr-2">
                  <div
                    className="absolute left-0 top-0 bottom-0 w-[3px]"
                    style={{ backgroundColor: confStyle?.bar ?? '#3a3d4a' }}
                    aria-hidden="true"
                  />
                  <span
                    className={`text-[11px] ${isTop3 ? 'text-[#e8c84a] font-medium' : 'text-[#8a8fa8]'}`}
                  >
                    {team.position}
                  </span>
                </td>

                {/* Selección */}
                <td className="py-2.5 pr-3">
                  <div className="flex items-center gap-2">
                    <FlagImage countryCode={team.teamCode} alt={team.teamName} />
                    <span className="text-xs text-[#e8eaf0]">{team.teamName}</span>
                  </div>
                </td>

                {/* Títulos con trofeos */}
                <td className="py-2.5 pr-3">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-0.5 flex-wrap">
                      {Array.from({ length: team.titles }).map((_, i) => (
                        <span key={i} className="text-sm leading-none" aria-hidden="true">
                          🏆
                        </span>
                      ))}
                    </div>
                    <span className="text-lg font-medium text-[#e8c84a]">{team.titles}</span>
                  </div>
                </td>

                {/* Confederación */}
                <td className="py-2.5 pr-3">
                  <Tooltip content={confTooltip} groupName="conf" hideWhenEmpty>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full border ${confStyle?.pill ?? 'bg-[#1e2233] text-[#8a8fa8] border-[#2a2d3a]'}`}
                    >
                      {team.confederation}
                    </span>
                  </Tooltip>
                </td>

                {/* Acción */}
                <td className="py-2.5 text-center">
                  <Tooltip content="Ver títulos" groupName="action">
                    <button
                      onClick={() => setSelectedTeam(team)}
                      className="flex items-center justify-center w-7 h-7 border border-[#2a2d3a] rounded-md text-[#8a8fa8] hover:border-[#e8c84a] hover:text-[#e8c84a] transition-colors focus:outline-none"
                      aria-label={`Ver títulos de ${team.teamName}`}
                    >
                      <Trophy size={13} />
                    </button>
                  </Tooltip>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Modal */}
      <ChampionshipsModal team={selectedTeam} onClose={() => setSelectedTeam(null)} />
    </>
  );
}
