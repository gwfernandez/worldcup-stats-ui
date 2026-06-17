import { useState, useMemo } from 'react';
import { Trophy } from 'lucide-react';
import type { Champion } from '@/types/champion.types';
import { CONFEDERATION_STYLES } from '@/types/historicalStanding.types';
import { CONFEDERATION_TOOLTIP } from '@/types/team.types';
import { ChampionshipsModal } from './ChampionshipsModal';
import { SearchInput, FilterSelect, Tooltip, FlagImage } from '@/components/shared';
import { useTranslation } from 'react-i18next';

// ─── Props ────────────────────────────────────────────────────────────────────

export interface ChampionsTableProps {
  champions: Champion[];
}

// ─── Componente ───────────────────────────────────────────────────────────────

/**
 * Tabla de campeones históricos sin paginado.
 * Filtros por nombre y confederación.
 * Borde lateral por confederación, trofeos visuales y modal de detalle.
 */
export function ChampionsTable({ champions }: ChampionsTableProps) {
  const { t } = useTranslation('common');
  const [selectedTeam, setSelectedTeam] = useState<Champion | null>(null);
  const [searchName, setSearchName] = useState('');
  const [filterConf, setFilterConf] = useState('');

  const confOptions = useMemo(
    () => [...new Set(champions.map((c) => c.confederationCode))].sort(),
    [champions],
  );

  const filtered = useMemo(
    () =>
      champions.filter((c) => {
        const matchesName = c.team.name.toLowerCase().includes(searchName.toLowerCase());
        const matchesConf = filterConf === '' || c.confederationCode === filterConf;
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
          placeholder={t('search.team')}
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />
        <FilterSelect
          className="flex-1"
          value={filterConf}
          onChange={(e) => setFilterConf(e.target.value)}
          placeholderOption={t('filters.allConfederations')}
          options={confOptions.map((c) => ({ value: c, label: c }))}
        />
      </div>

      {/* ── Tabla ──────────────────────────────────────────────── */}
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-wc-border-primary">
            <th className="text-left text-[11px] font-normal text-wc-text-muted pb-2 w-9">#</th>
            <th className="text-left text-[11px] font-normal text-wc-text-muted pb-2">
              {t('labels.team')}
            </th>
            <th className="text-left text-[11px] font-normal text-wc-text-muted pb-2">
              {t('labels.titles')} 🏆
            </th>
            <th className="text-left text-[11px] font-normal text-wc-text-muted pb-2">
              {t('labels.confederation')}
            </th>
            <th className="text-center text-[11px] font-normal text-wc-text-muted pb-2">
              {t('labels.detail')}
            </th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 && (
            <tr>
              <td colSpan={5} className="py-8 text-center text-sm text-wc-text-muted">
                {t('empty.teams')}
              </td>
            </tr>
          )}
          {filtered.map((team) => {
            const position = champions.indexOf(team) + 1;
            const confStyle = CONFEDERATION_STYLES[team.confederationCode];
            const confTooltip = CONFEDERATION_TOOLTIP[team.confederationCode] ?? '';
            const isTop3 = position <= 3;

            return (
              <tr
                key={team.team.code}
                className="border-t border-wc-surface-secondary hover:bg-wc-surface-primary transition-colors duration-150"
              >
                {/* Posición con borde lateral */}
                <td className="py-2.5 relative pl-3.5 pr-2">
                  <div
                    className="absolute left-0 top-0 bottom-0 w-[3px]"
                    style={{ backgroundColor: confStyle?.bar ?? 'var(--wc-surface-tertiary)' }}
                    aria-hidden="true"
                  />
                  <span
                    className={`text-[11px] ${isTop3 ? 'text-wc-accent-gold font-medium' : 'text-wc-text-muted'}`}
                  >
                    {position}
                  </span>
                </td>

                {/* Selección */}
                <td className="py-2.5 pr-3">
                  <div className="flex items-center gap-2">
                    <FlagImage countryCode={team.team.code} alt={team.team.name} />
                    <span className="text-xs text-wc-text-primary">{team.team.name}</span>
                  </div>
                </td>

                {/* Títulos con trofeos */}
                <td className="py-2.5 pr-3">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-0.5 flex-wrap">
                      {Array.from({ length: team.wins }).map((_, i) => (
                        <span key={i} className="text-sm leading-none" aria-hidden="true">
                          🏆
                        </span>
                      ))}
                    </div>
                    <span className="text-lg font-medium text-wc-accent-gold">{team.wins}</span>
                  </div>
                </td>

                {/* Confederación */}
                <td className="py-2.5 pr-3">
                  <Tooltip content={confTooltip} groupName="conf" hideWhenEmpty>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full border ${confStyle?.pill ?? 'bg-wc-surface-secondary text-wc-text-muted border-wc-border-primary'}`}
                    >
                      {team.confederationCode}
                    </span>
                  </Tooltip>
                </td>

                {/* Acción */}
                <td className="py-2.5 text-center">
                  <Tooltip content={t('actions.viewTitles')} groupName="action">
                    <button
                      onClick={() => setSelectedTeam(team)}
                      className="flex items-center justify-center w-7 h-7 border border-wc-border-primary rounded-md text-wc-text-muted hover:border-wc-accent-gold hover:text-wc-accent-gold transition-colors focus:outline-none"
                      aria-label={t('actions.viewTitlesFor', { team: team.team.name })}
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
