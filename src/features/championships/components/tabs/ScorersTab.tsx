import { useMemo, useState, type ChangeEvent } from 'react';
import type { Scorer } from '@/types/scorer.types';
import { FilterSelect, FlagImage, Pagination, QueryStatus, SearchInput } from '@/components/shared';
import { TableSkeleton } from '@/components/shared/TableSkeleton';
import { useTranslation } from 'react-i18next';
import { useUIStore } from '@/store/ui.store';
import { useChampionshipScorers } from '../../hooks/useChampionshipScorers';
import { useChampionshipTeams } from '../../hooks/useChampionshipTeams';

export interface ScorersTabProps {
  year: number;
}

/**
 * Solapa de goleadores.
 * Incluye filtros remotos por nombre y selección, tabla paginada y datos de la API.
 */
export function ScorersTab({ year }: ScorersTabProps) {
  const { t } = useTranslation('common');
  const [currentPage, setCurrentPage] = useState(1);
  const filters = useUIStore((state) => state.filters.championshipScorers);
  const setFilter = useUIStore((state) => state.setFilter);
  const searchName = filters?.name ?? '';
  const filterTeam = filters?.team ?? '';
  const {
    scorers,
    pagination,
    isLoading: areScorersLoading,
    isError: isScorersError,
    error: scorersError,
  } = useChampionshipScorers(year, currentPage);
  const {
    teams,
    isLoading: areTeamsLoading,
    isError: isTeamsError,
    error: teamsError,
  } = useChampionshipTeams(year);
  const isLoading = areScorersLoading || areTeamsLoading;
  const isError = isScorersError || isTeamsError;
  const error = scorersError ?? teamsError;

  const teamOptions = useMemo(
    () =>
      teams
        .map((team) => ({ value: team.team.code, label: team.team.name }))
        .sort((a, b) => a.label.localeCompare(b.label)),
    [teams],
  );

  const maxGoals = useMemo(() => Math.max(...scorers.map((scorer) => scorer.goals), 1), [scorers]);

  const handleFilterChange =
    (key: string) => (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setFilter('championshipScorers', key, event.target.value);
      setCurrentPage(1);
    };

  return (
    <QueryStatus
      isLoading={isLoading}
      isError={isError}
      error={error}
      skeleton={<TableSkeleton cols={4} rows={8} />}
    >
      <div className="mb-4 grid min-w-0 grid-cols-1 gap-1.5 min-[320px]:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] sm:gap-2.5">
        <SearchInput
          className="min-w-0"
          placeholder={t('search.player')}
          value={searchName}
          onChange={handleFilterChange('name')}
        />
        <FilterSelect
          className="min-w-0"
          value={filterTeam}
          onChange={handleFilterChange('team')}
          placeholderOption={t('filters.allTeams')}
          options={teamOptions}
        />
      </div>

      <table className="w-full table-fixed border-collapse">
        <colgroup>
          <col className="w-[8%]" />
          <col className="w-[38%]" />
          <col className="w-[34%]" />
          <col className="w-[20%]" />
        </colgroup>
        <thead>
          <tr className="border-b border-wc-border-primary">
            <th className="w-8 pb-2 text-left text-[10px] font-normal text-wc-text-muted sm:text-[11px]">
              #
            </th>
            <th className="truncate pb-2 pr-1 text-left text-[10px] font-normal text-wc-text-muted sm:pr-3 sm:text-[11px]">
              {t('labels.player')}
            </th>
            <th className="truncate pb-2 pr-1 text-left text-[10px] font-normal text-wc-text-muted sm:pr-3 sm:text-[11px]">
              {t('labels.team')}
            </th>
            <th className="truncate pb-2 pr-1 text-right text-[10px] font-normal text-wc-text-muted sm:pr-2 sm:text-[11px]">
              {t('labels.goals')}
            </th>
          </tr>
        </thead>
        <tbody>
          {scorers.length === 0 && (
            <tr>
              <td colSpan={4} className="py-8 text-center text-sm text-wc-text-muted">
                {t('empty.scorers')}
              </td>
            </tr>
          )}
          {scorers.map((scorer: Scorer, index) => {
            const rank = (currentPage - 1) * pagination.size + index + 1;
            const isTop3 = rank <= 3;
            const barWidth = Math.round((scorer.goals / maxGoals) * 100);

            return (
              <tr
                key={scorer.playerId}
                className="border-t border-wc-surface-secondary transition-colors duration-150 group"
              >
                <td className="overflow-hidden py-2.5 pl-0.5 sm:pl-1">
                  <span
                    className={`text-[11px] ${isTop3 ? 'text-wc-accent-gold font-medium' : 'text-wc-text-muted'}`}
                  >
                    {rank}
                  </span>
                </td>
                <td className="min-w-0 overflow-hidden py-2.5 pr-1 sm:pr-3">
                  <span className="block truncate text-[11px] text-wc-text-primary sm:text-xs">
                    {scorer.fullName}
                  </span>
                </td>
                <td className="min-w-0 overflow-hidden py-2.5 pr-1 sm:pr-3">
                  <div className="flex min-w-0 items-center gap-1 sm:gap-1.5">
                    <FlagImage
                      countryCode={scorer.team.code}
                      alt={scorer.team.name}
                      width={16}
                      height={11}
                      className="rounded-[1px] shrink-0"
                    />
                    <span className="block min-w-0 truncate text-[11px] text-wc-text-primary sm:text-xs">
                      {scorer.team.name}
                    </span>
                  </div>
                </td>
                <td className="overflow-hidden py-2.5 pr-1 sm:pr-2">
                  <div className="flex items-center justify-end gap-1 sm:gap-2">
                    <div className="hidden md:block w-16 h-1 bg-wc-border-primary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-wc-accent-gold rounded-full"
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                    <span className="min-w-[14px] text-right text-xs font-medium text-wc-accent-gold sm:min-w-[16px] sm:text-[13px]">
                      {scorer.goals}
                    </span>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <Pagination
        currentPage={currentPage}
        totalPages={pagination.totalPages}
        totalItems={pagination.totalElements}
        pageSize={pagination.size}
        itemsLabel={t('labels.players').toLowerCase()}
        onPageChange={setCurrentPage}
      />
    </QueryStatus>
  );
}
