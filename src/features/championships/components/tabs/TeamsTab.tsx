import { useState, useMemo } from 'react';
import { Users } from 'lucide-react';
import type { Team } from '@/types/team.types';
import { PERFORMANCE_STYLES, CONFEDERATION_TOOLTIP } from '@/types/team.types';
import { Pagination } from '@/components/shared/Pagination';
import { SearchInput, FilterSelect, Tooltip, FlagImage } from '@/components/shared';
import { PlayersModal } from '../shared/PlayersModal';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation('common');
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
          placeholder={t('search.team')}
          value={searchName}
          onChange={handleFilterChange(setSearchName)}
        />
        <FilterSelect
          className="flex-1"
          value={filterConfederation}
          onChange={handleFilterChange(setFilterConf)}
          placeholderOption={t('filters.allConfederations')}
          options={confederationOptions.map((c) => ({ value: c, label: c }))}
        />
        <FilterSelect
          className="flex-1"
          value={filterGroup}
          onChange={handleFilterChange(setFilterGroup)}
          placeholderOption={t('filters.allGroups')}
          options={groupOptions.map((g) => ({ value: g, label: g }))}
        />
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-wc-border-primary">
            <th className="text-left text-[11px] font-normal text-wc-text-muted pb-2">
              {t('labels.team')}
            </th>
            <th className="text-left text-[11px] font-normal text-wc-text-muted pb-2">
              {t('labels.confederation')}
            </th>
            <th className="text-left text-[11px] font-normal text-wc-text-muted pb-2">
              {t('labels.group')}
            </th>
            <th className="text-left text-[11px] font-normal text-wc-text-muted pb-2">
              {t('labels.coach')}
            </th>
            <th className="text-left text-[11px] font-normal text-wc-text-muted pb-2">
              {t('labels.performance')}
            </th>
            <th className="text-center text-[11px] font-normal text-wc-text-muted pb-2">
              {t('labels.actions')}
            </th>
          </tr>
        </thead>
        <tbody>
          {paginatedTeams.length === 0 && (
            <tr>
              <td colSpan={6} className="py-8 text-center text-sm text-wc-text-muted">
                {t('empty.teams')}
              </td>
            </tr>
          )}
          {paginatedTeams.map((team) => {
            const confTooltip = CONFEDERATION_TOOLTIP[team.confederation] ?? '';

            return (
              <tr
                key={team.id}
                className="border-t border-wc-surface-secondary hover:bg-wc-surface-primary transition-colors duration-150"
              >
                <td className="py-2.5 pr-3">
                  <div className="flex items-center gap-2">
                    <FlagImage countryCode={team.teamCode} alt={team.name} />
                    <span className="text-xs text-wc-text-primary">{team.name}</span>
                  </div>
                </td>

                <td className="py-2.5 pr-3">
                  <Tooltip content={confTooltip} groupName="conf" hideWhenEmpty>
                    <span className="text-xs text-wc-text-muted">{team.confederation}</span>
                  </Tooltip>
                </td>

                <td className="py-2.5 pr-3">
                  <span className="text-xs text-wc-text-muted">{team.group}</span>
                </td>

                <td className="py-2.5 pr-3">
                  <span className="text-xs text-wc-text-primary">{team.coach}</span>
                </td>

                <td className="py-2.5 pr-3">
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full border whitespace-nowrap ${PERFORMANCE_STYLES[team.performance]}`}
                  >
                    {t(`performance.${team.performance}`)}
                  </span>
                </td>

                <td className="py-2.5 text-center">
                  <Tooltip content={t('labels.players')} groupName="action">
                    <button
                      onClick={() => setSelectedTeam(team)}
                      className="flex items-center justify-center w-7 h-7 border border-wc-border-primary rounded-md text-wc-text-muted hover:border-wc-accent-gold hover:text-wc-accent-gold transition-colors focus:outline-none"
                      aria-label={t('actions.viewPlayersFor', { team: team.name })}
                    >
                      <Users size={13} />
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
        itemsLabel={t('labels.teams').toLowerCase()}
        onPageChange={setCurrentPage}
      />

      <PlayersModal team={selectedTeam} onClose={() => setSelectedTeam(null)} />
    </>
  );
}
