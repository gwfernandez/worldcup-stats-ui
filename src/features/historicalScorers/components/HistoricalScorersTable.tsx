import { useState, useMemo } from 'react';
import type { HistoricalScorer } from '@/types/historicalScorer.types';
import { CONFEDERATION_STYLES, CONFEDERATION_TOOLTIP } from '@/types/historicalStanding.types';
import { HistoricalScorerModal } from '@/features/historicalScorers/components/HistoricalScorerModal';
import { SearchInput, FilterSelect, Tooltip, FlagImage } from '@/components/shared';

const PAGE_SIZE = 10;

// ─── Subcomponente: paginado ──────────────────────────────────────────────────

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const from = (currentPage - 1) * pageSize + 1;
  const to = Math.min(currentPage * pageSize, totalItems);

  const getRange = (): (number | '...')[] => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 3) return [1, 2, 3, 4, '...', totalPages];
    if (currentPage >= totalPages - 2)
      return [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
  };

  return (
    <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#2a2d3a]">
      <span className="text-[11px] text-[#8a8fa8]">
        {from}–{to} de {totalItems} jugadores
      </span>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="w-7 h-7 flex items-center justify-center rounded-md border border-[#2a2d3a] text-[#8a8fa8] hover:border-[#e8c84a] hover:text-[#e8c84a] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-[#2a2d3a] disabled:hover:text-[#8a8fa8] transition-colors focus:outline-none"
          aria-label="Página anterior"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        {getRange().map((page, i) =>
          page === '...' ? (
            <span
              key={`ellipsis-${i}`}
              className="w-7 h-7 flex items-center justify-center text-[11px] text-[#8a8fa8]"
            >
              …
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page as number)}
              className={`w-7 h-7 rounded-md border text-[11px] transition-colors focus:outline-none ${
                currentPage === page
                  ? 'bg-[#1e2a14] border-[#3a5a1a] text-[#8fc44a] font-medium'
                  : 'border-[#2a2d3a] text-[#8a8fa8] hover:border-[#e8c84a] hover:text-[#e8c84a]'
              }`}
              aria-label={`Página ${page}`}
              aria-current={currentPage === page ? 'page' : undefined}
            >
              {page}
            </button>
          ),
        )}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="w-7 h-7 flex items-center justify-center rounded-md border border-[#2a2d3a] text-[#8a8fa8] hover:border-[#e8c84a] hover:text-[#e8c84a] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-[#2a2d3a] disabled:hover:text-[#8a8fa8] transition-colors focus:outline-none"
          aria-label="Página siguiente"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </div>
  );
}

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
          <tr className="border-b border-[#2a2d3a]">
            <th className="text-left text-[11px] font-normal text-[#8a8fa8] pb-2 w-8">#</th>
            <th className="text-left text-[11px] font-normal text-[#8a8fa8] pb-2">Jugador</th>
            <th className="text-left text-[11px] font-normal text-[#8a8fa8] pb-2">Selección</th>
            <th className="text-right text-[11px] font-normal text-[#8a8fa8] pb-2 pr-2">Goles</th>
            <th className="text-right text-[11px] font-normal text-[#8a8fa8] pb-2 pr-2">
              Promedio
            </th>
            <th className="text-right text-[11px] font-normal text-[#8a8fa8] pb-2">
              Confederación
            </th>
          </tr>
        </thead>
        <tbody>
          {paginated.length === 0 && (
            <tr>
              <td colSpan={6} className="py-8 text-center text-sm text-[#8a8fa8]">
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
                className="border-t border-[#1e2233] cursor-pointer hover:bg-[#161925] transition-colors duration-150 group"
              >
                {/* Ranking */}
                <td className="py-2.5 pl-1">
                  <span
                    className={`text-[11px] ${isTop3 ? 'text-[#e8c84a] font-medium' : 'text-[#8a8fa8]'}`}
                  >
                    {rank}
                  </span>
                </td>

                {/* Jugador */}
                <td className="py-2.5 pr-3">
                  <span className="text-xs text-[#e8eaf0] group-hover:text-[#e8c84a] transition-colors">
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
                    <span className="text-xs text-[#e8eaf0]">{scorer.teamName}</span>
                  </div>
                </td>

                {/* Goles con barra */}
                <td className="py-2.5 pr-2">
                  <div className="flex items-center justify-end gap-2">
                    <div className="w-16 h-1 bg-[#2a2d3a] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#e8c84a] rounded-full"
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                    <span className="text-[13px] font-medium text-[#e8c84a] min-w-[16px] text-right">
                      {scorer.totalGoals}
                    </span>
                  </div>
                </td>

                {/* Promedio */}
                <td className="py-2.5 pr-2 text-right">
                  <span className="text-xs text-[#8a8fa8]">{scorer.average.toFixed(2)}</span>
                </td>

                {/* Confederación */}
                <td className="py-2.5 text-right">
                  <Tooltip content={confTip} groupName="conf" hideWhenEmpty>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full border ${confStyle?.pill ?? 'bg-[#1e2233] text-[#8a8fa8] border-[#2a2d3a]'}`}
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
        onPageChange={setCurrentPage}
      />

      {/* Modal */}
      <HistoricalScorerModal scorer={selectedScorer} onClose={() => setSelectedScorer(null)} />
    </>
  );
}
