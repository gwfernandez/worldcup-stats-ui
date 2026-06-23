import { useMemo, useState } from 'react';
import { Users } from 'lucide-react';
import {
  CHAMPIONSHIP_STAGE_STYLES,
  CONFEDERATION_TOOLTIP,
  type ChampionshipTeam,
} from '@/types/team.types';
import { FilterSelect, FlagImage, SearchInput, TableSkeleton, Tooltip } from '@/components/shared';
import { PlayersModal } from '../shared/PlayersModal';
import { useChampionshipTeams } from '../../hooks/useChampionshipTeams';
import { useTranslation } from 'react-i18next';
import { useUIStore } from '@/store/ui.store';

export interface TeamsTabProps {
  year: number;
}

/**
 * Solapa de selecciones participantes de una edición.
 * Carga todos los equipos desde la API y aplica filtros locales por nombre,
 * confederación y grupo.
 */
export function TeamsTab({ year }: TeamsTabProps) {
  const { t } = useTranslation(['common', 'championships']);
  const [selectedTeam, setSelectedTeam] = useState<ChampionshipTeam | null>(null);
  const filters = useUIStore((state) => state.filters.championshipTeams);
  const setFilter = useUIStore((state) => state.setFilter);
  const { teams, isLoading, isError } = useChampionshipTeams(year);
  const searchName = filters?.name ?? '';
  const filterConfederation = filters?.confederation ?? '';
  const filterGroup = filters?.group ?? '';

  const confederationOptions = useMemo(
    () =>
      [...new Set(teams.map((team) => team.confederationCode).filter(Boolean))].sort((a, b) =>
        a.localeCompare(b),
      ),
    [teams],
  );

  const groupOptions = useMemo(
    () =>
      [...new Set(teams.map((team) => team.groupCode).filter(Boolean))].sort((a, b) =>
        a.localeCompare(b, undefined, { numeric: true }),
      ),
    [teams],
  );

  const filteredTeams = useMemo(
    () =>
      teams.filter((team) => {
        const matchesName = team.team.name.toLowerCase().includes(searchName.toLowerCase());
        const matchesConfederation =
          filterConfederation === '' || team.confederationCode === filterConfederation;
        const matchesGroup = filterGroup === '' || team.groupCode === filterGroup;

        return matchesName && matchesConfederation && matchesGroup;
      }),
    [teams, searchName, filterConfederation, filterGroup],
  );

  const handleFilterChange =
    (key: string) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
      setFilter('championshipTeams', key, event.target.value);
    };

  if (isLoading) {
    return <TableSkeleton cols={6} rows={8} showPagination={false} />;
  }

  if (isError) {
    return (
      <p className="py-8 text-center text-sm text-wc-danger-text">
        {t('championships:teams.loadError')}
      </p>
    );
  }

  return (
    <>
      <div className="flex gap-2.5 mb-4">
        <SearchInput
          className="flex-[2]"
          placeholder={t('common:search.team')}
          value={searchName}
          onChange={handleFilterChange('name')}
        />
        <FilterSelect
          className="flex-1"
          value={filterConfederation}
          onChange={handleFilterChange('confederation')}
          placeholderOption={t('common:filters.allConfederations')}
          options={confederationOptions.map((confederation) => ({
            value: confederation,
            label: confederation,
          }))}
        />
        <FilterSelect
          className="flex-1"
          value={filterGroup}
          onChange={handleFilterChange('group')}
          placeholderOption={t('common:filters.allGroups')}
          options={groupOptions.map((group) => ({ value: group, label: group }))}
        />
      </div>

      <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-wc-border-primary">
              <th className="text-left text-[11px] font-normal text-wc-text-muted pb-2">
                {t('common:labels.team')}
              </th>
              <th className="text-left text-[11px] font-normal text-wc-text-muted pb-2">
                {t('common:labels.confederation')}
              </th>
              <th className="text-left text-[11px] font-normal text-wc-text-muted pb-2">
                {t('common:labels.group')}
              </th>
              <th className="text-left text-[11px] font-normal text-wc-text-muted pb-2">
                {t('common:labels.coach')}
              </th>
              <th className="text-left text-[11px] font-normal text-wc-text-muted pb-2">
                {t('common:labels.performance')}
              </th>
              <th className="text-center text-[11px] font-normal text-wc-text-muted pb-2">
                {t('common:labels.actions')}
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredTeams.length === 0 && (
              <tr>
                <td colSpan={6} className="py-8 text-center text-sm text-wc-text-muted">
                  {t('common:empty.teams')}
                </td>
              </tr>
            )}
            {filteredTeams.map((team) => (
              <TeamRow
                key={`${team.year}-${team.team.code}`}
                team={team}
                onViewSquad={() => setSelectedTeam(team)}
              />
            ))}
          </tbody>
        </table>
      </div>

      <PlayersModal year={year} team={selectedTeam} onClose={() => setSelectedTeam(null)} />
    </>
  );
}

interface TeamRowProps {
  team: ChampionshipTeam;
  onViewSquad: () => void;
}

function TeamRow({ team, onViewSquad }: TeamRowProps) {
  const { t } = useTranslation('common');
  const confederationTooltip = CONFEDERATION_TOOLTIP[team.confederationCode] ?? '';
  const stageLabel = team.stageReached === '' ? '—' : t(`performance.${team.stageReached}`);

  return (
    <tr className="border-t border-wc-surface-secondary hover:bg-wc-surface-primary transition-colors duration-150">
      <td className="py-2.5 pr-3">
        <div className="flex items-center gap-2">
          <FlagImage countryCode={team.team.code} alt={team.team.name} />
          <span className="text-xs text-wc-text-primary">{team.team.name}</span>
        </div>
      </td>

      <td className="py-2.5 pr-3">
        <Tooltip content={confederationTooltip} groupName="conf" hideWhenEmpty>
          <span className="text-xs text-wc-text-muted">{team.confederationCode || '—'}</span>
        </Tooltip>
      </td>

      <td className="py-2.5 pr-3">
        <span className="text-xs text-wc-text-muted">{team.groupCode || '—'}</span>
      </td>

      <td className="py-2.5 pr-3">
        <span className="text-xs text-wc-text-primary">{team.managers || '—'}</span>
      </td>

      <td className="py-2.5 pr-3">
        <span
          className={`text-[10px] px-2 py-0.5 rounded-full border whitespace-nowrap ${CHAMPIONSHIP_STAGE_STYLES[team.stageReached]}`}
        >
          {stageLabel}
        </span>
      </td>

      <td className="py-2.5 text-center">
        <Tooltip content={t('labels.players')} groupName="action">
          <button
            onClick={onViewSquad}
            className="flex items-center justify-center w-7 h-7 border border-wc-border-primary rounded-md text-wc-text-muted hover:border-wc-accent-gold hover:text-wc-accent-gold transition-colors focus:outline-none"
            aria-label={t('actions.viewPlayersFor', { team: team.team.name })}
          >
            <Users size={13} />
          </button>
        </Tooltip>
      </td>
    </tr>
  );
}
