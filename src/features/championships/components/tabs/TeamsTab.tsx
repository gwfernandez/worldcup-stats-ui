import { useState, useMemo } from 'react';
import type { Team } from '@/types/team.types';
import { PERFORMANCE_LABEL, PERFORMANCE_STYLES, CONFEDERATION_TOOLTIP } from '@/types/team.types';
import { Pagination } from '@/components/shared/Pagination';

const PAGE_SIZE = 10;

import { PlayersModal } from '@/features/championships/components/shared/PlayersModal';

const FLAG_URL = (code: string) => `https://flagcdn.com/24x18/${code.toLowerCase()}.png`;

// ─── Props ────────────────────────────────────────────────────────────────────

export interface TeamsTabProps {
  teams: Team[];
}

// ─── Componente ───────────────────────────────────────────────────────────────

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

  // Opciones dinámicas
  const confederationOptions = useMemo(
    () => [...new Set(teams.map((t) => t.confederation))].sort(),
    [teams],
  );

  const groupOptions = useMemo(() => [...new Set(teams.map((t) => t.group))].sort(), [teams]);

  // Filtrado
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

  // Paginado
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginatedTeams = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, currentPage]);

  const handleFilterChange =
    (setter: (v: string) => void) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setter(e.target.value);
      setCurrentPage(1); // Reset page on filter change
    };

  return (
    <>
      <div className="max-w-4xl mx-auto">
        {/* ── Filtros ──────────────────────────────────────────────── */}
        <div className="flex gap-2.5 mb-4">
          {/* Búsqueda por nombre */}
          <div className="flex-[2] relative">
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
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8a8fa8] pointer-events-none"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Buscar selección..."
              value={searchName}
              onChange={handleFilterChange(setSearchName)}
              className="w-full bg-[#161925] border border-[#2a2d3a] rounded-lg pl-8 pr-3 py-[7px] text-xs text-[#e8eaf0] placeholder:text-[#8a8fa8] outline-none focus:border-[#e8c84a] transition-colors"
            />
          </div>

          {/* Filtro confederación */}
          <div className="flex-1 relative">
            <select
              value={filterConfederation}
              onChange={handleFilterChange(setFilterConf)}
              className="w-full appearance-none bg-[#161925] border border-[#2a2d3a] rounded-lg px-3 py-[7px] pr-7 text-xs text-[#e8eaf0] outline-none focus:border-[#e8c84a] transition-colors cursor-pointer"
            >
              <option value="">Todas las confederaciones</option>
              {confederationOptions.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="11"
              height="11"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8a8fa8] pointer-events-none"
              aria-hidden="true"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>

          {/* Filtro grupo */}
          <div className="flex-1 relative">
            <select
              value={filterGroup}
              onChange={handleFilterChange(setFilterGroup)}
              className="w-full appearance-none bg-[#161925] border border-[#2a2d3a] rounded-lg px-3 py-[7px] pr-7 text-xs text-[#e8eaf0] outline-none focus:border-[#e8c84a] transition-colors cursor-pointer"
            >
              <option value="">Todos los grupos</option>
              {groupOptions.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="11"
              height="11"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8a8fa8] pointer-events-none"
              aria-hidden="true"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </div>

        {/* ── Tabla ────────────────────────────────────────────────── */}
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[#2a2d3a]">
              <th className="text-left text-[11px] font-normal text-[#8a8fa8] pb-2">Selección</th>
              <th className="text-left text-[11px] font-normal text-[#8a8fa8] pb-2">
                Confederación
              </th>
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
              const confTooltip = CONFEDERATION_TOOLTIP[team.confederation];

              return (
                <tr
                  key={team.id}
                  className="border-t border-[#1e2233] hover:bg-[#161925] transition-colors duration-150"
                >
                  {/* Selección */}
                  <td className="py-2.5 pr-3">
                    <div className="flex items-center gap-2">
                      <img
                        src={FLAG_URL(team.teamCode)}
                        alt={team.name}
                        width={18}
                        height={13}
                        className="rounded-[2px] shrink-0"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                      <span className="text-xs text-[#e8eaf0]">{team.name}</span>
                    </div>
                  </td>

                  {/* Confederación con tooltip */}
                  <td className="py-2.5 pr-3">
                    <div className="relative inline-flex group/conf cursor-default">
                      <span className="text-xs text-[#8a8fa8]">{team.confederation}</span>
                      {confTooltip && (
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-1 bg-[#1e2233] border border-[#2a2d3a] rounded-md text-[10px] text-[#e8eaf0] whitespace-nowrap opacity-0 group-hover/conf:opacity-100 transition-opacity duration-150 pointer-events-none z-10">
                          {confTooltip}
                          {/* Flecha */}
                          <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#2a2d3a]" />
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Grupo */}
                  <td className="py-2.5 pr-3">
                    <span className="text-xs text-[#8a8fa8]">{team.group}</span>
                  </td>

                  {/* DT */}
                  <td className="py-2.5 pr-3">
                    <span className="text-xs text-[#e8eaf0]">{team.coach}</span>
                  </td>

                  {/* Desempeño */}
                  <td className="py-2.5 pr-3">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full border whitespace-nowrap ${PERFORMANCE_STYLES[team.performance]}`}
                    >
                      {PERFORMANCE_LABEL[team.performance]}
                    </span>
                  </td>

                  {/* Acciones */}
                  <td className="py-2.5 text-center">
                    <div className="relative inline-flex group/action">
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
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-1 bg-[#1e2233] border border-[#2a2d3a] rounded-md text-[10px] text-[#e8eaf0] whitespace-nowrap opacity-0 group-hover/action:opacity-100 transition-opacity duration-150 pointer-events-none z-10">
                        Jugadores
                        <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#2a2d3a]" />
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* ── Paginado ────────────────────────────────────────────── */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filtered.length}
          pageSize={PAGE_SIZE}
          itemsLabel="selecciones"
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Modal */}
      <PlayersModal team={selectedTeam} onClose={() => setSelectedTeam(null)} />
    </>
  );
}
