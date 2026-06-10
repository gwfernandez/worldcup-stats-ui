import { useState, useMemo } from 'react';
import type { Scorer } from '@/types/scorer.types';
import { ScorerModal } from '../shared/ScorerModal';
import { Pagination } from '@/components/shared/Pagination';
import { SearchInput, FilterSelect, FlagImage } from '@/components/shared';

const PAGE_SIZE = 10;

export interface ScorersTabProps {
  scorers: Scorer[];
}

/**
 * Solapa de goleadores.
 * Incluye filtros por nombre, selección y fase, tabla paginada y modal de detalle.
 */
export function ScorersTab({ scorers }: ScorersTabProps) {
  const [selectedScorer, setSelectedScorer] = useState<Scorer | null>(null);
  const [searchName, setSearchName] = useState('');
  const [filterTeam, setFilterTeam] = useState('');
  const [filterPhase, setFilterPhase] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const teamOptions = useMemo(() => {
    const teams = [
      ...new Map(scorers.map((s) => [s.teamCode, { code: s.teamCode, name: s.teamName }])).values(),
    ];
    return teams.sort((a, b) => a.name.localeCompare(b.name));
  }, [scorers]);

  const phaseOptions = useMemo(() => {
    const phases = new Set(scorers.flatMap((s) => s.goals.map((g) => g.phase)));
    return [...phases].sort();
  }, [scorers]);

  const maxGoals = useMemo(() => Math.max(...scorers.map((s) => s.totalGoals), 1), [scorers]);

  const filtered = useMemo(() => {
    return scorers.filter((s) => {
      const matchesName = s.playerName.toLowerCase().includes(searchName.toLowerCase());
      const matchesTeam = filterTeam === '' || s.teamCode === filterTeam;
      const matchesPhase = filterPhase === '' || s.goals.some((g) => g.phase === filterPhase);
      return matchesName && matchesTeam && matchesPhase;
    });
  }, [scorers, searchName, filterTeam, filterPhase]);

  const handleFilterChange =
    (setter: (v: string) => void) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setter(e.target.value);
      setCurrentPage(1);
    };

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const globalRankOf = (scorer: Scorer) => filtered.indexOf(scorer) + 1;

  return (
    <>
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
          value={filterPhase}
          onChange={handleFilterChange(setFilterPhase)}
          placeholderOption="Todas las fases"
          options={phaseOptions.map((p) => ({ value: p, label: p }))}
        />
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-[#2a2d3a]">
            <th className="text-left text-[11px] font-normal text-[#8a8fa8] pb-2 pl-2 w-8">#</th>
            <th className="text-left text-[11px] font-normal text-[#8a8fa8] pb-2">Jugador</th>
            <th className="text-left text-[11px] font-normal text-[#8a8fa8] pb-2">Selección</th>
            <th className="text-right text-[11px] font-normal text-[#8a8fa8] pb-2 pr-2">Goles</th>
            <th className="text-right text-[11px] font-normal text-[#8a8fa8] pb-2 pr-2">
              Promedio
            </th>
          </tr>
        </thead>
        <tbody>
          {paginated.length === 0 && (
            <tr>
              <td colSpan={5} className="py-8 text-center text-sm text-[#8a8fa8]">
                No se encontraron goleadores con esos filtros
              </td>
            </tr>
          )}
          {paginated.map((scorer) => {
            const rank = globalRankOf(scorer);
            const isTop3 = rank <= 3;
            const barWidth = Math.round((scorer.totalGoals / maxGoals) * 100);

            return (
              <tr
                key={scorer.id}
                onClick={() => setSelectedScorer(scorer)}
                className="border-t border-[#1e2233] cursor-pointer hover:bg-[#161925] transition-colors duration-150 group"
              >
                <td className="py-2.5 pl-2">
                  <span
                    className={`text-[11px] ${isTop3 ? 'text-[#e8c84a] font-medium' : 'text-[#8a8fa8]'}`}
                  >
                    {rank}
                  </span>
                </td>
                <td className="py-2.5 pr-3">
                  <span className="text-xs text-[#e8eaf0] group-hover:text-[#e8c84a] transition-colors">
                    {scorer.playerName}
                  </span>
                </td>
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
                <td className="py-2.5 pr-2 text-right">
                  <span className="text-xs text-[#8a8fa8]">{scorer.average.toFixed(2)}</span>
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
        itemsLabel="jugadores"
        onPageChange={setCurrentPage}
      />

      <ScorerModal scorer={selectedScorer} onClose={() => setSelectedScorer(null)} />
    </>
  );
}
