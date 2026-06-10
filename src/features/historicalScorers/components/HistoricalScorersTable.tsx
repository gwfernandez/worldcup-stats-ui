import { useState, useMemo } from 'react';
import type { HistoricalScorer } from '@/types/historicalScorer.types';
import { CONFEDERATION_STYLES } from '@/types/historicalStanding.types';
import { CONFEDERATION_TOOLTIP } from '@/types/team.types';
import { HistoricalScorerModal } from './HistoricalScorerModal';
import { SearchInput, FilterSelect, Tooltip, FlagImage, Pagination } from '@/components/shared';

const PAGE_SIZE = 10;

// ─── Props ────────────────────────────────────────────────────────────────────

export interface HistoricalScorersTableProps {
  scorers: HistoricalScorer[];
}

// ─── Componente ───────────────────────────────────────────────────────────────

/**
 * Tabla de goleadores históricos con filtros por nombre, selección y confederación.
 * Incluye paginado y modal de detalle por mundial al hacer click en una fila.
 */
export function HistoricalScorersTable({ scorers }: HistoricalScorersTableProps) {
  const [selectedScorer, setSelectedScorer] = useState<HistoricalScorer | null>(null);
  const [searchName, setSearchName] = useState('');
  const [filterTeam, setFilterTeam] = useState('');
  const [filterConf, setFilterConf] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const maxGoals = useMemo(() => Math.max(...scorers.map((s) => s.totalGoals), 1), [scorers]);

  const teamOptions = useMemo(
    () =>
      [
        ...new Map(
          scorers.map((s) => [s.teamCode, { code: s.teamCode, name: s.teamName }]),
        ).values(),
      ].sort((a, b) => a.name.localeCompare(b.name)),
    [scorers],
  );

  const confOptions = useMemo(
    () => [...new Set(scorers.map((s) => s.confederation))].sort(),
    [scorers],
  );

  const filtered = useMemo(() => {
    return scorers.filter((s) => {
      const matchesName = s.playerName.toLowerCase().includes(searchName.toLowerCase());
      const matchesTeam = filterTeam === '' || s.teamCode === filterTeam;
      const matchesConf = filterConf === '' || s.confederation === filterConf;
      return matchesName && matchesTeam && matchesConf;
    });
  }, [scorers, searchName, filterTeam, filterConf]);

  const handleFilterChange =
    (setter: (v: string) => void) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setter(e.target.value);
      setCurrentPage(1);
    };

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <>
      {/* ── Filtros ───────────────────────────────────────────── */}
      <div className="flex gap-2.5 mb-4">
        <SearchInput
          className="flex-[2]"
          placeholder="Buscar jugador..."
          value={searchName}
          onChange={handleFilterChange(setSearchName)}
        />
        <FilterSelect
          className="flex-1"
          value={filterTeam}
          onChange={handleFilterChange(setFilterTeam)}
          placeholderOption="Todas las selecciones"
          options={teamOptions.map((t) => ({ value: t.code, label: t.name }))}
        />
        <FilterSelect
          className="flex-1"
          value={filterConf}
          onChange={handleFilterChange(setFilterConf)}
          placeholderOption="Todas las confederaciones"
          options={confOptions.map((c) => ({ value: c, label: c }))}
        />
      </div>

      {/* ── Tabla ──────────────────────────────────────────────── */}
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-wc-border-primary">
            <th className="text-left text-[11px] font-normal text-wc-text-muted pb-2 w-8">#</th>
            <th className="text-left text-[11px] font-normal text-wc-text-muted pb-2">Jugador</th>
            <th className="text-left text-[11px] font-normal text-wc-text-muted pb-2">Selección</th>
            <th className="text-right text-[11px] font-normal text-wc-text-muted pb-2 pr-2">
              Goles
            </th>
            <th className="text-right text-[11px] font-normal text-wc-text-muted pb-2 pr-2">
              Promedio
            </th>
            <th className="text-right text-[11px] font-normal text-wc-text-muted pb-2">
              Confederación
            </th>
          </tr>
        </thead>
        <tbody>
          {paginated.length === 0 && (
            <tr>
              <td colSpan={6} className="py-8 text-center text-sm text-wc-text-muted">
                No se encontraron goleadores con esos filtros
              </td>
            </tr>
          )}
          {paginated.map((scorer, index) => {
            const rank = (currentPage - 1) * PAGE_SIZE + index + 1;
            const isTop3 = rank <= 3;
            const barWidth = Math.round((scorer.totalGoals / maxGoals) * 100);
            const confStyle = CONFEDERATION_STYLES[scorer.confederation];
            const confTip = CONFEDERATION_TOOLTIP[scorer.confederation] ?? '';

            return (
              <tr
                key={scorer.id}
                onClick={() => setSelectedScorer(scorer)}
                className="border-t border-wc-surface-secondary cursor-pointer hover:bg-wc-surface-primary transition-colors duration-150 group"
              >
                {/* Ranking */}
                <td className="py-2.5 pl-1">
                  <span
                    className={`text-[11px] ${isTop3 ? 'text-wc-accent-gold font-medium' : 'text-wc-text-muted'}`}
                  >
                    {rank}
                  </span>
                </td>

                {/* Jugador */}
                <td className="py-2.5 pr-3">
                  <span className="text-xs text-wc-text-primary group-hover:text-wc-accent-gold transition-colors">
                    {scorer.playerName}
                  </span>
                </td>

                {/* Selección */}
                <td className="py-2.5 pr-3">
                  <div className="flex items-center gap-1.5">
                    <FlagImage
                      countryCode={scorer.teamCode}
                      alt={scorer.teamName}
                      width={16}
                      height={11}
                      className="rounded-[1px] shrink-0"
                    />
                    <span className="text-xs text-wc-text-primary">{scorer.teamName}</span>
                  </div>
                </td>

                {/* Goles con barra */}
                <td className="py-2.5 pr-2">
                  <div className="flex items-center justify-end gap-2">
                    <div className="w-16 h-1 bg-wc-border-primary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-wc-accent-gold rounded-full"
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                    <span className="text-[13px] font-medium text-wc-accent-gold min-w-[16px] text-right">
                      {scorer.totalGoals}
                    </span>
                  </div>
                </td>

                {/* Promedio */}
                <td className="py-2.5 pr-2 text-right">
                  <span className="text-xs text-wc-text-muted">{scorer.average.toFixed(2)}</span>
                </td>

                {/* Confederación */}
                <td className="py-2.5 text-right">
                  <Tooltip content={confTip} groupName="conf" hideWhenEmpty>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full border ${confStyle?.pill ?? 'bg-wc-surface-secondary text-wc-text-muted border-wc-border-primary'}`}
                    >
                      {scorer.confederation}
                    </span>
                  </Tooltip>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* ── Paginado ───────────────────────────────────────────── */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filtered.length}
        pageSize={PAGE_SIZE}
        itemsLabel="jugadores"
        onPageChange={setCurrentPage}
      />

      {/* Modal */}
      <HistoricalScorerModal scorer={selectedScorer} onClose={() => setSelectedScorer(null)} />
    </>
  );
}
