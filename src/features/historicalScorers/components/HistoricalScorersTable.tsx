import { useMemo, useState, type ChangeEvent } from 'react';
import type { HistoricalScorer, HistoricalScorerPagination } from '@/types/historicalScorer.types';
import type { NationalTeam } from '@/types/team.types';
import { CONFEDERATION_STYLES } from '@/types/historicalStanding.types';
import { CONFEDERATION_TOOLTIP } from '@/types/team.types';
import { HistoricalScorerModal } from './HistoricalScorerModal';
import { SearchInput, FilterSelect, Tooltip, FlagImage, Pagination } from '@/components/shared';
import { useTranslation } from 'react-i18next';
import { useUIStore } from '@/store/ui.store';

export interface HistoricalScorersTableProps {
  scorers: HistoricalScorer[];
  pagination: HistoricalScorerPagination;
  teams: NationalTeam[];
  currentPage: number;
  onPageChange: (page: number) => void;
}

export function HistoricalScorersTable({
  scorers,
  pagination,
  teams,
  currentPage,
  onPageChange,
}: HistoricalScorersTableProps) {
  const { t } = useTranslation('common');
  const [selectedScorer, setSelectedScorer] = useState<HistoricalScorer | null>(null);
  const filters = useUIStore((state) => state.filters.historicalScorers);
  const setFilter = useUIStore((state) => state.setFilter);
  const searchName = filters?.name ?? '';
  const filterTeam = filters?.team ?? '';
  const filterConfederation = filters?.confederation ?? '';

  const maxGoals = useMemo(() => Math.max(...scorers.map((scorer) => scorer.goals), 1), [scorers]);

  const teamOptions = useMemo(
    () =>
      [...teams]
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((team) => ({ value: team.code, label: team.name })),
    [teams],
  );

  const confederationOptions = useMemo(
    () => [...new Set(teams.map((team) => team.confederationCode))].sort(),
    [teams],
  );

  const handleFilterChange =
    (key: string) => (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setFilter('historicalScorers', key, event.target.value);
      onPageChange(1);
    };

  return (
    <>
      <div
        className="mb-4 grid min-w-0 grid-cols-1 gap-1.5 min-[320px]:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)_minmax(0,1fr)] sm:gap-2.5"
        data-testid="historical-scorers-filters"
      >
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
        <FilterSelect
          className="min-w-0"
          value={filterConfederation}
          onChange={handleFilterChange('confederation')}
          placeholderOption={t('filters.allConfederations')}
          options={confederationOptions.map((code) => ({ value: code, label: code }))}
        />
      </div>

      <table className="w-full table-fixed border-collapse">
        <colgroup>
          <col className="w-[7%]" />
          <col className="w-[31%]" />
          <col className="w-[27%]" />
          <col className="w-[12%]" />
          <col className="w-[23%]" />
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
            <th className="truncate pb-2 text-right text-[10px] font-normal text-wc-text-muted sm:text-[11px]">
              {t('labels.confederation')}
            </th>
          </tr>
        </thead>
        <tbody>
          {scorers.length === 0 && (
            <tr>
              <td colSpan={5} className="py-8 text-center text-sm text-wc-text-muted">
                {t('empty.scorers')}
              </td>
            </tr>
          )}
          {scorers.map((scorer, index) => {
            const rank = (currentPage - 1) * pagination.size + index + 1;
            const isTop3 = rank <= 3;
            const barWidth = Math.round((scorer.goals / maxGoals) * 100);
            const confStyle = CONFEDERATION_STYLES[scorer.confederationCode];
            const confTip = CONFEDERATION_TOOLTIP[scorer.confederationCode] ?? '';

            return (
              <tr
                key={scorer.playerId}
                onClick={() => setSelectedScorer(scorer)}
                className="border-t border-wc-surface-secondary cursor-pointer hover:bg-wc-surface-primary transition-colors duration-150 group"
              >
                <td className="overflow-hidden py-2.5 pl-0.5 sm:pl-1">
                  <span
                    className={`text-[11px] ${isTop3 ? 'text-wc-accent-gold font-medium' : 'text-wc-text-muted'}`}
                  >
                    {rank}
                  </span>
                </td>
                <td className="min-w-0 overflow-hidden py-2.5 pr-1 sm:pr-3">
                  <span className="block truncate text-[11px] text-wc-text-primary transition-colors group-hover:text-wc-accent-gold sm:text-xs">
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
                <td className="overflow-hidden py-2.5 text-right">
                  <Tooltip content={confTip} groupName="conf" align="end" hideWhenEmpty>
                    <span
                      className={`inline-block max-w-full truncate rounded-full border px-1 py-0.5 align-middle text-[9px] sm:px-2 sm:text-[10px] ${confStyle?.pill ?? 'bg-wc-surface-secondary text-wc-text-muted border-wc-border-primary'}`}
                    >
                      {scorer.confederationCode}
                    </span>
                  </Tooltip>
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
        onPageChange={onPageChange}
      />

      {selectedScorer && (
        <HistoricalScorerModal
          selectedScorer={selectedScorer}
          onClose={() => setSelectedScorer(null)}
        />
      )}
    </>
  );
}
