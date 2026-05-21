import { useState, useMemo } from 'react';
import type { Team } from '@/types/team.types';
import { PERFORMANCE_LABEL, PERFORMANCE_STYLES, CONFEDERATION_TOOLTIP } from '@/types/team.types';
import { Pagination } from '@/components/shared/Pagination';
import { SearchInput, FilterSelect, Tooltip, FlagImage } from '@/components/shared';
import { PlayersModal } from '@/features/championships/components/shared/PlayersModal';

const PAGE_SIZE = 10;

export interface TeamsTabProps {
  teams: Team[];
}

/**
 * Solapa de selecciones.
 * Filtros por nombre, confederación y grupo.
 * Tabla con bandera, confederación (tooltip), grupo, DT, desempeño y acciones.
 * Modal de plantel al hacer click en el ícono de jugadores.
 */
export function TeamsTab({ teams }: TeamsTabProps) {
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [searchName, setSearchName] = useState('');
  const [filterConfederation, setFilterConf] = useState('');
  const [filterGroup, setFilterGroup] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const confederationOptions = useMemo(
    () => [...new Set(teams.map((t) => t.confederation))].sort(),
    [teams],
  );

  const groupOptions = useMemo(() => [...new Set(teams.map((t) => t.group))].sort(), [teams]);

  const filtered = useMemo(
    () =>
      teams.filter((t) => {
        const matchesName = t.name.toLowerCase().includes(searchName.toLowerCase());
        const matchesConf = filterConfederation === '' || t.confederation === filterConfederation;
        const matchesGroup = filterGroup === '' || t.group === filterGroup;
        return matchesName && matchesConf && matchesGroup;
      }),
    [teams, searchName, filterConfederation, filterGroup],
  );

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginatedTeams = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, currentPage]);

  const handleFilterChange =
    (setter: (v: string) => void) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setter(e.target.value);
      setCurrentPage(1);
    };

  return (
    <>
      <div className="flex gap-2.5 mb-4">
        <SearchInput
          className="flex-[2]"
          placeholder="Buscar selección..."
          value={searchName}
          onChange={handleFilterChange(setSearchName)}
        />
        <FilterSelect
          className="flex-1"
          value={filterConfederation}
          onChange={handleFilterChange(setFilterConf)}
          placeholderOption="Todas las confederaciones"
          options={confederationOptions.map((c) => ({ value: c, label: c }))}
        />
        <FilterSelect
          className="flex-1"
          value={filterGroup}
          onChange={handleFilterChange(setFilterGroup)}
          placeholderOption="Todos los grupos"
          options={groupOptions.map((g) => ({ value: g, label: g }))}
        />
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-[#2a2d3a]">
            <th className="text-left text-[11px] font-normal text-[#8a8fa8] pb-2">Selección</th>
            <th className="text-left text-[11px] font-normal text-[#8a8fa8] pb-2">Confederación</th>
            <th className="text-left text-[11px] font-normal text-[#8a8fa8] pb-2">Grupo</th>
            <th className="text-left text-[11px] font-normal text-[#8a8fa8] pb-2">DT</th>
            <th className="text-left text-[11px] font-normal text-[#8a8fa8] pb-2">Desempeño</th>
            <th className="text-center text-[11px] font-normal text-[#8a8fa8] pb-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {paginatedTeams.length === 0 && (
            <tr>
              <td colSpan={6} className="py-8 text-center text-sm text-[#8a8fa8]">
                No se encontraron selecciones con esos filtros
              </td>
            </tr>
          )}
          {paginatedTeams.map((team) => {
            const confTooltip = CONFEDERATION_TOOLTIP[team.confederation] ?? '';

            return (
              <tr
                key={team.id}
                className="border-t border-[#1e2233] hover:bg-[#161925] transition-colors duration-150"
              >
                <td className="py-2.5 pr-3">
                  <div className="flex items-center gap-2">
                    <FlagImage countryCode={team.teamCode} alt={team.name} />
                    <span className="text-xs text-[#e8eaf0]">{team.name}</span>
                  </div>
                </td>

                <td className="py-2.5 pr-3">
                  <Tooltip content={confTooltip} groupName="conf" hideWhenEmpty>
                    <span className="text-xs text-[#8a8fa8]">{team.confederation}</span>
                  </Tooltip>
                </td>

                <td className="py-2.5 pr-3">
                  <span className="text-xs text-[#8a8fa8]">{team.group}</span>
                </td>

                <td className="py-2.5 pr-3">
                  <span className="text-xs text-[#e8eaf0]">{team.coach}</span>
                </td>

                <td className="py-2.5 pr-3">
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full border whitespace-nowrap ${PERFORMANCE_STYLES[team.performance]}`}
                  >
                    {PERFORMANCE_LABEL[team.performance]}
                  </span>
                </td>

                <td className="py-2.5 text-center">
                  <Tooltip content="Jugadores" groupName="action">
                    <button
                      onClick={() => setSelectedTeam(team)}
                      className="flex items-center justify-center w-7 h-7 border border-[#2a2d3a] rounded-md text-[#8a8fa8] hover:border-[#e8c84a] hover:text-[#e8c84a] transition-colors focus:outline-none"
                      aria-label={`Ver jugadores de ${team.name}`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                    </button>
                  </Tooltip>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filtered.length}
        pageSize={PAGE_SIZE}
        itemsLabel="selecciones"
        onPageChange={setCurrentPage}
      />

      <PlayersModal team={selectedTeam} onClose={() => setSelectedTeam(null)} />
    </>
  );
}
